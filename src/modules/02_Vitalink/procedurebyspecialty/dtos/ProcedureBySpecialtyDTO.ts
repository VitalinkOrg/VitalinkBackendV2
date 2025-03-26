
import { ProcedureBySpecialty } from "@index/entity/ProcedureBySpecialty";
import { Request, IAdapterFromBody } from "@modules/index";
import { User } from "@TenshiJS/entity/User";

export default class ProcedureBySpecialtyDTO implements IAdapterFromBody {
    req: Request;

    constructor(req: Request) {
        this.req = req;
    }

    private getEntity(isCreating: boolean): ProcedureBySpecialty {
        const entity = new ProcedureBySpecialty();
        entity.specialty = this.req.body.specialty_id;
        entity.procedure = this.req.body.procedure_code;
     
        if (isCreating) {
            entity.created_date = new Date();
        } 

        return entity;
    }

    // POST
    entityFromPostBody(): ProcedureBySpecialty {
        return this.getEntity(true);
    }

    // PUT
    entityFromPutBody(): ProcedureBySpecialty {
        return this.getEntity(false);
    }

    // GET
    entityToResponse(entity: ProcedureBySpecialty): any {
        return {
            id: entity.id,
            specialty: entity.specialty,
            procedure: entity.procedure,
            created_date: entity.created_date,
        };
    }

    entitiesToResponse(entities: ProcedureBySpecialty[] | null): any {
        const response: any[] = [];
        if (entities != null) {
            for (const entity of entities) {
                response.push(this.entityToResponse(entity));
            }
        }
        return response;
    }
}
