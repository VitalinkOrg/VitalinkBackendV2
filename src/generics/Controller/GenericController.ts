import { JWTObject, Validations, HttpAction } from "@index/index"
import { EntityTarget, RequestHandler } from '@generics/index';

import RoleRepository from "@user/repositories/RoleRepository"
import IGenericRepository from '@generics/Repository/IGenericRepository';
import GenericRepository from '@generics/Repository/GenericRepository';

import IGenericController from '@generics/Controller/IGenericController';
import { RoleFunctionallity } from '@entity/RoleFunctionallity';
import ControllerObject from '@objects/ControllerObject';

import { createControllerObject } from '@patterns/ControllerObjectFactory';
import {default as config} from "@root/unbreakable-config";

/*
    This class have the necessary methods (CRUDS) to send into the routing
    You need to send the entity type, the models generated by de TYPE ORM &&
    Then you send the controller object, with all the specific names of the specific entity
    PD: IF YOU NEED TO OVERRIDE OR ADDED MORE METHODS, YOU NEED TO CREATE ANOTHER CONTROLLER AND EXTEND THIS
*/7
export default  class GenericController implements IGenericController{
    public controllerObj: ControllerObject;
    protected entityType : EntityTarget<any>;
    protected roleRepository : RoleRepository;
    protected repository : IGenericRepository;

    //We need the type of the entity of ORM, and the controller Obj as well
    constructor(entityType: EntityTarget<any>, repositoryClass: IGenericRepository | null = null) {
        this.controllerObj = createControllerObject(entityType);

        this.entityType = entityType;
        this.roleRepository = new RoleRepository();
        if(repositoryClass == null){
            this.repository = new GenericRepository(this.entityType);
        }else{
            this.repository = repositoryClass;
        }
    }

    //This function is for insert
    async insert(reqHandler: RequestHandler): Promise<any> {
        const successMessage : string = "INSERT_SUCCESS";

        //This is for execute the returns structure
        const httpExec : HttpAction = reqHandler.getResponse().locals.httpExec;
        try{
            //This is for do validations
            const validation : Validations = reqHandler.getResponse().locals.validation;
            //This calls the jwt data into JWTObject
            const jwtData : JWTObject = reqHandler.getResponse().locals.jwtData;

            if(await this.validateRole(reqHandler,  jwtData.role, this.controllerObj.create, httpExec) !== true){ return; }
            if(!this.validateRequiredFields(reqHandler, validation)){ return; };
            if(!this.validateRegex(reqHandler, validation)){ return; };
           
            //Get data From Body
            let body = reqHandler.getAdapter().entityFromPostBody();
            body = this.setUserId(body, jwtData.id);

            try{
                //Execute Action DB
                const createdEntity = await this.repository.add(body);
                //return the success
                return httpExec.successAction(reqHandler.getAdapter().entityToResponse(createdEntity), successMessage);

            }catch(error : any){
                return await httpExec.databaseError(error, jwtData.id.toString(), 
                reqHandler.getMethod(), this.controllerObj.controller);
            }
        }catch(error : any){
            return await httpExec.generalError(error, reqHandler.getMethod(), this.controllerObj.controller);
        }
     }


     async update(reqHandler: RequestHandler): Promise<any>{
        const successMessage : string = "UPDATE_SUCCESS";
        const httpExec : HttpAction = reqHandler.getResponse().locals.httpExec;

        try{
             //This is for do validations
             const validation : Validations = reqHandler.getResponse().locals.validation;
             //This calls the jwt data into JWTObject
             const jwtData : JWTObject = reqHandler.getResponse().locals.jwtData;
             //get the id from URL params
            const id =  (this.getIdFromQuery(validation, httpExec) as number); 

            if(await this.validateRole(reqHandler, jwtData.role, this.controllerObj.update, httpExec) !== true){ return; }
            if(!this.validateRegex(reqHandler, validation)){ return; };

            //If you need to validate if the user id of the table 
            //should be the user id of the user request (JWT)
            await this.validateUserIdByIdOrCodeEntity(reqHandler, httpExec, jwtData, id);
            
            //Get data From Body
            const body = reqHandler.getAdapter().entityFromPutBody();

            try{
                //Execute Action DB
                const updateEntity = await this.repository.update(id, body,  
                                                             reqHandler.getNeedLogicalRemove());
                return httpExec.successAction(reqHandler.getAdapter().entityToResponse(updateEntity), successMessage);

            }catch(error : any){
                return await httpExec.databaseError(error, jwtData.id.toString(), 
                reqHandler.getMethod(), this.controllerObj.controller);
            }
        }catch(error : any){
            return await httpExec.generalError(error, reqHandler.getMethod(), this.controllerObj.controller);
        }
     }


