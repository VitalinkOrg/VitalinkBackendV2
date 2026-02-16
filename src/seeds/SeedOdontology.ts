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

const udcRepository = await dataSource.getRepository(UnitDynamicCentral);


 const MedicalType = [
        { 
            name: "Odontología ", 
            code: "ODONTOLOGHY_MEDICAL", 
            type: "MEDICAL_TYPE" as "MEDICAL_TYPE",
            description: "Profesional de la salud que brinda atención médica Odontológica."
        }
    ];
    await udcRepository.upsert(MedicalType, ["code"]);



  //Medical Specialties
    const MedicalSpecialties = [
        { name: "Odontología", code: "ODONTOLOGHY", type: "ODONTOLOGHY_MEDICAL" }
    ];
    await udcRepository.upsert(MedicalSpecialties, ["code"]);




 const ProceduresAndProducts = 

       // Procedimientos Odontología (valores aproximados en CRC, ajustables a tu tarifa/mercado)
[
  {
    name: "Implantes dentales",
    code: "ODONTO_DENTAL_IMPLANTS",
    type: "MEDICAL_PRODUCT",
    father_code: "ODONTOLOGHY",
    value1: "950000",
    description: "Colocación de implante dental para reemplazar la raíz de un diente perdido y permitir su rehabilitación funcional y estética."
  },
  {
    name: "Prótesis fijas sobre implantes",
    code: "ODONTO_IMPLANT_SUPPORTED_FIXED_PROSTHESIS",
    type: "MEDICAL_PRODUCT",
    father_code: "ODONTOLOGHY",
    value1: "3200000",
    description: "Rehabilitación fija soportada por implantes (puentes/prótesis) para restaurar mordida, estabilidad y estética con alta durabilidad."
  },
  {
    name: "Diseño de sonrisa",
    code: "ODONTO_SMILE_DESIGN",
    type: "MEDICAL_PRODUCT",
    father_code: "ODONTOLOGHY",
    value1: "400000",
    description: "Planificación estética y funcional de la sonrisa (proporciones, forma, color) para definir un resultado final armonioso antes del tratamiento."
  },
  {
    name: "Carillas dentales",
    code: "ODONTO_DENTAL_VENEERS",
    type: "MEDICAL_PRODUCT",
    father_code: "ODONTOLOGHY",
    value1: "230000",
    description: "Láminas estéticas (resina/cerámica) para mejorar color, forma y pequeñas desalineaciones en dientes anteriores."
  },
  {
    name: "Coronas estéticas",
    code: "ODONTO_ESTHETIC_CROWNS",
    type: "MEDICAL_PRODUCT",
    father_code: "ODONTOLOGHY",
    value1: "280000",
    description: "Cobertura total del diente con una corona estética (p. ej., cerámica/zirconia) para restaurar estructura, fuerza y apariencia."
  },
  {
    name: "Ortodoncia",
    code: "ODONTO_ORTHODONTICS",
    type: "MEDICAL_PRODUCT",
    father_code: "ODONTOLOGHY",
    value1: "1250000",
    description: "Tratamiento para alinear dientes y corregir mordida mediante aparatología (brackets u otras técnicas) con enfoque funcional y estético."
  },
  {
    name: "Alineadores Invisibles",
    code: "ODONTO_INVISIBLE_ALIGNERS",
    type: "MEDICAL_PRODUCT",
    father_code: "ODONTOLOGHY",
    value1: "2500000",
    description: "Alineación dental con férulas transparentes removibles, planificadas por etapas para mejorar estética y oclusión con discreción."
  },
  {
    name: "Extracción de cordales",
    code: "ODONTO_WISDOM_TEETH_EXTRACTION",
    type: "MEDICAL_PRODUCT",
    father_code: "ODONTOLOGHY",
    value1: "160000",
    description: "Extracción de terceros molares (cordales) por dolor, falta de espacio, infecciones o indicación preventiva según evaluación clínica."
  },
  {
    name: "Cirugía oral especializada",
    code: "ODONTO_SPECIALIZED_ORAL_SURGERY",
    type: "MEDICAL_PRODUCT",
    father_code: "ODONTOLOGHY",
    value1: "350000",
    description: "Procedimientos quirúrgicos avanzados de boca (manejo de tejidos, lesiones, extracciones complejas u otras intervenciones según el caso)."
  },
  {
    name: "Endodoncia",
    code: "ODONTO_ENDODONTICS",
    type: "MEDICAL_PRODUCT",
    father_code: "ODONTOLOGHY",
    value1: "210000",
    description: "Tratamiento de conducto para eliminar infección o inflamación pulpar y conservar el diente, sellando el sistema de raíces."
  },
  {
    name: "Reconstrucción dental",
    code: "ODONTO_DENTAL_RECONSTRUCTION",
    type: "MEDICAL_PRODUCT",
    father_code: "ODONTOLOGHY",
    value1: "90000",
    description: "Reconstrucción de estructura dental perdida (resina/incrustación según el caso) para recuperar forma, función y puntos de contacto."
  },
  {
    name: "Periodoncia",
    code: "ODONTO_PERIODONTICS",
    type: "MEDICAL_PRODUCT",
    father_code: "ODONTOLOGHY",
    value1: "180000",
    description: "Diagnóstico y tratamiento de encías y soporte óseo (gingivitis/periodontitis), incluyendo terapias para controlar sangrado e inflamación."
  },
  {
    name: "Rehabilitación dental",
    code: "ODONTO_DENTAL_REHABILITATION",
    type: "MEDICAL_PRODUCT",
    father_code: "ODONTOLOGHY",
    value1: "1900000",
    description: "Plan integral para recuperar función masticatoria y estética (coronas, puentes, prótesis y/o implantes) según necesidad del paciente."
  },
  {
    name: "Odontología Integral",
    code: "ODONTO_COMPREHENSIVE_DENTISTRY",
    type: "MEDICAL_PRODUCT",
    father_code: "ODONTOLOGHY",
    value1: "45000",
    description: "Atención general e integral: evaluación, diagnóstico y plan de tratamiento global para la salud bucodental del paciente."
  },
  {
    name: "Limpieza y profilaxis",
    code: "ODONTO_CLEANING_AND_PROPHYLAXIS",
    type: "MEDICAL_PRODUCT",
    father_code: "ODONTOLOGHY",
    value1: "35000",
    description: "Remoción de placa y sarro, pulido y recomendaciones de higiene para prevención de caries y enfermedad periodontal."
  },
  {
    name: "Blanqueamiento dental",
    code: "ODONTO_TEETH_WHITENING",
    type: "MEDICAL_PRODUCT",
    father_code: "ODONTOLOGHY",
    value1: "140000",
    description: "Aclaramiento del tono dental con agentes blanqueadores (en clínica y/o supervisado) para mejorar la estética de la sonrisa."
  }
];
    
    await udcRepository.upsert(ProceduresAndProducts, ["code"]);


    console.log("Seeds odonto done!");

}

runSeed().catch((error) => console.error(error));