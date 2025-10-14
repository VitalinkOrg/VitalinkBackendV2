import GenericController from "@TenshiJS/generics/Controller/GenericController";
import GenericRepository from "@TenshiJS/generics/Repository/GenericRepository";
import { RequestHandler } from "@TenshiJS/generics";
import { PaymentAttempt } from "@index/entity/PaymentAttempt";
import { User } from "@TenshiJS/entity/User";
import { Appointment } from "@index/entity/Appointment";
import PaymentAttemptDTO from "../dtos/PaymentAttemptDTO";
import { CybersourceService } from "../services/CybersourceService";
import { config } from "@index/index";
import crypto from "node:crypto";
import { buildStringToSign, hmacBase64, makeCurl, mask } from "@index/utils/GeneralUtils";
import { UnitDynamicCentral } from "@TenshiJS/entity/UnitDynamicCentral";


/**
 * PaymentController - Cybersource Secure Acceptance Integration
 * 
 * This controller handles the complete payment flow:
 * 1. /payment/go - Generates signed payment form and redirects to Cybersource
 * 2. /payment/notify - Webhook endpoint for server-to-server notifications
 * 3. /payment/receipt - Customer return URL after payment completion
 * 4. /payment/status - Query payment status by reference
 * 
 * The payment flow works as follows:
 * 1. User initiates payment via /payment/go with amount, currency, userId
 * 2. System creates PaymentAttempt record with status "created"
 * 3. System generates signed form fields using user data from User entity
 * 4. User is redirected to Cybersource hosted payment page
 * 5. After payment, Cybersource sends webhook to /payment/notify (server-to-server)
 * 6. User browser is redirected to /payment/receipt with payment result
 * 7. Frontend can query /payment/status to get final payment status
 */

function escapeHtml(s: any) {
  return String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[m] as string));
}

export default class PaymentController extends GenericController {
  private paymentRepo = new GenericRepository(PaymentAttempt);
  private userRepo = new GenericRepository(User);
  private appointmentRepo = new GenericRepository(Appointment);
  private dtoFactory = (req: any) => new PaymentAttemptDTO(req);

  constructor() {
    super(PaymentAttempt);

  }


