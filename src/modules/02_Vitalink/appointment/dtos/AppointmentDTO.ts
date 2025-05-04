
import { Appointment } from "@index/entity/Appointment";
import { Request, IAdapterFromBody } from "@modules/index";

export default class AppointmentDTO implements IAdapterFromBody {
    req: Request;

    constructor(req: Request) {
        this.req = req;
    }

    private getEntity(isCreating: boolean): Appointment {
        const entity = new Appointment();
        entity.customer = this.req.body.customer_id;
        entity.proforma_file_code = this.req.body.proforma_file_code;
        entity.appointment_date = this.req.body.appointment_date;
        entity.appointment_hour = this.req.body.appointment_hour;
        entity.reservation_type = this.req.body.reservation_type_code;
        entity.appointment_status = this.req.body.appointment_status_code;
        entity.supplier = this.req.body.supplier_id;
        entity.procedure = this.req.body.procedure_id;
        entity.package = this.req.body.package_id;
        entity.application_date = this.req.body.application_date;
        entity.payment_status_code = this.req.body.payment_status_code;
        entity.payment_method = this.req.body.payment_method_code;
        entity.appointment_result = this.req.body.appointment_result_code;
        entity.user_description = this.req.body.user_description;
        entity.recommendation_post_appointment = this.req.body.recommendation_post_appointment;
        entity.diagnostic = this.req.body.diagnostic;
        entity.is_for_external_user = this.req.body.is_for_external_user;
        entity.phone_number_external_user = this.req.body.phone_number_external_user;
     
        if (isCreating) {
            entity.created_date = new Date();
        } else {
            entity.updated_date = new Date();
        }

        return entity;
    }

    // POST
    entityFromPostBody(): Appointment {
        return this.getEntity(true);
    }

    // PUT
    entityFromPutBody(): Appointment {
        return this.getEntity(false);
    }

    // GET
    entityToResponse(entity: any): any {

        return {
            id: entity.id,
            customer: entity.customer,
            proforma_file_code: entity.proforma_file_code,
            appointment_date: entity.appointment_date,
            appointment_hour: entity.appointment_hour,
            reservation_type: entity.reservation_type,
            appointment_status: entity.appointment_status,
            supplier: entity.supplier,
            procedure: entity.package?.procedure || null,
            package: entity.package,
            application_date: entity.application_date,
            payment_status: entity.payment_status,
            payment_method: entity.payment_method,
            appointment_result: entity.appointment_result,
            user_description: entity.user_description,
            recommendation_post_appointment: entity.recommendation_post_appointment,
            diagnostic: entity.diagnostic,
            is_for_external_user: entity.is_for_external_user,
            phone_number_external_user: entity.phone_number_external_user,
            created_date: entity.created_date,
            updated_date: entity.updated_date,
        };
    }

    entitiesToResponse(entities: any[] | null): any {
        const response: any[] = [];
        if (entities != null) {
            for (const entity of entities) {
                response.push(this.entityToResponse(entity));
            }
        }
        return response;
    }
}
