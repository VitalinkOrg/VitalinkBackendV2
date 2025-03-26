import { Request, Response, 
         RequestHandler, RequestHandlerBuilder, 
         GenericController, GenericRoutes,
         FindManyOptions} from "@modules/index";
import { Availability } from "@index/entity/Availability";
import AvailabilityDTO from "@modules/02_Vitalink/availability/dtos/AvailabilityDTO";

class AvailabilityRoutes extends GenericRoutes {
    
    private filters: FindManyOptions = {};
    constructor() {
        super(new GenericController(Availability), "/availability");
        this.filters.relations = ["supplier","procedure","location", "procedure.procedure"];
    }

    protected initializeRoutes() {
        this.router.get(`${this.getRouterName()}/get`, async (req: Request, res: Response) => {

            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new AvailabilityDTO(req))
                                    .setMethod("getAvailabilityById")
                                    .isValidateRole("AVAILABILITY")
                                    .setFilters(this.filters)
                                    .build();
        
            this.getController().getById(requestHandler);
        });
        
        this.router.get(`${this.getRouterName()}/get_all`, async (req: Request, res: Response) => {
        
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new AvailabilityDTO(req))
                                    .setMethod("getAvailabilitys")
                                    .isValidateRole("AVAILABILITY")
                                    .setFilters(this.filters)
                                    .build();
        
            this.getController().getAll(requestHandler);
        });
        
        this.router.post(`${this.getRouterName()}/add`, async (req: Request, res: Response) => {

            const requiredBodyList: Array<string> = [
                req.body.supplier_id,
                req.body.procedure_by_specialty_id,
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
                                    .build();
        
            this.getController().update(requestHandler);
        });
        
        this.router.delete(`${this.getRouterName()}/delete`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new AvailabilityDTO(req))
                                    .setMethod("deleteAvailability")
                                    .isValidateRole("AVAILABILITY")
                                    .build();
        
            this.getController().delete(requestHandler);
        });
    }
}

export default AvailabilityRoutes;
