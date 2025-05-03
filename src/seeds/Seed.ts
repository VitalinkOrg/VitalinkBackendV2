//*************************************** */
//              Configuration
//*************************************** */
import path from 'path';
import ConfigManager from '@TenshiJS/config/ConfigManager';
import { v4 as uuidv4 } from 'uuid';

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
import { ProcedureBySpecialty } from '@index/entity/ProcedureBySpecialty';
import { Package } from '@index/entity/Package';
import { PreRegisterUser } from '@index/entity/PreRegisterUser';
import { CertificationsExperience } from '@index/entity/CertificationsExperience';
import { LanguageSupplier } from '@index/entity/LanguageSupplier';
import { Availability } from '@index/entity/Availability';
import { Appointment } from '@index/entity/Appointment';
import { AppointmentCredit } from '@index/entity/AppointmentCredit';
import { Review } from '@index/entity/Review';
import { ReviewDetail } from '@index/entity/ReviewDetail';
import { isNull } from 'util';


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
          ProcedureBySpecialty,
          Package,
          PreRegisterUser,
          CertificationsExperience,
          LanguageSupplier,
          Availability,
          Appointment,
          AppointmentCredit,
          Review,
          ReviewDetail
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


    /*
        Unit Dynamic Central Data Set
    */
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
        ];
        
        await locationRepository.upsert(locations, ["name"]);
        




        //*************************************** */
        //              User
        //*************************************** */

        const userRepository = await dataSource.getRepository(User);
        // Hash passwords
        const password = await hashPassword("Vitatest25*");

        const financeEntities = [
          {
              id: "8401b1be-7e1d-4357-a632-15172a647b8d",
              card_id: "5-6789-1234",
              id_type: { code: "JURIDICAL_DNI" },
              name: "Banco Financiero Costa Rica",
              email: "bancofinanciero@example.com",
              user_name: "bancofinanciero",
              phone_number: "2200-1234",
              password,
              country_iso_code: "CRC",
              province: "San José",
              address: "Edificio Principal BCR",
              city_name: "San José",
              postal_code: "10102",
              role_code: "FINANCE_ENTITY",
          },
          {
              id: "c0ecccb1-6c2f-407f-b39f-6f5c2af11640",
              card_id: "6-9876-5432",
              id_type: { code: "JURIDICAL_DNI" },
              name: "Cooperativa de Ahorro",
              email: "coopahorro@example.com",
              user_name: "coopahorro",
              phone_number: "2299-5432",
              password,
              country_iso_code: "CRC",
              province: "Cartago",
              address: "Torre Financiera",
              city_name: "Cartago",
              postal_code: "30102",
              role_code: "FINANCE_ENTITY",
          }
      ];
      

        await userRepository.upsert(financeEntities, ["email"]);

        const legalRepresentatives = [
          {
              id: "d0b47084-2888-4e7e-9347-0aa62fb6aa8f",
              card_id: "1-1234-5678",
              id_type: { code: "PHYSICAL_DNI" },
              name: "Gabriela Ulate",
              email: "gulate@example.com",
              user_name: "gulate",
              phone_number: "8888-5678",
              password,
              country_iso_code: "CRC",
              province: "Alajuela",
              address: "Oficinas Legales Central",
              city_name: "Alajuela",
              postal_code: "20101",
              role_code: "LEGAL_REPRESENTATIVE",
          },
          {
              id: "9c7dac5a-bb08-4956-915b-3edcda695f44",
              card_id: "2-8765-4321",
              id_type: { code: "PHYSICAL_DNI" },
              name: "Carlos Mendoza",
              email: "cmendoza@example.com",
              user_name: "cmendoza",
              phone_number: "8877-4321",
              password,
              country_iso_code: "CRC",
              province: "Heredia",
              address: "Centro Empresarial Heredia",
              city_name: "Heredia",
              postal_code: "40101",
              role_code: "LEGAL_REPRESENTATIVE",
          },
          {
              id: "a1192e7e-7d99-4938-a98a-c0438fd8e4e8",
              card_id: "3-5678-9876",
              id_type: { code: "JURIDICAL_DNI" },
              name: "Hospital Clínica Santa Fe",
              email: "clinicasantafe@example.com",
              user_name: "clinicasantafe",
              phone_number: "2222-5678",
              password,
              country_iso_code: "CRC",
              province: "San José",
              address: "Av. Central, San José",
              city_name: "San José",
              postal_code: "10104",
              role_code: "LEGAL_REPRESENTATIVE",
          },
          {
              id: "6efb1276-5db2-4752-991a-31a32b31d95a",
              card_id: "4-6543-2109",
              id_type: { code: "JURIDICAL_DNI" },
              name: "Centro Médico del Pacífico",
              email: "medicopacifico@example.com",
              user_name: "medicopacifico",
              phone_number: "2266-2109",
              password,
              country_iso_code: "CRC",
              province: "Puntarenas",
              address: "Centro de Puntarenas",
              city_name: "Puntarenas",
              postal_code: "60101",
              role_code: "LEGAL_REPRESENTATIVE",
          },
          {
              id: "892dfdc0-3fc3-4910-a9ad-e052f320e7a6",
              card_id: "00000000",
              id_type: { code: "JURIDICAL_DNI" },
              name: "Clínica Bíbilica",
              email: "clinicabiblica@example.com",
              user_name: "cbiblica",
              phone_number: "2266-2109",
              password,
              country_iso_code: "CRC",
              province: "San José",
              address: "Centro Medico Central",
              city_name: "Curridabat",
              postal_code: "60101",
              role_code: "LEGAL_REPRESENTATIVE",
          }
      ];
      

        await userRepository.upsert(legalRepresentatives, ["email"]);

        // CUSTOMERS (Todos con una finance_entity asignada)
        const customers = [
          {
              id: "f1635823-7d9a-4df9-bd1e-ad8bd985de0b",
              card_id: "5-2345-6789",
              id_type: { code: "PHYSICAL_DNI" },
              name: "Luis Fernández",
              email: "lfernandez@example.com",
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
          },
          {
              id: "728237d9-c16d-4ca8-bbbe-240a697fb3c3",
              card_id: "6-5432-1987",
              id_type: { code: "PHYSICAL_DNI" },
              name: "María Jiménez",
              email: "mjimenez@example.com",
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
          },
          {
              id: "a1ea46aa-0dce-4c15-bea5-26ef6c83d27b",
              card_id: "7-4567-8901",
              id_type: { code: "PHYSICAL_DNI" },
              name: "Daniela Solano",
              email: "dsolano@example.com",
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
          },
          {
              id: "fd77bb90-9ac5-411e-9924-86cf4f529a5e",
              card_id: "8-6789-4321",
              id_type: { code: "PHYSICAL_DNI" },
              name: "José Marín",
              email: "jmarin@example.com",
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
          }
      ];
      

        await userRepository.upsert(customers, ["email"]);






 




  const supplierRepository = dataSource.getRepository(Supplier);

