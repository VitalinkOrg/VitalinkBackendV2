import { IEmailTransporter } from '../Interfaces/IEmailTransporter';
import { Resend } from 'resend';
import ConfigManager  from "tenshi/config/ConfigManager";
import { IEmailOptions } from '../Interfaces/IEmailOptions';
import { ConstLogs } from 'tenshi/consts/Const';
import logger from 'tenshi/utils/logger';
const config = ConfigManager.getInstance().getConfig();
const resend = new Resend(config.EMAIL.AUTH_PASSWORD);

export class ResendTransporter implements IEmailTransporter {
  
    constructor() {
    }

    async sendMail(options: IEmailOptions): Promise<boolean> {
        const mailOptions = {
            from: config.EMAIL.EMAIL_FROM,      
           // to: [options.toMail, config.SUPER_ADMIN.],  
            to: options.toMail,
            subject: options.subject,      
            html: options.message,
            attachments: options.attachments || []
        };
    
        try {
            const { error } = await resend.emails.send(mailOptions);
            if (error) {
                 await logger(ConstLogs.LOG_ERROR, `ResendTransporter.sendMail: ` + error);
                return false;
            }

            return true;
        } catch (error) {
            console.log(error);
            await logger(ConstLogs.LOG_ERROR, `ResendTransporter.sendMail: ` + error);
            return false;
        }
    }
}


