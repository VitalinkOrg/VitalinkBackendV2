import { Request, Response } from "express";
import GenericRoutes from "@TenshiJS/generics/Route/GenericRoutes";
import PaymentController from "../controllers/PaymentController";
import PaymentAttemptDTO from "../dtos/PaymentAttemptDTO";
import RequestHandler from "@TenshiJS/generics/RequestHandler/RequestHandler";
import RequestHandlerBuilder from "@TenshiJS/generics/RequestHandler/RequestHandlerBuilder";
import { bodyParser } from "@index/index";

/**
 * PaymentRoutes - Cybersource payment integration routes
 * 
 * Endpoints:
 * - GET /payment/go - Initiate payment (generates signed form)
 * - POST /payment/notify - Webhook for server-to-server notifications
 * - ALL /payment/receipt - Customer return URL after payment
 * - GET /payment/status - Query payment status by reference
 * - PUT /payment/step - Integration with appointment reservation flow
 */
class PaymentRoutes extends GenericRoutes {

  constructor() {
    super(new PaymentController(), "/payment");
  }

  protected initializeRoutes() {
    /**
     * GET /payment/go - Initiate payment process
     * Generates signed payment form and redirects to Cybersource
     * Query params: userId (required), amount (required), currency, appointmentId, mode
     */
    this.router.get(`${this.getRouterName()}/go`, async (req: Request, res: Response) => {
      const requestHandler: RequestHandler =
        new RequestHandlerBuilder(res, req)
          .setAdapter(new PaymentAttemptDTO(req))
          .setMethod("go")
          .isValidateRole("PAYMENT") // Users can initiate their own payments
          .build();

      const result = await (this.getController() as PaymentController).go(requestHandler);

      //console.log(result);
      res.status(result.status ?? 200);
      if (result.contentType) res.type(result.contentType);
      return res.send(result.body);
    });

    /**
     * POST /payment/notify - Webhook endpoint for Cybersource
     * Server-to-server notifications (no authentication required)
     */
    this.router.post(`${this.getRouterName()}/notify`, async (req: Request, res: Response) => {
      const requestHandler: RequestHandler =
        new RequestHandlerBuilder(res, req)
          .setAdapter(new PaymentAttemptDTO(req))
          .setMethod("notify")
          .build();

      const result = await (this.getController() as PaymentController).notify(requestHandler);
      res.status(result.status ?? 200);
      if (result.contentType) res.type(result.contentType);
      return res.send(result.body);
    });

    /**
     * ALL /payment/receipt - Customer return URL
     * Handles both GET and POST from customer browser after payment
     * No authentication required as this is a public callback
     */
    this.router.post(`${this.getRouterName()}/receipt`, bodyParser.urlencoded({ extended: true, type: "*/*", limit: "1mb" }), async (req: Request, res: Response) => {
      const requestHandler: RequestHandler =
        new RequestHandlerBuilder(res, req)
          .setAdapter(new PaymentAttemptDTO(req))
          .setMethod("receipt")
          .build();

      /*const result = await */(this.getController() as PaymentController).receiptBridge(requestHandler);
     /* res.status(result.status ?? 200);
      if (result.contentType) res.type(result.contentType);
      return res.send(result.body);*/
    });




   
    /**
     * GET /payment/status - Query payment status
     * Query params: reference (required)
     */
    this.router.get(`${this.getRouterName()}/status`, async (req: Request, res: Response) => {
      const requestHandler: RequestHandler =
        new RequestHandlerBuilder(res, req)
          .setAdapter(new PaymentAttemptDTO(req))
          .setMethod("status")
          .isValidateRole("PAYMENT") // Users can check their payment status
          .build();

      const result = await (this.getController() as PaymentController).status(requestHandler);
      res.status(result.status ?? 200);
      return res.json(result.body);
    });

  
  }
}

export default PaymentRoutes;
