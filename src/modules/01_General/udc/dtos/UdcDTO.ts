import { Request, IAdapterFromBody } from "@modules/index";
import { UnitDynamicCentral } from '@modules/01_General/udc';

export default  class UdcDTO implements IAdapterFromBody{
    req: Request;

    constructor(req: Request) {
        this.req = req;
    }

    //POST
    entityFromPostBody() : UnitDynamicCentral{
        const entity = new UnitDynamicCentral();
        entity.code = this.req.body.code;
        entity.name = this.req.body.name;
        entity.type = this.req.body.type;
        entity.value1 = this.req.body.value1;
        entity.father_code = this.req.body.father_code;
        entity.created_date = new Date();
        return entity;
    }

    entityToResponse(entity: UnitDynamicCentral) : any{
    
        return  {
            id : entity.id,
            code: entity.code,
            name: entity.name,
            type: entity.type,
            value1: entity.value1,
            father_code: entity.father_code,
            created_date: entity.created_date,
            updated_date: entity.updated_date,
        };
    }

    entitiesToResponse(entities: UnitDynamicCentral[] | null): any {
        const response: any[] = [];
    
        if(entities != null){
            for (const entity of entities) {
                response.push(this.entityToResponse(entity));
            }
        }
        
        return response;
    }
    
    //PUT
    entityFromPutBody() : UnitDynamicCentral{
        const entity = new UnitDynamicCentral();
        entity.name = this.req.body.name;
        entity.type = this.req.body.type;
        entity.value1 = this.req.body.value1;
        entity.father_code = this.req.body.father_code,
        entity.updated_date = new Date();
        return entity;
    }
}
