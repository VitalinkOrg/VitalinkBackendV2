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
        { name: "Tarjeta de crédito", code: "CREDIT_CARD", type: "PAYMENT_METHOD" as "PAYMENT_METHOD" },
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
    // OFTALMOLOGÍA (procedimientos = "father", productos = "child")
    { name: "Cirugía Refractiva (miopía, hipermetropía y astigmatismo)", code: "REFRACTIVE_SURGERY", type: "MEDICAL_PROCEDURE", father_code: "OPHTHALMOLOGY" }, // 1 (PROCEDURE - Refractiva)
    { name: "PRK", code: "REFRACTIVE_PRK", type: "MEDICAL_PRODUCT", father_code: "REFRACTIVE_SURGERY", value1: "1080000", description: "Incisión refractiva en la córnea, se usa para describir remodelación de la córnea con láser excímer sin colgajo" }, // 2 (PRODUCT - Refractiva)
    { name: "LASIK", code: "REFRACTIVE_LASIK", type: "MEDICAL_PRODUCT", father_code: "REFRACTIVE_SURGERY", value1: "1311428", description: "Keratomileusis, incluye técnicas en las que se levanta un colgajo corneal y se remodela con láser" }, // 3 (PRODUCT - Refractiva) ✅ Cirugía LASIK (NO duplicar)
    { name: "LASIK Guiada", code: "REFRACTIVE_LASIK_GUIDED", type: "MEDICAL_PRODUCT", father_code: "REFRACTIVE_SURGERY", value1: "1500000", description: "Keratomileusis, incluye técnicas en las que se levanta un colgajo corneal y se remodela con láser" }, // 4 (PRODUCT - Refractiva)
    { name: "Femotolasik", code: "REFRACTIVE_FEMOTOLASIK", type: "MEDICAL_PRODUCT", father_code: "REFRACTIVE_SURGERY", value1: "1697142", description: "Keratomileusis, incluye técnicas en las que se levanta un colgajo corneal y se remodela con láser, sin cuchillas" }, // 5 (PRODUCT - Refractiva)

    { name: "Cirugía de Cataratas", code: "CATARACT_SURGERY", type: "MEDICAL_PROCEDURE", father_code: "OPHTHALMOLOGY" }, // 6 (PROCEDURE - Cataratas)
    { name: "Cirugía de catarata monofocal", code: "CATARACT_MONOFOCAL_SURGERY", type: "MEDICAL_PRODUCT", father_code: "CATARACT_SURGERY", value1: "1490000", description: "Procedimiento de facoemulsificación con implante de lente monofocal según evaluación clínica." }, // 7 (PRODUCT - Cataratas)
    { name: "Cirugía de catarata multifocal", code: "CATARACT_MULTIFOCAL_SURGERY", type: "MEDICAL_PRODUCT", father_code: "CATARACT_SURGERY", value1: "2150000", description: "Procedimiento de facoemulsificación con implante de lente multifocal según indicación médica." }, // 8 (PRODUCT - Cataratas)
    { name: "LIO Monofocal", code: "LIO_MONOFOCAL", type: "MEDICAL_PRODUCT", father_code: "CATARACT_SURGERY", value1: "845902", description: "Elemento quirúrgico con alta eficacia en recuperación funcional" }, // 9 (PRODUCT - Cataratas) ✅ code intacto
    { name: "LIO Multifocal", code: "LIO_MULTIFOCAL", type: "MEDICAL_PRODUCT", father_code: "CATARACT_SURGERY", value1: "1352284", description: "Producto médico especializado utilizado en procedimientos avanzados" }, // 10 (PRODUCT - Cataratas) ✅ code intacto

    { name: "Consulta", code: "OPHTH_CONSULTATION", type: "MEDICAL_PROCEDURE", father_code: "OPHTHALMOLOGY" }, // 11 (PROCEDURE - Consulta)
    { name: "Consulta oftalmológica", code: "OPHTH_CONSULTATION_GENERAL", type: "MEDICAL_PRODUCT", father_code: "OPHTH_CONSULTATION", value1: "45000", description: "Consulta médica oftalmológica con evaluación clínica y plan de manejo." }, // 12 (PRODUCT - Consulta)

    { name: "Blefaroplastía", code: "OPHTH_BLEPHAROPLASTY", type: "MEDICAL_PROCEDURE", father_code: "OPHTHALMOLOGY" }, // 13 (PROCEDURE - Blefaroplastía)
    { name: "Blefaroplastía (procedimiento)", code: "OPHTH_BLEPHAROPLASTY_STD", type: "MEDICAL_PRODUCT", father_code: "OPHTH_BLEPHAROPLASTY", value1: "950000", description: "Cirugía de párpados (superior/inferior según valoración) con fines funcionales o estéticos." }, // 14 (PRODUCT - Blefaroplastía)

    { name: "Cirugía de pterigión", code: "OPHTH_PTERYGIUM_SURGERY", type: "MEDICAL_PROCEDURE", father_code: "OPHTHALMOLOGY" }, // 15 (PROCEDURE - Pterigión)
    { name: "Cirugía de pterigión (procedimiento)", code: "OPHTH_PTERYGIUM_STD", type: "MEDICAL_PRODUCT", father_code: "OPHTH_PTERYGIUM_SURGERY", value1: "620000", description: "Resección de pterigión con técnica según criterio médico (puede incluir injerto/conjuntival)." }, // 16 (PRODUCT - Pterigión)

    { name: "Cirugía de queratocono", code: "OPHTH_KERATOCONUS_SURGERY", type: "MEDICAL_PROCEDURE", father_code: "OPHTHALMOLOGY" }, // 17 (PROCEDURE - Queratocono)
    { name: "Crosslinking corneal", code: "OPHTH_CXL", type: "MEDICAL_PRODUCT", father_code: "OPHTH_KERATOCONUS_SURGERY", value1: "980000", description: "Fortalecimiento corneal con riboflavina y luz UV para estabilización del queratocono." }, // 18 (PRODUCT - Queratocono) ✅ Crosslinking

    { name: "Cirugía de glaucoma", code: "OPHTH_GLAUCOMA_SURGERY", type: "MEDICAL_PROCEDURE", father_code: "OPHTHALMOLOGY" }, // 19 (PROCEDURE - Glaucoma)
    { name: "Estudio de ángulo ocular", code: "OPHTH_ANGLE_STUDY", type: "MEDICAL_PRODUCT", father_code: "OPHTH_GLAUCOMA_SURGERY", value1: "95000", description: "Evaluación del ángulo camerular (gonioscopía/estudio de ángulo) según indicación." }, // 20 (PRODUCT - Glaucoma)
    { name: "Iridotomía", code: "OPHTH_IRIDOTOMY", type: "MEDICAL_PRODUCT", father_code: "OPHTH_GLAUCOMA_SURGERY", value1: "280000", description: "Procedimiento para crear una abertura en el iris según indicación clínica." }, // 21 (PRODUCT - Glaucoma)
    { name: "Iridotomía láser", code: "OPHTH_LASER_IRIDOTOMY", type: "MEDICAL_PRODUCT", father_code: "OPHTH_GLAUCOMA_SURGERY", value1: "210000", description: "Iridotomía realizada con láser para manejo de glaucoma de ángulo estrecho u otras indicaciones." }, // 22 (PRODUCT - Glaucoma)
    { name: "Trabeculectomía", code: "OPHTH_TRABECULECTOMY", type: "MEDICAL_PRODUCT", father_code: "OPHTH_GLAUCOMA_SURGERY", value1: "1250000", description: "Cirugía filtrante para disminuir la presión intraocular en glaucoma." }, // 23 (PRODUCT - Glaucoma)
    { name: "Facotrabeculectomía", code: "OPHTH_PHACOTRABECULECTOMY", type: "MEDICAL_PRODUCT", father_code: "OPHTH_GLAUCOMA_SURGERY", value1: "1850000", description: "Cirugía combinada de catarata + técnica filtrante para control de presión intraocular." }, // 24 (PRODUCT - Glaucoma)
    { name: "Trabeculoplastía láser selectiva", code: "OPHTH_SLTP", type: "MEDICAL_PRODUCT", father_code: "OPHTH_GLAUCOMA_SURGERY", value1: "420000", description: "Tratamiento láser selectivo sobre malla trabecular para control de presión intraocular." }, // 25 (PRODUCT - Glaucoma)
    { name: "Colocación de Válvula de Ahmed", code: "OPHTH_AHMED_VALVE", type: "MEDICAL_PRODUCT", father_code: "OPHTH_GLAUCOMA_SURGERY", value1: "2450000", description: "Implante valvular para control de presión intraocular en glaucoma refractario o casos seleccionados." }, // 26 (PRODUCT - Glaucoma)
    { name: "Faco+colocación de Válvula de Ahmed", code: "OPHTH_PHACO_AHMED", type: "MEDICAL_PRODUCT", father_code: "OPHTH_GLAUCOMA_SURGERY", value1: "3150000", description: "Cirugía combinada de facoemulsificación + implante de válvula de Ahmed según indicación." }, // 27 (PRODUCT - Glaucoma)

    { name: "Cirugía de vía lagrimal", code: "OPHTH_LACRIMAL_SURGERY", type: "MEDICAL_PROCEDURE", father_code: "OPHTHALMOLOGY" }, // 28 (PROCEDURE - Vía lagrimal)
    { name: "Cirugía para obstrucción lagrimal", code: "OPHTH_LACRIMAL_OBSTRUCTION_SURGERY", type: "MEDICAL_PRODUCT", father_code: "OPHTH_LACRIMAL_SURGERY", value1: "980000", description: "Procedimiento para resolver obstrucción de la vía lagrimal (técnica según evaluación)." }, // 29 (PRODUCT - Vía lagrimal)
    { name: "Intubación de vía lacrimal", code: "OPHTH_LACRIMAL_INTUBATION", type: "MEDICAL_PRODUCT", father_code: "OPHTH_LACRIMAL_SURGERY", value1: "420000", description: "Colocación de tubo/stent lagrimal para permeabilización según protocolo." }, // 30 (PRODUCT - Vía lagrimal)
    { name: "Plastía de puntos lacrimales", code: "OPHTH_PUNCTAL_PLASTY", type: "MEDICAL_PRODUCT", father_code: "OPHTH_LACRIMAL_SURGERY", value1: "280000", description: "Plastía de puntos lagrimales para corrección funcional del drenaje." }, // 31 (PRODUCT - Vía lagrimal)

    { name: "Curetaje de chalazión", code: "OPHTH_CHALAZION_CURETTAGE", type: "MEDICAL_PROCEDURE", father_code: "OPHTHALMOLOGY" }, // 32 (PROCEDURE - Chalazión)
    { name: "Curetaje de chalazión (procedimiento)", code: "OPHTH_CHALAZION_CURETTAGE_STD", type: "MEDICAL_PRODUCT", father_code: "OPHTH_CHALAZION_CURETTAGE", value1: "120000", description: "Drenaje/curetaje de chalazión mediante procedimiento ambulatorio según indicación." }, // 33 (PRODUCT - Chalazión)

    { name: "Diatermia de retina (desgarros, tumores)", code: "OPHTH_RETINAL_DIATHERMY", type: "MEDICAL_PROCEDURE", father_code: "OPHTHALMOLOGY" }, // 34 (PROCEDURE - Retina)
    { name: "Diatermia de retina (procedimiento)", code: "OPHTH_RETINAL_DIATHERMY_STD", type: "MEDICAL_PRODUCT", father_code: "OPHTH_RETINAL_DIATHERMY", value1: "780000", description: "Tratamiento con diatermia para lesiones retinianas (desgarros u otras) según criterio médico." }, // 35 (PRODUCT - Retina)

    { name: "Inyección intraocular", code: "OPHTH_INTRAOCULAR_INJECTION", type: "MEDICAL_PROCEDURE", father_code: "OPHTHALMOLOGY" }, // 36 (PROCEDURE - Inyección)
    { name: "Inyección intraocular (aplicación)", code: "OPHTH_INTRAOCULAR_INJECTION_STD", type: "MEDICAL_PRODUCT", father_code: "OPHTH_INTRAOCULAR_INJECTION", value1: "320000", description: "Aplicación intraocular de medicamento (anti-VEGF/esteroide según indicación y disponibilidad)." }, // 37 (PRODUCT - Inyección)

    { name: "Capsulotomía", code: "OPHTH_CAPSULOTOMY", type: "MEDICAL_PROCEDURE", father_code: "OPHTHALMOLOGY" }, // 38 (PROCEDURE - Capsulotomía)
    { name: "Capsulotomía (YAG láser)", code: "OPHTH_CAPSULOTOMY_YAG", type: "MEDICAL_PRODUCT", father_code: "OPHTH_CAPSULOTOMY", value1: "180000", description: "Capsulotomía posterior con láser YAG para opacificación capsular posterior." }, // 39 (PRODUCT - Capsulotomía)

    { name: "Implante de lente", code: "OPHTH_LENS_PROCEDURE", type: "MEDICAL_PROCEDURE", father_code: "OPHTHALMOLOGY" }, // 40 (PROCEDURE - Lente)
    { name: "Implante de lente (procedimiento)", code: "OPHTH_LENS_IMPLANT", type: "MEDICAL_PRODUCT", father_code: "OPHTH_LENS_PROCEDURE", value1: "950000", description: "Implante de lente intraocular según indicación (no incluye refractiva/catarata salvo paquete definido)." }, // 41 (PRODUCT - Lente)
    { name: "Retiro de lente intraocular", code: "OPHTH_IOL_REMOVAL", type: "MEDICAL_PRODUCT", father_code: "OPHTH_LENS_PROCEDURE", value1: "780000", description: "Retiro o recambio de lente intraocular por indicación médica." }, // 42 (PRODUCT - Lente)

    { name: "Raspado corneal", code: "OPHTH_CORNEAL_SCRAPING", type: "MEDICAL_PROCEDURE", father_code: "OPHTHALMOLOGY" }, // 43 (PROCEDURE - Córnea)
    { name: "Raspado corneal (procedimiento)", code: "OPHTH_CORNEAL_SCRAPING_STD", type: "MEDICAL_PRODUCT", father_code: "OPHTH_CORNEAL_SCRAPING", value1: "190000", description: "Raspado corneal diagnóstico/terapéutico según indicación clínica." }, // 44 (PRODUCT - Córnea)

    { name: "Trasplante de córnea", code: "OPHTH_CORNEAL_TRANSPLANT", type: "MEDICAL_PROCEDURE", father_code: "OPHTHALMOLOGY" }, // 45 (PROCEDURE - Trasplante)
    { name: "Trasplante de córnea (procedimiento)", code: "OPHTH_CORNEAL_TRANSPLANT_STD", type: "MEDICAL_PRODUCT", father_code: "OPHTH_CORNEAL_TRANSPLANT", value1: "2200000", description: "Trasplante corneal (técnica según indicación: penetrante o lamelar) y protocolo institucional." }, // 46 (PRODUCT - Trasplante)

    { name: "Ultrasonido de ojo", code: "OPHTH_OCULAR_ULTRASOUND", type: "MEDICAL_PROCEDURE", father_code: "OPHTHALMOLOGY" }, // 47 (PROCEDURE - Ultrasonido)
    { name: "Ultrasonido ocular (B-scan)", code: "OPHTH_OCULAR_ULTRASOUND_BSCAN", type: "MEDICAL_PRODUCT", father_code: "OPHTH_OCULAR_ULTRASOUND", value1: "85000", description: "Ultrasonido ocular para evaluación de segmento posterior/medios opacos según indicación." }, // 48 (PRODUCT - Ultrasonido)






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
     // CARDIOLOGÍA (PROCEDURE = título sin value1, PRODUCT = item con value1)

