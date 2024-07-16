require('dotenv').config();
import s3 from '@config/awsS3Config';
import { Document } from '@entity/Document';

export async function uploadFile(file : Express.Multer.File, filename: string) : Promise<any>{
    const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: filename,
        Body: file.buffer,
        ContentType: file.mimetype, 
       // ACL: 'public-read', // opcional, establece los permisos de acceso al objeto
      };

      const result = await s3.upload(params).promise();
      return result.Location;
}

export function setNameDocument (file : Express.Multer.File,  documentBody : Document ): Document{
    let fileName : string = file.originalname; 
    const extension = fileName.split('.').pop(); 
    documentBody.extension = extension!;

    const formatDate = new Date().toLocaleDateString('es-ES').replace(/\//g, '') + new Date().toLocaleTimeString('es-ES').replace(/:/g, '');

    const name = documentBody.action_type + "__" + documentBody.table +  "__" + documentBody.id_for_table;
    fileName = name + "__" + documentBody.type + "__" + formatDate;

    documentBody.file_name = fileName;
    documentBody.title = documentBody.action_type + "__" + formatDate;

    return documentBody;
}