     async delete(reqHandler: RequestHandler): Promise<any> {
        const successMessage : string = "DELETE_SUCCESS";
        const httpExec : HttpAction = reqHandler.getResponse().locals.httpExec;

        try{
             //This is for do validations
             const validation : Validations = reqHandler.getResponse().locals.validation;
             //This calls the jwt data into JWTObject
             const jwtData : JWTObject = reqHandler.getResponse().locals.jwtData;
             //get the id from URL params
             const id =  (this.getIdFromQuery(validation, httpExec) as number); 

             if(await this.validateRole(reqHandler, jwtData.role, this.controllerObj.delete, httpExec) !== true){ return; }
             await this.validateUserIdByIdOrCodeEntity(reqHandler, httpExec, jwtData, id);


            try{
                //Execute Action DB
                if(reqHandler.getNeedLogicalRemove()){
                    const deletedEntity = await this.repository.logicalRemove(id);
                    return httpExec.successAction(reqHandler.getAdapter().entityToResponse(deletedEntity), successMessage);
                }else{
                    const deletedEntity = await this.repository.remove(id);
                    return httpExec.successAction(reqHandler.getAdapter().entityToResponse(deletedEntity), successMessage);
                }
                
            }catch(error : any){
                return await httpExec.databaseError(error, jwtData.id.toString(), 
                reqHandler.getMethod(), this.controllerObj.controller);
            }
        }catch(error : any){
            return await httpExec.generalError(error, reqHandler.getMethod(), this.controllerObj.controller);
        }
     }


     async getById(reqHandler: RequestHandler): Promise<any> {
        const successMessage : string = "GET_BY_ID_SUCCESS";
        const httpExec : HttpAction = reqHandler.getResponse().locals.httpExec;

        try{
             //This is for do validations
             const validation : Validations = reqHandler.getResponse().locals.validation;
             //This calls the jwt data into JWTObject
             const jwtData : JWTObject = reqHandler.getResponse().locals.jwtData;
             //get the id from URL params
             const id =  (this.getIdFromQuery(validation, httpExec) as number); 

             if(await this.validateRole(reqHandler, jwtData.role, this.controllerObj.getById, httpExec) !== true){ return; }
             await this.validateUserIdByIdOrCodeEntity(reqHandler, httpExec, jwtData, id);

            try{
                //Execute Action DB
                const entity = await this.repository.findById(id, reqHandler.getNeedLogicalRemove());
                return httpExec.successAction(reqHandler.getAdapter().entityToResponse(entity), successMessage);

            }catch(error : any){
                return await httpExec.databaseError(error, jwtData.id.toString(), 
                reqHandler.getMethod(), this.controllerObj.controller);
            }
        }catch(error : any){
            return await httpExec.generalError(error, reqHandler.getMethod(), this.controllerObj.controller);
        }
     }

     async getByCode(reqHandler: RequestHandler): Promise<any> {
        const successMessage : string = "GET_BY_ID_SUCCESS";
        const httpExec : HttpAction = reqHandler.getResponse().locals.httpExec;

        try{
             //This is for do validations
             const validation : Validations = reqHandler.getResponse().locals.validation;
             //This calls the jwt data into JWTObject
             const jwtData : JWTObject = reqHandler.getResponse().locals.jwtData;
             //get the code for Url Params

            const code = this.getCodeFromQuery(validation, httpExec) as string;

            if(await this.validateRole(reqHandler, jwtData.role, this.controllerObj.getById, httpExec) !== true){ return; }
            await this.validateUserIdByIdOrCodeEntity(reqHandler, httpExec, jwtData, code);

            try{
                //Execute Action DB
                const entity = await this.repository.findByCode(code, reqHandler.getNeedLogicalRemove());
                return httpExec.successAction(reqHandler.getAdapter().entityToResponse(entity), successMessage);

            }catch(error : any){
                return await httpExec.databaseError(error, jwtData.id.toString(), 
                reqHandler.getMethod(), this.controllerObj.controller);
            }
        }catch(error : any){
            return await httpExec.generalError(error, reqHandler.getMethod(), this.controllerObj.controller);
        }
    }


    async getAll(reqHandler: RequestHandler): Promise<any> {
        const successMessage : string = "GET_SUCCESS";
        const httpExec : HttpAction = reqHandler.getResponse().locals.httpExec;

        try{
            const jwtData : JWTObject = reqHandler.getResponse().locals.jwtData;
            if(await this.validateRole(reqHandler, jwtData.role, this.controllerObj.getAll, httpExec) !== true){ return; }

            try{
                //get by url params the page and the size of the response
                const page : number = reqHandler.getRequest().query.page ? 
                            parseInt(reqHandler.getRequest().query.page as string) : 
                            config.HTTP_REQUEST.PAGE_OFFSET;

                const size : number = reqHandler.getRequest().query.size ? 
                            parseInt(reqHandler.getRequest().query.size as string) : 
                            config.HTTP_REQUEST.PAGE_SIZE;

                //Execute Action DB
                const entities = await this.repository.findAll(reqHandler.getNeedLogicalRemove(), page, size);
                return httpExec.successAction(reqHandler.getAdapter().entitiesToResponse(entities), successMessage);
            }catch(error : any){
                return await httpExec.databaseError(error, jwtData.id.toString(), 
                reqHandler.getMethod(), this.controllerObj.controller);
            }
        }catch(error : any){
            return await httpExec.generalError(error, reqHandler.getMethod(), this.controllerObj.controller);
        }
     }