{ name: "Intervención Cardiovascular", code: "CARDIO_INTERVENTION", type: "MEDICAL_PROCEDURE", father_code: "CARDIOLOGY" }, // 1 (PROCEDURE - Intervención Cardiovascular)
{ name: "Colocación de Stent Coronario", code: "CARDIO_STENT", type: "MEDICAL_PRODUCT", father_code: "CARDIO_INTERVENTION", value1: "1585397", description: "Dispositivo o tratamiento con fines terapéuticos específicos" }, // 2 (PRODUCT - Intervención Cardiovascular) ✅ code intacto
{ name: "Revascularización Miocárdica", code: "CARDIO_BYPASS", type: "MEDICAL_PRODUCT", father_code: "CARDIO_INTERVENTION", value1: "1004410", description: "Intervención tecnológica aplicada en cirugía de precisión" }, // 3 (PRODUCT - Intervención Cardiovascular) ✅ code intacto
{ name: "Cateterismo Diagnóstico", code: "CARDIO_CATH", type: "MEDICAL_PRODUCT", father_code: "CARDIO_INTERVENTION", value1: "1041185", description: "Producto médico especializado utilizado en procedimientos avanzados" }, // 4 (PRODUCT - Intervención Cardiovascular) ✅ code intacto
{ name: "Angioplastía coronaria", code: "CARDIO_ANGIOPLASTY", type: "MEDICAL_PRODUCT", father_code: "CARDIO_INTERVENTION", value1: "1725000", description: "Procedimiento percutáneo para dilatar arterias coronarias (puede incluir balón y material según caso)." }, // 5 (PRODUCT - Intervención Cardiovascular)
{ name: "Colocación de válvulas percutáneas", code: "CARDIO_PERCUTANEOUS_VALVES", type: "MEDICAL_PRODUCT", father_code: "CARDIO_INTERVENTION", value1: "3950000", description: "Implante percutáneo de válvulas cardíacas según indicación, con soporte hemodinámico y control angiográfico." }, // 6 (PRODUCT - Intervención Cardiovascular)
{ name: "Cateterismo cardiaco, angiocardiografía y coronariografía", code: "CARDIO_CATH_COMPREHENSIVE", type: "MEDICAL_PRODUCT", father_code: "CARDIO_INTERVENTION", value1: "1320000", description: "Estudio invasivo con cateterismo y evaluación de cavidades/arterias coronarias mediante contraste." }, // 7 (PRODUCT - Intervención Cardiovascular)

