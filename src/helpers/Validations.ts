import { Request, Response, HttpAction, JWTObject } from '@index/index';
import { getRegex } from "@utils/jsonUtils";

const jwt = require('jsonwebtoken');
require('dotenv').config();

/*
    This Validations Class have all the required validation in the app
*/

export default class Validations{
    req: Request;
    res: Response;
    httpAction: HttpAction;

    constructor(req: Request, res: Response, httpAction: HttpAction) {
        this.req = req;
        this.res = res;
        this.httpAction = httpAction;
    }

  
    //This method has the logic of validation required body fields
    public validateRequiredFields(listRequiredFields:  string[] | null): Boolean{
       
        let haveAllRequiredFields = true;

        if(listRequiredFields != null){
            listRequiredFields.forEach((requireField) => {
                if (requireField == undefined) {
                    haveAllRequiredFields = false;
                }
            });
        }else{
            this.httpAction.validationError("INCOMPLETE_BODY_REQUEST");
        }

        if (!haveAllRequiredFields) {
            this.httpAction.validationError("REQUIRED_FIELDS");
        }

        return haveAllRequiredFields;
    }

    //This function validate multiple Regex
    public validateMultipleRegex (listRegex: [string, string][] | null)
    {
        //Validate just in production
        if(parseInt(process.env.IS_DEBUGGING || '0', 10) == 0){

            if(listRegex != null){
                for (const [listKey, value] of listRegex) {
                
                    const regexObject = getRegex(listKey);
                    let regexResult = null;
    
                    if(value != null){
                        //validate the word, if has an error, validate Regex return a error validation
                        regexResult = this.validateRegex(value, regexObject.regex, regexObject.message);
                    }
                     
                    //return the error validatiokn
                    if(regexResult != null){
                        return regexResult;
                    }
                }
            }
            
        //anyway return null
            return null;
        }else{
            return null;
        }
    };

    //This function validate the format of the current string
    private validateRegex(validationWord: string, regexStr: string, message: string)
    {
        const regex = new RegExp(regexStr);
        if (validationWord && regex.test(validationWord)) {
            // Valid format
            return null;
        } else {
            this.httpAction.dynamicError("REGEX", message);
        }
    }
 
  

    //This function validate if exist the jwt and if is required and has authorization to do this action.
    //This fucntion is used on Start Middleware
    public validateRequireJWT(){
        let returnJwt = null; 
    
        try{
            if (!this.req.headers) {
                this.httpAction.validationError("INCOMPLETE_HEADER_REQUEST");
            }else{
        
                //validation of authorization
                if (!this.req.headers['authorization']) {
                    this.httpAction.validationError("INCOMPLETE_HEADER_REQUEST");
                }else{
        
                    //validate a assigned secret key with the DB
                    const jwtAuth = this.req.headers['authorization'];
                  
                    try {
                        const decoded = jwt.verify(jwtAuth, process.env.JWT_SECRET_KEY); // Verifica el token usando tu clave secreta
                        returnJwt = decoded;
                    } catch (error) {
                        this.httpAction.unauthorizedError("INVALID_TOKEN");
                    }
                }
            }
        }catch(error : any){
            this.httpAction.generalError(error);
        }
    
        return returnJwt;
    }



    //Validate the required api key
    public validateRequireSecretApiKey(){

        let varReturn = null; 
    
        try{
            if (!this.req.headers) {
                this.httpAction.validationError("INCOMPLETE_HEADER_REQUEST");
            }else{
        
                //validation of authorization
                if (!this.req.headers['x-api-key']) {
                    this.httpAction.validationError("INCOMPLETE_HEADER_REQUEST");
                }else{
        
                    //validate a assigned secret key with the DB
                    const xApiKey = this.req.headers['x-api-key'];
                  
                    try {
                        if(xApiKey == process.env.COMPANY_SECRET_API_KEY){
                            varReturn = true;
                        }else{
                            this.httpAction.unauthorizedError("INVALID_API_KEY");
                        }
                        
                    } catch (error) {
                        this.httpAction.unauthorizedError("INVALID_API_KEY");
                    }
                }
            }
        }catch(error : any){
            this.httpAction.generalError(error);
        }
    
        return varReturn;
    }




    //This fucntion get the ID of the JWT
    public validateIdFromQueryUsers(jwtData : JWTObject) : number{
        try{

            let id : number = 0;
            if(this.req.query['id'] != undefined && jwtData.role == "ADMIN"){
                id = parseInt(this.req.query['id'] as string, 10);
            }else{
                id = jwtData.id;
            }
            return id;

        }catch(error: any){
            return 0;
        } 
    }

    //verify if is, comes from query string ?id=1
    public validateIdFromQuery() : number | null{
        try{

            let id : number | null = null;
            if(this.req.query['id'] != undefined){
                id = parseInt(this.req.query['id'] as string, 10);
            }
            return id;

        }catch(error: any){
            return null;
        } 
    }

    //validate if code comes from query stering ?code=code1
    public validateCodeFromQuery() : string | null{
        try{

            let code : string | null = null;
            if(this.req.query['code'] != undefined){
                code = this.req.query['code'] as string;
            }
            return code;

        }catch(error: any){
            return null;
        } 
    }
}