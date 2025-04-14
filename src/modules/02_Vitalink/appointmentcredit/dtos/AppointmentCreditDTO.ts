
import { AppointmentCredit } from "@index/entity/AppointmentCredit";
import { Request, IAdapterFromBody } from "@modules/index";

export default class AppointmentCreditDTO implements IAdapterFromBody {
    req: Request;

    constructor(req: Request) {
        this.req = req;
    }

    private getEntity(isCreating: boolean): AppointmentCredit {
        const entity = new AppointmentCredit();
        entity.appointment = this.req.body.appointment;
        entity.credit_status = this.req.body.credit_status;
        entity.requested_amount = this.req.body.requested_amount;
        entity.approved_amount = this.req.body.approved_amount;
        entity.credit_observations = this.req.body.credit_observations;
        entity.pagare_file_code = this.req.body.pagare_file_code;
     
        if (isCreating) {
            entity.created_date = new Date();
        } else {
            entity.updated_date = new Date();
        }

        return entity;
    }

    // POST
    entityFromPostBody(): AppointmentCredit {
        return this.getEntity(true);
    }

    // PUT
    entityFromPutBody(): AppointmentCredit {
        return this.getEntity(false);
    }

    // GET
    entityToResponse(entity: AppointmentCredit): any {
        return {
            id: entity.id,
            appointment: entity.appointment,
            credit_status: entity.credit_status,
            requested_amount: entity.requested_amount,
            approved_amount: entity.approved_amount,
            credit_observations: entity.credit_observations,
            pagare_file_code: entity.pagare_file_code,
            created_date: entity.created_date,
            updated_date: entity.updated_date,
        };
    }

    entitiesToResponse(entities: AppointmentCredit[] | null): any {
        const response: any[] = [];
        if (entities != null) {
            for (const entity of entities) {
                response.push(this.entityToResponse(entity));
            }
        }
        return response;
    }
}