{ name: "Marcapasos", code: "PACEMAKER_IMPLANT", type: "MEDICAL_PROCEDURE", father_code: "CARDIOLOGY" }, // 8 (PROCEDURE - Marcapasos)
{ name: "Implantación de Marcapasos Unicameral", code: "PACEMAKER_SINGLE", type: "MEDICAL_PRODUCT", father_code: "PACEMAKER_IMPLANT", value1: "1678870", description: "Elemento quirúrgico con alta eficacia en recuperación funcional" }, // 9 (PRODUCT - Marcapasos) ✅ code intacto
{ name: "Implantación de Marcapasos Bicameral", code: "PACEMAKER_DUAL", type: "MEDICAL_PRODUCT", father_code: "PACEMAKER_IMPLANT", value1: "1834566", description: "Tratamiento innovador aprobado en medicina especializada" }, // 10 (PRODUCT - Marcapasos) ✅ code intacto
{ name: "Implante y control de marcapasos", code: "CARDIO_PACEMAKER_IMPLANT_CONTROL", type: "MEDICAL_PRODUCT", father_code: "PACEMAKER_IMPLANT", value1: "265000", description: "Revisión, interrogación y programación/ajuste de marcapasos (seguimiento y control clínico)." }, // 11 (PRODUCT - Marcapasos)
{ name: "Cambio de generador del marcapasos", code: "CARDIO_PACEMAKER_GENERATOR_CHANGE", type: "MEDICAL_PRODUCT", father_code: "PACEMAKER_IMPLANT", value1: "1450000", description: "Recambio del generador por fin de vida útil o indicación técnica, con pruebas y programación." }, // 12 (PRODUCT - Marcapasos)
{ name: "Extracción cable del marcapasos", code: "CARDIO_PACEMAKER_LEAD_EXTRACTION", type: "MEDICAL_PRODUCT", father_code: "PACEMAKER_IMPLANT", value1: "2100000", description: "Extracción de electrodo/cable por indicación (infección, falla, recambio), bajo protocolo especializado." }, // 13 (PRODUCT - Marcapasos)
{ name: "Implante de desfibrilador", code: "CARDIO_ICD_IMPLANT", type: "MEDICAL_PRODUCT", father_code: "PACEMAKER_IMPLANT", value1: "2850000", description: "Implante de desfibrilador automático (ICD) para prevención/tratamiento de arritmias malignas." }, // 14 (PRODUCT - Dispositivos)
{ name: "Implante de resincronizador", code: "CARDIO_CRT_IMPLANT", type: "MEDICAL_PRODUCT", father_code: "PACEMAKER_IMPLANT", value1: "3150000", description: "Implante de terapia de resincronización cardíaca (CRT) en pacientes seleccionados." }, // 15 (PRODUCT - Dispositivos)

