import { Request, Response, 
RequestHandler, RequestHandlerBuilder, 
GenericRoutes,
FindManyOptions} from "@modules/index";
import AppointmentFlowLogDTO from "@modules/02_Vitalink/appointmentflowlog/dtos/AppointmentFlowLogDTO";
import AppointmentFlowLogController from "../controller/AppointmentFlowLogController";

class AppointmentFlowLogRoutes extends GenericRoutes {

private buildBaseFilters(): FindManyOptions {
  return {
    relations: ["appointment","flow_event","performed_by"],
    where: {}
  };
}

constructor() {
  super(new AppointmentFlowLogController(), "/appointmentflowlog");
}


protected initializeRoutes() {
// —————————————————————————————————————————————————————————————————————
// SINGLE CRUD
// —————————————————————————————————————————————————————————————————————
this.router.get(`${this.getRouterName()}/get`, async (req: Request, res: Response) => {

    const filters = this.buildBaseFilters();

   const requestHandler: RequestHandler = 
       new RequestHandlerBuilder(res, req)
           .setAdapter(new AppointmentFlowLogDTO(req))
           .setMethod("getAppointmentFlowLogById")
           .isValidateRole("APPOINTMENT_FLOW_LOG")
           
           .setFilters(filters)
           .build();

   this.getController().getById(requestHandler);
});

this.router.get(`${this.getRouterName()}/get_all`, async (req: Request, res: Response) => {

    const filters = this.buildBaseFilters();

   
   const requestHandler: RequestHandler = 
       new RequestHandlerBuilder(res, req)
           .setAdapter(new AppointmentFlowLogDTO(req))
           .setMethod("getAppointmentFlowLogs")
           .isValidateRole("APPOINTMENT_FLOW_LOG")
           
           .setFilters(filters)
           .build();

   this.getController().getAll(requestHandler);
});

this.router.post(`${this.getRouterName()}/add`, async (req: Request, res: Response) => {
   const requiredBodyList: Array<string> = [
       req.body.appointment
   ];
   
   const requestHandler: RequestHandler = 
       new RequestHandlerBuilder(res, req)
           .setAdapter(new AppointmentFlowLogDTO(req))
           .setMethod("insertAppointmentFlowLog")
           .setRequiredFiles(requiredBodyList)
           .isValidateRole("APPOINTMENT_FLOW_LOG")
           .build();

   this.getController().insert(requestHandler);
});

this.router.put(`${this.getRouterName()}/edit`, async (req: Request, res: Response) => {
   const requestHandler: RequestHandler = 
       new RequestHandlerBuilder(res, req)
           .setAdapter(new AppointmentFlowLogDTO(req))
           .setMethod("updateAppointmentFlowLog")
           .isValidateRole("APPOINTMENT_FLOW_LOG")
           .build();

   this.getController().update(requestHandler);
});

this.router.delete(`${this.getRouterName()}/delete`, async (req: Request, res: Response) => {
   const requestHandler: RequestHandler = 
       new RequestHandlerBuilder(res, req)
           .setAdapter(new AppointmentFlowLogDTO(req))
           .setMethod("deleteAppointmentFlowLog")
           .isValidateRole("APPOINTMENT_FLOW_LOG")
           
           .build();

   this.getController().delete(requestHandler);
});

// —————————————————————————————————————————————————————————————————————
// BULK INSERT
// —————————————————————————————————————————————————————————————————————
this.router.post(`${this.getRouterName()}/add_multiple`, async (req: Request, res: Response) => {
   const requestHandler: RequestHandler = 
       new RequestHandlerBuilder(res, req)
           .setAdapter(new AppointmentFlowLogDTO(req))
           .setMethod("insertMultipleAppointmentFlowLog")
           .isValidateRole("APPOINTMENT_FLOW_LOG")
           .build();

   this.getController().insertMultiple(requestHandler);
});

// —————————————————————————————————————————————————————————————————————
// BULK UPDATE (FULL OBJECTS)
// —————————————————————————————————————————————————————————————————————
this.router.patch(`${this.getRouterName()}/edit_multiple`, async (req: Request, res: Response) => {
   const requestHandler: RequestHandler = 
       new RequestHandlerBuilder(res, req)
           .setAdapter(new AppointmentFlowLogDTO(req))
           .setMethod("updateMultipleAppointmentFlowLog")
           .isValidateRole("APPOINTMENT_FLOW_LOG")
           .build();

   this.getController().updateMultiple(requestHandler);
});

// —————————————————————————————————————————————————————————————————————
// BULK PARTIAL UPDATE BY IDS
// —————————————————————————————————————————————————————————————————————
this.router.patch(`${this.getRouterName()}/edit_multiple_by_ids`, async (req: Request, res: Response) => {
   const requestHandler: RequestHandler = 
       new RequestHandlerBuilder(res, req)
           .setAdapter(new AppointmentFlowLogDTO(req))
           .setMethod("updateMultipleAppointmentFlowLogByIds")
           .setRequiredFiles([req.body.ids])     
           .isValidateRole("APPOINTMENT_FLOW_LOG")
           .build();

   this.getController().updateMultipleByIds(requestHandler);
});

// —————————————————————————————————————————————————————————————————————
// BULK DELETE
// —————————————————————————————————————————————————————————————————————
this.router.post(`${this.getRouterName()}/delete_multiple`, async (req: Request, res: Response) => {
   const requestHandler: RequestHandler = 
       new RequestHandlerBuilder(res, req)
           .setAdapter(new AppointmentFlowLogDTO(req))
           .setMethod("deleteMultipleAppointmentFlowLog")
           .isValidateRole("APPOINTMENT_FLOW_LOG")
           
           .build();

   this.getController().deleteMultiple(requestHandler);
});
}
}
export default AppointmentFlowLogRoutes;