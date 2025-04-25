
import { Availability } from "@index/entity/Availability";
import { Request, IAdapterFromBody } from "@modules/index";
import { User } from "@TenshiJS/entity/User";

export default class AvailabilityDTO implements IAdapterFromBody {
    req: Request;

    constructor(req: Request) {
        this.req = req;
    }

    private getEntity(isCreating: boolean): Availability {
        const entity = new Availability();
        entity.supplier = this.req.body.supplier_id;
        entity.location = this.req.body.location_id;
        entity.weekday = this.req.body.weekday;
        entity.from_hour = this.req.body.from_hour;
        entity.to_hour = this.req.body.to_hour;
     
        if (isCreating) {
            entity.created_date = new Date();
        } else {
            entity.updated_date = new Date();
        }

        return entity;
    }

    // POST
    entityFromPostBody(): Availability {
        return this.getEntity(true);
    }

    // PUT
    entityFromPutBody(): Availability {
        return this.getEntity(false);
    }

    // GET
    entityToResponse(entity: Availability): any {
        return {
            id: entity.id,
            supplier: entity.supplier,
            location: entity.location,
            weekday: entity.weekday,
            from_hour: entity.from_hour,
            to_hour: entity.to_hour,
            created_date: entity.created_date,
            updated_date: entity.updated_date,
        };
    }

    entitiesToResponse(entities: Availability[] | null): any {
        const response: any[] = [];
        if (entities != null) {
            for (const entity of entities) {
                response.push(this.entityToResponse(entity));
            }
        }
        return response;
    }
}
