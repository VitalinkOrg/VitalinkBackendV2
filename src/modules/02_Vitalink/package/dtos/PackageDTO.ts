
import { Package } from "@index/entity/Package";
import { Request, IAdapterFromBody } from "@modules/index";

export default class PackageDTO implements IAdapterFromBody {
    req: Request;

    constructor(req: Request) {
        this.req = req;
    }

    private getEntity(isCreating: boolean): Package {
        const entity = new Package();
        entity.procedure = this.req.body.procedure_by_specialty_id;
        entity.product = this.req.body.product_code;
        entity.discount = this.req.body.discount;
        entity.services_offer = this.req.body.services_offer;
        entity.is_king = this.req.body.is_king;
     
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
            procedure: entity.procedure,
            product: entity.product,
            discount: entity.discount,
            services_offer: entity.services_offer,
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
