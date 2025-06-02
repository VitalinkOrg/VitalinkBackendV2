//*************************************** */
//              Configuration
//*************************************** */
import path from 'path';
import ConfigManager from '@TenshiJS/config/ConfigManager';
import { DataSource } from 'typeorm';

// Set configuration first time
const configPath = path.resolve(__dirname, '../../tenshi-config.json');
const configManager = ConfigManager.getInstance(configPath);
const config = configManager.getConfig();

async function createStoredProcedures() {
  // Conexión a MySQL sin especificar base de datos
  const connection = new DataSource({
    type: config.DB.TYPE,
    host: config.DB.HOST,
    port: config.DB.PORT,
    username: config.DB.USER,
    password: config.DB.PASSWORD,
    database: config.DB.NAME,
  });

  await connection.initialize();

  // Stored Procedure: GetUserNotifications
  await connection.query(`
    DROP PROCEDURE IF EXISTS GetUserNotifications;
  `);

  await connection.query(`
    CREATE PROCEDURE GetUserNotifications(
      IN pSenderEmail VARCHAR(250),
      IN pReceiverEmail VARCHAR(250),
      IN pPageSize INT,
      IN pPageNumber INT
    )
    BEGIN
      DECLARE pOffset INT DEFAULT 0;
      DECLARE pLimit INT;

      IF (pPageSize IS NOT NULL AND pPageSize <> 0) AND (pPageNumber IS NOT NULL AND pPageNumber <> 0) THEN
          SET pOffset = (pPageNumber - 1) * pPageSize;
          SET pLimit = pPageSize;
      ELSE
          SET pLimit = 50000;
      END IF;

      SELECT
          un.id,
          un.created_date AS notification_date,
          un.is_read,
          n.code AS notification_code,
          n.subject AS notification_subject,
          n.message AS notification_message,
          n.another_message AS notification_another_message,
          n.required_send_email,
          n.text_from_email_message_json,
          n.action_url,
          n.email_template,
          n.action_text,
          n.language,
          s.id AS sender_id,
          s.email AS sender_email,
          r.id AS receiver_id,
          r.email AS receiver_email
      FROM
          user_notifications un
      INNER JOIN
          notifications n ON un.notification = n.code
      LEFT OUTER JOIN
          users s ON un.user_send = s.id
      INNER JOIN
          users r ON un.user_receive = r.id
      WHERE
          un.is_deleted = 0
          AND (COALESCE(pSenderEmail, '') = '' OR s.id = pSenderEmail)
          AND (COALESCE(pReceiverEmail, '') = '' OR r.id = pReceiverEmail)
      LIMIT pLimit
      OFFSET pOffset;
    END
  `);

  // Stored Procedure: GetLogsWithFilters
  await connection.query(`
    DROP PROCEDURE IF EXISTS GetLogsWithFilters;
  `);

  await connection.query(`
    CREATE PROCEDURE GetLogsWithFilters(
      IN pEnvironment VARCHAR(200),
      IN pUserId VARCHAR(200),
      IN pType VARCHAR(40),
      IN pPageSize INT,
      IN pPageNumber INT
    )
    BEGIN
      DECLARE pOffset INT DEFAULT 0;
      DECLARE pLimit INT;

      IF (pPageSize IS NOT NULL AND pPageSize <> 0) AND (pPageNumber IS NOT NULL AND pPageNumber <> 0) THEN
          SET pOffset = (pPageNumber - 1) * pPageSize;
          SET pLimit = pPageSize;
      ELSE
          SET pLimit = 50000;
      END IF;

      SELECT
          id,
          method,
          class,
          type,
          action,
          https,
          message,
          data,
          created_date,
          user_id,
          ip_address,
          environment,
          platform,
          device_information
      FROM
          logs
      WHERE
          (COALESCE(pEnvironment, '') = '' OR environment = pEnvironment)
          AND (COALESCE(pUserId, '') = '' OR user_id = pUserId)
          AND (COALESCE(pType, '') = '' OR type = pType)
      LIMIT pLimit
      OFFSET pOffset;
    END
  `);

  await connection.destroy();
  console.log('Stored procedures created successfully.');
}

createStoredProcedures().catch((err) => {
  console.error('Error creating stored procedures:', err);
});
