//*************************************** */
//              IMPORTS
//*************************************** */
//Import libraries 
import 'module-alias/register';
import 'reflect-metadata';
import { default as express } from 'express';
import { Router, Request, Response, NextFunction } from 'express';
import { default as cors } from 'cors';
import { default as bodyParser } from 'body-parser';

//Import classes
import UserRouter from '@user/routers/UserRouter';
import UdcRouter from '@udc/routers/UdcRouter';
import NotificationRouter from '@notification/routers/NotificationRouter';
import UserNotificationRouter from '@index/modules/notification/routers/UserNotificationRouter';

import StartMiddleware from '@middlewares/StartMiddleware';
import { debuggingMessage, insertLog } from '@utils/logsUtils';
import { executeQuery } from '@utils/executionDBUtils';



//*************************************** */
//              EXPORTS
//*************************************** */
export { Router, Request, Response, NextFunction };
export { express, cors, bodyParser };

//Objects
export { default as JWTObject } from '@objects/JWTObject';

//Utils & helpers
export { default as Validations } from '@helpers/Validations';
export { default as HttpAction } from '@helpers/HttpAction';
export { sendMail, replaceCompanyInfoEmails } from "@utils/sendEmailsUtils";
export { debuggingMessage, insertLog, executeQuery };



//*************************************** */
//              VARIABLES
//*************************************** */
//add necessary variables
const app = express();
app.use(cors());
app.use(bodyParser.json());



//*************************************** */
//              MIDDLEWARE
//*************************************** */
//MiddleWare to set content type to json
app.use((req : Request, res : Response, next : NextFunction) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  next();
});

//middleware to validate JWT and secret key
app.use(StartMiddleware);



//*************************************** */
//              ROUTES
//*************************************** */
//Add Routers
app.use(UserRouter);
app.use(UdcRouter);
app.use(NotificationRouter);
app.use(UserNotificationRouter);


//*************************************** */
//              LISTENER
//*************************************** */
//Open port and listen API
const PORT = process.env.SERVER_PORT || 3000;
app.listen(PORT, () => {
  debuggingMessage(`UNBREAKABLE Express TypeScript Service Start in Port ${PORT}`);
});