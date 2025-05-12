import { Request, Response, 
         RequestHandler, RequestHandlerBuilder, 
         GenericController, GenericRoutes,
         FindManyOptions,
         getUrlParam} from "@modules/index";
import { CertificationsExperience } from "@index/entity/CertificationsExperience";
import CertificationsExperienceDTO from "@modules/02_Vitalink/certificationsexperience/dtos/CertificationsExperienceDTO";

class CertificationsExperienceRoutes extends GenericRoutes {
    
    private buildBaseFilters(): FindManyOptions {
        return {
            relations: ["supplier","experience_type"],
            where: {} 
        };
    }
    constructor() {
        super(new GenericController(CertificationsExperience), "/certificationsexperience");
    }

    protected initializeRoutes() {
        this.router.get(`${this.getRouterName()}/get`, async (req: Request, res: Response) => {

            const filters = this.buildBaseFilters();
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new CertificationsExperienceDTO(req))
                                    .setMethod("getCertificationsExperienceById")
                                    .isValidateRole("CERTIFICATIONS_EXPERIENCE")
                                    .isLogicalDelete()
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
                                    .setAdapter(new CertificationsExperienceDTO(req))
                                    .setMethod("getCertificationsExperiences")
                                    .isValidateRole("CERTIFICATIONS_EXPERIENCE")
                                    .isLogicalDelete()
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
                req.body.start_date,
                req.body.name,
                req.body.company_name,
                req.body.experience_type_code
            ];
            
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new CertificationsExperienceDTO(req))
                                    .setMethod("insertCertificationsExperience")
                                    .setRequiredFiles(requiredBodyList)
                                    .isValidateRole("CERTIFICATIONS_EXPERIENCE")
                                    .build();
        
            this.getController().insert(requestHandler);
        });
        
        this.router.put(`${this.getRouterName()}/edit`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new CertificationsExperienceDTO(req))
                                    .setMethod("updateCertificationsExperience")
                                    .isValidateRole("CERTIFICATIONS_EXPERIENCE")
                                    .setDynamicRoleValidationByEntityField([
                                        ["LEGAL_REPRESENTATIVE", "supplier.legal_representative.id"]
                                      ])
                                    .build();
        
            this.getController().update(requestHandler);
        });
        
        this.router.delete(`${this.getRouterName()}/delete`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new CertificationsExperienceDTO(req))
                                    .setMethod("deleteCertificationsExperience")
                                    .isValidateRole("CERTIFICATIONS_EXPERIENCE")
                                    .isLogicalDelete()
                                    .setDynamicRoleValidationByEntityField([
                                        ["LEGAL_REPRESENTATIVE", "supplier.legal_representative.id"]
                                      ])
                                    .build();
        
            this.getController().delete(requestHandler);
        });




        this.router.post(`${this.getRouterName()}/add_multiple`, async (req: Request, res: Response) => {

            const requiredBodyList: Array<string> = [
                req.body.supplier_id,
                req.body.start_date,
                req.body.name,
                req.body.company_name,
                req.body.experience_type_code
            ];
                
            const requestHandler : RequestHandler = 
                                    new RequestHandlerBuilder(res,req)
                                    .setAdapter(new CertificationsExperienceDTO(req))
                                    .setMethod("insertMultipleCertificationsExperience")
                                    .isValidateRole("CERTIFICATIONS_EXPERIENCE")
                                    .setRequiredFiles(requiredBodyList)
                                    .build();
        
            this.getController().insertMultiple(requestHandler);
        });
                
    }
}

export default CertificationsExperienceRoutes;
