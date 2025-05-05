
import { Package } from "@index/entity/Package";
import { Request, IAdapterFromBody } from "@modules/index";

export default class PackageDTO implements IAdapterFromBody {
    req: Request;

    constructor(req: Request) {
        this.req = req;
    }


    private getEntity(isCreating: boolean): Package {
        const entity = new Package();
        entity.specialty = this.req.body.specialty_id;
        entity.procedure = this.req.body.procedure_code;
        entity.product = this.req.body.product_code;
        entity.discount = this.req.body.discount;
        entity.services_offer = this.req.body.services_offer;
        entity.is_king = this.req.body.is_king;
        entity.observations = this.req.body.observations;
        entity.postoperative_assessments = this.req.body.postoperative_assessments;
     
        if (isCreating) {
            entity.created_date = new Date();
        } else {
            entity.updated_date = new Date();
            entity.is_deleted = this.req.body.is_deleted;
        }

        return entity;
    }

    // POST
    entityFromPostBody(): Package {
        return this.getEntity(true);
    }

    // PUT
    entityFromPutBody(): Package {
        return this.getEntity(false);
    }

    // GET
    entityToResponse(entity: Package): any {
        return {
            id: entity.id,
            specialty: entity.specialty,
            procedure: entity.procedure,
            product: entity.product,
            discount: entity.discount,
            services_offer: entity.services_offer,
            observations: entity.observations,
            postoperative_assessments: entity.postoperative_assessments,
            is_king: entity.is_king,
            is_deleted: entity.is_deleted,
            created_date: entity.created_date,
            updated_date: entity.updated_date,
        };
    }


    entitiesToResponse(entities: Package[] | null): any {
        const response: any[] = [];
        if (entities != null) {
            for (const entity of entities) {
                response.push(this.entityToResponse(entity));
            }
        }
        return response;
    }
}
