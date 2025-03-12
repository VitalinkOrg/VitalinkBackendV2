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
        entities: [Location], // Array of entities to be used
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
        const locationRepository = dataSource.getRepository(Location);

        const locations = [
          {
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
        
}