const suppliers = [
    // Médicos
    {
        id:1,
        id_type: { code: "PHYSICAL_DNI" }, // Debe ser un objeto
        card_id: "1-9876-5432",
        num_medical_enrollment: "CR-2023456",
        name: "Alejandro Vargas",
        phone_number: "8812-3456",
        email: "avargas@example.com",
        country_iso_code: "CRC",
        province: "San José",
        city_name: "San José",
        postal_code: "10104",
        profile_picture_url: null,
        description: "Especialista en cirugía cardiovascular con más de 15 años de experiencia.",
        address: "Clínica Santa Fe, San José",
        latitude: 9.9333,
        longitude: -84.0833,
        experience_years: 15,
        patients_number: 2500,
        is_hospital: false,
        our_history: null,
        mission: null,
        vision: null,
        code_card_id_file: null,
        code_medical_license_file: null,
        medical_type: { code: "SPECIALTY_MEDICAL" }, // Debe ser un objeto
        legal_representative: { id: legalRepresentatives[0].id }, // Debe ser un objeto con id
    },
    {
        id:2,
        id_type: { code: "PHYSICAL_DNI" },
        card_id: "2-6543-2109",
        num_medical_enrollment: "CR-2019876",
        name: "Sofía Araya",
        phone_number: "8844-2109",
        email: "saraya@example.com",
        country_iso_code: "CRC",
        province: "Heredia",
        city_name: "Heredia",
        postal_code: "40101",
        profile_picture_url: null,
        description: "Dermatóloga certificada, especializada en tratamientos de piel y estética.",
        address: "Centro Médico del Pacífico, Puntarenas",
        latitude: 9.9796,
        longitude: -84.1005,
        experience_years: 12,
        patients_number: 1800,
        is_hospital: false,
        our_history: null,
        mission: null,
        vision: null,
        code_card_id_file: null,
        code_medical_license_file: null,
        medical_type: { code: "SPECIALTY_MEDICAL" },
        legal_representative: { id: legalRepresentatives[0].id },
    },
    {
        id:3,
        id_type: { code: "PHYSICAL_DNI" },
        card_id: "3-5432-1098",
        num_medical_enrollment: "CR-2005678",
        name: "Fernando López",
        phone_number: "8877-1098",
        email: "flopez@example.com",
        country_iso_code: "CRC",
        province: "Cartago",
        city_name: "Cartago",
        postal_code: "30102",
        profile_picture_url: null,
        description: "Médico general con amplia experiencia en atención primaria y urgencias.",
        address: "Clínica Zahha, Curridabat",
        latitude: 9.9156,
        longitude: -84.0306,
        experience_years: 10,
        patients_number: 3200,
        is_hospital: false,
        our_history: null,
        mission: null,
        vision: null,
        code_card_id_file: null,
        code_medical_license_file: null,
        medical_type: { code: "GENERAL_MEDICAL" },
        legal_representative: { id: legalRepresentatives[1].id },
    },

    // Hospitales (Sedes Principales)
    {
        id:4,
        id_type: { code: "JURIDICAL_DNI" },
        card_id: "J-123456-001",
        num_medical_enrollment: null,
        name: "Hospital Clínica Santa Fe - Sede Central",
        phone_number: "2222-5678",
        email: "contacto@clinicasantafe.com",
        country_iso_code: "CRC",
        province: "San José",
        city_name: "San José",
        postal_code: "10104",
        profile_picture_url: null,
        description: "Uno de los hospitales más prestigiosos del país, ofreciendo atención integral.",
        address: "Av. Central, San José",
        latitude: 9.9333,
        longitude: -84.0833,
        experience_years: null,
        patients_number: null,
        is_hospital: true,
        our_history: "Fundado en 1985, nuestro hospital ha brindado atención médica de calidad.",
        mission: "Brindar salud con excelencia.",
        vision: "Ser el hospital líder en Latinoamérica.",
        code_card_id_file: null,
        code_medical_license_file: null,
        medical_type: null,
        legal_representative: { id: legalRepresentatives[2].id },
    },
    {
        id:5,
        id_type: { code: "JURIDICAL_DNI" },
        card_id: "J-654321-002",
        num_medical_enrollment: null,
        name: "Centro Médico del Pacífico - Sede Central",
        phone_number: "2266-2109",
        email: "contacto@medicopacifico.com",
        country_iso_code: "CRC",
        province: "Puntarenas",
        city_name: "Puntarenas",
        postal_code: "60101",
        profile_picture_url: null,
        description: "Centro médico de referencia en la región del Pacífico.",
        address: "Centro de Puntarenas",
        latitude: 9.9796,
        longitude: -84.1005,
        experience_years: null,
        patients_number: null,
        is_hospital: true,
        our_history: "Desde 1990, hemos atendido miles de pacientes con calidad y calidez.",
        mission: "Ofrecer salud con innovación.",
        vision: "Expandir nuestros servicios en todo Costa Rica.",
        code_card_id_file: null,
        code_medical_license_file: null,
        medical_type: null,
        legal_representative: { id: legalRepresentatives[2].id },
    },
    {
        id:6,
        id_type: { code: "JURIDICAL_DNI" },
        card_id: "000000000",
        num_medical_enrollment: null,
        name: "Oftalmóloga 1 ",
        phone_number: "2266-2109",
        email: "contacto@clinicabiblica.com",
        country_iso_code: "CRC",
        province: "San José",
        city_name: "San José",
        postal_code: "60101",
        profile_picture_url: null,
        description: null,
        address: null,
        latitude: 9.9796,
        longitude: -84.1005,
        experience_years: null,
        patients_number: null,
        is_hospital: true,
        our_history: "Desde 1990, hemos atendido miles de pacientes con calidad y calidez.",
        mission: "Ofrecer salud con innovación.",
        vision: "Expandir nuestros servicios en todo Costa Rica.",
        code_card_id_file: null,
        code_medical_license_file: null,
        medical_type: null,
        legal_representative: { id: legalRepresentatives[4].id },
    }
];

