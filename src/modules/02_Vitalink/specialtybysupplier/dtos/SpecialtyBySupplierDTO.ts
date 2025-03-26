
import { SpecialtyBySupplier } from "@index/entity/SpecialtyBySupplier";
import { Request, IAdapterFromBody } from "@modules/index";

export default class SpecialtyBySupplierDTO implements IAdapterFromBody {
    req: Request;

    constructor(req: Request) {
        this.req = req;
    }

    private getEntity(isCreating: boolean): SpecialtyBySupplier {
        const entity = new SpecialtyBySupplier();
        entity.supplier = this.req.body.supplier;
        entity.medical_specialty = this.req.body.medical_specialty;
     
        if (isCreating) {
            entity.created_date = new Date();
        } 

        return entity;
    }

    // POST
    entityFromPostBody(): SpecialtyBySupplier {
        return this.getEntity(true);
    }

    // PUT
    entityFromPutBody(): SpecialtyBySupplier {
        return this.getEntity(false);
    }

    // GET
    entityToResponse(entity: SpecialtyBySupplier): any {
        return {
            id: entity.id,
            supplier: entity.supplier,
            medical_specialty: entity.medical_specialty,
            created_date: entity.created_date,
        };
    }

    entitiesToResponse(entities: SpecialtyBySupplier[] | null): any {
        const response: any[] = [];
        if (entities != null) {
            for (const entity of entities) {
                response.push(this.entityToResponse(entity));
            }
        }
        return response;
    }
}
