
import { AppointmentFlowLog } from "@index/entity/AppointmentFlowLog";
import { Request, IAdapterFromBody } from "@modules/index";

export default class AppointmentFlowLogDTO implements IAdapterFromBody {
    req: Request;

    constructor(req: Request) {
        this.req = req;
    }

    private buildEntity(source: any, isCreating: boolean): AppointmentFlowLog {
        const entity = new AppointmentFlowLog();
        entity.appointment = this.req.body.appointment;
        entity.flow_event = this.req.body.flow_event;
        entity.description = this.req.body.description;
        entity.performed_by = this.req.body.performed_by;
          
        if (isCreating) {
            entity.created_at = new Date();
        } 
        return entity;
    }

    // POST
    entityFromPostBody(): AppointmentFlowLog {
        return this.buildEntity(this.req.body, true);
    }

    // PUT
    entityFromPutBody(): AppointmentFlowLog {
        return this.buildEntity(this.req.body, false);
    }

    // POST / PUT desde array
    entityFromObject(obj: any, isCreating: boolean = true): AppointmentFlowLog {
        return this.buildEntity(obj, isCreating);
    }

    // GET
    entityToResponse(entity: AppointmentFlowLog): any {
        return {
            id: entity.id,
            appointment: entity.appointment,
            flow_event: entity.flow_event,
            description: entity.description,
            performed_by: entity.performed_by,
            created_at: entity.created_at,
        };
    }

    entitiesToResponse(entities: AppointmentFlowLog[] | null): any[] {
        if (!entities) return [];
        return entities.map(this.entityToResponse);
    }
}
