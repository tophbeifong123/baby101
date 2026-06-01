# NotebookLM Slide Prompts

NotebookLM จำกัดประมาณ 15 หน้า ให้แยก prompt เป็น 3 deck ตามนี้

## Deck 1: Concept 15 Slides

```text
สร้างสไลด์ภาษาไทย 15 หน้า สไตล์ modern engineering blueprint สำหรับน้องปี 1 ที่พื้นฐานน้อยมาก หัวข้อ Object Storage และ S3-compatible storage

เป้าหมาย:
- เข้าใจว่าทำไมไม่ควรเก็บไฟล์ upload ไว้ใน backend folder
- เข้าใจ block/file/object storage แบบง่าย
- เข้าใจ bucket, object, object key, endpoint, credentials
- เข้าใจว่า S3 = Simple Storage Service และ S3-compatible คือ API ภาษากลาง
- ใช้ภาพ flow/diagram เยอะ อ่านง่าย ไม่ใส่ text แน่น

Slide outline:
1. Title: Build a Modern Upload System
2. โจทย์เว็บชมรม: upload รูปโปรไฟล์
3. วิธีมือใหม่: เก็บใน uploads folder
4. ปัญหา local upload: deploy หาย, disk เต็ม, scale ยาก
5. ภาพ load balancer กับ backend 2 ตัวที่ไฟล์ไม่ sync
6. Storage 101: Block vs File vs Object
7. Object Storage คืออะไร
8. Bucket คือกล่อง, Object คือไฟล์, Key คือชื่อไฟล์ในกล่อง
9. Object key ไม่ใช่ folder จริง
10. S3 ย่อมาจาก Simple Storage Service
11. S3-compatible คืออะไร
12. Provider examples: AWS S3, MinIO, AIStor, R2, Wasabi
13. MinIO/AIStor อยู่ตรงไหนในภาพรวม
14. Data vs Metadata: ไฟล์อยู่ storage, key อยู่ database
15. Recap: File in storage, metadata in DB, secret in backend

Style:
- ใช้ diagram, icon, flow arrows
- ภาษาไทยง่าย
- มี analogy เช่น bucket = กล่อง
- ห้ามลงลึก enterprise เกินไป
```

## Deck 2: Workshop Lab 15 Slides

```text
สร้างสไลด์ภาษาไทย 15 หน้า สำหรับ hands-on workshop ต่อจาก concept เรื่อง S3-compatible object storage

บริบท:
- Repo มี frontend Next.js, backend NestJS, PostgreSQL, MinIO ใน docker-compose
- น้อง fork repo แล้ว checkout storage-starter หรือ storage
- น้องจะสร้าง bucket และต่อ backend presigned upload URL
- ต้องมีภาพ UI/flow เยอะ ชัดเจนมาก

Slide outline:
1. Workshop Architecture: Frontend, Backend, PostgreSQL, MinIO
2. Ports map: Frontend 3000, Backend 3001, MinIO API 9000, Console 9001
3. Start services: docker compose up -d
4. Open MinIO Console at localhost:9001
5. Login: minioadmin/minioadmin
6. Create bucket: club-assets
7. Upload file manually through console
8. Show object key in console
9. Why website users should not use console
10. Upload pattern A: upload through backend
11. Upload pattern B: presigned URL
12. Why frontend must not keep S3 secret
13. Backend API: POST /storage/presign-upload
14. Backend returns key + uploadUrl + expiresIn
15. Checkpoint: curl backend and confirm uploadUrl

Style:
- ทำเป็น step-by-step visual checklist
- มี screenshot-like mockup ของ MinIO Console
- มี arrows แสดง request flow
- เน้นว่า MinIO ใช้ local dev, production อาจเป็น AIStor/S3
```

## Deck 3: Frontend + Best Practices 15 Slides

```text
สร้างสไลด์ภาษาไทย 15 หน้า สำหรับช่วง frontend integration และ best practices ของ object storage upload workshop

บริบท:
- น้องมี backend ที่สร้าง presigned URL ได้แล้ว
- น้องจะใช้หน้า /storage ใน Next.js เพื่อ upload avatar
- project คือ Freshmen Profile Card
- เด็กพื้นฐานน้อย ต้องเห็น flow ชัด ไม่เน้น code ยาว

Slide outline:
1. Frontend upload flow overview
2. User selects avatar file
3. Frontend calls backend for upload URL
4. Backend validates type/size and generates object key
5. Frontend PUT file directly to MinIO using uploadUrl
6. Frontend saves nickname + avatarKey to backend
7. Backend stores metadata in PostgreSQL
8. Backend creates signed read URL to show image
9. Freshmen Profile Card final result
10. Common bug: Bucket not found
11. Common bug: CORS
12. Common bug: Signature mismatch
13. Security best practices: private bucket, short expiry, no secret in frontend
14. Production transition: Local MinIO -> AIStor/AWS S3 by changing env
15. Final recap and checklist

Style:
- ใช้ flow diagram ทุก 2-3 หน้า
- code snippets สั้นมาก ไม่เกิน 5 บรรทัด
- เน้นภาพมากกว่าข้อความ
- ใช้คำว่า “บัตรผ่านชั่วคราว” อธิบาย presigned URL
```
