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
import { Supplier } from '@index/entity/Supplier';
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










        /*************************************** 
        //              Locations
        ***************************************/
        const locationRepository = await dataSource.getRepository(Location);
        const locations = [
          {
            id: 1,
            name: "Hospital Clínica Bíblica - Sede Central",
            country_iso_code: "CRC",
            province: "San José",
            address: "Avenida 14, calle central y primera, San José",
            city_name: "San José",
            postal_code: "10103",
            latitude: 9.9265555,
            longitude: -84.0890355,
          },
          {
            id: 2,
            name: "Hospital Clínica Bíblica - Santa Ana",
            country_iso_code: "CRC",
            province: "San José",
            address: "Centro Comercial City Place, Santa Ana",
            city_name: "Santa Ana",
            postal_code: null,
            latitude: 9.936,
            longitude: -84.184,
          },
          {
            id: 3,
            name: "Hospital Metropolitano - Sede Central",
            country_iso_code: "CRC",
            province: "San José",
            address: "300 m sur del costado oeste del Parque La Merced, Calle 14, Avenida 8",
            city_name: "San José",
            postal_code: null,
            latitude: 9.9333,
            longitude: -84.0833,
          },
          {
            id: 4,
            name: "Hospital Metropolitano - Lincoln Plaza",
            country_iso_code: "CRC",
            province: "San José",
            address: "Mall Lincoln Plaza, antiguo Colegio Lincoln, Nivel N4, Moravia",
            city_name: "Moravia",
            postal_code: null,
            latitude: 9.9612,
            longitude: -84.0488,
          },
          {
            id: 5,
            name: "Hospital Metropolitano - Quepos",
            country_iso_code: "CRC",
            province: "Puntarenas",
            address: "Marina Pez Vela, Local #206, Quepos",
            city_name: "Quepos",
            postal_code: null,
            latitude: 9.4316,
            longitude: -84.1618,
          },
          {
            id: 6,
            name: "Hospital Metropolitano - Huacas",
            country_iso_code: "CRC",
            province: "Guanacaste",
            address: "Cabo Velas, contiguo a la estación de bomberos, Huacas",
            city_name: "Huacas",
            postal_code: null,
            latitude: 10.3575,
            longitude: -85.7967,
          },
          {
            id: 7,
            name: "Hospital Metropolitano - Lindora",
            country_iso_code: "CRC",
            province: "San José",
            address: "300 m norte de la Iglesia de Pozos, Santa Ana",
            city_name: "Santa Ana",
            postal_code: null,
            latitude: 9.9486,
            longitude: -84.1839,
          },
          {
            id: 8,
            name: "Hospital Metropolitano - Liberia",
            country_iso_code: "CRC",
            province: "Guanacaste",
            address: "Frente al Estadio Edgardo Baltodano, Liberia",
            city_name: "Liberia",
            postal_code: null,
            latitude: 10.6333,
            longitude: -85.4333,
          },
          {
            id: 9,
            name: "Hospital CIMA San José",
            country_iso_code: "CRC",
            province: "San José",
            address: "Contiguo a Multiplaza Escazú, San Rafael de Escazú",
            city_name: "Escazú",
            postal_code: null,
            latitude: 9.9387,
            longitude: -84.1407,
          },
          {
            id: 10,
            name: "Hospital Clínica Católica",
            country_iso_code: "CRC",
            province: "San José",
            address: "Guadalupe, frente a la iglesia Católica",
            city_name: "Guadalupe",
            postal_code: null,
            latitude: 9.9489,
            longitude: -84.0595,
          },
          {
            id: 11,
            name: "Hospital UNIBE",
            country_iso_code: "CRC",
            province: "San José",
            address: "Del Liceo de Costa Rica, 100 m este y 100 m norte, Barrio Aranjuez",
            city_name: "San José",
            postal_code: null,
            latitude: 9.936,
            longitude: -84.0739,
          },
          {
            id: 12,
            name: "Clínica Hospital Santa Catalina",
            country_iso_code: "CRC",
            province: "San José",
            address: "Del Parque Central de Desamparados, 200 m norte y 25 m este",
            city_name: "Desamparados",
            postal_code: null,
            latitude: 9.8947,
            longitude: -84.0685,
          },
          {
            id: 13,
            name: "Clínica Zahha",
            country_iso_code: "CRC",
            province: "San José",
            address: "Centro Comercial Momentum Pinares, Curridabat",
            city_name: "Curridabat",
            postal_code: null,
            latitude: 9.9156,
            longitude: -84.0306,
          },
          {
            id: 14,
            name: "Hospital Cristiano Jerusalem",
            country_iso_code: "CRC",
            province: "San José",
            address: "Guadalupe, de la iglesia Católica, 400 m este",
            city_name: "Guadalupe",
            postal_code: null,
            latitude: 9.9489,
            longitude: -84.0555,
          },
          {
            id: 15,
            name: "Clínicas Sin Fronteras",
            country_iso_code: "CRC",
            province: "San José",
            address: "Avenida 8, calle 3 y 5, San José",
            city_name: "San José",
            postal_code: null,
            latitude: 9.9333,
            longitude: -84.0833,
          },
          {
            id: 16,
            name: "Clínica de la Vista",
            country_iso_code: "CRC",
            province: "Alajuela",
            address: "Consultorios Plaza Real, Alajuela",
            city_name: "Alajuela",
            postal_code: null,
            latitude: 9.9333,
            longitude: -84.0833,
          },
          {
            id: 17,
            name: "Hospital Internacional La Católica",
            country_iso_code: "CRC",
            province: "San José",
            address: "San Antonio de Guadalupe, Goicoechea, frente a los Tribunales de Justicia; Hospital La Católica Edificio Principal. Piso 4. Consultorio 414.",
            city_name: "San José",
            postal_code: null,
            latitude: 9.9333,
            longitude: -84.0833,
          },
        ];
        
        await locationRepository.upsert(locations, ["name"]);
        









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
            name: "Banco Financiero Costa Rica",
            email: "vitalinkcr2+bancofinanciero@gmail.com",
            user_name: "bancofinanciero",
            phone_number: "2200-1234",
            password,
            country_iso_code: "CRC",
            province: "San José",
            address: "Edificio Principal BCR",
            city_name: "San José",
            postal_code: "10102",
            role_code: "FINANCE_ENTITY",
             is_active_from_email: true,
            account_status: "active" as "active",
          },
          {
            id: "c0ecccb1-6c2f-407f-b39f-6f5c2af11640",
            card_id: "6-9876-5432",
            id_type: { code: "JURIDICAL_DNI" },
            name: "Cooperativa de Ahorro",
            email: "vitalinkcr2+coopahorro@gmail.com",
            user_name: "coopahorro",
            phone_number: "2299-5432",
            password,
            country_iso_code: "CRC",
            province: "Cartago",
            address: "Torre Financiera",
            city_name: "Cartago",
            postal_code: "30102",
            role_code: "FINANCE_ENTITY",
             is_active_from_email: true,
            account_status: "active" as "active",
          }
        ];
        
        await userRepository.upsert(financeEntities, ["email"]);
        
        // LEGAL REPRESENTATIVES
        const legalRepresentatives = [
          {
            id: "d0b47084-2888-4e7e-9347-0aa62fb6aa8f",
            card_id: "1-1234-5678",
            id_type: { code: "PHYSICAL_DNI" },
            name: "Gabriela Ulate",
            email: "vitalinkcr2+gulate@gmail.com",
            user_name: "gulate",
            phone_number: "8888-5678",
            password,
            country_iso_code: "CRC",
            province: "Alajuela",
            address: "Oficinas Legales Central",
            city_name: "Alajuela",
            postal_code: "20101",
            role_code: "LEGAL_REPRESENTATIVE",
             is_active_from_email: true,
            account_status: "active" as "active",
          },
          {
            id: "9c7dac5a-bb08-4956-915b-3edcda695f44",
            card_id: "2-8765-4321",
            id_type: { code: "PHYSICAL_DNI" },
            name: "Carlos Mendoza",
            email: "vitalinkcr2+cmendoza@gmail.com",
            user_name: "cmendoza",
            phone_number: "8877-4321",
            password,
            country_iso_code: "CRC",
            province: "Heredia",
            address: "Centro Empresarial Heredia",
            city_name: "Heredia",
            postal_code: "40101",
            role_code: "LEGAL_REPRESENTATIVE",
             is_active_from_email: true,
            account_status: "active" as "active",
          },
          {
            id: "a1192e7e-7d99-4938-a98a-c0438fd8e4e8",
            card_id: "3-5678-9876",
            id_type: { code: "JURIDICAL_DNI" },
            name: "Hospital Clínica Santa Fe",
            email: "vitalinkcr2+clinicasantafe@gmail.com",
            user_name: "clinicasantafe",
            phone_number: "2222-5678",
            password,
            country_iso_code: "CRC",
            province: "San José",
            address: "Av. Central, San José",
            city_name: "San José",
            postal_code: "10104",
            role_code: "LEGAL_REPRESENTATIVE",
             is_active_from_email: true,
            account_status: "active" as "active",
          },
          {
            id: "6efb1276-5db2-4752-991a-31a32b31d95a",
            card_id: "4-6543-2109",
            id_type: { code: "JURIDICAL_DNI" },
            name: "Centro Médico del Pacífico",
            email: "vitalinkcr2+medicopacifico@gmail.com",
            user_name: "medicopacifico",
            phone_number: "2266-2109",
            password,
            country_iso_code: "CRC",
            province: "Puntarenas",
            address: "Centro de Puntarenas",
            city_name: "Puntarenas",
            postal_code: "60101",
            role_code: "LEGAL_REPRESENTATIVE",
             is_active_from_email: true,
            account_status: "active" as "active",
          },
          {
            id: "892dfdc0-3fc3-4910-a9ad-e052f320e7a6",
            card_id: "00000000",
            id_type: { code: "JURIDICAL_DNI" },
            name: "Vitalink Medica",
            email: "vitalinkcr2+vitalinkmedica@gmail.com",
            user_name: "cbiblica",
            phone_number: "2266-2109",
            password,
            country_iso_code: "CRC",
            province: "San José",
            address: "Centro Medico Central",
            city_name: "Curridabat",
            postal_code: "60101",
            role_code: "LEGAL_REPRESENTATIVE",
             is_active_from_email: true,
            account_status: "active" as "active",
          }
        ];
        
        await userRepository.upsert(legalRepresentatives, ["email"]);
        
        // CUSTOMERS
        const customers = [
          {
            id: "f1635823-7d9a-4df9-bd1e-ad8bd985de0b",
            card_id: "5-2345-6789",
            id_type: { code: "PHYSICAL_DNI" },
            name: "Luis Fernández",
            email: "vitalinkcr2+lfernandez@gmail.com",
            user_name: "lfernandez",
            phone_number: "8822-6789",
            password,
            country_iso_code: "CRC",
            province: "Cartago",
            address: "Barrio Oriental",
            city_name: "Cartago",
            postal_code: "30101",
            role_code: "CUSTOMER",
            finance_entity: { id: financeEntities[0].id },
             is_active_from_email: true,
            account_status: "active" as "active",
          },
          {
            id: "728237d9-c16d-4ca8-bbbe-240a697fb3c3",
            card_id: "6-5432-1987",
            id_type: { code: "PHYSICAL_DNI" },
            name: "María Jiménez",
            email: "vitalinkcr2+mjimenez@gmail.com",
            user_name: "mjimenez",
            phone_number: "8899-1987",
            password,
            country_iso_code: "CRC",
            province: "Guanacaste",
            address: "Residencial Monte Verde",
            city_name: "Liberia",
            postal_code: "50101",
            role_code: "CUSTOMER",
            finance_entity: { id: financeEntities[1].id },
             is_active_from_email: true,
            account_status: "active" as "active",
          },
          {
            id: "a1ea46aa-0dce-4c15-bea5-26ef6c83d27b",
            card_id: "7-4567-8901",
            id_type: { code: "PHYSICAL_DNI" },
            name: "Daniela Solano",
            email: "vitalinkcr2+dsolano@gmail.com",
            user_name: "dsolano",
            phone_number: "8855-8901",
            password,
            country_iso_code: "CRC",
            province: "Puntarenas",
            address: "Playa Hermosa",
            city_name: "Puntarenas",
            postal_code: "60102",
            role_code: "CUSTOMER",
            finance_entity: { id: financeEntities[0].id },
             is_active_from_email: true,
            account_status: "active" as "active",
          },
          {
            id: "fd77bb90-9ac5-411e-9924-86cf4f529a5e",
            card_id: "8-6789-4321",
            id_type: { code: "PHYSICAL_DNI" },
            name: "José Marín",
            email: "vitalinkcr2+jmarin@gmail.com",
            user_name: "jmarin",
            phone_number: "8833-4321",
            password,
            country_iso_code: "CRC",
            province: "Heredia",
            address: "Centro de la Ciudad",
            city_name: "Heredia",
            postal_code: "40103",
            role_code: "CUSTOMER",
            finance_entity: { id: financeEntities[1].id },
            is_active_from_email: true,
            account_status: "active" as "active",
          }
        ];
        
        await userRepository.upsert(customers, ["email"]);
        









//*************************************** */
//              Suppliers
//*************************************** */
const supplierRepository = dataSource.getRepository(Supplier);


const suppliers_part1 = [
{ id: 1, id_type: { code: "PHYSICAL_DNI" }, card_id: "1-9876-5432", num_medical_enrollment: "CR-2023456", name: "Alejandro Vargas", phone_number: "8812-3456", email: "avargas@example.com", country_iso_code: "CRC", province: "San José", city_name: "San José", postal_code: "10104", profile_picture_url: "https://vitalink-v2-s3.s3.us-east-2.amazonaws.com/PublicFiles/Dr+1.png", description: "Especialista en cirugía cardiovascular con más de 15 años de experiencia.", address: "Clínica Santa Fe, San José", latitude: 9.9333, longitude: -84.0833, experience_years: 15, patients_number: 2500, is_hospital: false, our_history: null, mission: null, vision: null, code_card_id_file: null, code_medical_license_file: null, medical_type: { code: "SPECIALTY_MEDICAL" }, legal_representative: { id: legalRepresentatives[0].id } }, // 1 (Doctor - Dr+1.png)
{ id: 2, id_type: { code: "PHYSICAL_DNI" }, card_id: "2-6543-2109", num_medical_enrollment: "CR-2019876", name: "Sofía Araya", phone_number: "8844-2109", email: "saraya@example.com", country_iso_code: "CRC", province: "Heredia", city_name: "Heredia", postal_code: "40101", profile_picture_url: "https://vitalink-v2-s3.s3.us-east-2.amazonaws.com/PublicFiles/Dra+1.png", description: "Dermatóloga certificada, especializada en tratamientos de piel y estética.", address: "Centro Médico del Pacífico, Puntarenas", latitude: 9.9796, longitude: -84.1005, experience_years: 12, patients_number: 1800, is_hospital: false, our_history: null, mission: null, vision: null, code_card_id_file: null, code_medical_license_file: null, medical_type: { code: "SPECIALTY_MEDICAL" }, legal_representative: { id: legalRepresentatives[0].id } }, // 2 (Doctora - Dra+1.jpg)
{ id: 3, id_type: { code: "PHYSICAL_DNI" }, card_id: "3-5432-1098", num_medical_enrollment: "CR-2005678", name: "Fernando López", phone_number: "8877-1098", email: "flopez@example.com", country_iso_code: "CRC", province: "Cartago", city_name: "Cartago", postal_code: "30102", profile_picture_url: "https://vitalink-v2-s3.s3.us-east-2.amazonaws.com/PublicFiles/Dr+2.png", description: "Médico general con amplia experiencia en atención primaria y urgencias.", address: "Clínica Zahha, Curridabat", latitude: 9.9156, longitude: -84.0306, experience_years: 10, patients_number: 3200, is_hospital: false, our_history: null, mission: null, vision: null, code_card_id_file: null, code_medical_license_file: null, medical_type: { code: "GENERAL_MEDICAL" }, legal_representative: { id: legalRepresentatives[1].id } }, // 3 (Doctor - Dr+2.png)
{ id: 4, id_type: { code: "JURIDICAL_DNI" }, card_id: "J-123456-001", num_medical_enrollment: null, name: "Hospital Clínica Santa Fe - Sede Central", phone_number: "2222-5678", email: "contacto@clinicasantafe.com", country_iso_code: "CRC", province: "San José", city_name: "San José", postal_code: "10104", profile_picture_url: "https://vitalink-v2-s3.s3.us-east-2.amazonaws.com/PublicFiles/hospital.png", description: "Uno de los hospitales más prestigiosos del país, ofreciendo atención integral.", address: "Av. Central, San José", latitude: 9.9333, longitude: -84.0833, experience_years: null, patients_number: null, is_hospital: true, our_history: "Fundado en 1985, nuestro hospital ha brindado atención médica de calidad.", mission: "Brindar salud con excelencia.", vision: "Ser el hospital líder en Latinoamérica.", code_card_id_file: null, code_medical_license_file: null, medical_type: null, legal_representative: { id: legalRepresentatives[2].id } }, // 4 (Hospital - hospital.png)
{ id: 5, id_type: { code: "JURIDICAL_DNI" }, card_id: "J-654321-002", num_medical_enrollment: null, name: "Centro Médico del Pacífico - Sede Central", phone_number: "2266-2109", email: "contacto@medicopacifico.com", country_iso_code: "CRC", province: "Puntarenas", city_name: "Puntarenas", postal_code: "60101", profile_picture_url: "https://vitalink-v2-s3.s3.us-east-2.amazonaws.com/PublicFiles/hospital.png", description: "Centro médico de referencia en la región del Pacífico.", address: "Centro de Puntarenas", latitude: 9.9796, longitude: -84.1005, experience_years: null, patients_number: null, is_hospital: true, our_history: "Desde 1990, hemos atendido miles de pacientes con calidad y calidez.", mission: "Ofrecer salud con innovación.", vision: "Expandir nuestros servicios en todo Costa Rica.", code_card_id_file: null, code_medical_license_file: null, medical_type: null, legal_representative: { id: legalRepresentatives[2].id } }, // 5 (Hospital - hospital.png)
{ id: 6, id_type: { code: "JURIDICAL_DNI" }, card_id: "000000000", num_medical_enrollment: null, name: "Oftalmóloga 1 ", phone_number: "2266-2109", email: "contacto@clinicabiblica.com", country_iso_code: "CRC", province: "San José", city_name: "San José", postal_code: "60101", profile_picture_url: "https://vitalink-v2-s3.s3.us-east-2.amazonaws.com/PublicFiles/hospital.png", description: null, address: null, latitude: 9.9796, longitude: -84.1005, experience_years: null, patients_number: null, is_hospital: true, our_history: "Desde 1990, hemos atendido miles de pacientes con calidad y calidez.", mission: "Ofrecer salud con innovación.", vision: "Expandir nuestros servicios en todo Costa Rica.", code_card_id_file: null, code_medical_license_file: null, medical_type: null, legal_representative: { id: legalRepresentatives[4].id } }, // 6 (Hospital - hospital.png)
{ id: 7, id_type: { code: "PHYSICAL_DNI" }, card_id: "7-7001-0007", num_medical_enrollment: "CR-2007007", name: "Andrés Ramírez", phone_number: "+506 2246 3537 /+506 2246 3269 /+506 8827 7491", email: "dr.aramirez-cardiologo@gmail.com", country_iso_code: "CRC", province: "San José", city_name: "San José", postal_code: "10101", profile_picture_url: "https://vitalink-v2-s3.s3.us-east-2.amazonaws.com/PublicFiles/Andres+Ramirez.png", description: "Cardiología Intervencionista y Hemodinamia. Enfoque: Adultos, Adultos mayores.", address: "Hospital Internacional La Católica, CENTRO CARDIOVASCULAR ARM", latitude: 9.9333, longitude: -84.0833, experience_years: 11, patients_number: 1450, is_hospital: false, our_history: null, mission: null, vision: null, code_card_id_file: null, code_medical_license_file: null, medical_type: { code: "SPECIALTY_MEDICAL" }, legal_representative: { id: legalRepresentatives[0].id } }, // 7 (Doctor - Andres+Ramirez.png)
{ id: 8, id_type: { code: "PHYSICAL_DNI" }, card_id: "8-8002-0008", num_medical_enrollment: "CR-2008008", name: "Valeria Rojas", phone_number: "8808-0008", email: "vitalinkcr2+supplier008@gmail.com", country_iso_code: "CRC", province: "Heredia", city_name: "Heredia", postal_code: "40101", profile_picture_url: "https://vitalink-v2-s3.s3.us-east-2.amazonaws.com/PublicFiles/Dra+2.png", description: "Doctora especialista, enfoque en diagnóstico y seguimiento de pacientes.", address: "Torre Médica, Heredia", latitude: 9.9987, longitude: -84.1198, experience_years: 9, patients_number: 980, is_hospital: false, our_history: null, mission: null, vision: null, code_card_id_file: null, code_medical_license_file: null, medical_type: { code: "SPECIALTY_MEDICAL" }, legal_representative: { id: legalRepresentatives[1].id } }, // 8 (Doctora - Dra+2.jpg)
{ id: 9, id_type: { code: "PHYSICAL_DNI" }, card_id: "9-9003-0009", num_medical_enrollment: "CR-2009009", name: "Diego Herrera", phone_number: "8809-0009", email: "vitalinkcr2+supplier009@gmail.com", country_iso_code: "CRC", province: "Cartago", city_name: "Cartago", postal_code: "30101", profile_picture_url: "https://vitalink-v2-s3.s3.us-east-2.amazonaws.com/PublicFiles/Dr+3.png", description: "Médico general con experiencia en atención primaria y continuidad de cuidado.", address: "Clínica Oriente, Cartago", latitude: 9.8644, longitude: -83.9194, experience_years: 7, patients_number: 1650, is_hospital: false, our_history: null, mission: null, vision: null, code_card_id_file: null, code_medical_license_file: null, medical_type: { code: "GENERAL_MEDICAL" }, legal_representative: { id: legalRepresentatives[2].id } }, // 9 (Doctor - Dr+3.png)
{ id: 10, id_type: { code: "PHYSICAL_DNI" }, card_id: "10-1004-0010", num_medical_enrollment: "CR-2010010", name: "Carolina Navarro", phone_number: "8810-0010", email: "vitalinkcr2+supplier010@gmail.com", country_iso_code: "CRC", province: "Alajuela", city_name: "Alajuela", postal_code: "20101", profile_picture_url: "https://vitalink-v2-s3.s3.us-east-2.amazonaws.com/PublicFiles/Dra+3.jpg", description: "Especialista con enfoque en valoración y planificación de tratamiento.", address: "Consultorios del Norte, Alajuela", latitude: 10.0163, longitude: -84.2116, experience_years: 13, patients_number: 2100, is_hospital: false, our_history: null, mission: null, vision: null, code_card_id_file: null, code_medical_license_file: null, medical_type: { code: "SPECIALTY_MEDICAL" }, legal_representative: { id: legalRepresentatives[3].id } }, // 10 (Doctora - Dra+3.jpg)
{ id: 11, id_type: { code: "PHYSICAL_DNI" }, card_id: "11-1105-0011", num_medical_enrollment: "CR-2011011", name: "Pablo Sánchez", phone_number: "8811-0011", email: "vitalinkcr2+supplier011@gmail.com", country_iso_code: "CRC", province: "Puntarenas", city_name: "Puntarenas", postal_code: "60101", profile_picture_url: "https://vitalink-v2-s3.s3.us-east-2.amazonaws.com/PublicFiles/Dr+4.png", description: "Especialista con experiencia en procedimientos y control post-tratamiento.", address: "Centro Médico Costero, Puntarenas", latitude: 9.9763, longitude: -84.8384, experience_years: 10, patients_number: 1320, is_hospital: false, our_history: null, mission: null, vision: null, code_card_id_file: null, code_medical_license_file: null, medical_type: { code: "SPECIALTY_MEDICAL" }, legal_representative: { id: legalRepresentatives[4].id } }, // 11 (Doctor - Dr+4.png)
{ id: 12, id_type: { code: "PHYSICAL_DNI" }, card_id: "12-1206-0012", num_medical_enrollment: "CR-2012012", name: "Natalia Cordero", phone_number: "8812-0012", email: "vitalinkcr2+supplier012@gmail.com", country_iso_code: "CRC", province: "San José", city_name: "Escazú", postal_code: "10201", profile_picture_url: "https://vitalink-v2-s3.s3.us-east-2.amazonaws.com/PublicFiles/Dra+4.png", description: "Médica general con enfoque en seguimiento clínico y prevención.", address: "Consultorios Escazú, San José", latitude: 9.9186, longitude: -84.1372, experience_years: 6, patients_number: 740, is_hospital: false, our_history: null, mission: null, vision: null, code_card_id_file: null, code_medical_license_file: null, medical_type: { code: "GENERAL_MEDICAL" }, legal_representative: { id: legalRepresentatives[0].id } }, // 12 (Doctora - Dra+4.jpg)
{ id: 13, id_type: { code: "PHYSICAL_DNI" }, card_id: "13-1307-0013", num_medical_enrollment: "CR-2013013", name: "Javier Alvarado", phone_number: "8813-0013", email: "vitalinkcr2+supplier013@gmail.com", country_iso_code: "CRC", province: "Heredia", city_name: "Heredia", postal_code: "40101", profile_picture_url: "https://vitalink-v2-s3.s3.us-east-2.amazonaws.com/PublicFiles/Dr+5.png", description: "Especialista con alta orientación a calidad de atención y seguimiento.", address: "Clínica Empresarial, Heredia", latitude: 9.9987, longitude: -84.1198, experience_years: 14, patients_number: 2600, is_hospital: false, our_history: null, mission: null, vision: null, code_card_id_file: null, code_medical_license_file: null, medical_type: { code: "SPECIALTY_MEDICAL" }, legal_representative: { id: legalRepresentatives[1].id } }, // 13 (Doctor - Dr+5.png)
{ id: 14, id_type: { code: "PHYSICAL_DNI" }, card_id: "14-1408-0014", num_medical_enrollment: "CR-2014014", name: "Andrea Vega", phone_number: "8814-0014", email: "vitalinkcr2+supplier014@gmail.com", country_iso_code: "CRC", province: "Cartago", city_name: "Cartago", postal_code: "30101", profile_picture_url: "https://vitalink-v2-s3.s3.us-east-2.amazonaws.com/PublicFiles/Dra+5.jpg", description: "Doctora especialista con enfoque en evaluación y procedimientos ambulatorios.", address: "Centro Médico Cartago, Cartago", latitude: 9.8644, longitude: -83.9194, experience_years: 8, patients_number: 1180, is_hospital: false, our_history: null, mission: null, vision: null, code_card_id_file: null, code_medical_license_file: null, medical_type: { code: "SPECIALTY_MEDICAL" }, legal_representative: { id: legalRepresentatives[2].id } }, // 14 (Doctora - Dra+5.jpg)
{ id: 15, id_type: { code: "PHYSICAL_DNI" }, card_id: "15-1509-0015", num_medical_enrollment: "CR-2015015", name: "Ricardo Mora", phone_number: "8815-0015", email: "vitalinkcr2+supplier015@gmail.com", country_iso_code: "CRC", province: "Alajuela", city_name: "Alajuela", postal_code: "20101", profile_picture_url: "https://vitalink-v2-s3.s3.us-east-2.amazonaws.com/PublicFiles/Dr+6.png", description: "Médico general con experiencia en atención integral y seguimiento.", address: "Clínica Central, Alajuela", latitude: 10.0163, longitude: -84.2116, experience_years: 12, patients_number: 1900, is_hospital: false, our_history: null, mission: null, vision: null, code_card_id_file: null, code_medical_license_file: null, medical_type: { code: "GENERAL_MEDICAL" }, legal_representative: { id: legalRepresentatives[3].id } }, // 15 (Doctor - Dr+6.png)
{ id: 16, id_type: { code: "PHYSICAL_DNI" }, card_id: "16-1610-0016", num_medical_enrollment: "CR-2016016", name: "Paola Aguilar", phone_number: "8816-0016", email: "vitalinkcr2+supplier016@gmail.com", country_iso_code: "CRC", province: "San José", city_name: "Curridabat", postal_code: "11801", profile_picture_url: "https://vitalink-v2-s3.s3.us-east-2.amazonaws.com/PublicFiles/Dra+6.jpg", description: "Especialista con experiencia en manejo clínico y control post consulta.", address: "Consultorios Pinares, Curridabat", latitude: 9.9156, longitude: -84.0306, experience_years: 10, patients_number: 1560, is_hospital: false, our_history: null, mission: null, vision: null, code_card_id_file: null, code_medical_license_file: null, medical_type: { code: "SPECIALTY_MEDICAL" }, legal_representative: { id: legalRepresentatives[4].id } }, // 16 (Doctora - Dra+6.jpg)
{ id: 17, id_type: { code: "PHYSICAL_DNI" }, card_id: "17-1711-0017", num_medical_enrollment: "CR-2017017", name: "Sergio Castro", phone_number: "8817-0017", email: "vitalinkcr2+supplier017@gmail.com", country_iso_code: "CRC", province: "Guanacaste", city_name: "Liberia", postal_code: "50101", profile_picture_url: "https://vitalink-v2-s3.s3.us-east-2.amazonaws.com/PublicFiles/Dr+7.png", description: "Especialista con experiencia en atención clínica y coordinación de casos.", address: "Centro Médico Liberia, Guanacaste", latitude: 10.6333, longitude: -85.4333, experience_years: 15, patients_number: 2800, is_hospital: false, our_history: null, mission: null, vision: null, code_card_id_file: null, code_medical_license_file: null, medical_type: { code: "SPECIALTY_MEDICAL" }, legal_representative: { id: legalRepresentatives[0].id } }, // 17 (Doctor - Dr+7.png)
{ id: 18, id_type: { code: "JURIDICAL_DNI" }, card_id: "J-700018-018", num_medical_enrollment: null, name: "Hospital Regional Heredia - Sede Norte", phone_number: "2218-0018", email: "vitalinkcr2+hospital018@gmail.com", country_iso_code: "CRC", province: "Heredia", city_name: "Heredia", postal_code: "40101", profile_picture_url: "https://vitalink-v2-s3.s3.us-east-2.amazonaws.com/PublicFiles/hospital.png", description: "Hospital con servicios integrales y atención especializada.", address: "Sede Norte, Heredia", latitude: 9.9987, longitude: -84.1198, experience_years: null, patients_number: null, is_hospital: true, our_history: "Institución orientada a brindar atención médica de calidad.", mission: "Brindar salud con excelencia y calidez humana.", vision: "Ser un referente regional en servicios médicos.", code_card_id_file: null, code_medical_license_file: null, medical_type: { code: "SPECIALTY_MEDICAL" }, legal_representative: { id: legalRepresentatives[1].id } }, // 18 (Hospital - hospital.png)
{ id: 19, id_type: { code: "JURIDICAL_DNI" }, card_id: "J-700019-019", num_medical_enrollment: null, name: "Clínica Metropolitana Cartago - Sede Central", phone_number: "2219-0019", email: "vitalinkcr2+hospital019@gmail.com", country_iso_code: "CRC", province: "Cartago", city_name: "Cartago", postal_code: "30101", profile_picture_url: "https://vitalink-v2-s3.s3.us-east-2.amazonaws.com/PublicFiles/hospital.png", description: "Clínica hospitalaria con enfoque en atención ambulatoria y procedimientos.", address: "Sede Central, Cartago", latitude: 9.8644, longitude: -83.9194, experience_years: null, patients_number: null, is_hospital: true, our_history: "Centro médico con trayectoria en atención clínica y quirúrgica.", mission: "Ofrecer servicios médicos con calidad y seguridad.", vision: "Expandir servicios médicos con innovación.", code_card_id_file: null, code_medical_license_file: null, medical_type: { code: "SPECIALTY_MEDICAL" }, legal_representative: { id: legalRepresentatives[2].id } }, // 19 (Hospital - hospital.png)
{ id: 20, id_type: { code: "JURIDICAL_DNI" }, card_id: "J-700020-020", num_medical_enrollment: null, name: "Centro Hospitalario Alajuela - Sede Oeste", phone_number: "2220-0020", email: "vitalinkcr2+hospital020@gmail.com", country_iso_code: "CRC", province: "Alajuela", city_name: "Alajuela", postal_code: "20101", profile_picture_url: "https://vitalink-v2-s3.s3.us-east-2.amazonaws.com/PublicFiles/hospital.png", description: "Centro hospitalario con atención integral y personal especializado.", address: "Sede Oeste, Alajuela", latitude: 10.0163, longitude: -84.2116, experience_years: null, patients_number: null, is_hospital: true, our_history: "Institución dedicada a la salud con procesos de mejora continua.", mission: "Brindar atención médica segura y oportuna.", vision: "Ser centro líder en atención integral a nivel provincial.", code_card_id_file: null, code_medical_license_file: null, medical_type: { code: "SPECIALTY_MEDICAL" }, legal_representative: { id: legalRepresentatives[3].id } }, // 20 (Hospital - hospital.png)
{ id: 21, id_type: { code: "PHYSICAL_DNI" }, card_id: "21-2112-0021", num_medical_enrollment: "CR-2021021", name: "Laura Quesada", phone_number: "8821-0021", email: "vitalinkcr2+supplier021@gmail.com", country_iso_code: "CRC", province: "Puntarenas", city_name: "Quepos", postal_code: "60601", profile_picture_url: "https://vitalink-v2-s3.s3.us-east-2.amazonaws.com/PublicFiles/Dra+7.jpg", description: "Médica general con experiencia en atención primaria y seguimiento.", address: "Consultorios Quepos, Puntarenas", latitude: 9.4316, longitude: -84.1618, experience_years: 6, patients_number: 820, is_hospital: false, our_history: null, mission: null, vision: null, code_card_id_file: null, code_medical_license_file: null, medical_type: { code: "GENERAL_MEDICAL" }, legal_representative: { id: legalRepresentatives[4].id } }, // 21 (Doctora - Dra+7.jpg)
{ id: 22, id_type: { code: "PHYSICAL_DNI" }, card_id: "22-2213-0022", num_medical_enrollment: "CR-2022022", name: "Marco Salazar", phone_number: "8822-0022", email: "vitalinkcr2+supplier022@gmail.com", country_iso_code: "CRC", province: "San José", city_name: "San José", postal_code: "10102", profile_picture_url: "https://vitalink-v2-s3.s3.us-east-2.amazonaws.com/PublicFiles/Dr+8.png", description: "Especialista con experiencia en diagnóstico clínico y procedimientos.", address: "Torre Médica Central, San José", latitude: 9.9333, longitude: -84.0833, experience_years: 16, patients_number: 3100, is_hospital: false, our_history: null, mission: null, vision: null, code_card_id_file: null, code_medical_license_file: null, medical_type: { code: "SPECIALTY_MEDICAL" }, legal_representative: { id: legalRepresentatives[0].id } }, // 22 (Doctor - Dr+8.png)
{ id: 23, id_type: { code: "PHYSICAL_DNI" }, card_id: "23-2314-0023", num_medical_enrollment: "CR-2023023", name: "Fernanda Campos", phone_number: "8823-0023", email: "vitalinkcr2+supplier023@gmail.com", country_iso_code: "CRC", province: "Heredia", city_name: "Heredia", postal_code: "40102", profile_picture_url: "https://vitalink-v2-s3.s3.us-east-2.amazonaws.com/PublicFiles/Dra+8.jpg", description: "Doctora especialista con enfoque en valoración, diagnóstico y seguimiento.", address: "Consultorios Heredia, Heredia", latitude: 9.9987, longitude: -84.1198, experience_years: 11, patients_number: 1750, is_hospital: false, our_history: null, mission: null, vision: null, code_card_id_file: null, code_medical_license_file: null, medical_type: { code: "SPECIALTY_MEDICAL" }, legal_representative: { id: legalRepresentatives[1].id } }, // 23 (Doctora - Dra+8.jpg)
{ id: 24, id_type: { code: "PHYSICAL_DNI" }, card_id: "24-2415-0024", num_medical_enrollment: "CR-2024024", name: "Óscar Calderón", phone_number: "8824-0024", email: "vitalinkcr2+supplier024@gmail.com", country_iso_code: "CRC", province: "Guanacaste", city_name: "Liberia", postal_code: "50102", profile_picture_url: "https://vitalink-v2-s3.s3.us-east-2.amazonaws.com/PublicFiles/Dr+9.png", description: "Médico general con enfoque en atención integral y continuidad de cuidado.", address: "Centro Médico Liberia, Guanacaste", latitude: 10.6333, longitude: -85.4333, experience_years: 8, patients_number: 1200, is_hospital: false, our_history: null, mission: null, vision: null, code_card_id_file: null, code_medical_license_file: null, medical_type: { code: "GENERAL_MEDICAL" }, legal_representative: { id: legalRepresentatives[2].id } }, // 24 (Doctor - Dr+9.png)
{ id: 25, id_type: { code: "PHYSICAL_DNI" }, card_id: "25-2516-0025", num_medical_enrollment: "CR-2025025", name: "Lucía Sequeira", phone_number: "8825-0025", email: "vitalinkcr2+supplier025@gmail.com", country_iso_code: "CRC", province: "Puntarenas", city_name: "Puntarenas", postal_code: "60102", profile_picture_url: "https://vitalink-v2-s3.s3.us-east-2.amazonaws.com/PublicFiles/Dra+9.jpg", description: "Especialista con experiencia en control post consulta y seguimiento de casos.", address: "Consultorios Puntarenas, Puntarenas", latitude: 9.9763, longitude: -84.8384, experience_years: 12, patients_number: 2080, is_hospital: false, our_history: null, mission: null, vision: null, code_card_id_file: null, code_medical_license_file: null, medical_type: { code: "SPECIALTY_MEDICAL" }, legal_representative: { id: legalRepresentatives[3].id } }, // 25 (Doctora - Dra+9.jpg)
];


