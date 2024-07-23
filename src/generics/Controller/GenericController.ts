import { JWTObject, Validations, HttpAction } from "@index/index"
import { EntityTarget, RequestHandler } from '@generics/index';

import RoleRepository from "@user/repositories/RoleRepository"
import GenericRepository from '@generics/Repository/GenericRepository';

import IGenericController from '@generics/Controller/IGenericController';
import { RoleFunctionallity } from '@entity/RoleFunctionallity';
import ControllerObject from '@objects/ControllerObject';

import { createControllerObject } from '@helpers/ControllerObjectFactory';
import {default as config} from "@root/unbreakable-config";

/*
    This class have the necessary methods (CRUDS) to send into the routing
    You need to send the entity type, the models generated by de TYPE ORM &&
    Then you send the controller object, with all the specific names of the specific entity
    PD: IF YOU NEED TO OVERRIDE OR ADDED MORE METHODS, YOU NEED TO CREATE ANOTHER CONTROLLER AND EXTEND THIS
*/

export default  class GenericController implements IGenericController{
    controllerObj: ControllerObject;
    entityType : EntityTarget<any>;

    //We need the type of the entity of ORM, and the controller Obj as well
    constructor(entityType: EntityTarget<any>) {
        this.controllerObj = createControllerObject(entityType);
        this.entityType = entityType;
    }

    //This function is for insert
    async insert(reqHandler: RequestHandler): Promise<any> {
        const successMessage : string = "INSERT_SUCCESS";
        //This is for execute the returns structure
        const httpExec = new HttpAction(reqHandler.getResponse(), this.controllerObj.controller, reqHandler.getMethod());

        try{
            //This is for use the basic CRUD
            const repository = new GenericRepository(this.entityType);
            //This is for validate role
            const roleRepository = new RoleRepository();
            //This is for do validations
            const validation = new Validations(reqHandler.getRequest(), reqHandler.getResponse(), httpExec);
            //This calls the jwt data into JWTObject
            const jwtData : JWTObject = reqHandler.getRequest().app.locals.jwtData;

            //If you need to validate the role
            if(reqHandler.getNeedValidateRole()){
                const roleFunc : RoleFunctionallity | null = await roleRepository.getPermissionByFuncAndRole(jwtData.role, this.controllerObj.create);
                if (roleFunc == null) {
                    return httpExec.unauthorizedError("ROLE_AUTH_ERROR");
                }
            }

            //validate required fields of body json
            if(reqHandler.getRequiredFieldsList() != null){
                if(!validation.validateRequiredFields(reqHandler.getRequiredFieldsList())){
                    return;
                }
            }

            //validate the regex of any fields
            if(reqHandler.getRegexValidatorList() != null){
                if(validation.validateMultipleRegex(reqHandler.getRegexValidatorList()) != null){
                    return;
                }
            }

            //Get data From Body
            const body = reqHandler.getAdapter().entityFromPostBody();

            //if the entity have user Id and the user sends from adapter to null
            //take the information of jwt id, and set into userId field.
            if('userId' in body){
                body.userId = jwtData.id;
            }

            try{
                //Execute Action DB
                const createdEntity = await repository.add(body);
                //return the success
                return httpExec.successAction(reqHandler.getAdapter().entityToResponse(createdEntity), successMessage);

            }catch(error : any){
                return await httpExec.databaseError(error);
            }
        }catch(error : any){
            return await httpExec.generalError(error);
        }
     }


     async update(reqHandler: RequestHandler): Promise<any>{
        const successMessage : string = "UPDATE_SUCCESS";
        const httpExec = new HttpAction(reqHandler.getResponse(), this.controllerObj.controller, reqHandler.getMethod());

        try{
             //This is for use the basic CRUD
             const repository = new GenericRepository(this.entityType);
             //This is for validate role
             const roleRepository = new RoleRepository();
             //This is for do validations
             const validation = new Validations(reqHandler.getRequest(), reqHandler.getResponse(), httpExec);
             //This calls the jwt data into JWTObject
             const jwtData : JWTObject = reqHandler.getRequest().app.locals.jwtData;
             //get the id from URL params
            const id = validation.validateIdFromQuery();
            if(id == null){
                return httpExec.paramsError();
            }

            //If you need to validate the role
            if(reqHandler.getNeedValidateRole()){
                const roleFunc : RoleFunctionallity | null = await roleRepository.getPermissionByFuncAndRole(jwtData.role, this.controllerObj.update);
                if (roleFunc == null) {
                    return httpExec.unauthorizedError("ROLE_AUTH_ERROR");
                }
            }

            //validate the regex of any fields
            if(reqHandler.getRegexValidatorList() != null){
                if(validation.validateMultipleRegex(reqHandler.getRegexValidatorList()) != null){
                    return;
                }
            }

            //If you need to validate if the user id of the table 
            //should be the user id of the user request (JWT)
            let userId : number | null= null;
            if(reqHandler.getRequireValidWhereByUserId()){
                if(jwtData.role != "ADMIN"){
                    userId = jwtData.id;
                }

                //call the get by id, if the user ID of the entity is different  to user ID of JWT
                //the user request dont have this authorization
                const entity = await repository.findById(id, reqHandler.getNeedLogicalRemove());

                if(entity != undefined && entity != null){
                    if(userId != null && entity.userId != userId){
                        return httpExec.unauthorizedError("ROLE_AUTH_ERROR");
                    }
                }else{
                    return httpExec.dynamicError("NOT_FOUND", "DONT_EXISTS");
                }
            }

            //Get data From Body
            const body = reqHandler.getAdapter().entityFromPutBody();

            try{
                //Execute Action DB
                const updateEntity = await repository.update(id, body,  
                                                             reqHandler.getNeedLogicalRemove());
                return httpExec.successAction(reqHandler.getAdapter().entityToResponse(updateEntity), successMessage);

            }catch(error : any){
                return await httpExec.databaseError(error);
            }
        }catch(error : any){
            return await httpExec.generalError(error);
        }
     }


