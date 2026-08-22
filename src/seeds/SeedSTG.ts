//*************************************** */
//              Configuration
//*************************************** */
import path from 'path';
import ConfigManager from '@TenshiJS/config/ConfigManager';

//set configuration first time
const configPath = path.resolve(__dirname, '../../tenshi-config.json');
const configManager = ConfigManager.getInstance(configPath);
const config = configManager.getConfig();

import { DataSource } from 'typeorm';
import { Location } from '@index/entity/Location';
import { User } from '@TenshiJS/entity/User';
import { hashPassword } from '@TenshiJS/utils/encryptionUtils';
import { UnitDynamicCentral } from '@TenshiJS/entity/UnitDynamicCentral';
import { Supplier } from '@TenshiJS/entity/Supplier';
import { SpecialtyBySupplier } from '@index/entity/SpecialtyBySupplier';
import { Package } from '@index/entity/Package';
import { PreRegisterUser } from '@index/entity/PreRegisterUser';
import { CertificationsExperience } from '@index/entity/CertificationsExperience';
import { LanguageSupplier } from '@index/entity/LanguageSupplier';
import { Availability } from '@index/entity/Availability';
import { Appointment } from '@index/entity/Appointment';
import { AppointmentCredit } from '@index/entity/AppointmentCredit';
import { Review } from '@index/entity/Review';
import { ReviewDetail } from '@index/entity/ReviewDetail';
import { Notification } from '@index/entity/Notification';


async function createDatabaseIfNotExists() {
  // Step 1: Connect to MySQL without specifying a database
  const tempDataSource = new DataSource({
      type: config.DB.TYPE, // Type of the database
      host: config.DB.HOST, // Host of the database
      port: config.DB.PORT, // Port of the database
      username: config.DB.USER, // Username for the database
      password: config.DB.PASSWORD, // Password for the database
  });

  await tempDataSource.initialize();

  // Step 2: Create the database if it does not exist
  await tempDataSource.query(`CREATE DATABASE IF NOT EXISTS \`${config.DB.NAME}\``);
  await tempDataSource.destroy(); // Close the temporary connection
}