const suppliers_part2 = [
{ id: 26, id_type: { code: "PHYSICAL_DNI" }, card_id: "26-2617-0026", num_medical_enrollment: "CR-2026026", name: "Hernán Villarreal", phone_number: "8826-0026", email: "vitalinkcr2+supplier026@gmail.com", country_iso_code: "CRC", province: "San José", city_name: "Santa Ana", postal_code: "10901", profile_picture_url: "https://vitalink-v2-s3.s3.us-east-2.amazonaws.com/PublicFiles/Dr+10.png", description: "Especialista con experiencia en procedimientos y coordinación de atención.", address: "Consultorios City Place, Santa Ana", latitude: 9.9360, longitude: -84.1840, experience_years: 9, patients_number: 1400, is_hospital: false, our_history: null, mission: null, vision: null, code_card_id_file: null, code_medical_license_file: null, medical_type: { code: "SPECIALTY_MEDICAL" }, legal_representative: { id: legalRepresentatives[4].id } }, // 26 (Doctor - Dr+10.png)
{ id: 27, id_type: { code: "PHYSICAL_DNI" }, card_id: "27-2718-0027", num_medical_enrollment: "CR-2027027", name: "Emilio Ramírez", phone_number: "8827-0027", email: "vitalinkcr2+supplier027@gmail.com", country_iso_code: "CRC", province: "San José", city_name: "San José", postal_code: "10103", profile_picture_url: "https://vitalink-v2-s3.s3.us-east-2.amazonaws.com/PublicFiles/Dr+11.png", description: "Especialista con enfoque en evaluación clínica y seguimiento de pacientes.", address: "Consultorios La Sabana, San José", latitude: 9.934900, longitude: -84.102800, experience_years: 10, patients_number: 1550, is_hospital: false, our_history: null, mission: null, vision: null, code_card_id_file: null, code_medical_license_file: null, medical_type: { code: "SPECIALTY_MEDICAL" }, legal_representative: { id: legalRepresentatives[0].id } }, // 27 (Doctor - Dr+11.png)
{ id: 28, id_type: { code: "PHYSICAL_DNI" }, card_id: "28-2819-0028", num_medical_enrollment: "CR-2028028", name: "Camila Sánchez", phone_number: "8828-0028", email: "vitalinkcr2+supplier028@gmail.com", country_iso_code: "CRC", province: "Heredia", city_name: "Heredia", postal_code: "40103", profile_picture_url: "https://vitalink-v2-s3.s3.us-east-2.amazonaws.com/PublicFiles/Dra+10.png", description: "Doctora especialista con experiencia en diagnóstico y manejo ambulatorio.", address: "Consultorios Paseo de las Flores, Heredia", latitude: 10.002300, longitude: -84.118900, experience_years: 8, patients_number: 980, is_hospital: false, our_history: null, mission: null, vision: null, code_card_id_file: null, code_medical_license_file: null, medical_type: { code: "SPECIALTY_MEDICAL" }, legal_representative: { id: legalRepresentatives[1].id } }, // 28 (Doctora - Dra+10.jpg)
{ id: 29, id_type: { code: "PHYSICAL_DNI" }, card_id: "29-2920-0029", num_medical_enrollment: "CR-2029029", name: "Mauricio Rojas", phone_number: "8829-0029", email: "vitalinkcr2+supplier029@gmail.com", country_iso_code: "CRC", province: "Cartago", city_name: "Cartago", postal_code: "30103", profile_picture_url: "https://vitalink-v2-s3.s3.us-east-2.amazonaws.com/PublicFiles/Dr+12.png", description: "Médico general orientado a atención primaria y continuidad de cuidado.", address: "Clínica El Molino, Cartago", latitude: 9.862900, longitude: -83.921700, experience_years: 7, patients_number: 1320, is_hospital: false, our_history: null, mission: null, vision: null, code_card_id_file: null, code_medical_license_file: null, medical_type: { code: "GENERAL_MEDICAL" }, legal_representative: { id: legalRepresentatives[2].id } }, // 29 (Doctor - Dr+12.png)
{ id: 30, id_type: { code: "PHYSICAL_DNI" }, card_id: "30-3021-0030", num_medical_enrollment: "CR-2030030", name: "Isabella Mora", phone_number: "+506 2437-4500", email: "dramora@clinicadelavista.com", country_iso_code: "CRC", province: "Alajuela", city_name: "Alajuela", postal_code: "20102", profile_picture_url: "https://vitalink-v2-s3.s3.us-east-2.amazonaws.com/PublicFiles/Isabella+Mora.png", description: "Oftalmología. Enfoque: Niños(as), Adultos, Adultos mayores", address: "Consultorios Plaza Real, Alajuela", latitude: 10.015800, longitude: -84.214100, experience_years: 12, patients_number: 2010, is_hospital: false, our_history: null, mission: null, vision: null, code_card_id_file: null, code_medical_license_file: null, medical_type: { code: "SPECIALTY_MEDICAL" }, legal_representative: { id: legalRepresentatives[3].id } }, // 30 (Doctora - imagen propia: doctora1.png)
{ id: 31, id_type: { code: "PHYSICAL_DNI" }, card_id: "31-3122-0031", num_medical_enrollment: "CR-2031031", name: "Jorge Salazar", phone_number: "8831-0031", email: "vitalinkcr2+supplier031@gmail.com", country_iso_code: "CRC", province: "Puntarenas", city_name: "Puntarenas", postal_code: "60103", profile_picture_url: "https://vitalink-v2-s3.s3.us-east-2.amazonaws.com/PublicFiles/Dr+13.jpg", description: "Especialista con experiencia en atención clínica y control post consulta.", address: "Centro Médico Paseo del Mar, Puntarenas", latitude: 9.975600, longitude: -84.840900, experience_years: 9, patients_number: 1410, is_hospital: false, our_history: null, mission: null, vision: null, code_card_id_file: null, code_medical_license_file: null, medical_type: { code: "SPECIALTY_MEDICAL" }, legal_representative: { id: legalRepresentatives[4].id } }, // 31 (Doctor - Dr+13.png)
{ id: 32, id_type: { code: "PHYSICAL_DNI" }, card_id: "32-3223-0032", num_medical_enrollment: "CR-2032032", name: "Verónica Herrera", phone_number: "8832-0032", email: "vitalinkcr2+supplier032@gmail.com", country_iso_code: "CRC", province: "San José", city_name: "Escazú", postal_code: "10202", profile_picture_url: "https://vitalink-v2-s3.s3.us-east-2.amazonaws.com/PublicFiles/Dra+11.png", description: "Médica general con experiencia en seguimiento clínico y prevención.", address: "Consultorios Multiplaza, Escazú", latitude: 9.939000, longitude: -84.139000, experience_years: 6, patients_number: 860, is_hospital: false, our_history: null, mission: null, vision: null, code_card_id_file: null, code_medical_license_file: null, medical_type: { code: "GENERAL_MEDICAL" }, legal_representative: { id: legalRepresentatives[0].id } }, // 32 (Doctora - Dra+11.jpg)
{ id: 33, id_type: { code: "PHYSICAL_DNI" }, card_id: "33-3324-0033", num_medical_enrollment: "CR-2033033", name: "Raúl Aguilar", phone_number: "8833-0033", email: "vitalinkcr2+supplier033@gmail.com", country_iso_code: "CRC", province: "Heredia", city_name: "Heredia", postal_code: "40104", profile_picture_url: "https://vitalink-v2-s3.s3.us-east-2.amazonaws.com/PublicFiles/Dr+14.jpg", description: "Especialista con enfoque en diagnóstico clínico y procedimientos ambulatorios.", address: "Clínica San Francisco, Heredia", latitude: 9.993700, longitude: -84.117200, experience_years: 14, patients_number: 2750, is_hospital: false, our_history: null, mission: null, vision: null, code_card_id_file: null, code_medical_license_file: null, medical_type: { code: "SPECIALTY_MEDICAL" }, legal_representative: { id: legalRepresentatives[1].id } }, // 33 (Doctor - Dr+14.png)
{ id: 34, id_type: { code: "PHYSICAL_DNI" }, card_id: "34-3425-0034", num_medical_enrollment: "CR-2034034", name: "Lucía Castro", phone_number: "8834-0034", email: "vitalinkcr2+supplier034@gmail.com", country_iso_code: "CRC", province: "Cartago", city_name: "Cartago", postal_code: "30104", profile_picture_url: "https://vitalink-v2-s3.s3.us-east-2.amazonaws.com/PublicFiles/Dra+12.png", description: "Doctora especialista con experiencia en valoración y seguimiento de casos.", address: "Centro Médico Los Ángeles, Cartago", latitude: 9.865700, longitude: -83.918600, experience_years: 9, patients_number: 1480, is_hospital: false, our_history: null, mission: null, vision: null, code_card_id_file: null, code_medical_license_file: null, medical_type: { code: "SPECIALTY_MEDICAL" }, legal_representative: { id: legalRepresentatives[2].id } }, // 34 (Doctora - Dra+12.jpg)
{ id: 35, id_type: { code: "JURIDICAL_DNI" }, card_id: "J-700035-035", num_medical_enrollment: null, name: "Hospital Regional San José - Sede Este", phone_number: "2235-0035", email: "vitalinkcr2+hospital035@gmail.com", country_iso_code: "CRC", province: "San José", city_name: "San José", postal_code: "10105", profile_picture_url: "https://vitalink-v2-s3.s3.us-east-2.amazonaws.com/PublicFiles/hospital.png", description: "Hospital con servicios integrales, consultas externas y procedimientos especializados.", address: "Sede Este, San José", latitude: 9.932900, longitude: -84.070500, experience_years: null, patients_number: null, is_hospital: true, our_history: "Institución orientada a brindar atención médica de calidad con estándares modernos.", mission: "Brindar salud con excelencia y calidez humana.", vision: "Ser un referente nacional en servicios médicos.", code_card_id_file: null, code_medical_license_file: null, medical_type: { code: "SPECIALTY_MEDICAL" }, legal_representative: { id: legalRepresentatives[3].id } }, // 35 (Hospital - hospital.png)
{ id: 36, id_type: { code: "PHYSICAL_DNI" }, card_id: "36-3626-0036", num_medical_enrollment: "CR-2036036", name: "Daniel Pérez", phone_number: "8836-0036", email: "vitalinkcr2+supplier036@gmail.com", country_iso_code: "CRC", province: "Alajuela", city_name: "Alajuela", postal_code: "20103", profile_picture_url: "https://vitalink-v2-s3.s3.us-east-2.amazonaws.com/PublicFiles/Dr+15.jpg", description: "Especialista con experiencia en evaluación, procedimientos y seguimiento clínico.", address: "Consultorios La Tropicana, Alajuela", latitude: 10.019100, longitude: -84.213000, experience_years: 13, patients_number: 2140, is_hospital: false, our_history: null, mission: null, vision: null, code_card_id_file: null, code_medical_license_file: null, medical_type: { code: "SPECIALTY_MEDICAL" }, legal_representative: { id: legalRepresentatives[4].id } }, // 36 (Doctor - Dr+15.png)
{ id: 37, id_type: { code: "PHYSICAL_DNI" }, card_id: "37-3727-0037", num_medical_enrollment: "CR-2037037", name: "Natalia Vargas", phone_number: "8837-0037", email: "vitalinkcr2+supplier037@gmail.com", country_iso_code: "CRC", province: "Puntarenas", city_name: "Quepos", postal_code: "60602", profile_picture_url: "https://vitalink-v2-s3.s3.us-east-2.amazonaws.com/PublicFiles/Dra+13.jpg", description: "Doctora especialista con enfoque en diagnóstico, valoración y seguimiento de pacientes.", address: "Consultorios Marina, Quepos", latitude: 9.431900, longitude: -84.162300, experience_years: 8, patients_number: 1120, is_hospital: false, our_history: null, mission: null, vision: null, code_card_id_file: null, code_medical_license_file: null, medical_type: { code: "SPECIALTY_MEDICAL" }, legal_representative: { id: legalRepresentatives[0].id } }, // 37 (Doctora - Dra+13.jpg)
{ id: 38, id_type: { code: "PHYSICAL_DNI" }, card_id: "38-3828-0038", num_medical_enrollment: "CR-2038038", name: "Hugo Gómez", phone_number: "8838-0038", email: "vitalinkcr2+supplier038@gmail.com", country_iso_code: "CRC", province: "San José", city_name: "Santa Ana", postal_code: "10902", profile_picture_url: "https://vitalink-v2-s3.s3.us-east-2.amazonaws.com/PublicFiles/Dr+16.jpg", description: "Especialista con experiencia en coordinación de atención y procedimientos ambulatorios.", address: "Consultorios City Place, Santa Ana", latitude: 9.936200, longitude: -84.184300, experience_years: 11, patients_number: 1680, is_hospital: false, our_history: null, mission: null, vision: null, code_card_id_file: null, code_medical_license_file: null, medical_type: { code: "SPECIALTY_MEDICAL" }, legal_representative: { id: legalRepresentatives[1].id } }, // 38 (Doctor - Dr+16.png)
{ id: 39, id_type: { code: "PHYSICAL_DNI" }, card_id: "39-3929-0039", num_medical_enrollment: "CR-2039039", name: "Paula Alvarado", phone_number: "8839-0039", email: "vitalinkcr2+supplier039@gmail.com", country_iso_code: "CRC", province: "Heredia", city_name: "Heredia", postal_code: "40105", profile_picture_url: "https://vitalink-v2-s3.s3.us-east-2.amazonaws.com/PublicFiles/Dra+14.jpg", description: "Doctora especialista con enfoque en evaluación y seguimiento de pacientes.", address: "Consultorios Oxígeno, Heredia", latitude: 10.001200, longitude: -84.126600, experience_years: 10, patients_number: 1520, is_hospital: false, our_history: null, mission: null, vision: null, code_card_id_file: null, code_medical_license_file: null, medical_type: { code: "SPECIALTY_MEDICAL" }, legal_representative: { id: legalRepresentatives[2].id } }, // 39 (Doctora - Dra+14.jpg)
{ id: 40, id_type: { code: "PHYSICAL_DNI" }, card_id: "40-4030-0040", num_medical_enrollment: "CR-2040040", name: "Santiago Cordero", phone_number: "8840-0040", email: "vitalinkcr2+supplier040@gmail.com", country_iso_code: "CRC", province: "Cartago", city_name: "Cartago", postal_code: "30105", profile_picture_url: "https://vitalink-v2-s3.s3.us-east-2.amazonaws.com/PublicFiles/Dr+17.jpg", description: "Especialista con experiencia en valoración, procedimientos y control post consulta.", address: "Consultorios Plaza Mayor, Cartago", latitude: 9.864100, longitude: -83.916900, experience_years: 12, patients_number: 2050, is_hospital: false, our_history: null, mission: null, vision: null, code_card_id_file: null, code_medical_license_file: null, medical_type: { code: "SPECIALTY_MEDICAL" }, legal_representative: { id: legalRepresentatives[3].id } }, // 40 (Doctor - Dr+17.png)
{ id: 41, id_type: { code: "JURIDICAL_DNI" }, card_id: "J-700041-041", num_medical_enrollment: null, name: "Clínica Metropolitana Puntarenas - Sede Central", phone_number: "2241-0041", email: "vitalinkcr2+hospital041@gmail.com", country_iso_code: "CRC", province: "Puntarenas", city_name: "Puntarenas", postal_code: "60104", profile_picture_url: "https://vitalink-v2-s3.s3.us-east-2.amazonaws.com/PublicFiles/hospital.png", description: "Clínica hospitalaria con enfoque en atención ambulatoria y procedimientos especializados.", address: "Sede Central, Puntarenas", latitude: 9.976900, longitude: -84.839900, experience_years: null, patients_number: null, is_hospital: true, our_history: "Centro médico con trayectoria en atención clínica y quirúrgica.", mission: "Ofrecer servicios médicos con calidad y seguridad.", vision: "Expandir servicios médicos con innovación.", code_card_id_file: null, code_medical_license_file: null, medical_type: { code: "SPECIALTY_MEDICAL" }, legal_representative: { id: legalRepresentatives[4].id } }, // 41 (Hospital - hospital.png)
{ id: 42, id_type: { code: "PHYSICAL_DNI" }, card_id: "42-4231-0042", num_medical_enrollment: "CR-2042042", name: "Gabriel Navarro", phone_number: "8842-0042", email: "vitalinkcr2+supplier042@gmail.com", country_iso_code: "CRC", province: "San José", city_name: "Curridabat", postal_code: "11802", profile_picture_url: "https://vitalink-v2-s3.s3.us-east-2.amazonaws.com/PublicFiles/Dr+18.jpg", description: "Especialista con experiencia en coordinación de casos y seguimiento clínico.", address: "Consultorios Pinares, Curridabat", latitude: 9.915900, longitude: -84.031200, experience_years: 9, patients_number: 1390, is_hospital: false, our_history: null, mission: null, vision: null, code_card_id_file: null, code_medical_license_file: null, medical_type: { code: "SPECIALTY_MEDICAL" }, legal_representative: { id: legalRepresentatives[0].id } }, // 42 (Doctor - Dr+18.png)
{ id: 43, id_type: { code: "PHYSICAL_DNI" }, card_id: "43-4332-0043", num_medical_enrollment: "CR-2043043", name: "Mariana Vega", phone_number: "8843-0043", email: "vitalinkcr2+supplier043@gmail.com", country_iso_code: "CRC", province: "Alajuela", city_name: "Alajuela", postal_code: "20104", profile_picture_url: "https://vitalink-v2-s3.s3.us-east-2.amazonaws.com/PublicFiles/Dra+15.png", description: "Doctora especialista con enfoque en valoración, diagnóstico y seguimiento.", address: "Consultorios Plaza Tomas Guardia, Alajuela", latitude: 10.016900, longitude: -84.212400, experience_years: 11, patients_number: 1760, is_hospital: false, our_history: null, mission: null, vision: null, code_card_id_file: null, code_medical_license_file: null, medical_type: { code: "SPECIALTY_MEDICAL" }, legal_representative: { id: legalRepresentatives[1].id } }, // 43 (Doctora - Dra+15.jpg)
{ id: 44, id_type: { code: "PHYSICAL_DNI" }, card_id: "44-4433-0044", num_medical_enrollment: "CR-2044044", name: "Rodrigo Campos", phone_number: "8844-0044", email: "vitalinkcr2+supplier044@gmail.com", country_iso_code: "CRC", province: "Heredia", city_name: "Heredia", postal_code: "40106", profile_picture_url: "https://vitalink-v2-s3.s3.us-east-2.amazonaws.com/PublicFiles/Dr+19.jpg", description: "Especialista con experiencia en procedimientos y control post consulta.", address: "Consultorios Barreal, Heredia", latitude: 10.000600, longitude: -84.108900, experience_years: 15, patients_number: 2900, is_hospital: false, our_history: null, mission: null, vision: null, code_card_id_file: null, code_medical_license_file: null, medical_type: { code: "SPECIALTY_MEDICAL" }, legal_representative: { id: legalRepresentatives[2].id } }, // 44 (Doctor - Dr+19.png)
{ id: 45, id_type: { code: "PHYSICAL_DNI" }, card_id: "45-4534-0045", num_medical_enrollment: "CR-2045045", name: "Karla Quesada", phone_number: "8845-0045", email: "vitalinkcr2+supplier045@gmail.com", country_iso_code: "CRC", province: "Cartago", city_name: "Cartago", postal_code: "30106", profile_picture_url: "https://vitalink-v2-s3.s3.us-east-2.amazonaws.com/PublicFiles/Dra+16.png", description: "Doctora especialista con enfoque en valoración y seguimiento de pacientes.", address: "Consultorios Tres Ríos, Cartago", latitude: 9.907100, longitude: -83.987300, experience_years: 10, patients_number: 1600, is_hospital: false, our_history: null, mission: null, vision: null, code_card_id_file: null, code_medical_license_file: null, medical_type: { code: "SPECIALTY_MEDICAL" }, legal_representative: { id: legalRepresentatives[3].id } }, // 45 (Doctora - Dra+16.jpg)
{ id: 46, id_type: { code: "JURIDICAL_DNI" }, card_id: "J-700046-046", num_medical_enrollment: null, name: "Centro Hospitalario Guanacaste - Sede Liberia", phone_number: "2246-0046", email: "vitalinkcr2+hospital046@gmail.com", country_iso_code: "CRC", province: "Guanacaste", city_name: "Liberia", postal_code: "50103", profile_picture_url: "https://vitalink-v2-s3.s3.us-east-2.amazonaws.com/PublicFiles/hospital.png", description: "Centro hospitalario con atención integral y servicios especializados.", address: "Sede Liberia, Guanacaste", latitude: 10.633700, longitude: -85.433800, experience_years: null, patients_number: null, is_hospital: true, our_history: "Institución dedicada a la salud con procesos de mejora continua.", mission: "Brindar atención médica segura y oportuna.", vision: "Ser centro líder en atención integral a nivel regional.", code_card_id_file: null, code_medical_license_file: null, medical_type: { code: "SPECIALTY_MEDICAL" }, legal_representative: { id: legalRepresentatives[4].id } }, // 46 (Hospital - hospital.png)
{ id: 47, id_type: { code: "PHYSICAL_DNI" }, card_id: "47-4735-0047", num_medical_enrollment: "CR-2047047", name: "Daniela Arias", phone_number: "8847-0047", email: "vitalinkcr2+supplier047@gmail.com", country_iso_code: "CRC", province: "San José", city_name: "San José", postal_code: "10106", profile_picture_url: "https://vitalink-v2-s3.s3.us-east-2.amazonaws.com/PublicFiles/Dra+17.png", description: "Doctora especialista con enfoque en valoración, diagnóstico y seguimiento clínico.", address: "Torre Médica Central, San José", latitude: 9.932500, longitude: -84.084200, experience_years: 10, patients_number: 1650, is_hospital: false, our_history: null, mission: null, vision: null, code_card_id_file: null, code_medical_license_file: null, medical_type: { code: "SPECIALTY_MEDICAL" }, legal_representative: { id: legalRepresentatives[0].id } }, // 47 (Doctora - Dra+17.jpg)
{ id: 48, id_type: { code: "PHYSICAL_DNI" }, card_id: "48-4836-0048", num_medical_enrollment: "CR-2048048", name: "Esteban Solís", phone_number: "8848-0048", email: "vitalinkcr2+supplier048@gmail.com", country_iso_code: "CRC", province: "Heredia", city_name: "Heredia", postal_code: "40107", profile_picture_url: "https://vitalink-v2-s3.s3.us-east-2.amazonaws.com/PublicFiles/Dr+20.jpg", description: "Especialista con experiencia en atención ambulatoria y seguimiento de casos.", address: "Consultorios Barreal, Heredia", latitude: 10.000900, longitude: -84.112400, experience_years: 12, patients_number: 2100, is_hospital: false, our_history: null, mission: null, vision: null, code_card_id_file: null, code_medical_license_file: null, medical_type: { code: "SPECIALTY_MEDICAL" }, legal_representative: { id: legalRepresentatives[1].id } }, // 48 (Doctor - Dr+20.png)
{ id: 49, id_type: { code: "PHYSICAL_DNI" }, card_id: "49-4937-0049", num_medical_enrollment: "CR-2049049", name: "Álvaro Jiménez", phone_number: "8849-0049", email: "vitalinkcr2+supplier049@gmail.com", country_iso_code: "CRC", province: "San José", city_name: "Desamparados", postal_code: "10301", profile_picture_url: "https://vitalink-v2-s3.s3.us-east-2.amazonaws.com/PublicFiles/Dr+21.jpg", description: "Especialista con enfoque en evaluación clínica, procedimientos y control post consulta.", address: "Clínica Central, Desamparados", latitude: 9.896100, longitude: -84.062700, experience_years: 11, patients_number: 1780, is_hospital: false, our_history: null, mission: null, vision: null, code_card_id_file: null, code_medical_license_file: null, medical_type: { code: "SPECIALTY_MEDICAL" }, legal_representative: { id: legalRepresentatives[2].id } }, // 49 (Doctor - Dr+21.png)
{ id: 50, id_type: { code: "PHYSICAL_DNI" }, card_id: "50-5038-0050", num_medical_enrollment: "CR-2050050", name: "María José Ureña", phone_number: "8850-0050", email: "vitalinkcr2+supplier050@gmail.com", country_iso_code: "CRC", province: "Alajuela", city_name: "Alajuela", postal_code: "20105", profile_picture_url: "https://vitalink-v2-s3.s3.us-east-2.amazonaws.com/PublicFiles/Dra+18.jpg", description: "Doctora especialista con experiencia en valoración y planificación de tratamiento.", address: "Consultorios Plaza Real, Alajuela", latitude: 10.017200, longitude: -84.211900, experience_years: 9, patients_number: 1420, is_hospital: false, our_history: null, mission: null, vision: null, code_card_id_file: null, code_medical_license_file: null, medical_type: { code: "SPECIALTY_MEDICAL" }, legal_representative: { id: legalRepresentatives[3].id } }, // 50 (Doctora - Dra+18.jpg)
];

