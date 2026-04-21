import { Request, Response, 
         RequestHandler, RequestHandlerBuilder, 
          GenericRoutes, 
          GenericController} from "@modules/index";
import {  User, UserDTO, 
        } from "@modules/01_General/user/index";
import FinanceEntityDTO from "../dtos/FinanceEntityDTO";

class FinanceEntityRoutes extends GenericRoutes {

    /**
     * Constructor for the FinanceEntityRoutes class.
     * This class is responsible for initializing the routes for the FinanceEntity module.
     * It creates a new instance of the FinanceEntityController class, passing in the FinanceEntity entity and
     * UserRepository as parameters.
     */
    constructor() {
        // Call the parent class constructor and pass in a new instance of the UserController
        // class, along with the User entity and UserRepository as parameters.
        super(new GenericController(User), "/financeentity");
    }

    protected initializeRoutes() {
   

        this.router.get(`${this.getRouterName()}/get_all`, async (req: Request, res: Response) => {

            const filter = {
                where: { role_code : "FINANCE_ENTITY" }
            };

            const requestHandler: RequestHandler = 
            new RequestHandlerBuilder(res, req)
                .setAdapter(new FinanceEntityDTO(req))
                .setMethod("get_all")
                .isLogicalDelete()
                .setFilters(filter)
                .build();

                this.getController().getAll(requestHandler);
        });
    
    }
}

export default FinanceEntityRoutes;