    async getByFilters(reqHandler: RequestHandler): Promise<any> {
        const successMessage : string = "GET_SUCCESS";
        const httpExec : HttpAction = reqHandler.getResponse().locals.httpExec;

        try{
            const jwtData : JWTObject = reqHandler.getResponse().locals.jwtData;
            await this.validateRole(reqHandler, jwtData.role, this.controllerObj.getById, httpExec);

            if(reqHandler.getFilters() == null){
                return httpExec.paramsError();
            }

            try{

                //get by url params the page and the size of the response
                const page : number = reqHandler.getRequest().query.page ? 
                                        parseInt(reqHandler.getRequest().query.page as string) : 
                                        config.HTTP_REQUEST.PAGE_OFFSET;

                const size : number = reqHandler.getRequest().query.size ? 
                                      parseInt(reqHandler.getRequest().query.size as string) : 
                                      config.HTTP_REQUEST.PAGE_SIZE;
                //Execute Action DB
                const entities = await this.repository.findByFilters(reqHandler.getFilters()!,
                                                                reqHandler.getNeedLogicalRemove(), page, size);
                return httpExec.successAction(reqHandler.getAdapter().entitiesToResponse(entities), successMessage);

            }catch(error : any){
                return await httpExec.databaseError(error, jwtData.id.toString(), 
                reqHandler.getMethod(), this.controllerObj.controller);
            }
        }catch(error : any){
            return await httpExec.generalError(error, reqHandler.getMethod(), this.controllerObj.controller);
        }
    }







     /**
      * This function validates the role of the user.
      * 
      * @param {RequestHandler} reqHandler - The request handler object.
      * @param {string} role - The role of the user.
      * @param {string} action - The action to be performed.
      * @param {HttpAction} httpAction - The HTTP action object.
      * @return {Promise<any>} - A promise that resolves to the result of the validation.
      */
     protected async validateRole(reqHandler: RequestHandler, role: string, action: string,  httpAction: HttpAction): Promise<any> {
        /**
         * Validates the role of the user.
         * If the user's role is required to be validated, it checks if the user has the permission for the specified action.
         * If the user does not have the permission, it returns an unauthorized error.
         * 
         * @returns {Promise<any>} A promise that resolves to the result of the validation.
         */
        if(reqHandler.getNeedValidateRole()){
            // Get the permission for the specified action and role from the role repository.
            const roleFunc : RoleFunctionallity | null = await this.roleRepository.getPermissionByFuncAndRole(role, action);
            // If the user does not have the permission, return an unauthorized error.
            if (roleFunc == null) {
                return httpAction.unauthorizedError("ROLE_AUTH_ERROR");
            }
        }

        return true;
    }

    protected validateRequiredFields(reqHandler: RequestHandler, validation: Validations){
        //validate required fields of body json
        if(reqHandler.getRequiredFieldsList() != null){
            if(!validation.validateRequiredFields(reqHandler.getRequiredFieldsList())){
                return false;
            }
        }

        return true;
    }

    protected validateRegex(reqHandler: RequestHandler, validation: Validations){
        //validate the regex of any fields
        if(reqHandler.getRegexValidatorList() != null){
            if(validation.validateMultipleRegex(reqHandler.getRegexValidatorList()) != null){
                return false;
            }
        }

        return true;
    }

    protected setUserId(body: any, id: number): any{
        //if the entity have user Id and the user sends from adapter to null
        //take the information of jwt id, and set into userId field.
        if(!('userId' in body)){
            body.userId = id;
        }
        return body;
    }

    protected async  validateUserIdByIdOrCodeEntity(reqHandler: RequestHandler, httpExec: HttpAction, jwtData: JWTObject, idOrCode: number | string) {
        let userId : number | null= null;
        if(reqHandler.getRequireValidWhereByUserId()){
            if(jwtData.role != "ADMIN"){
                userId = jwtData.id;
            }

            //call the get by id, if the user ID of the entity is different  to user ID of JWT
            //the user request dont have this authorization
            let entity = null;
            if (typeof idOrCode === 'number'){
                entity = await this.repository.findById(idOrCode, reqHandler.getNeedLogicalRemove());
            }else{
                entity = await this.repository.findByCode(idOrCode, reqHandler.getNeedLogicalRemove());
            }
            
            if(entity != undefined && entity != null){
                if(userId != null && entity.userId != userId){
                    return httpExec.unauthorizedError("ROLE_AUTH_ERROR");
                }
            }else{
                return httpExec.dynamicError("NOT_FOUND", "DONT_EXISTS");
            }
        }
    }

    protected getIdFromQuery(validation: Validations, httpExec: HttpAction){
        const id = validation.validateIdFromQuery();
        if(id == null){
            return httpExec.paramsError();
        }
        return id;
    }

    protected getCodeFromQuery(validation: Validations, httpExec: HttpAction){
        const code = validation.validateCodeFromQuery();
        if(code == null){
            return httpExec.paramsError();
        }
        return code;
    }
}