const suppliers_part3 = [
{ id: 51, id_type: { code: "PHYSICAL_DNI" }, card_id: "51-5139-0051", num_medical_enrollment: "CR-2051051", name: "Kevin Zúñiga", phone_number: "8851-0051", email: "vitalinkcr2+supplier051@gmail.com", country_iso_code: "CRC", province: "San José", city_name: "Curridabat", postal_code: "11803", profile_picture_url: "https://vitalink-v2-s3.s3.us-east-2.amazonaws.com/PublicFiles/Dr+22.png", description: "Médico general con enfoque en atención primaria, prevención y seguimiento.", address: "Consultorios Pinares, Curridabat", latitude: 9.916200, longitude: -84.029800, experience_years: 7, patients_number: 1180, is_hospital: false, our_history: null, mission: null, vision: null, code_card_id_file: null, code_medical_license_file: null, medical_type: { code: "GENERAL_MEDICAL" }, legal_representative: { id: legalRepresentatives[4].id } }, // 51 (Doctor - Dr+22.png)
{ id: 52, id_type: { code: "JURIDICAL_DNI" }, card_id: "J-700052-052", num_medical_enrollment: null, name: "Hospital Metropolitano San José - Sede Centro", phone_number: "2252-0052", email: "vitalinkcr2+hospital052@gmail.com", country_iso_code: "CRC", province: "San José", city_name: "San José", postal_code: "10107", profile_picture_url: "https://vitalink-v2-s3.s3.us-east-2.amazonaws.com/PublicFiles/hospital.png", description: "Hospital con atención integral, consultas externas y procedimientos especializados.", address: "Centro, San José", latitude: 9.932900, longitude: -84.080700, experience_years: null, patients_number: null, is_hospital: true, our_history: "Centro hospitalario con trayectoria en atención médica y mejora continua.", mission: "Brindar atención médica segura, oportuna y de calidad.", vision: "Ser referente nacional en servicios hospitalarios y atención especializada.", code_card_id_file: null, code_medical_license_file: null, medical_type: { code: "SPECIALTY_MEDICAL" }, legal_representative: { id: legalRepresentatives[0].id } }, // 52 (Hospital - hospital.png)
{ id: 53, id_type: { code: "PHYSICAL_DNI" }, card_id: "53-5340-0053", num_medical_enrollment: "CR-2053053", name: "Sofía Chaves", phone_number: "8853-0053", email: "vitalinkcr2+supplier053@gmail.com", country_iso_code: "CRC", province: "Guanacaste", city_name: "Liberia", postal_code: "50104", profile_picture_url: "https://vitalink-v2-s3.s3.us-east-2.amazonaws.com/PublicFiles/Dra+19.jpg", description: "Doctora especialista con experiencia en evaluación, diagnóstico y seguimiento clínico.", address: "Centro Médico Liberia, Guanacaste", latitude: 10.633900, longitude: -85.432900, experience_years: 10, patients_number: 1700, is_hospital: false, our_history: null, mission: null, vision: null, code_card_id_file: null, code_medical_license_file: null, medical_type: { code: "SPECIALTY_MEDICAL" }, legal_representative: { id: legalRepresentatives[1].id } }, // 53 (Doctora - Dra+19.jpg)
{ id: 54, id_type: { code: "PHYSICAL_DNI" }, card_id: "54-5441-0054", num_medical_enrollment: "CR-2054054", name: "Manuel Cerdas", phone_number: "8854-0054", email: "vitalinkcr2+supplier054@gmail.com", country_iso_code: "CRC", province: "Puntarenas", city_name: "Quepos", postal_code: "60603", profile_picture_url: "https://vitalink-v2-s3.s3.us-east-2.amazonaws.com/PublicFiles/Dr+23.png", description: "Especialista con enfoque en procedimientos ambulatorios y control post consulta.", address: "Consultorios Quepos, Puntarenas", latitude: 9.432200, longitude: -84.161400, experience_years: 11, patients_number: 1850, is_hospital: false, our_history: null, mission: null, vision: null, code_card_id_file: null, code_medical_license_file: null, medical_type: { code: "SPECIALTY_MEDICAL" }, legal_representative: { id: legalRepresentatives[2].id } }, // 54 (Doctor - Dr+23.png)
{ id: 55, id_type: { code: "PHYSICAL_DNI" }, card_id: "55-5542-0055", num_medical_enrollment: "CR-2055055", name: "Paola Villalobos", phone_number: "8855-0055", email: "vitalinkcr2+supplier055@gmail.com", country_iso_code: "CRC", province: "San José", city_name: "Santa Ana", postal_code: "10903", profile_picture_url: "https://vitalink-v2-s3.s3.us-east-2.amazonaws.com/PublicFiles/Dra+20.jpg", description: "Doctora especialista con experiencia en valoración y acompañamiento clínico.", address: "Consultorios City Place, Santa Ana", latitude: 9.936400, longitude: -84.184600, experience_years: 8, patients_number: 1210, is_hospital: false, our_history: null, mission: null, vision: null, code_card_id_file: null, code_medical_license_file: null, medical_type: { code: "SPECIALTY_MEDICAL" }, legal_representative: { id: legalRepresentatives[3].id } }, // 55 (Doctora - Dra+20.jpg)
{ id: 56, id_type: { code: "PHYSICAL_DNI" }, card_id: "56-5643-0056", num_medical_enrollment: "CR-2056056", name: "Luis Eduardo Marín", phone_number: "8856-0056", email: "vitalinkcr2+supplier056@gmail.com", country_iso_code: "CRC", province: "Cartago", city_name: "Cartago", postal_code: "30107", profile_picture_url: "https://vitalink-v2-s3.s3.us-east-2.amazonaws.com/PublicFiles/Dr+24.png", description: "Especialista con experiencia en diagnóstico clínico y seguimiento de pacientes.", address: "Consultorios Plaza Mayor, Cartago", latitude: 9.863800, longitude: -83.918200, experience_years: 14, patients_number: 2650, is_hospital: false, our_history: null, mission: null, vision: null, code_card_id_file: null, code_medical_license_file: null, medical_type: { code: "SPECIALTY_MEDICAL" }, legal_representative: { id: legalRepresentatives[4].id } }, // 56 (Doctor - Dr+24.png)
{ id: 57, id_type: { code: "PHYSICAL_DNI" }, card_id: "57-5744-0057", num_medical_enrollment: "CR-2057057", name: "Cristian Arce", phone_number: "8857-0057", email: "vitalinkcr2+supplier057@gmail.com", country_iso_code: "CRC", province: "Heredia", city_name: "Heredia", postal_code: "40108", profile_picture_url: "https://vitalink-v2-s3.s3.us-east-2.amazonaws.com/PublicFiles/Dr+25.png", description: "Especialista con enfoque en valoración, procedimientos y control clínico.", address: "Consultorios Oxígeno, Heredia", latitude: 10.001000, longitude: -84.126200, experience_years: 10, patients_number: 1580, is_hospital: false, our_history: null, mission: null, vision: null, code_card_id_file: null, code_medical_license_file: null, medical_type: { code: "SPECIALTY_MEDICAL" }, legal_representative: { id: legalRepresentatives[0].id } }, // 57 (Doctor - Dr+25.png)
{ id: 58, id_type: { code: "JURIDICAL_DNI" }, card_id: "J-700058-058", num_medical_enrollment: null, name: "Centro Hospitalario Pacífico - Sede Quepos", phone_number: "2258-0058", email: "vitalinkcr2+hospital058@gmail.com", country_iso_code: "CRC", province: "Puntarenas", city_name: "Quepos", postal_code: "60604", profile_picture_url: "https://vitalink-v2-s3.s3.us-east-2.amazonaws.com/PublicFiles/hospital.png", description: "Centro hospitalario con servicios integrales y atención especializada regional.", address: "Sede Quepos, Puntarenas", latitude: 9.431800, longitude: -84.162100, experience_years: null, patients_number: null, is_hospital: true, our_history: "Institución enfocada en brindar servicios médicos con estándares de calidad.", mission: "Brindar atención médica segura y eficiente para la comunidad.", vision: "Ser un referente regional en atención hospitalaria y especializada.", code_card_id_file: null, code_medical_license_file: null, medical_type: { code: "SPECIALTY_MEDICAL" }, legal_representative: { id: legalRepresentatives[1].id } }, // 58 (Hospital - hospital.png)
{ id: 59, id_type: { code: "PHYSICAL_DNI" }, card_id: "59-5945-0059", num_medical_enrollment: "CR-2059059", name: "Andrea Méndez", phone_number: "8859-0059", email: "vitalinkcr2+supplier059@gmail.com", country_iso_code: "CRC", province: "San José", city_name: "Curridabat", postal_code: "11804", profile_picture_url: "https://vitalink-v2-s3.s3.us-east-2.amazonaws.com/PublicFiles/Dra+21.png", description: "Doctora especialista con enfoque en evaluación clínica y seguimiento.", address: "Consultorios Pinares, Curridabat", latitude: 9.915400, longitude: -84.030400, experience_years: 9, patients_number: 1490, is_hospital: false, our_history: null, mission: null, vision: null, code_card_id_file: null, code_medical_license_file: null, medical_type: { code: "SPECIALTY_MEDICAL" }, legal_representative: { id: legalRepresentatives[2].id } }, // 59 (Doctora - Dra+21.jpg)
{ id: 60, id_type: { code: "PHYSICAL_DNI" }, card_id: "60-6046-0060", num_medical_enrollment: "CR-2060060", name: "José Miguel Fonseca", phone_number: "8860-0060", email: "vitalinkcr2+supplier060@gmail.com", country_iso_code: "CRC", province: "Guanacaste", city_name: "Huacas", postal_code: "50301", profile_picture_url: "https://vitalink-v2-s3.s3.us-east-2.amazonaws.com/PublicFiles/Dr+26.png", description: "Especialista con experiencia en valoración, procedimientos y control post consulta.", address: "Centro Médico Huacas, Guanacaste", latitude: 10.357800, longitude: -85.796300, experience_years: 13, patients_number: 2300, is_hospital: false, our_history: null, mission: null, vision: null, code_card_id_file: null, code_medical_license_file: null, medical_type: { code: "SPECIALTY_MEDICAL" }, legal_representative: { id: legalRepresentatives[3].id } }, // 60 (Doctor - Dr+26.png)
{ id: 61, id_type: { code: "PHYSICAL_DNI" }, card_id: "61-6147-0061", num_medical_enrollment: "CR-2061061", name: "Ana Lucía Torres", phone_number: "8861-0061", email: "vitalinkcr2+supplier061@gmail.com", country_iso_code: "CRC", province: "San José", city_name: "Guadalupe", postal_code: "10801", profile_picture_url: "https://vitalink-v2-s3.s3.us-east-2.amazonaws.com/PublicFiles/Dra+22.jpg", description: "Médica general con enfoque en prevención, control y seguimiento de pacientes.", address: "Clínica Guadalupe, San José", latitude: 9.958700, longitude: -84.057900, experience_years: 6, patients_number: 990, is_hospital: false, our_history: null, mission: null, vision: null, code_card_id_file: null, code_medical_license_file: null, medical_type: { code: "GENERAL_MEDICAL" }, legal_representative: { id: legalRepresentatives[4].id } }, // 61 (Doctora - Dra+22.jpg)
{ id: 62, id_type: { code: "PHYSICAL_DNI" }, card_id: "62-6248-0062", num_medical_enrollment: "CR-2062062", name: "Felipe Brenes", phone_number: "8862-0062", email: "vitalinkcr2+supplier062@gmail.com", country_iso_code: "CRC", province: "San José", city_name: "Escazú", postal_code: "10203", profile_picture_url: "https://vitalink-v2-s3.s3.us-east-2.amazonaws.com/PublicFiles/Dr+27.png", description: "Especialista con enfoque en diagnóstico clínico y procedimientos ambulatorios.", address: "Consultorios Escazú, San José", latitude: 9.938600, longitude: -84.136800, experience_years: 15, patients_number: 3050, is_hospital: false, our_history: null, mission: null, vision: null, code_card_id_file: null, code_medical_license_file: null, medical_type: { code: "SPECIALTY_MEDICAL" }, legal_representative: { id: legalRepresentatives[0].id } }, // 62 (Doctor - Dr+27.png)
{ id: 63, id_type: { code: "JURIDICAL_DNI" }, card_id: "J-700063-063", num_medical_enrollment: null, name: "Hospital Regional Heredia - Sede Central II", phone_number: "2263-0063", email: "vitalinkcr2+hospital063@gmail.com", country_iso_code: "CRC", province: "Heredia", city_name: "Heredia", postal_code: "40109", profile_picture_url: "https://vitalink-v2-s3.s3.us-east-2.amazonaws.com/PublicFiles/hospital.png", description: "Hospital con servicios integrales, consultas externas y soporte diagnóstico.", address: "Sede Central II, Heredia", latitude: 9.999100, longitude: -84.118300, experience_years: null, patients_number: null, is_hospital: true, our_history: "Hospital enfocado en atención integral y mejora continua de procesos clínicos.", mission: "Brindar atención médica con calidad, seguridad y trato humano.", vision: "Ser un hospital referente en la región por innovación y excelencia.", code_card_id_file: null, code_medical_license_file: null, medical_type: { code: "SPECIALTY_MEDICAL" }, legal_representative: { id: legalRepresentatives[1].id } }, // 63 (Hospital - hospital.png)
{ id: 64, id_type: { code: "PHYSICAL_DNI" }, card_id: "64-6449-0064", num_medical_enrollment: "CR-2064064", name: "Mariana Corrales", phone_number: "8864-0064", email: "vitalinkcr2+supplier064@gmail.com", country_iso_code: "CRC", province: "Cartago", city_name: "Tres Ríos", postal_code: "30301", profile_picture_url: "https://vitalink-v2-s3.s3.us-east-2.amazonaws.com/PublicFiles/Dra+23.jpg", description: "Doctora especialista con enfoque en valoración, diagnóstico y seguimiento clínico.", address: "Consultorios Tres Ríos, Cartago", latitude: 9.906800, longitude: -83.987800, experience_years: 10, patients_number: 1605, is_hospital: false, our_history: null, mission: null, vision: null, code_card_id_file: null, code_medical_license_file: null, medical_type: { code: "SPECIALTY_MEDICAL" }, legal_representative: { id: legalRepresentatives[2].id } }, // 64 (Doctora - Dra+23.jpg)
{ id: 65, id_type: { code: "PHYSICAL_DNI" }, card_id: "65-6550-0065", num_medical_enrollment: "CR-2065065", name: "Diego Pacheco", phone_number: "8865-0065", email: "vitalinkcr2+supplier065@gmail.com", country_iso_code: "CRC", province: "Alajuela", city_name: "Alajuela", postal_code: "20106", profile_picture_url: "https://vitalink-v2-s3.s3.us-east-2.amazonaws.com/PublicFiles/Dr+28.png", description: "Especialista con experiencia en procedimientos, control y seguimiento post consulta.", address: "Consultorios Centro, Alajuela", latitude: 10.016100, longitude: -84.210900, experience_years: 12, patients_number: 2200, is_hospital: false, our_history: null, mission: null, vision: null, code_card_id_file: null, code_medical_license_file: null, medical_type: { code: "SPECIALTY_MEDICAL" }, legal_representative: { id: legalRepresentatives[3].id } }, // 65 (Doctor - Dr+28.png)
{ id: 66, id_type: { code: "JURIDICAL_DNI" }, card_id: "J-700066-066", num_medical_enrollment: null, name: "Centro Hospitalario Alajuela - Sede Este", phone_number: "2266-0066", email: "vitalinkcr2+hospital066@gmail.com", country_iso_code: "CRC", province: "Alajuela", city_name: "Alajuela", postal_code: "20107", profile_picture_url: "https://vitalink-v2-s3.s3.us-east-2.amazonaws.com/PublicFiles/hospital.png", description: "Centro hospitalario con atención integral, procedimientos y consulta externa especializada.", address: "Sede Este, Alajuela", latitude: 10.016800, longitude: -84.212200, experience_years: null, patients_number: null, is_hospital: true, our_history: "Institución dedicada a la salud con énfasis en calidad y seguridad del paciente.", mission: "Brindar atención médica segura, oportuna y de alta calidad.", vision: "Ser un centro líder en atención integral a nivel provincial.", code_card_id_file: null, code_medical_license_file: null, medical_type: { code: "SPECIALTY_MEDICAL" }, legal_representative: { id: legalRepresentatives[4].id } }, // 66 (Hospital - hospital.png)
{ id: 67, id_type: { code: "PHYSICAL_DNI" }, card_id: "67-6751-0067", num_medical_enrollment: "CR-2067067", name: "Sebastián Mora", phone_number: "8867-0067", email: "vitalinkcr2+supplier067@gmail.com", country_iso_code: "CRC", province: "San José", city_name: "San José", postal_code: "10108", profile_picture_url: "https://vitalink-v2-s3.s3.us-east-2.amazonaws.com/PublicFiles/Dr+29.png", description: "Especialista con enfoque en evaluación clínica, procedimientos y seguimiento.", address: "Consultorios La Sabana, San José", latitude: 9.933700, longitude: -84.096900, experience_years: 12, patients_number: 2250, is_hospital: false, our_history: null, mission: null, vision: null, code_card_id_file: null, code_medical_license_file: null, medical_type: { code: "SPECIALTY_MEDICAL" }, legal_representative: { id: legalRepresentatives[0].id } }, // 67 (Doctor - Dr+29.png)
{ id: 68, id_type: { code: "PHYSICAL_DNI" }, card_id: "68-6852-0068", num_medical_enrollment: "CR-2068068", name: "Gabriela Pineda", phone_number: "8868-0068", email: "vitalinkcr2+supplier068@gmail.com", country_iso_code: "CRC", province: "Heredia", city_name: "Heredia", postal_code: "40110", profile_picture_url: "https://vitalink-v2-s3.s3.us-east-2.amazonaws.com/PublicFiles/Dra+24.png", description: "Doctora especialista con experiencia en valoración, diagnóstico y seguimiento clínico.", address: "Consultorios Paseo de las Flores, Heredia", latitude: 10.002100, longitude: -84.118700, experience_years: 10, patients_number: 1700, is_hospital: false, our_history: null, mission: null, vision: null, code_card_id_file: null, code_medical_license_file: null, medical_type: { code: "SPECIALTY_MEDICAL" }, legal_representative: { id: legalRepresentatives[1].id } }, // 68 (Doctora - Dra+24.jpg)
{ id: 69, id_type: { code: "PHYSICAL_DNI" }, card_id: "69-6953-0069", num_medical_enrollment: "CR-2069069", name: "Óscar Rojas", phone_number: "8869-0069", email: "vitalinkcr2+supplier069@gmail.com", country_iso_code: "CRC", province: "Cartago", city_name: "Cartago", postal_code: "30108", profile_picture_url: "https://vitalink-v2-s3.s3.us-east-2.amazonaws.com/PublicFiles/Dr+30.png", description: "Especialista con enfoque en procedimientos ambulatorios y control post consulta.", address: "Consultorios Centro, Cartago", latitude: 9.864600, longitude: -83.919900, experience_years: 11, patients_number: 1950, is_hospital: false, our_history: null, mission: null, vision: null, code_card_id_file: null, code_medical_license_file: null, medical_type: { code: "SPECIALTY_MEDICAL" }, legal_representative: { id: legalRepresentatives[2].id } }, // 69 (Doctor - Dr+30.png)
{ id: 70, id_type: { code: "JURIDICAL_DNI" }, card_id: "J-700070-070", num_medical_enrollment: null, name: "Hospital Regional Cartago - Sede Este", phone_number: "2270-0070", email: "vitalinkcr2+hospital070@gmail.com", country_iso_code: "CRC", province: "Cartago", city_name: "Cartago", postal_code: "30109", profile_picture_url: "https://vitalink-v2-s3.s3.us-east-2.amazonaws.com/PublicFiles/hospital.png", description: "Hospital con atención integral, consulta externa y procedimientos especializados.", address: "Sede Este, Cartago", latitude: 9.865200, longitude: -83.917800, experience_years: null, patients_number: null, is_hospital: true, our_history: "Centro hospitalario orientado a la calidad, seguridad del paciente y mejora continua.", mission: "Brindar atención médica segura, oportuna y de alta calidad.", vision: "Ser un referente provincial en servicios hospitalarios especializados.", code_card_id_file: null, code_medical_license_file: null, medical_type: { code: "SPECIALTY_MEDICAL" }, legal_representative: { id: legalRepresentatives[3].id } }, // 70 (Hospital - hospital.png)
{ id: 71, id_type: { code: "PHYSICAL_DNI" }, card_id: "71-7154-0071", num_medical_enrollment: "CR-2071071", name: "Mariana Solano", phone_number: "8871-0071", email: "vitalinkcr2+supplier071@gmail.com", country_iso_code: "CRC", province: "Alajuela", city_name: "Alajuela", postal_code: "20108", profile_picture_url: "https://vitalink-v2-s3.s3.us-east-2.amazonaws.com/PublicFiles/Dra+25.jpg", description: "Doctora especialista con experiencia en valoración y planificación terapéutica.", address: "Consultorios Centro, Alajuela", latitude: 10.016600, longitude: -84.211400, experience_years: 9, patients_number: 1500, is_hospital: false, our_history: null, mission: null, vision: null, code_card_id_file: null, code_medical_license_file: null, medical_type: { code: "SPECIALTY_MEDICAL" }, legal_representative: { id: legalRepresentatives[4].id } }, // 71 (Doctora - Dra+25.jpg)
{ id: 72, id_type: { code: "PHYSICAL_DNI" }, card_id: "72-7255-0072", num_medical_enrollment: "CR-2072072", name: "Andrés Valverde", phone_number: "8872-0072", email: "vitalinkcr2+supplier072@gmail.com", country_iso_code: "CRC", province: "San José", city_name: "Escazú", postal_code: "10204", profile_picture_url: "https://vitalink-v2-s3.s3.us-east-2.amazonaws.com/PublicFiles/Dr+31.png", description: "Especialista con enfoque en diagnóstico y seguimiento clínico.", address: "Consultorios Escazú, San José", latitude: 9.938900, longitude: -84.137900, experience_years: 13, patients_number: 2400, is_hospital: false, our_history: null, mission: null, vision: null, code_card_id_file: null, code_medical_license_file: null, medical_type: { code: "SPECIALTY_MEDICAL" }, legal_representative: { id: legalRepresentatives[0].id } }, // 72 (Doctor - Dr+31.png)
{ id: 73, id_type: { code: "PHYSICAL_DNI" }, card_id: "73-7356-0073", num_medical_enrollment: "CR-2073073", name: "Paola Chaves", phone_number: "8873-0073", email: "vitalinkcr2+supplier073@gmail.com", country_iso_code: "CRC", province: "Puntarenas", city_name: "Puntarenas", postal_code: "60105", profile_picture_url: "https://vitalink-v2-s3.s3.us-east-2.amazonaws.com/PublicFiles/Dra+26.png", description: "Doctora especialista con experiencia en procedimientos y control post consulta.", address: "Centro Médico Costero, Puntarenas", latitude: 9.976100, longitude: -84.839200, experience_years: 10, patients_number: 1600, is_hospital: false, our_history: null, mission: null, vision: null, code_card_id_file: null, code_medical_license_file: null, medical_type: { code: "SPECIALTY_MEDICAL" }, legal_representative: { id: legalRepresentatives[1].id } }, // 73 (Doctora - Dra+26.jpg)
{ id: 74, id_type: { code: "PHYSICAL_DNI" }, card_id: "74-7457-0074", num_medical_enrollment: "CR-2074074", name: "Luis Fernando Méndez", phone_number: "8874-0074", email: "vitalinkcr2+supplier074@gmail.com", country_iso_code: "CRC", province: "San José", city_name: "Guadalupe", postal_code: "10802", profile_picture_url: "https://vitalink-v2-s3.s3.us-east-2.amazonaws.com/PublicFiles/Dr+32.png", description: "Especialista con enfoque en valoración clínica y seguimiento de pacientes.", address: "Clínica Guadalupe, San José", latitude: 9.948600, longitude: -84.058800, experience_years: 9, patients_number: 1450, is_hospital: false, our_history: null, mission: null, vision: null, code_card_id_file: null, code_medical_license_file: null, medical_type: { code: "SPECIALTY_MEDICAL" }, legal_representative: { id: legalRepresentatives[2].id } }, // 74 (Doctor - Dr+32.png)
{ id: 75, id_type: { code: "JURIDICAL_DNI" }, card_id: "J-700075-075", num_medical_enrollment: null, name: "Centro Hospitalario Heredia - Sede Barreal", phone_number: "2275-0075", email: "vitalinkcr2+hospital075@gmail.com", country_iso_code: "CRC", province: "Heredia", city_name: "Heredia", postal_code: "40111", profile_picture_url: "https://vitalink-v2-s3.s3.us-east-2.amazonaws.com/PublicFiles/hospital.png", description: "Centro hospitalario con servicios integrales y apoyo diagnóstico especializado.", address: "Barreal, Heredia", latitude: 10.001400, longitude: -84.110300, experience_years: null, patients_number: null, is_hospital: true, our_history: "Institución enfocada en atención integral con énfasis en seguridad del paciente.", mission: "Brindar salud con excelencia y calidad humana.", vision: "Ser un referente regional por innovación y eficiencia clínica.", code_card_id_file: null, code_medical_license_file: null, medical_type: { code: "SPECIALTY_MEDICAL" }, legal_representative: { id: legalRepresentatives[3].id } }, // 75 (Hospital - hospital.png)
];