  /**
   * GET /payment/go - Initiate payment process
   * Creates PaymentAttempt record and generates signed form for Cybersource
   * 
   * Query parameters:
   * - userId: ID of the user making the payment (required)
   * - amount: Payment amount (required)
   * - currency: Payment currency (optional, defaults to CRC)
   * - appointmentId: Associated appointment ID (optional)
   * - mode: "redirect" or "embedded" (optional, defaults to redirect)
   */
  async go(reqHandler: RequestHandler): Promise<{status?: number; contentType?: string; body: any}> {
    try {

      const cybersourceService = new CybersourceService();

      // Debug configuration loading
      /*console.log("=== CYBERSOURCE CONFIG DEBUG ===");
      console.log("ENV:", config.CYBERSOURCE.ENV);
      console.log("Profile ID:", config.CYBERSOURCE.PROFILE_ID);
      console.log("Access Key:", config.CYBERSOURCE.ACCESS_KEY);
      console.log("Secret Key:", config.CYBERSOURCE.SECRET_KEY);
      console.log("Redirect URL:", "https://testsecureacceptance.cybersource.com/pay");
      console.log("Embedded URL:", "https://testsecureacceptance.cybersource.com/embedded/pay");
      console.log("Default Currency:", config.CYBERSOURCE.DEFAULT_CURRENCY);
      console.log("Default Country:", config.CYBERSOURCE.DEFAULT_COUNTRY);
      console.log("Default Province:", config.CYBERSOURCE.DEFAULT_PROVINCE);
      console.log("Receipt URL:", config.CYBERSOURCE.RECEIPT_URL);
      console.log("MDD5 Channel:", config.CYBERSOURCE.MDD5_CHANNEL);
      console.log("Merchant Name:", config.CYBERSOURCE.MERCHANT_NAME);
      console.log("Payment Method:", config.CYBERSOURCE.PAYMENT_METHOD);
      console.log("Transaction Type:", config.CYBERSOURCE.TRANSACTION_TYPE);
      console.log("Locale:", config.CYBERSOURCE.LOCALE);*/

      const req: any = (reqHandler as any).getRequest ? (reqHandler as any).getRequest() : (reqHandler as any).req;
      
      // Extract parameters from query string
      const userId = String(req.query.userId || "");
      const appointmentId = req.query.appointmentId ? Number(req.query.appointmentId) : undefined;
      const amount = String(req.query.amount || "");
   
      // Validate and fetch user from database using User entity data
      const user = await this.userRepo.findById(userId, true);
      if (!user) {
          return {
            status: 404,
            contentType: "application/json",
            body: {
              status: { id: 0, message: "Not Found", http_code: 404 },
              data: null,
              info: "User not found"
            }
          };
      }

      if (!amount) {
        return {
          status: 400,
          contentType: "application/json",
          body: {
            status: { id: 0, message: "Bad Request", http_code: 400 },
            data: null,
            info: "amount not found"
          }
        };
      }

      // Validate appointment if provided
      let appointment: Appointment | null = null;
      if (appointmentId) {
        appointment = await this.appointmentRepo.findById(appointmentId, true);
        if (!appointment) {
          return {
            status: 404,
            contentType: "application/json",
            body: {
              status: { id: 0, message: "Not Found", http_code: 404 },
              data: null,
              info: "Appointment not found"
            }
          };
        }
      }

      // Generate unique reference for this payment attempt
      const reference = "REF-" + Date.now();
      // Extract client IP for risk management
      let ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
                 req.socket?.remoteAddress ||
                 "127.0.0.1";

      if (ip === "::1" || ip === "0:0:0:0:0:0:0:1") ip = "127.0.0.1";

      // Create PaymentAttempt record with initial status
      const attempt = new PaymentAttempt();
      attempt.user = user;
      attempt.appointment = appointment;
      attempt.reference = reference;
      attempt.amount = Number(amount);
      attempt.currency = config.CYBERSOURCE.DEFAULT_CURRENCY;
      attempt.environment = config.CYBERSOURCE.ENV;
      attempt.mode = config.CYBERSOURCE.MODE === "embedded" ? "embedded" : "redirect";
      attempt.status = "created";
      attempt.customer_ip_address = ip;
      attempt.mdd5_channel = config.CYBERSOURCE.MDD5_CHANNEL;
      attempt.mdd6_merchant_name = config.CYBERSOURCE.MERCHANT_NAME;

      // Initialize nullable fields
      attempt.decision = null;
      attempt.reason_code = null;
      attempt.transaction_id = null;
      attempt.request_token = null;
      attempt.card_scheme = null;
      attempt.card_type_code = null;
      attempt.card_last4 = null;
      attempt.device_fingerprint_id = null;
      attempt.payer_auth_tx = null;
      attempt.signed_ok_notify = false;
      attempt.signed_ok_receipt = false;
      attempt.webhook_received_at = null;
      attempt.receipt_received_at = null;
      attempt.raw_notify = null;
      attempt.raw_receipt = null;

      await this.paymentRepo.add(attempt);

      const { fields, endpoint } = cybersourceService.buildSignedRequest(user, reference, appointment, amount, ip);
      // ====== AUDITORÍA SALIENTE ======
      /*const f = fields as Record<string, string>;
      const signedFields = f["signed_field_names"];
      const stringToSign = buildStringToSign(f, signedFields);
      const signatureRecalc = hmacBase64(stringToSign, config.CYBERSOURCE.SECRET_KEY);

      const currency = config.CYBERSOURCE.DEFAULT_CURRENCY;

      let lastOutbound = {
        timestamp: new Date().toISOString(),
        env: config.CYBERSOURCE.ENV,
        mode: config.CYBERSOURCE.MODE,
        endpoint: endpoint,
        merchant: {
          profile_id: mask(config.CYBERSOURCE.PROFILE_ID),
          access_key: mask(config.CYBERSOURCE.ACCESS_KEY),
          secret_key: mask(config.CYBERSOURCE.SECRET_KEY)
        },
        order: { reference, amount, currency },
        signed_field_names: signedFields,
        string_to_sign: stringToSign,
        signature: f["signature"],
        signature_recalc: signatureRecalc,
        fields: f
      };
      // Log outbound request for debugging (mask sensitive data)
      console.log("=== CYBS OUTBOUND ===\n", JSON.stringify(lastOutbound, null, 2));
      console.log("=== CYBS OUTBOUND cURL ===\n" + makeCurl(endpoint, f) + "\n");*/



      // Generate HTML form that auto-posts to Cybersource
      const html = cybersourceService.generatePaymentForm(fields, endpoint);
      return { contentType: "text/html", body: html };

    } catch (error: any) {
      //console.error("Payment initiation error:", error);
       return {
            status: 500,
            contentType: "application/json",
            body: {
              status: { id: 0, message: "Internal Server Error", http_code: 500 },
              data: null,
              info: "Internal server error"
            }
          };
    }
  }

