
import { ReviewDetail } from "@index/entity/ReviewDetail";
import { Request, IAdapterFromBody } from "@modules/index";

export default class ReviewDetailDTO implements IAdapterFromBody {
    req: Request;

    constructor(req: Request) {
        this.req = req;
    }

    private getEntity(isCreating: boolean): ReviewDetail {
        const entity = new ReviewDetail();
        entity.review = this.req.body.review_id;
        entity.stars_point = this.req.body.stars_point;
        entity.review_code = this.req.body.review_code;
     
        if (isCreating) {
            entity.created_date = new Date();
        } 

        return entity;
    }

    // POST
    entityFromPostBody(): ReviewDetail {
        return this.getEntity(true);
    }

    // PUT
    entityFromPutBody(): ReviewDetail {
        return this.getEntity(false);
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
