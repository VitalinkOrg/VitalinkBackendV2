import { Request, Response, 
         RequestHandler, RequestHandlerBuilder, 
         GenericRoutes,
         FindManyOptions,
         getUrlParam} from "@modules/index";
import AppointmentCreditDTO from "@modules/02_Vitalink/appointmentcredit/dtos/AppointmentCreditDTO";
import AppointmentCreditController from "../controllers/AppointmentCreditController";

class AppointmentCreditRoutes extends GenericRoutes {
    
    private buildBaseFilters(): FindManyOptions {
        return {
            relations: [
                "appointment",
                "credit_status",
                "appointment.package",
                "appointment.package.specialty.medical_specialty",
                "appointment.package.procedure",
                "appointment.package.product",
                "appointment.customer",
                "appointment.customer.finance_entity",
                "appointment.supplier",
                "appointment.supplier.legal_representative",
                "appointment.payment_status",
                "appointment.payment_method",
                "appointment.appointment_result",
                "appointment.reservation_type",
                "appointment.appointment_status",
            ],

            where: {} 
        };
    }
    constructor() {
        super(new AppointmentCreditController(), "/appointmentcredit");
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
            const appointment_qr_code: string | null = getUrlParam("appointment_qr_code", req) || null;
          
            if (appointment_id != "") {
                filters.where = { ...filters.where, appointment: { id: appointment_id }  };
            }

            if (appointment_qr_code != "") {
                filters.where = { ...filters.where, appointment: { appointment_qr_code: appointment_qr_code }  };
            }

            console.log(filters);

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
                req.body.appointment
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

            const filters = this.buildBaseFilters();
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new AppointmentCreditDTO(req))
                                    .setMethod("updateAppointmentCredit")
                                    .isValidateRole("APPOINTMENT_CREDIT")
                                    .setFilters(filters)
                                     .setDynamicRoleValidationByEntityField([
                                        ["CUSTOMER", "appointment.customer.id"],
                                        ["LEGAL_REPRESENTATIVE", "appointment.supplier.legal_representative.id"],
                                        ["FINANCE_ENTITY", "appointment.customer.finance_entity.id"]
                                      ])
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
                                    .setDynamicRoleValidationByEntityField([
                                        ["CUSTOMER", "appointment.customer.id"],
                                        ["LEGAL_REPRESENTATIVE", "appointment.supplier.legal_representative.id"],
                                        ["FINANCE_ENTITY", "appointment.customer.finance_entity.id"]
                                      ])
                                    .build();
        
            this.getController().delete(requestHandler);
        });
    }
}

export default AppointmentCreditRoutes;
