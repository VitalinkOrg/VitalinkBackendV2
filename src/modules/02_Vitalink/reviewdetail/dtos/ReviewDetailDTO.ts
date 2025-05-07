
import { ReviewDetail } from "@index/entity/ReviewDetail";
import { Request, IAdapterFromBody } from "@modules/index";

export default class ReviewDetailDTO implements IAdapterFromBody {
    req: Request;

    constructor(req: Request) {
        this.req = req;
    }

     private buildEntity(source: any, isCreating: boolean): ReviewDetail {
            const entity = new ReviewDetail();

            entity.review = source.review_id;
            entity.stars_point = source.stars_point;
            entity.review_code = source.review_code;

            if (isCreating) {
                entity.created_date = new Date();
            }
    
            return entity;
    }
    


    // POST
    entityFromPostBody(): ReviewDetail {
        return this.buildEntity(this.req.body, true);
    }

    // PUT
    entityFromPutBody(): ReviewDetail {
        return this.buildEntity(this.req.body, false);
    }

    // POST / PUT desde array
    entityFromObject(obj: any, isCreating: boolean = true): ReviewDetail {
        return this.buildEntity(obj, isCreating);
    }

    // GET
    entityToResponse(entity: ReviewDetail): any {
        return {
            id: entity.id,
            review: entity.review,
            stars_point: entity.stars_point,
            review_code: entity.review_code,
            created_date: entity.created_date,
        };
    }

    entitiesToResponse(entities: ReviewDetail[] | null): any {
        const response: any[] = [];
        if (entities != null) {
            for (const entity of entities) {
                response.push(this.entityToResponse(entity));
            }
        }
        return response;
    }
}