{ name: "Ecocardiograma transtorácico (ETT) de reposo", code: "CARDIO_ECHO_TTE_REST", type: "MEDICAL_PROCEDURE", father_code: "CARDIOLOGY" }, // 16 (PROCEDURE - Ecocardiograma TTE)
{ name: "Ecocardiograma transtorácico (ETT) de reposo", code: "CARDIO_ECHO_TTE_REST_TEST", type: "MEDICAL_PRODUCT", father_code: "CARDIO_ECHO_TTE_REST", value1: "135000", description: "Ecocardiograma de reposo para evaluación de función ventricular, válvulas y estructuras cardíacas." }, // 17 (PRODUCT - Ecocardiograma TTE)

{ name: "Ecocardiograma transesofágico", code: "CARDIO_ECHO_TEE", type: "MEDICAL_PROCEDURE", father_code: "CARDIOLOGY" }, // 18 (PROCEDURE - Ecocardiograma TEE)
{ name: "Ecocardiograma transesofágico", code: "CARDIO_ECHO_TEE_TEST", type: "MEDICAL_PRODUCT", father_code: "CARDIO_ECHO_TEE", value1: "285000", description: "Ecocardiograma con sonda esofágica para evaluación detallada de estructuras y válvulas (según protocolo)." }, // 19 (PRODUCT - Ecocardiograma TEE)

