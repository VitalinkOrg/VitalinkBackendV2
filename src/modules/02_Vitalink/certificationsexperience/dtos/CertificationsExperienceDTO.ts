
import { CertificationsExperience } from "@index/entity/CertificationsExperience";
import { Request, IAdapterFromBody } from "@modules/index";

export default class CertificationsExperienceDTO implements IAdapterFromBody {
    req: Request;

    constructor(req: Request) {
        this.req = req;
    }

      private buildEntity(source: any, isCreating: boolean): CertificationsExperience {
        const entity = new CertificationsExperience();

        entity.supplier = source.supplier_id;
        entity.start_date = source.start_date;
        entity.end_date = source.end_date;
        entity.name = source.name;
        entity.company_name = source.company_name;
        entity.province = source.province;
        entity.address = source.address;
        entity.city_name = source.city_name;
        entity.country_iso_code = source.country_iso_code;
        entity.is_currently = source.is_currently;
        entity.url_document = source.url_document;
        entity.experience_type = source.experience_type_code;
     
        if (isCreating) {
            entity.created_date = new Date();
        } else {
            entity.updated_date = new Date();
            entity.is_deleted = source.is_deleted;
        }

        return entity;
    }

    // POST
    entityFromPostBody(): CertificationsExperience {
        return this.buildEntity(this.req.body, true);
    }

    // PUT
    entityFromPutBody(): CertificationsExperience {
        return this.buildEntity(this.req.body, false);
    }

    // POST / PUT desde array
    entityFromObject(obj: any, isCreating: boolean = true): CertificationsExperience {
        return this.buildEntity(obj, isCreating);
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