    /**
     * POST /payment/notify
     * Webhook S2S de Cybersource (Secure Acceptance)
     * - Debe ser POST x-www-form-urlencoded.
     * - Responder 200 "OK" si todo bien (Cybersource solo necesita el status code).
     * - NO cambiar la lógica final del front aquí (eso lo consulta vía /payment/status).
     */
   // Reemplaza todo tu método notify por este
async notify(reqHandler: RequestHandler): Promise<{ status?: number; contentType?: string; body: any }> {
  try {
    const req: any = reqHandler.getRequest();

    // 1) Solo POST
    if (req.method !== "POST") {
      return {
        status: 405,
        contentType: "application/json",
        body: {
          status: { id: 0, message: "Method Not Allowed", http_code: 405 },
          data: null,
          info: "Method Not Allowed"
        }
      };
    }

    // 2) Cargar payload de forma robusta (por si no está montado urlencoded)
    const readRaw = (request: any) =>
      new Promise<string>((resolve) => {
        let raw = "";
        request.on("data", (ch: Buffer) => (raw += ch.toString("utf8")));
        request.on("end", () => resolve(raw));
        request.on("error", () => resolve(raw));
      });

    const contentType = String(req.headers["content-type"] || "");
    let payload: any = (req.body && Object.keys(req.body).length > 0) ? req.body : undefined;

    if (!payload) {
      const rawBody = await readRaw(req);
      if (contentType.includes("application/x-www-form-urlencoded") || contentType.includes("text/")) {
        payload = Object.fromEntries(new URLSearchParams(rawBody || ""));
      } else if (contentType.includes("application/json")) {
        try { payload = rawBody ? JSON.parse(rawBody) : {}; } catch { payload = {}; }
      } else {
        // Default a form-urlencoded
        payload = Object.fromEntries(new URLSearchParams(rawBody || ""));
      }
    }

    // 3) Verificar firma (Secure Acceptance por body: signed_field_names + signature)
    const service = new CybersourceService();
    const sig = service.verifyResponseSignature(payload);
    if (!sig.ok) {
      console.warn("[CYBS][SOP] Invalid body signature", {
        signed_fields: sig.signedFields, given: sig.given, calc: sig.calc
      });
      return { status: 400, contentType: "text/plain", body: "Invalid signature" };
    }

    // 4) Extraer campos relevantes (mantiene tu mapeo; alias por compatibilidad)
    const b: any = payload;

    const reference = String(
      b.req_reference_number || b.reference_number || ""
    );
    if (!reference) {
      return {
        status: 400,
        contentType: "application/json",
        body: {
          status: { id: 0, message: "Missing reference number", http_code: 400 },
          data: null,
          info: "Missing reference number"
        }
      };
    }

    const decision        = String(b.decision || "");                   // ACCEPT | REJECT | ERROR | REVIEW
    const reasonCode      = String(b.reason_code || "");
    const txId            = String(b.transaction_id || "");
    const requestToken    = String(b.request_token || "");
    const cardSchemeName  = String(b.card_type_name || "");             // Visa/Mastercard/Amex
    const cardTypeCode    = String(b.req_card_type || "");              // 001/002/003
    const maskedCard      = String(b.req_card_number || "");            // **** **** **** 1111
    const deviceFp        = String(b.req_device_fingerprint_id || "");
    const payerAuthTx     = String(b.payer_authentication_transaction_id || "");
    const reqAmount       = String(b.req_amount || "");
    const reqCurrency     = String(b.req_currency || "");

    const mappedStatus: PaymentAttempt["status"] =
      decision === "ACCEPT" ? "accepted" :
      decision === "REJECT" ? "declined" :
      decision === "ERROR"  ? "error"    : "pending";

    // 5) Idempotencia
    const attempt = await this.paymentRepo.findByOptions(true, true, { where: { reference } });
    if (!attempt) {
      return {
        status: 200,
        contentType: "application/json",
        body: {
          status: { id: 0, message: "Doesn't exist payment attempt", http_code: 200 },
          data: null,
          info: "Doesn't exist payment attempt"
        }
      };
    }

    // 6) Actualizar intento
    const now = new Date();
    attempt.status                 = mappedStatus;
    attempt.decision               = decision || attempt.decision;
    attempt.reason_code            = reasonCode || attempt.reason_code;
    attempt.transaction_id         = txId || attempt.transaction_id;
    attempt.request_token          = requestToken || attempt.request_token;
    attempt.card_scheme            = cardSchemeName || attempt.card_scheme;
    attempt.card_type_code         = cardTypeCode || attempt.card_type_code;
    attempt.card_last4             = (new CybersourceService()).extractLast4(maskedCard) || attempt.card_last4;
    attempt.device_fingerprint_id  = deviceFp || attempt.device_fingerprint_id;
    attempt.payer_auth_tx          = payerAuthTx || attempt.payer_auth_tx;

    if (!attempt.amount && reqAmount)   attempt.amount   = Number(reqAmount);
    if (!attempt.currency && reqCurrency) attempt.currency = reqCurrency;

    attempt.signed_ok_notify   = true;           // firma validada por body
    attempt.raw_notify         = b;
    attempt.webhook_received_at= now;
    attempt.updated_date       = now;

    await this.paymentRepo.add(attempt);

    // 7) Responder OK a Cybersource
    console.log("[CYBS][WEBHOOK] ref=%s status=%s decision=%s reason=%s tx=%s",
      reference, mappedStatus, decision, reasonCode, txId);

    return {
      status: 200,
      contentType: "application/json",
      body: {
        status: { id: 0, message: "Sucess", http_code: 200 },
        data: null,
        info: "Sucess update payment attempt"
      }
    };

  } catch (err: any) {
    console.error("[CYBS][WEBHOOK] Error:", err);
    // 5xx hará que Cybersource reintente
    return { status: 500, contentType: "text/plain", body: "Internal server error" };
  }
}



