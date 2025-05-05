import { Request, Response, 
         RequestHandler, RequestHandlerBuilder, 
         GenericController, GenericRoutes,
         FindManyOptions} from "@modules/index";
import { SpecialtyBySupplier } from "@index/entity/SpecialtyBySupplier";
import SpecialtyBySupplierDTO from "@modules/02_Vitalink/specialtybysupplier/dtos/SpecialtyBySupplierDTO";

class SpecialtyBySupplierRoutes extends GenericRoutes {
    
    private filters: FindManyOptions = {};
    constructor() {
        super(new GenericController(SpecialtyBySupplier), "/specialtybysupplier");
        this.filters.relations = ["supplier","medical_specialty"];
    }

    protected initializeRoutes() {
        this.router.get(`${this.getRouterName()}/get`, async (req: Request, res: Response) => {

            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new SpecialtyBySupplierDTO(req))
                                    .setMethod("getSpecialtyBySupplierById")
                                    .isValidateRole("SPECIALTY_BY_SUPPLIER")
                                    .setFilters(this.filters)
                                    .build();
        
            this.getController().getById(requestHandler);
        });
        
        this.router.get(`${this.getRouterName()}/get_all`, async (req: Request, res: Response) => {
        
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new SpecialtyBySupplierDTO(req))
                                    .setMethod("getSpecialtyBySuppliers")
                                    .isValidateRole("SPECIALTY_BY_SUPPLIER")
                                    .setFilters(this.filters)
                                    .build();
        
            this.getController().getAll(requestHandler);
        });
        
        this.router.post(`${this.getRouterName()}/add`, async (req: Request, res: Response) => {

            const requiredBodyList: Array<string> = [
                req.body.supplier_id,
                req.body.medical_specialty_code
            ];
            
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new SpecialtyBySupplierDTO(req))
                                    .setMethod("insertSpecialtyBySupplier")
                                    .setRequiredFiles(requiredBodyList)
                                    .isValidateRole("SPECIALTY_BY_SUPPLIER")
                                    .build();
        
            this.getController().insert(requestHandler);
        });




        this.router.post(`${this.getRouterName()}/add_multiple`, async (req: Request, res: Response) => {

            const requestHandler : RequestHandler = 
                                    new RequestHandlerBuilder(res,req)
                                    .setAdapter(new SpecialtyBySupplierDTO(req))
                                    .setMethod("insertMultipleSpecialtyBySupplier")
                                    .isValidateRole("SPECIALTY_BY_SUPPLIER")
                                    .build();
            this.getController().insertMultiple(requestHandler);
        });
        
        this.router.put(`${this.getRouterName()}/edit`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new SpecialtyBySupplierDTO(req))
                                    .setMethod("updateSpecialtyBySupplier")
                                    .isValidateRole("SPECIALTY_BY_SUPPLIER")
                                    .build();
        
            this.getController().update(requestHandler);
        });
        
        this.router.delete(`${this.getRouterName()}/delete`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new SpecialtyBySupplierDTO(req))
                                    .setMethod("deleteSpecialtyBySupplier")
                                    .isValidateRole("SPECIALTY_BY_SUPPLIER")
                                    .build();
        
            this.getController().delete(requestHandler);
        });
    }
}

export default SpecialtyBySupplierRoutes;
