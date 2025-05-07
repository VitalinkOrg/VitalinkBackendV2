
import { PreRegisterUser } from "@index/entity/PreRegisterUser";
import { Request, IAdapterFromBody } from "@modules/index";

export default class PreRegisterUserDTO implements IAdapterFromBody {
    req: Request;

    constructor(req: Request) {
        this.req = req;
    }

    private buildEntity(source: any, isCreating: boolean): PreRegisterUser {

            const entity = new PreRegisterUser();
            entity.card_id = source.card_id;
            entity.id_type = source.id_type;
            entity.name = source.name;
            entity.email = source.email;
            entity.address = source.address;
            entity.birth_date = source.birth_date;
            entity.finance_entity = source.finance_entity;
        
            if (isCreating) {
                entity.created_date = new Date();
            } else {
                entity.updated_date = new Date();
            }

            return entity;
    }

    // POST
    entityFromPostBody(): PreRegisterUser {
        return this.buildEntity(this.req.body, true);
    }

    // PUT
    entityFromPutBody(): PreRegisterUser {
        return this.buildEntity(this.req.body, false);
    }

    // POST / PUT desde array
    entityFromObject(obj: any, isCreating: boolean = true): PreRegisterUser {
        return this.buildEntity(obj, isCreating);
    }

    // GET
    entityToResponse(entity: PreRegisterUser): any {
        return {
            id: entity.id,
            card_id: entity.card_id,
            id_type: entity.id_type,
            name: entity.name,
            email: entity.email,
            address: entity.address,
            birth_date: entity.birth_date,
            finance_entity: entity.finance_entity,
            created_date: entity.created_date,
            updated_date: entity.updated_date,
        };
    }

    entitiesToResponse(entities: PreRegisterUser[] | null): any {
        const response: any[] = [];
        if (entities != null) {
            for (const entity of entities) {
                response.push(this.entityToResponse(entity));
            }
        }
        return response;
    }
}