await supplierRepository.upsert(suppliers, ["card_id"]);

  




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
];

await specialtyRepository.upsert(specialties, ["id"]);





const procedureRepository = dataSource.getRepository(ProcedureBySpecialty);

// Asignamos procedimientos a cada especialidad
const procedures = [
    // Oftalmología
    { id: 1, specialty: { id: 2 }, procedure: { code: "REFRACTIVE_SURGERY" } }, // Cirugía de Miopía
    { id: 2, specialty: { id: 2 }, procedure: { code: "CATARACT_SURGERY" } }, // Cirugía de Cataratas

    // Neurología
    { id: 4, specialty: { id: 3 }, procedure: { code: "EPILEPSY_TREATMENT" } }, // Tratamiento de Epilepsia
    { id: 5, specialty: { id: 3 }, procedure: { code: "PARKINSON_TREATMENT" } }, // Tratamiento de Parkinson

    // Cardiología
    { id: 6, specialty: { id: 1 }, procedure: { code: "CARDIO_INTERVENTION" } }, // Intervención Cardiovascular
    { id: 7, specialty: { id: 1 }, procedure: { code: "PACEMAKER_IMPLANT" } }, // Marcapasos

    // Gastroenterología
    { id: 10, specialty: { id: 7 }, procedure: { code: "GASTRO_ENDOSCOPY" } }, // Endoscopía Digestiva
    { id: 11, specialty: { id: 7 }, procedure: { code: "GASTRO_ULCER_TREATMENT" } }, // Tratamiento de Úlceras

    // Ortopedia
    { id: 12, specialty: { id: 9 }, procedure: { code: "ORTHO_KNEE_SURGERY" } }, // Cirugía de Rodilla
    { id: 13, specialty: { id: 9 }, procedure: { code: "ORTHO_SHOULDER_SURGERY" } }, // Cirugía de Hombro*/

     // Oftalmología
     { id: 14, specialty: { id: 10 }, procedure: { code: "CATARACT_SURGERY" } }, // MONOFOCAL
     { id: 15, specialty: { id: 10 }, procedure: { code: "REFRACTIVE_SURGERY" } }, //MULTIFOCAL
];

await procedureRepository.upsert(procedures, ["id"]);




const packageRepository = dataSource.getRepository(Package);

