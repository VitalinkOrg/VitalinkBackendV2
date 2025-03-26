import { Request, Response, 
         RequestHandler, RequestHandlerBuilder, 
         GenericController, GenericRoutes,
         FindManyOptions} from "@modules/index";
import { CertificationsExperience } from "@index/entity/CertificationsExperience";
import CertificationsExperienceDTO from "@modules/02_Vitalink/certificationsexperience/dtos/CertificationsExperienceDTO";

class CertificationsExperienceRoutes extends GenericRoutes {
    
    private filters: FindManyOptions = {};
    constructor() {
        super(new GenericController(CertificationsExperience), "/certificationsexperience");
        this.filters.relations = ["supplier","experience_type"];
    }

    protected initializeRoutes() {
        this.router.get(`${this.getRouterName()}/get`, async (req: Request, res: Response) => {

            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new CertificationsExperienceDTO(req))
                                    .setMethod("getCertificationsExperienceById")
                                    .isValidateRole("CERTIFICATIONS_EXPERIENCE")
                                    .isLogicalDelete()
                                    .setFilters(this.filters)
                                    .build();
        
            this.getController().getById(requestHandler);
        });
        
        this.router.get(`${this.getRouterName()}/get_all`, async (req: Request, res: Response) => {
        
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new CertificationsExperienceDTO(req))
                                    .setMethod("getCertificationsExperiences")
                                    .isValidateRole("CERTIFICATIONS_EXPERIENCE")
                                    .isLogicalDelete()
                                    .setFilters(this.filters)
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
                                    .build();
        
            this.getController().delete(requestHandler);
        });
    }
}

export default CertificationsExperienceRoutes;
