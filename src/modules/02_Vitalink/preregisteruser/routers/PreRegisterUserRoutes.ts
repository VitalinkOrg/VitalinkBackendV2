import { Request, Response, 
         RequestHandler, RequestHandlerBuilder, 
         GenericController, GenericRoutes,
         FindManyOptions} from "@modules/index";
import { PreRegisterUser } from "@index/entity/PreRegisterUser";
import PreRegisterUserDTO from "@modules/02_Vitalink/preregisteruser/dtos/PreRegisterUserDTO";

class PreRegisterUserRoutes extends GenericRoutes {
    
    private filters: FindManyOptions = {};
    constructor() {
        super(new GenericController(PreRegisterUser), "/preregisteruser");
        this.filters.relations = ["id_type","finance_entity"];
    }

    protected initializeRoutes() {
        this.router.get(`${this.getRouterName()}/get`, async (req: Request, res: Response) => {

            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new PreRegisterUserDTO(req))
                                    .setMethod("getPreRegisterUserById")
                                    .isValidateRole("PRE_REGISTER_USER")
                                    .isLogicalDelete()
                                    .setFilters(this.filters)
                                    .build();
        
            this.getController().getById(requestHandler);
        });
        
        this.router.get(`${this.getRouterName()}/get_all`, async (req: Request, res: Response) => {
        
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new PreRegisterUserDTO(req))
                                    .setMethod("getPreRegisterUsers")
                                    .isValidateRole("PRE_REGISTER_USER")
                                    .isLogicalDelete()
                                    .setFilters(this.filters)
                                    .build();
        
            this.getController().getAll(requestHandler);
        });
        
        this.router.post(`${this.getRouterName()}/add`, async (req: Request, res: Response) => {

            const requiredBodyList: Array<string> = [
                req.body.card_id,
                req.body.id_type,
                req.body.name
            ];
            
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new PreRegisterUserDTO(req))
                                    .setMethod("insertPreRegisterUser")
                                    .setRequiredFiles(requiredBodyList)
                                    .isValidateRole("PRE_REGISTER_USER")
                                    .build();

                                    
        
            this.getController().insert(requestHandler);
        });
        
        this.router.put(`${this.getRouterName()}/edit`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new PreRegisterUserDTO(req))
                                    .setMethod("updatePreRegisterUser")
                                    .isValidateRole("PRE_REGISTER_USER")
                                    .build();
        
            this.getController().update(requestHandler);
        });
        
        this.router.delete(`${this.getRouterName()}/delete`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new PreRegisterUserDTO(req))
                                    .setMethod("deletePreRegisterUser")
                                    .isValidateRole("PRE_REGISTER_USER")
                                    .isLogicalDelete()
                                    .build();
        
            this.getController().delete(requestHandler);
        });
    }
}

export default PreRegisterUserRoutes;
