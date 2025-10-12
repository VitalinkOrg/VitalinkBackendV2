import IAdapterFromBody from "@TenshiJS/generics/Adapter/IAdapterFromBody";
import { PaymentAttempt } from "@entity/PaymentAttempt";

/**
 * DTO for PaymentAttempt entity
 * Handles data transformation between request/response and entity
 */
export default class PaymentAttemptDTO implements IAdapterFromBody {
  private req: any;

  constructor(req: any) {
    this.req = req;
  }

  // Transform request body to entity for creation/update
  entityFromPostBody(): PaymentAttempt {
     return this.getEntity(true);
  }


  private getEntity(isCreating: boolean): PaymentAttempt {
      const paymentAttempt = new PaymentAttempt();

      paymentAttempt.reference = this.req.body.reference;
      paymentAttempt.amount = this.req.body.amount;
      paymentAttempt.currency = this.req.body.currency;
      paymentAttempt.environment = this.req.body.environment;
      paymentAttempt.mode = this.req.body.mode as "redirect" | "embedded";
      paymentAttempt.status = this.req.body.status;
    
    if (isCreating) {
            paymentAttempt.created_date = new Date();
        } else {
            paymentAttempt.updated_date = new Date();
        }

    return paymentAttempt;
  }

  // Transform request body to entity for updates
  entityFromPutBody(): PaymentAttempt {
    return this.getEntity(false);
  }

  // Transform entity to response format
  entityToResponse(paymentAttempt: PaymentAttempt): any {
    return {
      id: paymentAttempt.id,
      reference: paymentAttempt.reference,
      amount: paymentAttempt.amount,
      currency: paymentAttempt.currency,
      environment: paymentAttempt.environment,
      mode: paymentAttempt.mode,
      status: paymentAttempt.status,
      decision: paymentAttempt.decision,
      reason_code: paymentAttempt.reason_code,
      transaction_id: paymentAttempt.transaction_id,
      card_scheme: paymentAttempt.card_scheme,
      card_last4: paymentAttempt.card_last4,
      user: paymentAttempt.user,
      appointment: paymentAttempt.appointment,
      webhook_received_at: paymentAttempt.webhook_received_at,
      receipt_received_at: paymentAttempt.receipt_received_at,
      created_date: paymentAttempt.created_date,
      updated_date: paymentAttempt.updated_date
    };
  }

  // Transform entity to response format for lists
  entitiesToResponse(paymentAttempts: PaymentAttempt[]): any[] {
    return paymentAttempts.map(attempt => this.entityToResponse(attempt));
  }
}