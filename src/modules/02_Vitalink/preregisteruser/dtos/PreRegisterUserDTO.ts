
import { PreRegisterUser } from "@index/entity/PreRegisterUser";
import { Request, IAdapterFromBody } from "@modules/index";

export default class PreRegisterUserDTO implements IAdapterFromBody {
    req: Request;

    constructor(req: Request) {
        this.req = req;
    }

    private getEntity(isCreating: boolean): PreRegisterUser {
        const entity = new PreRegisterUser();
        entity.card_id = this.req.body.card_id;
        entity.id_type = this.req.body.id_type;
        entity.name = this.req.body.name;
        entity.address = this.req.body.address;
        entity.birth_date = this.req.body.birth_date;
        entity.finance_entity = this.req.body.finance_entity;
     
        if (isCreating) {
            entity.created_date = new Date();
        } else {
            entity.updated_date = new Date();
        }

        return entity;
    }

    // POST
    entityFromPostBody(): PreRegisterUser {
        return this.getEntity(true);
    }

    // PUT
    entityFromPutBody(): PreRegisterUser {
        return this.getEntity(false);
    }

    // GET
    entityToResponse(entity: PreRegisterUser): any {
        return {
            id: entity.id,
            card_id: entity.card_id,
            id_type: entity.id_type,
            name: entity.name,
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