async function runSeed() {
 
    await createDatabaseIfNotExists();
    /*
        Init Datasource
    */
    const dataSource = new DataSource({
        type: config.DB.TYPE, // Type of the database
        host: config.DB.HOST, // Host of the database
        port: config.DB.PORT, // Port of the database
        username: config.DB.USER, // Username for the database
        password: config.DB.PASSWORD, // Password for the database
        database: config.DB.NAME, // Name of the database
        entities: [
          Location, 
          User, 
          UnitDynamicCentral,
          Supplier,
          SpecialtyBySupplier,
          Package,
          PreRegisterUser,
          CertificationsExperience,
          LanguageSupplier,
          Availability,
          Appointment,
          AppointmentCredit,
          Review,
          ReviewDetail,
          Notification
        ], // Array of entities to be used
        synchronize: true, // Synchronize the schema with the database
        charset: "utf8mb4",
        extra: {
            connectionLimit: 150, 
            charset: "utf8mb4", 
            collation: "utf8mb4_unicode_ci",
        },
    });
    

    await dataSource.initialize();




        //*************************************** */
        //              User
        //*************************************** */
        const userRepository = await dataSource.getRepository(User);
        const password = await hashPassword("Vitatest25*");
        
        // FINANCE ENTITIES
        const financeEntities = [
          {
            id: "8401b1be-7e1d-4357-a632-15172a647b8d",
            card_id: "5-6789-1234",
            id_type: { code: "JURIDICAL_DNI" },
            name: "Asociacion Vitalink",
            email: "asocitalink@gmail.com",
            user_name: "asovitalink",
            phone_number: "2200-1234",
            password,
            country_iso_code: "CRC",
            province: "San José",
            address: "Edificio Principal Vitalink",
            city_name: "San José",
            postal_code: "10102",
            role_code: "FINANCE_ENTITY",
             is_active_from_email: true,
             is_active_from_super_admin: true,
            account_status: "active" as "active",
          }
        ];
        
        await userRepository.upsert(financeEntities, ["email"]);
        
       






































//*************************************** */
//      Notifications
//*************************************** */
const notificationRepository = dataSource.getRepository(Notification);
const notifications = [
    {
        code: "appointmentStep1",
        type: "APPOINTMENT",
        subject: "Reservación de Cita de Valoración",
        message: "El paciente {{ patientName }} ha solicitado una cita de valoración del procedimiento {{ procedureName }} / producto {{ productName }}.",
        another_message: "El paciente {{ patientName }} ha solicitado una cita de valoración del procedimiento {{ procedureName }} / producto {{ productName }} del médico/centro médico {{ supplierName }}.",
        required_send_email: true,
        text_from_email_message_json: true,
        email_template: "appointmentStep1",
        action_url: "https://vitalink.cr/medicos/citas",
        action_text: "Mis Citas Vitalink",
        language: "es",
    },
    {
        code: "appointmentStep1.2",
        type: "APPOINTMENT",
        subject: "Cita reservada - Espera Confirmación",
        message: "La reserva de tu cita de valoración para el procedimiento {{ procedureName }} / producto {{ productName }} ha sido enviada al médico/centro médico {{ supplierName }}. Pronto tu médico te contactará.",
        another_message: "El médico/centro médico {{ supplierName }} se pondrá en contacto con el paciente o confirmará cita de valoración del procedimiento {{ procedureName }} / producto {{ productName }} para el dia {{ appointmentDate }} a la hora {{ appointmentHour }} en los próximos días.",
        required_send_email: true,
        text_from_email_message_json: true,
        email_template: "appointmentStep1.2",
        action_url: "https://vitalink.cr/pacientes/citas",
        action_text: "Mis Citas Vitalink",
        language: "es",
    },
    {
        code: "appointmentStep2",
        type: "APPOINTMENT",
        subject: "Confirmación de Cita de Valoración",
        message: "El médico/centro médico {{ supplierName }} ha confirmado tu cita de valoración del procedimiento {{ procedureName }} / producto {{ productName }} para el día {{ appointmentDate }} a la hora {{ appointmentHour }}. Recordá presentarte 20 minutos antes de la cita.\n\nRecordá presentarte a la cita con tu identificación de {{ financeEntityName }} para acceder al descuento exclusivo de Vitalink.\n\nDetalle de pago:\n- Costo cita de valoración: {{ priceValorationAppointment }}",
        another_message: "El médico/centro médico {{ supplierName }} ha confirmado la cita de valoración del procedimiento {{ procedureName }} / producto {{ productName }} del paciente {{ patientName }} para el dia {{ appointmentDate }} a la hora {{ appointmentHour }}.",
        required_send_email: true,
        text_from_email_message_json: true,
        email_template: "appointmentStep2",
        action_url: "https://vitalink.cr/pacientes/citas",
        action_text: "Mis Citas Vitalink",
        language: "es",
    },
    {
        code: "appointmentStep3",
        type: "APPOINTMENT",
        subject: "Verificar Pago Cita Valoración",
        message: "Se concretó la cita de valoración del procedimiento {{ procedureName }} / producto {{ productName }} del paciente {{ patientName }}. Favor verificar que se efectuó el pago de la cita.",
        another_message: "Se concretó la cita de valoración del procedimiento {{ procedureName }} / producto {{ productName }} del paciente {{ patientName }} por medio de {{ paymentMethod }}. Favor verificar que se efectuó el pago de la cita.",
        required_send_email: true,
        text_from_email_message_json: true,
        email_template: "appointmentStep3",
        action_url: "https://vitalink.cr/medicos/citas",
        action_text: "Mis Citas Vitalink",
        language: "es",
    },
    {
        code: "appointmentStep4Fit",
        type: "APPOINTMENT",
        subject: "Apto para Procedimiento",
        message: "El médico/centro médico {{ supplierName }} ha confirmado que sos apto para el procedimiento {{ procedureName }} / producto {{ productName }}, por un monto de {{ priceProcedure }}. Podés descargar tu proforma y solicitar tu crédito, o reservar tu procedimiento pagando con tus propios medios. Hacé clic en \"mis citas\" para continuar.",
        another_message: "El médico/centro médico {{ supplierName }} ha confirmado que el paciente {{ patientName }} es apto para el procedimiento {{ procedureName }} / producto {{ productName }}.",
        required_send_email: true,
        text_from_email_message_json: true,
        email_template: "appointmentStep4Fit",
        action_url: "https://vitalink.cr/pacientes/citas",
        action_text: "Mis Citas Vitalink",
        language: "es",
    },
    {
        code: "appointmentStep4FitNo",
        type: "APPOINTMENT",
        subject: "No se requiere procedimiento adicional",
        message: "De acuerdo a la valoración del médico/centro médico {{ supplierName }}, ha confirmado que no se requiere procedimiento adicional para {{ procedureName }} / producto {{ productName }}.",
        another_message: "El médico/centro médico {{ supplierName }} ha confirmado que el paciente {{ patientName }} no requiere procedimiento adicional para {{ procedureName }} / producto {{ productName }}.",
        required_send_email: true,
        text_from_email_message_json: true,
        email_template: "appointmentStep4FitNo",
        action_url: "https://vitalink.cr/pacientes/citas",
        action_text: "Mis Citas Vitalink",
        language: "es",
    },
    {
        code: "appointmentStep5",
        type: "APPOINTMENT",
        subject: "Reservación de Procedimiento Médico",
        message: "El paciente {{ patientName }} ha solicitado una reservación del procedimiento {{ procedureName }} / producto {{ productName }} del médico/centro médico {{ supplierName }}.",
        another_message: "El paciente {{ patientName }} ha solicitado una reservación del procedimiento {{ procedureName }} / producto {{ productName }} del médico/centro médico {{ supplierName }}.",
        required_send_email: true,
        text_from_email_message_json: true,
        email_template: "appointmentStep5",
        action_url: "https://vitalink.cr/medicos/citas",
        action_text: "Mis Citas Vitalink",
        language: "es",
    },
    {
        code: "appointmentStep6",
        type: "APPOINTMENT",
        subject: "Confirmación de Reservación de Procedimiento Médico",
        message: "El médico/centro médico {{ supplierName }} ha confirmado la reserva del procedimiento {{ procedureName }} / producto {{ productName }} para el día {{ appointmentDate }} a la hora {{ appointmentHour }}. Recordá presentarte 20 minutos antes de la cita.\n\nSi contás con un crédito aprobado, recordá presentar tu código en el consultorio antes del procedimiento para validarlo con el médico.\n\nDetalle de pago:\n- Costo del procedimiento: {{ priceProcedure }}\n- Descuento del procedimiento: {{ discountProcedure }}\n- Cubierto por crédito: {{ approvedAmountCredit }}\n- Total del procedimiento: {{ totalProcedure }}",
        another_message: "El médico/centro médico {{ supplierName }} ha confirmado la reserva del procedimiento {{ procedureName }} / producto {{ productName }} del paciente {{ patientName }} para el dia {{ appointmentDate }} a la hora {{ appointmentHour }}.",
        required_send_email: true,
        text_from_email_message_json: true,
        email_template: "appointmentStep6",
        action_url: "https://vitalink.cr/pacientes/citas",
        action_text: "Mis Citas Vitalink",
        language: "es",
    },
    {
        code: "appointmentStep7",
        type: "APPOINTMENT",
        subject: "Verificar Pago Procedimiento Médico",
        message: "Se concretó el procedimiento {{ procedureName }} / producto {{ productName }} del paciente {{ patientName }}. Favor verificar que se efectuó el pago de la cita.",
        another_message: "Se concretó el procedimiento {{ procedureName }} / producto {{ productName }} del paciente {{ patientName }} por medio de {{ paymentMethod }}. Favor verificar que se efectuó el pago de la cita.",
        required_send_email: true,
        text_from_email_message_json: true,
        email_template: "appointmentStep7",
        action_url: "https://vitalink.cr/medicos/citas",
        action_text: "Mis Citas Vitalink",
        language: "es",
    },
    {
        code: "appointmentStep8",
        type: "APPOINTMENT",
        subject: "Procedimiento Médico Realizado",
        message: "El médico/centro médico {{ supplierName }} ha confirmado la realización del procedimiento médico {{ procedureName }} / producto {{ productName }}.\n\nDetalle de pago:\n- Costo del procedimiento: {{ priceProcedure }}\n- Cubierto por crédito: {{ approvedAmountCredit }}\n- Descuento del procedimiento: {{ discountProcedure }}\n- Total del procedimiento: {{ totalProcedure }}",
        another_message: "El médico/centro médico {{ supplierName }} ha confirmado la realización del procedimiento médico {{ procedureName }} / producto {{ productName }} del paciente {{ patientName }}.",
        required_send_email: true,
        text_from_email_message_json: true,
        email_template: "appointmentStep8",
        action_url: "https://vitalink.cr/pacientes/citas",
        action_text: "Mis Citas Vitalink",
        language: "es",
    },
    {
        code: "appointmentCreditStep1",
        type: "APPOINTMENT",
        subject: "Solicitud de Crédito",
        message: "El paciente {{ patientName }} ha solicitado un crédito de {{ requestAmount }} para el procedimiento {{ procedureName }} / producto {{ productName }} del médico/centro médico {{ supplierName }}.",
        another_message: "El paciente {{ patientName }} ha solicitado un crédito de {{ requestAmount }} para el procedimiento {{ procedureName }} / producto {{ productName }} del médico/centro médico {{ supplierName }}.",
        required_send_email: true,
        text_from_email_message_json: true,
        email_template: "appointmentCreditStep1",
        action_url: "https://vitalink.cr",
        action_text: "Mis Citas Vitalink",
        language: "es",
    },
    {
        code: "appointmentCreditStep2",
        type: "APPOINTMENT",
        subject: "Crédito Aprobado",
        message: "La Asociación Solidarista {{ financeEntityName }} ha aprobado el crédito por un monto de {{ approvedAmountCredit }} para el procedimiento {{ procedureName }} / producto {{ productName }}. Por favor revisá el documento de pagaré.\n\nCódigo: {{ creditCode }}\n\nTotal a pagar restante: {{ totalProcedure }}",
        another_message: "La Asociación Solidarista {{ financeEntityName }} ha aprobado el crédito por un monto de {{ approvedAmountCredit }} para el procedimiento {{ procedureName }} / producto {{ productName }}.",
        required_send_email: true,
        text_from_email_message_json: true,
        email_template: "appointmentCreditStep2",
        action_url: "https://vitalink.cr/pacientes/citas",
        action_text: "Mis Citas Vitalink",
        language: "es",
    },
    {
        code: "appointmentCreditStep2No",
        type: "APPOINTMENT",
        subject: "Crédito Rechazado",
        message: "La Asociación Solidarista {{ financeEntityName }} ha rechazado el crédito para el procedimiento {{ procedureName }} / producto {{ productName }}. Hacé clic en \"mis citas\" para continuar.",
        another_message: "La Asociación Solidarista {{ financeEntityName }} ha rechazado el crédito para el procedimiento {{ procedureName }} / producto {{ productName }}.",
        required_send_email: true,
        text_from_email_message_json: true,
        email_template: "appointmentCreditStep2No",
        action_url: "https://vitalink.cr/pacientes/citas",
        action_text: "Mis Citas Vitalink",
        language: "es",
    },
    {
        code: "appointmentCreditStep4",
        type: "APPOINTMENT",
        subject: "Crédito Utilizado",
        message: "El médico/centro médico {{ supplierName }} ha marcado como utilizado el crédito del paciente {{ patientName }}.\n\nDetalle de pago:\n- Costo del procedimiento: {{ priceProcedure }}\n- Cubierto por crédito: {{ approvedAmountCredit }}\n- Descuento del procedimiento: {{ discountProcedure }}\n- Total a pagar: {{ totalProcedure }}",
        another_message: "El médico/centro médico {{ supplierName }} ha marcado como utilizado el crédito del paciente {{ patientName }} para el procedimiento {{ procedureName }} / producto {{ productName }}.",
        required_send_email: true,
        text_from_email_message_json: true,
        email_template: "appointmentCreditStep4",
        action_url: "https://vitalink.cr",
        action_text: "Mis Citas Vitalink",
        language: "es",
    }
    ];

await notificationRepository.upsert(notifications, ["code"]);


 if (dataSource.isInitialized) {
      await dataSource.destroy();
  }

console.log("Seeds STG done!");

}

runSeed().catch((error) => {
    console.error(error);
    process.exit(1);
});