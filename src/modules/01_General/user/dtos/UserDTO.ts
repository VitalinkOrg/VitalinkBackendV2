import { Request, IAdapterFromBody } from "@modules/index";
import { User } from "@TenshiJS/entity/User";
import { config } from "@index/index";

export default  class UserDTO implements IAdapterFromBody{
    req: Request;

    constructor(req: Request) {
        this.req = req;
    }



    //POST
    entityFromPostBody() : User{
        const entity = new User();
        entity.card_id = this.req.body.card_id;
        entity.id_type = this.req.body.id_type;
        entity.name = this.req.body.name;
        entity.user_name = this.req.body.user_name;
        entity.email = this.req.body.email;
        entity.phone_number = this.req.body.phone_number;
        entity.password = this.req.body.password;
        entity.gender = this.req.body.gender;
        entity.birth_date = this.req.body.birth_date;
        entity.country_iso_code = this.req.body.country_iso_code;
        entity.city_name = this.req.body.city_name;
        entity.postal_code = this.req.body.postal_code;
        entity.latitude = this.req.body.latitude;
        entity.longitude = this.req.body.longitude;
        entity.finance_entity = this.req.body.finance_entity;
        entity.code_contract = this.req.body.code_contract;
        entity.role_code = this.req.body.role_code || config.SERVER.CUSTOMER_REGULAR_ROLE;
        entity.language = this.req.body.language || config.SERVER.DEFAULT_LANGUAGE;
        entity.profile_picture_url = this.req.body.profile_picture_url;
        entity.is_active_from_email = this.req.body.is_active_from_email;
        entity.account_status = this.req.body.account_status || "pending";
    
        return entity;
    }

    entityToResponse(user: User) : any{
    
        return  {
            id : user.id,
            card_id: user.card_id,
            id_type: user.id_type,
            name: user.name,
            user_name: user.user_name,
            email: user.email,
            phone_number: user.phone_number,
            country_iso_code: user.country_iso_code,
            city_name: user.city_name,
            postal_code: user.postal_code,
            latitude: user.latitude,
            longitude: user.longitude,
            gender: user.gender,
            birth_date: user.birth_date,
            role: user.role_code,
            finance_entity: user.finance_entity,
            code_contract: user.code_contract,
            language: user.language,
            profile_picture_url: user.profile_picture_url,
            account_status: user.account_status
        };
    }

    entitiesToResponse(entities: User[] | null): any {
        const response: any[] = [];
    
        if(entities != null){
            for (const entity of entities) {
                response.push(this.entityToResponse(entity));
            }
        }
        
        return response;
    }
   
    //PUT
    entityFromPutBody() : User{
        const entity = new User();
        entity.card_id = this.req.body.card_id;
        entity.id_type = this.req.body.id_type;
        entity.name = this.req.body.name;
        entity.user_name = this.req.body.user_name;
        entity.email = this.req.body.email;
        entity.phone_number = this.req.body.phone_number;
        entity.gender = this.req.body.gender;
        entity.birth_date = this.req.body.birth_date;
        entity.language = this.req.body.language;
        entity.country_iso_code = this.req.body.country_iso_code;
        entity.city_name = this.req.body.city_name;
        entity.postal_code = this.req.body.postal_code;
        entity.latitude = this.req.body.latitude;
        entity.longitude = this.req.body.longitude;
        entity.role_code = this.req.body.role_code;
        entity.finance_entity = this.req.body.finance_entity;
        entity.code_contract = this.req.body.code_contract;
        entity.profile_picture_url = this.req.body.profile_picture_url;
        entity.is_active_from_email = this.req.body.is_active_from_email;
        entity.account_status = this.req.body.account_status;
        return entity;
    }

    //Login
    tokenToResponse(accessToken: string, refreshToken: string, screens : string[] | null) : any{
        return  {
            access_token : accessToken,
            refresh_token: refreshToken,
            screens_access: screens
        };
    }

    refreshToResponse(accessToken: string) : any{
        return  {
            access_token : accessToken
        };
    }

    userFromBodyLogin(): User{
        const userLogin = new User();
        userLogin.email = this.req.body.email;
        userLogin.user_name = this.req.body.user_name;
        userLogin.password = this.req.body.password;
    
        return userLogin;
    }

    userFromBodyRecoverUserByEmail(): User{
        const userLogin = new User();
        userLogin.email = this.req.body.email;
    
        return userLogin;
    }

    rolesToResponse(accessToken: string, refreshToken: string, screens : string[] | null) : any{
        return  {
            roles : [accessToken, refreshToken, screens]
        };
    }
}
