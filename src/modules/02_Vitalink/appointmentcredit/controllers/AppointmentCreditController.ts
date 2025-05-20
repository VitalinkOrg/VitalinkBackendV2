import { ConstHTTPRequest, ConstMessagesJson, ConstStatusJson } from "@TenshiJS/consts/Const";
import { FindManyOptions, RequestHandler } from "@TenshiJS/generics";
import GenericController from "@TenshiJS/generics/Controller/GenericController";
import { AppointmentCredit } from "@index/entity/AppointmentCredit";


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
            
            try {
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

}
  