# Storage Troubleshooting

## 404 Bucket not found

ยังไม่ได้สร้าง bucket `club-assets` ใน MinIO Console หรือชื่อใน `.env` ไม่ตรง

## 403 Forbidden

สาเหตุที่พบบ่อย:

- presigned URL หมดอายุ
- access key/secret key ไม่ตรงกับ MinIO
- เอา upload URL เก่ามาใช้ซ้ำหลัง expiry

## SignatureDoesNotMatch

เช็ก env:

```env
S3_ENDPOINT=http://localhost:9000
S3_REGION=us-east-1
S3_FORCE_PATH_STYLE=true
```

## CORS error

ตรวจว่า:

- frontend ใช้ `uploadUrl` จาก backend จริง
- method เป็น `PUT`
- header `Content-Type` ตรงกับตอนขอ presign
- MinIO container ถูกสร้างใหม่หลังเพิ่ม env `MINIO_API_CORS_ALLOW_ORIGIN`

## Port ชน

ถ้า port 9000/9001 ชน ให้แก้ root `.env`:

```env
MINIO_API_PORT=9100
MINIO_CONSOLE_PORT=9101
S3_ENDPOINT=http://localhost:9100
```

และเปิด console ที่:

```txt
http://localhost:9101
```