    // routes: app.all("/payment/receipt-bridge", controller.receiptBridge)
    async receiptBridge(reqHandler: RequestHandler) {
      const service = new CybersourceService();
      const payload =  reqHandler.getRequest().method === "GET" ? reqHandler.getRequest().query : reqHandler.getRequest().body;

      // 1) Verificar firma en backend
      const sig = service.verifyResponseSignature(payload);

      // 2) Extraer datos básicos
      const reference = String(payload.req_reference_number || "");
      const decision  = String(payload.decision || "");  // solo hint
      const canceled  = payload.canceled === "1";

      // 3) Auditoría mínima (no cambias estado final aquí, salvo cancelado)
      try {
        if (reference) {
          const attempt = await this.paymentRepo.findByOptions(true, true, { where: { reference: reference} });
          if (attempt) {
            const now = new Date();
            attempt.signed_ok_receipt = sig.ok;
            attempt.raw_receipt = payload;
            attempt.receipt_received_at = now;
            attempt.updated_date = now;

            if (canceled && attempt.status === "created") {
              attempt.status = "declined"; // cancelación del usuario sí puedes consolidarla aquí
            }
            await this.paymentRepo.add(attempt);
          }
        }
      } catch {
        return {
                status: 400,
                contentType: "application/json",
                body: {
                  status: { id: 0, message: "Database Error", http_code: 400 },
                  data: null,
                  info: "Error updating payment attempt"
                }
              };
      }

      // 4) Redirigir al SPA (no exponer claves)
      const q = new URLSearchParams({
        reference,
        sig: sig.ok ? "1" : "0",
        hint: decision || "",
        canceled: canceled ? "1" : "0"
      }).toString();

      const urlRedirect = `${config.CYBERSOURCE.RECEIPT_URL_FRONTEND}?${q}`;
      return reqHandler.getResponse().redirect(303, urlRedirect);
    }


  // routes: app.get("/payment/status", controller.status)
async status(reqHandler: RequestHandler): Promise<{ status?: number; contentType?: string; body: any }> {
  try {
    const req: any = (reqHandler as any).getRequest ? (reqHandler as any).getRequest() : (reqHandler as any).req;

    // Aceptamos SOLO GET
    if (req.method !== "GET") {
      return {
        status: 405,
        contentType: "application/json",
        body: {
          status: { id: 0, message: "Method Not Allowed", http_code: 405 },
          data: null,
          info: "Method Not Allowed"
        }
      };
    }

    // Parámetro requerido
    const reference = String(req.query.reference || req.query.ref || "");
    if (!reference) {
      return {
        status: 400,
        contentType: "application/json",
        body: {
          status: { id: 0, message: "Bad Request", http_code: 400 },
          data: null,
          info: "Missing reference parameter"
        }
      };
    }

    // Buscar PaymentAttempt por referencia
    const attempt = await this.paymentRepo.findByOptions(true, true, { where: { reference } as any });
    if (!attempt) {
      return {
        status: 404,
        contentType: "application/json",
        body: {
          status: { id: 0, message: "Not Found", http_code: 404 },
          data: null,
          info: "Payment attempt not found"
        }
      };
    }

    // Mapear al response usando tu DTO
    const dto = this.dtoFactory(req);
    const data = dto.entityToResponse(attempt);

    // Éxito
    return {
      status: 200,
      contentType: "application/json",
      body: {
        status: { id: 1, message: "Success", http_code: 200 },
        data,
        info: "Payment attempt status"
      }
    };

  } catch (error: any) {
    console.error("Status query error:", error);
    return {
      status: 500,
      contentType: "application/json",
      body: {
        status: { id: 0, message: "Internal Server Error", http_code: 500 },
        data: null,
        info: "Internal server error"
      }
    };
  }
}


}