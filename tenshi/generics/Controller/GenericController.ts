import JWTObject  from 'tenshi/objects/JWTObject';
import HttpAction from 'tenshi/helpers/HttpAction';

import { EntityTarget, RequestHandler } from 'tenshi/generics/index';

import IGenericRepository from 'tenshi/generics/Repository/IGenericRepository';
import GenericRepository from 'tenshi/generics/Repository/GenericRepository';

import IGenericController from 'tenshi/generics/Controller/IGenericController';

import { ConstHTTPRequest, ConstStatusJson, ConstMessagesJson, ConstFunctions } from "tenshi/consts/Const";
import GenericValidation from '../Validation/GenericValidation';
import { camelToUpperSnakeCase, getEntityName } from 'tenshi/utils/generalUtils';
import IGenericService from '../Services/IGenericService';
import GenericService from '../Services/GenericService';

/*
    This class have the necessary methods (CRUDS) to send into the routing
    You need to send the entity type, the models generated by de TYPE ORM &&
    Then you send the controller object, with all the specific names of the specific entity
    PD: IF YOU NEED TO OVERRIDE OR ADDED MORE METHODS, YOU NEED TO CREATE ANOTHER CONTROLLER AND EXTEND THIS
*/7
export default  class GenericController extends GenericValidation implements IGenericController {
    private entityType : EntityTarget<any>;
    private service : IGenericService;
    private controllerName : string;
    private entityName : string;

    /**
     * Constructor of the GenericController class.
     * This class needs the type of the entity of the ORM, and the controller object.
     * @param {EntityTarget<any>} entityType - The type of the entity of the ORM.
     * @param {IGenericRepository | null} repositoryClass - The repository class of the entity.
     *                                                      If it's not passed, a new instance of GenericRepository will be created.
     */
    constructor(entityType: EntityTarget<any>, service: IGenericService = new GenericService(), repositoryClass: IGenericRepository | null = null) {
        super();

        // Set the entity type.
        this.entityType = entityType;

        //set the entity name
        this.entityName = getEntityName(entityType);

        // Set the controller name
        this.controllerName =  `${camelToUpperSnakeCase(getEntityName(entityType))}${ConstFunctions.CONTROLLER}`;

        // Create the controller object using the entity type.
        this.service = service;
        this.service.setControllerName(this.controllerName);

        // Check if the repository class is passed.
        // If not, create a new instance of GenericRepository using the entity type.
        // Otherwise, set the repository class.
        if(repositoryClass == null){
            this.setRepository(new GenericRepository(this.entityType));
        }else{
            this.setRepository(repositoryClass);
        }
    }
   
    public getRepository(): IGenericRepository {
        return this.getValidationRepository();
    }

    public getEntityName(): string {
        return this.entityName;
    }

    public getControllerName(): string {
        return this.controllerName;
    }

    public getService(): IGenericService {
        return this.service;
    }

    /**
     * Insert an entity into the database.
     *
     * @param reqHandler - The request handler.
     * @returns A promise that resolves to the inserted entity.
     */
    async insert(reqHandler: RequestHandler): Promise<any> {

        return this.service.insertService(reqHandler, async (jwtData, httpExec) => {

            let body = reqHandler.getAdapter().entityFromPostBody();
            // Set the user ID of the entity with the ID of the JWT
            body = this.setUserId(body, jwtData!.id);

            try{
                // Insert the entity into the database
                const createdEntity = await this.getRepository().add(body);

                // Return the success response
                return httpExec.successAction(reqHandler.getAdapter().entityToResponse(createdEntity), ConstHTTPRequest.INSERT_SUCESS);

            }catch(error : any){
                // Return the database error response
                return await httpExec.databaseError(error, jwtData!.id.toString(), 
                reqHandler.getMethod(), this.controllerName);
            }
        });
     }
  

     /**
      * Update an entity in the database.
      *
      * @param reqHandler - The request handler.
      * @returns A promise that resolves to the updated entity.
      */
     async update(reqHandler: RequestHandler): Promise<any> {

        return this.service.updateService(reqHandler, async (jwtData, httpExec, id) => {

            // Get data from the body
            const body = reqHandler.getAdapter().entityFromPutBody();

            
            try {
                // Execute the update action in the database
                const updateEntity = await this.getRepository().update(id, body,
                                                             reqHandler.getLogicalDelete());
                // Return the success response
                return httpExec.successAction(reqHandler.getAdapter().entityToResponse(updateEntity), ConstHTTPRequest.UPDATE_SUCCESS);

            } catch (error: any) {
                // Return the database error response
                return await httpExec.databaseError(error, jwtData.id.toString(), 
                reqHandler.getMethod(), this.controllerName);
            }
        });
     }

