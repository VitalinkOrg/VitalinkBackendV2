import { Request, Response, 
         RequestHandler, RequestHandlerBuilder, 
         GenericController, GenericRoutes,
         FindManyOptions,
         getUrlParam} from "@modules/index";
import { Package } from "@index/entity/Package";
import PackageDTO from "@modules/02_Vitalink/package/dtos/PackageDTO";

class PackageRoutes extends GenericRoutes {
    
    private filters: FindManyOptions = {};
    constructor() {
        super(new GenericController(Package), "/package");
        this.filters.relations = ["procedure","product","specialty","specialty.supplier", "specialty.medical_specialty"];
    }

    protected initializeRoutes() {
        this.router.get(`${this.getRouterName()}/get`, async (req: Request, res: Response) => {

            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new PackageDTO(req))
                                    .setMethod("getPackageById")
                                    .isValidateRole("PACKAGE")
                                    .isLogicalDelete()
                                    .setFilters(this.filters)
                                    .setDynamicRoleValidationByEntityField([
                                        ["LEGAL_REPRESENTATIVE", "specialty.supplier.legal_representative.id"]
                                      ])
                                    .build();
        
            this.getController().getById(requestHandler);
        });
        
        this.router.get(`${this.getRouterName()}/get_all`, async (req: Request, res: Response) => {
            const supplier_id: string | null = getUrlParam("supplier_id", req) || null;
            if (supplier_id != "") {
                this.filters.where = { ...this.filters.where, specialty: { supplier: { id: supplier_id} } };
            }

            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new PackageDTO(req))
                                    .setMethod("getPackages")
                                    .isValidateRole("PACKAGE")
                                    .isLogicalDelete()
                                    .setFilters(this.filters)
                                    .setDynamicRoleValidationByEntityField([
                                        ["LEGAL_REPRESENTATIVE", "specialty.supplier.legal_representative.id"]
                                      ])
                                    .build();
        
            this.getController().getAll(requestHandler);
        });
        
        this.router.post(`${this.getRouterName()}/add`, async (req: Request, res: Response) => {

            const requiredBodyList: Array<string> = [
                req.body.specialty_id,
                req.body.procedure_code,
                req.body.product_code,
            ];

            
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new PackageDTO(req))
                                    .setMethod("insertPackage")
                                    .setRequiredFiles(requiredBodyList)
                                    .isValidateRole("PACKAGE")
                                    
                                    .build();
        
            this.getController().insert(requestHandler);
        });
        
        this.router.put(`${this.getRouterName()}/edit`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new PackageDTO(req))
                                    .setMethod("updatePackage")
                                    .isValidateRole("PACKAGE")
                                    .setDynamicRoleValidationByEntityField([
                                        ["LEGAL_REPRESENTATIVE", "specialty.supplier.legal_representative.id"]
                                      ])
                                    .build();
        
            this.getController().update(requestHandler);
        });
        
        this.router.delete(`${this.getRouterName()}/delete`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new PackageDTO(req))
                                    .setMethod("deletePackage")
                                    .isValidateRole("PACKAGE")
                                    .isLogicalDelete()
                                    .setDynamicRoleValidationByEntityField([
                                        ["LEGAL_REPRESENTATIVE", "specialty.supplier.legal_representative.id"]
                                      ])
                                    .build();
        
            this.getController().delete(requestHandler);
        });
    }
}

export default PackageRoutes;