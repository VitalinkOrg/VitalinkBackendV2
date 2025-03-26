
import { LanguageSupplier } from "@index/entity/LanguageSupplier";
import { Request, IAdapterFromBody } from "@modules/index";

export default class LanguageSupplierDTO implements IAdapterFromBody {
    req: Request;

    constructor(req: Request) {
        this.req = req;
    }

    private getEntity(isCreating: boolean): LanguageSupplier {
        const entity = new LanguageSupplier();
        entity.supplier = this.req.body.supplier_id;
        entity.language_proficiency = this.req.body.language_proficiency_code;
        entity.language_code = this.req.body.language_code;
     
        if (isCreating) {
            entity.created_date = new Date();
        } else {
            entity.updated_date = new Date();
        }

        return entity;
    }

    // POST
    entityFromPostBody(): LanguageSupplier {
        return this.getEntity(true);
    }

    // PUT
    entityFromPutBody(): LanguageSupplier {
        return this.getEntity(false);
    }

    // GET
    entityToResponse(entity: LanguageSupplier): any {
        return {
            id: entity.id,
            supplier: entity.supplier,
            language_proficiency: entity.language_proficiency,
            language_code: entity.language_code,
            created_date: entity.created_date,
            updated_date: entity.updated_date,
        };
    }

    entitiesToResponse(entities: LanguageSupplier[] | null): any {
        const response: any[] = [];
        if (entities != null) {
            for (const entity of entities) {
                response.push(this.entityToResponse(entity));
            }
        }
        return response;
    }
}
