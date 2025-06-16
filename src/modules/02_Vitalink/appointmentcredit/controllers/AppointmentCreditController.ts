import { ConstHTTPRequest, ConstMessagesJson, ConstStatusJson } from "@TenshiJS/consts/Const";
import { FindManyOptions, RequestHandler } from "@TenshiJS/generics";
import GenericController from "@TenshiJS/generics/Controller/GenericController";
import { AppointmentCredit } from "@index/entity/AppointmentCredit";
import { handleFlowNotificationAndLog } from "../../appointment/utils/AppointmentUtils";
import GenericRepository from "@TenshiJS/generics/Repository/GenericRepository";
import { Appointment } from "@index/entity/Appointment";


export default class AppointmentCreditController extends GenericController {

    constructor() {
      super(AppointmentCredit);
    }

    private async validateActiveCredit(id: number | string, httpExec: any, filters: FindManyOptions): Promise<any | null> {
    
        const appointmentCredit = await this.getRepository().findAll(true, filters,1,10);

        if (appointmentCredit != null && appointmentCredit.length > 0) {
            const appointmentCreditEntity = appointmentCredit[0];

            const { credit_status_code, already_been_used, max_date_active } = appointmentCreditEntity;
            if (credit_status_code !== "APPROVED" && credit_status_code !== "APPROVED_PERCENTAGE") {
                return httpExec.dynamicErrorMessageDirectly(
                    ConstStatusJson.VALIDATIONS,
                    "El crédito no ha sido aprobado"
                );
            }

            if (already_been_used === 1) {
                return httpExec.dynamicErrorMessageDirectly(
                    ConstStatusJson.VALIDATIONS,
                    "El crédito ya fue utilizado"
                );
            }

            if (max_date_active !== null && max_date_active <= new Date()) {
                return httpExec.dynamicErrorMessageDirectly(
                    ConstStatusJson.VALIDATIONS,
                    "El crédito ha superado su fecha límite de uso"
                );
            }
        }

        return null; // válido o sin crédito, se permite continuar
    }


