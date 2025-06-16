import { Appointment } from "@index/entity/Appointment";
import { AppointmentCredit } from "@index/entity/AppointmentCredit";
import { AppointmentFlowLog } from "@index/entity/AppointmentFlowLog";
import { sendEmailAndUserNotification } from "@index/modules/01_General/notification/utils/NotificationUtils";
import { UnitDynamicCentral } from "@TenshiJS/entity/UnitDynamicCentral";
import { User } from "@TenshiJS/entity/User";
import GenericRepository from "@TenshiJS/generics/Repository/GenericRepository";
import { format12Hour, formatNormalDate } from "@TenshiJS/utils/formatDateUtils";
import { getMessageEmail, replaceVariables } from "@TenshiJS/utils/htmlTemplateUtils";

/**
         * Handles sending a notification email and saving an appointment flow log.
         *
         * @param acronymous - The notification key prefix, e.g., "appointmentStep2".
         * @param appointment - The appointment entity containing all related data.
         * @param appointmentCredit - (Optional) The credit entity, used only for credit-related steps.
         * @param userId - ID of the user performing the action.
         * @param language - Language code to fetch localized messages (e.g., "es", "en").
         * @param flowEventCode - Code of the flow event to store in the log.
         * @param userReceiveId - The ID of the user who will receive the notification.
         * @param variables - List of dynamic variables required by the template (e.g., ["patientName", "procedureName"]).
         */
  export async function handleFlowNotificationAndLog({
        acronymous,
        appointment,
        appointmentCredit = null,
        userId,
        language,
        flowEventCode,
        userReceiveId,
        variables,
        addUserNotification = true,
        }: {
        acronymous: string;
        appointment: Appointment;
        appointmentCredit?: AppointmentCredit | null;
        userId: number | string;
        language: string;
        flowEventCode: string | null;
        userReceiveId: number | string;
        variables: string[];
        addUserNotification?: boolean;
    }) {

        const appointmentFlowLogRepository = await new GenericRepository(AppointmentFlowLog);

        // Create a new flow log entry
        const appointmentFlowLog = new AppointmentFlowLog();
        appointmentFlowLog.appointment = appointment;
        appointmentFlowLog.performed_by =  { id: userId } as User;

        // Dynamically construct the JSON payload for email/message templates
        const jsonData: Record<string, any> = {};

        for (const variable of variables) {
            // Fill jsonData with required values based on provided variable names
            if (variable === "appointmentDate") {
                jsonData[variable] = formatNormalDate(appointment.appointment_date);
            }

            if (variable === "appointmentHour") {
                jsonData[variable] = format12Hour(appointment.appointment_hour);
            }

            if (variable === "patientName") {
                jsonData[variable] = appointment.customer?.name;
            }

            if (variable === "procedureName") {
                jsonData[variable] = appointment.package?.procedure?.name;
            }

            if (variable === "productName") {
                jsonData[variable] = appointment.package?.product?.name;
            }

            if (variable === "supplierName") {
                jsonData[variable] = appointment.supplier?.name;
            }

            if (variable === "paymentMethod") {
                jsonData[variable] = appointment.payment_method?.name || "Not specified";
            }

            if (variable === "financeEntityName") {
                jsonData[variable] = appointment.customer.finance_entity?.name;
            }

            // Only access credit-specific fields if a credit entity was provided
            if (appointmentCredit !== null) {
              
                if (variable === "requestAmount") {
                    jsonData[variable] = appointmentCredit.requested_amount;
                }


                if (variable === "Amount") {
                    jsonData[variable] = appointmentCredit.approved_amount;
                }
            }
        }

        // Build the flow message using language-specific template and replaced variables
        let anotherMessage = getMessageEmail(acronymous, language, "AnotherMessage");
        anotherMessage = replaceVariables(anotherMessage, jsonData);

        let emailMessage = getMessageEmail(acronymous, language, "EmailMessage");
        emailMessage = replaceVariables(emailMessage, jsonData);

        let notificationMessage = getMessageEmail(acronymous, language, "NotificationMessage");
        notificationMessage = replaceVariables(notificationMessage, jsonData);

        let subject = getMessageEmail(acronymous, language, "Subject");
        subject = replaceVariables(subject, jsonData);


        // Prepare notification metadata
        const userNotification: Record<string, any> = {
            user_receive: userReceiveId,
            notification: acronymous,
            acronymous,
            subject: subject,
            email_message: emailMessage,
            another_message: anotherMessage,
            notification_message: notificationMessage,
        };

        // Send the email and push notification to the recipient
        await sendEmailAndUserNotification(userNotification, jsonData, addUserNotification);

        // Store the flow event and description in the flow log
        if(flowEventCode != null) {
            appointmentFlowLog.flow_event = { code: flowEventCode } as UnitDynamicCentral;
        }
        appointmentFlowLog.description = anotherMessage;

        // Save the log entry to the database
        await appointmentFlowLogRepository.add(appointmentFlowLog);
    }