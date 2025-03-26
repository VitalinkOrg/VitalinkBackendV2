//*************************************** */
//              Configuration
//*************************************** */
import path from 'path';
import ConfigManager from '@TenshiJS/config/ConfigManager';
//set configuration first time
const configPath = path.resolve(__dirname, '../tenshi-config.json');
const configManager = ConfigManager.getInstance(configPath);
const config = configManager.getConfig();

//*************************************** */
//          Entities and Database
//*************************************** */
import { Database } from "@TenshiJS/persistance/TypeORMConnection";
import { User } from '@TenshiJS/entity/User';
import { Document } from '@entity/Document';
import { Notification } from '@entity/Notification';
import { UnitDynamicCentral } from '@TenshiJS/entity/UnitDynamicCentral';
import { UserNotification } from '@entity/UserNotification';

import { Location } from '@entity/Location';
import { Supplier } from '@entity/Supplier';
import { Appointment } from '@entity/Appointment';
import { AppointmentCredit } from '@entity/AppointmentCredit';
import { Availability } from '@entity/Availability';
import { CertificationsExperience } from '@entity/CertificationsExperience';
import { Package } from '@entity/Package';
import { PreRegisterUser } from '@entity/PreRegisterUser';
import { ProcedureBySpecialty } from '@entity/ProcedureBySpecialty';
import { Review } from '@entity/Review';
import { ReviewDetail } from '@entity/ReviewDetail';
import { SpecialtyBySupplier } from '@entity/SpecialtyBySupplier';
import { LanguageSupplier } from '@entity/LanguageSupplier';


//*************************************** */
//              IMPORTS
//*************************************** */
//Import general libraries 
import 'module-alias/register';
import 'reflect-metadata';
import http from 'http';
import { default as express } from 'express';
import { Router, Request, Response, NextFunction } from 'express';
import { default as cors } from 'cors';
import { default as bodyParser } from 'body-parser';

//Import Routes
import AuthRoutes from '@modules/01_General/auth/routers/AuthRoutes';
import UserRoutes from '@modules/01_General/user/routers/UserRoutes';
import RoleRoutes from '@modules/01_General/role/routers/RoleRoutes';
import UdcRoutes from '@modules/01_General/udc/routers/UdcRoutes';
import NotificationRoutes from '@modules/01_General/notification/routers/NotificationRoutes';
import UserNotificationRoutes from '@modules/01_General/notification/routers/UserNotificationRoutes';
import LogRoutes from '@index/modules/01_General/log/routers/LogRoutes';
import EmailRoutes from '@modules/01_General/email/routers/EmailRoutes';
import DocumentRoutes from '@index/modules/01_General/document/routers/DocumentRoutes';

import LocationRoutes from '@modules/02_Vitalink/location/routers/LocationRoutes';
import SupplierRoutes from '@modules/02_Vitalink/supplier/routers/SupplierRoutes';
import SpecialtyBySupplierRoutes from '@modules/02_Vitalink/specialtybysupplier/routers/SpecialtyBySupplierRoutes';
import ProcedureBySpecialtyRoutes from '@modules/02_Vitalink/procedurebyspecialty/routers/ProcedureBySpecialtyRoutes';
import PackageRoutes from '@modules/02_Vitalink/package/routers/PackageRoutes';
import AvailabilityRoutes from '@modules/02_Vitalink/availability/routers/AvailabilityRoutes';
import CertificationsExperienceRoutes from '@modules/02_Vitalink/certificationsexperience/routers/CertificationsExperienceRoutes';
import LanguageSupplierRoutes from '@modules/02_Vitalink/languagesupplier/routers/LanguageSupplierRoutes';


//Import internal classes and functions
import StartMiddleware from '@TenshiJS/middlewares/StartMiddleware';
import RateLimitMiddleware from '@TenshiJS/middlewares/RateLimitMiddleware';
import { debuggingMessage, insertLogBackend, insertLogTracking } from '@TenshiJS/utils/logsUtils';
import helmet from 'helmet';
import { ConstGeneral } from '@TenshiJS/consts/Const';
import RouteNotFoundMiddleware from '@TenshiJS/middlewares/RouteNotFoundMiddleware';
import { CorsHandlerMiddleware } from '@TenshiJS/middlewares/CorsHandlerMiddleware';
import LoggingHandlerMiddleware from '@TenshiJS/middlewares/LoggingHandlerMiddleware';
import ValidJsonBodyMiddleware from '@TenshiJS/middlewares/ValidJsonBodyMiddleware';