    async update(reqHandler: RequestHandler): Promise<any> {
  
        return this.getService().updateService(reqHandler, async (jwtData, httpExec, id) => {

            const filters : FindManyOptions = {
                ...reqHandler.getFilters(),
                where: {
                    id: id, 
                }
            }

            // Get data from the body
            const body = reqHandler.getAdapter().entityFromPutBody();

            //Si el body tiene el campo already_been_used, se valida el credito activo
            if(reqHandler.getRequest().body.already_been_used != undefined){
                const creditValidationError = await this.validateActiveCredit(id!!, httpExec, filters);
                if (creditValidationError != null) return;
            }

            //si el body tiene el campo credit_status_code, se valida que tambien tenga el pagare file code
            if (body.credit_status_code == "APPROVED") {
                if(body.pagare_file_code == null || body.pagare_file_code == undefined){
                    return httpExec.validationError(ConstMessagesJson.REQUIRED_FIELDS);
                }
            }

            //Si el role es Entidad financiera, y esta aprovando o rechazando el credito, mande un email y notification.
             if(jwtData!.role == "FINANCE_ENTITY" || jwtData!.role == "SUPER_ADMIN"){

                //validate if credit exist, this code is for can be use the appointment object
                const appointmentCredit = await this.getRepository().findById(id!!, true, 
                    {
                        relations: [ 
                            'appointment', 
                            'appointment.customer', 
                            'appointment.customer.finance_entity',
                            'appointment.supplier',
                            'appointment.supplier.legal_representative',
                            "appointment.package",
                            "appointment.package.procedure",
                            "appointment.package.product"]
                    });

                if(appointmentCredit == null || appointmentCredit == undefined){
                    return httpExec.dynamicErrorMessageDirectly(ConstStatusJson.NOT_FOUND, "The Appointment Credit doesnt exists");
                }

                //STEP 2 CREDIT REQUEST APPROVED OR REJECTED
                //if the credit is approved or approved percentage, send notification and log
                //if the credit is rejected, send notification and log
                if(body.credit_status_code != undefined){
                    if(body.credit_status_code == "APPROVED" ||
                        body.credit_status_code == "APPROVED_PERCENTAGE"){

                            await handleFlowNotificationAndLog({
                                    acronymous: "appointmentCreditStep2",
                                    appointment: appointmentCredit.appointment,
                                    appointmentCredit: appointmentCredit,
                                    userId: jwtData!.id,
                                    language: appointmentCredit.appointment.customer.language!,
                                    flowEventCode: body.credit_status_code,
                                    userReceiveId: appointmentCredit.appointment.customer.id,
                                    variables: ["Amount", "financeEntityName", "procedureName", "productName"]
                            });
                    }else{

                            await handleFlowNotificationAndLog({
                                    acronymous: "appointmentCreditStep2No",
                                    appointment: appointmentCredit.appointment,
                                    appointmentCredit: appointmentCredit,
                                    userId: jwtData!.id,
                                    language: appointmentCredit.appointment.customer.language!,
                                    flowEventCode: "REJECTED",
                                    userReceiveId: appointmentCredit.appointment.customer.id,
                                    variables: ["Amount", "financeEntityName", "procedureName", "productName"]
                            });
                    }
                }
                


                if(body.already_been_used != undefined && body.already_been_used == 1){
                    //STEP 4   CREDIT REQUEST USED
                    await handleFlowNotificationAndLog({
                            acronymous: "appointmentCreditStep4",
                            appointment: appointmentCredit.appointment,
                            appointmentCredit: appointmentCredit,
                            userId: jwtData!.id,
                            language: appointmentCredit.appointment.customer.language!,
                            flowEventCode: null,
                            userReceiveId: appointmentCredit.appointment.customer.id,
                            variables: ["supplierName", "patientName", "procedureName", "productName"]
                    });
                }
            }
                 
            
            try {
                // Execute the update action in the database
                const updateEntity = await this.getRepository().update(id!!, body,reqHandler.getLogicalDelete());

                if(updateEntity == null){
                    return httpExec.dynamicError(ConstStatusJson.NOT_FOUND, ConstMessagesJson.DONT_EXISTS);
                }

                const codeResponse : string = 
                reqHandler.getCodeMessageResponse() != null ? 
                reqHandler.getCodeMessageResponse() as string :
                ConstHTTPRequest.UPDATE_SUCCESS;

                // Return the success response
                return httpExec.successAction(
                    reqHandler.getAdapter().entityToResponse(updateEntity), 
                    codeResponse);

            } catch (error: any) {
                // Return the database error response
                return await httpExec.databaseError(error, jwtData.id.toString(), 
                reqHandler.getMethod(), this.getControllerName());
            }
        });
     }


      async insert(reqHandler: RequestHandler) : Promise<any> {
            return this.getService().insertService(reqHandler, async (jwtData, httpExec, body) => {

                const appointmentRepository = await new GenericRepository(Appointment);
                  
                 // Set the user ID of the entity with the ID of the JWT
                body = this.setUserId(body, jwtData!.id);

                const appointment = await appointmentRepository.findById(body.appointment, true, 
                    { relations: [
                        "package",
                        "package.specialty.medical_specialty",
                        "package.procedure",
                        "package.product"]
                });
                    
                if(appointment == null || appointment == undefined){
                    return httpExec.dynamicErrorMessageDirectly(ConstStatusJson.NOT_FOUND, "The Appointment doesnt exists");
                }
                   
                try{
                   
                    // Insert the entity into the database
                    const createdEntity = await this.getRepository().add(body);

                      await handleFlowNotificationAndLog({
                            acronymous: "appointmentCreditStep1",
                            appointment: appointment,
                            appointmentCredit: createdEntity,
                            userId: jwtData!.id,
                            language: appointment.customer.language!,
                            flowEventCode: "REQUIRED",
                            userReceiveId: appointment.customer.id,
                            variables: ["supplierName", "patientName", "requestAmount", "procedureName", "productName"]
                    });

                    // Return the success response
                    return httpExec.successAction( reqHandler.getAdapter().entityToResponse(createdEntity), ConstHTTPRequest.INSERT_SUCCESS);
        
                } catch (error : any) {
                     // Return a database error response
                     return await httpExec.databaseError(error, jwtData!.id.toString(),
                     reqHandler.getMethod(), this.getControllerName());
                }
            });
        }

}
  