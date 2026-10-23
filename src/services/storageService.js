const { S3Client, PutObjectCommand, GetObjectCommand }= require("@aws-sdk/client-s3")
const { getSignedUrl }= require("@aws-sdk/s3-request-presigner")
const env= require("../config/env")
const createClient= (endpoint)=> new S3Client({ endpoint, region: "us-east-1", forcePathStyle: true, credentials: { accessKeyId: env.minio.user, secretAccessKey: env.minio.password } })
const uploadClient= createClient(env.minio.endpoint)
const presignClient= createClient(env.minio.publicEndpoint)
const uploadFile= async (key, buffer, contentType)=> {
  await uploadClient.send(new PutObjectCommand({ Bucket: env.minio.bucket, Key: key, Body: buffer, ContentType: contentType }))
  return { bucket: env.minio.bucket, s3Key: key, sizeBytes: buffer.length }
}
const getDownloadUrl= async (key)=> {
  return await getSignedUrl(presignClient, new GetObjectCommand({ Bucket: env.minio.bucket, Key: key }), { expiresIn: env.minio.presignedTtl })
}
module.exports= { 
    uploadFile,
     getDownloadUrl
     }