const packages = [
    {
        id: 1,
        procedure: { id: 1 }, // Cirugía de Miopía
        product: { code: "REFRACTIVE_PRK" },
        discount: 10.00,
        services_offer: { "ASSESSMENT_DETAILS": ["GENERAL_ANESTHESIA", "POSTOP_ULTRASOUND", "POSTOP_PHYSIOTHERAPY"] },
    },
    {
        id: 2,
        procedure: { id: 1 }, 
        product: { code: "REFRACTIVE_LASIK" },
        discount: 5.00,
        services_offer: { "ASSESSMENT_DETAILS": ["GENERAL_ANESTHESIA", "POSTOP_CT", "POSTOP_PAIN_CONTROL"] },
    },
    {
        id: 3,
        procedure: { id: 1 }, 
        product: { code: "REFRACTIVE_LASIK_GUIDED" },
        discount: 8.00,
        services_offer: { "ASSESSMENT_DETAILS": ["REGIONAL_ANESTHESIA", "POSTOP_XRAY", "POSTOP_SURGEON_FOLLOWUP"] },
    },
    {
        id: 4,
        procedure: { id: 6 }, // Intervención Cardiovascular
        product: { code: "CARDIO_STENT" },
        discount: 7.50,
        services_offer: { "ASSESSMENT_DETAILS": ["GENERAL_ANESTHESIA", "SURGICAL_RISK_ASSESSMENT", "POSTOP_PHYSIOTHERAPY"] }
    },
    {
        id: 5,
        procedure: { id: 6 },
        product: { code: "CARDIO_BYPASS" },
        discount: 15.00,
        services_offer: { "ASSESSMENT_DETAILS": ["GENERAL_ANESTHESIA", "POSTOP_CT", "POSTOP_PAIN_CONTROL"] },
    },
    {
        id: 6,
        procedure: { id: 10 }, // Endoscopía Digestiva
        product: { code: "GASTRO_COLONOSCOPY" },
        discount: 5.00,
        services_offer: { "ASSESSMENT_DETAILS": ["PREOPERATIVE_ASSESSMENT", "POSTOP_ULTRASOUND"] },
    },
    {
        id: 7,
        procedure: { id: 10 },
        product: { code: "GASTRO_GASTROSCOPY" },
        discount: 4.00,
        services_offer: { "ASSESSMENT_DETAILS": ["PREOPERATIVE_ASSESSMENT", "POSTOP_MEDICATIONS"] },
    },
    {
        id: 8,
        procedure: { id: 12 }, // Cirugía de Rodilla
        product: { code: "ORTHO_KNEE_REPLACEMENT" },
        discount: 12.00,
        services_offer: { "ASSESSMENT_DETAILS": ["GENERAL_ANESTHESIA", "POSTOP_REHAB", "POSTOP_PHYSIOTHERAPY"] },
    },
    {
        id: 9,
        procedure: { id: 12 },
        product: { code: "ORTHO_ACL_SURGERY" },
        discount: 10.00,
        services_offer: { "ASSESSMENT_DETAILS": ["PREOPERATIVE_ASSESSMENT", "POSTOP_REHAB"] },
    },
    {
        id: 10,
        procedure: { id: 13 }, // Cirugía de Hombro
        product: { code: "ORTHO_ROTATOR_CUFF" },
        discount: 8.00,
        services_offer: { "ASSESSMENT_DETAILS": ["GENERAL_ANESTHESIA", "POSTOP_PHYSIOTHERAPY"] },
    },
    {
        id: 11,
        procedure: { id: 13 },
        product: { code: "ORTHO_SHOULDER_DISLOCATION" },
        discount: 9.00,
        services_offer: { "ASSESSMENT_DETAILS": ["GENERAL_ANESTHESIA", "POSTOP_SURGEON_FOLLOWUP"] },
    },
    {
        id: 12,
        procedure: { id: 4 }, // Tratamiento de Epilepsia
        product: { code: "VAGUS_NERVE_STIMULATION" },
        discount: 10.00,
        services_offer: { "ASSESSMENT_DETAILS": ["PREOPERATIVE_ASSESSMENT", "POSTOP_CT", "POSTOP_MEDICATIONS"] },
    },
    {
        id: 13,
        procedure: { id: 4 },
        product: { code: "EPILEPSY_SURGERY" },
        discount: 12.00,
        services_offer: { "ASSESSMENT_DETAILS": ["GENERAL_ANESTHESIA", "POSTOP_REHAB", "POSTOP_MEDICATIONS"] },
    },
    {
        id: 14,
        procedure: { id: 5 }, // Tratamiento de Parkinson
        product: { code: "DEEP_BRAIN_STIMULATION" },
        discount: 15.00,
        services_offer: { "ASSESSMENT_DETAILS": ["GENERAL_ANESTHESIA", "POSTOP_CT", "POSTOP_PHYSIOTHERAPY"] },
    },
    {
        id: 15,
        procedure: { id: 5 },
        product: { code: "DOPAMINE_THERAPY" },
        discount: 5.00,
        services_offer: { "ASSESSMENT_DETAILS": ["PREOPERATIVE_ASSESSMENT", "POSTOP_MEDICATIONS"] },
    },
    {
        id: 16,
        procedure: { id: 14 },
        product: { code: "LIO_MONOFOCAL" },
        discount: 5,
        services_offer: { "ASSESSMENT_DETAILS": ["MEDICAL_SPENDING", "POSTOP_APPOINTMENT", "POSTOP_MEDICAL"] },
    },
    {
      id: 17,
      procedure: { id: 14 },
      product: { code: "LIO_MULTIFOCAL" },
      discount: 0,
      services_offer: { "ASSESSMENT_DETAILS": ["MEDICAL_SPENDING", "POSTOP_APPOINTMENT", "POSTOP_MEDICAL"] },
    },
    {
      id: 18,
      procedure: { id: 15 },
      product: { code: "REFRACTIVE_PRK" },
      discount: 0,
      services_offer: { "ASSESSMENT_DETAILS": ["MEDICAL_SPENDING", "POSTOP_APPOINTMENT", "POSTOP_MEDICAL"] },
    },
    {
      id: 19,
      procedure: { id: 15 },
      product: { code: "REFRACTIVE_LASIK" },
      discount: 0,
      services_offer: { "ASSESSMENT_DETAILS": ["MEDICAL_SPENDING", "POSTOP_APPOINTMENT", "POSTOP_MEDICAL"] },
    },
    {
      id: 20,
      procedure: { id: 15 },
      product: { code: "REFRACTIVE_LASIK_GUIDED" },
      discount: 0,
      services_offer: { },
    },
    {
      id: 21,
      procedure: { id: 15 },
      product: { code: "REFRACTIVE_FEMOTOLASIK" },
      discount: 0,
      services_offer: { "ASSESSMENT_DETAILS": [] },
    },
];

await packageRepository.upsert(packages, ["id"]);




const preRegisterUserRepository = dataSource.getRepository(PreRegisterUser);