     async delete(reqHandler: RequestHandler): Promise<any> {
        const successMessage : string = "DELETE_SUCCESS";
        const httpExec = new HttpAction(reqHandler.getResponse(), this.controllerObj.controller, reqHandler.getMethod());

        try{
             //This is for use the basic CRUD
             const repository = new GenericRepository(this.entityType);
             //This is for validate role
             const roleRepository = new RoleRepository();
             //This is for do validations
             const validation = new Validations(reqHandler.getRequest(), reqHandler.getResponse(), httpExec);
             //This calls the jwt data into JWTObject
             const jwtData : JWTObject = reqHandler.getRequest().app.locals.jwtData;
             //get the id from URL params
            const id = validation.validateIdFromQuery();
            
            if(id == null){
                return httpExec.paramsError();
            }

            //If you need to validate the role
            if(reqHandler.getNeedValidateRole()){
                const roleFunc : RoleFunctionallity | null = await roleRepository.getPermissionByFuncAndRole(jwtData.role, this.controllerObj.delete);
                if (roleFunc == null) {
                    return httpExec.unauthorizedError("ROLE_AUTH_ERROR");
                }
            }

             //If you need to validate if the user id of the table 
            //should be the user id of the user request (JWT)
            let userId : number | null= null;
            if(reqHandler.getRequireValidWhereByUserId()){
                if(jwtData.role != "ADMIN"){
                    userId = jwtData.id;
                }

                //call the get by id, if the user ID of the entity is different  to user ID of JWT
                //the user request dont have this authorization
                const entity = await repository.findById(id, reqHandler.getNeedLogicalRemove());

                if(entity != undefined && entity != null){
                    if(userId != null && entity.userId != userId){
                        return httpExec.unauthorizedError("ROLE_AUTH_ERROR");
                    }
                }else{
                    return httpExec.dynamicError("NOT_FOUND", "DONT_EXISTS");
                }
            }


            try{
                //Execute Action DB
                if(reqHandler.getNeedLogicalRemove()){
                    const deletedEntity = await repository.logicalRemove(id);
                    return httpExec.successAction(reqHandler.getAdapter().entityToResponse(deletedEntity), successMessage);
                }else{
                    const deletedEntity = await repository.remove(id);
                    return httpExec.successAction(reqHandler.getAdapter().entityToResponse(deletedEntity), successMessage);
                }
                
            }catch(error : any){
                return await httpExec.databaseError(error);
            }
        }catch(error : any){
            return await httpExec.generalError(error);
        }
     }


     async getById(reqHandler: RequestHandler): Promise<any> {
        const successMessage : string = "GET_BY_ID_SUCCESS";
        const httpExec = new HttpAction(reqHandler.getResponse(), this.controllerObj.controller, reqHandler.getMethod());

        try{
             //This is for use the basic CRUD
             const repository = new GenericRepository(this.entityType);
             //This is for validate role
             const roleRepository = new RoleRepository();
             //This is for do validations
             const validation = new Validations(reqHandler.getRequest(), reqHandler.getResponse(), httpExec);
             //This calls the jwt data into JWTObject
             const jwtData : JWTObject = reqHandler.getRequest().app.locals.jwtData;
             //get the id from URL params
            const id = validation.validateIdFromQuery();
            if(id == null){
                return httpExec.paramsError();
            }

            //If you need to validate the role
            if(reqHandler.getNeedValidateRole()){
                const roleFunc : RoleFunctionallity | null = await roleRepository.getPermissionByFuncAndRole(jwtData.role, this.controllerObj.getById);
                if (roleFunc == null) {
                    return httpExec.unauthorizedError("ROLE_AUTH_ERROR");
                }
            }

           
            //If you need to validate if the user id of the table 
            //should be the user id of the user request (JWT)
            let userId : number | null= null;
            if(reqHandler.getRequireValidWhereByUserId()){
                if(jwtData.role != "ADMIN"){
                    userId = jwtData.id;
                }

                //call the get by id, if the user ID of the entity is different  to user ID of JWT
                //the user request dont have this authorization
                const entity = await repository.findById(id, reqHandler.getNeedLogicalRemove());

                if(entity != undefined && entity != null){
                    if(userId != null && entity.userId != userId){
                        return httpExec.unauthorizedError("ROLE_AUTH_ERROR");
                    }
                }else{
                    return httpExec.dynamicError("NOT_FOUND", "DONT_EXISTS");
                }
            }


            try{
                //Execute Action DB
                const entity = await repository.findById(id, reqHandler.getNeedLogicalRemove());
                return httpExec.successAction(reqHandler.getAdapter().entityToResponse(entity), successMessage);

            }catch(error : any){
                return await httpExec.databaseError(error);
            }
        }catch(error : any){
            return await httpExec.generalError(error);
        }
     }

