import { Request, IAdapterFromBody } from "@modules/index";
import { Document } from '@index/modules/01_General/document/index';

export default  class DocumentDTO implements IAdapterFromBody{
    req: Request;

    constructor(req: Request) {
        this.req = req;
    }

    entityFromPostBody(): any {
        return null;
    }

    //POST
    entityFromPostBodyWithParams(body : any) : Document{
        const entity = new Document();
        entity.title = body.name;
        entity.type = body.type;
        entity.action_type = body.action_type || "GENERAL";
        entity.description = body.description;
        entity.id_for_table = body.id_for_table || 0;
        entity.table = body.table;
        entity.user_id = body.user_id;
        entity.is_public = body.is_public || 0;
        entity.created_date = new Date();
        return entity;
    }

    entityToResponse(entity: Document) : any{
    
        return  {
            id : entity.id,
            name: entity.title,
            code: entity.code,
            file_name: entity.file_name,
            type: entity.type,
            extension: entity.extension,
            description: entity.description,
            url: entity.url,
            id_for_table: entity.id_for_table,
            table: entity.table,
            user_id: entity.user_id,
            is_public: entity.is_public,
            created_date: entity.created_date
        };
    }

    entitiesToResponse(entities: Document[] | null): any {
        const response: any[] = [];
    
        if(entities != null){
            for (const entity of entities) {
                response.push(this.entityToResponse(entity));
            }
        }
        
        return response;
    }
    
    //PUT
    entityFromPutBody() : Document{
        const entity = new Document();
        return entity;
    }
}