const suppliers_part4 = [
{ id: 76, id_type: { code: "PHYSICAL_DNI" }, card_id: "76-7658-0076", num_medical_enrollment: "CR-2076076", name: "Carlos Alberto Sánchez", phone_number: "8876-0076", email: "vitalinkcr2+supplier076@gmail.com", country_iso_code: "CRC", province: "Guanacaste", city_name: "Liberia", postal_code: "50105", profile_picture_url: "https://vitalink-v2-s3.s3.us-east-2.amazonaws.com/PublicFiles/Dr+33.png", description: "Especialista con experiencia en atención clínica, procedimientos y seguimiento.", address: "Centro Médico Liberia, Guanacaste", latitude: 10.633500, longitude: -85.433100, experience_years: 14, patients_number: 2750, is_hospital: false, our_history: null, mission: null, vision: null, code_card_id_file: null, code_medical_license_file: null, medical_type: { code: "SPECIALTY_MEDICAL" }, legal_representative: { id: legalRepresentatives[4].id } }, // 76 (Doctor - Dr+33.png)
{ id: 77, id_type: { code: "PHYSICAL_DNI" }, card_id: "77-7759-0077", num_medical_enrollment: "CR-2077077", name: "Valeria Calderón", phone_number: "8877-0077", email: "vitalinkcr2+supplier077@gmail.com", country_iso_code: "CRC", province: "San José", city_name: "Santa Ana", postal_code: "10904", profile_picture_url: "https://vitalink-v2-s3.s3.us-east-2.amazonaws.com/PublicFiles/Dra+27.png", description: "Doctora especialista con enfoque en diagnóstico, evaluación y seguimiento clínico.", address: "Consultorios City Place, Santa Ana", latitude: 9.936300, longitude: -84.184200, experience_years: 11, patients_number: 1900, is_hospital: false, our_history: null, mission: null, vision: null, code_card_id_file: null, code_medical_license_file: null, medical_type: { code: "SPECIALTY_MEDICAL" }, legal_representative: { id: legalRepresentatives[0].id } }, // 77 (Doctora - Dra+27.jpg)
{ id: 78, id_type: { code: "PHYSICAL_DNI" }, card_id: "78-7860-0078", num_medical_enrollment: "CR-2078078", name: "Ricardo Villalobos", phone_number: "8878-0078", email: "vitalinkcr2+supplier078@gmail.com", country_iso_code: "CRC", province: "Puntarenas", city_name: "Quepos", postal_code: "60605", profile_picture_url: "https://vitalink-v2-s3.s3.us-east-2.amazonaws.com/PublicFiles/Dr+34.png", description: "Especialista con experiencia en procedimientos y control post consulta.", address: "Consultorios Marina, Quepos", latitude: 9.431900, longitude: -84.161700, experience_years: 10, patients_number: 1650, is_hospital: false, our_history: null, mission: null, vision: null, code_card_id_file: null, code_medical_license_file: null, medical_type: { code: "SPECIALTY_MEDICAL" }, legal_representative: { id: legalRepresentatives[1].id } }, // 78 (Doctor - Dr+34.png)
{ id: 79, id_type: { code: "PHYSICAL_DNI" }, card_id: "79-7961-0079", num_medical_enrollment: "CR-2079079", name: "Carolina Ulate", phone_number: "8879-0079", email: "vitalinkcr2+supplier079@gmail.com", country_iso_code: "CRC", province: "Cartago", city_name: "Tres Ríos", postal_code: "30302", profile_picture_url: "https://vitalink-v2-s3.s3.us-east-2.amazonaws.com/PublicFiles/Dra+28.jpg", description: "Doctora especialista con enfoque en valoración clínica y seguimiento.", address: "Consultorios Tres Ríos, Cartago", latitude: 9.907300, longitude: -83.987100, experience_years: 9, patients_number: 1400, is_hospital: false, our_history: null, mission: null, vision: null, code_card_id_file: null, code_medical_license_file: null, medical_type: { code: "SPECIALTY_MEDICAL" }, legal_representative: { id: legalRepresentatives[2].id } }, // 79 (Doctora - Dra+28.jpg)
{ id: 80, id_type: { code: "JURIDICAL_DNI" }, card_id: "J-700080-080", num_medical_enrollment: null, name: "Hospital Regional Guanacaste - Sede Huacas", phone_number: "2280-0080", email: "vitalinkcr2+hospital080@gmail.com", country_iso_code: "CRC", province: "Guanacaste", city_name: "Huacas", postal_code: "50302", profile_picture_url: "https://vitalink-v2-s3.s3.us-east-2.amazonaws.com/PublicFiles/hospital.png", description: "Hospital regional con servicios integrales y atención especializada.", address: "Huacas, Guanacaste", latitude: 10.357600, longitude: -85.796800, experience_years: null, patients_number: null, is_hospital: true, our_history: "Centro hospitalario enfocado en calidad y cobertura regional.", mission: "Brindar atención médica segura, humana y oportuna.", vision: "Ser referente regional en atención hospitalaria especializada.", code_card_id_file: null, code_medical_license_file: null, medical_type: { code: "SPECIALTY_MEDICAL" }, legal_representative: { id: legalRepresentatives[3].id } }, // 80 (Hospital - hospital.png)
{ id: 81, id_type: { code: "PHYSICAL_DNI" }, card_id: "81-8162-0081", num_medical_enrollment: "CR-2081081", name: "Fernando Cordero", phone_number: "8881-0081", email: "vitalinkcr2+supplier081@gmail.com", country_iso_code: "CRC", province: "San José", city_name: "Moravia", postal_code: "11401", profile_picture_url: "https://vitalink-v2-s3.s3.us-east-2.amazonaws.com/PublicFiles/Dr+35.png", description: "Especialista con enfoque en diagnóstico clínico y continuidad de cuidado.", address: "Consultorios Lincoln Plaza, Moravia", latitude: 9.961200, longitude: -84.048800, experience_years: 12, patients_number: 2100, is_hospital: false, our_history: null, mission: null, vision: null, code_card_id_file: null, code_medical_license_file: null, medical_type: { code: "SPECIALTY_MEDICAL" }, legal_representative: { id: legalRepresentatives[4].id } }, // 81 (Doctor - Dr+35.png)
{ id: 82, id_type: { code: "PHYSICAL_DNI" }, card_id: "82-8263-0082", num_medical_enrollment: "CR-2082082", name: "Lucía Fernández", phone_number: "8882-0082", email: "vitalinkcr2+supplier082@gmail.com", country_iso_code: "CRC", province: "San José", city_name: "Curridabat", postal_code: "11805", profile_picture_url: "https://vitalink-v2-s3.s3.us-east-2.amazonaws.com/PublicFiles/Dra+29.png", description: "Doctora especialista con experiencia en valoración y seguimiento post consulta.", address: "Consultorios Pinares, Curridabat", latitude: 9.915800, longitude: -84.030900, experience_years: 10, patients_number: 1680, is_hospital: false, our_history: null, mission: null, vision: null, code_card_id_file: null, code_medical_license_file: null, medical_type: { code: "SPECIALTY_MEDICAL" }, legal_representative: { id: legalRepresentatives[0].id } }, // 82 (Doctora - Dra+29.jpg)
{ id: 83, id_type: { code: "PHYSICAL_DNI" }, card_id: "83-8364-0083", num_medical_enrollment: "CR-2083083", name: "Pablo Alvarado", phone_number: "8883-0083", email: "vitalinkcr2+supplier083@gmail.com", country_iso_code: "CRC", province: "Heredia", city_name: "Heredia", postal_code: "40112", profile_picture_url: "https://vitalink-v2-s3.s3.us-east-2.amazonaws.com/PublicFiles/Dr+36.png", description: "Especialista con enfoque en procedimientos ambulatorios y seguimiento clínico.", address: "Consultorios San Francisco, Heredia", latitude: 9.993900, longitude: -84.118100, experience_years: 13, patients_number: 2350, is_hospital: false, our_history: null, mission: null, vision: null, code_card_id_file: null, code_medical_license_file: null, medical_type: { code: "SPECIALTY_MEDICAL" }, legal_representative: { id: legalRepresentatives[1].id } }, // 83 (Doctor - Dr+36.png)
{ id: 84, id_type: { code: "PHYSICAL_DNI" }, card_id: "84-8465-0084", num_medical_enrollment: "CR-2084084", name: "María Fernanda Ruiz", phone_number: "8884-0084", email: "vitalinkcr2+supplier084@gmail.com", country_iso_code: "CRC", province: "San José", city_name: "San José", postal_code: "10109", profile_picture_url: "https://vitalink-v2-s3.s3.us-east-2.amazonaws.com/PublicFiles/Dra+30.png", description: "Médica general con enfoque en prevención, atención primaria y seguimiento.", address: "Consultorios Barrio Escalante, San José", latitude: 9.934100, longitude: -84.070900, experience_years: 7, patients_number: 1200, is_hospital: false, our_history: null, mission: null, vision: null, code_card_id_file: null, code_medical_license_file: null, medical_type: { code: "GENERAL_MEDICAL" }, legal_representative: { id: legalRepresentatives[2].id } }, // 84 (Doctora - Dra+30.jpg)
{ id: 85, id_type: { code: "PHYSICAL_DNI" }, card_id: "85-8566-0085", num_medical_enrollment: "CR-2085085", name: "Hernán Pacheco", phone_number: "8885-0085", email: "vitalinkcr2+supplier085@gmail.com", country_iso_code: "CRC", province: "San José", city_name: "Lindora", postal_code: "10905", profile_picture_url: "https://vitalink-v2-s3.s3.us-east-2.amazonaws.com/PublicFiles/Dr+37.png", description: "Especialista con experiencia en evaluación, procedimientos y control post consulta.", address: "Consultorios Lindora, San José", latitude: 9.948600, longitude: -84.183900, experience_years: 15, patients_number: 3100, is_hospital: false, our_history: null, mission: null, vision: null, code_card_id_file: null, code_medical_license_file: null, medical_type: { code: "SPECIALTY_MEDICAL" }, legal_representative: { id: legalRepresentatives[3].id } }, // 85 (Doctor - Dr+37.png)
{ id: 86, id_type: { code: "JURIDICAL_DNI" }, card_id: "J-700086-086", num_medical_enrollment: null, name: "Clínica Metropolitana San José - Sede Sur", phone_number: "2286-0086", email: "vitalinkcr2+hospital086@gmail.com", country_iso_code: "CRC", province: "San José", city_name: "Desamparados", postal_code: "10302", profile_picture_url: "https://vitalink-v2-s3.s3.us-east-2.amazonaws.com/PublicFiles/hospital.png", description: "Clínica hospitalaria con atención ambulatoria, diagnósticos y procedimientos especializados.", address: "Sede Sur, Desamparados", latitude: 9.895300, longitude: -84.064100, experience_years: null, patients_number: null, is_hospital: true, our_history: "Centro clínico con trayectoria en atención médica segura y eficiente.", mission: "Ofrecer servicios médicos con calidad, seguridad y trato humano.", vision: "Ser un referente en atención integral dentro del Gran Área Metropolitana.", code_card_id_file: null, code_medical_license_file: null, medical_type: { code: "SPECIALTY_MEDICAL" }, legal_representative: { id: legalRepresentatives[4].id } }, // 86 (Hospital - hospital.png)
{ id: 87, id_type: { code: "PHYSICAL_DNI" }, card_id: "87-8767-0087", num_medical_enrollment: "CR-2087087", name: "Santiago Herrera", phone_number: "8887-0087", email: "vitalinkcr2+supplier087@gmail.com", country_iso_code: "CRC", province: "San José", city_name: "San José", postal_code: "10110", profile_picture_url: "https://vitalink-v2-s3.s3.us-east-2.amazonaws.com/PublicFiles/Dr+38.png", description: "Especialista con enfoque en evaluación clínica, procedimientos y seguimiento.", address: "Consultorios La Sabana, San José", latitude: 9.933900, longitude: -84.094700, experience_years: 13, patients_number: 2450, is_hospital: false, our_history: null, mission: null, vision: null, code_card_id_file: null, code_medical_license_file: null, medical_type: { code: "SPECIALTY_MEDICAL" }, legal_representative: { id: legalRepresentatives[0].id } }, // 87 (Doctor - Dr+38.png)
{ id: 88, id_type: { code: "PHYSICAL_DNI" }, card_id: "88-8868-0088", num_medical_enrollment: "CR-2088088", name: "Laura Brenes", phone_number: "8888-0088", email: "vitalinkcr2+supplier088@gmail.com", country_iso_code: "CRC", province: "Heredia", city_name: "Heredia", postal_code: "40113", profile_picture_url: "https://vitalink-v2-s3.s3.us-east-2.amazonaws.com/PublicFiles/Dra+31.png", description: "Doctora especialista con experiencia en valoración, diagnóstico y seguimiento clínico.", address: "Consultorios San Francisco, Heredia", latitude: 9.996300, longitude: -84.119300, experience_years: 9, patients_number: 1550, is_hospital: false, our_history: null, mission: null, vision: null, code_card_id_file: null, code_medical_license_file: null, medical_type: { code: "SPECIALTY_MEDICAL" }, legal_representative: { id: legalRepresentatives[1].id } }, // 88 (Doctora - Dra+31.jpg)
{ id: 89, id_type: { code: "PHYSICAL_DNI" }, card_id: "89-8969-0089", num_medical_enrollment: "CR-2089089", name: "Mauricio Castillo", phone_number: "8889-0089", email: "vitalinkcr2+supplier089@gmail.com", country_iso_code: "CRC", province: "Cartago", city_name: "Cartago", postal_code: "30110", profile_picture_url: "https://vitalink-v2-s3.s3.us-east-2.amazonaws.com/PublicFiles/Dr+39.png", description: "Especialista con enfoque en procedimientos ambulatorios y control post consulta.", address: "Consultorios Plaza Mayor, Cartago", latitude: 9.864100, longitude: -83.920700, experience_years: 12, patients_number: 2050, is_hospital: false, our_history: null, mission: null, vision: null, code_card_id_file: null, code_medical_license_file: null, medical_type: { code: "SPECIALTY_MEDICAL" }, legal_representative: { id: legalRepresentatives[2].id } }, // 89 (Doctor - Dr+39.png)
{ id: 90, id_type: { code: "JURIDICAL_DNI" }, card_id: "J-700090-090", num_medical_enrollment: null, name: "Hospital Regional San José - Sede Este", phone_number: "2290-0090", email: "vitalinkcr2+hospital090@gmail.com", country_iso_code: "CRC", province: "San José", city_name: "San José", postal_code: "10111", profile_picture_url: "https://vitalink-v2-s3.s3.us-east-2.amazonaws.com/PublicFiles/hospital.png", description: "Hospital con atención integral, consulta externa y soporte diagnóstico especializado.", address: "Sede Este, San José", latitude: 9.934400, longitude: -84.071800, experience_years: null, patients_number: null, is_hospital: true, our_history: "Institución enfocada en calidad, seguridad del paciente y atención integral.", mission: "Brindar atención médica segura, oportuna y de alta calidad.", vision: "Ser un referente nacional en atención hospitalaria y servicios especializados.", code_card_id_file: null, code_medical_license_file: null, medical_type: { code: "SPECIALTY_MEDICAL" }, legal_representative: { id: legalRepresentatives[3].id } }, // 90 (Hospital - hospital.png)
{ id: 91, id_type: { code: "PHYSICAL_DNI" }, card_id: "91-9170-0091", num_medical_enrollment: "CR-2091091", name: "Valeria Monge", phone_number: "8891-0091", email: "vitalinkcr2+supplier091@gmail.com", country_iso_code: "CRC", province: "San José", city_name: "Escazú", postal_code: "10205", profile_picture_url: "https://vitalink-v2-s3.s3.us-east-2.amazonaws.com/PublicFiles/Dra+32.jpg", description: "Doctora especialista con enfoque en diagnóstico, evaluación y seguimiento clínico.", address: "Consultorios Escazú, San José", latitude: 9.938400, longitude: -84.139100, experience_years: 10, patients_number: 1720, is_hospital: false, our_history: null, mission: null, vision: null, code_card_id_file: null, code_medical_license_file: null, medical_type: { code: "SPECIALTY_MEDICAL" }, legal_representative: { id: legalRepresentatives[4].id } }, // 91 (Doctora - Dra+32.jpg)
{ id: 92, id_type: { code: "PHYSICAL_DNI" }, card_id: "92-9271-0092", num_medical_enrollment: "CR-2092092", name: "Jorge Aguilar", phone_number: "8892-0092", email: "vitalinkcr2+supplier092@gmail.com", country_iso_code: "CRC", province: "Puntarenas", city_name: "Puntarenas", postal_code: "60106", profile_picture_url: "https://vitalink-v2-s3.s3.us-east-2.amazonaws.com/PublicFiles/Dr+40.png", description: "Especialista con experiencia en procedimientos y control post consulta.", address: "Consultorios Puntarenas, Puntarenas", latitude: 9.975800, longitude: -84.838900, experience_years: 11, patients_number: 1800, is_hospital: false, our_history: null, mission: null, vision: null, code_card_id_file: null, code_medical_license_file: null, medical_type: { code: "SPECIALTY_MEDICAL" }, legal_representative: { id: legalRepresentatives[0].id } }, // 92 (Doctor - Dr+40.png)
{ id: 93, id_type: { code: "PHYSICAL_DNI" }, card_id: "93-9372-0093", num_medical_enrollment: "CR-2093093", name: "Natalia Vargas", phone_number: "8893-0093", email: "vitalinkcr2+supplier093@gmail.com", country_iso_code: "CRC", province: "Guanacaste", city_name: "Liberia", postal_code: "50106", profile_picture_url: "https://vitalink-v2-s3.s3.us-east-2.amazonaws.com/PublicFiles/Dra+33.png", description: "Doctora especialista con enfoque en valoración clínica y seguimiento.", address: "Centro Médico Liberia, Guanacaste", latitude: 10.633700, longitude: -85.433700, experience_years: 9, patients_number: 1500, is_hospital: false, our_history: null, mission: null, vision: null, code_card_id_file: null, code_medical_license_file: null, medical_type: { code: "SPECIALTY_MEDICAL" }, legal_representative: { id: legalRepresentatives[1].id } }, // 93 (Doctora - Dra+33.jpg)
{ id: 94, id_type: { code: "PHYSICAL_DNI" }, card_id: "94-9473-0094", num_medical_enrollment: "CR-2094094", name: "Mario Quesada", phone_number: "8894-0094", email: "vitalinkcr2+supplier094@gmail.com", country_iso_code: "CRC", province: "San José", city_name: "Moravia", postal_code: "11402", profile_picture_url: "https://vitalink-v2-s3.s3.us-east-2.amazonaws.com/PublicFiles/Dr+1.png", description: "Especialista con experiencia en evaluación clínica y continuidad de cuidado.", address: "Consultorios Lincoln Plaza, Moravia", latitude: 9.961100, longitude: -84.048600, experience_years: 14, patients_number: 2950, is_hospital: false, our_history: null, mission: null, vision: null, code_card_id_file: null, code_medical_license_file: null, medical_type: { code: "SPECIALTY_MEDICAL" }, legal_representative: { id: legalRepresentatives[2].id } }, // 94 (Doctor - Dr+1.png)
{ id: 95, id_type: { code: "JURIDICAL_DNI" }, card_id: "J-700095-095", num_medical_enrollment: null, name: "Centro Hospitalario Puntarenas - Sede Central", phone_number: "2295-0095", email: "vitalinkcr2+hospital095@gmail.com", country_iso_code: "CRC", province: "Puntarenas", city_name: "Puntarenas", postal_code: "60107", profile_picture_url: "https://vitalink-v2-s3.s3.us-east-2.amazonaws.com/PublicFiles/hospital.png", description: "Centro hospitalario con servicios integrales, procedimientos y consulta externa.", address: "Sede Central, Puntarenas", latitude: 9.976500, longitude: -84.839600, experience_years: null, patients_number: null, is_hospital: true, our_history: "Institución con trayectoria en atención clínica y procesos de calidad.", mission: "Ofrecer atención médica segura, humana y oportuna.", vision: "Ser referente regional en servicios hospitalarios integrales.", code_card_id_file: null, code_medical_license_file: null, medical_type: { code: "SPECIALTY_MEDICAL" }, legal_representative: { id: legalRepresentatives[3].id } }, // 95 (Hospital - hospital.png)
{ id: 96, id_type: { code: "PHYSICAL_DNI" }, card_id: "96-9674-0096", num_medical_enrollment: "CR-2096096", name: "Daniela Sequeira", phone_number: "8896-0096", email: "vitalinkcr2+supplier096@gmail.com", country_iso_code: "CRC", province: "San José", city_name: "Santa Ana", postal_code: "10906", profile_picture_url: "https://vitalink-v2-s3.s3.us-east-2.amazonaws.com/PublicFiles/Dra+34.png", description: "Doctora especialista con experiencia en valoración, diagnóstico y seguimiento.", address: "Consultorios City Place, Santa Ana", latitude: 9.936600, longitude: -84.183800, experience_years: 10, patients_number: 1680, is_hospital: false, our_history: null, mission: null, vision: null, code_card_id_file: null, code_medical_license_file: null, medical_type: { code: "SPECIALTY_MEDICAL" }, legal_representative: { id: legalRepresentatives[4].id } }, // 96 (Doctora - Dra+34.jpg)
{ id: 97, id_type: { code: "PHYSICAL_DNI" }, card_id: "97-9775-0097", num_medical_enrollment: "CR-2097097", name: "Luis Diego Sánchez", phone_number: "8897-0097", email: "vitalinkcr2+supplier097@gmail.com", country_iso_code: "CRC", province: "Alajuela", city_name: "Alajuela", postal_code: "20109", profile_picture_url: "https://vitalink-v2-s3.s3.us-east-2.amazonaws.com/PublicFiles/Dr+2.png", description: "Médico general con enfoque en atención primaria, prevención y seguimiento.", address: "Consultorios Centro, Alajuela", latitude: 10.016900, longitude: -84.211100, experience_years: 7, patients_number: 1150, is_hospital: false, our_history: null, mission: null, vision: null, code_card_id_file: null, code_medical_license_file: null, medical_type: { code: "GENERAL_MEDICAL" }, legal_representative: { id: legalRepresentatives[0].id } }, // 97 (Doctor - Dr+2.png)
{ id: 98, id_type: { code: "JURIDICAL_DNI" }, card_id: "J-700098-098", num_medical_enrollment: null, name: "Hospital Regional Guanacaste - Sede Liberia", phone_number: "2298-0098", email: "vitalinkcr2+hospital098@gmail.com", country_iso_code: "CRC", province: "Guanacaste", city_name: "Liberia", postal_code: "50107", profile_picture_url: "https://vitalink-v2-s3.s3.us-east-2.amazonaws.com/PublicFiles/hospital.png", description: "Hospital regional con servicios integrales, diagnóstico y atención especializada.", address: "Sede Liberia, Guanacaste", latitude: 10.633200, longitude: -85.433400, experience_years: null, patients_number: null, is_hospital: true, our_history: "Centro hospitalario enfocado en cobertura regional y mejora continua.", mission: "Brindar atención médica segura, humana y oportuna.", vision: "Ser referente regional en atención hospitalaria y servicios especializados.", code_card_id_file: null, code_medical_license_file: null, medical_type: { code: "SPECIALTY_MEDICAL" }, legal_representative: { id: legalRepresentatives[1].id } }, // 98 (Hospital - hospital.png)
{ id: 99, id_type: { code: "PHYSICAL_DNI" }, card_id: "99-9976-0099", num_medical_enrollment: "CR-2099099", name: "María Paula Rojas", phone_number: "8899-0099", email: "vitalinkcr2+supplier099@gmail.com", country_iso_code: "CRC", province: "San José", city_name: "San José", postal_code: "10112", profile_picture_url: "https://vitalink-v2-s3.s3.us-east-2.amazonaws.com/PublicFiles/Dra+35.png", description: "Doctora especialista con enfoque en evaluación clínica y seguimiento post consulta.", address: "Consultorios Barrio Escalante, San José", latitude: 9.934000, longitude: -84.070600, experience_years: 11, patients_number: 1850, is_hospital: false, our_history: null, mission: null, vision: null, code_card_id_file: null, code_medical_license_file: null, medical_type: { code: "SPECIALTY_MEDICAL" }, legal_representative: { id: legalRepresentatives[2].id } }, // 99 (Doctora - Dra+35.jpg)
{ id: 100, id_type: { code: "JURIDICAL_DNI" }, card_id: "J-700100-100", num_medical_enrollment: null, name: "Centro Hospitalario Heredia - Sede Oeste", phone_number: "2300-0100", email: "vitalinkcr2+hospital100@gmail.com", country_iso_code: "CRC", province: "Heredia", city_name: "Heredia", postal_code: "40114", profile_picture_url: "https://vitalink-v2-s3.s3.us-east-2.amazonaws.com/PublicFiles/hospital.png", description: "Centro hospitalario con consulta externa, procedimientos y apoyo diagnóstico.", address: "Sede Oeste, Heredia", latitude: 9.998900, longitude: -84.121700, experience_years: null, patients_number: null, is_hospital: true, our_history: "Institución con enfoque en calidad clínica, seguridad del paciente y eficiencia.", mission: "Brindar atención médica segura, oportuna y con trato humano.", vision: "Ser un referente regional en servicios hospitalarios integrales e innovación.", code_card_id_file: null, code_medical_license_file: null, medical_type: { code: "SPECIALTY_MEDICAL" }, legal_representative: { id: legalRepresentatives[3].id } }, // 100 (Hospital - hospital.png)
];


// Insertamos los proveedores en la base de datos
await supplierRepository.upsert(suppliers_part1, ["card_id"]);
await supplierRepository.upsert(suppliers_part2, ["card_id"]);
await supplierRepository.upsert(suppliers_part3, ["card_id"]);
await supplierRepository.upsert(suppliers_part4, ["card_id"]);

  







        //*************************************** */
        //              SpecialtyBySupplier
        //*************************************** */
const specialtyRepository = dataSource.getRepository(SpecialtyBySupplier);

