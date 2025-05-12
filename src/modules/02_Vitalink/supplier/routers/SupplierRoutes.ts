import { Request, Response, 
         RequestHandler, RequestHandlerBuilder, 
        GenericRoutes,
         FindManyOptions} from "@modules/index";
import SupplierDTO from "@modules/02_Vitalink/supplier/dtos/SupplierDTO";
import SupplierController from "../controllers/SupplierController";

class SupplierRoutes extends GenericRoutes {
    
    private buildBaseFilters(): FindManyOptions {
        return {
            relations: ["id_type","medical_type","legal_representative"],
            where: {} 
        };
    }
    constructor() {
        super(new SupplierController(), "/supplier");
    }


    protected initializeRoutes() {
        this.router.get(`${this.getRouterName()}/get`, async (req: Request, res: Response) => {

            const filters = this.buildBaseFilters();
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new SupplierDTO(req))
                                    .setMethod("getSupplierById")
                                    .isValidateRole("SUPPLIER")
                                    .isLogicalDelete()
                                    .setFilters(filters)
                                    .setDynamicRoleValidationByEntityField([
                                        ["LEGAL_REPRESENTATIVE", "legal_representative.id"]
                                      ])
                                    .build();
        
            this.getController().getById(requestHandler);
        });
        
        this.router.get(`${this.getRouterName()}/get_all`, async (req: Request, res: Response) => {
        
            const filters = this.buildBaseFilters();
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new SupplierDTO(req))
                                    .setMethod("getSuppliers")
                                    .isValidateRole("SUPPLIER")
                                    .isLogicalDelete()
                                    .setFilters(filters)
                                    .setDynamicRoleValidationByEntityField([
                                        ["LEGAL_REPRESENTATIVE", "legal_representative.id"]
                                      ])
                                    .build();
        
            this.getController().getAll(requestHandler);
        });

          
        this.router.get(`${this.getRouterName()}/get_all_main`, async (req: Request, res: Response) => {
            const filters = this.buildBaseFilters();

            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new SupplierDTO(req))
                                    .setMethod("getSuppliers")
                                    .isLogicalDelete()
                                    .setFilters(filters)
                                    .build();
        
            (this.getController() as SupplierController).getSuppliersMainDashboard(requestHandler);
        });
        
        this.router.post(`${this.getRouterName()}/add`, async (req: Request, res: Response) => {

            const requiredBodyList: Array<string> = [
                req.body.id_type,
                req.body.card_id,
                req.body.email,
                req.body.legal_representative,
                req.body.medical_type_code
            ];
            
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new SupplierDTO(req))
                                    .setMethod("insertSupplier")
                                    .setRequiredFiles(requiredBodyList)
                                    .isValidateRole("SUPPLIER")
                                    .setDynamicRoleValidationByEntityField([
                                        ["LEGAL_REPRESENTATIVE", "legal_representative"]
                                    ])
                                    .build();
        
            this.getController().insert(requestHandler);
        });
        
        this.router.put(`${this.getRouterName()}/edit`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new SupplierDTO(req))
                                    .setMethod("updateSupplier")
                                    .isValidateRole("SUPPLIER")
                                    .setDynamicRoleValidationByEntityField([
                                        ["LEGAL_REPRESENTATIVE", "legal_representative.id"]
                                      ])
                                    .build();
        
            this.getController().update(requestHandler);
        });
        
        this.router.delete(`${this.getRouterName()}/delete`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new SupplierDTO(req))
                                    .setMethod("deleteSupplier")
                                    .isValidateRole("SUPPLIER")
                                    .isLogicalDelete()
                                    .setDynamicRoleValidationByEntityField([
                                        ["LEGAL_REPRESENTATIVE", "legal_representative.id"]
                                      ])
                                    .build();
        
            this.getController().delete(requestHandler);
        });



      
    }
}

export default SupplierRoutes;
