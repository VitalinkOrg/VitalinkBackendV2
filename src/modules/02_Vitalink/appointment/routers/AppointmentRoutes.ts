import { Request, Response, 
         RequestHandler, RequestHandlerBuilder, 
         GenericRoutes,
         FindManyOptions} from "@modules/index";
import AppointmentDTO from "@modules/02_Vitalink/appointment/dtos/AppointmentDTO";
import AppointmentController from "../controllers/AppointmentController";

class AppointmentRoutes extends GenericRoutes {
    
    private buildBaseFilters(): FindManyOptions {
        return {
            relations: [
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
                "appointment_result"],
            where: {} 
        };
    }

    constructor() {
        super(new AppointmentController(), "/appointment");
    }

    protected initializeRoutes() {
        this.router.get(`${this.getRouterName()}/get`, async (req: Request, res: Response) => {
            const filters = this.buildBaseFilters();

            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new AppointmentDTO(req))
                                    .setMethod("getAppointmentById")
                                    .isValidateRole("APPOINTMENT")
                                    .isLogicalDelete()
                                    .setFilters(filters)
                                    .setDynamicRoleValidationByEntityField([
                                        ["CUSTOMER", "customer.id"],
                                        ["LEGAL_REPRESENTATIVE", "supplier.legal_representative.id"]
                                      ])
                                    .build();
        
            this.getController().getById(requestHandler);
        });
        
        this.router.get(`${this.getRouterName()}/get_all`, async (req: Request, res: Response) => {
            const filters = this.buildBaseFilters();

            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new AppointmentDTO(req))
                                    .setMethod("getAppointments")
                                    .isValidateRole("APPOINTMENT")
                                    .isLogicalDelete()
                                    .setFilters(filters)
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
                req.body.package_id,
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

            const filters = this.buildBaseFilters();
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new AppointmentDTO(req))
                                    .setMethod("updateAppointment")
                                    .isValidateRole("APPOINTMENT")
                                    .setFilters(filters)
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
                                    .setMethod("confirm_valoration_appointment")
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
                                    .setMethod("success_payment_valoration_appointment")
                                    .isValidateRole("APPOINTMENT")
                                    .setDynamicRoleValidationByEntityField([
                                        ["CUSTOMER", "customer.id"]
                                        ])
                                    .build();
        
            (this.getController() as AppointmentController).StepByStepReservationAppointment(requestHandler,3);
        });


         //Step 4 - Medico Subir proforma Medica + Realiza Valoracion
         this.router.put(`${this.getRouterName()}/upload_proforma`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new AppointmentDTO(req))
                                    .setMethod("upload_proforma")
                                    .isValidateRole("APPOINTMENT")
                                    .setDynamicRoleValidationByEntityField([
                                        ["LEGAL_REPRESENTATIVE", "supplier.legal_representative.id"]
                                        ])
                                    .build();
        
            (this.getController() as AppointmentController).StepByStepReservationAppointment(requestHandler,4);
        });





        //************************************ */
        /*              Procedimiento          */
        //************************************ */
        //Step 5 - Paciente pulsa Reservar Procedimiento
        this.router.put(`${this.getRouterName()}/reserve_procedure`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new AppointmentDTO(req))
                                    .setMethod("reserve_procedure")
                                    .isValidateRole("APPOINTMENT")
                                    .setDynamicRoleValidationByEntityField([
                                        ["CUSTOMER", "customer.id"]
                                        ])
                                    .build();
        
            (this.getController() as AppointmentController).StepByStepReservationAppointment(requestHandler,5);
        });


         //Step 6 - Medico confirma Reserva
         this.router.put(`${this.getRouterName()}/confirm_procedure`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new AppointmentDTO(req))
                                    .setMethod("confirm_procedure")
                                    .isValidateRole("APPOINTMENT")
                                    .setDynamicRoleValidationByEntityField([
                                        ["LEGAL_REPRESENTATIVE", "supplier.legal_representative.id"]
                                        ])
                                    .build();
        
            (this.getController() as AppointmentController).StepByStepReservationAppointment(requestHandler,6);
        });


          //Step 7 - Paciente realiza pago Procedimiento
         this.router.put(`${this.getRouterName()}/success_payment_procedure`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new AppointmentDTO(req))
                                    .setMethod("success_payment_procedure")
                                    .isValidateRole("APPOINTMENT")
                                    .setDynamicRoleValidationByEntityField([
                                        ["CUSTOMER", "customer.id"]
                                        ])
                                    .build();
        
            (this.getController() as AppointmentController).StepByStepReservationAppointment(requestHandler,7);
        });


          //Step 8 - Medico asigna procedimiento Realizado
          this.router.put(`${this.getRouterName()}/set_procedure_realized`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new AppointmentDTO(req))
                                    .setMethod("set_procedure_realized")
                                    .isValidateRole("APPOINTMENT")
                                    .setDynamicRoleValidationByEntityField([
                                        ["LEGAL_REPRESENTATIVE", "supplier.legal_representative.id"]
                                        ])
                                    .build();
        
            (this.getController() as AppointmentController).StepByStepReservationAppointment(requestHandler,8);
        });
    }
}

export default AppointmentRoutes;
