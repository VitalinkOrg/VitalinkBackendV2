import { Request, Response, GenericRoutes,
         RequestHandler, RequestHandlerBuilder,
         FindManyOptions} from "@modules/index";
import { default as UserNotificationController } from '@modules/01_General/notification/controllers/UserNotificationController';
import { UserNotificationDTO, requiredBodyListUserNotifications } from '@modules/01_General/notification/index';

class UserNotificationRoutes extends GenericRoutes {

    private buildBaseFilters(): FindManyOptions {
      return {
        relations: ["user_receive", "user_send", "notification"],
        where: {}
      };
    }

    
    constructor() {
        super(new UserNotificationController(), "/usernotification");
    }

    protected initializeRoutes() {
        this.router.get(`${this.getRouterName()}/get`, async (req: Request, res: Response) => {
  
            const filters = this.buildBaseFilters();
            const requestHandler : RequestHandler = 
                                    new RequestHandlerBuilder(res,req)
                                    .setAdapter(new UserNotificationDTO(req))
                                    .setMethod("getUserNotificationById")
                                    .isValidateRole("USER_NOTIFICATION")
                                    .isLogicalDelete()
                                    .setFilters(filters)
                                    .setDynamicRoleValidationByEntityField([
                                        ["CUSTOMER", "user_receive.id"],
                                        ["LEGAL_REPRESENTATIVE", "user_receive.id"],
                                        ["FINANCE_ENTITY", "user_receive.id"]
                                      ])
                                    .build();
        
            this.getController().getById(requestHandler);
        });
        

         this.router.get(`${this.getRouterName()}/get_all`, async (req: Request, res: Response) => {
        
            const filters = this.buildBaseFilters();
            const requestHandler : RequestHandler = 
                                    new RequestHandlerBuilder(res,req)
                                    .setAdapter(new UserNotificationDTO(req))
                                    .setMethod("getUserNotification")
                                    .isValidateRole("USER_NOTIFICATION")
                                    .setFilters(filters)
                                    .isLogicalDelete()
                                    .setDynamicRoleValidationByEntityField([
                                        ["CUSTOMER", "user_receive.id"],
                                        ["LEGAL_REPRESENTATIVE", "user_receive.id"],
                                        ["FINANCE_ENTITY", "user_receive.id"]
                                      ])
                                    .build();
        
          //TODO JUST WORK AFTER RUN STORED PROCEDURE src\data\db_scripting\01_db_stored_procedures.sql
          this.getController().getAll(requestHandler);
        });
        
        this.router.post(`${this.getRouterName()}/add`, async (req: Request, res: Response) => {
        
            const requestHandler : RequestHandler = 
                                    new RequestHandlerBuilder(res,req)
                                    .setAdapter(new UserNotificationDTO(req))
                                    .setMethod("insertUserNotification")
                                    .setRequiredFiles(requiredBodyListUserNotifications(req))
                                    .isValidateRole("USER_NOTIFICATION")
                                    .build();
        
            this.getController().insert(requestHandler);
        });
        
        this.router.put(`${this.getRouterName()}/is_read`, async (req: Request, res: Response) => {
            const requestHandler : RequestHandler = 
                                    new RequestHandlerBuilder(res,req)
                                    .setAdapter(new UserNotificationDTO(req))
                                    .setMethod("updateUserNotification")
                                    .isValidateRole("USER_NOTIFICATION")
                                    .isLogicalDelete()
                                    .build();
        
            this.getController().update(requestHandler);
        });
        
        this.router.delete(`${this.getRouterName()}/delete`, async (req: Request, res: Response) => {
            const requestHandler : RequestHandler = 
                                    new RequestHandlerBuilder(res,req)
                                    .setAdapter(new UserNotificationDTO(req))
                                    .setMethod("deleteUserNotification")
                                    .isValidateRole("USER_NOTIFICATION")
                                    .isLogicalDelete()
                                    .build();
        
            this.getController().delete(requestHandler);
        });
    }
}

export default UserNotificationRoutes;
