import { Request, Response, 
         RequestHandler, RequestHandlerBuilder, 
         GenericController, GenericRoutes,
         getUrlParam,
         FindManyOptions} from "@modules/index";
import { UnitDynamicCentral, UdcDTO } from '@modules/01_General/udc';

class UdcRoutes extends GenericRoutes{
    constructor() {
        super(new GenericController(UnitDynamicCentral), "/udc");
    }

    protected initializeRoutes() {
        this.router.get(`${this.getRouterName()}/get`, async (req: Request, res: Response) => {
            const requestHandler : RequestHandler = 
                                    new RequestHandlerBuilder(res,req)
                                    .setAdapter(new UdcDTO(req))
                                    .setMethod("getUdcById")
                                    .isValidateRole("UNIT_DYNAMIC_CENTRAL")
                                    .isLogicalDelete()
                                    .build();
        
            this.getController().getById(requestHandler);
        });
        
        this.router.get(`${this.getRouterName()}/get_by_code`, async (req: Request, res: Response) => {
            const requestHandler : RequestHandler = 
                                    new RequestHandlerBuilder(res,req)
                                    .setAdapter(new UdcDTO(req))
                                    .setMethod("getUdcByCode")
                                    .isValidateRole("UNIT_DYNAMIC_CENTRAL")
                                    .isLogicalDelete()
                                    .build();
        
            this.getController().getByCode(requestHandler);
        });
        
        this.router.get(`${this.getRouterName()}/get_all`, async (req: Request, res: Response) => {
        
            const type : string | null = getUrlParam("type", req) || null;
            const options: FindManyOptions = {};
            if(type != null){
                options.where = { ...options.where, type: type};
            }

            const requestHandler : RequestHandler = 
                                    new RequestHandlerBuilder(res,req)
                                    .setAdapter(new UdcDTO(req))
                                    .setMethod("getUdcs")
                                    .isValidateRole("UNIT_DYNAMIC_CENTRAL")
                                    .isLogicalDelete()
                                    .setFilters(options)
                                    //.setCodeMessageResponse("TEST")
                                    .build();
        
            this.getController().getAll(requestHandler);
        });
        
        this.router.post(`${this.getRouterName()}/add`, async (req: Request, res: Response) => {

            const requiredBodyList: Array<string> = [
                req.body.code, 
                req.body.name
            ];

            const requestHandler : RequestHandler = 
                                    new RequestHandlerBuilder(res,req)
                                    .setAdapter(new UdcDTO(req))
                                    .setMethod("insertUdc")
                                    .setRequiredFiles(requiredBodyList)
                                    .isValidateRole("UNIT_DYNAMIC_CENTRAL")
                                    .build();
        
            this.getController().insert(requestHandler);
        });
        
        this.router.put(`${this.getRouterName()}/edit`, async (req: Request, res: Response) => {
            const requestHandler : RequestHandler = 
                                    new RequestHandlerBuilder(res,req)
                                    .setAdapter(new UdcDTO(req))
                                    .setMethod("updateUdc")
                                    .isValidateRole("UNIT_DYNAMIC_CENTRAL")
                                    .build();
        
            this.getController().update(requestHandler);
        });
        
        this.router.delete(`${this.getRouterName()}/delete`, async (req: Request, res: Response) => {
            const requestHandler : RequestHandler = 
                                    new RequestHandlerBuilder(res,req)
                                    .setAdapter(new UdcDTO(req))
                                    .setMethod("deleteUdc")
                                    .isValidateRole("UNIT_DYNAMIC_CENTRAL")
                                    .isLogicalDelete()
                                    .isValidateWhereByUserId()
                                    .build();
        
            this.getController().delete(requestHandler);
        });
    }
}
export default UdcRoutes;