//*************************************** */
//              Configuration
//*************************************** */
import path from 'path';
import ConfigManager from '@TenshiJS/config/ConfigManager';

//set configuration first time
const configPath = path.resolve(__dirname, '../../tenshi-config.json');
const configManager = ConfigManager.getInstance(configPath);
const config = configManager.getConfig();

import { DataSource, ServerDescription } from 'typeorm';
import { UnitDynamicCentral } from '@TenshiJS/entity/UnitDynamicCentral';


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
        entities: [UnitDynamicCentral], // Array of entities to be used
        synchronize: true, // Synchronize the schema with the database
        charset: "utf8mb4",
        extra: {
            connectionLimit: 150, 
            charset: "utf8mb4", 
            collation: "utf8mb4_unicode_ci",
        }
    });
    

    await dataSource.initialize();


    /*
        Unit Dynamic Central Data Set
    */
    const udcRepository = await dataSource.getRepository(UnitDynamicCentral);


    //Appointment Types
    const appointmentTypes = [
        { name: "Cita de Valoración", value1: "Valoración", code: "VALORATION_APPOINTMENT", type: "APPOINTMENT_TYPE"  as "APPOINTMENT_TYPE"  },
        { name: "Procedimierto", value1: "Procedimiento",code: "PROCEDURE_APPOINTMENT", type: "APPOINTMENT_TYPE"  as "APPOINTMENT_TYPE"  },
    ];
    await udcRepository.upsert(appointmentTypes, ["code"]);

    //Reservation Types
    const reservationTypes = [
        { name: "Pre-Reservación Cita Valoración", value1: "Pre-Reserva",code: "PRE_RESERVATION_VALORATION_APPOINTMENT", type: "RESERVATION_TYPE"  as "RESERVATION_TYPE"  },
        { name: "Reservación Cita Valoración", value1: "Reserva", code: "RESERVATION_VALORATION_APPOINTMENT", type: "RESERVATION_TYPE"  as "RESERVATION_TYPE"  },
        { name: "Pre-Reservación Procedimiento", value1: "Pre-Reserva",code: "PRE_RESERVATION_PROCEDURE", type: "RESERVATION_TYPE"  as "RESERVATION_TYPE"  },
        { name: "Reservación Procedimiento", value1: "Reserva", code: "RESERVATION_PROCEDURE", type: "RESERVATION_TYPE"  as "RESERVATION_TYPE"  },
    ];
    await udcRepository.upsert(reservationTypes, ["code"]);

    // Appointment Status
    const appointmentStatus = [
        //CITA DE VALORACION
        { name: "Pendiente Cita de valoracion", value1: "Pendiente", code: "PENDING_VALORATION_APPOINTMENT", type: "APPOINTMENT_STATUS"  as "APPOINTMENT_STATUS"  },
        { name: "Confirmada Cita de valoracion", value1: "Confirmada", code: "CONFIRM_VALIDATION_APPOINTMENT", type: "APPOINTMENT_STATUS"  as "APPOINTMENT_STATUS"},
        { name: "Valoración Pendiente", value1: "Valoración Pendiente", code: "VALUATION_PENDING_VALORATION_APPOINTMENT", type: "APPOINTMENT_STATUS" },
        { name: "Valorado", value1: "Valorado", code: "VALUED_VALORATION_APPOINTMENT", type: "APPOINTMENT_STATUS" as "APPOINTMENT_STATUS" },

        //Procedimientos
        { name: "Pendiente Procedimiento", value1: "Pendiente", code: "PENDING_PROCEDURE", type: "APPOINTMENT_STATUS"  as "APPOINTMENT_STATUS"  },
        { name: "Confirmado Procedimiento", value1: "Confirmada", code: "CONFIRM_PROCEDURE", type: "APPOINTMENT_STATUS"  as "APPOINTMENT_STATUS"},
        { name: "Pendiente Realizar Procedimiento", value1: "Pendiente Realizar", code: "WAITING_PROCEDURE", type: "APPOINTMENT_STATUS" },
        
        //GENERALES
        { name: "Concretado", value1: "Concretado",code: "CONCRETED_APPOINTMENT", type: "APPOINTMENT_STATUS" },
        { name: "Cancelada", value1: "Cancelado", code: "CANCEL_APPOINTMENT", type: "APPOINTMENT_STATUS" as "APPOINTMENT_STATUS" },
    ];
    await udcRepository.upsert(appointmentStatus, ["code"]);

  
 
    // Payment Status
    const paymentStatus = [
        { name: "Pagado Cita de Valoracion", value1: "Pagado", code: "PAYMENT_STATUS_PAID_VALORATION_APPOINTMENT", type: "PAYMENT_STATUS" as "PAYMENT_STATUS" },
        { name: "Pendiente de pago cita de valoracion", value1: "No Pagado", code: "PAYMENT_STATUS_NOT_PAID_VALORATION_APPOINTMENT", type: "PAYMENT_STATUS" as "PAYMENT_STATUS" },
        { name: "Pagado Procedimiento", value1: "Pagado", code: "PAYMENT_STATUS_PAID_PROCEDURE", type: "PAYMENT_STATUS" as "PAYMENT_STATUS" },
        { name: "Pendiente de pago Procedimiento", value1: "No Pagado", code: "PAYMENT_STATUS_NOT_PAID_PROCEDURE", type: "PAYMENT_STATUS" as "PAYMENT_STATUS" },
    ];
    await udcRepository.upsert(paymentStatus, ["code"]);

    // Payment Methods
    const paymentMethods = [
        { name: "Tarjeta de credito", code: "CREDIT_CARD", type: "PAYMENT_METHOD" as "PAYMENT_METHOD" },
        { name: "En consulta", code: "ON_CONSULTATION", type: "PAYMENT_METHOD" as "PAYMENT_METHOD" },
        { name: "Pago por crédito", code: "CREDIT_PAYMENT", type: "PAYMENT_METHOD" as "PAYMENT_METHOD" },
        { name: "Pago dividido", code: "SPLIT_PAYMENT", type: "PAYMENT_METHOD" as "PAYMENT_METHOD" }
    ];
    await udcRepository.upsert(paymentMethods, ["code"]);


    //Appoiment Result
    const appointmentResults = [
        { 
            name: "Apto para Procedimiento Médico", 
            code: "FIT_FOR_PROCEDURE", 
            type: "APPOINTMENT_RESULT" as "APPOINTMENT_RESULT",
            description: "El paciente es apto para someterse al procedimiento médico solicitado."
        },
        { 
            name: "No Apto para Procedimiento Médico", 
            code: "NOT_FIT_FOR_PROCEDURE", 
            type: "APPOINTMENT_RESULT" as "APPOINTMENT_RESULT",
            description: "El paciente no es apto para proceder con el procedimiento médico solicitado debido a preocupaciones médicas o de seguridad."
        },
        { 
            name: "No Requiere Procedimiento Médico", 
            code: "NOT_REQUIRE_PROCEDURE", 
            type: "APPOINTMENT_RESULT" as "APPOINTMENT_RESULT",
            description: "El paciente no requiere procedimiento medico"
        }
    ];
    await udcRepository.upsert(appointmentResults, ["code"]);
   

    // Asking Credit Status
    const askingCreditStatus = [
        { name: "Solicitado", code: "REQUIRED", type: "ASKING_CREDIT_STATUS" as "ASKING_CREDIT_STATUS" },
        { name: "Aprobado", code: "APPROVED", type: "ASKING_CREDIT_STATUS" as "ASKING_CREDIT_STATUS" },
        { name: "Rechazado", code: "REJECTED", type: "ASKING_CREDIT_STATUS" as "ASKING_CREDIT_STATUS" },
        { name: "Aprobado un porcentaje", code: "APPROVED_PERCENTAGE", type: "ASKING_CREDIT_STATUS" as "ASKING_CREDIT_STATUS" }
    ];
    await udcRepository.upsert(askingCreditStatus, ["code"]);

    //Tipo de experiencia
    const experienceType = [
        { 
            name: "Experiencia", 
            code: "EXPERIENCE", 
            type: "EXPERIENCE_TYPE" as "EXPERIENCE_TYPE",
            description: "Registro de la trayectoria profesional en el campo de la medicina o la salud."
        },
        { 
            name: "Educación", 
            code: "EDUCATION", 
            type: "EXPERIENCE_TYPE" as "EXPERIENCE_TYPE",
            description: "Formación académica y grados obtenidos en el ámbito de la salud."
        },
        { 
            name: "Certificación", 
            code: "CERTIFICATION", 
            type: "EXPERIENCE_TYPE" as "EXPERIENCE_TYPE",
            description: "Documentos o títulos obtenidos que validan habilidades y conocimientos específicos."
        },
        { 
            name: "Premio y Reconocimiento", 
            code: "AWARD_RECOGNITION", 
            type: "EXPERIENCE_TYPE" as "EXPERIENCE_TYPE",
            description: "Distinciones otorgadas por instituciones médicas o científicas."
        },
        { 
            name: "Acreditación", 
            code: "ACCREDITATION", 
            type: "EXPERIENCE_TYPE" as "EXPERIENCE_TYPE",
            description: "Certificación oficial otorgada por una entidad reguladora o académica."
        },
        { 
            name: "Publicación Científica", 
            code: "SCIENTIFIC_PUBLICATION", 
            type: "EXPERIENCE_TYPE" as "EXPERIENCE_TYPE",
            description: "Artículos o investigaciones publicadas en revistas científicas."
        },
        { 
            name: "Participación en Conferencias", 
            code: "CONFERENCE_PARTICIPATION", 
            type: "EXPERIENCE_TYPE" as "EXPERIENCE_TYPE",
            description: "Asistencia o participación en eventos académicos y científicos."
        },
        { 
            name: "Investigación Médica", 
            code: "MEDICAL_RESEARCH", 
            type: "EXPERIENCE_TYPE" as "EXPERIENCE_TYPE",
            description: "Contribución en estudios o ensayos clínicos relacionados con la medicina."
        }
    ];
    
    
    await udcRepository.upsert(experienceType, ["code"]);



       // Reviews
       const review = [
        { name: "Calidad de atención", code: "ATTENTION_QUALITY", type: "REVIEW"  as "REVIEW"  },
        { name: "Limpieza de instalaciones", code: "CLEANING_ROOMS", type: "REVIEW" as "REVIEW" },
        { name: "Amabilidad del staff", code: "STAFF_KINDNESS", type: "REVIEW" as "REVIEW" },
        { name: "Relación calidad/precio", code: "QUALITY_PRICE_RATIO", type: "REVIEW"  as "REVIEW"}
    ];
    await udcRepository.upsert(review, ["code"]);
    
    //Id Type
    const IDType = [
        { name: "Cedula Fisica", code: "PHYSICAL_DNI", type: "ID_TYPE" as "ID_TYPE" },
        { name: "Cedula Juridica", code: "JURIDICAL_DNI", type: "ID_TYPE" as "ID_TYPE" },
        { name: "Dimex", code: "DIMEX", type: "ID_TYPE" as "ID_TYPE" },
        { name: "Pasaporte", code: "PASSPORT", type: "ID_TYPE" as "ID_TYPE" },
    ];
    await udcRepository.upsert(IDType, ["code"]);
    
    //Medical Type
    const MedicalType = [
        { 
            name: "Médico General", 
            code: "GENERAL_MEDICAL", 
            type: "MEDICAL_TYPE" as "MEDICAL_TYPE",
            description: "Profesional de la salud que brinda atención médica general sin una especialización específica."
        },
        { 
            name: "Especialista", 
            code: "SPECIALTY_MEDICAL", 
            type: "MEDICAL_TYPE" as "MEDICAL_TYPE",
            description: "Médico con formación especializada en un área específica de la medicina."
        }
    ];
    await udcRepository.upsert(MedicalType, ["code"]);

    
    //Medical Specialties
    const MedicalSpecialties = [
        { name: "Acupuntura", code: "ACUPUNCTURE", type: "MEDICAL_SPECIALTY" },
        { name: "Administración de Servicios de Salud", code: "HEALTH_SERVICES_ADMINISTRATION", type: "MEDICAL_SPECIALTY" },
        { name: "Alergología", code: "ALLERGOLOGY", type: "MEDICAL_SPECIALTY" },
        { name: "Anatomía Patológica", code: "PATHOLOGICAL_ANATOMY", type: "MEDICAL_SPECIALTY" },
        { name: "Anestesiología y Recuperación", code: "ANESTHESIOLOGY_AND_RECOVERY", type: "MEDICAL_SPECIALTY" },
        { name: "Cardiología", code: "CARDIOLOGY", type: "MEDICAL_SPECIALTY" },
        { name: "Cirugía General", code: "GENERAL_SURGERY", type: "MEDICAL_SPECIALTY" },
        { name: "Cuidados Paliativos en Adultos", code: "ADULT_PALLIATIVE_CARE", type: "MEDICAL_SPECIALTY" },
        { name: "Dermatología", code: "DERMATOLOGY", type: "MEDICAL_SPECIALTY" },
        { name: "Endocrinología", code: "ENDOCRINOLOGY", type: "MEDICAL_SPECIALTY" },
        { name: "Gastroenterología", code: "GASTROENTEROLOGY", type: "MEDICAL_SPECIALTY" },
        { name: "Geriatría y Gerontología", code: "GERIATRICS_AND_GERONTOLOGY", type: "MEDICAL_SPECIALTY" },
        { name: "Ginecología y Obstetricia", code: "GYNECOLOGY_AND_OBSTETRICS", type: "MEDICAL_SPECIALTY" },
        { name: "Hematología", code: "HEMATOLOGY", type: "MEDICAL_SPECIALTY" },
        { name: "Infectología", code: "INFECTOLOGY", type: "MEDICAL_SPECIALTY" },
        { name: "Medicina Aeroespacial", code: "AEROSPACE_MEDICINE", type: "MEDICAL_SPECIALTY" },
        { name: "Medicina Crítica y Terapia Intensiva", code: "CRITICAL_CARE_AND_INTENSIVE_THERAPY", type: "MEDICAL_SPECIALTY" },
        { name: "Medicina de Emergencias", code: "EMERGENCY_MEDICINE", type: "MEDICAL_SPECIALTY" },
        { name: "Medicina del Deporte", code: "SPORTS_MEDICINE", type: "MEDICAL_SPECIALTY" },
        { name: "Medicina del Trabajo", code: "OCCUPATIONAL_MEDICINE", type: "MEDICAL_SPECIALTY" },
        { name: "Medicina Familiar y Comunitaria", code: "FAMILY_AND_COMMUNITY_MEDICINE", type: "MEDICAL_SPECIALTY" },
        { name: "Medicina Física y Rehabilitación", code: "PHYSICAL_MEDICINE_AND_REHABILITATION", type: "MEDICAL_SPECIALTY" },
        { name: "Medicina Hiperbárica", code: "HYPERBARIC_MEDICINE", type: "MEDICAL_SPECIALTY" },
        { name: "Medicina Interna", code: "INTERNAL_MEDICINE", type: "MEDICAL_SPECIALTY" },
        { name: "Medicina Legal", code: "LEGAL_MEDICINE", type: "MEDICAL_SPECIALTY" },
        { name: "Medicina Nuclear", code: "NUCLEAR_MEDICINE", type: "MEDICAL_SPECIALTY" },
        { name: "Medicina Preventiva y Salud Pública", code: "PREVENTIVE_MEDICINE_AND_PUBLIC_HEALTH", type: "MEDICAL_SPECIALTY" },
        { name: "Neumología", code: "PULMONOLOGY", type: "MEDICAL_SPECIALTY" },
        { name: "Neurología", code: "NEUROLOGY", type: "MEDICAL_SPECIALTY" },
        { name: "Nutriología Clínica", code: "CLINICAL_NUTRITION", type: "MEDICAL_SPECIALTY" },
        { name: "Oftalmología", code: "OPHTHALMOLOGY", type: "MEDICAL_SPECIALTY" },
        { name: "Oncología Médica", code: "MEDICAL_ONCOLOGY", type: "MEDICAL_SPECIALTY" },
        { name: "Oncología Quirúrgica", code: "SURGICAL_ONCOLOGY", type: "MEDICAL_SPECIALTY" },
        { name: "Oncología Radioterápica", code: "RADIATION_ONCOLOGY", type: "MEDICAL_SPECIALTY" },
        { name: "Ortopedia y Traumatología", code: "ORTHOPEDICS_AND_TRAUMATOLOGY", type: "MEDICAL_SPECIALTY" },
        { name: "Otorrinolaringología", code: "OTORHINOLARYNGOLOGY", type: "MEDICAL_SPECIALTY" },
        { name: "Pediatría", code: "PEDIATRICS", type: "MEDICAL_SPECIALTY" },
        { name: "Psiquiatría", code: "PSYCHIATRY", type: "MEDICAL_SPECIALTY" },
        { name: "Radiología e Imágenes Médicas", code: "RADIOLOGY_AND_MEDICAL_IMAGING", type: "MEDICAL_SPECIALTY" },
        { name: "Radioterapia", code: "RADIOTHERAPY", type: "MEDICAL_SPECIALTY" },
        { name: "Reumatología", code: "RHEUMATOLOGY", type: "MEDICAL_SPECIALTY" },
        { name: "Urología", code: "UROLOGY", type: "MEDICAL_SPECIALTY" }
    ];
    await udcRepository.upsert(MedicalSpecialties, ["code"]);
    

    //Medical procedures and products or packages
    const ProceduresAndProducts = [
        // OFTALMOLOGÍA
        {name: "Cirugía Refractiva (miopía, hipermetropía y astigmatismo)",code: "REFRACTIVE_SURGERY",type: "MEDICAL_PROCEDURE",father_code: "OPHTHALMOLOGY"},
        {
            name: "PRK",
            code: "REFRACTIVE_PRK",
            type: "MEDICAL_PRODUCT",
            father_code: "REFRACTIVE_SURGERY",
            value1: "1080000",
            description: "Incisión refractiva en la córnea, se usa para describir remodelación de la córnea con láser excímer sin colgajo"
        },
        {
            name: "LASIK",
            code: "REFRACTIVE_LASIK",
            type: "MEDICAL_PRODUCT",
            father_code: "REFRACTIVE_SURGERY",
            value1: "1311428",
            description: "Keratomileusis, incluye técnicas en las que se levanta un colgajo corneal y se remodela con láser"
        },
        {
            name: "LASIK Guiada",
            code: "REFRACTIVE_LASIK_GUIDED",
            type: "MEDICAL_PRODUCT",
            father_code: "REFRACTIVE_SURGERY",
            value1: "1500000",
            description: "Keratomileusis, incluye técnicas en las que se levanta un colgajo corneal y se remodela con láser"
        },
        {
            name: "Femotolasik",
            code: "REFRACTIVE_FEMOTOLASIK",
            type: "MEDICAL_PRODUCT",
            father_code: "REFRACTIVE_SURGERY",
            value1: "1697142",
            description: "Keratomileusis, incluye técnicas en las que se levanta un colgajo corneal y se remodela con láser, sin cuchillas"
        },


        { name: "Cirugía de Cataratas", code: "CATARACT_SURGERY", type: "MEDICAL_PROCEDURE", father_code: "OPHTHALMOLOGY" },
        {
            name: "LIO Monofocal",
            code: "LIO_MONOFOCAL",
            type: "MEDICAL_PRODUCT",
            father_code: "CATARACT_SURGERY",
            value1: "845902",
            description: "Elemento quirúrgico con alta eficacia en recuperación funcional"
        },
        {
            name: "LIO Multifocal",
            code: "LIO_MULTIFOCAL",
            type: "MEDICAL_PRODUCT",
            father_code: "CATARACT_SURGERY",
            value1: "1352284",
            description: "Producto médico especializado utilizado en procedimientos avanzados"
        },
        // NEUROLOGÍA
        { name: "Tratamiento de Epilepsia", code: "EPILEPSY_TREATMENT", type: "MEDICAL_PROCEDURE", father_code: "NEUROLOGY" },
        {
            name: "Estimulación del Nervio Vago",
            code: "VAGUS_NERVE_STIMULATION",
            type: "MEDICAL_PRODUCT",
            father_code: "EPILEPSY_TREATMENT",
            value1: "1822880",
            description: "Tratamiento innovador aprobado en medicina especializada"
        },
        {
            name: "Cirugía de Epilepsia",
            code: "EPILEPSY_SURGERY",
            type: "MEDICAL_PRODUCT",
            father_code: "EPILEPSY_TREATMENT",
            value1: "536259",
            description: "Dispositivo o tratamiento con fines terapéuticos específicos"
        },
        { name: "Tratamiento de Parkinson", code: "PARKINSON_TREATMENT", type: "MEDICAL_PROCEDURE", father_code: "NEUROLOGY" },
        {
            name: "Estimulación Cerebral Profunda",
            code: "DEEP_BRAIN_STIMULATION",
            type: "MEDICAL_PRODUCT",
            father_code: "PARKINSON_TREATMENT",
            value1: "1065387",
            description: "Elemento quirúrgico con alta eficacia en recuperación funcional"
        },
        {
            name: "Terapia de Dopamina",
            code: "DOPAMINE_THERAPY",
            type: "MEDICAL_PRODUCT",
            father_code: "PARKINSON_TREATMENT",
            value1: "1812375",
            description: "Producto médico especializado utilizado en procedimientos avanzados"
        },

        // GINECOLOGÍA Y OBSTETRICIA
        { name: "Cirugía de Endometriosis", code: "ENDOMETRIOSIS_SURGERY", type: "MEDICAL_PROCEDURE", father_code: "GYNECOLOGY_AND_OBSTETRICS" },
        {
            name: "Laparoscopía para Endometriosis",
            code: "ENDOMETRIOSIS_LAPAROSCOPY",
            type: "MEDICAL_PRODUCT",
            father_code: "ENDOMETRIOSIS_SURGERY",
            value1: "1189115",
            description: "Elemento quirúrgico con alta eficacia en recuperación funcional"
        },
        {
            name: "Resección de Tejido Endometriósico",
            code: "ENDOMETRIOSIS_RESECTION",
            type: "MEDICAL_PRODUCT",
            father_code: "ENDOMETRIOSIS_SURGERY",
            value1: "1248224",
            description: "Dispositivo o tratamiento con fines terapéuticos específicos"
        },
        { name: "Tratamiento de Infertilidad", code: "INFERTILITY_TREATMENT", type: "MEDICAL_PROCEDURE", father_code: "GYNECOLOGY_AND_OBSTETRICS" },
        {
            name: "Fertilización In Vitro (FIV)",
            code: "IVF",
            type: "MEDICAL_PRODUCT",
            father_code: "INFERTILITY_TREATMENT",
            value1: "647302",
            description: "Producto médico especializado utilizado en procedimientos avanzados"
        },
        {
            name: "Inseminación Artificial",
            code: "ARTIFICIAL_INSEMINATION",
            type: "MEDICAL_PRODUCT",
            father_code: "INFERTILITY_TREATMENT",
            value1: "481888",
            description: "Tratamiento innovador aprobado en medicina especializada"
        },

        // ONCOLOGÍA MÉDICA
        { name: "Tratamiento del Cáncer de Mama", code: "BREAST_CANCER_TREATMENT", type: "MEDICAL_PROCEDURE", father_code: "MEDICAL_ONCOLOGY" },
        {
            name: "Mastectomía Radical",
            code: "MASTECTOMY_RADICAL",
            type: "MEDICAL_PRODUCT",
            father_code: "BREAST_CANCER_TREATMENT",
            value1: "1693703",
            description: "Producto médico especializado utilizado en procedimientos avanzados"
        },
        {
            name: "Cirugía Conservadora de Mama",
            code: "BREAST_CONSERVATIVE_SURGERY",
            type: "MEDICAL_PRODUCT",
            father_code: "BREAST_CANCER_TREATMENT",
            value1: "1343277",
            description: "Elemento quirúrgico con alta eficacia en recuperación funcional"
        },
        { name: "Tratamiento del Cáncer de Pulmón", code: "LUNG_CANCER_TREATMENT", type: "MEDICAL_PROCEDURE", father_code: "MEDICAL_ONCOLOGY" },
        {
            name: "Resección Pulmonar",
            code: "LUNG_RESECTION",
            type: "MEDICAL_PRODUCT",
            father_code: "LUNG_CANCER_TREATMENT",
            value1: "1308304",
            description: "Tratamiento innovador aprobado en medicina especializada"
        },
        {
            name: "Terapia Dirigida para Cáncer de Pulmón",
            code: "LUNG_TARGETED_THERAPY",
            type: "MEDICAL_PRODUCT",
            father_code: "LUNG_CANCER_TREATMENT",
            value1: "914399",
            description: "Intervención tecnológica aplicada en cirugía de precisión"
        },

        // CARDIOLOGÍA
        { name: "Intervención Cardiovascular", code: "CARDIO_INTERVENTION", type: "MEDICAL_PROCEDURE", father_code: "CARDIOLOGY" },
        {
            name: "Colocación de Stent Coronario",
            code: "CARDIO_STENT",
            type: "MEDICAL_PRODUCT",
            father_code: "CARDIO_INTERVENTION",
            value1: "1585397",
            description: "Dispositivo o tratamiento con fines terapéuticos específicos"
        },
        {
            name: "Revascularización Miocárdica",
            code: "CARDIO_BYPASS",
            type: "MEDICAL_PRODUCT",
            father_code: "CARDIO_INTERVENTION",
            value1: "1004410",
            description: "Intervención tecnológica aplicada en cirugía de precisión"
        },
        {
            name: "Cateterismo Diagnóstico",
            code: "CARDIO_CATH",
            type: "MEDICAL_PRODUCT",
            father_code: "CARDIO_INTERVENTION",
            value1: "1041185",
            description: "Producto médico especializado utilizado en procedimientos avanzados"
        },
        { name: "Marcapasos", code: "PACEMAKER_IMPLANT", type: "MEDICAL_PROCEDURE", father_code: "CARDIOLOGY" },
        {
            name: "Implantación de Marcapasos Unicameral",
            code: "PACEMAKER_SINGLE",
            type: "MEDICAL_PRODUCT",
            father_code: "PACEMAKER_IMPLANT",
            value1: "1678870",
            description: "Elemento quirúrgico con alta eficacia en recuperación funcional"
        },
        {
            name: "Implantación de Marcapasos Bicameral",
            code: "PACEMAKER_DUAL",
            type: "MEDICAL_PRODUCT",
            father_code: "PACEMAKER_IMPLANT",
            value1: "1834566",
            description: "Tratamiento innovador aprobado en medicina especializada"
        },

        // GASTROENTEROLOGÍA
        { name: "Endoscopía Digestiva", code: "GASTRO_ENDOSCOPY", type: "MEDICAL_PROCEDURE", father_code: "GASTROENTEROLOGY" },
        {
            name: "Colonoscopía",
            code: "GASTRO_COLONOSCOPY",
            type: "MEDICAL_PRODUCT",
            father_code: "GASTRO_ENDOSCOPY",
            value1: "1645232",
            description: "Producto médico especializado utilizado en procedimientos avanzados"
        },
        {
            name: "Gastroscopia",
            code: "GASTRO_GASTROSCOPY",
            type: "MEDICAL_PRODUCT",
            father_code: "GASTRO_ENDOSCOPY",
            value1: "870973",
            description: "Dispositivo o tratamiento con fines terapéuticos específicos"
        },
        { name: "Tratamiento de Úlceras", code: "GASTRO_ULCER_TREATMENT", type: "MEDICAL_PROCEDURE", father_code: "GASTROENTEROLOGY" },
        {
            name: "Terapia con Inhibidores de Bomba de Protones",
            code: "GASTRO_PPI_THERAPY",
            type: "MEDICAL_PRODUCT",
            father_code: "GASTRO_ULCER_TREATMENT",
            value1: "1462123",
            description: "Intervención tecnológica aplicada en cirugía de precisión"
        },
        {
            name: "Erradicación de Helicobacter Pylori",
            code: "GASTRO_H_PYLORI",
            type: "MEDICAL_PRODUCT",
            father_code: "GASTRO_ULCER_TREATMENT",
            value1: "1463294",
            description: "Tratamiento innovador aprobado en medicina especializada"
        },

        // TRAUMATOLOGÍA Y ORTOPEDIA
        { name: "Cirugía de Rodilla", code: "ORTHO_KNEE_SURGERY", type: "MEDICAL_PROCEDURE", father_code: "ORTHOPEDICS_AND_TRAUMATOLOGY" },
        {
            name: "Reemplazo Total de Rodilla",
            code: "ORTHO_KNEE_REPLACEMENT",
            type: "MEDICAL_PRODUCT",
            father_code: "ORTHO_KNEE_SURGERY",
            value1: "1612106",
            description: "Producto médico especializado utilizado en procedimientos avanzados"
        },
        {
            name: "Cirugía de Ligamento Cruzado Anterior",
            code: "ORTHO_ACL_SURGERY",
            type: "MEDICAL_PRODUCT",
            father_code: "ORTHO_KNEE_SURGERY",
            value1: "1729026",
            description: "Elemento quirúrgico con alta eficacia en recuperación funcional"
        },
        { name: "Cirugía de Hombro", code: "ORTHO_SHOULDER_SURGERY", type: "MEDICAL_PROCEDURE", father_code: "ORTHOPEDICS_AND_TRAUMATOLOGY" },
        {
            name: "Reparación de Manguito Rotador",
            code: "ORTHO_ROTATOR_CUFF",
            type: "MEDICAL_PRODUCT",
            father_code: "ORTHO_SHOULDER_SURGERY",
            value1: "1300533",
            description: "Dispositivo o tratamiento con fines terapéuticos específicos"
        },
        {
            name: "Cirugía de Luxación de Hombro",
            code: "ORTHO_SHOULDER_DISLOCATION",
            type: "MEDICAL_PRODUCT",
            father_code: "ORTHO_SHOULDER_SURGERY",
            value1: "1611914",
            description: "Tratamiento innovador aprobado en medicina especializada"
        }

    ];
    
    await udcRepository.upsert(ProceduresAndProducts, ["code"]);


    //Assestments anf assessments details for packages
    const Assessments = [
        // Valoraciones Generales
        { name: "Valoraciones Preoperatorias", code: "PREOPERATIVE_ASSESSMENT", type: "ASSESSMENT" },
        { name: "Sala de Operaciones", code: "OPERATING_ROOM", type: "ASSESSMENT" },
        { name: "Insumos Médicos", code: "MEDICAL_SUPPLIES", type: "ASSESSMENT" },
        { name: "Anestesia y Control del Dolor", code: "ANESTHESIA_PAIN_CONTROL", type: "ASSESSMENT" },
        { name: "Imágenes y Diagnóstico", code: "IMAGING_DIAGNOSIS", type: "ASSESSMENT" },
        { name: "Medicamentos Postoperatorios", code: "POSTOP_MEDICATIONS", type: "ASSESSMENT" },
        { name: "Tratamiento Médico Postoperatorio", code: "POSTOP_TREATMENT", type: "ASSESSMENT" },
        { name: "General", code: "GENERAL", type: "ASSESSMENT" },
      

        // Valoraciones Preoperatorias
        { name: "Evaluación prequirúrgica general", code: "GENERAL_PRE_SURGERY_EVAL", type: "ASSESSMENT_DETAIL", father_code: "PREOPERATIVE_ASSESSMENT" },
        { name: "Exámenes de laboratorio prequirúrgicos", code: "PRE_SURGERY_LAB_TESTS", type: "ASSESSMENT_DETAIL", father_code: "PREOPERATIVE_ASSESSMENT" },
        { name: "Electrocardiograma (ECG) preoperatorio", code: "PRE_SURGERY_ECG", type: "ASSESSMENT_DETAIL", father_code: "PREOPERATIVE_ASSESSMENT" },
        { name: "Evaluación anestésica prequirúrgica", code: "PRE_SURGERY_ANESTHESIA", type: "ASSESSMENT_DETAIL", father_code: "PREOPERATIVE_ASSESSMENT" },
        { name: "Evaluación de riesgo quirúrgico", code: "SURGICAL_RISK_ASSESSMENT", type: "ASSESSMENT_DETAIL", father_code: "PREOPERATIVE_ASSESSMENT" },
        
        // Sala de Operaciones
        { name: "Equipo quirúrgico estéril", code: "STERILE_SURGICAL_EQUIPMENT", type: "ASSESSMENT_DETAIL", father_code: "OPERATING_ROOM" },
        { name: "Monitores de signos vitales intraoperatorios", code: "VITAL_MONITORS", type: "ASSESSMENT_DETAIL", father_code: "OPERATING_ROOM" },
        { name: "Fluidos intravenosos y electrolitos", code: "IV_FLUIDS", type: "ASSESSMENT_DETAIL", father_code: "OPERATING_ROOM" },
        { name: "Antibióticos profilácticos intraoperatorios", code: "INTRAOP_ANTIBIOTICS", type: "ASSESSMENT_DETAIL", father_code: "OPERATING_ROOM" },
        
        // Insumos Médicos
        { name: "Suturas y grapadoras quirúrgicas", code: "SURGICAL_SUTURES", type: "ASSESSMENT_DETAIL", father_code: "MEDICAL_SUPPLIES" },
        { name: "Catéteres y sondas", code: "CATHETERS_TUBES", type: "ASSESSMENT_DETAIL", father_code: "MEDICAL_SUPPLIES" },
        { name: "Compresas y gasas estériles", code: "STERILE_GAUSES", type: "ASSESSMENT_DETAIL", father_code: "MEDICAL_SUPPLIES" },
        
        // Anestesia y Control del Dolor
        { name: "Anestesia general", code: "GENERAL_ANESTHESIA", type: "ASSESSMENT_DETAIL", father_code: "ANESTHESIA_PAIN_CONTROL" },
        { name: "Anestesia regional", code: "REGIONAL_ANESTHESIA", type: "ASSESSMENT_DETAIL", father_code: "ANESTHESIA_PAIN_CONTROL" },
        { name: "Control de dolor postoperatorio", code: "POSTOP_PAIN_CONTROL", type: "ASSESSMENT_DETAIL", father_code: "ANESTHESIA_PAIN_CONTROL" },
        
        // Imágenes y Diagnóstico
        { name: "Ultrasonidos postoperatorios", code: "POSTOP_ULTRASOUND", type: "ASSESSMENT_DETAIL", father_code: "IMAGING_DIAGNOSIS" },
        { name: "Tomografía computarizada (TC) de control", code: "POSTOP_CT", type: "ASSESSMENT_DETAIL", father_code: "IMAGING_DIAGNOSIS" },
        { name: "Radiografías de seguimiento", code: "POSTOP_XRAY", type: "ASSESSMENT_DETAIL", father_code: "IMAGING_DIAGNOSIS" },
        
        // Medicamentos Postoperatorios
        { name: "Analgésicos", code: "POSTOP_ANALGESICS", type: "ASSESSMENT_DETAIL", father_code: "POSTOP_MEDICATIONS" },
        { name: "Antibióticos postoperatorios", code: "POSTOP_ANTIBIOTICS", type: "ASSESSMENT_DETAIL", father_code: "POSTOP_MEDICATIONS" },
        { name: "Anticoagulantes", code: "POSTOP_ANTICOAGULANTS", type: "ASSESSMENT_DETAIL", father_code: "POSTOP_MEDICATIONS" },
        
        // Tratamiento Médico Postoperatorio
        { name: "Seguimiento postquirúrgico con el cirujano", code: "POSTOP_SURGEON_FOLLOWUP", type: "ASSESSMENT_DETAIL", father_code: "POSTOP_TREATMENT" },
        { name: "Rehabilitación postoperatoria", code: "POSTOP_REHAB", type: "ASSESSMENT_DETAIL", father_code: "POSTOP_TREATMENT" },
        { name: "Fisioterapia para recuperación de movilidad", code: "POSTOP_PHYSIOTHERAPY", type: "ASSESSMENT_DETAIL", father_code: "POSTOP_TREATMENT" },
        { name: "Medicamentos post operatorios", code: "POSTOP_MEDICAL", type: "ASSESSMENT_DETAIL", father_code: "POSTOP_TREATMENT" },
        { name: "Cita de Valoracion post operatoria", code: "POSTOP_APPOINTMENT", type: "ASSESSMENT_DETAIL", father_code: "POSTOP_TREATMENT" },

        //General
        { name: "Incluye todos los gastos médicos", code: "MEDICAL_SPENDING", type: "ASSESSMENT_DETAIL", father_code: "GENERAL" },

    ];
    
    await udcRepository.upsert(Assessments, ["code"]);
    
    

    const languageProficiencyLevels = [
        { 
            name: "Nativo", 
            code: "NATIVE", 
            type: "LANGUAGE_PROFICIENCY" as "LANGUAGE_PROFICIENCY",
            description: "Habla el idioma como lengua materna con fluidez total en todas las áreas." 
        },
        { 
            name: "Bilingüe", 
            code: "BILINGUAL", 
            type: "LANGUAGE_PROFICIENCY" as "LANGUAGE_PROFICIENCY",
            description: "Maneja el idioma al nivel de un hablante nativo, aunque no sea su lengua materna." 
        },
        { 
            name: "Fluido", 
            code: "FLUENT", 
            type: "LANGUAGE_PROFICIENCY" as "LANGUAGE_PROFICIENCY",
            description: "Habla el idioma con soltura y facilidad en entornos profesionales y cotidianos." 
        },
        { 
            name: "Avanzado", 
            code: "ADVANCED", 
            type: "LANGUAGE_PROFICIENCY" as "LANGUAGE_PROFICIENCY",
            description: "Puede comunicarse con confianza en la mayoría de las situaciones, aunque con errores ocasionales." 
        },
        { 
            name: "Intermedio", 
            code: "INTERMEDIATE", 
            type: "LANGUAGE_PROFICIENCY" as "LANGUAGE_PROFICIENCY",
            description: "Maneja conversaciones básicas y algunas complejas con limitaciones." 
        },
        { 
            name: "Básico", 
            code: "BASIC", 
            type: "LANGUAGE_PROFICIENCY" as "LANGUAGE_PROFICIENCY",
            description: "Capaz de entender y expresar frases simples y conceptos básicos." 
        },
        { 
            name: "Principiante", 
            code: "BEGINNER", 
            type: "LANGUAGE_PROFICIENCY" as "LANGUAGE_PROFICIENCY",
            description: "Tiene un conocimiento mínimo del idioma y puede decir algunas palabras y frases básicas." 
        }
    ];
    
    await udcRepository.upsert(languageProficiencyLevels, ["code"]);
    

    console.log("General seed done!");
}

runSeed().catch((error) => console.error(error));