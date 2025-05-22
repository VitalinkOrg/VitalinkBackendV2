import { ConstHTTPRequest, ConstMessagesJson, ConstStatusJson } from "@TenshiJS/consts/Const";
import { FindManyOptions, RequestHandler } from "@TenshiJS/generics";
import GenericController from "@TenshiJS/generics/Controller/GenericController";
import GenericRepository from "@TenshiJS/generics/Repository/GenericRepository";
import { Appointment } from "@index/entity/Appointment";
import { AppointmentFlowLog } from "@index/entity/AppointmentFlowLog";
import { AppointmentCredit } from "@index/entity/AppointmentCredit";
import { Package } from "@index/entity/Package";
import JWTObject from "@TenshiJS/objects/JWTObject";
import HttpAction from "@TenshiJS/helpers/HttpAction";
import { In } from "typeorm";


export default class AppointmentController extends GenericController {
    private appointmentFlowLogRepository = new GenericRepository(AppointmentFlowLog);
    private appointmentCreditRepository = new GenericRepository(AppointmentCredit);
    private packageRepository = new GenericRepository(Package);

    constructor() {
      super(Appointment);
    }

    private async validateActiveCredit(id: number | string, httpExec: any): Promise<any | null> {
        const filters: FindManyOptions = {
            relations: [
                "appointment",
                "credit_status",
                "appointment.package",
                "appointment.package.specialty.medical_specialty",
                "appointment.package.procedure",
                "appointment.package.product"
            ],
            where: { appointment: { id } }
        };

        const appointmentCredit = await this.appointmentCreditRepository.findAll(true, filters);

        if (appointmentCredit != null && appointmentCredit.length > 0) {
            const appointmentCreditEntity = appointmentCredit[0];

            const { credit_status_code, already_been_used, max_date_active } = appointmentCreditEntity;

            if (credit_status_code !== "APPROVED" && credit_status_code !== "APPROVED_PERCENTAGE") {
                return httpExec.dynamicErrorMessageDirectly(
                    ConstStatusJson.VALIDATIONS,
                    "El crédito no ha sido aprobado"
                );
            }

            if (already_been_used === true) {
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


     async StepByStepReservationAppointment(reqHandler: RequestHandler, step: number): Promise<any> {
          return this.getService().updateService(reqHandler, async (jwtData, httpExec, id) => {

            const body = reqHandler.getAdapter().entityFromPutBody();
            const appointment = await this.getRepository().findById(id!!, true, null);
            const messageWithoutProcedure : string = "El paciente no es apto para procedimiento medico";
            
            try {

                //Step 2 - Medico Confirmar Cita
                //Step 4 - Medico Subir proforma Medica + Realiza Valoracion
                //Step 6 - Medico confirma Reserva
                //Step 8 - Medico asigna procedimiento Realizado
                if(step == 2 || step == 4 || step == 6 || step == 8){
                    if(jwtData.role == "CUSTOMER" || jwtData.role == "FINANCE_ENTITY"){
                        return httpExec.unauthorizedError(ConstMessagesJson.ROLE_AUTH_ERROR);
                    }
                //Step 3 - Paciente Paga cita valoracion
                //Step 5 - Paciente pulsa Reservar Procedimiento
                //Step 7 - Paciente realiza pago Procedimiento
                //Se comenta el step 3 y 7 porque el medico puede marcar como pagado en consultorio tanto la vita de valoracion como el procedimiento
                }else if(/*step == 3 || */step == 5 /*|| step == 7*/){
                    if(jwtData.role == "LEGAL_REPRESENTATIVE" || jwtData.role == "FINANCE_ENTITY"){
                        return httpExec.unauthorizedError(ConstMessagesJson.ROLE_AUTH_ERROR);
                    }
                }

                //************************************ */
                /*         Cita de Valoracion          */
                //************************************ */
                //Step 2 - Medico Confirmar Cita
                if(step == 2){
                    body.reservation_type_code = "RESERVATION_VALORATION_APPOINTMENT";
                    body.appointment_status_code = "CONFIRM_VALIDATION_APPOINTMENT";
                    body.appointment_type_code = "VALORATION_APPOINTMENT";
                }

                //Step 3 - Paciente Paga cita valoracion desde web, o el medico cambia estado de pago si el cliente pago en consulta
                else if(step == 3){
                     //Necesita metodo de pago
                    
                     if(body.payment_method_code == null || body.payment_method_code == undefined){
                        return httpExec.validationError(ConstMessagesJson.REQUIRED_FIELDS);
                    }

                    body.payment_status_code = "PAYMENT_STATUS_PAID_VALORATION_APPOINTMENT";

                    body.reservation_type_code = "RESERVATION_VALORATION_APPOINTMENT";
                    body.appointment_status_code = "VALUATION_PENDING_VALORATION_APPOINTMENT";
                    body.appointment_type_code = "VALORATION_APPOINTMENT";
                }

                //Step 4 - Medico Subir proforma Medica + Realiza Valoracion
                else if(step == 4){

                    if(body.appointment_result_code == null || body.appointment_result_code == undefined){
                        return httpExec.validationError(ConstMessagesJson.REQUIRED_FIELDS);
                    }

                    //Si si es apto apra procedimiento, necesita subir proforma file
                    if(body.appointment_result_code == "FIT_FOR_PROCEDURE"){
                        //Necesita subir proforma medica
                        if(body.proforma_file_code == null || body.proforma_file_code == undefined){
                            return httpExec.validationError(ConstMessagesJson.REQUIRED_FIELDS);
                        }
                    }

                    body.reservation_type_code = "RESERVATION_VALORATION_APPOINTMENT";
                    body.appointment_status_code = "VALUED_VALORATION_APPOINTMENT";
                    body.appointment_type_code = "VALORATION_APPOINTMENT";
                }


                //************************************ */
                /*              Procedimiento          */
                //************************************ */
                //si el paciente no es fit for procedure no puede reservar procedimiento ni realizar ninguna accion posterior.
                //en este punto el paciente peude solicitar credito o reservar procedimiento para pagar despues
                //Step 5 - Paciente pulsa Reservar Procedimiento
                else if(step == 5){

                    //Si el paciente reserva el procedimiento sigue el flujo normal (eso quiere decir que es posible que no necesite credito)
                    //Pero si el paciente si requiere credito, entonces debe preguntar aca si el credito es aprobado o no, y si se encuentra activo o no.
                    const creditValidationError = await this.validateActiveCredit(id!!, httpExec);
                    if (creditValidationError != null) return;

                    if(appointment.appointment_result_code == "FIT_FOR_PROCEDURE"){
                        body.reservation_type_code = "PRE_RESERVATION_PROCEDURE";
                        body.appointment_status_code = "PENDING_PROCEDURE";
                        body.appointment_type_code = "PROCEDURE_APPOINTMENT";

                        body.payment_status_code = "PAYMENT_STATUS_NOT_PAID_PROCEDURE";
                    }else{
                        return httpExec.dynamicErrorMessageDirectly(ConstStatusJson.VALIDATIONS, messageWithoutProcedure);
                    }
                }

                //Step 6 - Medico confirma Reserva
                else if(step == 6){
                    
                    //validate if credit is active
                    const creditValidationError = await this.validateActiveCredit(id!!, httpExec);
                    if (creditValidationError != null) return;

                    if(appointment.appointment_result_code == "FIT_FOR_PROCEDURE"){
                        body.reservation_type_code = "RESERVATION_PROCEDURE";
                        body.appointment_status_code = "CONFIRM_PROCEDURE";
                        body.appointment_type_code = "PROCEDURE_APPOINTMENT";
                    }else{
                        return httpExec.dynamicErrorMessageDirectly(ConstStatusJson.VALIDATIONS, messageWithoutProcedure);
                    }
                }

                //Step 7 - Paciente realiza pago Procedimiento desde la web, o medico cambia estado de pago cuadn o el cliente muestra codigo de pago
                else if(step == 7){


                    if(appointment.appointment_result_code == "FIT_FOR_PROCEDURE"){
                        //Necesita metodo de pago
                        if(body.payment_method_code == null || body.payment_method_code == undefined){
                            return httpExec.validationError(ConstMessagesJson.REQUIRED_FIELDS);
                        }

                        body.reservation_type_code = "RESERVATION_PROCEDURE";
                        body.appointment_status_code = "WAITING_PROCEDURE";
                        body.appointment_type_code = "PROCEDURE_APPOINTMENT";

                        body.payment_status_code = "PAYMENT_STATUS_PAID_PROCEDURE";
                    }else{
                        return httpExec.dynamicErrorMessageDirectly(ConstStatusJson.VALIDATIONS, messageWithoutProcedure);
                    }
                }

                //Step 8 - Medico asigna procedimiento Realizado
                else if(step == 8){
                    if(appointment.appointment_result_code == "FIT_FOR_PROCEDURE"){
                        body.reservation_type_code = "RESERVATION_PROCEDURE";
                        body.appointment_status_code = "CONCRETED_APPOINTMENT";
                        body.appointment_type_code = "PROCEDURE_APPOINTMENT";
                    }else{
                        return httpExec.dynamicErrorMessageDirectly(ConstStatusJson.VALIDATIONS, messageWithoutProcedure);
                    }
                }

                
                // Execute the update action in the database
                const updateEntity = await this.getRepository().update(id!!, body,
                                                             reqHandler.getLogicalDelete());

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
  


    
    generateRandomCode(length: number = 7): string {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let result = '';
      
      for (let i = 0; i < length; i++) {
        const randomIdx = Math.floor(Math.random() * chars.length);
        result += chars[randomIdx];
      }
    
      return result;
    }

    //Step 1
    async insert(reqHandler: RequestHandler): Promise<any> {

        return this.getService().insertService(reqHandler, async (jwtData, httpExec, body) => {

            // Set the user ID of the entity with the ID of the JWT
            body = this.setUserId(body, jwtData!.id);

            try{
                const filters: FindManyOptions = {};
                filters.relations = ["product"];

                const packageEntity = await this.packageRepository.findById(body.package_id, true, filters);
                const rawValue = packageEntity?.product?.value1;
                body.price_procedure = isNaN(Number(rawValue)) || !rawValue?.toString().trim()
                ? 0 : Number(rawValue);

                body.appointment_qr_code = this.generateRandomCode();

                // Insert the entity into the database
                const createdEntity = await this.getRepository().add(body);

                const codeResponse : string = 
                reqHandler.getCodeMessageResponse() != null ? 
                reqHandler.getCodeMessageResponse() as string :
                ConstHTTPRequest.INSERT_SUCCESS;

                // Return the success response
                return httpExec.successAction(
                    reqHandler.getAdapter().entityToResponse(createdEntity), 
                    codeResponse);

            }catch(error : any){
                // Return the database error response

                console.log(error);
                return await httpExec.databaseError(error, jwtData!.id.toString(), 
                reqHandler.getMethod(), this.getControllerName());
            }
        });
    }






    async getAll(reqHandler: RequestHandler): Promise<any> {

        return this.getService().getAllService(reqHandler, async (jwtData : JWTObject, httpExec: HttpAction, page: number, size: number) => {
            try {

                // Execute the get all action in the database

                const entities = await this.getRepository().findAll(reqHandler.getLogicalDelete(), reqHandler.getFilters(), page, size);
                const pagination = await this.getRepository().count(reqHandler.getLogicalDelete(), reqHandler.getFilters(), page, size);

                if(entities != null && entities != undefined){

                    const entitiesRaw = entities;
                    const appointmentIds = entitiesRaw.map(e => e.id);

                    const appointmentCredits = await this.appointmentCreditRepository.findAll(true, {
                        relations: [
                            "credit_status"
                        ],
                        where: {
                            appointment: {
                                id: In(appointmentIds) // Usa In de TypeORM
                            }
                        }
                    });

                    const creditMap = new Map(
                        (appointmentCredits ?? []).map(ac => [ac.appointment.id, ac])
                    );

                    for (const appointment of entitiesRaw) {
                        appointment.appointment_credit = creditMap.get(appointment.id) ?? null;
                    }
                    
                    for (const appointment of entitiesRaw) {
                        if (appointment.appointment_credit) {
                            delete appointment.appointment_credit.appointment;
                        }
                    }

                    // Return the success response
                    return httpExec.successAction(
                        reqHandler.getAdapter().entitiesToResponse( entitiesRaw), 
                        ConstHTTPRequest.GET_ALL_SUCCESS,  pagination);

                }else{
                    return httpExec.dynamicError(ConstStatusJson.NOT_FOUND, ConstMessagesJson.DONT_EXISTS);
                }

            } catch (error: any) {
                // Return the database error response
                return await httpExec.databaseError(error, jwtData.id.toString(),
                    reqHandler.getMethod(), this.getControllerName());
            }
        });
    }

}
  