import { Request, Response, 
         RequestHandler, RequestHandlerBuilder, 
         GenericController, GenericRoutes,
         FindManyOptions,
         getUrlParam} from "@modules/index";
import { ReviewDetail } from "@index/entity/ReviewDetail";
import ReviewDetailDTO from "@modules/02_Vitalink/reviewdetail/dtos/ReviewDetailDTO";

class ReviewDetailRoutes extends GenericRoutes {
    
    private filters: FindManyOptions = {};
    constructor() {
        super(new GenericController(ReviewDetail), "/reviewdetail");
        this.filters.relations = ["review","review_code"];
    }

    protected initializeRoutes() {
        this.router.get(`${this.getRouterName()}/get`, async (req: Request, res: Response) => {

            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new ReviewDetailDTO(req))
                                    .setMethod("getReviewDetailById")
                                    .isValidateRole("REVIEW_DETAIL")
                                    .setFilters(this.filters)
                                    .setDynamicRoleValidationByEntityField([
                                        ["CUSTOMER", "review.customer.id"],
                                        ["LEGAL_REPRESENTATIVE", "review.appointment.supplier.legal_representative.id"]
                                      ])
                                    .build();
        
            this.getController().getById(requestHandler);
        });
        
        this.router.get(`${this.getRouterName()}/get_all`, async (req: Request, res: Response) => {

             const review_id: string | null = getUrlParam("review_id", req) || null;
            if (review_id != "") {
                this.filters.where = { ...this.filters.where, review: { id: review_id} };
            }
        
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new ReviewDetailDTO(req))
                                    .setMethod("getReviewDetails")
                                    .isValidateRole("REVIEW_DETAIL")
                                    .setFilters(this.filters)
                                    .setDynamicRoleValidationByEntityField([
                                        ["CUSTOMER", "review.customer.id"],
                                        ["LEGAL_REPRESENTATIVE", "review.appointment.supplier.legal_representative.id"]
                                      ])
                                    .build();
        
            this.getController().getAll(requestHandler);
        });
        
        this.router.post(`${this.getRouterName()}/add`, async (req: Request, res: Response) => {

            const requiredBodyList: Array<string> = [
                req.body.review,
                req.body.stars_point,
                req.body.review_code
            ];
            
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new ReviewDetailDTO(req))
                                    .setMethod("insertReviewDetail")
                                    .setRequiredFiles(requiredBodyList)
                                    .isValidateRole("REVIEW_DETAIL")
                                    .build();
        
            this.getController().insert(requestHandler);
        });
        
        this.router.put(`${this.getRouterName()}/edit`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new ReviewDetailDTO(req))
                                    .setMethod("updateReviewDetail")
                                    .isValidateRole("REVIEW_DETAIL")
                                    .setDynamicRoleValidationByEntityField([
                                        ["CUSTOMER", "review.customer.id"],
                                        ["LEGAL_REPRESENTATIVE", "review.appointment.supplier.legal_representative.id"]
                                      ])
                                    .build();
        
            this.getController().update(requestHandler);
        });
        
        this.router.delete(`${this.getRouterName()}/delete`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new ReviewDetailDTO(req))
                                    .setMethod("deleteReviewDetail")
                                    .isValidateRole("REVIEW_DETAIL")
                                    .setDynamicRoleValidationByEntityField([
                                        ["CUSTOMER", "review.customer.id"],
                                        ["LEGAL_REPRESENTATIVE", "review.appointment.supplier.legal_representative.id"]
                                      ])
                                    .build();
        
            this.getController().delete(requestHandler);
        });



          this.router.post(`${this.getRouterName()}/add_multiple`, async (req: Request, res: Response) => {
        
                const requestHandler : RequestHandler = 
                                        new RequestHandlerBuilder(res,req)
                                        .setAdapter(new ReviewDetailDTO(req))
                                        .setMethod("insertMultipleReviewDetail")
                                        .isValidateRole("REVIEW_DETAIL")
                                        .build();
            
                this.getController().insertMultiple(requestHandler);
            });
        
              
    }
}

export default ReviewDetailRoutes;
