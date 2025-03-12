
import { Location } from "@index/entity/Location";
import { Request, IAdapterFromBody } from "@modules/index";
import { User } from "@TenshiJS/entity/User";

export default class LocationDTO implements IAdapterFromBody {
    req: Request;

    constructor(req: Request) {
        this.req = req;
    }

    private getEntity(isCreating: boolean): Location {
        const entity = new Location();
        entity.name = this.req.body.name;
        entity.country_iso_code = this.req.body.country_iso_code;
        entity.province = this.req.body.province;
        entity.address = this.req.body.address;
        entity.city_name = this.req.body.city_name;
        entity.postal_code = this.req.body.postal_code;
        entity.latitude = this.req.body.latitude;
        entity.longitude = this.req.body.longitude;
        entity.legal_representative = this.req.body.legal_representative_id;
     
        if (isCreating) {
            entity.created_date = new Date();
        } else {
            entity.updated_date = new Date();
            entity.is_deleted = this.req.body.is_deleted;
        }

        return entity;
    }

    // POST
    entityFromPostBody(): Location {
        return this.getEntity(true);
    }

    // PUT
    entityFromPutBody(): Location {
        return this.getEntity(false);
    }

    // GET
    entityToResponse(entity: Location): any {
        return {
            id: entity.id,
            name: entity.name,
            country_iso_code: entity.country_iso_code,
            province: entity.province,
            address: entity.address,
            city_name: entity.city_name,
            postal_code: entity.postal_code,
            latitude: entity.latitude,
            longitude: entity.longitude,
            legal_representative: entity.legal_representative,
            created_date: entity.created_date,
            updated_date: entity.updated_date,
        };
    }

    entitiesToResponse(entities: Location[] | null): any {
        const response: any[] = [];
        if (entities != null) {
            for (const entity of entities) {
                response.push(this.entityToResponse(entity));
            }
        }
        return response;
    }
}
