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
    const udcRepository = dataSource.getRepository(UnitDynamicCentral);

    //Reservation Types
    const reservationTypes = [
        { name: "Reservación", code: "RESERVATION", type: "RESERVATION_TYPE"  as "RESERVATION_TYPE"  },
        { name: "Pre-Reservación", code: "PRE_RESERVATION", type: "RESERVATION_TYPE"  as "RESERVATION_TYPE"  },
        { name: "Valoración", code: "EVALUATION", type: "RESERVATION_TYPE"  as "RESERVATION_TYPE"  },
        { name: "Procedimiento", code: "PROCEDURE", type: "RESERVATION_TYPE"  as "RESERVATION_TYPE"  }
    ];
    await udcRepository.upsert(reservationTypes, ["code"]);

    // aPPOINTMENT STATUS
    const appointmentStatus = [
        { name: "Pendiente", code: "PENDING", type: "APPOINTMENT_STATUS"  as "APPOINTMENT_STATUS"  },
        { name: "Reservacion Pendiente", code: "PENDING_RESERVATION", type: "APPOINTMENT_STATUS" as "APPOINTMENT_STATUS" },
        { name: "Cancelada", code: "CANCEL", type: "APPOINTMENT_STATUS" as "APPOINTMENT_STATUS" },
        { name: "Confirmada", code: "CONFIRM", type: "APPOINTMENT_STATUS"  as "APPOINTMENT_STATUS"},
        { name: "Valorado", code: "VALUED", type: "APPOINTMENT_STATUS" as "APPOINTMENT_STATUS" }
    ];
    await udcRepository.upsert(appointmentStatus, ["code"]);

    // Reviews
    const review = [
        { name: "Calidad de atención", code: "ATTENTION_QUALITY", type: "REVIEW"  as "REVIEW"  },
        { name: "Limpieza de instalaciones", code: "CLEANING_ROOMS", type: "REVIEW" as "REVIEW" },
        { name: "Amabilidad del staff", code: "STAFF_KINDNESS", type: "REVIEW" as "REVIEW" },
        { name: "Relación calidad/precio", code: "QUALITY_PRICE_RATIO", type: "REVIEW"  as "REVIEW"}
    ];
    await udcRepository.upsert(review, ["code"]);
 
    // Payment Status
    const paymentStatus = [
        { name: "Pagado", code: "PAID", type: "PAYMENT_STATUS" as "PAYMENT_STATUS" },
        { name: "Pendiente", code: "PENDING", type: "PAYMENT_STATUS" as "PAYMENT_STATUS" },
        { name: "No Pagado", code: "NOT_PAID", type: "PAYMENT_STATUS" as "PAYMENT_STATUS" }
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
        { name: "Cirugía de Miopía", code: "MYOPIA_SURGERY", type: "MEDICAL_PROCEDURE", father_code: "OPHTHALMOLOGY" },
        { name: "Cirugía Miopía Láser", code: "MYOPIA_LASER", type: "MEDICAL_PRODUCT", father_code: "MYOPIA_SURGERY" },
        { name: "Cirugía Miopía Lentes Intraoculares", code: "MYOPIA_LENSES", type: "MEDICAL_PRODUCT", father_code: "MYOPIA_SURGERY" },
        { name: "Cirugía Miopía Anillos", code: "MYOPIA_RINGS", type: "MEDICAL_PRODUCT", father_code: "MYOPIA_SURGERY" },
        { name: "Cirugía de Cataratas", code: "CATARACT_SURGERY", type: "MEDICAL_PROCEDURE", father_code: "OPHTHALMOLOGY" },
        { name: "Facoemulsificación de Cataratas", code: "FACOEMULSIFICATION", type: "MEDICAL_PRODUCT", father_code: "CATARACT_SURGERY" },
        { name: "Implante de Lente Intraocular", code: "IOL_IMPLANT", type: "MEDICAL_PRODUCT", father_code: "CATARACT_SURGERY" },
        { name: "Tratamiento de Glaucoma", code: "GLAUCOMA_TREATMENT", type: "MEDICAL_PROCEDURE", father_code: "OPHTHALMOLOGY" },
        { name: "Cirugía de Glaucoma con Láser", code: "GLAUCOMA_LASER", type: "MEDICAL_PRODUCT", father_code: "GLAUCOMA_TREATMENT" },
        { name: "Implante de Drenaje para Glaucoma", code: "GLAUCOMA_DRAINAGE", type: "MEDICAL_PRODUCT", father_code: "GLAUCOMA_TREATMENT" },
        
        // NEUROLOGÍA
        { name: "Tratamiento de Epilepsia", code: "EPILEPSY_TREATMENT", type: "MEDICAL_PROCEDURE", father_code: "NEUROLOGY" },
        { name: "Estimulación del Nervio Vago", code: "VAGUS_NERVE_STIMULATION", type: "MEDICAL_PRODUCT", father_code: "EPILEPSY_TREATMENT" },
        { name: "Cirugía de Epilepsia", code: "EPILEPSY_SURGERY", type: "MEDICAL_PRODUCT", father_code: "EPILEPSY_TREATMENT" },
        { name: "Tratamiento de Parkinson", code: "PARKINSON_TREATMENT", type: "MEDICAL_PROCEDURE", father_code: "NEUROLOGY" },
        { name: "Estimulación Cerebral Profunda", code: "DEEP_BRAIN_STIMULATION", type: "MEDICAL_PRODUCT", father_code: "PARKINSON_TREATMENT" },
        { name: "Terapia de Dopamina", code: "DOPAMINE_THERAPY", type: "MEDICAL_PRODUCT", father_code: "PARKINSON_TREATMENT" },
        
        // GINECOLOGÍA Y OBSTETRICIA
        { name: "Cirugía de Endometriosis", code: "ENDOMETRIOSIS_SURGERY", type: "MEDICAL_PROCEDURE", father_code: "GYNECOLOGY_AND_OBSTETRICS" },
        { name: "Laparoscopía para Endometriosis", code: "ENDOMETRIOSIS_LAPAROSCOPY", type: "MEDICAL_PRODUCT", father_code: "ENDOMETRIOSIS_SURGERY" },
        { name: "Resección de Tejido Endometriósico", code: "ENDOMETRIOSIS_RESECTION", type: "MEDICAL_PRODUCT", father_code: "ENDOMETRIOSIS_SURGERY" },
        { name: "Tratamiento de Infertilidad", code: "INFERTILITY_TREATMENT", type: "MEDICAL_PROCEDURE", father_code: "GYNECOLOGY_AND_OBSTETRICS" },
        { name: "Fertilización In Vitro (FIV)", code: "IVF", type: "MEDICAL_PRODUCT", father_code: "INFERTILITY_TREATMENT" },
        { name: "Inseminación Artificial", code: "ARTIFICIAL_INSEMINATION", type: "MEDICAL_PRODUCT", father_code: "INFERTILITY_TREATMENT" },
        
        // ONCOLOGÍA MÉDICA
        { name: "Tratamiento del Cáncer de Mama", code: "BREAST_CANCER_TREATMENT", type: "MEDICAL_PROCEDURE", father_code: "MEDICAL_ONCOLOGY" },
        { name: "Mastectomía Radical", code: "MASTECTOMY_RADICAL", type: "MEDICAL_PRODUCT", father_code: "BREAST_CANCER_TREATMENT" },
        { name: "Cirugía Conservadora de Mama", code: "BREAST_CONSERVATIVE_SURGERY", type: "MEDICAL_PRODUCT", father_code: "BREAST_CANCER_TREATMENT" },
        { name: "Tratamiento del Cáncer de Pulmón", code: "LUNG_CANCER_TREATMENT", type: "MEDICAL_PROCEDURE", father_code: "MEDICAL_ONCOLOGY" },
        { name: "Resección Pulmonar", code: "LUNG_RESECTION", type: "MEDICAL_PRODUCT", father_code: "LUNG_CANCER_TREATMENT" },
        { name: "Terapia Dirigida para Cáncer de Pulmón", code: "LUNG_TARGETED_THERAPY", type: "MEDICAL_PRODUCT", father_code: "LUNG_CANCER_TREATMENT" },

        // CARDIOLOGÍA
        { name: "Intervención Cardiovascular", code: "CARDIO_INTERVENTION", type: "MEDICAL_PROCEDURE", father_code: "CARDIOLOGY" },
        { name: "Colocación de Stent Coronario", code: "CARDIO_STENT", type: "MEDICAL_PRODUCT", father_code: "CARDIO_INTERVENTION" },
        { name: "Revascularización Miocárdica", code: "CARDIO_BYPASS", type: "MEDICAL_PRODUCT", father_code: "CARDIO_INTERVENTION" },
        { name: "Cateterismo Diagnóstico", code: "CARDIO_CATH", type: "MEDICAL_PRODUCT", father_code: "CARDIO_INTERVENTION" },
        { name: "Marcapasos", code: "PACEMAKER_IMPLANT", type: "MEDICAL_PROCEDURE", father_code: "CARDIOLOGY" },
        { name: "Implantación de Marcapasos Unicameral", code: "PACEMAKER_SINGLE", type: "MEDICAL_PRODUCT", father_code: "PACEMAKER_IMPLANT" },
        { name: "Implantación de Marcapasos Bicameral", code: "PACEMAKER_DUAL", type: "MEDICAL_PRODUCT", father_code: "PACEMAKER_IMPLANT" },
        
        // GASTROENTEROLOGÍA
        { name: "Endoscopía Digestiva", code: "GASTRO_ENDOSCOPY", type: "MEDICAL_PROCEDURE", father_code: "GASTROENTEROLOGY" },
        { name: "Colonoscopía", code: "GASTRO_COLONOSCOPY", type: "MEDICAL_PRODUCT", father_code: "GASTRO_ENDOSCOPY" },
        { name: "Gastroscopia", code: "GASTRO_GASTROSCOPY", type: "MEDICAL_PRODUCT", father_code: "GASTRO_ENDOSCOPY" },
        { name: "Tratamiento de Úlceras", code: "GASTRO_ULCER_TREATMENT", type: "MEDICAL_PROCEDURE", father_code: "GASTROENTEROLOGY" },
        { name: "Terapia con Inhibidores de Bomba de Protones", code: "GASTRO_PPI_THERAPY", type: "MEDICAL_PRODUCT", father_code: "GASTRO_ULCER_TREATMENT" },
        { name: "Erradicación de Helicobacter Pylori", code: "GASTRO_H_PYLORI", type: "MEDICAL_PRODUCT", father_code: "GASTRO_ULCER_TREATMENT" },
        
        // TRAUMATOLOGÍA Y ORTOPEDIA
        { name: "Cirugía de Rodilla", code: "ORTHO_KNEE_SURGERY", type: "MEDICAL_PROCEDURE", father_code: "ORTHOPEDICS_AND_TRAUMATOLOGY" },
        { name: "Reemplazo Total de Rodilla", code: "ORTHO_KNEE_REPLACEMENT", type: "MEDICAL_PRODUCT", father_code: "ORTHO_KNEE_SURGERY" },
        { name: "Cirugía de Ligamento Cruzado Anterior", code: "ORTHO_ACL_SURGERY", type: "MEDICAL_PRODUCT", father_code: "ORTHO_KNEE_SURGERY" },
        { name: "Cirugía de Hombro", code: "ORTHO_SHOULDER_SURGERY", type: "MEDICAL_PROCEDURE", father_code: "ORTHOPEDICS_AND_TRAUMATOLOGY" },
        { name: "Reparación de Manguito Rotador", code: "ORTHO_ROTATOR_CUFF", type: "MEDICAL_PRODUCT", father_code: "ORTHO_SHOULDER_SURGERY" },
        { name: "Cirugía de Luxación de Hombro", code: "ORTHO_SHOULDER_DISLOCATION", type: "MEDICAL_PRODUCT", father_code: "ORTHO_SHOULDER_SURGERY" }
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
        { name: "Fisioterapia para recuperación de movilidad", code: "POSTOP_PHYSIOTHERAPY", type: "ASSESSMENT_DETAIL", father_code: "POSTOP_TREATMENT" }
    ];
    
    await udcRepository.upsert(Assessments, ["code"]);
    
    


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
            name: "Requiere Evaluación Adicional", 
            code: "NEEDS_ADDITIONAL_EVALUATION", 
            type: "APPOINTMENT_RESULT" as "APPOINTMENT_RESULT",
            description: "El paciente requiere evaluaciones médicas adicionales antes de determinar su elegibilidad para el procedimiento."
        },
        { 
            name: "Recomendado Seguimiento Médico", 
            code: "RECOMMENDED_FOLLOWUP", 
            type: "APPOINTMENT_RESULT" as "APPOINTMENT_RESULT",
            description: "El paciente no requiere un procedimiento, pero debe someterse a seguimientos médicos periódicos."
        }
    ];

    
    await udcRepository.upsert(appointmentResults, ["code"]);
    


    console.log("General seed done!");
}

runSeed().catch((error) => console.error(error));