const preRegisterUsers = [
    {
        id: 1,
        card_id: "9-1234-5678",
        id_type: { code: "PHYSICAL_DNI" },
        name: "Juan Pérez",
        address: "Barrio Los Ángeles, Cartago",
        birth_date: new Date("1990-05-14"),
        finance_entity: { id: "8401b1be-7e1d-4357-a632-15172a647b8d" }
    },
    {
        id: 2,
        card_id: "8-5678-1234",
        id_type: { code: "PHYSICAL_DNI" },
        name: "Mariana Rodríguez",
        address: "Avenida Central, San José",
        birth_date: new Date("1985-08-22"),
        finance_entity: { id: "c0ecccb1-6c2f-407f-b39f-6f5c2af11640" }
    },
    {
        id: 3,
        card_id: "7-3456-7890",
        id_type: { code: "PHYSICAL_DNI" },
        name: "Carlos Gómez",
        address: "Residencial Monte Verde, Liberia",
        birth_date: new Date("1992-02-18"),
        finance_entity: { id: "8401b1be-7e1d-4357-a632-15172a647b8d" }
    },
    {
        id: 4,
        card_id: "6-8765-4321",
        id_type: { code: "DIMEX" },
        name: "Sofía Castillo",
        address: "Centro de Puntarenas",
        birth_date: new Date("1995-11-30"),
        finance_entity: { id: "c0ecccb1-6c2f-407f-b39f-6f5c2af11640" }
    }
];

await preRegisterUserRepository.upsert(preRegisterUsers, ["id"]);




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
    }
];

await certificationsExperienceRepository.upsert(certificationsExperiences, ["id"]);



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



const availabilityRepository = dataSource.getRepository(Availability);

const availabilities = [
    {
        id: 1,
        supplier: { id: 1 }, // Alejandro Vargas (Cardiología)
        location: { id: 1 }, // Hospital Clínica Bíblica - Sede Central
        weekday: "",
        from_hour: "08:00:00",
        to_hour: "12:00:00",
    },
    {
        id: 2,
        supplier: { id: 1 },
        location: { id: 1 },
        weekday: "Wednesday",
        from_hour: "14:00:00",
        to_hour: "18:00:00",
    },
    {
        id: 3,
        supplier: { id: 2 }, // Sofía Araya (Dermatología)
        location: { id: 5 }, // Centro Médico del Pacífico - Sede Central
        weekday: "Tuesday",
        from_hour: "10:00:00",
        to_hour: "15:00:00",
    },
    {
        id: 4,
        supplier: { id: 2 },
        location: { id: 5 },
        weekday: "Thursday",
        from_hour: "09:00:00",
        to_hour: "13:00:00",
    },
    {
        id: 5,
        supplier: { id: 3 }, // Fernando López (Médico General)
        location: { id: 7 }, // Hospital Metropolitano - Quepos
        weekday: "Friday",
        from_hour: "08:00:00",
        to_hour: "12:00:00",
    },
    {
        id: 6,
        supplier: { id: 3 },
        location: { id: 7 },
        weekday: "Monday",
        from_hour: "14:00:00",
        to_hour: "17:00:00",
    },
    {
        id: 7,
        supplier: { id: 4 }, // Hospital Clínica Santa Fe (Cardiología)
        location: { id: 4 }, // Hospital Metropolitano - Lincoln Plaza
        weekday: "Wednesday",
        from_hour: "10:00:00",
        to_hour: "16:00:00",
    },
    {
        id: 8,
        supplier: { id: 5 }, // Centro Médico del Pacífico (Gastroenterología)
        location: { id: 6 }, // Hospital Metropolitano - Huacas
        weekday: "Thursday",
        from_hour: "09:00:00",
        to_hour: "14:00:00",
    },
    {
        id: 9,
        supplier: { id: 5 },
        location: { id: 6 },
        weekday: "Friday",
        from_hour: "08:00:00",
        to_hour: "12:00:00",
    },
    {
        id: 10,
        supplier: { id: 5 },
        location: null, // No requiere ubicación específica
        weekday: "Monday",
        from_hour: "14:00:00",
        to_hour: "18:00:00",
    },
    {
      id: 11,
      supplier: { id: 1 }, // Alejandro Vargas
      location: { id: 1 }, // Hospital Clínica Bíblica - Sede Central
      weekday: "Tuesday",
      from_hour: "08:00:00",
      to_hour: "12:00:00",
    },
    {
      id: 12,
      supplier: { id: 2 }, // Sofía Araya
      location: { id: 5 }, // Centro Médico del Pacífico - Sede Central
      weekday: "Friday",
      from_hour: "15:00:00",
      to_hour: "19:00:00",
    },
    {
      id: 13,
      supplier: { id: 2 }, // Sofía Araya
      location: { id: 5 },
      weekday: "Monday",
      from_hour: "10:00:00",
      to_hour: "14:00:00",
    },
    {
      id: 14,
      supplier: { id: 3 }, // Fernando López
      location: { id: 7 }, // Hospital Metropolitano - Quepos (ejemplo)
      weekday: "Wednesday",
      from_hour: "12:00:00",
      to_hour: "16:00:00",
    },
    {
      id: 15,
      supplier: { id: 3 }, // Fernando López
      location: { id: 7 },
      weekday: "Thursday",
      from_hour: "09:00:00",
      to_hour: "13:00:00",
    },
    {
      id: 16,
      supplier: { id: 4 }, // Hospital Clínica Santa Fe
      location: { id: 4 }, // Hospital Metropolitano - Lincoln Plaza (ejemplo)
      weekday: "Friday",
      from_hour: "08:00:00",
      to_hour: "12:00:00",
    },
    {
      id: 17,
      supplier: { id: 4 }, // Hospital Clínica Santa Fe
      location: { id: 4 },
      weekday: "Saturday",
      from_hour: "10:00:00",
      to_hour: "14:00:00",
    },
    {
      id: 18,
      supplier: { id: 5 }, // Centro Médico del Pacífico
      location: { id: 6 }, // Hospital Metropolitano - Huacas (ejemplo)
      weekday: "Sunday",
      from_hour: "09:00:00",
      to_hour: "13:00:00",
    },
    {
      id: 19,
      supplier: { id: 5 }, // Centro Médico del Pacífico
      location: { id: 6 },
      weekday: "Tuesday",
      from_hour: "11:00:00",
      to_hour: "15:00:00",
    },
    {
      id: 20,
      supplier: { id: 5 }, // Centro Médico del Pacífico
      location: { id: 6 },
      weekday: "Wednesday",
      from_hour: "13:00:00",
      to_hour: "17:00:00",
    },

    //HAPPY PATH MVP  
    {
      id: 21,
      supplier: { id: 6 }, // Centro Médico del Pacífico
      location: { id: 1 },
      weekday: "Monday",
      from_hour: "10:00:00",
      to_hour: "11:00:00",
    },
    {
      id: 22,
      supplier: { id: 6 }, // Centro Médico del Pacífico
      location: { id: 1 },
      weekday: "Thursday",
      from_hour: "14:00:00",
      to_hour: "16:00:00",
    },
];

