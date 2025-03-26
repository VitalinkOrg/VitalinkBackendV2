import { Request, Response, 
         RequestHandler, RequestHandlerBuilder, 
         GenericController, GenericRoutes,
         FindManyOptions} from "@modules/index";
import { Supplier } from "@index/entity/Supplier";
import SupplierDTO from "@modules/02_Vitalink/supplier/dtos/SupplierDTO";

class SupplierRoutes extends GenericRoutes {
    
    private filters: FindManyOptions = {};
    constructor() {
        super(new GenericController(Supplier), "/supplier");
        this.filters.relations = ["id_type","medical_type","legal_representative"];
    }

    protected initializeRoutes() {
        this.router.get(`${this.getRouterName()}/get`, async (req: Request, res: Response) => {

            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new SupplierDTO(req))
                                    .setMethod("getSupplierById")
                                    .isValidateRole("SUPPLIER")
                                    .isLogicalDelete()
                                    .setFilters(this.filters)
                                    .build();
        
            this.getController().getById(requestHandler);
        });
        
        this.router.get(`${this.getRouterName()}/get_all`, async (req: Request, res: Response) => {
        
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new SupplierDTO(req))
                                    .setMethod("getSuppliers")
                                    .isValidateRole("SUPPLIER")
                                    .isLogicalDelete()
                                    .setFilters(this.filters)
                                    .build();
        
            this.getController().getAll(requestHandler);
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
                                    .build();
        
            this.getController().insert(requestHandler);
        });
        
        this.router.put(`${this.getRouterName()}/edit`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new SupplierDTO(req))
                                    .setMethod("updateSupplier")
                                    .isValidateRole("SUPPLIER")
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
                                    .build();
        
            this.getController().delete(requestHandler);
        });
    }
}

export default SupplierRoutes;
