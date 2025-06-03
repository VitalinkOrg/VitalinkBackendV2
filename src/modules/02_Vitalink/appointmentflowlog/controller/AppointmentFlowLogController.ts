import { ConstHTTPRequest, ConstMessagesJson, ConstStatusJson } from "@TenshiJS/consts/Const";
import { FindManyOptions, RequestHandler } from "@TenshiJS/generics";
import GenericController from "@TenshiJS/generics/Controller/GenericController";
import JWTObject from "@TenshiJS/objects/JWTObject";
import HttpAction from "@TenshiJS/helpers/HttpAction";
import { AppointmentFlowLog } from "@index/entity/AppointmentFlowLog";
import { getUrlParam } from "@TenshiJS/utils/generalUtils";

export default class AppointmentFlowLogController extends GenericController {

    constructor() {
      super(AppointmentFlowLog);
    }

    async getAll(reqHandler: RequestHandler): Promise<any> {

        return this.getService().getAllService(reqHandler, async (jwtData : JWTObject, httpExec: HttpAction, page: number, size: number) => {
            try {

                 const appointment_id : string | null = getUrlParam("appointment_id", reqHandler.getRequest()) || null;
                 const filters: FindManyOptions = reqHandler.getFilters() ?? {};
                            
                if(appointment_id != null){
                    filters.where = { ...filters.where, appointment: {id: appointment_id}};
                }else{
                    return httpExec.paramsError();
                }
                
                // Execute the get all action in the database
                const entities = await this.getRepository().findAll(reqHandler.getLogicalDelete(), reqHandler.getFilters(), page, size);
                const pagination = await this.getRepository().count(reqHandler.getLogicalDelete(), reqHandler.getFilters(), page, size);

                if(entities != null && entities != undefined){
                    // Return the success response
                    return httpExec.successAction(
                        reqHandler.getAdapter().entitiesToResponse(entities), 
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