     async getByCode(reqHandler: RequestHandler): Promise<any> {
        const successMessage : string = "GET_BY_ID_SUCCESS";
        const httpExec = new HttpAction(reqHandler.getResponse(), this.controllerObj.controller, reqHandler.getMethod());

        try{
            //This is for use the basic CRUD
             const repository = new GenericRepository(this.entityType);
             //This is for validate role
             const roleRepository = new RoleRepository();
             //This is for do validations
             const validation = new Validations(reqHandler.getRequest(), reqHandler.getResponse(), httpExec);
             //This calls the jwt data into JWTObject
             const jwtData : JWTObject = reqHandler.getRequest().app.locals.jwtData;
             //get the code for Url Params
            const code = validation.validateCodeFromQuery();
            if(code == null){
                return httpExec.paramsError();
            }

            //If you need to validate the role
            if(reqHandler.getNeedValidateRole()){
                const roleFunc : RoleFunctionallity | null = await roleRepository.getPermissionByFuncAndRole(jwtData.role, this.controllerObj.getById);
                if (roleFunc == null) {
                    return httpExec.unauthorizedError("ROLE_AUTH_ERROR");
                }
            }

            //If you need to validate if the user id of the table 
            //should be the user id of the user request (JWT)
            let userId : number | null= null;
            if(reqHandler.getRequireValidWhereByUserId()){
                if(jwtData.role != "ADMIN"){
                    userId = jwtData.id;
                }

                //call the get by id, if the user ID of the entity is different  to user ID of JWT
                //the user request dont have this authorization
                const entity = await repository.findByCode(code, reqHandler.getNeedLogicalRemove());

                if(entity != undefined && entity != null){
                    if(userId != null && entity.userId != userId){
                        return httpExec.unauthorizedError("ROLE_AUTH_ERROR");
                    }
                }else{
                    return httpExec.dynamicError("NOT_FOUND", "DONT_EXISTS");
                }
            }

            try{
                //Execute Action DB
                const entity = await repository.findByCode(code, reqHandler.getNeedLogicalRemove());
                return httpExec.successAction(reqHandler.getAdapter().entityToResponse(entity), successMessage);

            }catch(error : any){
                return await httpExec.databaseError(error);
            }
        }catch(error : any){
            return await httpExec.generalError(error);
        }
    }


    async getAll(reqHandler: RequestHandler): Promise<any> {
        const successMessage : string = "GET_SUCCESS";
        const httpExec = new HttpAction(reqHandler.getResponse(), this.controllerObj.controller, reqHandler.getMethod());

        try{
            const repository = new GenericRepository(this.entityType);
            const roleRepository = new RoleRepository();
            const jwtData : JWTObject = reqHandler.getRequest().app.locals.jwtData;

            if(reqHandler.getNeedValidateRole()){
                const roleFunc : RoleFunctionallity | null = 
                                    await roleRepository.getPermissionByFuncAndRole(
                                    jwtData.role, this.controllerObj.getAll);

                if (roleFunc == null) {
                    return httpExec.unauthorizedError("ROLE_AUTH_ERROR");
                }
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
                const entities = await repository.findAll(reqHandler.getNeedLogicalRemove(), page, size);
                return httpExec.successAction(reqHandler.getAdapter().entitiesToResponse(entities), successMessage);
            }catch(error : any){
                return await httpExec.databaseError(error);
            }
        }catch(error : any){
            return await httpExec.generalError(error);
        }
     }


    async getByFilters(reqHandler: RequestHandler): Promise<any> {
        const successMessage : string = "GET_SUCCESS";
        const httpExec = new HttpAction(reqHandler.getResponse(), this.controllerObj.controller, reqHandler.getMethod());

        try{
            const repository = new GenericRepository(this.entityType);
            const roleRepository = new RoleRepository();
            const jwtData : JWTObject = reqHandler.getRequest().app.locals.jwtData;
           

            if(reqHandler.getNeedValidateRole()){
                const roleFunc : RoleFunctionallity | null = await roleRepository.getPermissionByFuncAndRole(jwtData.role, this.controllerObj.getById);
                if (roleFunc == null) {
                    return httpExec.unauthorizedError("ROLE_AUTH_ERROR");
                }
            }

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
                const entities = await repository.findByFilters(reqHandler.getFilters()!,
                                                                reqHandler.getNeedLogicalRemove(), page, size);
                return httpExec.successAction(reqHandler.getAdapter().entitiesToResponse(entities), successMessage);

            }catch(error : any){
                return await httpExec.databaseError(error);
            }
        }catch(error : any){
            return await httpExec.generalError(error);
        }
    }
}