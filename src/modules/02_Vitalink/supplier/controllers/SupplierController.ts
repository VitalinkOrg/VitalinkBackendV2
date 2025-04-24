import { Availability } from "@index/entity/Availability";
import { Supplier } from "@index/entity/Supplier";
import { ConstHTTPRequest, ConstMessagesJson, ConstStatusJson } from "@TenshiJS/consts/Const";
import { RequestHandler } from "@TenshiJS/generics";
import GenericController from "@TenshiJS/generics/Controller/GenericController";
import GenericRepository from "@TenshiJS/generics/Repository/GenericRepository";
import SupplierDTO from "../dtos/SupplierDTO";

export default class SupplierController extends GenericController{
    
    private availabilityRepository = new GenericRepository(Availability);

    constructor() {
        super(Supplier);
    }


    //Logic to register user
    async getSuppliersMainDashboard(reqHandler: RequestHandler) : Promise<any>{

        return this.getService().getAllService(reqHandler, async (jwtData, httpExec, page: number, size: number) => {

            try{
                //Execute Action DB
                const suppliers = await this.getRepository().findAll(reqHandler.getLogicalDelete(), {
                    where: { 
                        is_deleted: false
                    },
                    relations: ["id_type", "medical_type"]
                }, page, size);

                
                if (!suppliers || suppliers.length === 0) {
                    return httpExec.dynamicError(ConstStatusJson.NOT_FOUND, ConstMessagesJson.DONT_EXISTS);
                }

                for (const supplier of suppliers) {
                    await this.addSupplierData(supplier);
                }

                return httpExec.successAction(
                    (reqHandler.getAdapter() as SupplierDTO).entitiesToResponseMain(suppliers),
                    ConstHTTPRequest.GET_ALL_SUCCESS
                );

            }catch(error : any){
                return await httpExec.databaseError(error, null, 
                    reqHandler.getMethod(), this.getControllerName());
            }
        });  
    }


    private async addSupplierData(supplier: any): Promise<void> {

        const availabilities = await this.availabilityRepository.findByOptions(false, true,  
        {
            where: { 
                supplier: { id: supplier.id }
            },
            relations: ["procedure", "location", "procedure.procedure"]
        });


        const locations: any[] = [];
        for (const availability of availabilities) {
        const location = availability.location;

        if (location && !locations.find(loc => loc.id === location.id)) {
            locations.push(location);
        }
        }
        supplier.locations = locations;
        
        supplier.availabilities = availabilities;
    }



}