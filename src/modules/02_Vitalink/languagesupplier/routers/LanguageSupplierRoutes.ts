import { Request, Response, 
         RequestHandler, RequestHandlerBuilder, 
         GenericController, GenericRoutes,
         FindManyOptions,
         getUrlParam} from "@modules/index";
import { LanguageSupplier } from "@index/entity/LanguageSupplier";
import LanguageSupplierDTO from "@modules/02_Vitalink/languagesupplier/dtos/LanguageSupplierDTO";

class LanguageSupplierRoutes extends GenericRoutes {
    
    private buildBaseFilters(): FindManyOptions {
        return {
            relations: ["supplier","language_proficiency"],
            where: {} 
        };
    }
    constructor() {
        super(new GenericController(LanguageSupplier), "/languagesupplier");
    }

    protected initializeRoutes() {
        this.router.get(`${this.getRouterName()}/get`, async (req: Request, res: Response) => {

            const filters = this.buildBaseFilters();
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new LanguageSupplierDTO(req))
                                    .setMethod("getLanguageSupplierById")
                                    .isValidateRole("LANGUAGE_SUPPLIER")
                                    .setFilters(filters)
                                    .setDynamicRoleValidationByEntityField([
                                        ["LEGAL_REPRESENTATIVE", "supplier.legal_representative.id"]
                                      ])
                                    .build();
        
            this.getController().getById(requestHandler);
        });
        
        this.router.get(`${this.getRouterName()}/get_all`, async (req: Request, res: Response) => {

            const filters = this.buildBaseFilters();

            const supplier_id: string | null = getUrlParam("supplier_id", req) || null;
            if (supplier_id != "") {
                filters.where = { ...filters.where, supplier: { id: supplier_id} };
            }
        
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new LanguageSupplierDTO(req))
                                    .setMethod("getLanguageSuppliers")
                                    .isValidateRole("LANGUAGE_SUPPLIER")
                                    .setFilters(filters)
                                    .setDynamicRoleValidationByEntityField([
                                        ["LEGAL_REPRESENTATIVE", "supplier.legal_representative.id"]
                                      ])
                                    .build();
        
            this.getController().getAll(requestHandler);
        });
        
        this.router.post(`${this.getRouterName()}/add`, async (req: Request, res: Response) => {

            const requiredBodyList: Array<string> = [
                req.body.supplier_id,
                req.body.language_code
            ];
            
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new LanguageSupplierDTO(req))
                                    .setMethod("insertLanguageSupplier")
                                    .setRequiredFiles(requiredBodyList)
                                    .isValidateRole("LANGUAGE_SUPPLIER")
                                    .build();
        
            this.getController().insert(requestHandler);
        });
        
        this.router.put(`${this.getRouterName()}/edit`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new LanguageSupplierDTO(req))
                                    .setMethod("updateLanguageSupplier")
                                    .isValidateRole("LANGUAGE_SUPPLIER")
                                    .setDynamicRoleValidationByEntityField([
                                        ["LEGAL_REPRESENTATIVE", "supplier.legal_representative.id"]
                                      ])
                                    .build();
        
            this.getController().update(requestHandler);
        });
        
        this.router.delete(`${this.getRouterName()}/delete`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new LanguageSupplierDTO(req))
                                    .setMethod("deleteLanguageSupplier")
                                    .isValidateRole("LANGUAGE_SUPPLIER")
                                    .setDynamicRoleValidationByEntityField([
                                        ["LEGAL_REPRESENTATIVE", "supplier.legal_representative.id"]
                                      ])
                                    .build();
        
            this.getController().delete(requestHandler);
        });
    }
}

export default LanguageSupplierRoutes;