await availabilityRepository.upsert(availabilities, ["id"]);




const appointmentRepository = dataSource.getRepository(Appointment);

const appointments = [
  {
    id: 1,
    customer: { id: "f1635823-7d9a-4df9-bd1e-ad8bd985de0b" }, // Luis Fernández
    proforma_file_code: "PROF-001",
    appointment_date: "2025-03-20",
    appointment_hour: "09:00:00",
    reservation_type: { code: "RESERVATION" },
    appointment_status: { code: "PENDING" },
    supplier: { id: 1 }, // Alejandro Vargas
    application_date: "2025-03-18",
    payment_status: { code: "PENDING" },
    payment_method: { code: "CREDIT_CARD" },
    appointment_result: null,
    user_description: "Consulta general para revisión de salud cardiovascular.",
    recommendation_post_appointment: null,
    diagnostic: null,
  },
  {
    id: 2,
    customer: { id: "728237d9-c16d-4ca8-bbbe-240a697fb3c3" }, // María Jiménez
    proforma_file_code: "PROF-002",
    appointment_date: "2025-03-21",
    appointment_hour: "10:30:00",
    reservation_type: { code: "EVALUATION" },
    appointment_status: { code: "CONFIRM" },
    supplier: { id: 2 }, // Sofía Araya
    application_date: "2025-03-19",
    payment_status: { code: "PAID" },
    payment_method: { code: "ON_CONSULTATION" },
    appointment_result: { code: "FIT_FOR_PROCEDURE" },
    user_description: "Consulta dermatológica para evaluación de manchas en la piel.",
    recommendation_post_appointment: "Aplicar crema hidratante y protector solar.",
    diagnostic: "Dermatitis leve.",
  },
  {
    id: 3,
    customer: { id: "a1ea46aa-0dce-4c15-bea5-26ef6c83d27b" }, // Daniela Solano
    proforma_file_code: "PROF-003",
    appointment_date: "2025-03-22",
    appointment_hour: "08:00:00",
    reservation_type: { code: "PROCEDURE" },
    appointment_status: { code: "PENDING_RESERVATION" },
    supplier: { id: 3 }, // Fernando López
    application_date: "2025-03-20",
    payment_status: { code: "PENDING" },
    payment_method: { code: "SPLIT_PAYMENT" },
    appointment_result: null,
    user_description: "Consulta para extracción de muela del juicio.",
    recommendation_post_appointment: null,
    diagnostic: null,
  },
  {
    id: 4,
    customer: { id: "fd77bb90-9ac5-411e-9924-86cf4f529a5e" }, // José Marín
    proforma_file_code: "PROF-004",
    appointment_date: "2025-03-23",
    appointment_hour: "14:00:00",
    reservation_type: { code: "RESERVATION" },
    appointment_status: { code: "CANCEL" },
    supplier: { id: 4 }, // Hospital Clínica Santa Fe
    application_date: "2025-03-21",
    payment_status: { code: "NOT_PAID" },
    payment_method: { code: "CREDIT_PAYMENT" },
    appointment_result: null,
    user_description: "Consulta cancelada debido a cambios de planes del paciente.",
    recommendation_post_appointment: null,
    diagnostic: null,
  },
  {
    id: 5,
    customer: { id: "f1635823-7d9a-4df9-bd1e-ad8bd985de0b" }, // Luis Fernández
    proforma_file_code: "PROF-005",
    appointment_date: "2025-03-25",
    appointment_hour: "11:30:00",
    reservation_type: { code: "PROCEDURE" },
    appointment_status: { code: "CONFIRM" },
    supplier: { id: 5 }, // Centro Médico del Pacífico
    application_date: "2025-03-23",
    payment_status: { code: "PAID" },
    payment_method: { code: "CREDIT_CARD" },
    appointment_result: { code: "RECOMMENDED_FOLLOWUP" },
    user_description: "Consulta postquirúrgica tras intervención de rodilla.",
    recommendation_post_appointment: "Seguir con terapia de rehabilitación.",
    diagnostic: "Recuperación adecuada.",
  },
  {
    id: 6,
    customer: { id: "728237d9-c16d-4ca8-bbbe-240a697fb3c3" }, // María Jiménez
    proforma_file_code: "PROF-006",
    appointment_date: "2025-03-26",
    appointment_hour: "13:00:00",
    reservation_type: { code: "EVALUATION" },
    appointment_status: { code: "CONFIRM" },
    supplier: { id: 1 },
    application_date: "2025-03-24",
    payment_status: { code: "PAID" },
    payment_method: { code: "ON_CONSULTATION" },
    appointment_result: { code: "NEEDS_ADDITIONAL_EVALUATION" },
    user_description: "Evaluación médica general.",
    recommendation_post_appointment: "Realizar exámenes adicionales de sangre.",
    diagnostic: null,
  },
  {
    id: 7,
    customer: { id: "a1ea46aa-0dce-4c15-bea5-26ef6c83d27b" }, // Daniela Solano
    proforma_file_code: "PROF-007",
    appointment_date: "2025-03-27",
    appointment_hour: "16:00:00",
    reservation_type: { code: "PROCEDURE" },
    appointment_status: { code: "CONFIRM" },
    supplier: { id: 2 },
    application_date: "2025-03-25",
    payment_status: { code: "PAID" },
    payment_method: { code: "CREDIT_CARD" },
    appointment_result: { code: "FIT_FOR_PROCEDURE" },
    user_description: "Cirugía ocular LASIK programada.",
    recommendation_post_appointment: "Evitar exposición a pantallas por 24 horas.",
    diagnostic: null,
  },
  {
    id: 8,
    customer: { id: "fd77bb90-9ac5-411e-9924-86cf4f529a5e" }, // José Marín
    proforma_file_code: "PROF-008",
    appointment_date: "2025-03-28",
    appointment_hour: "17:30:00",
    reservation_type: { code: "PROCEDURE" },
    appointment_status: { code: "PENDING" },
    supplier: { id: 3 },
    application_date: "2025-03-26",
    payment_status: { code: "PENDING" },
    payment_method: { code: "CREDIT_PAYMENT" },
    appointment_result: null,
    user_description: "Consulta para cirugía de cadera.",
    recommendation_post_appointment: null,
    diagnostic: null,
  },
  {
    id: 9,
    customer: { id: "f1635823-7d9a-4df9-bd1e-ad8bd985de0b" }, // Luis Fernández
    proforma_file_code: "PROF-009",
    appointment_date: "2025-03-29",
    appointment_hour: "10:00:00",
    reservation_type: { code: "RESERVATION" },
    appointment_status: { code: "CONFIRM" },
    supplier: { id: 4 },
    application_date: "2025-03-27",
    payment_status: { code: "PAID" },
    payment_method: { code: "SPLIT_PAYMENT" },
    appointment_result: null,
    user_description: "Consulta de seguimiento postoperatorio.",
    recommendation_post_appointment: "Revisar cicatrización en 15 días.",
    diagnostic: null,
  },
  {
    id: 10,
    customer: { id: "728237d9-c16d-4ca8-bbbe-240a697fb3c3" }, // María Jiménez
    proforma_file_code: "PROF-010",
    appointment_date: "2025-03-30",
    appointment_hour: "14:30:00",
    reservation_type: { code: "EVALUATION" },
    appointment_status: { code: "CONFIRM" },
    supplier: { id: 5 },
    application_date: "2025-03-28",
    payment_status: { code: "PAID" },
    payment_method: { code: "CREDIT_CARD" },
    appointment_result: null,
    user_description: "Consulta médica preventiva anual.",
    recommendation_post_appointment: "Continuar con hábitos saludables.",
    diagnostic: "Salud estable.",
  }
];