// Asignamos especialidades a cada proveedor (médicos y hospitales)
const specialties = [
    // Médicos individuales
    { id: 1, supplier: { id: 1 }, medical_specialty: { code: "CARDIOLOGY" } }, // Alejandro Vargas (Cirujano Cardiovascular)
    { id: 2, supplier: { id: 2 }, medical_specialty: { code: "DERMATOLOGY" } }, // Sofía Araya (Dermatóloga)
    { id: 3, supplier: { id: 3 }, medical_specialty: { code: "NEUROLOGY" } }, // Fernando López (Médico General)

    // Hospitales con múltiples especialidades
    { id: 4, supplier: { id: 4 }, medical_specialty: { code: "CARDIOLOGY" } }, // Hospital Clínica Santa Fe (Cardiología)
    { id: 5, supplier: { id: 4 }, medical_specialty: { code: "GENERAL_SURGERY" } }, // Hospital Clínica Santa Fe (Cirugía General)
    { id: 6, supplier: { id: 4 }, medical_specialty: { code: "PEDIATRICS" } }, // Hospital Clínica Santa Fe (Pediatría)
    
    { id: 7, supplier: { id: 5 }, medical_specialty: { code: "GASTROENTEROLOGY" } }, // Centro Médico del Pacífico (Gastroenterología)
    { id: 8, supplier: { id: 5 }, medical_specialty: { code: "DERMATOLOGY" } }, // Centro Médico del Pacífico (Dermatología)
    { id: 9, supplier: { id: 5 }, medical_specialty: { code: "ORTHOPEDICS_AND_TRAUMATOLOGY" } }, // Centro Médico del Pacífico (Ortopedia)

    { id: 10, supplier: { id: 6 }, medical_specialty: { code: "OPHTHALMOLOGY" } },


      { id: 11, supplier: { id: 7 },  medical_specialty: { code: "CARDIOLOGY" } },
    { id: 12, supplier: { id: 8 },  medical_specialty: { code: "DERMATOLOGY" } },
    { id: 13, supplier: { id: 9 },  medical_specialty: { code: "FAMILY_AND_COMMUNITY_MEDICINE" } },
    { id: 14, supplier: { id: 10 }, medical_specialty: { code: "ENDOCRINOLOGY" } },
    { id: 15, supplier: { id: 11 }, medical_specialty: { code: "GASTROENTEROLOGY" } },
    { id: 16, supplier: { id: 12 }, medical_specialty: { code: "INTERNAL_MEDICINE" } },
    { id: 17, supplier: { id: 13 }, medical_specialty: { code: "ORTHOPEDICS_AND_TRAUMATOLOGY" } },
    { id: 18, supplier: { id: 14 }, medical_specialty: { code: "PEDIATRICS" } },
    { id: 19, supplier: { id: 15 }, medical_specialty: { code: "EMERGENCY_MEDICINE" } },
    { id: 20, supplier: { id: 16 }, medical_specialty: { code: "OPHTHALMOLOGY" } },
    { id: 21, supplier: { id: 17 }, medical_specialty: { code: "UROLOGY" } },
    { id: 22, supplier: { id: 18 }, medical_specialty: { code: "CARDIOLOGY" } }, // hospital
    { id: 23, supplier: { id: 19 }, medical_specialty: { code: "GENERAL_SURGERY" } }, // hospital
    { id: 24, supplier: { id: 20 }, medical_specialty: { code: "RADIOLOGY_AND_MEDICAL_IMAGING" } }, // hospital
    { id: 25, supplier: { id: 21 }, medical_specialty: { code: "FAMILY_AND_COMMUNITY_MEDICINE" } },
    { id: 26, supplier: { id: 22 }, medical_specialty: { code: "NEUROLOGY" } },
    { id: 27, supplier: { id: 23 }, medical_specialty: { code: "PULMONOLOGY" } },
    { id: 28, supplier: { id: 24 }, medical_specialty: { code: "PREVENTIVE_MEDICINE_AND_PUBLIC_HEALTH" } },
    { id: 29, supplier: { id: 25 }, medical_specialty: { code: "RHEUMATOLOGY" } },
    { id: 30, supplier: { id: 26 }, medical_specialty: { code: "OTORHINOLARYNGOLOGY" } },
    { id: 31, supplier: { id: 27 }, medical_specialty: { code: "CARDIOLOGY" } },
    { id: 32, supplier: { id: 28 }, medical_specialty: { code: "DERMATOLOGY" } },
    { id: 33, supplier: { id: 29 }, medical_specialty: { code: "GASTROENTEROLOGY" } },
    { id: 34, supplier: { id: 30 }, medical_specialty: { code: "OPHTHALMOLOGY" } },
    { id: 35, supplier: { id: 31 }, medical_specialty: { code: "ORTHOPEDICS_AND_TRAUMATOLOGY" } },
    { id: 36, supplier: { id: 32 }, medical_specialty: { code: "NEUROLOGY" } },
    { id: 37, supplier: { id: 33 }, medical_specialty: { code: "ENDOCRINOLOGY" } },
    { id: 38, supplier: { id: 34 }, medical_specialty: { code: "PULMONOLOGY" } },
    { id: 39, supplier: { id: 35 }, medical_specialty: { code: "UROLOGY" } },
    { id: 40, supplier: { id: 36 }, medical_specialty: { code: "GYNECOLOGY_AND_OBSTETRICS" } },
    { id: 41, supplier: { id: 37 }, medical_specialty: { code: "PEDIATRICS" } },
    { id: 42, supplier: { id: 38 }, medical_specialty: { code: "PSYCHIATRY" } },
    { id: 43, supplier: { id: 39 }, medical_specialty: { code: "RHEUMATOLOGY" } },
    { id: 44, supplier: { id: 40 }, medical_specialty: { code: "OTORHINOLARYNGOLOGY" } },
    { id: 45, supplier: { id: 41 }, medical_specialty: { code: "RADIOLOGY_AND_MEDICAL_IMAGING" } },
    { id: 46, supplier: { id: 42 }, medical_specialty: { code: "INTERNAL_MEDICINE" } },
    { id: 47, supplier: { id: 43 }, medical_specialty: { code: "EMERGENCY_MEDICINE" } },
    { id: 48, supplier: { id: 44 }, medical_specialty: { code: "SPORTS_MEDICINE" } },
    { id: 49, supplier: { id: 45 }, medical_specialty: { code: "CLINICAL_NUTRITION" } },
    { id: 50, supplier: { id: 46 }, medical_specialty: { code: "INFECTOLOGY" } },
    // Supplier 47 (3 specialties - coherent: cardio + internal + critical care)
    { id: 51, supplier: { id: 47 }, medical_specialty: { code: "CARDIOLOGY" } },
    { id: 52, supplier: { id: 47 }, medical_specialty: { code: "INTERNAL_MEDICINE" } },
    { id: 53, supplier: { id: 47 }, medical_specialty: { code: "CRITICAL_CARE_AND_INTENSIVE_THERAPY" } },

    // Supplier 48..51 (single specialties)
    { id: 54, supplier: { id: 48 }, medical_specialty: { code: "DERMATOLOGY" } },
    { id: 55, supplier: { id: 49 }, medical_specialty: { code: "GASTROENTEROLOGY" } },
    { id: 56, supplier: { id: 50 }, medical_specialty: { code: "OPHTHALMOLOGY" } },
    { id: 57, supplier: { id: 51 }, medical_specialty: { code: "UROLOGY" } },

    // Supplier 52 (3 specialties - coherent: ortho + sports + rehab)
    { id: 58, supplier: { id: 52 }, medical_specialty: { code: "ORTHOPEDICS_AND_TRAUMATOLOGY" } },
    { id: 59, supplier: { id: 52 }, medical_specialty: { code: "SPORTS_MEDICINE" } },
    { id: 60, supplier: { id: 52 }, medical_specialty: { code: "PHYSICAL_MEDICINE_AND_REHABILITATION" } },

    // Supplier 53..57 (single specialties)
    { id: 61, supplier: { id: 53 }, medical_specialty: { code: "GYNECOLOGY_AND_OBSTETRICS" } },
    { id: 62, supplier: { id: 54 }, medical_specialty: { code: "PEDIATRICS" } },
    { id: 63, supplier: { id: 55 }, medical_specialty: { code: "RADIOLOGY_AND_MEDICAL_IMAGING" } },
    { id: 64, supplier: { id: 56 }, medical_specialty: { code: "OTORHINOLARYNGOLOGY" } },
    { id: 65, supplier: { id: 57 }, medical_specialty: { code: "ENDOCRINOLOGY" } },

    // Supplier 58 (3 specialties - coherent oncology group / hospital)
    { id: 66, supplier: { id: 58 }, medical_specialty: { code: "MEDICAL_ONCOLOGY" } },
    { id: 67, supplier: { id: 58 }, medical_specialty: { code: "RADIATION_ONCOLOGY" } },
    { id: 68, supplier: { id: 58 }, medical_specialty: { code: "SURGICAL_ONCOLOGY" } },

    // Supplier 59..60 (single specialties)
    { id: 69, supplier: { id: 59 }, medical_specialty: { code: "NEUROLOGY" } },
    { id: 70, supplier: { id: 60 }, medical_specialty: { code: "PULMONOLOGY" } },

    // Supplier 61 (2 specialties - coherent: internal + endocrine)
  { id: 71, supplier: { id: 61 }, medical_specialty: { code: "INTERNAL_MEDICINE" } },
  { id: 72, supplier: { id: 61 }, medical_specialty: { code: "ENDOCRINOLOGY" } },

  // Singles
  { id: 73, supplier: { id: 62 }, medical_specialty: { code: "DERMATOLOGY" } },
  { id: 74, supplier: { id: 63 }, medical_specialty: { code: "OPHTHALMOLOGY" } },
  { id: 75, supplier: { id: 64 }, medical_specialty: { code: "CARDIOLOGY" } },

  // Supplier 65 (2 specialties - coherent: gastro + internal)
  { id: 76, supplier: { id: 65 }, medical_specialty: { code: "GASTROENTEROLOGY" } },
  { id: 77, supplier: { id: 65 }, medical_specialty: { code: "INTERNAL_MEDICINE" } },

  // Singles
  { id: 78, supplier: { id: 66 }, medical_specialty: { code: "ORTHOPEDICS_AND_TRAUMATOLOGY" } },
  { id: 79, supplier: { id: 67 }, medical_specialty: { code: "OTORHINOLARYNGOLOGY" } },
  { id: 80, supplier: { id: 68 }, medical_specialty: { code: "PEDIATRICS" } },
  { id: 81, supplier: { id: 69 }, medical_specialty: { code: "UROLOGY" } },

  // Supplier 70 (2 specialties - coherent for hospital: surgery + anesthesia)
  { id: 82, supplier: { id: 70 }, medical_specialty: { code: "GENERAL_SURGERY" } },
  { id: 83, supplier: { id: 70 }, medical_specialty: { code: "ANESTHESIOLOGY_AND_RECOVERY" } },

  // Singles
  { id: 84, supplier: { id: 71 }, medical_specialty: { code: "RADIOLOGY_AND_MEDICAL_IMAGING" } },

  // Supplier 72 (2 specialties - coherent: gyn + endocrine)
  { id: 85, supplier: { id: 72 }, medical_specialty: { code: "GYNECOLOGY_AND_OBSTETRICS" } },
  { id: 86, supplier: { id: 72 }, medical_specialty: { code: "ENDOCRINOLOGY" } },

  // Singles
  { id: 87, supplier: { id: 73 }, medical_specialty: { code: "PULMONOLOGY" } },
  { id: 88, supplier: { id: 74 }, medical_specialty: { code: "INFECTOLOGY" } },
  { id: 89, supplier: { id: 75 }, medical_specialty: { code: "RHEUMATOLOGY" } },
  { id: 90, supplier: { id: 76 }, medical_specialty: { code: "NEUROLOGY" } },


  { id: 91,  supplier: { id: 77 },  medical_specialty: { code: "FAMILY_AND_COMMUNITY_MEDICINE" } },
  { id: 92,  supplier: { id: 78 },  medical_specialty: { code: "DERMATOLOGY" } },
  { id: 93,  supplier: { id: 79 },  medical_specialty: { code: "CARDIOLOGY" } },
  { id: 94,  supplier: { id: 80 },  medical_specialty: { code: "OPHTHALMOLOGY" } },
  { id: 95,  supplier: { id: 81 },  medical_specialty: { code: "ORTHOPEDICS_AND_TRAUMATOLOGY" } },
  { id: 96,  supplier: { id: 82 },  medical_specialty: { code: "GASTROENTEROLOGY" } },
  { id: 97,  supplier: { id: 83 },  medical_specialty: { code: "ENDOCRINOLOGY" } },
  { id: 98,  supplier: { id: 84 },  medical_specialty: { code: "UROLOGY" } },
  { id: 99,  supplier: { id: 85 },  medical_specialty: { code: "NEUROLOGY" } },
  { id: 100, supplier: { id: 86 },  medical_specialty: { code: "OTORHINOLARYNGOLOGY" } },

  { id: 101, supplier: { id: 87 },  medical_specialty: { code: "CARDIOLOGY" } },
  { id: 102, supplier: { id: 88 },  medical_specialty: { code: "DERMATOLOGY" } },
  { id: 103, supplier: { id: 89 },  medical_specialty: { code: "GASTROENTEROLOGY" } },
  { id: 104, supplier: { id: 90 },  medical_specialty: { code: "GENERAL_SURGERY" } }, // hospital

  { id: 105, supplier: { id: 91 },  medical_specialty: { code: "ENDOCRINOLOGY" } },
  { id: 106, supplier: { id: 92 },  medical_specialty: { code: "EMERGENCY_MEDICINE" } },
  { id: 107, supplier: { id: 93 },  medical_specialty: { code: "GYNECOLOGY_AND_OBSTETRICS" } },
  { id: 108, supplier: { id: 94 },  medical_specialty: { code: "ORTHOPEDICS_AND_TRAUMATOLOGY" } },

  { id: 109, supplier: { id: 95 },  medical_specialty: { code: "GENERAL_SURGERY" } }, // hospital
  { id: 110, supplier: { id: 96 },  medical_specialty: { code: "DERMATOLOGY" } },
  { id: 111, supplier: { id: 97 },  medical_specialty: { code: "FAMILY_AND_COMMUNITY_MEDICINE" } }, // GENERAL_MEDICAL safe

  { id: 112, supplier: { id: 98 },  medical_specialty: { code: "PEDIATRICS" } }, // hospital
  { id: 113, supplier: { id: 99 },  medical_specialty: { code: "INTERNAL_MEDICINE" } },
  { id: 114, supplier: { id: 100 }, medical_specialty: { code: "CARDIOLOGY" } }, // hospital
];

await specialtyRepository.upsert(specialties, ["id"]);






//*************************************** */
//              Packages
//*************************************** */
const packageRepository = dataSource.getRepository(Package);

const packages = [
{ id: 1, specialty: { id: 2 }, procedure: { code: "REFRACTIVE_SURGERY" }, product: { code: "REFRACTIVE_PRK" }, discount: 10, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["GENERAL_ANESTHESIA", "POSTOP_ULTRASOUND", "POSTOP_PHYSIOTHERAPY"] }, is_king: false, observations: "", is_deleted: false },
{ id: 2, specialty: { id: 2 }, procedure: { code: "REFRACTIVE_SURGERY" }, product: { code: "REFRACTIVE_LASIK" }, discount: 5, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["GENERAL_ANESTHESIA", "POSTOP_CT", "POSTOP_PAIN_CONTROL"] }, is_king: false, observations: "", is_deleted: false },
{ id: 3, specialty: { id: 2 }, procedure: { code: "REFRACTIVE_SURGERY" }, product: { code: "REFRACTIVE_LASIK_GUIDED" }, discount: 8, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["REGIONAL_ANESTHESIA", "POSTOP_XRAY", "POSTOP_SURGEON_FOLLOWUP"] }, is_king: false, observations: "", is_deleted: false },
{ id: 4, specialty: { id: 1 }, procedure: { code: "CARDIO_INTERVENTION" }, product: { code: "CARDIO_STENT" }, discount: 7.5, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["GENERAL_ANESTHESIA", "SURGICAL_RISK_ASSESSMENT", "POSTOP_PHYSIOTHERAPY"] }, is_king: false, observations: "", is_deleted: false },
{ id: 5, specialty: { id: 1 }, procedure: { code: "CARDIO_INTERVENTION" }, product: { code: "CARDIO_BYPASS" }, discount: 15, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["GENERAL_ANESTHESIA", "POSTOP_CT", "POSTOP_PAIN_CONTROL"] }, is_king: false, observations: "", is_deleted: false },
{ id: 6, specialty: { id: 7 }, procedure: { code: "GASTRO_ENDOSCOPY" }, product: { code: "GASTRO_COLONOSCOPY" }, discount: 5, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["PREOPERATIVE_ASSESSMENT", "POSTOP_ULTRASOUND"] }, is_king: false, observations: "", is_deleted: false },
{ id: 7, specialty: { id: 7 }, procedure: { code: "GASTRO_ENDOSCOPY" }, product: { code: "GASTRO_GASTROSCOPY" }, discount: 4, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["PREOPERATIVE_ASSESSMENT", "POSTOP_MEDICATIONS"] }, is_king: false, observations: "", is_deleted: false },
{ id: 8, specialty: { id: 9 }, procedure: { code: "ORTHO_KNEE_SURGERY" }, product: { code: "ORTHO_KNEE_REPLACEMENT" }, discount: 12, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["GENERAL_ANESTHESIA", "POSTOP_REHAB", "POSTOP_PHYSIOTHERAPY"] }, is_king: false, observations: "", is_deleted: false },
{ id: 9, specialty: { id: 9 }, procedure: { code: "ORTHO_KNEE_SURGERY" }, product: { code: "ORTHO_ACL_SURGERY" }, discount: 10, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["PREOPERATIVE_ASSESSMENT", "POSTOP_REHAB"] }, is_king: false, observations: "", is_deleted: false },
{ id: 10, specialty: { id: 9 }, procedure: { code: "ORTHO_SHOULDER_SURGERY" }, product: { code: "ORTHO_ROTATOR_CUFF" }, discount: 8, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["GENERAL_ANESTHESIA", "POSTOP_PHYSIOTHERAPY"] }, is_king: false, observations: "", is_deleted: false },
{ id: 11, specialty: { id: 9 }, procedure: { code: "ORTHO_SHOULDER_SURGERY" }, product: { code: "ORTHO_SHOULDER_DISLOCATION" }, discount: 9, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["GENERAL_ANESTHESIA", "POSTOP_SURGEON_FOLLOWUP"] }, is_king: false, observations: "", is_deleted: false },
{ id: 15, specialty: { id: 10 }, procedure: { code: "CATARACT_SURGERY" }, product: { code: "LIO_MONOFOCAL" }, discount: 5, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["MEDICAL_SPENDING", "POSTOP_APPOINTMENT", "POSTOP_MEDICAL"] }, is_king: false, observations: "", is_deleted: false },
{ id: 16, specialty: { id: 10 }, procedure: { code: "CATARACT_SURGERY" }, product: { code: "LIO_MULTIFOCAL" }, discount: 0, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["MEDICAL_SPENDING", "POSTOP_APPOINTMENT", "POSTOP_MEDICAL"] }, is_king: false, observations: "", is_deleted: false },
{ id: 17, specialty: { id: 10 }, procedure: { code: "REFRACTIVE_SURGERY" }, product: { code: "REFRACTIVE_PRK" }, discount: 0, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["MEDICAL_SPENDING", "POSTOP_APPOINTMENT", "POSTOP_MEDICAL"] }, is_king: false, observations: "", is_deleted: false },
{ id: 18, specialty: { id: 10 }, procedure: { code: "REFRACTIVE_SURGERY" }, product: { code: "REFRACTIVE_LASIK" }, discount: 0, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["MEDICAL_SPENDING", "POSTOP_APPOINTMENT", "POSTOP_MEDICAL"] }, is_king: false, observations: "", is_deleted: false },
{ id: 19, specialty: { id: 10 }, procedure: { code: "REFRACTIVE_SURGERY" }, product: { code: "REFRACTIVE_LASIK_GUIDED" }, discount: 0, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: [] }, is_king: false, observations: "", is_deleted: false },

{ id: 20, specialty: { id: 3 }, procedure: { code: "EPILEPSY_TREATMENT" }, product: { code: "VAGUS_NERVE_STIMULATION" }, discount: 6, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["PRE_SURGERY_ANESTHESIA", "SURGICAL_RISK_ASSESSMENT", "POSTOP_PAIN_CONTROL"] }, is_king: false, observations: "", is_deleted: false },
{ id: 21, specialty: { id: 4 }, procedure: { code: "PACEMAKER_IMPLANT" }, product: { code: "PACEMAKER_DUAL" }, discount: 8, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["GENERAL_ANESTHESIA", "VITAL_MONITORS", "POSTOP_SURGEON_FOLLOWUP"] }, is_king: false, observations: "", is_deleted: false },
{ id: 22, specialty: { id: 5 }, procedure: { code: "GASTRO_ENDOSCOPY" }, product: { code: "GASTRO_GASTROSCOPY" }, discount: 3.5, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["GENERAL_PRE_SURGERY_EVAL", "IV_FLUIDS", "POSTOP_ULTRASOUND"] }, is_king: false, observations: "", is_deleted: false },
{ id: 23, specialty: { id: 6 }, procedure: { code: "GASTRO_ENDOSCOPY" }, product: { code: "GASTRO_COLONOSCOPY" }, discount: 4, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["GENERAL_PRE_SURGERY_EVAL", "PRE_SURGERY_LAB_TESTS", "POSTOP_ANALGESICS"] }, is_king: false, observations: "", is_deleted: false },
{ id: 24, specialty: { id: 8 }, procedure: { code: "GASTRO_ULCER_TREATMENT" }, product: { code: "GASTRO_PPI_THERAPY" }, discount: 2, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["GENERAL_PRE_SURGERY_EVAL", "POSTOP_MEDICAL", "POSTOP_APPOINTMENT"] }, is_king: false, observations: "", is_deleted: false },

{ id: 25, specialty: { id: 11 }, procedure: { code: "CARDIO_INTERVENTION" }, product: { code: "CARDIO_STENT" }, discount: 6.25, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["GENERAL_ANESTHESIA", "SURGICAL_RISK_ASSESSMENT", "POSTOP_CT"] }, is_king: false, observations: "", is_deleted: false },
{ id: 26, specialty: { id: 12 }, procedure: { code: "ORTHO_SHOULDER_SURGERY" }, product: { code: "ORTHO_ROTATOR_CUFF" }, discount: 7, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["GENERAL_ANESTHESIA", "POSTOP_REHAB", "POSTOP_PHYSIOTHERAPY"] }, is_king: false, observations: "", is_deleted: false },
{ id: 27, specialty: { id: 13 }, procedure: { code: "CATARACT_SURGERY" }, product: { code: "LIO_MONOFOCAL" }, discount: 4.5, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["GENERAL_ANESTHESIA", "POSTOP_XRAY", "POSTOP_APPOINTMENT"] }, is_king: false, observations: "", is_deleted: false },
{ id: 28, specialty: { id: 14 }, procedure: { code: "ORTHO_KNEE_SURGERY" }, product: { code: "ORTHO_ACL_SURGERY" }, discount: 6, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["PRE_SURGERY_LAB_TESTS", "GENERAL_ANESTHESIA", "POSTOP_REHAB"] }, is_king: false, observations: "", is_deleted: false },
{ id: 29, specialty: { id: 15 }, procedure: { code: "PARKINSON_TREATMENT" }, product: { code: "DEEP_BRAIN_STIMULATION" }, discount: 9, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["PRE_SURGERY_ECG", "GENERAL_ANESTHESIA", "POSTOP_SURGEON_FOLLOWUP"] }, is_king: false, observations: "", is_deleted: false },

{ id: 30, specialty: { id: 16 }, procedure: { code: "INFERTILITY_TREATMENT" }, product: { code: "IVF" }, discount: 5, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["GENERAL_PRE_SURGERY_EVAL", "PRE_SURGERY_LAB_TESTS", "POSTOP_APPOINTMENT"] }, is_king: false, observations: "", is_deleted: false },
{ id: 31, specialty: { id: 17 }, procedure: { code: "ENDOMETRIOSIS_SURGERY" }, product: { code: "ENDOMETRIOSIS_LAPAROSCOPY" }, discount: 6.5, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["GENERAL_ANESTHESIA", "STERILE_SURGICAL_EQUIPMENT", "POSTOP_PAIN_CONTROL"] }, is_king: false, observations: "", is_deleted: false },
{ id: 32, specialty: { id: 18 }, procedure: { code: "BREAST_CANCER_TREATMENT" }, product: { code: "MASTECTOMY_RADICAL" }, discount: 7.5, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["SURGICAL_RISK_ASSESSMENT", "GENERAL_ANESTHESIA", "POSTOP_ANTIBIOTICS"] }, is_king: false, observations: "", is_deleted: false },
{ id: 33, specialty: { id: 19 }, procedure: { code: "LUNG_CANCER_TREATMENT" }, product: { code: "LUNG_TARGETED_THERAPY" }, discount: 4, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["GENERAL_PRE_SURGERY_EVAL", "POSTOP_MEDICAL", "POSTOP_APPOINTMENT"] }, is_king: false, observations: "", is_deleted: false },
{ id: 34, specialty: { id: 20 }, procedure: { code: "PACEMAKER_IMPLANT" }, product: { code: "PACEMAKER_SINGLE" }, discount: 6, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["PRE_SURGERY_ECG", "GENERAL_ANESTHESIA", "POSTOP_SURGEON_FOLLOWUP"] }, is_king: false, observations: "", is_deleted: false },

{ id: 35, specialty: { id: 21 }, procedure: { code: "GASTRO_ULCER_TREATMENT" }, product: { code: "GASTRO_H_PYLORI" }, discount: 3, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["GENERAL_PRE_SURGERY_EVAL", "POSTOP_MEDICATIONS", "POSTOP_ANALGESICS"] }, is_king: false, observations: "", is_deleted: false },
{ id: 36, specialty: { id: 22 }, procedure: { code: "REFRACTIVE_SURGERY" }, product: { code: "REFRACTIVE_FEMOTOLASIK" }, discount: 7, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["GENERAL_ANESTHESIA", "POSTOP_ULTRASOUND", "POSTOP_APPOINTMENT"] }, is_king: false, observations: "", is_deleted: false },
{ id: 37, specialty: { id: 23 }, procedure: { code: "ORTHO_KNEE_SURGERY" }, product: { code: "ORTHO_KNEE_REPLACEMENT" }, discount: 10, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["SURGICAL_RISK_ASSESSMENT", "GENERAL_ANESTHESIA", "POSTOP_PHYSIOTHERAPY"] }, is_king: false, observations: "", is_deleted: false },
{ id: 38, specialty: { id: 24 }, procedure: { code: "CARDIO_INTERVENTION" }, product: { code: "CARDIO_CATH" }, discount: 4.25, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["PRE_SURGERY_ECG", "IV_FLUIDS", "POSTOP_ULTRASOUND"] }, is_king: false, observations: "", is_deleted: false },
{ id: 39, specialty: { id: 25 }, procedure: { code: "EPILEPSY_TREATMENT" }, product: { code: "EPILEPSY_SURGERY" }, discount: 8.5, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["SURGICAL_RISK_ASSESSMENT", "GENERAL_ANESTHESIA", "POSTOP_CT"] }, is_king: false, observations: "", is_deleted: false },

{ id: 40, specialty: { id: 26 }, procedure: { code: "CARDIO_INTERVENTION" }, product: { code: "CARDIO_BYPASS" }, discount: 12.5, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["SURGICAL_RISK_ASSESSMENT", "GENERAL_ANESTHESIA", "POSTOP_CT"] }, is_king: false, observations: "", is_deleted: false },
{ id: 41, specialty: { id: 27 }, procedure: { code: "PACEMAKER_IMPLANT" }, product: { code: "PACEMAKER_DUAL" }, discount: 7.25, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["PRE_SURGERY_ECG", "VITAL_MONITORS", "POSTOP_SURGEON_FOLLOWUP"] }, is_king: false, observations: "", is_deleted: false },
{ id: 42, specialty: { id: 28 }, procedure: { code: "GASTRO_ENDOSCOPY" }, product: { code: "GASTRO_COLONOSCOPY" }, discount: 4.75, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["GENERAL_PRE_SURGERY_EVAL", "IV_FLUIDS", "POSTOP_ANALGESICS"] }, is_king: false, observations: "", is_deleted: false },
{ id: 43, specialty: { id: 29 }, procedure: { code: "GASTRO_ULCER_TREATMENT" }, product: { code: "GASTRO_H_PYLORI" }, discount: 3.25, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["GENERAL_PRE_SURGERY_EVAL", "POSTOP_MEDICATIONS", "POSTOP_APPOINTMENT"] }, is_king: false, observations: "", is_deleted: false },
{ id: 44, specialty: { id: 30 }, procedure: { code: "ORTHO_KNEE_SURGERY" }, product: { code: "ORTHO_KNEE_REPLACEMENT" }, discount: 9.5, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["SURGICAL_RISK_ASSESSMENT", "GENERAL_ANESTHESIA", "POSTOP_PHYSIOTHERAPY"] }, is_king: false, observations: "", is_deleted: false },

{ id: 45, specialty: { id: 31 }, procedure: { code: "ORTHO_SHOULDER_SURGERY" }, product: { code: "ORTHO_SHOULDER_DISLOCATION" }, discount: 6.5, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["GENERAL_ANESTHESIA", "POSTOP_XRAY", "POSTOP_REHAB"] }, is_king: false, observations: "", is_deleted: false },
{ id: 46, specialty: { id: 32 }, procedure: { code: "REFRACTIVE_SURGERY" }, product: { code: "REFRACTIVE_LASIK" }, discount: 5.0, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["REGIONAL_ANESTHESIA", "POSTOP_ULTRASOUND", "POSTOP_APPOINTMENT"] }, is_king: false, observations: "", is_deleted: false },
{ id: 47, specialty: { id: 33 }, procedure: { code: "REFRACTIVE_SURGERY" }, product: { code: "REFRACTIVE_FEMOTOLASIK" }, discount: 6.75, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["GENERAL_ANESTHESIA", "POSTOP_CT", "POSTOP_SURGEON_FOLLOWUP"] }, is_king: false, observations: "", is_deleted: false },
{ id: 48, specialty: { id: 34 }, procedure: { code: "CATARACT_SURGERY" }, product: { code: "LIO_MULTIFOCAL" }, discount: 2.5, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["GENERAL_ANESTHESIA", "POSTOP_MEDICAL", "POSTOP_APPOINTMENT"] }, is_king: false, observations: "", is_deleted: false },
{ id: 49, specialty: { id: 35 }, procedure: { code: "EPILEPSY_TREATMENT" }, product: { code: "VAGUS_NERVE_STIMULATION" }, discount: 8.0, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["PRE_SURGERY_ECG", "GENERAL_ANESTHESIA", "POSTOP_PAIN_CONTROL"] }, is_king: false, observations: "", is_deleted: false },

