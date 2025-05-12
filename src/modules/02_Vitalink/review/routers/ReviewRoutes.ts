import { Request, Response, 
         RequestHandler, RequestHandlerBuilder, 
         GenericController, GenericRoutes,
         FindManyOptions,
         getUrlParam} from "@modules/index";
import { Review } from "@index/entity/Review";
import ReviewDTO from "@modules/02_Vitalink/review/dtos/ReviewDTO";

class ReviewRoutes extends GenericRoutes {
    
    private buildBaseFilters(): FindManyOptions {
        return {
            relations: ["customer","appointment"],
            where: {} 
        };
    }
    constructor() {
        super(new GenericController(Review), "/review");
    }

    protected initializeRoutes() {
        this.router.get(`${this.getRouterName()}/get`, async (req: Request, res: Response) => {

            const filters = this.buildBaseFilters();
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new ReviewDTO(req))
                                    .setMethod("getReviewById")
                                    .isValidateRole("REVIEW")
                                    .isLogicalDelete()
                                    .setFilters(filters)
                                    .setDynamicRoleValidationByEntityField([
                                        ["CUSTOMER", "customer.id"],
                                        ["LEGAL_REPRESENTATIVE", "appointment.supplier.legal_representative.id"]
                                      ])
                                    .build();
        
            this.getController().getById(requestHandler);
        });
        
        this.router.get(`${this.getRouterName()}/get_all`, async (req: Request, res: Response) => {
            const filters = this.buildBaseFilters();

            const apointment_id: string | null = getUrlParam("apointment_id", req) || null;
            if (apointment_id != "") {
                filters.where = { ...filters.where, appointment: { id: apointment_id} };
            }

            const customer_id: string | null = getUrlParam("customer_id", req) || null;
            if (customer_id != "") {
                filters.where = { ...filters.where, customer: { id: customer_id} };
            }
        
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new ReviewDTO(req))
                                    .setMethod("getReviews")
                                    .isValidateRole("REVIEW")
                                    .isLogicalDelete()
                                    .setFilters(filters)
                                    .setDynamicRoleValidationByEntityField([
                                        ["CUSTOMER", "customer.id"],
                                        ["LEGAL_REPRESENTATIVE", "appointment.supplier.legal_representative.id"]
                                      ])
                                    .build();
        
            this.getController().getAll(requestHandler);
        });
        
        this.router.post(`${this.getRouterName()}/add`, async (req: Request, res: Response) => {

            const requiredBodyList: Array<string> = [
                req.body.customer_id
            ];
            
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new ReviewDTO(req))
                                    .setMethod("insertReview")
                                    .setRequiredFiles(requiredBodyList)
                                    .isValidateRole("REVIEW")
                                    .build();
        
            this.getController().insert(requestHandler);
        });
        
        this.router.put(`${this.getRouterName()}/edit`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new ReviewDTO(req))
                                    .setMethod("updateReview")
                                    .isValidateRole("REVIEW")
                                    .setDynamicRoleValidationByEntityField([
                                        ["CUSTOMER", "customer.id"],
                                        ["LEGAL_REPRESENTATIVE", "appointment.supplier.legal_representative.id"]
                                      ])
                                    .build();
        
            this.getController().update(requestHandler);
        });
        
        this.router.delete(`${this.getRouterName()}/delete`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new ReviewDTO(req))
                                    .setMethod("deleteReview")
                                    .isValidateRole("REVIEW")
                                    .isLogicalDelete()
                                    .setDynamicRoleValidationByEntityField([
                                        ["CUSTOMER", "customer.id"],
                                        ["LEGAL_REPRESENTATIVE", "appointment.supplier.legal_representative.id"]
                                      ])
                                    .build();
        
            this.getController().delete(requestHandler);
        });
    }
}

export default ReviewRoutes;
