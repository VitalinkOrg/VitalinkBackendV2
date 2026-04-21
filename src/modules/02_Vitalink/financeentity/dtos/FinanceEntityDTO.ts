import { Request, IAdapterFromBody } from "@modules/index";
import { User } from "@TenshiJS/entity/User";
import { config } from "@index/index";

export default  class FinanceEntityDTO implements IAdapterFromBody{
    req: Request;

    constructor(req: Request) {
        this.req = req;
    }


    //POST
    entityFromPostBody() : User{
        return new User();
    }

    entityToResponse(user: User) : any{
    
        return  {
            id : user.id,
            id_type: user.id_type,
            name: user.name,
            country_iso_code: user.country_iso_code,
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
        return new User();
    }

}