{ id: 50, specialty: { id: 36 }, procedure: { code: "PARKINSON_TREATMENT" }, product: { code: "DOPAMINE_THERAPY" }, discount: 4.0, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["GENERAL_PRE_SURGERY_EVAL", "POSTOP_MEDICAL", "POSTOP_APPOINTMENT"] }, is_king: false, observations: "", is_deleted: false },
{ id: 51, specialty: { id: 37 }, procedure: { code: "ENDOMETRIOSIS_SURGERY" }, product: { code: "ENDOMETRIOSIS_RESECTION" }, discount: 7.0, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["GENERAL_ANESTHESIA", "STERILE_SURGICAL_EQUIPMENT", "POSTOP_ANTIBIOTICS"] }, is_king: false, observations: "", is_deleted: false },
{ id: 52, specialty: { id: 38 }, procedure: { code: "INFERTILITY_TREATMENT" }, product: { code: "ARTIFICIAL_INSEMINATION" }, discount: 3.5, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["GENERAL_PRE_SURGERY_EVAL", "PRE_SURGERY_LAB_TESTS", "POSTOP_APPOINTMENT"] }, is_king: false, observations: "", is_deleted: false },
{ id: 53, specialty: { id: 39 }, procedure: { code: "BREAST_CANCER_TREATMENT" }, product: { code: "BREAST_CONSERVATIVE_SURGERY" }, discount: 6.25, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["SURGICAL_RISK_ASSESSMENT", "GENERAL_ANESTHESIA", "POSTOP_ANTICOAGULANTS"] }, is_king: false, observations: "", is_deleted: false },
{ id: 54, specialty: { id: 40 }, procedure: { code: "LUNG_CANCER_TREATMENT" }, product: { code: "LUNG_RESECTION" }, discount: 8.5, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["GENERAL_ANESTHESIA", "VITAL_MONITORS", "POSTOP_CT"] }, is_king: false, observations: "", is_deleted: false },

{ id: 55, specialty: { id: 41 }, procedure: { code: "CARDIO_INTERVENTION" }, product: { code: "CARDIO_CATH" }, discount: 4.5, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["PRE_SURGERY_ECG", "IV_FLUIDS", "POSTOP_ULTRASOUND"] }, is_king: false, observations: "", is_deleted: false },
{ id: 56, specialty: { id: 42 }, procedure: { code: "PACEMAKER_IMPLANT" }, product: { code: "PACEMAKER_SINGLE" }, discount: 5.75, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["PRE_SURGERY_ECG", "GENERAL_ANESTHESIA", "POSTOP_SURGEON_FOLLOWUP"] }, is_king: false, observations: "", is_deleted: false },
{ id: 57, specialty: { id: 43 }, procedure: { code: "GASTRO_ENDOSCOPY" }, product: { code: "GASTRO_GASTROSCOPY" }, discount: 3.0, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["GENERAL_PRE_SURGERY_EVAL", "PRE_SURGERY_LAB_TESTS", "POSTOP_ANALGESICS"] }, is_king: false, observations: "", is_deleted: false },
{ id: 58, specialty: { id: 44 }, procedure: { code: "ORTHO_KNEE_SURGERY" }, product: { code: "ORTHO_ACL_SURGERY" }, discount: 7.25, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["GENERAL_ANESTHESIA", "POSTOP_REHAB", "POSTOP_PHYSIOTHERAPY"] }, is_king: false, observations: "", is_deleted: false },
{ id: 59, specialty: { id: 45 }, procedure: { code: "REFRACTIVE_SURGERY" }, product: { code: "REFRACTIVE_LASIK_GUIDED" }, discount: 6.0, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["REGIONAL_ANESTHESIA", "POSTOP_XRAY", "POSTOP_APPOINTMENT"] }, is_king: false, observations: "", is_deleted: false },

{ id: 60, specialty: { id: 46 }, procedure: { code: "CARDIO_INTERVENTION" }, product: { code: "CARDIO_STENT" }, discount: 6.50, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["PRE_SURGERY_ECG", "SURGICAL_RISK_ASSESSMENT", "POSTOP_CT"] }, is_king: false, observations: "", is_deleted: false },
{ id: 61, specialty: { id: 47 }, procedure: { code: "PACEMAKER_IMPLANT" }, product: { code: "PACEMAKER_SINGLE" }, discount: 5.25, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["PRE_SURGERY_ECG", "VITAL_MONITORS", "POSTOP_SURGEON_FOLLOWUP"] }, is_king: false, observations: "", is_deleted: false },
{ id: 62, specialty: { id: 48 }, procedure: { code: "GASTRO_ENDOSCOPY" }, product: { code: "GASTRO_COLONOSCOPY" }, discount: 4.00, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["GENERAL_PRE_SURGERY_EVAL", "IV_FLUIDS", "POSTOP_ANALGESICS"] }, is_king: false, observations: "", is_deleted: false },
{ id: 63, specialty: { id: 49 }, procedure: { code: "GASTRO_ULCER_TREATMENT" }, product: { code: "GASTRO_PPI_THERAPY" }, discount: 3.50, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["PRE_SURGERY_LAB_TESTS", "POSTOP_MEDICAL", "POSTOP_APPOINTMENT"] }, is_king: false, observations: "", is_deleted: false },
{ id: 64, specialty: { id: 50 }, procedure: { code: "ORTHO_KNEE_SURGERY" }, product: { code: "ORTHO_ACL_SURGERY" }, discount: 8.75, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["GENERAL_ANESTHESIA", "POSTOP_REHAB", "POSTOP_PHYSIOTHERAPY"] }, is_king: false, observations: "", is_deleted: false },
{ id: 65, specialty: { id: 51 }, procedure: { code: "ORTHO_SHOULDER_SURGERY" }, product: { code: "ORTHO_ROTATOR_CUFF" }, discount: 7.25, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["GENERAL_ANESTHESIA", "POSTOP_XRAY", "POSTOP_PHYSIOTHERAPY"] }, is_king: false, observations: "", is_deleted: false },
{ id: 66, specialty: { id: 52 }, procedure: { code: "REFRACTIVE_SURGERY" }, product: { code: "REFRACTIVE_PRK" }, discount: 5.00, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["REGIONAL_ANESTHESIA", "POSTOP_ULTRASOUND", "POSTOP_APPOINTMENT"] }, is_king: false, observations: "", is_deleted: false },
{ id: 67, specialty: { id: 53 }, procedure: { code: "CATARACT_SURGERY" }, product: { code: "LIO_MONOFOCAL" }, discount: 2.00, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["GENERAL_ANESTHESIA", "POSTOP_MEDICAL", "POSTOP_APPOINTMENT"] }, is_king: false, observations: "", is_deleted: false },
{ id: 68, specialty: { id: 54 }, procedure: { code: "EPILEPSY_TREATMENT" }, product: { code: "EPILEPSY_SURGERY" }, discount: 7.00, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["PRE_SURGERY_ECG", "GENERAL_ANESTHESIA", "POSTOP_PAIN_CONTROL"] }, is_king: false, observations: "", is_deleted: false },
{ id: 69, specialty: { id: 55 }, procedure: { code: "PARKINSON_TREATMENT" }, product: { code: "DEEP_BRAIN_STIMULATION" }, discount: 6.00, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["PRE_SURGERY_ANESTHESIA", "VITAL_MONITORS", "POSTOP_CT"] }, is_king: false, observations: "", is_deleted: false },
{ id: 70, specialty: { id: 56 }, procedure: { code: "ENDOMETRIOSIS_SURGERY" }, product: { code: "ENDOMETRIOSIS_LAPAROSCOPY" }, discount: 6.50, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["GENERAL_ANESTHESIA", "STERILE_SURGICAL_EQUIPMENT", "POSTOP_ANTIBIOTICS"] }, is_king: false, observations: "", is_deleted: false },
{ id: 71, specialty: { id: 57 }, procedure: { code: "INFERTILITY_TREATMENT" }, product: { code: "IVF" }, discount: 4.25, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["GENERAL_PRE_SURGERY_EVAL", "PRE_SURGERY_LAB_TESTS", "POSTOP_APPOINTMENT"] }, is_king: false, observations: "", is_deleted: false },
{ id: 72, specialty: { id: 58 }, procedure: { code: "BREAST_CANCER_TREATMENT" }, product: { code: "MASTECTOMY_RADICAL" }, discount: 8.00, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["SURGICAL_RISK_ASSESSMENT", "GENERAL_ANESTHESIA", "POSTOP_ANTICOAGULANTS"] }, is_king: false, observations: "", is_deleted: false },
{ id: 73, specialty: { id: 59 }, procedure: { code: "LUNG_CANCER_TREATMENT" }, product: { code: "LUNG_TARGETED_THERAPY" }, discount: 5.50, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["GENERAL_PRE_SURGERY_EVAL", "POSTOP_CT", "POSTOP_SURGEON_FOLLOWUP"] }, is_king: false, observations: "", is_deleted: false },
{ id: 74, specialty: { id: 60 }, procedure: { code: "CARDIO_INTERVENTION" }, product: { code: "CARDIO_BYPASS" }, discount: 11.00, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["SURGICAL_RISK_ASSESSMENT", "GENERAL_ANESTHESIA", "POSTOP_PAIN_CONTROL"] }, is_king: false, observations: "", is_deleted: false },
{ id: 75, specialty: { id: 61 }, procedure: { code: "PACEMAKER_IMPLANT" }, product: { code: "PACEMAKER_DUAL" }, discount: 6.75, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["PRE_SURGERY_ECG", "VITAL_MONITORS", "POSTOP_SURGEON_FOLLOWUP"] }, is_king: false, observations: "", is_deleted: false },
{ id: 76, specialty: { id: 62 }, procedure: { code: "GASTRO_ENDOSCOPY" }, product: { code: "GASTRO_GASTROSCOPY" }, discount: 3.75, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["GENERAL_PRE_SURGERY_EVAL", "IV_FLUIDS", "POSTOP_ANALGESICS"] }, is_king: false, observations: "", is_deleted: false },
{ id: 77, specialty: { id: 63 }, procedure: { code: "ORTHO_KNEE_SURGERY" }, product: { code: "ORTHO_KNEE_REPLACEMENT" }, discount: 10.00, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["GENERAL_ANESTHESIA", "POSTOP_REHAB", "POSTOP_PHYSIOTHERAPY"] }, is_king: false, observations: "", is_deleted: false },
{ id: 78, specialty: { id: 64 }, procedure: { code: "REFRACTIVE_SURGERY" }, product: { code: "REFRACTIVE_FEMOTOLASIK" }, discount: 6.25, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["GENERAL_ANESTHESIA", "POSTOP_CT", "POSTOP_APPOINTMENT"] }, is_king: false, observations: "", is_deleted: false },
{ id: 79, specialty: { id: 65 }, procedure: { code: "CATARACT_SURGERY" }, product: { code: "LIO_MULTIFOCAL" }, discount: 1.50, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["GENERAL_ANESTHESIA", "POSTOP_MEDICAL", "POSTOP_APPOINTMENT"] }, is_king: false, observations: "", is_deleted: false },

{ id: 80, specialty: { id: 66 }, procedure: { code: "CARDIO_INTERVENTION" }, product: { code: "CARDIO_CATH" }, discount: 4.50, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["PRE_SURGERY_ECG", "SURGICAL_RISK_ASSESSMENT", "POSTOP_SURGEON_FOLLOWUP"] }, is_king: false, observations: "", is_deleted: false },
{ id: 81, specialty: { id: 67 }, procedure: { code: "PACEMAKER_IMPLANT" }, product: { code: "PACEMAKER_SINGLE" }, discount: 5.25, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["PRE_SURGERY_ECG", "VITAL_MONITORS", "POSTOP_SURGEON_FOLLOWUP"] }, is_king: false, observations: "", is_deleted: false },
{ id: 82, specialty: { id: 68 }, procedure: { code: "GASTRO_ENDOSCOPY" }, product: { code: "GASTRO_COLONOSCOPY" }, discount: 3.75, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["GENERAL_PRE_SURGERY_EVAL", "IV_FLUIDS", "POSTOP_ANALGESICS"] }, is_king: false, observations: "", is_deleted: false },
{ id: 83, specialty: { id: 69 }, procedure: { code: "GASTRO_ULCER_TREATMENT" }, product: { code: "GASTRO_H_PYLORI" }, discount: 2.50, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["PRE_SURGERY_LAB_TESTS", "POSTOP_MEDICAL", "POSTOP_APPOINTMENT"] }, is_king: false, observations: "", is_deleted: false },
{ id: 84, specialty: { id: 70 }, procedure: { code: "ORTHO_KNEE_SURGERY" }, product: { code: "ORTHO_KNEE_REPLACEMENT" }, discount: 9.50, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["GENERAL_ANESTHESIA", "POSTOP_REHAB", "POSTOP_PHYSIOTHERAPY"] }, is_king: false, observations: "", is_deleted: false },
{ id: 85, specialty: { id: 71 }, procedure: { code: "ORTHO_SHOULDER_SURGERY" }, product: { code: "ORTHO_SHOULDER_DISLOCATION" }, discount: 8.25, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["GENERAL_ANESTHESIA", "POSTOP_XRAY", "POSTOP_SURGEON_FOLLOWUP"] }, is_king: false, observations: "", is_deleted: false },
{ id: 86, specialty: { id: 72 }, procedure: { code: "REFRACTIVE_SURGERY" }, product: { code: "REFRACTIVE_LASIK" }, discount: 4.00, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["REGIONAL_ANESTHESIA", "POSTOP_ULTRASOUND", "POSTOP_APPOINTMENT"] }, is_king: false, observations: "", is_deleted: false },
{ id: 87, specialty: { id: 73 }, procedure: { code: "REFRACTIVE_SURGERY" }, product: { code: "REFRACTIVE_LASIK_GUIDED" }, discount: 5.50, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["GENERAL_ANESTHESIA", "POSTOP_CT", "POSTOP_APPOINTMENT"] }, is_king: false, observations: "", is_deleted: false },
{ id: 88, specialty: { id: 74 }, procedure: { code: "CATARACT_SURGERY" }, product: { code: "LIO_MONOFOCAL" }, discount: 1.75, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["MEDICAL_SPENDING", "POSTOP_MEDICAL", "POSTOP_APPOINTMENT"] }, is_king: false, observations: "", is_deleted: false },
{ id: 89, specialty: { id: 75 }, procedure: { code: "CATARACT_SURGERY" }, product: { code: "LIO_MULTIFOCAL" }, discount: 0.75, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["MEDICAL_SPENDING", "POSTOP_MEDICAL", "POSTOP_APPOINTMENT"] }, is_king: false, observations: "", is_deleted: false },
{ id: 90, specialty: { id: 76 }, procedure: { code: "EPILEPSY_TREATMENT" }, product: { code: "VAGUS_NERVE_STIMULATION" }, discount: 6.00, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["PRE_SURGERY_ANESTHESIA", "GENERAL_ANESTHESIA", "POSTOP_PAIN_CONTROL"] }, is_king: false, observations: "", is_deleted: false },
{ id: 91, specialty: { id: 77 }, procedure: { code: "EPILEPSY_TREATMENT" }, product: { code: "EPILEPSY_SURGERY" }, discount: 5.25, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["PRE_SURGERY_ECG", "VITAL_MONITORS", "POSTOP_CT"] }, is_king: false, observations: "", is_deleted: false },
{ id: 92, specialty: { id: 78 }, procedure: { code: "PARKINSON_TREATMENT" }, product: { code: "DEEP_BRAIN_STIMULATION" }, discount: 6.50, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["PRE_SURGERY_ANESTHESIA", "VITAL_MONITORS", "POSTOP_CT"] }, is_king: false, observations: "", is_deleted: false },
{ id: 93, specialty: { id: 79 }, procedure: { code: "PARKINSON_TREATMENT" }, product: { code: "DOPAMINE_THERAPY" }, discount: 4.25, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["GENERAL_PRE_SURGERY_EVAL", "POSTOP_MEDICAL", "POSTOP_APPOINTMENT"] }, is_king: false, observations: "", is_deleted: false },
{ id: 94, specialty: { id: 80 }, procedure: { code: "ENDOMETRIOSIS_SURGERY" }, product: { code: "ENDOMETRIOSIS_LAPAROSCOPY" }, discount: 6.25, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["GENERAL_ANESTHESIA", "STERILE_SURGICAL_EQUIPMENT", "POSTOP_ANTIBIOTICS"] }, is_king: false, observations: "", is_deleted: false },
{ id: 95, specialty: { id: 81 }, procedure: { code: "ENDOMETRIOSIS_SURGERY" }, product: { code: "ENDOMETRIOSIS_RESECTION" }, discount: 5.75, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["GENERAL_ANESTHESIA", "SURGICAL_SUTURES", "POSTOP_PAIN_CONTROL"] }, is_king: false, observations: "", is_deleted: false },
{ id: 96, specialty: { id: 82 }, procedure: { code: "INFERTILITY_TREATMENT" }, product: { code: "IVF" }, discount: 4.50, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["PRE_SURGERY_LAB_TESTS", "GENERAL_PRE_SURGERY_EVAL", "POSTOP_APPOINTMENT"] }, is_king: false, observations: "", is_deleted: false },
{ id: 97, specialty: { id: 83 }, procedure: { code: "INFERTILITY_TREATMENT" }, product: { code: "ARTIFICIAL_INSEMINATION" }, discount: 3.25, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["PRE_SURGERY_LAB_TESTS", "POSTOP_MEDICAL", "POSTOP_APPOINTMENT"] }, is_king: false, observations: "", is_deleted: false },
{ id: 98, specialty: { id: 84 }, procedure: { code: "BREAST_CANCER_TREATMENT" }, product: { code: "MASTECTOMY_RADICAL" }, discount: 8.75, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["SURGICAL_RISK_ASSESSMENT", "GENERAL_ANESTHESIA", "POSTOP_ANTICOAGULANTS"] }, is_king: false, observations: "", is_deleted: false },
{ id: 99, specialty: { id: 85 }, procedure: { code: "BREAST_CANCER_TREATMENT" }, product: { code: "BREAST_CONSERVATIVE_SURGERY" }, discount: 6.50, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["GENERAL_ANESTHESIA", "POSTOP_ANTIBIOTICS", "POSTOP_SURGEON_FOLLOWUP"] }, is_king: false, observations: "", is_deleted: false },
{ id: 100, specialty: { id: 86 }, procedure: { code: "LUNG_CANCER_TREATMENT" }, product: { code: "LUNG_RESECTION" }, discount: 7.25, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["SURGICAL_RISK_ASSESSMENT", "GENERAL_ANESTHESIA", "POSTOP_CT"] }, is_king: false, observations: "", is_deleted: false },
{ id: 101, specialty: { id: 87 }, procedure: { code: "LUNG_CANCER_TREATMENT" }, product: { code: "LUNG_TARGETED_THERAPY" }, discount: 4.75, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["GENERAL_PRE_SURGERY_EVAL", "POSTOP_CT", "POSTOP_SURGEON_FOLLOWUP"] }, is_king: false, observations: "", is_deleted: false },
{ id: 102, specialty: { id: 88 }, procedure: { code: "CARDIO_INTERVENTION" }, product: { code: "CARDIO_STENT" }, discount: 6.25, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["PRE_SURGERY_ECG", "SURGICAL_RISK_ASSESSMENT", "POSTOP_CT"] }, is_king: false, observations: "", is_deleted: false },
{ id: 103, specialty: { id: 89 }, procedure: { code: "CARDIO_INTERVENTION" }, product: { code: "CARDIO_BYPASS" }, discount: 10.50, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["SURGICAL_RISK_ASSESSMENT", "GENERAL_ANESTHESIA", "POSTOP_PAIN_CONTROL"] }, is_king: false, observations: "", is_deleted: false },
{ id: 104, specialty: { id: 90 }, procedure: { code: "PACEMAKER_IMPLANT" }, product: { code: "PACEMAKER_DUAL" }, discount: 6.75, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["PRE_SURGERY_ECG", "VITAL_MONITORS", "POSTOP_SURGEON_FOLLOWUP"] }, is_king: false, observations: "", is_deleted: false },
{ id: 105, specialty: { id: 91 }, procedure: { code: "GASTRO_ENDOSCOPY" }, product: { code: "GASTRO_GASTROSCOPY" }, discount: 3.50, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["GENERAL_PRE_SURGERY_EVAL", "IV_FLUIDS", "POSTOP_ANALGESICS"] }, is_king: false, observations: "", is_deleted: false },
{ id: 106, specialty: { id: 92 }, procedure: { code: "GASTRO_ULCER_TREATMENT" }, product: { code: "GASTRO_PPI_THERAPY" }, discount: 2.25, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["PRE_SURGERY_LAB_TESTS", "POSTOP_MEDICAL", "POSTOP_APPOINTMENT"] }, is_king: false, observations: "", is_deleted: false },
{ id: 107, specialty: { id: 93 }, procedure: { code: "ORTHO_KNEE_SURGERY" }, product: { code: "ORTHO_ACL_SURGERY" }, discount: 8.25, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["GENERAL_ANESTHESIA", "POSTOP_REHAB", "POSTOP_PHYSIOTHERAPY"] }, is_king: false, observations: "", is_deleted: false },
{ id: 108, specialty: { id: 94 }, procedure: { code: "ORTHO_SHOULDER_SURGERY" }, product: { code: "ORTHO_ROTATOR_CUFF" }, discount: 7.50, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["GENERAL_ANESTHESIA", "POSTOP_XRAY", "POSTOP_PHYSIOTHERAPY"] }, is_king: false, observations: "", is_deleted: false },
{ id: 109, specialty: { id: 95 }, procedure: { code: "REFRACTIVE_SURGERY" }, product: { code: "REFRACTIVE_PRK" }, discount: 3.25, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["REGIONAL_ANESTHESIA", "POSTOP_ULTRASOUND", "POSTOP_APPOINTMENT"] }, is_king: false, observations: "", is_deleted: false },
{ id: 110, specialty: { id: 96 }, procedure: { code: "REFRACTIVE_SURGERY" }, product: { code: "REFRACTIVE_FEMOTOLASIK" }, discount: 5.75, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["GENERAL_ANESTHESIA", "POSTOP_CT", "POSTOP_APPOINTMENT"] }, is_king: false, observations: "", is_deleted: false },
{ id: 111, specialty: { id: 97 }, procedure: { code: "CATARACT_SURGERY" }, product: { code: "LIO_MONOFOCAL" }, discount: 1.25, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["MEDICAL_SPENDING", "POSTOP_MEDICAL", "POSTOP_APPOINTMENT"] }, is_king: false, observations: "", is_deleted: false },
{ id: 112, specialty: { id: 98 }, procedure: { code: "EPILEPSY_TREATMENT" }, product: { code: "VAGUS_NERVE_STIMULATION" }, discount: 6.75, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["PRE_SURGERY_ANESTHESIA", "GENERAL_ANESTHESIA", "POSTOP_PAIN_CONTROL"] }, is_king: false, observations: "", is_deleted: false },
{ id: 113, specialty: { id: 99 }, procedure: { code: "PARKINSON_TREATMENT" }, product: { code: "DEEP_BRAIN_STIMULATION" }, discount: 6.00, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["PRE_SURGERY_ANESTHESIA", "VITAL_MONITORS", "POSTOP_CT"] }, is_king: false, observations: "", is_deleted: false },
{ id: 114, specialty: { id: 100 }, procedure: { code: "ENDOMETRIOSIS_SURGERY" }, product: { code: "ENDOMETRIOSIS_LAPAROSCOPY" }, discount: 5.50, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["GENERAL_ANESTHESIA", "STERILE_SURGICAL_EQUIPMENT", "POSTOP_ANTIBIOTICS"] }, is_king: false, observations: "", is_deleted: false },
{ id: 115, specialty: { id: 101 }, procedure: { code: "INFERTILITY_TREATMENT" }, product: { code: "IVF" }, discount: 4.00, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["PRE_SURGERY_LAB_TESTS", "GENERAL_PRE_SURGERY_EVAL", "POSTOP_APPOINTMENT"] }, is_king: false, observations: "", is_deleted: false },
{ id: 116, specialty: { id: 102 }, procedure: { code: "BREAST_CANCER_TREATMENT" }, product: { code: "BREAST_CONSERVATIVE_SURGERY" }, discount: 6.25, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["GENERAL_ANESTHESIA", "POSTOP_ANTIBIOTICS", "POSTOP_SURGEON_FOLLOWUP"] }, is_king: false, observations: "", is_deleted: false },
{ id: 117, specialty: { id: 103 }, procedure: { code: "LUNG_CANCER_TREATMENT" }, product: { code: "LUNG_TARGETED_THERAPY" }, discount: 4.25, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["GENERAL_PRE_SURGERY_EVAL", "POSTOP_CT", "POSTOP_SURGEON_FOLLOWUP"] }, is_king: false, observations: "", is_deleted: false },
{ id: 118, specialty: { id: 104 }, procedure: { code: "CARDIO_INTERVENTION" }, product: { code: "CARDIO_STENT" }, discount: 6.00, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["PRE_SURGERY_ECG", "SURGICAL_RISK_ASSESSMENT", "POSTOP_CT"] }, is_king: false, observations: "", is_deleted: false },
{ id: 119, specialty: { id: 105 }, procedure: { code: "PACEMAKER_IMPLANT" }, product: { code: "PACEMAKER_DUAL" }, discount: 6.50, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["PRE_SURGERY_ECG", "VITAL_MONITORS", "POSTOP_SURGEON_FOLLOWUP"] }, is_king: false, observations: "", is_deleted: false },
{ id: 120, specialty: { id: 106 }, procedure: { code: "GASTRO_ENDOSCOPY" }, product: { code: "GASTRO_COLONOSCOPY" }, discount: 3.25, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["GENERAL_PRE_SURGERY_EVAL", "IV_FLUIDS", "POSTOP_ANALGESICS"] }, is_king: false, observations: "", is_deleted: false },
{ id: 121, specialty: { id: 107 }, procedure: { code: "GASTRO_ULCER_TREATMENT" }, product: { code: "GASTRO_H_PYLORI" }, discount: 2.00, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["PRE_SURGERY_LAB_TESTS", "POSTOP_MEDICAL", "POSTOP_APPOINTMENT"] }, is_king: false, observations: "", is_deleted: false },
{ id: 122, specialty: { id: 108 }, procedure: { code: "ORTHO_KNEE_SURGERY" }, product: { code: "ORTHO_KNEE_REPLACEMENT" }, discount: 9.00, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["GENERAL_ANESTHESIA", "POSTOP_REHAB", "POSTOP_PHYSIOTHERAPY"] }, is_king: false, observations: "", is_deleted: false },
{ id: 123, specialty: { id: 109 }, procedure: { code: "ORTHO_SHOULDER_SURGERY" }, product: { code: "ORTHO_ROTATOR_CUFF" }, discount: 7.00, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["GENERAL_ANESTHESIA", "POSTOP_XRAY", "POSTOP_PHYSIOTHERAPY"] }, is_king: false, observations: "", is_deleted: false },
{ id: 124, specialty: { id: 110 }, procedure: { code: "REFRACTIVE_SURGERY" }, product: { code: "REFRACTIVE_LASIK" }, discount: 4.50, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["REGIONAL_ANESTHESIA", "POSTOP_ULTRASOUND", "POSTOP_APPOINTMENT"] }, is_king: false, observations: "", is_deleted: false },
{ id: 125, specialty: { id: 111 }, procedure: { code: "CATARACT_SURGERY" }, product: { code: "LIO_MULTIFOCAL" }, discount: 1.00, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["MEDICAL_SPENDING", "POSTOP_MEDICAL", "POSTOP_APPOINTMENT"] }, is_king: false, observations: "", is_deleted: false },
{ id: 126, specialty: { id: 112 }, procedure: { code: "EPILEPSY_TREATMENT" }, product: { code: "EPILEPSY_SURGERY" }, discount: 5.00, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["PRE_SURGERY_ECG", "VITAL_MONITORS", "POSTOP_CT"] }, is_king: false, observations: "", is_deleted: false },
{ id: 127, specialty: { id: 113 }, procedure: { code: "INFERTILITY_TREATMENT" }, product: { code: "ARTIFICIAL_INSEMINATION" }, discount: 2.75, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["PRE_SURGERY_LAB_TESTS", "POSTOP_MEDICAL", "POSTOP_APPOINTMENT"] }, is_king: false, observations: "", is_deleted: false },
{ id: 128, specialty: { id: 114 }, procedure: { code: "LUNG_CANCER_TREATMENT" }, product: { code: "LUNG_RESECTION" }, discount: 6.75, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: ["SURGICAL_RISK_ASSESSMENT", "GENERAL_ANESTHESIA", "POSTOP_CT"] }, is_king: false, observations: "", is_deleted: false },

