import { Request, Response, 
         RequestHandler, RequestHandlerBuilder, 
         GenericController, GenericRoutes,
         FindManyOptions,
         getUrlParam} from "@modules/index";
import { AppointmentCredit } from "@index/entity/AppointmentCredit";
import AppointmentCreditDTO from "@modules/02_Vitalink/appointmentcredit/dtos/AppointmentCreditDTO";

class AppointmentCreditRoutes extends GenericRoutes {
    
    private buildBaseFilters(): FindManyOptions {
        return {
            relations: [
                "appointment",
            "credit_status",
            "appointment.package",
            "appointment.package.specialty.medical_specialty",
            "appointment.package.procedure",
            "appointment.package.product",],
            where: {} 
        };
    }
    constructor() {
        super(new GenericController(AppointmentCredit), "/appointmentcredit");
    }

    protected initializeRoutes() {
        this.router.get(`${this.getRouterName()}/get`, async (req: Request, res: Response) => {

            const filters = this.buildBaseFilters();
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new AppointmentCreditDTO(req))
                                    .setMethod("getAppointmentCreditById")
                                    .isValidateRole("APPOINTMENT_CREDIT")
                                    .isLogicalDelete()
                                    .setFilters(filters)
                                    .setDynamicRoleValidationByEntityField([
                                        ["CUSTOMER", "appointment.customer.id"],
                                        ["LEGAL_REPRESENTATIVE", "appointment.supplier.legal_representative.id"],
                                        ["FINANCE_ENTITY", "appointment.customer.finance_entity.id"]
                                      ])
                                    .build();
        
            this.getController().getById(requestHandler);
        });
        
        this.router.get(`${this.getRouterName()}/get_all`, async (req: Request, res: Response) => {

            const filters = this.buildBaseFilters();

            const appointment_id: string | null = getUrlParam("appointment_id", req) || null;
          
            if (appointment_id != "") {
                filters.where = { ...filters.where, appointment: { id: appointment_id }  };
            }

           

            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new AppointmentCreditDTO(req))
                                    .setMethod("getAppointmentCredits")
                                    .isValidateRole("APPOINTMENT_CREDIT")
                                    .isLogicalDelete()
                                    .setFilters(filters)
                                    .setDynamicRoleValidationByEntityField([
                                        ["CUSTOMER", "appointment.customer.id"],
                                        ["LEGAL_REPRESENTATIVE", "appointment.supplier.legal_representative.id"],
                                        ["FINANCE_ENTITY", "appointment.customer.finance_entity.id"]
                                      ])
                                    .build();
        
            this.getController().getAll(requestHandler);
        });
        
        this.router.post(`${this.getRouterName()}/add`, async (req: Request, res: Response) => {

            const requiredBodyList: Array<string> = [
                req.body.appointment,
                req.body.credit_status
            ];
            
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new AppointmentCreditDTO(req))
                                    .setMethod("insertAppointmentCredit")
                                    .setRequiredFiles(requiredBodyList)
                                    .isValidateRole("APPOINTMENT_CREDIT")
                                    .build();
        
            this.getController().insert(requestHandler);
        });
        
        this.router.put(`${this.getRouterName()}/edit`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new AppointmentCreditDTO(req))
                                    .setMethod("updateAppointmentCredit")
                                    .isValidateRole("APPOINTMENT_CREDIT")
                                    .build();
        
            this.getController().update(requestHandler);
        });
        
        this.router.delete(`${this.getRouterName()}/delete`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new AppointmentCreditDTO(req))
                                    .setMethod("deleteAppointmentCredit")
                                    .isValidateRole("APPOINTMENT_CREDIT")
                                    .isLogicalDelete()
                                    .build();
        
            this.getController().delete(requestHandler);
        });
    }
}

export default AppointmentCreditRoutes;
