import { Request, Response, 
         RequestHandler, RequestHandlerBuilder, 
         GenericController, GenericRoutes,
         FindManyOptions} from "@modules/index";
import { Appointment } from "@index/entity/Appointment";
import AppointmentDTO from "@modules/02_Vitalink/appointment/dtos/AppointmentDTO";

class AppointmentRoutes extends GenericRoutes {
    
    private filters: FindManyOptions = {};
    constructor() {
        super(new GenericController(Appointment), "/appointment");
        this.filters.relations = [
            "customer",
            "reservation_type",
            "appointment_status",
            "supplier",
            "package",
            "procedure",
            "payment_status",
            "payment_method",
            "appointment_result"];
    }

    protected initializeRoutes() {
        this.router.get(`${this.getRouterName()}/get`, async (req: Request, res: Response) => {

            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new AppointmentDTO(req))
                                    .setMethod("getAppointmentById")
                                    .isValidateRole("APPOINTMENT")
                                    .isLogicalDelete()
                                    .setFilters(this.filters)
                                    .build();
        
            this.getController().getById(requestHandler);
        });
        
        this.router.get(`${this.getRouterName()}/get_all`, async (req: Request, res: Response) => {
        
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new AppointmentDTO(req))
                                    .setMethod("getAppointments")
                                    .isValidateRole("APPOINTMENT")
                                    .isLogicalDelete()
                                    .setFilters(this.filters)
                                    .build();
        
            this.getController().getAll(requestHandler);
        });
        
        this.router.post(`${this.getRouterName()}/add`, async (req: Request, res: Response) => {

            const requiredBodyList: Array<string> = [
                req.body.customer,
                req.body.appointment_date,
                req.body.appointment_hour,
                req.body.reservation_type,
                req.body.supplier,
            ];
            
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new AppointmentDTO(req))
                                    .setMethod("insertAppointment")
                                    .setRequiredFiles(requiredBodyList)
                                    .isValidateRole("APPOINTMENT")
                                    .build();
        
            this.getController().insert(requestHandler);
        });
        
        this.router.put(`${this.getRouterName()}/edit`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new AppointmentDTO(req))
                                    .setMethod("updateAppointment")
                                    .isValidateRole("APPOINTMENT")
                                    .build();
        
            this.getController().update(requestHandler);
        });
        
        this.router.delete(`${this.getRouterName()}/delete`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new AppointmentDTO(req))
                                    .setMethod("deleteAppointment")
                                    .isValidateRole("APPOINTMENT")
                                    .isLogicalDelete()
                                    .build();
        
            this.getController().delete(requestHandler);
        });
    }
}

export default AppointmentRoutes;