{ name: "Ecocardiograma estrés con ejercicio", code: "CARDIO_ECHO_STRESS_EXERCISE", type: "MEDICAL_PROCEDURE", father_code: "CARDIOLOGY" }, // 20 (PROCEDURE - Eco Estrés Ejercicio)
{ name: "Ecocardiograma estrés con ejercicio", code: "CARDIO_ECHO_STRESS_EXERCISE_TEST", type: "MEDICAL_PRODUCT", father_code: "CARDIO_ECHO_STRESS_EXERCISE", value1: "255000", description: "Ecocardiograma bajo esfuerzo para evaluación de isquemia y respuesta funcional al ejercicio." }, // 21 (PRODUCT - Eco Estrés Ejercicio)

{ name: "Ecocardiograma estrés farmacológico con dobutamina", code: "CARDIO_ECHO_STRESS_DOBUTAMINE", type: "MEDICAL_PROCEDURE", father_code: "CARDIOLOGY" }, // 22 (PROCEDURE - Eco Estrés Dobutamina)
{ name: "Ecocardiograma estrés farmacológico con dobutamina", code: "CARDIO_ECHO_STRESS_DOBUTAMINE_TEST", type: "MEDICAL_PRODUCT", father_code: "CARDIO_ECHO_STRESS_DOBUTAMINE", value1: "295000", description: "Ecocardiograma con estrés farmacológico para evaluación de isquemia/viabilidad cuando no se realiza ejercicio." }, // 23 (PRODUCT - Eco Estrés Dobutamina)

