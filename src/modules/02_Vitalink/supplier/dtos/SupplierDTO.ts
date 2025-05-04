
import { Supplier } from "@index/entity/Supplier";
import { Request, IAdapterFromBody } from "@modules/index";

export default class SupplierDTO implements IAdapterFromBody {
    req: Request;

    constructor(req: Request) {
        this.req = req;
    }

    private getEntity(isCreating: boolean): Supplier {
        const entity = new Supplier();
        entity.id_type = this.req.body.id_type;
        entity.card_id = this.req.body.card_id;
        entity.num_medical_enrollment = this.req.body.num_medical_enrollment;
        entity.name = this.req.body.name;
        entity.phone_number = this.req.body.phone_number;
        entity.email = this.req.body.email;
        entity.country_iso_code = this.req.body.country_iso_code;
        entity.province = this.req.body.province;
        entity.city_name = this.req.body.city_name;
        entity.postal_code = this.req.body.postal_code;
        entity.profile_picture_url = this.req.body.profile_picture_url;
        entity.description = this.req.body.description;
        entity.address = this.req.body.address;
        entity.street_number = this.req.body.street_number;
        entity.floor = this.req.body.floor;
        entity.door_number = this.req.body.door_number;
        entity.latitude = this.req.body.latitude;
        entity.longitude = this.req.body.longitude;
        entity.experience_years = this.req.body.experience_years;
        entity.patients_number = this.req.body.patients_number;
        entity.is_hospital = this.req.body.is_hospital;
        entity.our_history = this.req.body.our_history;
        entity.mission = this.req.body.mission;
        entity.vision = this.req.body.vision;
        entity.code_card_id_file = this.req.body.code_card_id_file;
        entity.code_medical_license_file = this.req.body.code_medical_license_file;
        entity.gender = this.req.body.gender;
        entity.medical_type = this.req.body.medical_type_code;
        entity.legal_representative = this.req.body.legal_representative;
     
        if (isCreating) {
            entity.created_date = new Date();
        } else {
            entity.updated_date = new Date();
            entity.is_deleted = this.req.body.is_deleted;
        }

        return entity;
    }

    // POST
    entityFromPostBody(): Supplier {
        return this.getEntity(true);
    }

    // PUT
    entityFromPutBody(): Supplier {
        return this.getEntity(false);
    }

    // GET
    entityToResponse(entity: any): any {
        return {
            id: entity.id,
            id_type: entity.id_type,
            card_id: entity.card_id,
            num_medical_enrollment: entity.num_medical_enrollment,
            name: entity.name,
            phone_number: entity.phone_number,
            email: entity.email,
            country_iso_code: entity.country_iso_code,
            province: entity.province,
            city_name: entity.city_name,
            postal_code: entity.postal_code,
            profile_picture_url: entity.profile_picture_url,
            description: entity.description,
            address: entity.address,
            street_number: entity.street_number,
            floor: entity.floor,
            door_number: entity.door_number,
            latitude: entity.latitude,
            longitude: entity.longitude,
            experience_years: entity.experience_years,
            patients_number: entity.patients_number,
            is_hospital: entity.is_hospital,
            our_history: entity.our_history,
            mission: entity.mission,
            vision: entity.vision,
            code_card_id_file: entity.code_card_id_file,
            code_medical_license_file: entity.code_medical_license_file,
            gender: entity.gender,
            medical_type: entity.medical_type,
            legal_representative: entity.legal_representative,
            created_date: entity.created_date,
            updated_date: entity.updated_date,

            date_availability: entity.date_availability,
            hour_availability: entity.hour_availability,
            location_number: entity.location_number,
            search_procedure_name: entity.search_procedure_name,
            search_reference_price: entity.search_reference_price,
            search_original_price: entity.search_original_price,
            stars_by_supplier: entity.stars_by_supplier,
            review_quantity_by_supplier: entity.review_quantity_by_supplier,
            reviews: entity.reviews,
            review_details_summary: entity.review_details_summary,

            services: entity.services,
            availabilities: entity.availabilities,
            locations: entity.locations,
            services_names: entity.services_names,
        };
    }


  

    entitiesToResponse(entities: any[] | null): any {
        const response: any[] = [];
        if (entities != null) {
            for (const entity of entities) {
                response.push(this.entityToResponse(entity));
            }
        }
        return response;
    }


    entityToResponseMain(entity: any): any {
        return {
            id: entity.id,
            id_type: entity.id_type,
            card_id: entity.card_id,
            num_medical_enrollment: entity.num_medical_enrollment,
            name: entity.name,
            phone_number: entity.phone_number,
            email: entity.email,
            province: entity.province,
            city_name: entity.city_name,
            postal_code: entity.postal_code,
            profile_picture_url: entity.profile_picture_url,
            description: entity.description,
            address: entity.address,
            street_number: entity.street_number,
            floor: entity.floor,
            door_number: entity.door_number,
            latitude: entity.latitude,
            longitude: entity.longitude,
            experience_years: entity.experience_years,
            patients_number: entity.patients_number,
            is_hospital: entity.is_hospital,
            our_history: entity.our_history,
            mission: entity.mission,
            vision: entity.vision,
            code_card_id_file: entity.code_card_id_file,
            code_medical_license_file: entity.code_medical_license_file,
            gender: entity.gender,
            medical_type: entity.medical_type,
            legal_representative: entity.legal_representative,

            date_availability: entity.date_availability,
            hour_availability: entity.hour_availability,
            location_number: entity.location_number,
            search_procedure_name: entity.search_procedure_name,
            search_reference_price: entity.search_reference_price,
            search_original_price: entity.search_original_price,
            stars_by_supplier: entity.stars_by_supplier,
            review_quantity_by_supplier: entity.review_quantity_by_supplier,
            reviews: entity.reviews,
            review_details_summary: entity.review_details_summary,

            services: entity.services,
            availabilities: entity.availabilities,
            locations: entity.locations,
            services_names: entity.services_names,
        };
    }

    entitiesToResponseMain(entities: any[] | null): any {
        const response: any[] = [];
        if (entities != null) {
            for (const entity of entities) {
                response.push(this.entityToResponseMain(entity));
            }
        }
        return response;
    }

}
