import { Request, Response, 
         RequestHandler, RequestHandlerBuilder, 
         GenericRoutes,
         FindManyOptions} from "@modules/index";
import AppointmentDTO from "@modules/02_Vitalink/appointment/dtos/AppointmentDTO";
import AppointmentController from "../controllers/AppointmentController";

class AppointmentRoutes extends GenericRoutes {
    
    private filters: FindManyOptions = {};
    constructor() {
        super(new AppointmentController(), "/appointment");
        this.filters.relations = [
            "customer",
            "reservation_type",
            "appointment_status",
            "appointment_type",
            "supplier",
            "supplier.legal_representative",
            "package",
            "package.product",
            "package.procedure",
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
                                    .setDynamicRoleValidationByEntityField([
                                        ["CUSTOMER", "customer.id"],
                                        ["LEGAL_REPRESENTATIVE", "supplier.legal_representative.id"]
                                      ])
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
                                    .setDynamicRoleValidationByEntityField([
                                        ["CUSTOMER", "customer.id"],
                                        ["LEGAL_REPRESENTATIVE", "supplier.legal_representative.id"]
                                      ])
                                    .build();
        
            this.getController().getAll(requestHandler);
        });
        
        this.router.post(`${this.getRouterName()}/add`, async (req: Request, res: Response) => {

            const requiredBodyList: Array<string> = [
                req.body.customer_id,
                req.body.appointment_date,
                req.body.appointment_hour,
                req.body.supplier_id,
            ];
            
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new AppointmentDTO(req))
                                    .setMethod("insertAppointment")
                                    .setRequiredFiles(requiredBodyList)
                                    .isValidateRole("APPOINTMENT")
                                    .setDynamicRoleValidationByEntityField([
                                        ["CUSTOMER", "customer"]
                                      ])
                                    .build();
        
            this.getController().insert(requestHandler);
        });
        
        this.router.put(`${this.getRouterName()}/edit`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new AppointmentDTO(req))
                                    .setMethod("updateAppointment")
                                    .isValidateRole("APPOINTMENT")
                                    .setDynamicRoleValidationByEntityField([
                                        ["CUSTOMER", "customer.id"],
                                        ["LEGAL_REPRESENTATIVE", "supplier.legal_representative.id"]
                                      ])
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
                                    .setDynamicRoleValidationByEntityField([
                                        ["LEGAL_REPRESENTATIVE", "supplier.legal_representative.id"]
                                      ])
                                    .build();
        
            this.getController().delete(requestHandler);
        });




        /*
                HAPPY PATH
        */
       //Step 2 - Medico Confirmar Cita
        this.router.put(`${this.getRouterName()}/confirm_valoration_appointment`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new AppointmentDTO(req))
                                    .setMethod("confirmValorationAppointment")
                                    .isValidateRole("APPOINTMENT")
                                    .setDynamicRoleValidationByEntityField([
                                        ["LEGAL_REPRESENTATIVE", "supplier.legal_representative.id"]
                                        ])
                                    .build();
        
            (this.getController() as AppointmentController).StepByStepReservationAppointment(requestHandler,2);
        });




         //Step 3 - Paciente Paga cita valoracion
         this.router.put(`${this.getRouterName()}/success_payment_valoration_appointment`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new AppointmentDTO(req))
                                    .setMethod("confirmValorationAppointment")
                                    .isValidateRole("APPOINTMENT")
                                    .setDynamicRoleValidationByEntityField([
                                        ["CUSTOMER", "customer.id"]
                                        ])
                                    .build();
        
            (this.getController() as AppointmentController).StepByStepReservationAppointment(requestHandler,3);
        });
    }
}

export default AppointmentRoutes;