{ name: "Electrocardiograma (ECG) con interpretación", code: "CARDIO_ECG_INTERPRETATION", type: "MEDICAL_PROCEDURE", father_code: "CARDIOLOGY" }, // 24 (PROCEDURE - ECG Interpretación)
{ name: "Electrocardiograma (ECG) con interpretación", code: "CARDIO_ECG_INTERPRETATION_TEST", type: "MEDICAL_PRODUCT", father_code: "CARDIO_ECG_INTERPRETATION", value1: "45000", description: "Registro de ECG en reposo e interpretación médica con reporte." }, // 25 (PRODUCT - ECG Interpretación)

{ name: "Electrocardiograma (ECG) con esfuerzo", code: "CARDIO_ECG_STRESS", type: "MEDICAL_PROCEDURE", father_code: "CARDIOLOGY" }, // 26 (PROCEDURE - ECG Esfuerzo)
{ name: "Electrocardiograma (ECG) con esfuerzo", code: "CARDIO_ECG_STRESS_TEST", type: "MEDICAL_PRODUCT", father_code: "CARDIO_ECG_STRESS", value1: "95000", description: "ECG durante esfuerzo para evaluación de respuesta eléctrica y signos inducibles por ejercicio." }, // 27 (PRODUCT - ECG Esfuerzo)

