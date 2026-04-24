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
    message: "El paciente {{ patientName }} ha solicitado una cita de valoración del procedimiento {{ procedureName }} para el dia {{ appointmentDate }} a la hora {{ appointmentHour }}.",
    another_message: "El paciente {{ patientName }} ha solicitado una cita de valoración del procedimiento {{ procedureName }} del médico/centro médico {{ supplierName }} para el dia {{ appointmentDate }} a la hora {{ appointmentHour }}",
    required_send_email: true,
    text_from_email_message_json: true,
    email_template: "genericTemplateButtonEmail",
    action_url: "https://vitalink.cr/medicos/citas",
    action_text: "Ir a Vitalink",
    language: "es",
    
  },
  {
    code: "appointmentStep1.2",
    type: "APPOINTMENT",
    subject: "Cita reservada - Espera Confirmación",
    message: "El médico/centro médico {{ supplierName }} se pondrá en contacto contigo o confirmará cita de valoración del procedimiento {{ procedureName }} / producto {{ productName }} para el día {{ appointmentDate }} a la hora {{ appointmentHour }} en los próximos días.",
    another_message: "El médico/centro médico {{ supplierName }} se pondrá en contacto contigo o confirmará cita de valoración del procedimiento {{ procedureName }} / producto {{ productName }} para el día {{ appointmentDate }} a la hora {{ appointmentHour }} en los próximos días.",
    required_send_email: true,
    text_from_email_message_json: true,
    email_template: "genericTemplateEmail",
    action_url: null,
    action_text: null,
    language: "es"
  },
  {
    code: "appointmentStep2",
    type: "APPOINTMENT",
    subject: "Confirmación de Cita Valoración",
    message: "El médico/centro médico {{ supplierName }} ha confirmado la cita de valoración del procedimiento {{ procedureName }} para el dia {{ appointmentDate }} a la hora {{ appointmentHour }}. Recuerda presentarse 20 minutos antes de la cita.",
    another_message: "El médico/centro médico {{ supplierName }} ha confirmado la cita de valoración del procedimiento {{ procedureName }} del paciente {{ patientName }} para el dia {{ appointmentDate }} a la hora {{ appointmentHour }}",
    required_send_email: true,
    text_from_email_message_json: true,
    email_template: "genericTemplateButtonEmail",
    action_url: "https://vitalink.cr/pacientes/citas",
    action_text: "Ir a Vitalink",
    language: "es",
    
  },
  {
    code: "appointmentStep3",
    type: "APPOINTMENT",
    subject: "Pago de Cita Valoración",
    message: "Se realizó el pago de la cita de valoración del procedimiento {{ procedureName }}",
    another_message: "Se realizó el pago de la cita de valoración del procedimiento {{ procedureName }} por medio de {{ paymentMethod }}",
    required_send_email: true,
    text_from_email_message_json: true,
    email_template: "genericTemplateButtonEmail",
    action_url: "https://vitalink.cr/medicos/citas",
    action_text: "Ir a Vitalink",
    language: "es",
    
  },
  {
    code: "appointmentStep4Fit",
    type: "APPOINTMENT",
    subject: "Apto para Procedimiento",
    message: "El médico/centro médico {{ supplierName }} a confirmado que eres apto para el procedimiento {{ procedureName }}",
    another_message: "El médico/centro médico {{ supplierName }} a confirmado que el paciente {{ patientName }} es apto el procedimiento {{ procedureName }}",
    required_send_email: true,
    text_from_email_message_json: true,
    email_template: "genericTemplateButtonEmail",
    action_url: "https://vitalink.cr/pacientes/citas",
    action_text: "Ir a Vitalink",
    language: "es",
    
  },
  {
    code: "appointmentStep4FitNo",
    type: "APPOINTMENT",
    subject: "No Apto para Procedimiento",
    message: "De acuerdo a la valoración del médico/centro médico {{ supplierName }} a confirmado que NO eres apto para el procedimiento {{ procedureName }}",
    another_message: "El médico/centro médico {{ supplierName }} a confirmado que el paciente {{ patientName }} NO es apto el procedimiento {{ procedureName }}",
    required_send_email: true,
    text_from_email_message_json: true,
    email_template: "genericTemplateEmail",
    action_url: "https://vitalink.cr/pacientes/citas",
    action_text: "Ir a Vitalink",
    language: "es",
    
  },
  {
    code: "appointmentStep5",
    type: "APPOINTMENT",
    subject: "Reservación de Procedimiento Médico",
    message: "El paciente {{ patientName }} ha solicitado una reservación del procedimiento {{ procedureName }}",
    another_message: "El paciente {{ patientName }} ha solicitado una reservacion del procedimiento {{ procedureName }} del médico/centro médico {{ supplierName }}",
    required_send_email: true,
    text_from_email_message_json: true,
    email_template: "genericTemplateButtonEmail",
    action_url: "https://vitalink.cr/medicos/citas",
    action_text: "Ir a Vitalink",
    language: "es",
    
  },
  {
    code: "appointmentStep6",
    type: "APPOINTMENT",
    subject: "Confirmación de Reservación de Procedimiento Médico",
    message: "El médico/centro médico {{ supplierName }} ha confirmado la reserva del procedimiento {{ procedureName }} para el dia {{ appointmentDate }} a la hora {{ appointmentHour }}. Recuerda presentarse 20 minutos antes de la cita.",
    another_message: "El médico/centro médico {{ supplierName }} ha confirmado la reserva del procedimiento {{ procedureName }} del paciente {{ patientName }} para el dia {{ appointmentDate }} a la hora {{ appointmentHour }}",
    required_send_email: true,
    text_from_email_message_json: true,
    email_template: "genericTemplateButtonEmail",
    action_url: "https://vitalink.cr/pacientes/citas",
    action_text: "Ir a Vitalink",
    language: "es",
    
  },
  {
    code: "appointmentStep7",
    type: "APPOINTMENT",
    subject: "Pago de Procedimiento Médico",
    message: "Se realizó el pago del procedimiento medico {{ procedureName }}",
    another_message: "Se realizó el pago del procedimiento medico {{ procedureName }} por medio de {{ paymentMethod }}",
    required_send_email: true,
    text_from_email_message_json: true,
    email_template: "genericTemplateButtonEmail",
    action_url: "https://vitalink.cr/medicos/citas",
    action_text: "Ir a Vitalink",
    language: "es",
    
  },
  {
    code: "appointmentStep8",
    type: "APPOINTMENT",
    subject: "Procedimiento Médico Realizado",
    message: "El médico/centro médico {{ supplierName }} ha confirmado la realizacion del procedimiento medico {{ procedureName }}.",
    another_message: "El médico/centro médico {{ supplierName }} ha confirmado la realizacion del procedimiento medico {{ procedureName }} del paciente {{ patientName }}.",
    required_send_email: true,
    text_from_email_message_json: true,
    email_template: "genericTemplateButtonEmail",
    action_url: "https://vitalink.cr/pacientes/citas",
    action_text: "Ir a Vitalink",
    language: "es",
    
  },
  {
    code: "appointmentCreditStep1",
    type: "APPOINTMENT",
    subject: "Solicitud de credito",
    message: "El paciente {{ patientName }} ha solicitado un credito de {{ approvedAmountCredit }} para el procedimiento {{ procedureName }} del médico/centro médico {{ supplierName }}",
    another_message: "El paciente {{ patientName }} ha solicitado un credito de {{ approvedAmountCredit }} para el procedimiento {{ procedureName }} del médico/centro médico {{ supplierName }}",
    required_send_email: true,
    text_from_email_message_json: true,
    email_template: "genericTemplateButtonEmail",
    action_url: "https://vitalink.cr/socio-financiero/inicio",
    action_text: "Ir a Vitalink",
    language: "es",
    
  },
  {
    code: "appointmentCreditStep2",
    type: "APPOINTMENT",
    subject: "Credito Aprobado",
    message: "La Asociacion Solidarista {{ financeEntityName }} ha aprobado el credito por un monto de {{ approvedAmountCredit }} para el procedimiento {{ procedureName }}. Por favor revisa el documento de pagare.",
    another_message: "La Asociacion Solidarista {{ financeEntityName }} ha aprobado el credito por un monto de {{ approvedAmountCredit }} para el procedimiento {{ procedureName }}",
    required_send_email: true,
    text_from_email_message_json: true,
    email_template: "genericTemplateButtonEmail",
    action_url: "https://vitalink.cr/pacientes/citas",
    action_text: "Ir a Vitalink",
    language: "es",
    
  },
  {
    code: "appointmentCreditStep2No",
    type: "APPOINTMENT",
    subject: "Credito Rechazado",
    message: "La Asociacion Solidarista {{ financeEntityName }} ha rechazado el credito para el procedimiento {{ procedureName }}",
    another_message: "La Asociacion Solidarista {{ financeEntityName }} ha rechazado el credito para el procedimiento {{ procedureName }}",
    required_send_email: true,
    text_from_email_message_json: true,
    email_template: "genericTemplateButtonEmail",
    action_url: "https://vitalink.cr/pacientes/citas",
    action_text: "Ir a Vitalink",
    language: "es"
  },
  {
    code: "appointmentCreditStep4",
    type: "APPOINTMENT",
    subject: "Credito Utilizado",
    message: "El médico/centro médico {{ supplierName }} ha marcado el credito del paciente {{ patientName }} para el procedimiento {{ procedureName }} como utilizado. Por favor confirmar con Vitalink.",
    another_message: "El médico/centro médico {{ supplierName }} ha marcado el credito del paciente {{ patientName }} para el procedimiento {{ procedureName }} como utilizado.",
    required_send_email: true,
    text_from_email_message_json: true,
    email_template: "genericTemplateEmail",
    action_url: "https://vitalink.cr/socio-financiero/inicio",
    action_text: "Ir a Vitalink",
    language: "es"
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