import crypto from "node:crypto";
import { v4 as uuidv4 } from "uuid";
import { User } from "@TenshiJS/entity/User";
import { config } from "@index/index";
import { splitName } from "@index/utils/GeneralUtils";
import { last } from "lodash";
import { Appointment } from "@index/entity/Appointment";

/**
 * Cybersource Secure Acceptance Service
 * Handles payment form generation and signature verification
 */

export interface PaymentParams {
  amount: string;
  currency: string;
  reference: string;
  user: User;
  appointmentId?: number;
  ip?: string;
}

export class CybersourceService {

  constructor() {}

  /**
   * Generate ISO UTC timestamp for Cybersource
   */
  private isoUtc(): string {
    return new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
  }

  /**
   * Build string to sign from fields and signed field names
   */
  private buildStringToSign(fields: Record<string, string>, signedFieldNamesCSV: string): string {
    return signedFieldNamesCSV
      .split(",")
      .map(name => `${name}=${fields[name] ?? ""}`)
      .join(",");
  }

  /**
   * Generate HMAC SHA256 signature in base64
   */
  private hmacBase64(message: string, secretKey: string): string {
    return crypto.createHmac("sha256", secretKey)
      .update(message, "utf8")
      .digest("base64");
  }

  /**
   * Build signed payment request for Cybersource
   */
  buildSignedRequest(user: User, reference: string, appointment: Appointment | null, amount: string, ip?: string) {
      const { firstName, lastName } = splitName(user.name);
     
      // Use hardcoded values that match the working example for consistency
      const base: Record<string, string> = {
      access_key: config.CYBERSOURCE.ACCESS_KEY,
      profile_id: config.CYBERSOURCE.PROFILE_ID,
      transaction_uuid: uuidv4(),
      signed_date_time: this.isoUtc(),
      locale: config.CYBERSOURCE.LOCALE,
      
      // Transaction type - exactly as in working example
      transaction_type: config.CYBERSOURCE.TRANSACTION_TYPE,
      payment_method: config.CYBERSOURCE.PAYMENT_METHOD,
      
      reference_number: reference,
      amount: amount,
      currency: config.CYBERSOURCE.DEFAULT_CURRENCY,
      
      // Risk management fields
      customer_ip_address: ip || "127.0.0.1",
      merchant_defined_data5: config.CYBERSOURCE.MDD5_CHANNEL,
      merchant_defined_data6: config.CYBERSOURCE.MERCHANT_NAME,

      // Billing information from user
      bill_to_forename: firstName,
      bill_to_surname: lastName,
      bill_to_email: user.email,
      bill_to_phone: user.phone_number || "50688888888",
      bill_to_address_line1: user.address || "Calle 1",
      bill_to_address_city: user.province || "San José",
      bill_to_address_state: config.CYBERSOURCE.DEFAULT_PROVINCE || "SJ",
      bill_to_address_postal_code: user.postal_code || "10101",
      bill_to_address_country: config.CYBERSOURCE.DEFAULT_COUNTRY,
      
      // Shipping information (same as billing)
      ship_to_address_line1: user.address || "Calle 1",
      ship_to_address_city: user.province || "San José",
      ship_to_address_state: config.CYBERSOURCE.DEFAULT_PROVINCE || "SJ",
      ship_to_address_postal_code: user.postal_code || "10101",
      ship_to_address_country: config.CYBERSOURCE.DEFAULT_COUNTRY,
      ship_to_surname: lastName,
      ship_to_phone: user.phone_number || "50688888888",

      // Line items
      line_item_count: "1",
      item_0_code: "default",
      item_0_name: "Pedido",
      item_0_quantity: "1",
      item_0_unit_price: amount,
      
      // Response URLs
      override_custom_receipt_page: config.CYBERSOURCE.RECEIPT_BRIDGE_BACKEND,
      override_custom_cancel_page: `${config.CYBERSOURCE.RECEIPT_BRIDGE_BACKEND}?canceled=1`
    };

    // Create signed field names list - EXACTLY like working example
    const fieldNames = Object.keys(base).sort();
    const signed_field_names = ["signed_field_names", "unsigned_field_names", ...fieldNames].join(",");

    // Final fields to sign
    const toSignFields: Record<string, string> = {
      ...base,
      signed_field_names,
      unsigned_field_names: ""
    };

    // Generate signature
    const stringToSign = this.buildStringToSign(toSignFields, signed_field_names);
    const signature = this.hmacBase64(stringToSign, config.CYBERSOURCE.SECRET_KEY);

    // Determine endpoint based on mode
    const endpoint = config.CYBERSOURCE.MODE === "embedded" ? 
      "https://testsecureacceptance.cybersource.com/embedded/pay" : 
      "https://testsecureacceptance.cybersource.com/pay";

    return {
      fields: {
        ...toSignFields,
        signature
      },
      endpoint
    };
  }

  /**
   * Verify response signature from Cybersource
   */
  verifyResponseSignature(
    body: Record<string, string | string[]>,
    secretKey?: string
  ): { ok: boolean; calc: string; given: string; signedFields: string } {
    const key = secretKey ||  config.CYBERSOURCE.SECRET_KEY;
    
    // Flatten array values to strings
    const flat: Record<string, string> = {};
    for (const [k, v] of Object.entries(body)) {
      flat[k] = Array.isArray(v) ? v[0] : (v ?? "");
    }
    
    const signedFields = flat["signed_field_names"] || flat["signed_fields"] || "";
    const toSign = this.buildStringToSign(flat, signedFields);
    const calc = this.hmacBase64(toSign, key);
    const given = flat["signature"] || "";
    
    return { ok: calc === given, calc, given, signedFields };
  }

  /**
   * Generate HTML form for auto-posting to Cybersource
   */
  generatePaymentForm(fields: Record<string, string>, endpoint: string): string {
    let html = `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>Procesando pago...</title>
  <style>
    body { font-family: system-ui, sans-serif; padding: 24px; text-align: center; }
    .spinner { border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%; width: 40px; height: 40px; animation: spin 2s linear infinite; margin: 20px auto; }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  </style>
</head>
<body onload="document.paymentForm.submit()">
  <h2>Redirigiendo al procesador de pagos...</h2>
  <div class="spinner"></div>
  <p>Por favor espere mientras lo redirigimos de forma segura.</p>
  
  <form name="paymentForm" method="post" action="${endpoint}">
`;

    for (const [key, value] of Object.entries(fields)) {
      html += `    <input type="hidden" name="${key}" value="${String(value).replace(/"/g, "&quot;")}" />\n`;
    }

    html += `    <noscript>
      <button type="submit" style="padding: 12px 24px; font-size: 16px; background: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer;">
        Continuar al pago
      </button>
    </noscript>
  </form>
</body>
</html>`;

    return html;
  }

  /**
   * Extract last 4 digits from masked card number
   */
  extractLast4(maskedPan?: string): string | null {
    const match = (maskedPan || "").match(/(\d{4})$/);
    return match ? match[1] : null;
  }

  /**
   * Mask sensitive data for logging
   */
  maskSensitiveData(value?: string, showLast: number = 4): string {
    if (!value) return "";
    return value.replace(new RegExp(`.(?=.{${showLast}}$)`, "g"), "*");
  }
}