await appointmentRepository.upsert(appointments, ["id"]);




const appointmentCreditRepository = dataSource.getRepository(AppointmentCredit);

const appointmentCredits = [
  {
    id: 1,
    appointment: { id: 1 }, // Cita de Luis Fernández con Alejandro Vargas
    credit_status: { code: "REQUIRED" },
    requested_amount: 1500.00,
    approved_amount: null,
    credit_observations: "Solicitud en proceso de evaluación.",
    pagare_file_code: null,
  },
  {
    id: 2,
    appointment: { id: 2 }, // Cita de María Jiménez con Sofía Araya
    credit_status: { code: "APPROVED" },
    requested_amount: 1200.00,
    approved_amount: 1200.00,
    credit_observations: "Crédito aprobado en su totalidad.",
    pagare_file_code: "PAGARE-002",
  },
  {
    id: 3,
    appointment: { id: 3 }, // Cita de Daniela Solano con Fernando López
    credit_status: { code: "REJECTED" },
    requested_amount: 2000.00,
    approved_amount: 0.00,
    credit_observations: "Crédito rechazado por historial de pagos.",
    pagare_file_code: null,
  },
  {
    id: 4,
    appointment: { id: 4 }, // Cita cancelada de José Marín con Hospital Clínica Santa Fe
    credit_status: { code: "REQUIRED" },
    requested_amount: 2500.00,
    approved_amount: null,
    credit_observations: "Pendiente de análisis financiero.",
    pagare_file_code: null,
  },
  {
    id: 5,
    appointment: { id: 5 }, // Cita postquirúrgica de Luis Fernández en Centro Médico del Pacífico
    credit_status: { code: "APPROVED_PERCENTAGE" },
    requested_amount: 3000.00,
    approved_amount: 2000.00,
    credit_observations: "Aprobación parcial del crédito solicitado.",
    pagare_file_code: "PAGARE-005",
  },
  {
    id: 6,
    appointment: { id: 6 }, // Evaluación médica de María Jiménez con Alejandro Vargas
    credit_status: { code: "APPROVED" },
    requested_amount: 1800.00,
    approved_amount: 1800.00,
    credit_observations: "Crédito aprobado en su totalidad.",
    pagare_file_code: "PAGARE-006",
  },
  {
    id: 7,
    appointment: { id: 7 }, // Cirugía ocular de Daniela Solano con Sofía Araya
    credit_status: { code: "REQUIRED" },
    requested_amount: 5000.00,
    approved_amount: null,
    credit_observations: "En evaluación por el comité financiero.",
    pagare_file_code: null,
  },
  {
    id: 8,
    appointment: { id: 8 }, // Cirugía de cadera de José Marín con Fernando López
    credit_status: { code: "APPROVED" },
    requested_amount: 4500.00,
    approved_amount: 4500.00,
    credit_observations: "Crédito aprobado sin restricciones.",
    pagare_file_code: "PAGARE-008",
  },
  {
    id: 9,
    appointment: { id: 9 }, // Consulta de seguimiento de Luis Fernández con Hospital Clínica Santa Fe
    credit_status: { code: "APPROVED_PERCENTAGE" },
    requested_amount: 4000.00,
    approved_amount: 2500.00,
    credit_observations: "Aprobado parcialmente, se requiere pago inicial.",
    pagare_file_code: "PAGARE-009",
  },
  {
    id: 10,
    appointment: { id: 10 }, // Consulta preventiva de María Jiménez con Centro Médico del Pacífico
    credit_status: { code: "REJECTED" },
    requested_amount: 3500.00,
    approved_amount: 0.00,
    credit_observations: "Historial crediticio insuficiente para aprobación.",
    pagare_file_code: null,
  }
];