//*************************************** */
//              EXPORTS
//*************************************** */
export { Router, Request, Response, NextFunction };
export { express, cors, bodyParser };

//Objects
export { default as JWTObject } from '@TenshiJS/objects/JWTObject';

//Utils & helpers
export { default as Validations } from '@TenshiJS/helpers/Validations';
export { default as HttpAction } from '@TenshiJS/helpers/HttpAction';

export { debuggingMessage, insertLogBackend, insertLogTracking, config };



//*************************************** */
//           Started Variables
//*************************************** */
//add necessary variables
const app = express();
export let httpServer: ReturnType<typeof http.createServer>;


//*************************************** */
//           Started FUNCTION
//*************************************** */
export const TenshiMain = async() => {

    await Database.getInstance([
      User, 
      Document, 
      Notification, 
      UnitDynamicCentral, 
      UserNotification,
      Location,
      Supplier,
      Appointment,
      AppointmentCredit,
      Availability,
      CertificationsExperience,
      Package,
      PreRegisterUser,
      ProcedureBySpecialty,
      Review,
      ReviewDetail,
      SpecialtyBySupplier,
      LanguageSupplier,
    ]);

    //Cors handler middle ware
    app.use(CorsHandlerMiddleware);
    app.use(cors());
    app.use(bodyParser.json());


    //*************************************** */
    //              MIDDLEWARES
    //*************************************** */
    //MiddleWare to set content type to json
    app.use((req : Request, res : Response, next : NextFunction) => {
      res.setHeader(ConstGeneral.HEADER_TYPE, ConstGeneral.HEADER_JSON);
      next();
    });

    if(config.SERVER.IS_DEBUGGING === false) {
      //security helmet headers middleware
      app.use(helmet());
      //rate limit fo dos attack middleware
      app.use(RateLimitMiddleware);
    }

    //middleware to validate JWT and secret key
    app.use(StartMiddleware);
    //logging handler 
    app.use(LoggingHandlerMiddleware);


    //*************************************** */
    //              ROUTES
    //*************************************** */
    //Add Routers
    app.use(new AuthRoutes().getRouter());
    app.use(new UserRoutes().getRouter());
    app.use(new RoleRoutes().getRouter());
    app.use(new UdcRoutes().getRouter());
    app.use(new NotificationRoutes().getRouter());
    app.use(new UserNotificationRoutes().getRouter());
    app.use(new LogRoutes().getRouter());
    app.use(new EmailRoutes().getRouter());
    app.use(new DocumentRoutes().getRouter());

    app.use(new LocationRoutes().getRouter());
    app.use(new SupplierRoutes().getRouter());
    app.use(new SpecialtyBySupplierRoutes().getRouter());
    app.use(new ProcedureBySpecialtyRoutes().getRouter());
    app.use(new PackageRoutes().getRouter());
    app.use(new AvailabilityRoutes().getRouter());
    app.use(new CertificationsExperienceRoutes().getRouter());
    app.use(new LanguageSupplierRoutes().getRouter());
    

    //*************************************** */
    //       NOT FOUND ROUTE MIDDLEWARE
    //*************************************** */
    app.use(RouteNotFoundMiddleware);
    app.use(ValidJsonBodyMiddleware);

    //*************************************** */
    //              LISTENER
    //*************************************** */
    httpServer = http.createServer(app);
    httpServer.listen(config.SERVER.PORT, () => {
      debuggingMessage(`${config.COMPANY.NAME} - TenshiJS Service Start in Port ${config.SERVER.PORT}`);
    });
};
  

/**
 * Function to close the TenshiJS service. This function is
 * useful when you want to close the service programmatically.
 * @param callback - Callback function that will be executed
 * when the service is closed.
 */
export const Shutdown = (callback: any) => {
  if (httpServer) {
    /**
     * Close the http server and then close the database
     * connection.
     */
    httpServer.close(() => {
      Database.closeConnection();
    });
  } else {
    /**
     * If there is no http server, then just close the database
     * connection.
     */
    Database.closeConnection();
  }
};


//*************************************** */
//              START SERVER
//*************************************** */
TenshiMain();