     /**
      * Delete an entity from the database.
      *
      * @param reqHandler - The request handler.
      * @returns A promise that resolves to the deleted entity.
      */
     async delete(reqHandler: RequestHandler): Promise<any> {

        return this.service.deleteService(reqHandler, async (jwtData, httpExec, id) => {
            try{
                // Execute the delete action in the database
                if(reqHandler.getLogicalDelete()){
                    // Logically remove the entity from the database
                    const deletedEntity = await this.getRepository().logicalRemove(id);
                    return httpExec.successAction(reqHandler.getAdapter().entityToResponse(deletedEntity), ConstHTTPRequest.DELETE_SUCCESS);
                }else{
                    // Remove the entity from the database
                    const deletedEntity = await this.getRepository().remove(id);
                    return httpExec.successAction(reqHandler.getAdapter().entityToResponse(deletedEntity), ConstHTTPRequest.DELETE_SUCCESS);
                }
                
            }catch(error : any){
                // Return the database error response
                return await httpExec.databaseError(error, jwtData.id.toString(), 
                reqHandler.getMethod(), this.controllerName);
            }
        });
     }

     /**
      * Get an entity by its ID from the database.
      *
      * @param reqHandler - The request handler.
      * @returns A promise that resolves to the entity.
      */
     async getById(reqHandler: RequestHandler): Promise<any> {

        return this.service.getByIdService(reqHandler, async (jwtData, httpExec, id) => {
            try{
                // Execute the get by id action in the database
                const entity = await this.getRepository().findById(id, reqHandler.getLogicalDelete());

                if(entity != null && entity != undefined){
                    // Return the success response
                    return httpExec.successAction(reqHandler.getAdapter().entityToResponse(entity), ConstHTTPRequest.GET_BY_ID_SUCCESS);
                }else{
                    return httpExec.dynamicError(ConstStatusJson.NOT_FOUND, ConstMessagesJson.DONT_EXISTS);
                }
                
            }catch(error : any){
                // Return the database error response
                return await httpExec.databaseError(error, jwtData.id.toString(), 
                reqHandler.getMethod(), this.controllerName);
            }
        });
     }


     /**
      * Get an entity by its code from the database.
      *
      * @param reqHandler - The request handler.
      * @returns A promise that resolves to the entity.
      */
     async getByCode(reqHandler: RequestHandler): Promise<any> {

        return this.service.getByCodeService(reqHandler, async (jwtData, httpExec, code) => {
            try{
                // Execute the get by code action in the database
                const entity = await this.getRepository().findByCode(code, reqHandler.getLogicalDelete());
                if(entity != null && entity != undefined){
                    // Return the success response
                    return httpExec.successAction(reqHandler.getAdapter().entityToResponse(entity), ConstHTTPRequest.GET_BY_ID_SUCCESS);
                }else{
                    return httpExec.dynamicError(ConstStatusJson.NOT_FOUND, ConstMessagesJson.DONT_EXISTS);
                }
                
            }catch(error : any){
                // Return the database error response
                return await httpExec.databaseError(error, jwtData.id.toString(), 
                reqHandler.getMethod(), this.controllerName);
            }
        });
     }
   

    /**
     * Retrieves all entities from the database.
     *
     * @param reqHandler - The request handler.
     * @returns A promise that resolves to the entities.
     */
    async getAll(reqHandler: RequestHandler): Promise<any> {

        return this.service.getAllService(reqHandler, async (jwtData : JWTObject, httpExec: HttpAction, page: number, size: number) => {
            try {
               
                // Execute the get all action in the database
                const entities = await this.getRepository().findAll(reqHandler.getLogicalDelete(), page, size);
                if(entities != null && entities != undefined){
                    // Return the success response
                    return httpExec.successAction(reqHandler.getAdapter().entitiesToResponse(entities), ConstHTTPRequest.GET_ALL_SUCCESS);
                }else{
                    return httpExec.dynamicError(ConstStatusJson.NOT_FOUND, ConstMessagesJson.DONT_EXISTS);
                }

            } catch (error: any) {
                // Return the database error response
                return await httpExec.databaseError(error, jwtData.id.toString(),
                    reqHandler.getMethod(), this.controllerName);
            }
        });
    }
  

    /**
     * This function gets entities by applying filters specified in the request parameters.
     * 
     * @param {RequestHandler} reqHandler - The request handler object.
     * @returns {Promise<any>} A promise that resolves to the success response if the operation is successful.
     */
    async getByFilters(reqHandler: RequestHandler): Promise<any> {

        return this.service.getByFiltersService(reqHandler, async (jwtData : JWTObject, httpExec: HttpAction, page: number, size: number) => {
            try {
               
                // Execute the find by filters action in the database
                const entities = await this.getRepository().findByFilters(reqHandler.getFilters()!,
                    reqHandler.getLogicalDelete(), page, size);

                if(entities != null && entities != undefined){
                    // Return the success response
                    return httpExec.successAction(reqHandler.getAdapter().entitiesToResponse(entities), ConstHTTPRequest.GET_ALL_SUCCESS);
                }else{
                    return httpExec.dynamicError(ConstStatusJson.NOT_FOUND, ConstMessagesJson.DONT_EXISTS);
                }

            } catch (error: any) {
                // Return the database error response
                return await httpExec.databaseError(error, jwtData.id.toString(),
                    reqHandler.getMethod(), this.controllerName);
            }
        });
    }
}