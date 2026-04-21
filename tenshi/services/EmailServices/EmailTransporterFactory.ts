import { IEmailTransporter } from './Interfaces/IEmailTransporter';
import { GeneralTransporter } from './Transporters/GeneralTransporter';
import { ResendTransporter } from './Transporters/ResendTransporter';

export class EmailTransporterFactory {
    static createEmailTransporter(type: string | null = "resend"): IEmailTransporter {
        switch (type) {
            case "nodemailer":
                return new GeneralTransporter();
            case "resend":
                return new ResendTransporter();
            case null:
                return new GeneralTransporter();
            // ADD OTHER CASES HERE
            default:
                throw new Error(`Transporter type ${type} is not supported.`);
        }
    }
}
