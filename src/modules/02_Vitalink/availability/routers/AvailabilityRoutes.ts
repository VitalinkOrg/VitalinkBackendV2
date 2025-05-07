import { Request, Response, 
         RequestHandler, RequestHandlerBuilder, 
         GenericController, GenericRoutes,
         FindManyOptions,
         getUrlParam} from "@modules/index";
import { Availability } from "@index/entity/Availability";
import AvailabilityDTO from "@modules/02_Vitalink/availability/dtos/AvailabilityDTO";

class AvailabilityRoutes extends GenericRoutes {
    
    private filters: FindManyOptions = {};
    constructor() {
        super(new GenericController(Availability), "/availability");
        this.filters.relations = ["supplier","location"];
    }

    protected initializeRoutes() {
        this.router.get(`${this.getRouterName()}/get`, async (req: Request, res: Response) => {

            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new AvailabilityDTO(req))
                                    .setMethod("getAvailabilityById")
                                    .isValidateRole("AVAILABILITY")
                                    .setFilters(this.filters)
                                    .setDynamicRoleValidationByEntityField([
                                        ["LEGAL_REPRESENTATIVE", "supplier.legal_representative.id"]
                                      ])
                                    .build();
        
            this.getController().getById(requestHandler);
        });
        
        this.router.get(`${this.getRouterName()}/get_all`, async (req: Request, res: Response) => {

            const supplier_id: string | null = getUrlParam("supplier_id", req) || null;
            if (supplier_id != "") {
                this.filters.where = { ...this.filters.where, supplier: { id: supplier_id} };
            }
        
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new AvailabilityDTO(req))
                                    .setMethod("getAvailabilitys")
                                    .isValidateRole("AVAILABILITY")
                                    .setFilters(this.filters)
                                    .setDynamicRoleValidationByEntityField([
                                        ["LEGAL_REPRESENTATIVE", "supplier.legal_representative.id"]
                                      ])
                                    .build();
        
            this.getController().getAll(requestHandler);
        });
        
        this.router.post(`${this.getRouterName()}/add`, async (req: Request, res: Response) => {

            const requiredBodyList: Array<string> = [
                req.body.supplier_id,
                req.body.location_id,
                req.body.weekday,
                req.body.from_hour,
                req.body.to_hour
            ];
            
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new AvailabilityDTO(req))
                                    .setMethod("insertAvailability")
                                    .setRequiredFiles(requiredBodyList)
                                    .isValidateRole("AVAILABILITY")
                                    .build();
        
            this.getController().insert(requestHandler);
        });
        
        this.router.put(`${this.getRouterName()}/edit`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new AvailabilityDTO(req))
                                    .setMethod("updateAvailability")
                                    .isValidateRole("AVAILABILITY")
                                    .setDynamicRoleValidationByEntityField([
                                        ["LEGAL_REPRESENTATIVE", "supplier.legal_representative.id"]
                                      ])
                                    .build();
        
            this.getController().update(requestHandler);
        });
        
        this.router.delete(`${this.getRouterName()}/delete`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new AvailabilityDTO(req))
                                    .setMethod("deleteAvailability")
                                    .isValidateRole("AVAILABILITY")
                                    .setDynamicRoleValidationByEntityField([
                                        ["LEGAL_REPRESENTATIVE", "supplier.legal_representative.id"]
                                      ])
                                    .build();
        
            this.getController().delete(requestHandler);
        });
    }
}

export default AvailabilityRoutes;
