import { SpecialtyBySupplier } from "@index/entity/SpecialtyBySupplier";
import { Request, IAdapterFromBody } from "@modules/index";

export default class SpecialtyBySupplierDTO implements IAdapterFromBody {
    req: Request;

    constructor(req: Request) {
        this.req = req;
    }

    private buildEntity(source: any, isCreating: boolean): SpecialtyBySupplier {
        const entity = new SpecialtyBySupplier();
        entity.supplier = source.supplier_id;
        entity.medical_specialty = source.medical_specialty_code;

        if (isCreating) {
            entity.created_date = new Date();
        }

        return entity;
    }

    // POST
    entityFromPostBody(): SpecialtyBySupplier {
        return this.buildEntity(this.req.body, true);
    }

    // PUT
    entityFromPutBody(): SpecialtyBySupplier {
        return this.buildEntity(this.req.body, false);
    }

    // POST / PUT desde array
    entityFromObject(obj: any, isCreating: boolean = true): SpecialtyBySupplier {
        return this.buildEntity(obj, isCreating);
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

    entitiesToResponse(entities: SpecialtyBySupplier[] | null): any[] {
        if (!entities) return [];
        return entities.map(this.entityToResponse);
    }
}
