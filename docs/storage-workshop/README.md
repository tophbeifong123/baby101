# Storage Workshop

เอกสารสำหรับช่วงที่ 3 ของค่าย: S3-compatible object storage ผ่าน Freshmen Profile Card

## Agenda ที่แนะนำ

1. Frontend session: เพื่อนสอน Next/React ก่อน
2. Backend & DB session: เพื่อนสอน NestJS/PostgreSQL/TypeORM
3. Storage session: ใช้หน้านี้ต่อยอดจาก backend/db ที่มีอยู่แล้ว

## ทำไม MinIO อยู่ใน compose ตั้งแต่แรก

เราใส่ MinIO ไว้ใน `docker-compose.yml` ตั้งแต่ต้นเพื่อให้ทุกคนรัน service ครั้งเดียวจบ:

```bash
docker compose up -d
```

แต่ในช่วง frontend/backend แรกๆ ยังไม่ต้องอธิบาย MinIO ลึก ให้บอกน้องสั้นๆ ว่า:

> ตัวนี้คือ service ที่จะใช้ช่วง Storage ตอนท้ายค่าย

แบบนี้ลดความเสี่ยงที่น้องต้องมาแก้ compose หรือ pull image ตอนเวลาจำกัด

## Ports

| Service | URL |
|---|---|
| Frontend | `http://localhost:3000` |
| Backend | `http://localhost:3001` |
| Swagger | `http://localhost:3001/api/docs` |
| MinIO Console | `http://localhost:9001` |
| MinIO API | `http://localhost:9000` |
| pgAdmin | `http://localhost:5050` |

## Student Checkpoints

### Checkpoint 1: Storage Console

1. เปิด `http://localhost:9001`
2. login ด้วย `minioadmin / minioadmin`
3. สร้าง bucket `club-assets`
4. upload รูปผ่าน console
5. ชี้ให้ได้ว่า object key คืออะไร

### Checkpoint 2: Backend Presigned URL

ยิง request:

```bash
curl -X POST http://localhost:3001/storage/presign-upload \
  -H 'Content-Type: application/json' \
  -d '{"filename":"avatar.png","contentType":"image/png","size":120000}'
```

ต้องได้:

```json
{
  "bucket": "club-assets",
  "key": "profiles/...",
  "uploadUrl": "http://localhost:9000/...",
  "expiresIn": 300
}
```

### Checkpoint 3: Frontend Upload

1. เปิด `http://localhost:3000/storage`
2. กรอก nickname
3. เลือกรูป
4. กด Create Profile
5. กลับไปดูใน MinIO Console แล้วเห็น object ใหม่

## Branch Strategy

แนะนำให้ใช้ branch แบบ staged:

- `storage`: branch รวมงาน storage ทั้งหมด
- `storage-starter`: branch สำหรับน้อง มี TODO/guide แต่ยังไม่เฉลยทั้งหมด
- `storage-solution`: branch เฉลยสมบูรณ์ ใช้ช่วยน้องที่ตามไม่ทัน

ถ้าเวลาน้อย ให้ใช้ `storage` หรือ `storage-solution` เป็น demo แล้วให้น้องทำ checkpoint เฉพาะ console + frontend upload

## Key Message

```txt
Frontend เลือกไฟล์
Backend ออก presigned URL
Storage เก็บไฟล์จริง
Database เก็บ metadata/object key
```