await appointmentCreditRepository.upsert(appointmentCredits, ["id"]);


const reviewRepository = dataSource.getRepository(Review);

const reviews = [
  {
    id: 1,
    supplier: { id: 1 }, // Dr. Alejandro Vargas
    package: { id: 1 }, // Cirugía Miopía Láser
    customer: { id: "f1635823-7d9a-4df9-bd1e-ad8bd985de0b" }, // Luis Fernández
    appointment: { id: 1 }, 
    comment: "Excelente atención y explicación detallada sobre el procedimiento.",
    is_annonymous: false,
    supplier_reply: "Muchas gracias por su comentario. Estamos para servirle.",
  },
  {
    id: 2,
    supplier: { id: 2 }, // Dra. Sofía Araya
    package: { id: 2 }, // Tratamiento Dermatológico
    customer: { id: "728237d9-c16d-4ca8-bbbe-240a697fb3c3" }, // María Jiménez
    appointment: { id: 2 },
    comment: "Resultados increíbles en mi piel después del tratamiento. Muy recomendado.",
    is_annonymous: false,
    supplier_reply: "Nos alegra saber que tuvo una gran experiencia. ¡Gracias!",
  },
  {
    id: 3,
    supplier: { id: 3 }, // Dr. Fernando López
    package: { id: 3 }, // Consulta Médica General
    customer: { id: "a1ea46aa-0dce-4c15-bea5-26ef6c83d27b" }, // Daniela Solano
    appointment: { id: 3 },
    comment: "Muy buena consulta. El doctor fue muy atento.",
    is_annonymous: false,
    supplier_reply: "Agradecemos su comentario. ¡Esperamos verla nuevamente!",
  },
  {
    id: 4,
    supplier: { id: 4 }, // Hospital Clínica Santa Fe
    package: { id: 4 }, // Cirugía Cardiovascular
    customer: { id: "fd77bb90-9ac5-411e-9924-86cf4f529a5e" }, // José Marín
    appointment: { id: 4 },
    comment: "El proceso fue seguro y la recuperación ha sido rápida.",
    is_annonymous: true,
    supplier_reply: "Nos alegra saber que se siente mejor. ¡Cuídese!",
  },
  {
    id: 5,
    supplier: { id: 5 }, // Centro Médico del Pacífico
    package: { id: 5 }, // Endoscopía Digestiva
    customer: { id: "9c7dac5a-bb08-4956-915b-3edcda695f44" }, // Carlos Mendoza
    appointment: { id: 5 },
    comment: "Excelente equipo médico. Explicaron cada paso del procedimiento.",
    is_annonymous: false,
    supplier_reply: "Gracias por confiar en nosotros. Su bienestar es nuestra prioridad.",
  }
];

await reviewRepository.upsert(reviews, ["id"]);



const reviewDetailRepository = dataSource.getRepository(ReviewDetail);

const reviewDetails = [
  // Detalles para la Review 1
  { id: 1, review: { id: 1 }, stars_point: 5, review_code: { code: "ATTENTION_QUALITY" } }, // Calidad de atención
  { id: 2, review: { id: 1 }, stars_point: 4, review_code: { code: "CLEANING_ROOMS" } }, // Limpieza de instalaciones
  { id: 3, review: { id: 1 }, stars_point: 5, review_code: { code: "STAFF_KINDNESS" } }, // Amabilidad del staff

  // Detalles para la Review 2
  { id: 4, review: { id: 2 }, stars_point: 5, review_code: { code: "ATTENTION_QUALITY" } },
  { id: 5, review: { id: 2 }, stars_point: 5, review_code: { code: "STAFF_KINDNESS" } },

  // Detalles para la Review 3
  { id: 6, review: { id: 3 }, stars_point: 4, review_code: { code: "CLEANING_ROOMS" } },
  { id: 7, review: { id: 3 }, stars_point: 5, review_code: { code: "QUALITY_PRICE_RATIO" } },
  { id: 8, review: { id: 3 }, stars_point: 4, review_code: { code: "ATTENTION_QUALITY" } },

  // Detalles para la Review 4 (Anónima)
  { id: 9, review: { id: 4 }, stars_point: 5, review_code: { code: "ATTENTION_QUALITY" } },
  { id: 10, review: { id: 4 }, stars_point: 4, review_code: { code: "CLEANING_ROOMS" } },
  { id: 11, review: { id: 4 }, stars_point: 3, review_code: { code: "QUALITY_PRICE_RATIO" } },

  // Detalles para la Review 5
  { id: 12, review: { id: 5 }, stars_point: 5, review_code: { code: "ATTENTION_QUALITY" } },
  { id: 13, review: { id: 5 }, stars_point: 5, review_code: { code: "STAFF_KINDNESS" } },
  { id: 14, review: { id: 5 }, stars_point: 5, review_code: { code: "QUALITY_PRICE_RATIO" } },
  { id: 15, review: { id: 5 }, stars_point: 4, review_code: { code: "CLEANING_ROOMS" } }
];

await reviewDetailRepository.upsert(reviewDetails, ["id"]);



  console.log("Seeds done!");
}


runSeed().catch((error) => console.error(error));