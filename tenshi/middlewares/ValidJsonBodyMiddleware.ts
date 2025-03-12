import { ConstMessagesJson, ConstStatusJson } from '@TenshiJS/consts/Const';
import { NextFunction, Response, Request} from 'express';
import HttpAction from 'tenshi/helpers/HttpAction';

export default function ValidJsonBodyMiddleware(err: any, req: Request, res: Response, next: NextFunction) {
    if ((req.method === 'POST' || req.method === 'PUT') && (err instanceof SyntaxError && "body" in err)) {
        const httpExec = new HttpAction(res);
        return httpExec.dynamicError(ConstStatusJson.ERROR, ConstMessagesJson.ERROR_BODY_JSON);
    }
    next();
}
