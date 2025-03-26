
import { CertificationsExperience } from "@index/entity/CertificationsExperience";
import { Request, IAdapterFromBody } from "@modules/index";

export default class CertificationsExperienceDTO implements IAdapterFromBody {
    req: Request;

    constructor(req: Request) {
        this.req = req;
    }

    private getEntity(isCreating: boolean): CertificationsExperience {
        const entity = new CertificationsExperience();
        entity.supplier = this.req.body.supplier_id;
        entity.start_date = this.req.body.start_date;
        entity.end_date = this.req.body.end_date;
        entity.name = this.req.body.name;
        entity.company_name = this.req.body.company_name;
        entity.province = this.req.body.province;
        entity.address = this.req.body.address;
        entity.city_name = this.req.body.city_name;
        entity.country_iso_code = this.req.body.country_iso_code;
        entity.is_currently = this.req.body.is_currently;
        entity.url_document = this.req.body.url_document;
        entity.experience_type = this.req.body.experience_type_code;
     
        if (isCreating) {
            entity.created_date = new Date();
        } else {
            entity.updated_date = new Date();
            entity.is_deleted = this.req.body.is_deleted;
        }

        return entity;
    }

    // POST
    entityFromPostBody(): CertificationsExperience {
        return this.getEntity(true);
    }

    // PUT
    entityFromPutBody(): CertificationsExperience {
        return this.getEntity(false);
    }

    // GET
    entityToResponse(entity: CertificationsExperience): any {
        return {
            id: entity.id,
            supplier: entity.supplier,
            start_date: entity.start_date,
            end_date: entity.end_date,
            name: entity.name,
            company_name: entity.company_name,
            province: entity.province,
            address: entity.address,
            city_name: entity.city_name,
            country_iso_code: entity.country_iso_code,
            is_currently: entity.is_currently,
            url_document: entity.url_document,
            experience_type: entity.experience_type,
            created_date: entity.created_date,
            updated_date: entity.updated_date,
        };
    }

    entitiesToResponse(entities: CertificationsExperience[] | null): any {
        const response: any[] = [];
        if (entities != null) {
            for (const entity of entities) {
                response.push(this.entityToResponse(entity));
            }
        }
        return response;
    }
}
