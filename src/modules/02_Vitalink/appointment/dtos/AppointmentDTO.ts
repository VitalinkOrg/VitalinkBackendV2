
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
        entity.supplier = this.req.body.supplier_id;
        entity.package = this.req.body.package_id;
        entity.application_date = this.req.body.application_date;
        entity.user_description = this.req.body.user_description;
        entity.recommendation_post_appointment = this.req.body.recommendation_post_appointment;
        entity.diagnostic = this.req.body.diagnostic;
        entity.is_for_external_user = this.req.body.is_for_external_user;
        entity.phone_number_external_user = this.req.body.phone_number_external_user;

        entity.reservation_type_code = this.req.body.reservation_type_code;
        entity.appointment_status_code = this.req.body.appointment_status_code;
        entity.payment_status_code = this.req.body.payment_status_code;
        entity.payment_method = this.req.body.payment_method_code;
        entity.appointment_result = this.req.body.appointment_result_code;
        entity.appointment_type_code = this.req.body.appointment_type_code;

        entity.price_procedure = this.req.body.price_procedure;
        entity.price_valoration_appointment = this.req.body.price_valoration_appointment;
        
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
            appointment_qr_code: entity.appointment_qr_code,
            application_date: entity.application_date,
            user_description: entity.user_description,
            recommendation_post_appointment: entity.recommendation_post_appointment,
            diagnostic: entity.diagnostic,
            is_for_external_user: entity.is_for_external_user,
            phone_number_external_user: entity.phone_number_external_user,

            supplier: entity.supplier,
            package: entity.package,

            reservation_type: entity.reservation_type,
            appointment_status: entity.appointment_status,
            payment_status: entity.payment_status,
            payment_method: entity.payment_method,
            appointment_result: entity.appointment_result,
            appointment_type: entity.appointment_type,

            price_procedure: entity.price_procedure,
            price_valoration_appointment: entity.price_valoration_appointment,

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