// -----------------------------
// NEW Packages (Cardiology) - add new cardiology procedures/products (codes intact)
// -----------------------------
{ id: 129, specialty: { id: 11 }, procedure: { code: "CARDIO_INTERVENTION" }, product: { code: "CARDIO_ANGIOPLASTY" }, discount: 0, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: [] }, is_king: false, observations: "", is_deleted: false },
{ id: 130, specialty: { id: 11 }, procedure: { code: "CARDIO_INTERVENTION" }, product: { code: "CARDIO_PERCUTANEOUS_VALVES" }, discount: 0, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: [] }, is_king: false, observations: "", is_deleted: false },
{ id: 131, specialty: { id: 11 }, procedure: { code: "CARDIO_INTERVENTION" }, product: { code: "CARDIO_CATH_COMPREHENSIVE" }, discount: 0, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: [] }, is_king: false, observations: "", is_deleted: false },
{ id: 132, specialty: { id: 11 }, procedure: { code: "PACEMAKER_IMPLANT" }, product: { code: "CARDIO_PACEMAKER_IMPLANT_CONTROL" }, discount: 0, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: [] }, is_king: false, observations: "", is_deleted: false },
{ id: 133, specialty: { id: 11 }, procedure: { code: "PACEMAKER_IMPLANT" }, product: { code: "CARDIO_PACEMAKER_GENERATOR_CHANGE" }, discount: 0, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: [] }, is_king: false, observations: "", is_deleted: false },
{ id: 134, specialty: { id: 11 }, procedure: { code: "PACEMAKER_IMPLANT" }, product: { code: "CARDIO_PACEMAKER_LEAD_EXTRACTION" }, discount: 0, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: [] }, is_king: false, observations: "", is_deleted: false },
{ id: 135, specialty: { id: 11 }, procedure: { code: "PACEMAKER_IMPLANT" }, product: { code: "CARDIO_ICD_IMPLANT" }, discount: 0, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: [] }, is_king: false, observations: "", is_deleted: false },
{ id: 136, specialty: { id: 11 }, procedure: { code: "PACEMAKER_IMPLANT" }, product: { code: "CARDIO_CRT_IMPLANT" }, discount: 0, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: [] }, is_king: false, observations: "", is_deleted: false },

{ id: 137, specialty: { id: 11 }, procedure: { code: "CARDIO_ECHO_TTE_REST" }, product: { code: "CARDIO_ECHO_TTE_REST_TEST" }, discount: 0, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: [] }, is_king: false, observations: "", is_deleted: false },
{ id: 138, specialty: { id: 11 }, procedure: { code: "CARDIO_ECHO_TEE" }, product: { code: "CARDIO_ECHO_TEE_TEST" }, discount: 0, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: [] }, is_king: false, observations: "", is_deleted: false },
{ id: 139, specialty: { id: 11 }, procedure: { code: "CARDIO_ECHO_STRESS_EXERCISE" }, product: { code: "CARDIO_ECHO_STRESS_EXERCISE_TEST" }, discount: 0, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: [] }, is_king: false, observations: "", is_deleted: false },
{ id: 140, specialty: { id: 11 }, procedure: { code: "CARDIO_ECHO_STRESS_DOBUTAMINE" }, product: { code: "CARDIO_ECHO_STRESS_DOBUTAMINE_TEST" }, discount: 0, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: [] }, is_king: false, observations: "", is_deleted: false },
{ id: 141, specialty: { id: 11 }, procedure: { code: "CARDIO_ECG_INTERPRETATION" }, product: { code: "CARDIO_ECG_INTERPRETATION_TEST" }, discount: 0, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: [] }, is_king: false, observations: "", is_deleted: false },
{ id: 142, specialty: { id: 11 }, procedure: { code: "CARDIO_ECG_STRESS" }, product: { code: "CARDIO_ECG_STRESS_TEST" }, discount: 0, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: [] }, is_king: false, observations: "", is_deleted: false },
{ id: 143, specialty: { id: 11 }, procedure: { code: "CARDIO_STRESS_TEST" }, product: { code: "CARDIO_STRESS_TEST_STD" }, discount: 0, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: [] }, is_king: false, observations: "", is_deleted: false },
{ id: 144, specialty: { id: 11 }, procedure: { code: "CARDIO_ARRHYTHMIA_ABLATION" }, product: { code: "CARDIO_ARRHYTHMIA_ABLATION_PROC" }, discount: 0, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: [] }, is_king: false, observations: "", is_deleted: false },
{ id: 145, specialty: { id: 11 }, procedure: { code: "CARDIO_HOLTER" }, product: { code: "CARDIO_HOLTER_24_48" }, discount: 0, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: [] }, is_king: false, observations: "", is_deleted: false },
{ id: 146, specialty: { id: 11 }, procedure: { code: "CARDIO_EVENT_MONITOR" }, product: { code: "CARDIO_EVENT_MONITOR_STD" }, discount: 0, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: [] }, is_king: false, observations: "", is_deleted: false },
{ id: 147, specialty: { id: 11 }, procedure: { code: "CARDIO_ABPM_MAPA" }, product: { code: "CARDIO_ABPM_MAPA_24" }, discount: 0, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: [] }, is_king: false, observations: "", is_deleted: false },
{ id: 148, specialty: { id: 11 }, procedure: { code: "CARDIO_BP_MONITORING" }, product: { code: "CARDIO_BP_MONITORING_VISIT" }, discount: 0, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: [] }, is_king: false, observations: "", is_deleted: false },
{ id: 149, specialty: { id: 11 }, procedure: { code: "CARDIO_CT_CORONARY_ANGIO" }, product: { code: "CARDIO_CT_CORONARY_ANGIO_TEST" }, discount: 0, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: [] }, is_king: false, observations: "", is_deleted: false },
{ id: 150, specialty: { id: 11 }, procedure: { code: "CARDIO_PERICARDIOCENTESIS" }, product: { code: "CARDIO_PERICARDIOCENTESIS_PROC" }, discount: 0, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: [] }, is_king: false, observations: "", is_deleted: false },
{ id: 151, specialty: { id: 11 }, procedure: { code: "CARDIO_SPIROMETRY" }, product: { code: "CARDIO_SPIROMETRY_TEST" }, discount: 0, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: [] }, is_king: false, observations: "", is_deleted: false },
{ id: 152, specialty: { id: 11 }, procedure: { code: "CARDIO_PREOP_EVALUATION" }, product: { code: "CARDIO_PREOP_EVALUATION_PACKAGE" }, discount: 0, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: [] }, is_king: false, observations: "", is_deleted: false },
{ id: 153, specialty: { id: 11 }, procedure: { code: "CARDIO_VIDEO_CONSULT" }, product: { code: "CARDIO_VIDEO_CONSULT_VISIT" }, discount: 0, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: [] }, is_king: false, observations: "", is_deleted: false },

// -----------------------------
// FIXED Packages (Ophthalmology) - using existing ProceduresAndProducts codes
// -----------------------------
{ id: 154, specialty: { id: 34 }, procedure: { code: "OPHTH_PTERYGIUM_SURGERY" }, product: { code: "OPHTH_PTERYGIUM_STD" }, discount: 0, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: [] }, is_king: false, observations: "", is_deleted: false },
{ id: 155, specialty: { id: 34 }, procedure: { code: "OPHTH_KERATOCONUS_SURGERY" }, product: { code: "OPHTH_CXL" }, discount: 0, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: [] }, is_king: false, observations: "", is_deleted: false },
{ id: 156, specialty: { id: 34 }, procedure: { code: "OPHTH_CONSULTATION" }, product: { code: "OPHTH_CONSULTATION_GENERAL" }, discount: 0, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: [] }, is_king: false, observations: "", is_deleted: false },
{ id: 157, specialty: { id: 34 }, procedure: { code: "OPHTH_BLEPHAROPLASTY" }, product: { code: "OPHTH_BLEPHAROPLASTY_STD" }, discount: 0, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: [] }, is_king: false, observations: "", is_deleted: false },
{ id: 158, specialty: { id: 34 }, procedure: { code: "OPHTH_CAPSULOTOMY" }, product: { code: "OPHTH_CAPSULOTOMY_YAG" }, discount: 0, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: [] }, is_king: false, observations: "", is_deleted: false },

// Glaucoma: procedure = OPHTH_GLAUCOMA_SURGERY, products are its children
{ id: 161, specialty: { id: 34 }, procedure: { code: "OPHTH_GLAUCOMA_SURGERY" }, product: { code: "OPHTH_AHMED_VALVE" }, discount: 0, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: [] }, is_king: false, observations: "", is_deleted: false },
{ id: 166, specialty: { id: 34 }, procedure: { code: "OPHTH_GLAUCOMA_SURGERY" }, product: { code: "OPHTH_PHACO_AHMED" }, discount: 0, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: [] }, is_king: false, observations: "", is_deleted: false },
{ id: 167, specialty: { id: 34 }, procedure: { code: "OPHTH_GLAUCOMA_SURGERY" }, product: { code: "OPHTH_PHACOTRABECULECTOMY" }, discount: 0, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: [] }, is_king: false, observations: "", is_deleted: false },
{ id: 168, specialty: { id: 34 }, procedure: { code: "OPHTH_GLAUCOMA_SURGERY" }, product: { code: "OPHTH_LASER_IRIDOTOMY" }, discount: 0, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: [] }, is_king: false, observations: "", is_deleted: false },
{ id: 169, specialty: { id: 34 }, procedure: { code: "OPHTH_GLAUCOMA_SURGERY" }, product: { code: "OPHTH_ANGLE_STUDY" }, discount: 0, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: [] }, is_king: false, observations: "", is_deleted: false },
{ id: 173, specialty: { id: 34 }, procedure: { code: "OPHTH_GLAUCOMA_SURGERY" }, product: { code: "OPHTH_IRIDOTOMY" }, discount: 0, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: [] }, is_king: false, observations: "", is_deleted: false },
{ id: 177, specialty: { id: 34 }, procedure: { code: "OPHTH_GLAUCOMA_SURGERY" }, product: { code: "OPHTH_TRABECULECTOMY" }, discount: 0, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: [] }, is_king: false, observations: "", is_deleted: false },
{ id: 178, specialty: { id: 34 }, procedure: { code: "OPHTH_GLAUCOMA_SURGERY" }, product: { code: "OPHTH_SLTP" }, discount: 0, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: [] }, is_king: false, observations: "", is_deleted: false },

// Lacrimal: procedure = OPHTH_LACRIMAL_SURGERY, products are its children
{ id: 164, specialty: { id: 34 }, procedure: { code: "OPHTH_LACRIMAL_SURGERY" }, product: { code: "OPHTH_LACRIMAL_OBSTRUCTION_SURGERY" }, discount: 0, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: [] }, is_king: false, observations: "", is_deleted: false },
{ id: 171, specialty: { id: 34 }, procedure: { code: "OPHTH_LACRIMAL_SURGERY" }, product: { code: "OPHTH_LACRIMAL_INTUBATION" }, discount: 0, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: [] }, is_king: false, observations: "", is_deleted: false },
{ id: 174, specialty: { id: 34 }, procedure: { code: "OPHTH_LACRIMAL_SURGERY" }, product: { code: "OPHTH_PUNCTAL_PLASTY" }, discount: 0, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: [] }, is_king: false, observations: "", is_deleted: false },
{ id: 163, specialty: { id: 34 }, procedure: { code: "OPHTH_CHALAZION_CURETTAGE" }, product: { code: "OPHTH_CHALAZION_CURETTAGE_STD" }, discount: 0, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: [] }, is_king: false, observations: "", is_deleted: false },
{ id: 165, specialty: { id: 34 }, procedure: { code: "OPHTH_RETINAL_DIATHERMY" }, product: { code: "OPHTH_RETINAL_DIATHERMY_STD" }, discount: 0, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: [] }, is_king: false, observations: "", is_deleted: false },
{ id: 172, specialty: { id: 34 }, procedure: { code: "OPHTH_INTRAOCULAR_INJECTION" }, product: { code: "OPHTH_INTRAOCULAR_INJECTION_STD" }, discount: 0, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: [] }, is_king: false, observations: "", is_deleted: false },

// Lens: procedure = OPHTH_LENS_PROCEDURE, products are its children
{ id: 170, specialty: { id: 34 }, procedure: { code: "OPHTH_LENS_PROCEDURE" }, product: { code: "OPHTH_LENS_IMPLANT" }, discount: 0, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: [] }, is_king: false, observations: "", is_deleted: false },
{ id: 176, specialty: { id: 34 }, procedure: { code: "OPHTH_LENS_PROCEDURE" }, product: { code: "OPHTH_IOL_REMOVAL" }, discount: 0, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: [] }, is_king: false, observations: "", is_deleted: false },
{ id: 175, specialty: { id: 34 }, procedure: { code: "OPHTH_CORNEAL_SCRAPING" }, product: { code: "OPHTH_CORNEAL_SCRAPING_STD" }, discount: 0, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: [] }, is_king: false, observations: "", is_deleted: false },
{ id: 179, specialty: { id: 34 }, procedure: { code: "OPHTH_CORNEAL_TRANSPLANT" }, product: { code: "OPHTH_CORNEAL_TRANSPLANT_STD" }, discount: 0, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: [] }, is_king: false, observations: "", is_deleted: false },
{ id: 180, specialty: { id: 34 }, procedure: { code: "OPHTH_OCULAR_ULTRASOUND" }, product: { code: "OPHTH_OCULAR_ULTRASOUND_BSCAN" }, discount: 0, postoperative_assessments: null, services_offer: { ASSESSMENT_DETAILS: [] }, is_king: false, observations: "", is_deleted: false },

];

await packageRepository.upsert(packages, ["id"]);










//*************************************** */
//      CertificationsExperience
//*************************************** */
const certificationsExperienceRepository = dataSource.getRepository(CertificationsExperience);
const certificationsExperiences = [
    {
        id: 1,
        supplier: { id: 1 }, // Alejandro Vargas
        start_date: new Date("2005-01-01"),
        end_date: new Date("2010-12-31"),
        name: "Especialización en Cirugía Cardiovascular",
        company_name: "Universidad de Costa Rica",
        province: "San José",
        address: "San Pedro de Montes de Oca",
        city_name: "San José",
        country_iso_code: "CRC",
        is_currently: false,
        url_document: "https://example.com/certifications/cirugia_cardiovascular.pdf",
        experience_type: { code: "EDUCATION" }
    },
    {
        id: 2,
        supplier: { id: 1 }, // Alejandro Vargas
        start_date: new Date("2011-01-01"),
        end_date: new Date("2016-06-30"),
        name: "Fellowship en Cirugía Cardiotorácica",
        company_name: "Hospital John Hopkins",
        province: "Maryland",
        address: "1800 Orleans St, Baltimore",
        city_name: "Baltimore",
        country_iso_code: "USA",
        is_currently: false,
        url_document: "https://example.com/certifications/fellowship_cardiotoracico.pdf",
        experience_type: { code: "CERTIFICATION" }
    },
    {
        id: 3,
        supplier: { id: 2 }, // Sofía Araya
        start_date: new Date("2010-02-01"),
        end_date: new Date("2014-11-30"),
        name: "Especialización en Dermatología",
        company_name: "Universidad Autónoma de México",
        province: "Ciudad de México",
        address: "Av. Universidad 3000",
        city_name: "CDMX",
        country_iso_code: "MEX",
        is_currently: false,
        url_document: "https://example.com/certifications/dermatologia.pdf",
        experience_type: { code: "EDUCATION" }
    },
    {
        id: 4,
        supplier: { id: 2 }, // Sofía Araya
        start_date: new Date("2015-05-01"),
        end_date: new Date("2021-08-30"),
        name: "Miembro de la Sociedad Internacional de Dermatología",
        company_name: "International Society of Dermatology",
        province: "Florida",
        address: "Orlando, FL",
        city_name: "Orlando",
        country_iso_code: "USA",
        is_currently: false,
        url_document: "https://example.com/certifications/miembro_dermatologia.pdf",
        experience_type: { code: "ACCREDITATION" }
    },
    {
        id: 5,
        supplier: { id: 3 }, // Fernando López
        start_date: new Date("2012-06-01"),
        end_date: new Date("2017-12-31"),
        name: "Médico General",
        company_name: "Universidad de Costa Rica",
        province: "San José",
        address: "San Pedro de Montes de Oca",
        city_name: "San José",
        country_iso_code: "CRC",
        is_currently: false,
        url_document: "https://example.com/certifications/medico_general.pdf",
        experience_type: { code: "EDUCATION" }
    },
    {
        id: 6,
        supplier: { id: 3 }, // Fernando López
        start_date: new Date("2018-02-01"),
        end_date: null,
        name: "Director Médico en Clínica Zahha",
        company_name: "Clínica Zahha",
        province: "San José",
        address: "Centro Comercial Momentum Pinares",
        city_name: "Curridabat",
        country_iso_code: "CRC",
        is_currently: true,
        url_document: "https://example.com/certifications/director_medico.pdf",
        experience_type: { code: "EXPERIENCE" }
    },
    {
        id: 7,
        supplier: { id: 4 }, // Hospital Clínica Santa Fe
        start_date: new Date("1990-01-01"),
        end_date: null,
        name: "Hospital Certificado en Cardiología",
        company_name: "Ministerio de Salud",
        province: "San José",
        address: "Av. Central, San José",
        city_name: "San José",
        country_iso_code: "CRC",
        is_currently: true,
        url_document: "https://example.com/certifications/hospital_cardiologia.pdf",
        experience_type: { code: "ACCREDITATION" }
    },
    {
        id: 8,
        supplier: { id: 30 }, // Hospital Clínica Santa Fe
        start_date: new Date("2002-01-01"),
        end_date: new Date("2005-12-01"),
        name: "Alta Especialidad en Oftalmología",
        company_name: "Universidad de Costa Rica",
        province: "San José",
        address: "Av. Central, San José",
        city_name: "San José",
        country_iso_code: "CRC",
        is_currently: false,
        url_document: "https://example.com/certifications/hospital_cardiologia.pdf",
        experience_type: { code: "EDUCATION" }
    },
    {
        id: 9,
        supplier: { id: 30 }, // Hospital Clínica Santa Fe
        start_date: new Date("1995-01-01"),
        end_date: new Date("1999-12-01"),
        name: "Médico y Cirujano",
        company_name: "Universidad de Costa Rica",
        province: "San José",
        address: "Av. Central, San José",
        city_name: "San José",
        country_iso_code: "CRC",
        is_currently: false,
        url_document: "https://example.com/certifications/hospital_cardiologia.pdf",
        experience_type: { code: "EDUCATION" }
    },
    {
        id: 10,
        supplier: { id: 7 }, 
        start_date: new Date("1983-01-01"),
        end_date: null,
        name: "Incorporación Colegio de Médicos - Especialista en Cardiología.",
        company_name: "COLEGIO DE MEDICOS Y CIRUJANOS",
        province: "San José",
        address: "Av. Central, San José",
        city_name: "San José",
        country_iso_code: "CRC",
        is_currently: false,
        url_document: "https://example.com/certifications/hospital_cardiologia.pdf",
        experience_type: { code: "EDUCATION" }
    },
    {
        id: 11,
        supplier: { id: 7 }, 
        start_date: new Date("1982-01-01"),
        end_date: null,
        name: "Especialista en Cardiologia",
        company_name: "UNIVERSIDAD NACIONAL DE COSTA RICA",
        province: "San José",
        address: "Av. Central, San José",
        city_name: "San José",
        country_iso_code: "CRC",
        is_currently: false,
        url_document: "https://example.com/certifications/hospital_cardiologia.pdf",
        experience_type: { code: "EDUCATION" }
    },
    {
        id: 12,
        supplier: { id: 7 }, 
        start_date: new Date("1978-01-01"),
        end_date: null,
        name: "Residencia en Medica en Medicina Interna y Cardiologia",
        company_name: "UNIVERSIDAD NACIONAL DE COSTA RICA",
        province: "San José",
        address: "Av. Central, San José",
        city_name: "San José",
        country_iso_code: "CRC",
        is_currently: false,
        url_document: "https://example.com/certifications/hospital_cardiologia.pdf",
        experience_type: { code: "EDUCATION" }
    },
    {
        id: 13,
        supplier: { id: 7 }, 
        start_date: new Date("1975-01-01"),
        end_date: null,
        name: "Licenciatura en Médico Cirujan",
        company_name: "UNIVERSIDAD NACIONAL AUTONOMA DE MEXICO",
        province: "Distrito Federal",
        address: "Av. DF",
        city_name: "Distrito Federal",
        country_iso_code: "MEX",
        is_currently: false,
        url_document: "https://example.com/certifications/hospital_cardiologia.pdf",
        experience_type: { code: "EDUCATION" }
    }
];

await certificationsExperienceRepository.upsert(certificationsExperiences, ["id"]);










//*************************************** */
//      Language by supplier
//*************************************** */
const languageSupplierRepository = dataSource.getRepository(LanguageSupplier);
const languageSuppliers = [
    {
        id: 1,
        supplier: { id: 1 }, // Alejandro Vargas
        language_proficiency: { code: "NATIVE" }, // Nativo
        language_code: "es", // Español
    },
    {
        id: 2,
        supplier: { id: 1 }, // Alejandro Vargas
        language_proficiency: { code: "FLUENT" }, // Fluido
        language_code: "en", // Inglés
    },
    {
        id: 3,
        supplier: { id: 2 }, // Sofía Araya
        language_proficiency: { code: "NATIVE" }, // Nativo
        language_code: "es", // Español
    },
    {
        id: 4,
        supplier: { id: 2 }, // Sofía Araya
        language_proficiency: { code: "ADVANCED" }, // Avanzado
        language_code: "fr", // Francés
    },
    {
        id: 5,
        supplier: { id: 3 }, // Fernando López
        language_proficiency: { code: "NATIVE" }, // Nativo
        language_code: "es", // Español
    },
    {
        id: 6,
        supplier: { id: 3 }, // Fernando López
        language_proficiency: { code: "INTERMEDIATE" }, // Intermedio
        language_code: "de", // Alemán
    },
    {
        id: 7,
        supplier: { id: 4 }, // Hospital Clínica Santa Fe
        language_proficiency: { code: "BILINGUAL" }, // Bilingüe
        language_code: "en", // Inglés
    }
];

await languageSupplierRepository.upsert(languageSuppliers, ["id"]);