{ name: "Prueba de esfuerzo", code: "CARDIO_STRESS_TEST", type: "MEDICAL_PROCEDURE", father_code: "CARDIOLOGY" }, // 28 (PROCEDURE - Prueba de esfuerzo)
{ name: "Prueba de esfuerzo", code: "CARDIO_STRESS_TEST_STD", type: "MEDICAL_PRODUCT", father_code: "CARDIO_STRESS_TEST", value1: "125000", description: "Prueba de esfuerzo en banda/cicloergómetro con monitoreo y reporte según protocolo." }, // 29 (PRODUCT - Prueba de esfuerzo)

{ name: "Ablación para arritmias cardíacas", code: "CARDIO_ARRHYTHMIA_ABLATION", type: "MEDICAL_PROCEDURE", father_code: "CARDIOLOGY" }, // 30 (PROCEDURE - Ablación)
{ name: "Ablación para arritmias cardíacas", code: "CARDIO_ARRHYTHMIA_ABLATION_PROC", type: "MEDICAL_PRODUCT", father_code: "CARDIO_ARRHYTHMIA_ABLATION", value1: "2850000", description: "Procedimiento de electrofisiología con ablación (radiofrecuencia/crio según caso) para control de arritmias." }, // 31 (PRODUCT - Ablación)

{ name: "Holter", code: "CARDIO_HOLTER", type: "MEDICAL_PROCEDURE", father_code: "CARDIOLOGY" }, // 32 (PROCEDURE - Holter)
{ name: "Holter 24-48 horas", code: "CARDIO_HOLTER_24_48", type: "MEDICAL_PRODUCT", father_code: "CARDIO_HOLTER", value1: "85000", description: "Monitoreo continuo de ritmo cardíaco 24-48h con análisis e informe." }, // 33 (PRODUCT - Holter)

{ name: "Monitor de eventos cardiacos", code: "CARDIO_EVENT_MONITOR", type: "MEDICAL_PROCEDURE", father_code: "CARDIOLOGY" }, // 34 (PROCEDURE - Monitor de eventos)
{ name: "Monitor de eventos cardiacos", code: "CARDIO_EVENT_MONITOR_STD", type: "MEDICAL_PRODUCT", father_code: "CARDIO_EVENT_MONITOR", value1: "110000", description: "Monitoreo de eventos por periodos extendidos con registro por síntomas/episodios y reporte." }, // 35 (PRODUCT - Monitor de eventos)

{ name: "Monitoreo ambulatorio de presión arterial (MAPA)", code: "CARDIO_ABPM_MAPA", type: "MEDICAL_PROCEDURE", father_code: "CARDIOLOGY" }, // 36 (PROCEDURE - MAPA)
{ name: "MAPA 24 horas", code: "CARDIO_ABPM_MAPA_24", type: "MEDICAL_PRODUCT", father_code: "CARDIO_ABPM_MAPA", value1: "90000", description: "Monitoreo ambulatorio de presión arterial 24h con informe y promedios diurnos/nocturnos." }, // 37 (PRODUCT - MAPA)

