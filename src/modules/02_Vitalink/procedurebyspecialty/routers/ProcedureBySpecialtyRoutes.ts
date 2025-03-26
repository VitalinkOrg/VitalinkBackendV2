import { Request, Response, 
         RequestHandler, RequestHandlerBuilder, 
         GenericController, GenericRoutes,
         FindManyOptions} from "@modules/index";
import { ProcedureBySpecialty } from "@index/entity/ProcedureBySpecialty";
import ProcedureBySpecialtyDTO from "@modules/02_Vitalink/procedurebyspecialty/dtos/ProcedureBySpecialtyDTO";

class ProcedureBySpecialtyRoutes extends GenericRoutes {
    
    private filters: FindManyOptions = {};
    constructor() {
        super(new GenericController(ProcedureBySpecialty), "/procedurebyspecialty");
        this.filters.relations = ["specialty","procedure","specialty.medical_specialty","specialty.supplier"];
    }

    protected initializeRoutes() {
        this.router.get(`${this.getRouterName()}/get`, async (req: Request, res: Response) => {

            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new ProcedureBySpecialtyDTO(req))
                                    .setMethod("getProcedureBySpecialtyById")
                                    .isValidateRole("PROCEDURE_BY_SPECIALTY")
                                    .setFilters(this.filters)
                                    .build();
        
            this.getController().getById(requestHandler);
        });
        
        this.router.get(`${this.getRouterName()}/get_all`, async (req: Request, res: Response) => {
        
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new ProcedureBySpecialtyDTO(req))
                                    .setMethod("getProcedureBySpecialties")
                                    .isValidateRole("PROCEDURE_BY_SPECIALTY")
                                    .setFilters(this.filters)
                                    .build();
        
            this.getController().getAll(requestHandler);
        });
        
        this.router.post(`${this.getRouterName()}/add`, async (req: Request, res: Response) => {

            const requiredBodyList: Array<string> = [
                req.body.specialty_id,
                req.body.procedure_code
            ];
            
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new ProcedureBySpecialtyDTO(req))
                                    .setMethod("insertProcedureBySpecialty")
                                    .setRequiredFiles(requiredBodyList)
                                    .isValidateRole("PROCEDURE_BY_SPECIALTY")
                                    .build();
        
            this.getController().insert(requestHandler);
        });
        
        this.router.put(`${this.getRouterName()}/edit`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new ProcedureBySpecialtyDTO(req))
                                    .setMethod("updateProcedureBySpecialty")
                                    .isValidateRole("PROCEDURE_BY_SPECIALTY")
                                    .build();
        
            this.getController().update(requestHandler);
        });
        
        this.router.delete(`${this.getRouterName()}/delete`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new ProcedureBySpecialtyDTO(req))
                                    .setMethod("deleteProcedureBySpecialty")
                                    .isValidateRole("PROCEDURE_BY_SPECIALTY")
                                    .build();
        
            this.getController().delete(requestHandler);
        });
    }
}

export default ProcedureBySpecialtyRoutes;
