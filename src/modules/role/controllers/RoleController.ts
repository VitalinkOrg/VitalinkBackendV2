import { HttpAction} from "@index/index";
import { GenericController, RequestHandler, JWTObject, RoleRepository } from "@modules/index";
import { UserRepository, User} from "@modules/user";
import { ConstFunctions, ConstHTTPRequest } from "@TenshiJS/consts/Const";
import GenericService from "@TenshiJS/generics/Services/GenericService";

export default class RoleController extends GenericController{
    
    constructor() {
        super(User, new GenericService, new UserRepository);
    }
   
    async getAll(reqHandler: RequestHandler){

        const httpExec : HttpAction = reqHandler.getResponse().locals.httpExec;
    
        try{
            const jwtData : JWTObject = reqHandler.getResponse().locals.jwtData;
            if(await this.validateRole(reqHandler,  jwtData.role, ConstFunctions.GET_ALL, httpExec) !== true){ return; }
    
            const roleRepository : RoleRepository = await RoleRepository.getInstance();
            const roles = await  roleRepository.getRoles();
            return httpExec.successAction(roles, ConstHTTPRequest.GET_ALL_SUCCESS);
            
        }catch(error : any){
            return await httpExec.generalError(error, reqHandler.getMethod(), this.getControllerName());
        }
    }
}