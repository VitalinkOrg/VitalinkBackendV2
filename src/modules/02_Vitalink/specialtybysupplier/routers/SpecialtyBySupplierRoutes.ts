import { Request, Response, 
         RequestHandler, RequestHandlerBuilder, 
         GenericController, GenericRoutes,
         FindManyOptions,
         getUrlParam} from "@modules/index";
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
                                    .setDynamicRoleValidationByEntityField([
                                        ["LEGAL_REPRESENTATIVE", "supplier.legal_representative.id"]
                                      ])
                                    .build();
        
            this.getController().getById(requestHandler);
        });
        
        this.router.get(`${this.getRouterName()}/get_all`, async (req: Request, res: Response) => {

            const supplier_id: string | null = getUrlParam("supplier_id", req) || null;
            if (supplier_id != "") {
                this.filters.where = { ...this.filters.where, supplier: { id: supplier_id} };
            }

            const medical_specialty: string | null = getUrlParam("medical_specialty", req) || null;
            if (medical_specialty != "") {
                this.filters.where = { ...this.filters.where, medical_specialty: { code: medical_specialty} };
            }
        
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new SpecialtyBySupplierDTO(req))
                                    .setMethod("getSpecialtyBySuppliers")
                                    .isValidateRole("SPECIALTY_BY_SUPPLIER")
                                    .setFilters(this.filters)
                                    .setDynamicRoleValidationByEntityField([
                                        ["LEGAL_REPRESENTATIVE", "supplier.legal_representative.id"]
                                      ])
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
                                    .setDynamicRoleValidationByEntityField([
                                        ["LEGAL_REPRESENTATIVE", "supplier.legal_representative.id"]
                                      ])
                                    .build();
        
            this.getController().update(requestHandler);
        });
        
        this.router.delete(`${this.getRouterName()}/delete`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new SpecialtyBySupplierDTO(req))
                                    .setMethod("deleteSpecialtyBySupplier")
                                    .isValidateRole("SPECIALTY_BY_SUPPLIER")
                                    .setDynamicRoleValidationByEntityField([
                                        ["LEGAL_REPRESENTATIVE", "supplier.legal_representative.id"]
                                      ])
                                    .build();
        
            this.getController().delete(requestHandler);
        });
    }
}

export default SpecialtyBySupplierRoutes;
