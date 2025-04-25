
import { Review } from "@index/entity/Review";
import { Request, IAdapterFromBody } from "@modules/index";

export default class ReviewDTO implements IAdapterFromBody {
    req: Request;

    constructor(req: Request) {
        this.req = req;
    }

    private getEntity(isCreating: boolean): Review {
        const entity = new Review();
        entity.customer = this.req.body.customer_id;
        entity.appointment = this.req.body.appointment_id;
        entity.comment = this.req.body.comment;
        entity.is_annonymous = this.req.body.is_annonymous;
        entity.supplier_reply = this.req.body.supplier_reply;
     
        if (isCreating) {
            entity.created_date = new Date();
        } else {
            entity.is_deleted = this.req.body.is_deleted;
            entity.updated_date = new Date();
        }

        return entity;
    }

    // POST
    entityFromPostBody(): Review {
        return this.getEntity(true);
    }

    // PUT
    entityFromPutBody(): Review {
        return this.getEntity(false);
    }

    // GET
    entityToResponse(entity: Review): any {
        return {
            id: entity.id,
            customer: entity.customer,
            appointment: entity.appointment,
            comment: entity.comment,
            is_annonymous: entity.is_annonymous,
            supplier_reply: entity.supplier_reply,
            created_date: entity.created_date,
            updated_date: entity.updated_date,
        };
    }

    entitiesToResponse(entities: Review[] | null): any {
        const response: any[] = [];
        if (entities != null) {
            for (const entity of entities) {
                response.push(this.entityToResponse(entity));
            }
        }
        return response;
    }
}
