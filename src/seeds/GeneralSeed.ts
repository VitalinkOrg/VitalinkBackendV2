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
        extra: {
            connectionLimit: 150, 
        },
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
        { name: "credit card", code: "CREDIT_CARD", type: "PAYMENT_METHOD" as "PAYMENT_METHOD" },
        { name: "en consulta", code: "ON_CONSULTATION", type: "PAYMENT_METHOD" as "PAYMENT_METHOD" },
        { name: "pago por crédito", code: "CREDIT_PAYMENT", type: "PAYMENT_METHOD" as "PAYMENT_METHOD" },
        { name: "pago dividido", code: "SPLIT_PAYMENT", type: "PAYMENT_METHOD" as "PAYMENT_METHOD" }
    ];
    await udcRepository.upsert(paymentMethods, ["code"]);

    // Asking Credit Status
    const askingCreditStatus = [
        { name: "aprobado", code: "APPROVED", type: "ASKING_CREDIT_STATUS" as "ASKING_CREDIT_STATUS" },
        { name: "rechazado", code: "REJECTED", type: "ASKING_CREDIT_STATUS" as "ASKING_CREDIT_STATUS" },
        { name: "aprobado un porcentaje", code: "APPROVED_PERCENTAGE", type: "ASKING_CREDIT_STATUS" as "ASKING_CREDIT_STATUS" }
    ];
    await udcRepository.upsert(askingCreditStatus, ["code"]);

    // Supplier Type
    const supplierType = [
        { name: "EXPERIENCE", code: "EXPERIENCE", type: "SUPPLIER_TYPE" as "SUPPLIER_TYPE" },
        { name: "EDUCATION", code: "EDUCATION", type: "SUPPLIER_TYPE" as "SUPPLIER_TYPE" }
    ];
    await udcRepository.upsert(supplierType, ["code"]);


  
      console.log("General seed done!");
}

runSeed().catch((error) => console.error(error));