{ name: "Monitoreo de presión arterial", code: "CARDIO_BP_MONITORING", type: "MEDICAL_PROCEDURE", father_code: "CARDIOLOGY" }, // 38 (PROCEDURE - PA)
{ name: "Monitoreo de presión arterial (consulta/control)", code: "CARDIO_BP_MONITORING_VISIT", type: "MEDICAL_PRODUCT", father_code: "CARDIO_BP_MONITORING", value1: "25000", description: "Toma y control de presión arterial con registro y recomendación básica según protocolo." }, // 39 (PRODUCT - PA)

{ name: "Angiografía coronaria por tomografía", code: "CARDIO_CT_CORONARY_ANGIO", type: "MEDICAL_PROCEDURE", father_code: "CARDIOLOGY" }, // 40 (PROCEDURE - AngioTAC)
{ name: "Angiografía coronaria por tomografía", code: "CARDIO_CT_CORONARY_ANGIO_TEST", type: "MEDICAL_PRODUCT", father_code: "CARDIO_CT_CORONARY_ANGIO", value1: "450000", description: "AngioTAC coronaria para evaluación no invasiva de arterias coronarias (según indicación)." }, // 41 (PRODUCT - AngioTAC)

{ name: "Pericardiocentesis", code: "CARDIO_PERICARDIOCENTESIS", type: "MEDICAL_PROCEDURE", father_code: "CARDIOLOGY" }, // 42 (PROCEDURE - Pericardiocentesis)
{ name: "Pericardiocentesis (procedimiento)", code: "CARDIO_PERICARDIOCENTESIS_PROC", type: "MEDICAL_PRODUCT", father_code: "CARDIO_PERICARDIOCENTESIS", value1: "980000", description: "Drenaje de líquido pericárdico guiado (ecografía/fluoroscopía según disponibilidad) por indicación clínica." }, // 43 (PRODUCT - Pericardiocentesis)

{ name: "Espirometría", code: "CARDIO_SPIROMETRY", type: "MEDICAL_PROCEDURE", father_code: "CARDIOLOGY" }, // 44 (PROCEDURE - Espirometría)
{ name: "Espirometría (prueba)", code: "CARDIO_SPIROMETRY_TEST", type: "MEDICAL_PRODUCT", father_code: "CARDIO_SPIROMETRY", value1: "65000", description: "Prueba funcional respiratoria para apoyo diagnóstico (preoperatorio/seguimiento según indicación)." }, // 45 (PRODUCT - Espirometría)

{ name: "Valoración pre-operatoria (incluye el electrocardiograma)", code: "CARDIO_PREOP_EVALUATION", type: "MEDICAL_PROCEDURE", father_code: "CARDIOLOGY" }, // 46 (PROCEDURE - Preoperatoria)
{ name: "Valoración pre-operatoria (incluye ECG)", code: "CARDIO_PREOP_EVALUATION_PACKAGE", type: "MEDICAL_PRODUCT", father_code: "CARDIO_PREOP_EVALUATION", value1: "125000", description: "Valoración cardiológica preoperatoria con ECG e informe de riesgo cardiovascular." }, // 47 (PRODUCT - Preoperatoria)

{ name: "Videoconsulta", code: "CARDIO_VIDEO_CONSULT", type: "MEDICAL_PROCEDURE", father_code: "CARDIOLOGY" }, // 48 (PROCEDURE - Videoconsulta)
{ name: "Videoconsulta cardiología", code: "CARDIO_VIDEO_CONSULT_VISIT", type: "MEDICAL_PRODUCT", father_code: "CARDIO_VIDEO_CONSULT", value1: "55000", description: "Consulta por videollamada con orientación clínica y plan de manejo (según alcance del servicio)." }, // 49 (PRODUCT - Videoconsulta)



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