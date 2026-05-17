import { ConstTemplate } from "@index/consts/Const";
import { Notification } from "@index/entity/Notification";
import { UserNotification } from "@index/entity/UserNotification";
import { User } from "@TenshiJS/entity/User";
import GenericRepository from "@TenshiJS/generics/Repository/GenericRepository";
import EmailService from "@TenshiJS/services/EmailServices/EmailService";
import { getEmailTemplate, getMessageEmail } from "@TenshiJS/utils/htmlTemplateUtils";
import { config } from "@index/index";

// Sends an email and stores a user notification
export async function sendEmailAndUserNotification(userNotifications: any, variables: any, needsAddUserNotification: boolean): Promise<UserNotification | null> {
    // Repositories to retrieve Notification, User, and create UserNotification
    const repositoryNotification = await new GenericRepository(Notification);
    const repositoryUser = await new GenericRepository(User);
    const repositoryUserNotification = await new GenericRepository(UserNotification);

    // Fetch the notification configuration by code
    const notification: Notification = await repositoryNotification.findByCode(userNotifications.notification, true);

    // Check if the notification exists and is configured to send an email
    if (notification && notification.required_send_email) {
        // Get the user who will receive the notification
        const user: User = await repositoryUser.findById(userNotifications.user_receive, true);

        // Determine if the message should be pulled from a localized JSON template
        const useJsonTemplate = notification.text_from_email_message_json;

        // Set which email template to use, just use the name without .html extension
        const template = notification.email_template ?? ConstTemplate.GENERIC_TEMPLATE_EMAIL;

        // Get the subject based on JSON keys if acronymous is defined, otherwise use default notification subject
        const subject = useJsonTemplate && userNotifications.acronymous
            ? getMessageEmail(userNotifications.acronymous, user.language!, "Subject")
            : notification.subject;

        // Get the email body content from JSON message file or use default message
        const bodyContent = useJsonTemplate && userNotifications.acronymous
            ? getMessageEmail(userNotifications.acronymous, user.language!, "EmailMessage")
            : notification.email_message;

        // Get the email title (for template variable use)
        const title = useJsonTemplate && userNotifications.acronymous
            ? getMessageEmail(userNotifications.acronymous, user.language!, "Title")
            : notification.subject;

        // Merge required variables into the template rendering context,
        // ensuring these keys always override external ones
        variables = {
            userName: user.name,
            emailSubject: title,
            emailContent: bodyContent,
            actionTitle: notification.action_text,
            actionUrl: notification.action_url,
            ...variables,
        };

        // Render the final HTML email using the selected template and variables
        const htmlBody = await getEmailTemplate(template, user.language, variables);

        // Send the email
        const emailService = EmailService.getInstance();
        await emailService.sendEmail({
            //localhost
            //toMail: [user.email],
            //prod
            toMail: [user.email, config.SUPER_ADMIN.USER_EMAIL],
            subject,
            message: htmlBody,
            attachments: [],
        });
    }

    if(needsAddUserNotification){
        // Create and store the user notification in the database
        const userNotificationAdded: UserNotification = await repositoryUserNotification.add(userNotifications);
        return userNotificationAdded;
    }else{
        return null;
    }
    
}



















export interface NotificationContext {
    subject: string;
    title: string;
    bodyContent: string;
    htmlBody: string;
    variables: Record<string, any>;
    template: string;
    user: User;
}

export async function buildNotificationContext(
    userNotifications: any,
    variables: any
): Promise<NotificationContext | null> {
    const repositoryNotification = new GenericRepository(Notification);
    const repositoryUser = new GenericRepository(User);

    const notification: Notification = await repositoryNotification.findByCode(
        userNotifications.notification, true
    );

    if (!notification) return null;

    const user: User = await repositoryUser.findById(
        userNotifications.user_receive, true
    );

    const useJsonTemplate = notification.text_from_email_message_json;
    const template = userNotifications.override_template    // <-- permite override desde el controller
        ?? notification.email_template
        ?? ConstTemplate.GENERIC_TEMPLATE_EMAIL;

    const subject = useJsonTemplate && userNotifications.acronymous
        ? getMessageEmail(userNotifications.acronymous, user.language!, "Subject")
        : notification.subject;

    const bodyContent = useJsonTemplate && userNotifications.acronymous
        ? getMessageEmail(userNotifications.acronymous, user.language!, "EmailMessage")
        : notification.email_message;

    const title = useJsonTemplate && userNotifications.acronymous
        ? getMessageEmail(userNotifications.acronymous, user.language!, "Title")
        : notification.subject;

    const mergedVariables = {
        userName: user.name,
        emailSubject: title,
        emailContent: bodyContent,
        actionTitle: notification.action_text,
        actionUrl: notification.action_url,
        ...variables,
    };

    const htmlBody = await getEmailTemplate(template, user.language, mergedVariables);

    return {
        subject,
        title,
        bodyContent: bodyContent ? bodyContent : '',
        htmlBody,
        variables: mergedVariables,
        template,
        user,
    };
}



 export async function sendEmailNotification(
    userNotifications: any,
    variables: any,
    needsAddUserNotification: boolean
): Promise<UserNotification | null> {
    const repositoryNotification = new GenericRepository(Notification);
    const repositoryUserNotification = new GenericRepository(UserNotification);

    const notification: Notification = await repositoryNotification.findByCode(
        userNotifications.notification, true
    );

    if (notification?.required_send_email) {
        const ctx = await buildNotificationContext(userNotifications, variables);

        if (ctx) {
            const emailService = EmailService.getInstance();
            await emailService.sendEmail({
                toMail: [ctx.user.email, config.SUPER_ADMIN.USER_EMAIL],
                subject: ctx.subject,
                message: ctx.htmlBody,
                attachments: [],
            });
        }
    }

    if (needsAddUserNotification) {
        return await repositoryUserNotification.add(userNotifications);
    }

    return null;
}



/*

// Ejemplo desde el controller — enviar con template personalizado
const ctx = await buildNotificationContext(
    {
        user_receive: appointment.customer.id,
        notification: "appointmentStep8",
        acronymous: "appointmentStep8",
        override_template: "credit_summary_template", // <-- tu template custom
    },
    {
        patientName: appointment.customer.name,
        procedureName: appointment.package?.procedure?.name,
        totalProcedure: 1500,
    }
);

if (ctx) {
    const emailService = EmailService.getInstance();
    await emailService.sendEmail({
        toMail: [ctx.user.email],
        subject: ctx.subject,
        message: ctx.htmlBody,
        attachments: [],
    });
}

*/