//*************************************** */
//      Availabillity by supplier
//*************************************** */
const availabilityRepository = dataSource.getRepository(Availability);
const availabilities = [
    { id: 1, supplier: { id: 1 }, location: { id: 1 }, weekday: "Monday", from_hour: "08:00:00", to_hour: "12:00:00" },
  { id: 2, supplier: { id: 1 }, location: { id: 2 }, weekday: "Thursday", from_hour: "14:00:00", to_hour: "18:00:00" },
  { id: 3, supplier: { id: 2 }, location: { id: 2 }, weekday: "Tuesday", from_hour: "08:00:00", to_hour: "12:00:00" },
  { id: 4, supplier: { id: 2 }, location: { id: 3 }, weekday: "Friday", from_hour: "14:00:00", to_hour: "18:00:00" },
  { id: 5, supplier: { id: 3 }, location: { id: 3 }, weekday: "Wednesday", from_hour: "08:00:00", to_hour: "12:00:00" },
  { id: 6, supplier: { id: 3 }, location: { id: 4 }, weekday: "Saturday", from_hour: "14:00:00", to_hour: "18:00:00" },
  { id: 7, supplier: { id: 4 }, location: { id: 4 }, weekday: "Thursday", from_hour: "08:00:00", to_hour: "12:00:00" },
  { id: 8, supplier: { id: 4 }, location: { id: 5 }, weekday: "Sunday", from_hour: "14:00:00", to_hour: "18:00:00" },
  { id: 9, supplier: { id: 5 }, location: { id: 5 }, weekday: "Friday", from_hour: "08:00:00", to_hour: "12:00:00" },
  { id: 10, supplier: { id: 5 }, location: { id: 6 }, weekday: "Monday", from_hour: "14:00:00", to_hour: "18:00:00" },
  { id: 11, supplier: { id: 6 }, location: { id: 6 }, weekday: "Saturday", from_hour: "08:00:00", to_hour: "12:00:00" },
  { id: 12, supplier: { id: 6 }, location: { id: 7 }, weekday: "Tuesday", from_hour: "14:00:00", to_hour: "18:00:00" },
  { id: 13, supplier: { id: 7 }, location: { id: 7 }, weekday: "Sunday", from_hour: "08:00:00", to_hour: "12:00:00" },
  { id: 14, supplier: { id: 7 }, location: { id: 8 }, weekday: "Wednesday", from_hour: "14:00:00", to_hour: "18:00:00" },
  { id: 15, supplier: { id: 8 }, location: { id: 8 }, weekday: "Monday", from_hour: "08:00:00", to_hour: "12:00:00" },
  { id: 16, supplier: { id: 8 }, location: { id: 9 }, weekday: "Thursday", from_hour: "14:00:00", to_hour: "18:00:00" },
  { id: 17, supplier: { id: 9 }, location: { id: 9 }, weekday: "Tuesday", from_hour: "08:00:00", to_hour: "12:00:00" },
  { id: 18, supplier: { id: 9 }, location: { id: 10 }, weekday: "Friday", from_hour: "14:00:00", to_hour: "18:00:00" },
  { id: 19, supplier: { id: 10 }, location: { id: 10 }, weekday: "Wednesday", from_hour: "08:00:00", to_hour: "12:00:00" },
  { id: 20, supplier: { id: 10 }, location: { id: 11 }, weekday: "Saturday", from_hour: "14:00:00", to_hour: "18:00:00" },
  { id: 21, supplier: { id: 11 }, location: { id: 11 }, weekday: "Thursday", from_hour: "08:00:00", to_hour: "12:00:00" },
  { id: 22, supplier: { id: 11 }, location: { id: 12 }, weekday: "Sunday", from_hour: "14:00:00", to_hour: "18:00:00" },
  { id: 23, supplier: { id: 12 }, location: { id: 12 }, weekday: "Friday", from_hour: "08:00:00", to_hour: "12:00:00" },
  { id: 24, supplier: { id: 12 }, location: { id: 13 }, weekday: "Monday", from_hour: "14:00:00", to_hour: "18:00:00" },
  { id: 25, supplier: { id: 13 }, location: { id: 13 }, weekday: "Saturday", from_hour: "08:00:00", to_hour: "12:00:00" },
  { id: 26, supplier: { id: 13 }, location: { id: 14 }, weekday: "Tuesday", from_hour: "14:00:00", to_hour: "18:00:00" },
  { id: 27, supplier: { id: 14 }, location: { id: 14 }, weekday: "Sunday", from_hour: "08:00:00", to_hour: "12:00:00" },
  { id: 28, supplier: { id: 14 }, location: { id: 15 }, weekday: "Wednesday", from_hour: "14:00:00", to_hour: "18:00:00" },
  { id: 29, supplier: { id: 15 }, location: { id: 15 }, weekday: "Monday", from_hour: "08:00:00", to_hour: "12:00:00" },
  { id: 30, supplier: { id: 15 }, location: { id: 1 }, weekday: "Thursday", from_hour: "14:00:00", to_hour: "18:00:00" },
  { id: 31, supplier: { id: 16 }, location: { id: 1 }, weekday: "Tuesday", from_hour: "08:00:00", to_hour: "12:00:00" },
  { id: 32, supplier: { id: 16 }, location: { id: 2 }, weekday: "Friday", from_hour: "14:00:00", to_hour: "18:00:00" },
  { id: 33, supplier: { id: 17 }, location: { id: 2 }, weekday: "Wednesday", from_hour: "08:00:00", to_hour: "12:00:00" },
  { id: 34, supplier: { id: 17 }, location: { id: 3 }, weekday: "Saturday", from_hour: "14:00:00", to_hour: "18:00:00" },
  { id: 35, supplier: { id: 18 }, location: { id: 3 }, weekday: "Thursday", from_hour: "08:00:00", to_hour: "12:00:00" },
  { id: 36, supplier: { id: 18 }, location: { id: 4 }, weekday: "Sunday", from_hour: "14:00:00", to_hour: "18:00:00" },
  { id: 37, supplier: { id: 19 }, location: { id: 4 }, weekday: "Friday", from_hour: "08:00:00", to_hour: "12:00:00" },
  { id: 38, supplier: { id: 19 }, location: { id: 5 }, weekday: "Monday", from_hour: "14:00:00", to_hour: "18:00:00" },
  { id: 39, supplier: { id: 20 }, location: { id: 5 }, weekday: "Saturday", from_hour: "08:00:00", to_hour: "12:00:00" },
  { id: 40, supplier: { id: 20 }, location: { id: 6 }, weekday: "Tuesday", from_hour: "14:00:00", to_hour: "18:00:00" },
  { id: 41, supplier: { id: 21 }, location: { id: 6 }, weekday: "Sunday", from_hour: "08:00:00", to_hour: "12:00:00" },
  { id: 42, supplier: { id: 21 }, location: { id: 7 }, weekday: "Wednesday", from_hour: "14:00:00", to_hour: "18:00:00" },
  { id: 43, supplier: { id: 22 }, location: { id: 7 }, weekday: "Monday", from_hour: "08:00:00", to_hour: "12:00:00" },
  { id: 44, supplier: { id: 22 }, location: { id: 8 }, weekday: "Thursday", from_hour: "14:00:00", to_hour: "18:00:00" },
  { id: 45, supplier: { id: 23 }, location: { id: 8 }, weekday: "Tuesday", from_hour: "08:00:00", to_hour: "12:00:00" },
  { id: 46, supplier: { id: 23 }, location: { id: 9 }, weekday: "Friday", from_hour: "14:00:00", to_hour: "18:00:00" },
  { id: 47, supplier: { id: 24 }, location: { id: 9 }, weekday: "Wednesday", from_hour: "08:00:00", to_hour: "12:00:00" },
  { id: 48, supplier: { id: 24 }, location: { id: 10 }, weekday: "Saturday", from_hour: "14:00:00", to_hour: "18:00:00" },
  { id: 49, supplier: { id: 25 }, location: { id: 10 }, weekday: "Thursday", from_hour: "08:00:00", to_hour: "12:00:00" },
  { id: 50, supplier: { id: 25 }, location: { id: 11 }, weekday: "Sunday", from_hour: "14:00:00", to_hour: "18:00:00" },
  { id: 51, supplier: { id: 26 }, location: { id: 11 }, weekday: "Friday", from_hour: "08:00:00", to_hour: "12:00:00" },
  { id: 52, supplier: { id: 26 }, location: { id: 12 }, weekday: "Monday", from_hour: "14:00:00", to_hour: "18:00:00" },
  { id: 53, supplier: { id: 27 }, location: { id: 12 }, weekday: "Saturday", from_hour: "08:00:00", to_hour: "12:00:00" },
  { id: 54, supplier: { id: 27 }, location: { id: 13 }, weekday: "Tuesday", from_hour: "14:00:00", to_hour: "18:00:00" },
  { id: 55, supplier: { id: 28 }, location: { id: 13 }, weekday: "Sunday", from_hour: "08:00:00", to_hour: "12:00:00" },
  { id: 56, supplier: { id: 28 }, location: { id: 14 }, weekday: "Wednesday", from_hour: "14:00:00", to_hour: "18:00:00" },
  { id: 57, supplier: { id: 29 }, location: { id: 14 }, weekday: "Monday", from_hour: "08:00:00", to_hour: "12:00:00" },
  { id: 58, supplier: { id: 29 }, location: { id: 15 }, weekday: "Thursday", from_hour: "14:00:00", to_hour: "18:00:00" },
  { id: 59, supplier: { id: 30 }, location: { id: 15 }, weekday: "Tuesday", from_hour: "08:00:00", to_hour: "12:00:00" },
  { id: 60, supplier: { id: 30 }, location: { id: 1 }, weekday: "Friday", from_hour: "14:00:00", to_hour: "18:00:00" },





  { id: 201, supplier: { id: 30 }, location: { id: 16 }, weekday: "Tuesday", from_hour: "08:00:00", to_hour: "12:00:00" },
  { id: 202, supplier: { id: 30 }, location: { id: 16 }, weekday: "Friday", from_hour: "08:00:00", to_hour: "18:00:00" },


  { id: 203, supplier: { id: 7 }, location: { id: 17 }, weekday: "Monday", from_hour: "08:00:00", to_hour: "11:00:00" },
  { id: 204, supplier: { id: 7 }, location: { id: 17 }, weekday: "Wednesday", from_hour: "01:00:00", to_hour: "18:00:00" },
  { id: 205, supplier: { id: 7 }, location: { id: 17 }, weekday: "Saturday", from_hour: "02:00:00", to_hour: "17:00:00" },
  

  { id: 61, supplier: { id: 31 }, location: { id: 1 }, weekday: "Wednesday", from_hour: "08:00:00", to_hour: "12:00:00" },
  { id: 62, supplier: { id: 31 }, location: { id: 2 }, weekday: "Saturday", from_hour: "14:00:00", to_hour: "18:00:00" },
  { id: 63, supplier: { id: 32 }, location: { id: 2 }, weekday: "Thursday", from_hour: "08:00:00", to_hour: "12:00:00" },
  { id: 64, supplier: { id: 32 }, location: { id: 3 }, weekday: "Sunday", from_hour: "14:00:00", to_hour: "18:00:00" },
  { id: 65, supplier: { id: 33 }, location: { id: 3 }, weekday: "Friday", from_hour: "08:00:00", to_hour: "12:00:00" },
  { id: 66, supplier: { id: 33 }, location: { id: 4 }, weekday: "Monday", from_hour: "14:00:00", to_hour: "18:00:00" },
  { id: 67, supplier: { id: 34 }, location: { id: 4 }, weekday: "Saturday", from_hour: "08:00:00", to_hour: "12:00:00" },
  { id: 68, supplier: { id: 34 }, location: { id: 5 }, weekday: "Tuesday", from_hour: "14:00:00", to_hour: "18:00:00" },
  { id: 69, supplier: { id: 35 }, location: { id: 5 }, weekday: "Sunday", from_hour: "08:00:00", to_hour: "12:00:00" },
  { id: 70, supplier: { id: 35 }, location: { id: 6 }, weekday: "Wednesday", from_hour: "14:00:00", to_hour: "18:00:00" },
  { id: 71, supplier: { id: 36 }, location: { id: 6 }, weekday: "Monday", from_hour: "08:00:00", to_hour: "12:00:00" },
  { id: 72, supplier: { id: 36 }, location: { id: 7 }, weekday: "Thursday", from_hour: "14:00:00", to_hour: "18:00:00" },
  { id: 73, supplier: { id: 37 }, location: { id: 7 }, weekday: "Tuesday", from_hour: "08:00:00", to_hour: "12:00:00" },
  { id: 74, supplier: { id: 37 }, location: { id: 8 }, weekday: "Friday", from_hour: "14:00:00", to_hour: "18:00:00" },
  { id: 75, supplier: { id: 38 }, location: { id: 8 }, weekday: "Wednesday", from_hour: "08:00:00", to_hour: "12:00:00" },
  { id: 76, supplier: { id: 38 }, location: { id: 9 }, weekday: "Saturday", from_hour: "14:00:00", to_hour: "18:00:00" },
  { id: 77, supplier: { id: 39 }, location: { id: 9 }, weekday: "Thursday", from_hour: "08:00:00", to_hour: "12:00:00" },
  { id: 78, supplier: { id: 39 }, location: { id: 10 }, weekday: "Sunday", from_hour: "14:00:00", to_hour: "18:00:00" },
  { id: 79, supplier: { id: 40 }, location: { id: 10 }, weekday: "Friday", from_hour: "08:00:00", to_hour: "12:00:00" },
  { id: 80, supplier: { id: 40 }, location: { id: 11 }, weekday: "Monday", from_hour: "14:00:00", to_hour: "18:00:00" },
  { id: 81, supplier: { id: 41 }, location: { id: 11 }, weekday: "Saturday", from_hour: "08:00:00", to_hour: "12:00:00" },
  { id: 82, supplier: { id: 41 }, location: { id: 12 }, weekday: "Tuesday", from_hour: "14:00:00", to_hour: "18:00:00" },
  { id: 83, supplier: { id: 42 }, location: { id: 12 }, weekday: "Sunday", from_hour: "08:00:00", to_hour: "12:00:00" },
  { id: 84, supplier: { id: 42 }, location: { id: 13 }, weekday: "Wednesday", from_hour: "14:00:00", to_hour: "18:00:00" },
  { id: 85, supplier: { id: 43 }, location: { id: 13 }, weekday: "Monday", from_hour: "08:00:00", to_hour: "12:00:00" },
  { id: 86, supplier: { id: 43 }, location: { id: 14 }, weekday: "Thursday", from_hour: "14:00:00", to_hour: "18:00:00" },
  { id: 87, supplier: { id: 44 }, location: { id: 14 }, weekday: "Tuesday", from_hour: "08:00:00", to_hour: "12:00:00" },
  { id: 88, supplier: { id: 44 }, location: { id: 15 }, weekday: "Friday", from_hour: "14:00:00", to_hour: "18:00:00" },
  { id: 89, supplier: { id: 45 }, location: { id: 15 }, weekday: "Wednesday", from_hour: "08:00:00", to_hour: "12:00:00" },
  { id: 90, supplier: { id: 45 }, location: { id: 1 }, weekday: "Saturday", from_hour: "14:00:00", to_hour: "18:00:00" },
  { id: 91, supplier: { id: 46 }, location: { id: 1 }, weekday: "Thursday", from_hour: "08:00:00", to_hour: "12:00:00" },
  { id: 92, supplier: { id: 46 }, location: { id: 2 }, weekday: "Sunday", from_hour: "14:00:00", to_hour: "18:00:00" },
  { id: 93, supplier: { id: 47 }, location: { id: 2 }, weekday: "Friday", from_hour: "08:00:00", to_hour: "12:00:00" },
  { id: 94, supplier: { id: 47 }, location: { id: 3 }, weekday: "Monday", from_hour: "14:00:00", to_hour: "18:00:00" },
  { id: 95, supplier: { id: 48 }, location: { id: 3 }, weekday: "Saturday", from_hour: "08:00:00", to_hour: "12:00:00" },
  { id: 96, supplier: { id: 48 }, location: { id: 4 }, weekday: "Tuesday", from_hour: "14:00:00", to_hour: "18:00:00" },
  { id: 97, supplier: { id: 49 }, location: { id: 4 }, weekday: "Sunday", from_hour: "08:00:00", to_hour: "12:00:00" },
  { id: 98, supplier: { id: 49 }, location: { id: 5 }, weekday: "Wednesday", from_hour: "14:00:00", to_hour: "18:00:00" },
  { id: 99, supplier: { id: 50 }, location: { id: 5 }, weekday: "Monday", from_hour: "08:00:00", to_hour: "12:00:00" },
  { id: 100, supplier: { id: 50 }, location: { id: 6 }, weekday: "Thursday", from_hour: "14:00:00", to_hour: "18:00:00" },
  { id: 101, supplier: { id: 51 }, location: { id: 6 }, weekday: "Tuesday", from_hour: "08:00:00", to_hour: "12:00:00" },
  { id: 102, supplier: { id: 51 }, location: { id: 7 }, weekday: "Friday", from_hour: "14:00:00", to_hour: "18:00:00" },

  { id: 103, supplier: { id: 52 }, location: { id: 7 }, weekday: "Wednesday", from_hour: "08:00:00", to_hour: "12:00:00" },
  { id: 104, supplier: { id: 52 }, location: { id: 8 }, weekday: "Saturday", from_hour: "14:00:00", to_hour: "18:00:00" },

  { id: 105, supplier: { id: 53 }, location: { id: 8 }, weekday: "Thursday", from_hour: "08:00:00", to_hour: "12:00:00" },
  { id: 106, supplier: { id: 53 }, location: { id: 9 }, weekday: "Sunday", from_hour: "14:00:00", to_hour: "18:00:00" },

  { id: 107, supplier: { id: 54 }, location: { id: 9 }, weekday: "Friday", from_hour: "08:00:00", to_hour: "12:00:00" },
  { id: 108, supplier: { id: 54 }, location: { id: 10 }, weekday: "Monday", from_hour: "14:00:00", to_hour: "18:00:00" },

  { id: 109, supplier: { id: 55 }, location: { id: 10 }, weekday: "Saturday", from_hour: "08:00:00", to_hour: "12:00:00" },
  { id: 110, supplier: { id: 55 }, location: { id: 11 }, weekday: "Tuesday", from_hour: "14:00:00", to_hour: "18:00:00" },

  { id: 111, supplier: { id: 56 }, location: { id: 11 }, weekday: "Sunday", from_hour: "08:00:00", to_hour: "12:00:00" },
  { id: 112, supplier: { id: 56 }, location: { id: 12 }, weekday: "Wednesday", from_hour: "14:00:00", to_hour: "18:00:00" },

  { id: 113, supplier: { id: 57 }, location: { id: 12 }, weekday: "Monday", from_hour: "08:00:00", to_hour: "12:00:00" },
  { id: 114, supplier: { id: 57 }, location: { id: 13 }, weekday: "Thursday", from_hour: "14:00:00", to_hour: "18:00:00" },

  { id: 115, supplier: { id: 58 }, location: { id: 13 }, weekday: "Tuesday", from_hour: "08:00:00", to_hour: "12:00:00" },
  { id: 116, supplier: { id: 58 }, location: { id: 14 }, weekday: "Friday", from_hour: "14:00:00", to_hour: "18:00:00" },

  { id: 117, supplier: { id: 59 }, location: { id: 14 }, weekday: "Wednesday", from_hour: "08:00:00", to_hour: "12:00:00" },
  { id: 118, supplier: { id: 59 }, location: { id: 15 }, weekday: "Saturday", from_hour: "14:00:00", to_hour: "18:00:00" },

  { id: 119, supplier: { id: 60 }, location: { id: 15 }, weekday: "Thursday", from_hour: "08:00:00", to_hour: "12:00:00" },
  { id: 120, supplier: { id: 60 }, location: { id: 1 }, weekday: "Sunday", from_hour: "14:00:00", to_hour: "18:00:00" },

  { id: 121, supplier: { id: 61 }, location: { id: 1 }, weekday: "Friday", from_hour: "08:00:00", to_hour: "12:00:00" },
  { id: 122, supplier: { id: 61 }, location: { id: 2 }, weekday: "Monday", from_hour: "14:00:00", to_hour: "18:00:00" },

  { id: 123, supplier: { id: 62 }, location: { id: 2 }, weekday: "Saturday", from_hour: "08:00:00", to_hour: "12:00:00" },
  { id: 124, supplier: { id: 62 }, location: { id: 3 }, weekday: "Tuesday", from_hour: "14:00:00", to_hour: "18:00:00" },

  { id: 125, supplier: { id: 63 }, location: { id: 3 }, weekday: "Sunday", from_hour: "08:00:00", to_hour: "12:00:00" },
  { id: 126, supplier: { id: 63 }, location: { id: 4 }, weekday: "Wednesday", from_hour: "14:00:00", to_hour: "18:00:00" },

  { id: 127, supplier: { id: 64 }, location: { id: 4 }, weekday: "Monday", from_hour: "08:00:00", to_hour: "12:00:00" },
  { id: 128, supplier: { id: 64 }, location: { id: 5 }, weekday: "Thursday", from_hour: "14:00:00", to_hour: "18:00:00" },

  { id: 129, supplier: { id: 65 }, location: { id: 5 }, weekday: "Tuesday", from_hour: "08:00:00", to_hour: "12:00:00" },
  { id: 130, supplier: { id: 65 }, location: { id: 6 }, weekday: "Friday", from_hour: "14:00:00", to_hour: "18:00:00" },

  { id: 131, supplier: { id: 66 }, location: { id: 6 }, weekday: "Wednesday", from_hour: "08:00:00", to_hour: "12:00:00" },
  { id: 132, supplier: { id: 66 }, location: { id: 7 }, weekday: "Saturday", from_hour: "14:00:00", to_hour: "18:00:00" },

  { id: 133, supplier: { id: 67 }, location: { id: 7 }, weekday: "Thursday", from_hour: "08:00:00", to_hour: "12:00:00" },
  { id: 134, supplier: { id: 67 }, location: { id: 8 }, weekday: "Sunday", from_hour: "14:00:00", to_hour: "18:00:00" },

  { id: 135, supplier: { id: 68 }, location: { id: 8 }, weekday: "Friday", from_hour: "08:00:00", to_hour: "12:00:00" },
  { id: 136, supplier: { id: 68 }, location: { id: 9 }, weekday: "Monday", from_hour: "14:00:00", to_hour: "18:00:00" },

  { id: 137, supplier: { id: 69 }, location: { id: 9 }, weekday: "Saturday", from_hour: "08:00:00", to_hour: "12:00:00" },
  { id: 138, supplier: { id: 69 }, location: { id: 10 }, weekday: "Tuesday", from_hour: "14:00:00", to_hour: "18:00:00" },

  { id: 139, supplier: { id: 70 }, location: { id: 10 }, weekday: "Sunday", from_hour: "08:00:00", to_hour: "12:00:00" },
  { id: 140, supplier: { id: 70 }, location: { id: 11 }, weekday: "Wednesday", from_hour: "14:00:00", to_hour: "18:00:00" },

  { id: 141, supplier: { id: 71 }, location: { id: 11 }, weekday: "Monday", from_hour: "08:00:00", to_hour: "12:00:00" },
  { id: 142, supplier: { id: 71 }, location: { id: 12 }, weekday: "Thursday", from_hour: "14:00:00", to_hour: "18:00:00" },

  { id: 143, supplier: { id: 72 }, location: { id: 12 }, weekday: "Tuesday", from_hour: "08:00:00", to_hour: "12:00:00" },
  { id: 144, supplier: { id: 72 }, location: { id: 13 }, weekday: "Friday", from_hour: "14:00:00", to_hour: "18:00:00" },

  { id: 145, supplier: { id: 73 }, location: { id: 13 }, weekday: "Wednesday", from_hour: "08:00:00", to_hour: "12:00:00" },
  { id: 146, supplier: { id: 73 }, location: { id: 14 }, weekday: "Saturday", from_hour: "14:00:00", to_hour: "18:00:00" },

  { id: 147, supplier: { id: 74 }, location: { id: 14 }, weekday: "Thursday", from_hour: "08:00:00", to_hour: "12:00:00" },
  { id: 148, supplier: { id: 74 }, location: { id: 15 }, weekday: "Sunday", from_hour: "14:00:00", to_hour: "18:00:00" },

  { id: 149, supplier: { id: 75 }, location: { id: 15 }, weekday: "Friday", from_hour: "08:00:00", to_hour: "12:00:00" },
  { id: 150, supplier: { id: 75 }, location: { id: 1 }, weekday: "Monday", from_hour: "14:00:00", to_hour: "18:00:00" },

  { id: 151, supplier: { id: 76 }, location: { id: 1 }, weekday: "Saturday", from_hour: "08:00:00", to_hour: "12:00:00" },
  { id: 152, supplier: { id: 76 }, location: { id: 2 }, weekday: "Tuesday", from_hour: "14:00:00", to_hour: "18:00:00" },

  { id: 153, supplier: { id: 77 }, location: { id: 2 }, weekday: "Sunday", from_hour: "08:00:00", to_hour: "12:00:00" },
  { id: 154, supplier: { id: 77 }, location: { id: 3 }, weekday: "Wednesday", from_hour: "14:00:00", to_hour: "18:00:00" },

  { id: 155, supplier: { id: 78 }, location: { id: 3 }, weekday: "Monday", from_hour: "08:00:00", to_hour: "12:00:00" },
  { id: 156, supplier: { id: 78 }, location: { id: 4 }, weekday: "Thursday", from_hour: "14:00:00", to_hour: "18:00:00" },

  { id: 157, supplier: { id: 79 }, location: { id: 4 }, weekday: "Tuesday", from_hour: "08:00:00", to_hour: "12:00:00" },
  { id: 158, supplier: { id: 79 }, location: { id: 5 }, weekday: "Friday", from_hour: "14:00:00", to_hour: "18:00:00" },

  { id: 159, supplier: { id: 80 }, location: { id: 5 }, weekday: "Wednesday", from_hour: "08:00:00", to_hour: "12:00:00" },
  { id: 160, supplier: { id: 80 }, location: { id: 6 }, weekday: "Saturday", from_hour: "14:00:00", to_hour: "18:00:00" },

  { id: 161, supplier: { id: 81 }, location: { id: 6 }, weekday: "Thursday", from_hour: "08:00:00", to_hour: "12:00:00" },
  { id: 162, supplier: { id: 81 }, location: { id: 7 }, weekday: "Sunday", from_hour: "14:00:00", to_hour: "18:00:00" },

  { id: 163, supplier: { id: 82 }, location: { id: 7 }, weekday: "Friday", from_hour: "08:00:00", to_hour: "12:00:00" },
  { id: 164, supplier: { id: 82 }, location: { id: 8 }, weekday: "Monday", from_hour: "14:00:00", to_hour: "18:00:00" },

  { id: 165, supplier: { id: 83 }, location: { id: 8 }, weekday: "Saturday", from_hour: "08:00:00", to_hour: "12:00:00" },
  { id: 166, supplier: { id: 83 }, location: { id: 9 }, weekday: "Tuesday", from_hour: "14:00:00", to_hour: "18:00:00" },

  { id: 167, supplier: { id: 84 }, location: { id: 9 }, weekday: "Sunday", from_hour: "08:00:00", to_hour: "12:00:00" },
  { id: 168, supplier: { id: 84 }, location: { id: 10 }, weekday: "Wednesday", from_hour: "14:00:00", to_hour: "18:00:00" },

  { id: 169, supplier: { id: 85 }, location: { id: 10 }, weekday: "Monday", from_hour: "08:00:00", to_hour: "12:00:00" },
  { id: 170, supplier: { id: 85 }, location: { id: 11 }, weekday: "Thursday", from_hour: "14:00:00", to_hour: "18:00:00" },

  { id: 171, supplier: { id: 86 }, location: { id: 11 }, weekday: "Tuesday", from_hour: "08:00:00", to_hour: "12:00:00" },
  { id: 172, supplier: { id: 86 }, location: { id: 12 }, weekday: "Friday", from_hour: "14:00:00", to_hour: "18:00:00" },

  { id: 173, supplier: { id: 87 }, location: { id: 12 }, weekday: "Wednesday", from_hour: "08:00:00", to_hour: "12:00:00" },
  { id: 174, supplier: { id: 87 }, location: { id: 13 }, weekday: "Saturday", from_hour: "14:00:00", to_hour: "18:00:00" },

  { id: 175, supplier: { id: 88 }, location: { id: 13 }, weekday: "Thursday", from_hour: "08:00:00", to_hour: "12:00:00" },
  { id: 176, supplier: { id: 88 }, location: { id: 14 }, weekday: "Sunday", from_hour: "14:00:00", to_hour: "18:00:00" },

  { id: 177, supplier: { id: 89 }, location: { id: 14 }, weekday: "Friday", from_hour: "08:00:00", to_hour: "12:00:00" },
  { id: 178, supplier: { id: 89 }, location: { id: 15 }, weekday: "Monday", from_hour: "14:00:00", to_hour: "18:00:00" },

  { id: 179, supplier: { id: 90 }, location: { id: 15 }, weekday: "Saturday", from_hour: "08:00:00", to_hour: "12:00:00" },
  { id: 180, supplier: { id: 90 }, location: { id: 1 }, weekday: "Tuesday", from_hour: "14:00:00", to_hour: "18:00:00" },

  { id: 181, supplier: { id: 91 }, location: { id: 1 }, weekday: "Sunday", from_hour: "08:00:00", to_hour: "12:00:00" },
  { id: 182, supplier: { id: 91 }, location: { id: 2 }, weekday: "Wednesday", from_hour: "14:00:00", to_hour: "18:00:00" },

  { id: 183, supplier: { id: 92 }, location: { id: 2 }, weekday: "Monday", from_hour: "08:00:00", to_hour: "12:00:00" },
  { id: 184, supplier: { id: 92 }, location: { id: 3 }, weekday: "Thursday", from_hour: "14:00:00", to_hour: "18:00:00" },

  { id: 185, supplier: { id: 93 }, location: { id: 3 }, weekday: "Tuesday", from_hour: "08:00:00", to_hour: "12:00:00" },
  { id: 186, supplier: { id: 93 }, location: { id: 4 }, weekday: "Friday", from_hour: "14:00:00", to_hour: "18:00:00" },

  { id: 187, supplier: { id: 94 }, location: { id: 4 }, weekday: "Wednesday", from_hour: "08:00:00", to_hour: "12:00:00" },
  { id: 188, supplier: { id: 94 }, location: { id: 5 }, weekday: "Saturday", from_hour: "14:00:00", to_hour: "18:00:00" },

  { id: 189, supplier: { id: 95 }, location: { id: 5 }, weekday: "Thursday", from_hour: "08:00:00", to_hour: "12:00:00" },
  { id: 190, supplier: { id: 95 }, location: { id: 6 }, weekday: "Sunday", from_hour: "14:00:00", to_hour: "18:00:00" },

  { id: 191, supplier: { id: 96 }, location: { id: 6 }, weekday: "Friday", from_hour: "08:00:00", to_hour: "12:00:00" },
  { id: 192, supplier: { id: 96 }, location: { id: 7 }, weekday: "Monday", from_hour: "14:00:00", to_hour: "18:00:00" },

  { id: 193, supplier: { id: 97 }, location: { id: 7 }, weekday: "Saturday", from_hour: "08:00:00", to_hour: "12:00:00" },
  { id: 194, supplier: { id: 97 }, location: { id: 8 }, weekday: "Tuesday", from_hour: "14:00:00", to_hour: "18:00:00" },

  { id: 195, supplier: { id: 98 }, location: { id: 8 }, weekday: "Sunday", from_hour: "08:00:00", to_hour: "12:00:00" },
  { id: 196, supplier: { id: 98 }, location: { id: 9 }, weekday: "Wednesday", from_hour: "14:00:00", to_hour: "18:00:00" },

  { id: 197, supplier: { id: 99 }, location: { id: 9 }, weekday: "Monday", from_hour: "08:00:00", to_hour: "12:00:00" },
  { id: 198, supplier: { id: 99 }, location: { id: 10 }, weekday: "Thursday", from_hour: "14:00:00", to_hour: "18:00:00" },

  { id: 199, supplier: { id: 100 }, location: { id: 10 }, weekday: "Tuesday", from_hour: "08:00:00", to_hour: "12:00:00" },
  { id: 200, supplier: { id: 100 }, location: { id: 11 }, weekday: "Friday", from_hour: "14:00:00", to_hour: "18:00:00" },
];

await availabilityRepository.upsert(availabilities, ["id"]);














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
    action_url: "https://vitalkink.netlify.app/medicos/citas",
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
    action_url: "https://vitalkink.netlify.app/pacientes/citas",
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
    action_url: "https://vitalkink.netlify.app/medicos/citas",
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
    action_url: "https://vitalkink.netlify.app/pacientes/citas",
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
    action_url: "https://vitalkink.netlify.app/pacientes/citas",
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
    action_url: "https://vitalkink.netlify.app/medicos/citas",
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
    action_url: "https://vitalkink.netlify.app/pacientes/citas",
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
    action_url: "https://vitalkink.netlify.app/medicos/citas",
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
    action_url: "https://vitalkink.netlify.app/pacientes/citas",
    action_text: "Ir a Vitalink",
    language: "es",
    
  },
  {
    code: "appointmentCreditStep1",
    type: "APPOINTMENT",
    subject: "Solicitud de credito",
    message: "El paciente {{ patientName }} ha solicitado un credito de {{ Amount }} para el procedimiento {{ procedureName }} del médico/centro médico {{ supplierName }}",
    another_message: "El paciente {{ patientName }} ha solicitado un credito de {{ Amount }} para el procedimiento {{ procedureName }} del médico/centro médico {{ supplierName }}",
    required_send_email: true,
    text_from_email_message_json: true,
    email_template: "genericTemplateButtonEmail",
    action_url: "https://vitalkink.netlify.app/socio-financiero/inicio",
    action_text: "Ir a Vitalink",
    language: "es",
    
  },
  {
    code: "appointmentCreditStep2",
    type: "APPOINTMENT",
    subject: "Credito Aprobado",
    message: "La Asociacion Solidarista {{ financeEntityName }} ha aprobado el credito por un monto de {{ Amount }} para el procedimiento {{ procedureName }}. Por favor revisa el documento de pagare.",
    another_message: "La Asociacion Solidarista {{ financeEntityName }} ha aprobado el credito por un monto de {{ Amount }} para el procedimiento {{ procedureName }}",
    required_send_email: true,
    text_from_email_message_json: true,
    email_template: "genericTemplateButtonEmail",
    action_url: "https://vitalkink.netlify.app/pacientes/citas",
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
    action_url: "https://vitalkink.netlify.app/pacientes/citas",
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
    action_url: "https://vitalkink.netlify.app/socio-financiero/inicio",
    action_text: "Ir a Vitalink",
    language: "es"
  }
];

await notificationRepository.upsert(notifications, ["code"]);
console.log("Seeds done!");

}

runSeed().catch((error) => console.error(error));