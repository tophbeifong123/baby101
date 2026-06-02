# 📖 คู่มือ Baby 101 Backend — สอน Junior แบบ Step-by-Step

> 🎓 **คู่มือฉบับสมบูรณ์สำหรับการเรียนรู้ Backend Development**
> ด้วย **NestJS 11 + TypeORM + PostgreSQL 16 + Docker + JWT**

---

## 🎯 เป้าหมายของคู่มือนี้

เมื่ออ่านจบและทำตามทุกขั้นตอน คุณจะสามารถ:

- ✅ ติดตั้งเครื่องมือที่จำเป็นสำหรับ Backend Development
- ✅ รันฐานข้อมูล PostgreSQL ด้วย Docker
- ✅ ตั้งค่าและรัน Backend (NestJS) บนเครื่องตัวเอง
- ✅ เข้าใจโครงสร้างโปรเจกต์ NestJS (Module / Controller / Service / Entity)
- ✅ เรียก API ผ่าน Swagger UI
- ✅ สมัคร user, login, สร้าง function, ใช้ token quota
- ✅ อ่านและแก้ไขโค้ด Backend ได้อย่างมั่นใจ

---

## 📋 สิ่งที่จะได้เรียนรู้

| หัวข้อ | สิ่งที่ได้เรียนรู้ |
|---|---|
| **Backend Framework** | NestJS 11 — Module pattern, Controller, Service, DTO |
| **Database** | PostgreSQL 16, TypeORM Entity, Relationships |
| **Authentication** | JWT, Passport, bcrypt password hashing |
| **API Documentation** | Swagger / OpenAPI |
| **DevOps** | Docker, Docker Compose, Environment Variables |
| **Background Jobs** | Scheduled Cron Tasks (auto token refill) |

---

## 🗺️ ภาพรวมสถาปัตยกรรม (Backend Focus)

```
┌──────────────────────────────────────────────────────────────────────┐
│                          🌐 ฝั่ง Client (Browser/Postman)              │
└──────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTP/JSON + JWT Token
                                    ▼
┌──────────────────────────────────────────────────────────────────────┐
│                    ⚙️ NestJS Backend (Port 3000)                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │   Auth   │  │  Users   │  │Functions │  │  Tokens  │              │
│  │ Module   │  │  Module  │  │  Module  │  │  Module  │              │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘              │
│         │              │             │             │                   │
│         └──────────────┴─────────────┴─────────────┘                   │
│                            │                                          │
│                            ▼                                          │
│                  ┌─────────────────────┐                              │
│                  │  TypeORM (ORM)      │                              │
│                  │  + JWT Guard        │                              │
│                  │  + Cron Scheduler   │                              │
│                  └─────────────────────┘                              │
└──────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ SQL Queries
                                    ▼
┌──────────────────────────────────────────────────────────────────────┐
│                  🐘 PostgreSQL Database (Port 5432)                    │
│  ┌──────────┐  ┌──────────────┐  ┌──────────────┐                    │
│  │  users   │  │  functions   │  │  user_tokens │                    │
│  │  table   │  │    table     │  │    table     │                    │
│  └──────────┘  └──────────────┘  └──────────────┘                    │
└──────────────────────────────────────────────────────────────────────┘
                                    ▲
                                    │
┌──────────────────────────────────────────────────────────────────────┐
│              🛠️ pgAdmin (Port 5050) — DB Management UI              │
└──────────────────────────────────────────────────────────────────────┘
```

**Data Flow (เมื่อ Client เรียก API):**

1. Client ส่ง HTTP Request ไปที่ `http://localhost:3000/...` พร้อม JWT Token
2. NestJS รับ request → **Guard** ตรวจสอบ JWT
3. **Controller** รับ request → ส่งต่อให้ **Service**
4. **Service** ประมวลผล → เรียก **TypeORM Repository**
5. TypeORM แปลงเป็น SQL → query PostgreSQL
6. PostgreSQL ส่งข้อมูลกลับ → TypeORM → Service → Controller
7. Controller ส่ง JSON Response กลับไปยัง Client

---

## 📑 สารบัญ (Table of Contents)

| STEP | หัวข้อ | เวลาโดยประมาณ |
|:---:|---|:---:|
| **0** | 🛠️ เตรียมเครื่องให้พร้อม (Prerequisites) | 15 นาที |
| **1** | 🚀 สร้างโปรเจกต์ NestJS แรก (Hello World) | 20 นาที |
| **2** | 🐘 ต่อ Database (TypeORM + PostgreSQL) | 15 นาที |
| **3** | 👤 สร้าง Users Module (Entity + CRUD) | 20 นาที |
| **4** | 🔐 สร้าง Auth Module (Register + Login + JWT) | 25 นาที |
| **5** | ⚡ สร้าง Functions Module (CRUD) | 15 นาที |
| **6** | 🎟️ สร้าง Tokens Module + Cron Refill | 25 นาที |
| **7** | 🧪 ทดลองเรียก API แบบ End-to-End | 20 นาที |
| **8** | 🚨 ปัญหาที่พบบ่อย & วิธีแก้ | 10 นาที |
| **9** | 🎓 ฝึกเขียนเอง (Backend Exercises) | ฝึกเอง |

> 💡 **หมายเหตุ:** คู่มือนี้สอนแบบ **Build From Scratch** — เราจะสร้างโปรเจกต์ NestJS ขึ้นมาใหม่ทั้งหมด ไม่ clone จาก Git เพื่อให้เห็นทุกไฟล์ที่ถูกสร้างและเข้าใจการทำงานทีละขั้น

---

# 🛠️ STEP 0: เตรียมเครื่องให้พร้อม (Prerequisites)

> 💡 **ทำไมต้องมี STEP นี้?**
> เพราะ Backend Development ใช้เครื่องมือหลายตัว — ถ้าติดตั้งไม่ครบ จะรันโปรเจกต์ไม่ได้
> STEP นี้ใช้เวลาทำครั้งเดียว หลังจากนั้นจะใช้ซ้ำได้ตลอด

---

## 0.1 ติดตั้ง Node.js (LTS)

**🎯 ทำอะไร:** ดาวน์โหลดและติดตั้ง Node.js เวอร์ชัน 20.x ขึ้นไป

**🤔 ทำไม:**
NestJS คือ Node.js Framework — โค้ด TypeScript จะถูกแปลงเป็น JavaScript แล้วรันบน Node.js runtime
ถ้าไม่มี Node.js ก็รัน Backend ไม่ได้

**📥 วิธีทำ:**

1. ไปที่เว็บ https://nodejs.org/
2. ดาวน์โหลดเวอร์ชัน **LTS** (แนะนำ 20.x หรือ 22.x)
3. รัน installer → กด Next ไปเรื่อย ๆ (default options ใช้ได้เลย)

**✅ ตรวจสอบผลลัพธ์:**

เปิด Terminal (Mac/Linux) หรือ PowerShell (Windows) แล้วพิมพ์:

```bash
node -v
# ควรแสดงเวอร์ชัน เช่น: v20.11.0

npm -v
# ควรแสดงเวอร์ชัน เช่น: 10.2.4
```

> ⚠️ **ข้อควรระวัง:**
> - ห้ามใช้เวอร์ชันต่ำกว่า 18 (จะมีปัญหากับ NestJS 11)
> - ถ้าพิมพ์ `node -v` แล้ว "ไม่เจอคำสั่ง" ให้ปิด-เปิด Terminal ใหม่ หรือ restart เครื่อง

💡 **Concept: Node.js คืออะไร?**
Node.js คือ runtime ที่เอา JavaScript ไปรันนอกเว็บเบราว์เซอร์ ทำให้เราเขียน Backend ด้วย JavaScript/TypeScript ได้

---

## 0.2 ติดตั้ง pnpm (Package Manager สำหรับ Backend)

**🎯 ทำอะไร:** ติดตั้ง pnpm แบบ global

**🤔 ทำไม:**
โปรเจกต์ backend ใช้ pnpm แทน npm เพราะ:
- เร็วกว่า npm ประมาณ 2-3 เท่า
- ใช้พื้นที่ disk น้อยกว่า (ใช้ hard link แทน copy)
- มี lockfile ที่เข้มงวดกว่า ทำให้ทุกคนได้ dependencies เวอร์ชันเดียวกัน

**📥 วิธีทำ:**

```bash
npm install -g pnpm
```

**✅ ตรวจสอบผลลัพธ์:**

```bash
pnpm -v
# ควรแสดงเวอร์ชัน เช่น: 9.x.x
```

> ⚠️ **ข้อควรระวัง:**
> - ถ้า error "permission denied" บน Mac/Linux ให้ใช้ `sudo npm install -g pnpm`
> - บน Windows ให้เปิด PowerShell แบบ **Run as Administrator**

💡 **Concept: pnpm vs npm ต่างกันยังไง?**
ทั้งคู่ทำหน้าที่เหมือนกัน (ติดตั้ง package) แต่ pnpm เก็บ package ไว้ใน disk แค่ที่เดียว แล้วใช้ hard link ไปยังโปรเจกต์ต่าง ๆ ทำให้ประหยัดพื้นที่และเร็วกว่า

---

## 0.3 ติดตั้ง Docker Desktop

**🎯 ทำอะไร:** ดาวน์โหลดและติดตั้ง Docker Desktop

**🤔 ทำไม:**
PostgreSQL จะถูกรันใน **Docker container** ไม่ได้ติดตั้งลงเครื่องโดยตรง เพราะ:
- ไม่ต้องตั้งค่า PostgreSQL เอง (ไม่ต้องสร้าง user, กำหนด port, ฯลฯ)
- ลบ/สร้างใหม่ได้ง่าย ไม่ทิ้งขยะในเครื่อง
- เหมือนกันทุกเครื่อง (Windows/Mac/Linux)
- ในอนาคต deploy ขึ้น production ก็ใช้ Docker เหมือนกัน

**📥 วิธีทำ:**

1. ไปที่เว็บ https://www.docker.com/products/docker-desktop/
2. ดาวน์โหลดเวอร์ชันที่ตรงกับ OS ของคุณ
3. รัน installer → รอจนเสร็จ
4. **เปิด Docker Desktop** → รอจน icon ที่ taskbar **หยุดหมุน** (ใช้เวลา 1-2 นาที)

**✅ ตรวจสอบผลลัพธ์:**

```bash
docker --version
# ควรแสดง: Docker version 24.x หรือสูงกว่า

docker compose version
# ควรแสดง: Docker Compose version v2.x
```

> ⚠️ **ข้อควรระวัง:**
> - บน Windows ต้องเปิด **WSL 2** ก่อน (Docker Desktop จะแนะนำตอนติดตั้ง)
> - ต้องเปิด Docker Desktop ทิ้งไว้เสมอตอนใช้งาน — ถ้าปิด = Database ก็จะหายไปด้วย
> - ตรวจดูว่า Docker Desktop icon **นิ่งแล้ว** (ไม่หมุน) ก่อนรันคำสั่ง

💡 **Concept: Docker คืออะไร?**
Docker คือเครื่องมือที่ "ห่อ" แอปพลิเคชัน + dependencies ทั้งหมดไว้ในกล่อง (container) เพื่อให้รันได้เหมือนกันทุกเครื่อง โดยไม่ต้องติดตั้งลง OS โดยตรง เปรียบเหมือน "virtual machine ขนาดเล็ก"

---

## 0.4 ติดตั้ง Git

**🎯 ทำอะไร:** ติดตั้ง Git สำหรับ clone repository

**🤔 ทำไม:**
Git ใช้ดาวน์โหลด source code จาก GitHub และจัดการเวอร์ชันของโค้ด

**📥 วิธีทำ:**

```bash
# Windows: ดาวน์โหลดจาก https://git-scm.com/

# Mac:
xcode-select --install

# Linux (Ubuntu/Debian):
sudo apt install git
```

**✅ ตรวจสอบผลลัพธ์:**

```bash
git --version
# ควรแสดง: git version 2.x.x
```

---

## 0.5 ติดตั้ง Visual Studio Code (Code Editor แนะนำ)

**🎯 ทำอะไร:** ติดตั้ง VS Code พร้อม Extensions สำหรับ Backend

**🤔 ทำไม:**
VS Code มี Extensions ที่ช่วยเขียน TypeScript, ดู Docker, debug, และจัด format อัตโนมัติ

**📥 วิธีทำ:**

1. ดาวน์โหลดจาก https://code.visualstudio.com/
2. ติดตั้ง Extensions แนะนำ:

| Extension | ทำไมต้องมี |
|---|---|
| **ESLint** | ตรวจจับ error ในโค้ดแบบ real-time |
| **Prettier** | จัด format โค้ดอัตโนมัติ |
| **Thunder Client** | ทดสอบ API ใน VS Code (ไม่ต้องเปิด Postman) |
| **Docker** | จัดการ Docker containers ใน VS Code |
| **GitLens** | ดู git history แบบละเอียด |
| **TypeScript Nightly** | IntelliSense ดีขึ้นสำหรับ TypeScript |

---

## 📋 สรุปสิ่งที่ต้องติดตั้งให้ครบก่อนไป STEP 1

| เครื่องมือ | เวอร์ชันขั้นต่ำ | ตรวจสอบ | สถานะ |
|---|---|---|---|
| **Node.js** | 20.x+ | `node -v` | ⬜ |
| **npm** | 10.x+ | `npm -v` | ⬜ |
| **pnpm** | 9.x+ | `pnpm -v` | ⬜ |
| **Docker Desktop** | 24.x+ | `docker --version` | ⬜ |
| **Git** | 2.x+ | `git --version` | ⬜ |
| **VS Code** | ล่าสุด | เปิดดูได้ | ⬜ |

> ✅ **Checkpoint:** ถ้าทุกคำสั่งตรวจสอบผ่านหมด → ไปต่อ **STEP 1** ได้เลย!

---

## 🎯 แบบทดสอบก่อนไป STEP 1

ลองรันคำสั่งนี้ใน Terminal ทีเดียว:

```bash
node -v && npm -v && pnpm -v && docker --version && git --version
```

ถ้าแสดงเวอร์ชันทุกตัวออกมา → คุณพร้อมไป STEP 1! 🚀

---

# 🚀 STEP 1: สร้างโปรเจกต์ NestJS แรก (Hello World)

> 💡 **เป้าหมาย:** มี Backend NestJS ที่รันได้ ตอบ "Hello Baby 101!" กลับมาเมื่อเปิด `http://localhost:3000`
> 📁 **โฟลเดอร์:** `my-backend/`

> 🎯 **ใช้ NestJS CLI สร้างทุกอย่างให้อัตโนมัติ** — เร็วกว่าเขียนเอง 100 เท่า!

---

## 1.1 ติดตั้ง NestJS CLI (ทำครั้งเดียวในเครื่อง)

```bash
npm install -g @nestjs/cli
```

> เครื่องมือนี้ใช้สร้างโปรเจกต์ + สร้างไฟล์ module/service/controller แบบ auto

---

## 1.2 สร้างโปรเจกต์ใหม่

```bash
nest new my-backend --package-manager pnpm
```

**จะเกิดอะไรขึ้น:**
- CLI สร้างโฟลเดอร์ `my-backend/`
- สร้างไฟล์ทั้งหมด: `package.json`, `tsconfig.json`, `src/main.ts`, `src/app.module.ts`, ฯลฯ
- ติดตั้ง dependencies ทั้งหมดให้อัตโนมัติ (1-2 นาที)

> `--package-manager pnpm` บอกให้ใช้ pnpm แทน npm

---

## 1.3 เข้าไปในโปรเจกต์ + รัน

```bash
cd my-backend
pnpm run start:dev
```

✅ Terminal ควรเห็น:
```
🚀 Application is running on: http://localhost:3000
```

✅ เปิด browser → `http://localhost:3000` → เห็น **Hello World!**

หยุด server: กด `Ctrl + C`

---

## 1.4 เปลี่ยนข้อความเป็น "Hello Baby 101!"

แก้ไฟล์ `src/app.service.ts`:

```typescript
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello Baby 101 Backend!';  // ← เปลี่ยนบรรทัดนี้
  }
}
```

> เซฟแล้ว → server reload อัตโนมัติ → refresh browser เห็นข้อความใหม่

---

## 1.5 โครงสร้างไฟล์ที่ได้

```
my-backend/
├── node_modules/
├── src/
│   ├── main.ts                  # Entry Point
│   ├── app.module.ts            # Root Module
│   ├── app.controller.ts        # รับ HTTP request
│   ├── app.controller.spec.ts   # Test สำหรับ controller
│   └── app.service.ts           # Business logic
├── test/
├── package.json
├── tsconfig.json
├── tsconfig.build.json
├── nest-cli.json
├── eslint.config.mjs
├── .prettierrc
├── .gitignore
└── README.md
```

**ไฟล์ที่ควรรู้จัก:**

| ไฟล์ | บทบาท |
|---|---|
| `src/main.ts` | ไฟล์แรกที่ถูกรัน — สร้าง app แล้วเปิด port |
| `src/app.module.ts` | รวม controller + service ไว้ใน module เดียว |
| `src/app.controller.ts` | รับ HTTP request, ส่งต่อให้ service |
| `src/app.service.ts` | logic หลัก — query DB, คำนวณ, validate |

> 💡 **ใน STEP ถัดไป** เราจะเริ่มเพิ่ม feature จริง: เชื่อม Database, สร้าง Users, Auth, ฯลฯ

✅ เสร็จแล้ว → ไปต่อ **STEP 2: ต่อ Database (TypeORM + PostgreSQL)** 🚀

---

# 🐘 STEP 2: ต่อ Database (PostgreSQL + TypeORM + Docker)

> 💡 **เป้าหมาย:** รัน PostgreSQL ผ่าน Docker + เชื่อม NestJS ด้วย TypeORM
> เมื่อจบ STEP จะเปิด pgAdmin ดู database ได้ และ NestJS start ได้โดยไม่ error

---

## 🤔 ทำไมต้องใช้ TypeORM? (ไม่เขียน SQL เองเลยได้ไหม?)

ถ้าเขียน SQL เองตรง ๆ จะเจอปัญหาเหล่านี้:

```typescript
// ❌ ตัวอย่างการเขียน SQL เอง (แบบเก่า)
const result = await client.query(`SELECT * FROM users WHERE id = ${id}`);
//   ↑ SQL injection! ถ้า id = "1; DROP TABLE users;" → หายทั้ง table
//   ↑ Type ไม่ตรง: SQL คืน string, แต่เราคาดหวัง number
//   ↑ เปลี่ยน database (MySQL → PostgreSQL) ต้องเขียน SQL ใหม่ทั้งหมด
```

**TypeORM แก้ปัญหาเหล่านี้:**

| เขียน SQL เอง | ใช้ TypeORM |
|---|---|
| `SELECT * FROM users WHERE id = ${id}` ⚠️ injection | `userRepo.findOne({ where: { id } })` ✅ ปลอดภัย |
| `INSERT INTO users (name, email) VALUES (...)` | `userRepo.save({ name, email })` |
| `UPDATE users SET ...` | `userRepo.update(id, { name })` |
| `DELETE FROM users WHERE id = ${id}` | `userRepo.delete(id)` |
| Type ไม่ตรง | TypeScript เช็คให้อัตโนมัติ |
| เปลี่ยน DB ต้องเขียน SQL ใหม่ | เปลี่ยนแค่ driver |

**TypeORM คืออะไร:**
- **ORM** = Object-Relational Mapping
- แปลง "ตารางในฐานข้อมูล" → "class ใน TypeScript"
- เราเขียน `class User` → TypeORM สร้าง table `users` ให้อัตโนมัติ
- เขียน query แบบ method (`find`, `save`, `update`) ไม่ต้องเขียน SQL

```typescript
// ✅ แบบ TypeORM — ปลอดภัย, type ตรง, เปลี่ยน DB ได้
const user = await this.userRepo.findOne({ where: { id } });
//   ↑ TypeScript รู้ว่า user เป็น User | null
//   ↑ TypeORM escape parameter ให้อัตโนมัติ → ไม่มี SQL injection
```

---

## 🤔 ทำไมต้องรัน DB ใน Docker?

- ✅ ไม่ต้องติดตั้ง PostgreSQL ลงเครื่องตรง ๆ
- ✅ ลบแล้วสร้างใหม่ได้ ไม่ทิ้งขยะ
- ✅ เหมือนกันทุกเครื่อง (Windows/Mac/Linux)
- ✅ ใช้กับ production ได้เลย

---

## 2.1 เปิด Docker Desktop

(ถ้ายังไม่ได้เปิด - ดู STEP 0)

> ตรวจสอบ Docker พร้อมใช้งาน: icon ที่ taskbar **ต้องนิ่ง** (ไม่หมุน)

---

## 2.2 สร้างไฟล์ `docker-compose.yml`

ที่ root ของโปรเจกต์ `my-backend/` (ระดับเดียวกับ `package.json`) สร้างไฟล์ `docker-compose.yml`:

```yaml
services:
  postgres:
    image: postgres:16
    container_name: my-backend-postgres
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: my_backend_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  pgadmin:
    image: dpage/pgadmin4
    container_name: my-backend-pgadmin
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@admin.com
      PGADMIN_DEFAULT_PASSWORD: admin
    ports:
      - "5050:80"
    volumes:
      - pgadmin_data:/var/lib/pgadmin
    depends_on:
      postgres:
        condition: service_healthy

volumes:
  postgres_data:
  pgadmin_data:
```

**อธิบาย:**
- `postgres:16` = ใช้ PostgreSQL เวอร์ชัน 16
- `ports: "5432:5432"` = port ใน container map ไปยัง port ในเครื่อง
- `volumes: postgres_data` = เก็บข้อมูลไว้ — ลบ container แล้วข้อมูลไม่หาย
- `healthcheck` = ตรวจว่า DB พร้อมใช้งานจริง
- `depends_on` = pgAdmin รอให้ postgres พร้อมก่อนค่อย start

---

## 2.3 รัน Docker

> ⚠️ **⚠️⚠️ อ่านก่อน! ปัญหาที่พบบ่อยที่สุด ⚠️⚠️**
>
> **ถ้าเคยรัน `docker compose up` มาก่อน** (เช่น ทดลองรันแล้ว fail, เปลี่ยน config, ฯลฯ)
> **ต้องลบ volume เก่าทิ้งก่อน** ไม่งั้นจะเจอ error:
> `error: database "my_backend_db" does not exist`
>
> **เพราะ:** Postgres ใช้ `POSTGRES_DB` env **เฉพาะตอน init ครั้งแรกเท่านั้น** — ถ้า volume มีข้อมูลอยู่แล้ว จะไม่สร้าง DB ใหม่
>
> **ถ้าเพิ่งเริ่มโปรเจกต์ (รันครั้งแรก):** ใช้คำสั่งปกติด้านล่างได้เลย
>
> **ถ้าเคยรันมาก่อน/เจอ error:** รัน:
> ```bash
> docker compose down -v
> ```

**กรณีปกติ (รันครั้งแรก):**

```bash
docker compose up -d
```

- `-d` = detached (รัน background, ไม่ block terminal)

**ตรวจสอบว่า container ทำงาน:**

```bash
docker compose ps
```

✅ ควรเห็น:
```
NAME                    STATUS          PORTS
my-backend-postgres     Up (healthy)    0.0.0.0:5432->5432/tcp
my-backend-pgadmin      Up              0.0.0.0:5050->80/tcp
```

> ⚠️ ถ้า STATUS เป็น `Exit` หรือ `Restarting` ให้ดู error: `docker compose logs postgres`

---

## 2.4 เปิด pgAdmin ดูว่า DB พร้อม

เปิด browser → `http://localhost:5050`
- **Email:** `admin@admin.com`
- **Password:** `admin`

**เพิ่ม connection ไปยัง postgres:**
1. คลิกขวาที่ "Servers" → "Register" → "Server..."
2. Tab **General** → Name: `my-backend-db`
3. Tab **Connection**:
   - Host: `postgres` ← **ชื่อ service ใน docker-compose** (ไม่ใช่ localhost)
   - Port: `5432`
   - Username: `postgres`
   - Password: `password`
4. กด **Save**

✅ ตอนนี้ควรเห็น database `my_backend_db` ใน tree (แต่ยังไม่มี table — เราจะสร้างใน STEP 3)

> 💡 **ทำไม Host = `postgres` ไม่ใช่ `localhost`?**
> เพราะ pgAdmin รันอยู่ใน Docker เหมือนกัน — ใช้ `localhost` จะหมายถึง "ตัว pgAdmin เอง" แต่ใช้ `postgres` หมายถึง "container ที่ชื่อ postgres" ในเครือข่าย Docker

---

## 2.5 ติดตั้ง TypeORM + Packages

กลับมาที่ root ของโปรเจกต์:

```bash
pnpm add @nestjs/typeorm typeorm pg
pnpm add -D @types/pg
pnpm add @nestjs/config
```

| Package | ทำอะไร |
|---|---|
| `@nestjs/typeorm` | เชื่อม TypeORM กับ NestJS (ทำ DI ให้) |
| `typeorm` | ORM หลัก — แปลง class ↔ table |
| `pg` | driver สำหรับ PostgreSQL |
| `@types/pg` | TypeScript types สำหรับ pg |
| `@nestjs/config` | โหลด .env เข้ามาในระบบ |

---

## 2.6 สร้างไฟล์ `.env`

ที่ root ของโปรเจกต์ (ระดับเดียวกับ `package.json`):

สร้างไฟล์ `.env`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_DATABASE=my_backend_db
```

สร้างไฟล์ `.env.example` (template ที่ commit ได้):

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_DATABASE=my_backend_db
```

> ⚠️ **`ห้าม` commit ไฟล์ `.env` ขึ้น Git!** (มี password จริง)
> แต่ `.env.example` commit ได้ — เพื่อให้ทีมรู้ว่าต้องตั้งค่าอะไรบ้าง

**เพิ่ม `.env` ใน `.gitignore`:**

เปิดไฟล์ `.gitignore` (สร้างใหม่ถ้ายังไม่มี) แล้วเพิ่ม:

```gitignore
# Environment
.env
node_modules/
dist/
```

---

## 2.7 สร้างไฟล์ Config

สร้างไฟล์ `src/config/configuration.ts`:

```typescript
export default () => ({
  database: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT ?? '5432', 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  },
});
```

**ทำอะไร:** แปลงตัวแปรใน `.env` เป็น object เพื่อให้ TypeORM ใช้ง่าย ๆ

> `parseInt(... ?? '5432', 10)` แปลว่า "ถ้าไม่มี DB_PORT ให้ใช้ 5432" — ป้องกัน undefined

---

## 2.8 เชื่อม TypeORM ใน `app.module.ts`

แก้ไฟล์ `src/app.module.ts` เป็น:

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from './config/configuration';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    // โหลด .env เข้ามาในระบบ
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),

    // เชื่อม TypeORM กับ PostgreSQL
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('database.host'),
        port: config.get<number>('database.port'),
        username: config.get<string>('database.username'),
        password: config.get<string>('database.password'),
        database: config.get<string>('database.database'),
        autoLoadEntities: true,
        synchronize: true,  // ⚠️ ใช้ตอน dev เท่านั้น!
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

**อธิบาย:**
- `ConfigModule.forRoot({ isGlobal: true })` = โหลด `.env` แล้วให้ทุก module ใช้ได้
- `TypeOrmModule.forRootAsync(...)` = เชื่อม DB แบบ async (เพราะต้องรอ config โหลดก่อน)
- `inject: [ConfigService]` = เอา ConfigService เข้ามาใช้
- `useFactory` = ฟังก์ชันที่ return ค่า config สำหรับ TypeORM
- `autoLoadEntities: true` = โหลด Entity ทุกตัวอัตโนมัติ (ไม่ต้อง list เอง)
- `synchronize: true` = **ใช้ตอน dev เท่านั้น** — TypeORM จะสร้าง/แก้ table ให้อัตโนมัติ ใน production ต้องใช้ migrations แทน

> ⚠️ **`synchronize: true` อันตรายใน production!**
> เพราะถ้า schema เปลี่ยน → TypeORM ลบ/แก้ table ทันทีโดยไม่ถาม → ข้อมูลอาจหาย

---

## 2.9 ทดสอบการเชื่อมต่อ

```bash
pnpm run start:dev
```

✅ Terminal ควรเห็น:
```
[InstanceLoader] TypeOrmCoreModule dependencies initialized
[InstanceLoader] AppModule dependencies initialized
🚀 Application is running on: http://localhost:3000
```

**ถ้าเจอ Error:**

| Error | สาเหตุ | วิธีแก้ |
|---|---|---|
| `ECONNREFUSED 127.0.0.1:5432` | Docker ยังไม่ทำงาน | รัน `docker compose up -d` |
| `password authentication failed` | password ใน .env ไม่ตรงกับ docker-compose | ตรวจสอบให้ตรงกัน |
| `database "my_backend_db" does not exist` | DB ยังไม่ถูกสร้าง | ลบ volume แล้วสร้างใหม่: `docker compose down -v && docker compose up -d` |
| `ECONNREFUSED ::1:5432` | Node 18+ ใช้ IPv6 | เปลี่ยน `DB_HOST=localhost` เป็น `DB_HOST=127.0.0.1` |

---

## 2.10 ตรวจสอบใน pgAdmin

กลับไปที่ `http://localhost:5050`:
- เปิด tree: Servers → my-backend-db → Databases → my_backend_db → Schemas → public → Tables
- ตอนนี้ **ยังไม่มี table** (เรายังไม่ได้สร้าง Entity)
- ใน **STEP 3** เราจะสร้าง User entity → table จะปรากฏอัตโนมัติ! 🎉

---

## 📁 โครงสร้างไฟล์ที่เพิ่มใน STEP 2

```
my-backend/
├── src/
│   ├── config/
│   │   └── configuration.ts       # ✅ แปลง .env → object
│   ├── app.module.ts               # ✅ เพิ่ม ConfigModule + TypeOrmModule
│   └── ...
├── docker-compose.yml              # ✅ PostgreSQL + pgAdmin
├── .env                            # ✅ credentials (ห้าม commit)
├── .env.example                    # ✅ template (commit ได้)
├── .gitignore                      # ✅ เพิ่ม .env, node_modules, dist
└── ...
```

✅ เสร็จแล้ว → ไปต่อ **STEP 3: สร้าง Users Module (Entity + CRUD)** 🚀

---

# 👤 STEP 3: สร้าง Users Module (Entity + CRUD)

> 💡 **เป้าหมาย:** มี API CRUD สำหรับ Users ครบทุก endpoint
>
> | Method | Endpoint | ทำอะไร |
> |---|---|---|
> | POST | `/users` | สร้าง user ใหม่ |
> | GET | `/users` | ดู users ทั้งหมด |
> | GET | `/users/:id` | ดู user 1 คน |
> | PATCH | `/users/:id` | แก้ไข user |
> | DELETE | `/users/:id` | ลบ user |
>
> พร้อม **Swagger UI** ที่ `http://localhost:3000/api/docs` ทดสอบ API ได้แบบ point-and-click

---

## 🤔 Concept: Entity คืออะไร?

**Entity = class TypeScript ที่ map กับ table ใน DB**

```typescript
// class นี้ → table "users" ใน PostgreSQL
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;
}
```

TypeORM จะ:
- สร้าง table `users` อัตโนมัติ (เพราะ `synchronize: true`)
- แปลง row ใน DB ↔ instance ของ class `User`
- ให้เราเขียน query แบบ `userRepo.find()` แทน SQL

---

## 🤔 Concept: โครงสร้าง Module ใน NestJS

```
src/users/
├── entities/
│   └── user.entity.ts        # โครงสร้างตาราง
├── dto/
│   ├── create-user.dto.ts    # validate ตอนสร้าง
│   └── update-user.dto.ts    # validate ตอนแก้ไข
├── users.controller.ts       # รับ HTTP request
├── users.service.ts          # business logic + เรียก DB
└── users.module.ts           # รวมทุกอย่างเข้าด้วยกัน
```

**Flow การทำงาน:**
```
Client → HTTP Request
   ↓
Controller (รับ request, ตรวจ DTO)
   ↓
Service (logic, เรียก repository)
   ↓
Repository (TypeORM แปลงเป็น SQL)
   ↓
PostgreSQL
```

---

## 3.1 ติดตั้ง Packages เพิ่ม

```bash
pnpm add @nestjs/swagger swagger-ui-express
pnpm add class-validator class-transformer
```

| Package | ทำอะไร |
|---|---|
| `@nestjs/swagger` | สร้าง API docs อัตโนมัติ |
| `swagger-ui-express` | UI สำหรับดู/ทดสอบ API |
| `class-validator` | validate DTO (เช่น email ต้องเป็น email) |
| `class-transformer` | แปลง plain object ↔ class instance |

---

## 3.2 ตั้งค่า Swagger ใน main.ts

แก้ไฟล์ `src/main.ts`:

```typescript
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // เปิด validation pipe — validate DTO อัตโนมัติ
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,   // ลบ fields ที่ไม่ได้ประกาศใน DTO
    transform: true,   // แปลง type อัตโนมัติ (string → number ฯลฯ)
  }));

  // ตั้งค่า Swagger
  const config = new DocumentBuilder()
    .setTitle('Baby 101 API')
    .setDescription('API documentation for Baby 101 backend')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
  console.log(`🚀 Application is running on: http://localhost:3000`);
  console.log(`📚 Swagger UI: http://localhost:3000/api/docs`);
}
bootstrap();
```

**อธิบายสิ่งที่เพิ่ม:**
- `ValidationPipe` = ตรวจข้อมูลจาก request body ตาม decorators ใน DTO
- `whitelist: true` = ถ้า client ส่ง field ที่ไม่มีใน DTO มา → ลบทิ้งอัตโนมัติ (ป้องกันส่ง field แปลก ๆ)
- `SwaggerModule.setup('api/docs', ...)` = เปิด UI ที่ path `/api/docs`

---

## 3.3 สร้าง User Entity

สร้างไฟล์ `src/users/entities/user.entity.ts`:

```typescript
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;                          // ← ใส่ !

  @Column()
  name!: string;                        // ← ใส่ !

  @Column({ unique: true })
  email!: string;                       // ← ใส่ !

  @Column()
  password!: string;                    // ← ใส่ ! (STEP 4 จะเปลี่ยนเป็น bcrypt hash)

  @CreateDateColumn()
  createdAt!: Date;                     // ← ใส่ !

  @UpdateDateColumn()
  updatedAt!: Date;                     // ← ใส่ !
}
```

> ⚠️ **ทำไมต้องใส่ `!` ?**
> เพราะ `tsconfig.json` ที่ `nest new` สร้างมี `"strict": true` ซึ่งเปิด `strictPropertyInitialization`
> TypeScript จะบ่นว่า *"property 'name' has no initializer"* — คิดว่า class ถูก new ขึ้นมาแล้ว property ยังว่าง
>
> แต่จริง ๆ TypeORM จะใส่ค่าให้ตอน query จาก DB เลยต้องใส่ `!` (definite assignment assertion) เพื่อบอกว่า **"เชื่อเถอะ จะมีค่าแน่นอน"**
>
> **ใส่ `!` ทุก field ที่มี decorator ของ TypeORM**

**อธิบาย decorators:**

| Decorator | ความหมาย |
|---|---|
| `@Entity('users')` | บอกว่า class นี้คือ Entity, table ชื่อ `users` |
| `@PrimaryGeneratedColumn('uuid')` | primary key เป็น UUID (เช่น `550e8400-e29b-41d4-a716-446655440000`) |
| `@Column()` | column ปกติ (varchar) |
| `@Column({ unique: true })` | column นี้ห้ามซ้ำ (email ต้องไม่ซ้ำ) |
| `@CreateDateColumn()` | TypeORM ใส่วันที่สร้างอัตโนมัติ |
| `@UpdateDateColumn()` | TypeORM ใส่วันที่แก้ไขล่าสุดอัตโนมัติ |

> 💡 **UUID vs Auto-increment:**
> - **Auto-increment** (1, 2, 3...): เล็ก, เร็ว, แต่เดาได้ (security risk)
> - **UUID** (550e8400...): ปลอดภัย, เดาไม่ได้, ใช้กับ distributed system ได้

---

## 3.4 สร้าง DTOs

### 3.4.1 `src/users/dto/create-user.dto.ts` — สำหรับสร้าง user ใหม่

```typescript
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe' })
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'password123' })
  @MinLength(6)
  password!: string;
}
```

**อธิบาย:**
- `@ApiProperty` = บอก Swagger ว่า field นี้มีตัวอย่างอะไร (จะโชว์ใน UI)
- `@IsNotEmpty()` = ห้ามว่าง
- `@IsEmail()` = ต้องเป็น email format (มี @, มี domain)
- `@MinLength(6)` = ต้องยาวอย่างน้อย 6 ตัวอักษร

### 3.4.2 `src/users/dto/update-user.dto.ts` — สำหรับแก้ไข user

```typescript
import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
```

> `PartialType` = ทำให้ทุก field ใน CreateUserDto เป็น **optional** (ไม่ต้องใส่ครบทุก field ตอน PATCH)

---

## 3.5 สร้าง UsersService

สร้างไฟล์ `src/users/users.service.ts`:

```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  // CREATE
  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create(createUserDto);
    return await this.usersRepository.save(user);
  }

  // READ ALL
  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  // READ ONE
  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  // UPDATE
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);  // เช็คก่อนว่ามีจริง (throw 404 ถ้าไม่มี)
    Object.assign(user, updateUserDto);
    return await this.usersRepository.save(user);
  }

  // DELETE
  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);  // เช็คก่อนว่ามีจริง
    await this.usersRepository.remove(user);
  }
}
```

**อธิบาย:**
- `@InjectRepository(User)` = ฉีด Repository ของ User entity เข้ามา (NestJS จัดการให้)
- `this.usersRepository.create(dto)` = สร้าง instance ใหม่ (ยังไม่ save)
- `this.usersRepository.save(user)` = บันทึกลง DB
- `NotFoundException` = throw error 404 เมื่อหา user ไม่เจอ (NestJS จะแปลงเป็น HTTP 404 อัตโนมัติ)

---

## 3.6 สร้าง UsersController

สร้างไฟล์ `src/users/users.controller.ts`:

```typescript
import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@ApiTags('users')  // จัดกลุ่มใน Swagger UI
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @HttpCode(HttpStatus.CREATED)  // status 201
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by id' })
  findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user' })
  @HttpCode(HttpStatus.NO_CONTENT)  // status 204
  remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(id);
  }
}
```

**อธิบาย:**
- `@Controller('users')` = routes ทั้งหมดขึ้นต้นด้วย `/users`
- `@Post()` → `POST /users`
- `@Get(':id')` → `GET /users/:id` (`:id` คือ parameter)
- `@Body()` = ดึงข้อมูลจาก request body
- `@Param('id')` = ดึง `:id` จาก URL
- `@HttpCode(HttpStatus.CREATED)` = เปลี่ยน status code (default POST = 201 อยู่แล้ว แต่ใส่ไว้เพื่อความชัดเจน)

---

## 3.7 สร้าง UsersModule

สร้างไฟล์ `src/users/users.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],  // ลงทะเบียน User entity
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],                       // ⚠️ สำคัญ! export เพื่อให้ module อื่นใช้ได้
})
export class UsersModule {}
```

> - `TypeOrmModule.forFeature([User])` = บอก TypeORM ว่า module นี้จะใช้ User entity
> - `exports: [UsersService]` = **บอกว่า module อื่นสามารถ inject `UsersService` ได้**
>   - ถ้าไม่มี → module อื่นจะหา `UsersService` ไม่เจอ (เจอ error ใน STEP 4)

---

## 3.8 ลงทะเบียน UsersModule ใน AppModule

แก้ไฟล์ `src/app.module.ts` — เพิ่ม `UsersModule` ใน `imports`:

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from './config/configuration';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('database.host'),
        port: config.get<number>('database.port'),
        username: config.get<string>('database.username'),
        password: config.get<string>('database.password'),
        database: config.get<string>('database.database'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    UsersModule,  // ← เพิ่มบรรทัดนี้
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

---

## 3.9 ทดสอบ CRUD

```bash
pnpm run start:dev
```

✅ ตรวจสอบ:
- ไม่มี error
- Terminal ควรเห็น:
  ```
  [InstanceLoader] TypeOrmCoreModule dependencies initialized
  🚀 Application is running on: http://localhost:3000
  📚 Swagger UI: http://localhost:3000/api/docs
  ```
- `synchronize: true` จะสร้าง table `users` ใน DB **อัตโนมัติ**!

---

## 3.10 ตรวจสอบ table ใน pgAdmin

1. Refresh tree ใน pgAdmin
2. Servers → my-backend-db → Databases → my_backend_db → Schemas → public → Tables
3. **ตอนนี้ควรเห็น table `users`!** 🎉
4. คลิกขวาที่ table → View/Edit Data → All Rows → ตอนนี้ยังว่าง (เรายังไม่ได้สร้าง user)

---

## 3.11 ทดสอบผ่าน Swagger UI

เปิด browser → `http://localhost:3000/api/docs`

จะเห็น tag **"users"** พร้อม endpoints 5 ตัว

### 🧪 ทดสอบ POST /users (สร้าง)

1. กดที่ `POST /users` → กดปุ่ม **"Try it out"**
2. แก้ JSON เป็น:
   ```json
   {
     "name": "John Doe",
     "email": "john@test.com",
     "password": "secret123"
   }
   ```
3. กด **"Execute"**
4. ✅ Response status = **201** + JSON user ที่สร้าง (มี id, createdAt, updatedAt)

**ลองสร้างอีก 2-3 users เพื่อมีข้อมูลเยอะ ๆ**

### 🧪 ทดสอบ GET /users (ดูทั้งหมด)

- กด `GET /users` → Execute
- ✅ เห็น array ของ users ทั้งหมดที่สร้างไว้

### 🧪 ทดสอบ GET /users/:id (ดูคนเดียว)

- เอา id จาก response ข้างบนมาใส่
- ✅ เห็น user 1 คน

### 🧪 ทดสอบ PATCH /users/:id (แก้ไข)

- เปลี่ยน name:
  ```json
  { "name": "John Smith" }
  ```
- ✅ name เปลี่ยน, email/password เหมือนเดิม

### 🧪 ทดสอบ DELETE /users/:id (ลบ)

- ใส่ id
- ✅ Response status = **204** (No Content)

### 🧪 ทดสอบ Validation (ลองส่งข้อมูลผิด)

ลอง `POST /users` ด้วย:
```json
{ "name": "", "email": "not-an-email", "password": "123" }
```

✅ จะได้ error **400 Bad Request** พร้อมข้อความ:
- `name should not be empty`
- `email must be an email`
- `password must be longer than or equal to 6 characters`

> 🎉 นี่คือพลังของ `class-validator` + `ValidationPipe` — ไม่ต้องเขียน validation เอง!

---

## 📁 โครงสร้างไฟล์ที่เพิ่มใน STEP 3

```
my-backend/
├── src/
│   ├── users/                          # ← โฟลเดอร์ใหม่ทั้งหมด
│   │   ├── entities/
│   │   │   └── user.entity.ts          # ✅ โครงสร้างตาราง users
│   │   ├── dto/
│   │   │   ├── create-user.dto.ts      # ✅ validate ตอนสร้าง
│   │   │   └── update-user.dto.ts      # ✅ validate ตอนแก้ไข
│   │   ├── users.controller.ts         # ✅ HTTP endpoints (5 ตัว)
│   │   ├── users.service.ts            # ✅ business logic
│   │   └── users.module.ts             # ✅ รวม controller + service
│   ├── app.module.ts                   # ✅ เพิ่ม UsersModule
│   └── main.ts                         # ✅ เพิ่ม Swagger + ValidationPipe
└── ...
```

✅ เสร็จแล้ว → ไปต่อ **STEP 4: สร้าง Auth Module (Register + Login + JWT)** 🚀

---

# 🔐 STEP 4: สร้าง Auth Module (Register + Login + JWT)

> 💡 **เป้าหมาย:**
> - ✅ มี `POST /auth/register` — สมัคร user + คืน JWT
> - ✅ มี `POST /auth/login` — login + คืน JWT
> - ✅ Users endpoints ต้องมี **JWT token** ถึงจะเรียกได้ (protected)

---

## 🤔 Concept: Authentication vs Authorization

| | ความหมาย | ตัวอย่าง |
|---|---|---|
| **Authentication** | "คุณคือใคร?" | login (พิสูจน์ตัวตน) |
| **Authorization** | "คุณทำอะไรได้บ้าง?" | JWT guard (ตรวจสิทธิ์) |

**STEP นี้ทำทั้ง 2 อย่าง** — register/login = auth, JWT guard = authz

---

## 🤔 Concept: JWT คืออะไร?

**JWT** (JSON Web Token) = token ที่ใช้ยืนยันตัวตน มี 3 ส่วน:

```
Header.Payload.Signature
xxxxx.yyyyy.zzzzz
```

**Flow การใช้งาน:**
```
1. User login → server สร้าง JWT (ฝัง user id ไว้ข้างใน)
2. Client เก็บ JWT ไว้
3. Client ส่ง JWT ไปทุก request (header: "Authorization: Bearer <token>")
4. Server ตรวจ JWT → รู้ว่า request มาจาก user คนไหน
```

> 💡 **JWT เปรียบเหมือน "บัตรประจำตัวดิจิทัล"** ที่ server ออกให้

---

## 🤔 Concept: bcrypt คืออะไร?

**bcrypt** = algorithm สำหรับ **hash password** ให้ปลอดภัย

```typescript
// ❌ ไม่ดี — เก็บ plain text (ถ้า DB หลุด = หลุดหมด)
password: "secret123"

// ✅ ดี — เก็บ hash (ถอดกลับไม่ได้)
password: "$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy"
```

---

## 4.1 ติดตั้ง packages

```bash
pnpm add @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt
pnpm add -D @types/bcrypt @types/passport-jwt
```

| Package | ทำอะไร |
|---|---|
| `@nestjs/jwt` | สร้าง + ตรวจ JWT token |
| `@nestjs/passport` | เชื่อม NestJS กับ Passport |
| `passport` | ไลบรารี authentication ยอดนิยม |
| `passport-jwt` | strategy สำหรับตรวจ JWT |
| `bcrypt` | hash password |
| `@types/bcrypt`, `@types/passport-jwt` | TypeScript types |

---

## 4.2 เพิ่ม JWT_SECRET ใน `.env`

แก้ไฟล์ `.env`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_DATABASE=my_backend_db
JWT_SECRET=my-super-secret-key-change-in-production
JWT_EXPIRATION=1d
```

แก้ไฟไฟล์ `.env.example` ด้วย (เหมือนกัน):

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_DATABASE=my_backend_db
JWT_SECRET=your-secret-key-here
JWT_EXPIRATION=1d
```

> ⚠️ **`JWT_SECRET` ห้าม commit ขึ้น Git จริง ๆ!** ใครรู้ secret = ปลอม token ได้
> ใน production ใช้ secret ที่สุ่มยาก ๆ เช่น `openssl rand -base64 32`

---

## 4.3 เพิ่ม JWT config ใน `configuration.ts`

แก้ไฟไฟล์ `src/config/configuration.ts`:

```typescript
export default () => ({
  database: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT ?? '5432', 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  },
  jwt: {
    secret: process.env.JWT_SECRET ?? 'default-secret',
    expiration: process.env.JWT_EXPIRATION ?? '1d',
  },
});
```

---

## 4.4 เพิ่ม `findByEmail` ใน UsersService

แก้ไฟไฟล์ `src/users/users.service.ts` — เพิ่ม method นี้:

```typescript
async findByEmail(email: string): Promise<User | null> {
  return await this.usersRepository.findOne({ where: { email } });
}
```

---

## 4.5 สร้าง DTOs

### 4.5.1 `src/auth/dto/register.dto.ts`

```typescript
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'John Doe' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123' })
  @MinLength(6)
  password: string;
}
```

### 4.5.2 `src/auth/dto/login.dto.ts`

```typescript
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsNotEmpty()
  password: string;
}
```

---

## 4.6 สร้าง AuthService

สร้างไฟล์ `src/auth/auth.service.ts`:

```typescript
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  // REGISTER
  async register(registerDto: RegisterDto) {
    // 1. hash password
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // 2. สร้าง user (ใช้ UsersService)
    const user = await this.usersService.create({
      ...registerDto,
      password: hashedPassword,
    });

    // 3. สร้าง JWT token
    return this.generateToken(user.id, user.email);
  }

  // LOGIN
  async login(loginDto: LoginDto) {
    // 1. หา user จาก email
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 2. เปรียบเทียบ password
    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 3. สร้าง JWT token
    return this.generateToken(user.id, user.email);
  }

  // สร้าง JWT token (private helper)
  private generateToken(userId: string, email: string) {
    const payload = { sub: userId, email };
    return {
      access_token: this.jwtService.sign(payload),
      user: { id: userId, email },
    };
  }
}
```

**อธิบาย:**
- `bcrypt.hash(password, 10)` = hash password, `10` = salt rounds (มาก = ปลอดภัยมาก แต่ช้า)
- `bcrypt.compare(plain, hash)` = เปรียบเทียบ password
- `jwtService.sign(payload)` = สร้าง JWT
- `UnauthorizedException` = throw **401** เมื่อ login ไม่ผ่าน
- `sub: userId` = convention ของ JWT — `sub` คือ "subject" (คนที่ถือ token นี้)

---

## 4.7 สร้าง JWT Strategy

สร้างไฟล์ `src/auth/strategies/jwt.strategy.ts`:

```typescript
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      // ดึง token จาก header "Authorization: Bearer <token>"
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,  // ถ้า token หมดอายุ = ไม่ให้ผ่าน
      secretOrKey: configService.get<string>('jwt.secret') ?? 'default-secret',
    });
  }

  // ถูกเรียกอัตโนมัติหลัง verify token สำเร็จ
  // return ค่านี้จะถูกแปะใน request.user
  async validate(payload: { sub: string; email: string }) {
    const user = await this.usersService.findByEmail(payload.email);
    if (!user) {
      throw new UnauthorizedException();
    }
    return { id: user.id, email: user.email };
  }
}
```

**อธิบาย:**
- `PassportStrategy(Strategy)` = ใช้ JWT strategy จาก passport-jwt
- `jwtFromRequest` = บอกว่าจะดึง token จากไหน
- `secretOrKey` = secret ที่ใช้ตรวจสอบ token
- `validate()` = ทำงานหลัง verify token ผ่าน → return object นี้จะอยู่ใน `request.user`

---

## 4.8 สร้าง JwtAuthGuard

สร้างไฟล์ `src/auth/guards/jwt-auth.guard.ts`:

```typescript
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
```

> `AuthGuard('jwt')` = ใช้ strategy ชื่อ `'jwt'` (จาก JwtStrategy ที่เราสร้าง)

---

## 4.9 สร้าง AuthController

สร้างไฟล์ `src/auth/auth.controller.ts`:

```typescript
import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register new user and return JWT' })
  @HttpCode(HttpStatus.CREATED)
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login and return JWT' })
  @HttpCode(HttpStatus.OK)
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
```

---

## 4.10 สร้าง AuthModule

> ⚠️ **สำคัญ! ก่อนสร้าง AuthModule ต้องเช็คว่า UsersModule export `UsersService` แล้ว!**
> ดูขั้นตอน 3.7 — ต้องมี `exports: [UsersService]` ไม่งั้นเจอ error:
> `Nest can't resolve dependencies of the AuthService (?, JwtService, ConfigService)`

สร้างไฟล์ `src/auth/auth.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UsersModule,        // ใช้ UsersService (สำหรับ create user, findByEmail)
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('jwt.secret') ?? 'default-secret',
        signOptions: {
          // ⚠️ ใส่ default '1d' + cast เพราะ @nestjs/jwt type เข้มงวด
          expiresIn: (config.get<string>('jwt.expiration') ?? '1d') as any,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
```

> `UsersModule` ต้องอยู่ใน `imports` เพราะ AuthService ใช้ UsersService
> **และ** `UsersModule` ต้องมี `exports: [UsersService]` (ใน STEP 3.7) ไม่งั้น inject ไม่ได้!

> 💡 **Module Encapsulation ใน NestJS:**
> - Provider ใน module เป็น **private** โดย default
> - ถ้าจะให้ module อื่นใช้ได้ → ต้องเพิ่มใน `exports`
> - เปรียบเหมือน: `class` ที่ field เป็น `private` → ห้องอื่นเข้าถึงไม่ได้ ต้องเปลี่ยนเป็น `public` (export) ก่อน

> 💡 **ทำไมต้อง `as any` ที่ `expiresIn`?**
> `@nestjs/jwt` เวอร์ชันใหม่บังคับ type ของ `expiresIn` ให้เป็น `number | StringValue | undefined` (ไม่ใช่ `string` ทั่วไป)
> ใส่ `as any` เพื่อบอก TypeScript ว่า "เชื่อฉันสิ ค่านี้ถูก" — เป็น workaround ที่ใช้กันแพร่หลาย
> วิธีที่ "ถูกต้อง" คือ cast เป็น `StringValue` จาก package `ms` แต่สำหรับการสอน `as any` พอ

---

## 4.11 ลงทะเบียน AuthModule ใน AppModule

แก้ไฟไฟล์ `src/app.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from './config/configuration';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('database.host'),
        port: config.get<number>('database.port'),
        username: config.get<string>('database.username'),
        password: config.get<string>('database.password'),
        database: config.get<string>('database.database'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    UsersModule,
    AuthModule,  // ← เพิ่มบรรทัดนี้
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

---

## 4.12 ป้องกัน Users endpoints ด้วย JWT

แก้ไฟไฟล์ `src/users/users.controller.ts` — เพิ่มการป้องกัน:

```typescript
import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('users')
@ApiBearerAuth()                    // บอก Swagger ว่าต้องมี token
@UseGuards(JwtAuthGuard)            // ทุก endpoint ใน controller นี้ต้อง login
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by id' })
  findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user' })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(id);
  }
}
```

> - `@UseGuards(JwtAuthGuard)` = ทุก endpoint ใน controller นี้ต้องมี JWT
> - `@ApiBearerAuth()` = Swagger จะแสดงไอคอน 🔒 ให้ใส่ token

---

## 4.13 ทดสอบ

```bash
pnpm run start:dev
```

### 🧪 ทดสอบ Register

1. เปิด `http://localhost:3000/api/docs`
2. `POST /auth/register` ด้วย:
   ```json
   { "name": "John", "email": "john@test.com", "password": "secret123" }
   ```
3. ✅ ได้ response:
   ```json
   {
     "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
     "user": { "id": "uuid-here", "email": "john@test.com" }
   }
   ```
4. **เปิด pgAdmin** → ดู table `users` → password ต้องเป็น **hash** ไม่ใช่ plain text! 🎉

### 🧪 ทดสอบ Login

1. `POST /auth/login` ด้วย email + password ที่ register ไว้
2. ✅ ได้ `access_token`

### 🧪 ทดสอบ Login ผิด

1. `POST /auth/login` ด้วย password ผิด
2. ✅ ได้ **401 Unauthorized**

### 🧪 ทดสอบ Protected endpoint (มี token)

1. ที่ Swagger ด้านบน → กดปุ่ม **"Authorize"** 🔓
2. วาง `access_token` ที่ได้ (Swagger จะเติม "Bearer " ให้อัตโนมัติ)
3. กด "Authorize" → "Close"
4. ทดสอบ `GET /users` → ✅ ได้ข้อมูล (เพราะมี token)

### 🧪 ทดสอบ Protected endpoint (ไม่มี token)

1. กดปุ่ม "Authorize" → "Logout"
2. ทดสอบ `GET /users` → ✅ ได้ **401 Unauthorized** 🎉

---

## 📁 โครงสร้างไฟล์ที่เพิ่มใน STEP 4

```
my-backend/
├── src/
│   ├── auth/                            # ← โฟลเดอร์ใหม่ทั้งหมด
│   │   ├── dto/
│   │   │   ├── register.dto.ts
│   │   │   └── login.dto.ts
│   │   ├── strategies/
│   │   │   └── jwt.strategy.ts
│   │   ├── guards/
│   │   │   └── jwt-auth.guard.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── auth.module.ts
│   ├── users/
│   │   ├── users.controller.ts          # ← เพิ่ม @UseGuards
│   │   └── users.service.ts             # ← เพิ่ม findByEmail
│   ├── config/
│   │   └── configuration.ts             # ← เพิ่ม jwt config
│   ├── app.module.ts                    # ← เพิ่ม AuthModule
│   └── .env / .env.example              # ← เพิ่ม JWT_SECRET
└── ...
```

✅ เสร็จแล้ว → ไปต่อ **STEP 5: สร้าง Functions Module (CRUD + Protected)** 🚀

---

# ⚡ STEP 5: สร้าง Functions Module (CRUD + Protected)

> 💡 **เป้าหมาย:** มี API จัดการ "functions" (catalog ของ feature ที่ user จะใช้)
>
> | Method | Endpoint | ทำอะไร |
> |---|---|---|
> | POST | `/functions` | สร้าง function |
> | GET | `/functions` | ดูทั้งหมด |
> | GET | `/functions/:id` | ดู 1 function |
> | PATCH | `/functions/:id` | แก้ไข |
> | DELETE | `/functions/:id` | ลบ |
>
> **ทุก endpoint ต้องมี JWT token** (protected)

---

## 🤔 Function ในระบบนี้คืออะไร?

"Function" คือ **feature/capability** ที่ user จะใช้งาน เช่น:
- `generate_image` - สร้างรูปภาพ
- `summarize_text` - สรุปข้อความ
- `translate` - แปลภาษา

User 1 คนจะมี **token quota** สำหรับแต่ละ function (จะทำใน **STEP 6**)

---

## 5.1 สร้าง Function Entity

สร้างไฟล์ `src/functions/entities/function.entity.ts`:

```typescript
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('functions')
export class Function {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  name!: string;  // เช่น 'generate_image', 'summarize_text'

  @Column({ type: 'text', nullable: true })
  description!: string | null;  // อธิบายว่า function นี้ทำอะไร

  @Column({ default: true })
  isActive!: boolean;  // เปิด/ปิดใช้งาน

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
```

> 💡 ใส่ `!` ทุก field (เพราะ strict mode — อธิบายใน STEP 3.3)

> ⚠️ **ตั้งชื่อ class เป็น `Function` (ไม่ใช่ `Functions`)** — เพราะ table ชื่อ `functions` (พหูพจน์)
> แต่ class ใช้เอกพจน์ (1 entity = 1 function) เป็น convention

---

## 5.2 สร้าง DTOs

### 5.2.1 `src/functions/dto/create-function.dto.ts`

```typescript
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsBoolean, IsString } from 'class-validator';

export class CreateFunctionDto {
  @ApiProperty({ example: 'generate_image' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Generate AI images from text prompt', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: true, default: true, required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
```

### 5.2.2 `src/functions/dto/update-function.dto.ts`

```typescript
import { PartialType } from '@nestjs/swagger';
import { CreateFunctionDto } from './create-function.dto';

export class UpdateFunctionDto extends PartialType(CreateFunctionDto) {}
```

---

## 5.3 สร้าง FunctionsService

สร้างไฟล์ `src/functions/functions.service.ts`:

```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Function } from './entities/function.entity';
import { CreateFunctionDto } from './dto/create-function.dto';
import { UpdateFunctionDto } from './dto/update-function.dto';

@Injectable()
export class FunctionsService {
  constructor(
    @InjectRepository(Function)
    private readonly functionsRepository: Repository<Function>,
  ) {}

  // CREATE
  async create(createFunctionDto: CreateFunctionDto): Promise<Function> {
    const fn = this.functionsRepository.create(createFunctionDto);
    return await this.functionsRepository.save(fn);
  }

  // READ ALL
  async findAll(): Promise<Function[]> {
    return await this.functionsRepository.find();
  }

  // READ ONE
  async findOne(id: string): Promise<Function> {
    const fn = await this.functionsRepository.findOne({ where: { id } });
    if (!fn) {
      throw new NotFoundException(`Function with id ${id} not found`);
    }
    return fn;
  }

  // UPDATE
  async update(id: string, updateFunctionDto: UpdateFunctionDto): Promise<Function> {
    const fn = await this.findOne(id);
    Object.assign(fn, updateFunctionDto);
    return await this.functionsRepository.save(fn);
  }

  // DELETE
  async remove(id: string): Promise<void> {
    const fn = await this.findOne(id);
    await this.functionsRepository.remove(fn);
  }
}
```

> **เหมือน UsersService เป๊ะ!** แค่เปลี่ยน entity type

---

## 5.4 สร้าง FunctionsController (Protected!)

สร้างไฟล์ `src/functions/functions.controller.ts`:

```typescript
import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { FunctionsService } from './functions.service';
import { CreateFunctionDto } from './dto/create-function.dto';
import { UpdateFunctionDto } from './dto/update-function.dto';
import { Function } from './entities/function.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('functions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)  // ← ทุก endpoint ใน controller นี้ต้อง login
@Controller('functions')
export class FunctionsController {
  constructor(private readonly functionsService: FunctionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new function' })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createFunctionDto: CreateFunctionDto): Promise<Function> {
    return this.functionsService.create(createFunctionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all functions' })
  findAll(): Promise<Function[]> {
    return this.functionsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get function by id' })
  findOne(@Param('id') id: string): Promise<Function> {
    return this.functionsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update function' })
  update(@Param('id') id: string, @Body() updateFunctionDto: UpdateFunctionDto): Promise<Function> {
    return this.functionsService.update(id, updateFunctionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete function' })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): Promise<void> {
    return this.functionsService.remove(id);
  }
}
```

> เหมือน `UsersController` แค่:
> - เปลี่ยน entity type
> - เพิ่ม `@UseGuards(JwtAuthGuard)` + `@ApiBearerAuth()`

---

## 5.5 สร้าง FunctionsModule

สร้างไฟล์ `src/functions/functions.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Function } from './entities/function.entity';
import { FunctionsController } from './functions.controller';
import { FunctionsService } from './functions.service';

@Module({
  imports: [TypeOrmModule.forFeature([Function])],
  controllers: [FunctionsController],
  providers: [FunctionsService],
  exports: [FunctionsService],  // ← export เผื่อ STEP 6 (Tokens) ใช้
})
export class FunctionsModule {}
```

> `exports: [FunctionsService]` — **STEP 6 (Tokens Module) จะใช้ FunctionsService**

---

## 5.6 ลงทะเบียน FunctionsModule ใน AppModule

แก้ไฟไฟล์ `src/app.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from './config/configuration';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { FunctionsModule } from './functions/functions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('database.host'),
        port: config.get<number>('database.port'),
        username: config.get<string>('database.username'),
        password: config.get<string>('database.password'),
        database: config.get<string>('database.database'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    UsersModule,
    AuthModule,
    FunctionsModule,  // ← เพิ่มบรรทัดนี้
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

---

## 5.7 ทดสอบ

```bash
pnpm run start:dev
```

### 🧪 ทดสอบ CRUD (ต้อง Authorize ก่อน!)

1. เปิด `http://localhost:3000/api/docs`
2. กด **"Authorize"** 🔓 → ใส่ `access_token` (จาก STEP 4) → "Authorize"
3. ทดสอบ `POST /functions` ด้วย:
   ```json
   { "name": "generate_image", "description": "Generate AI images" }
   ```
4. ✅ ได้ function ใหม่ (status 201)
5. สร้างอีก 1-2 functions:
   ```json
   { "name": "summarize_text", "description": "Summarize long text" }
   { "name": "translate", "description": "Translate between languages" }
   ```
6. ทดสอบ `GET /functions` → เห็นทั้งหมด
7. ทดสอบ PATCH, DELETE

### 🧪 ตรวจสอบ table ใน pgAdmin

Refresh tree → **เห็น table `functions` ใหม่!** 🎉

### 🧪 ทดสอบ Protected

1. กด "Authorize" → "Logout"
2. ทดสอบ `GET /functions` → ✅ ได้ **401 Unauthorized**

---

## 📁 โครงสร้างไฟล์ที่เพิ่มใน STEP 5

```
my-backend/
├── src/
│   ├── functions/                       # ← โฟลเดอร์ใหม่
│   │   ├── entities/
│   │   │   └── function.entity.ts
│   │   ├── dto/
│   │   │   ├── create-function.dto.ts
│   │   │   └── update-function.dto.ts
│   │   ├── functions.controller.ts
│   │   ├── functions.service.ts
│   │   └── functions.module.ts
│   ├── app.module.ts                    # ← เพิ่ม FunctionsModule
│   └── ...
```

✅ เสร็จแล้ว → ไปต่อ **STEP 6: สร้าง Tokens Module + Cron Refill** 🚀

> 💡 **สังเกตไหม?** STEP 3 กับ STEP 5 pattern เดียวกันเป๊ะ — แค่เปลี่ยน entity
> นี่คือพลังของ NestJS — สร้าง CRUD ใหม่ได้เร็วมาก เพราะ pattern เดิม!

---

# 🎟️ STEP 6: สร้าง Tokens Module + Cron Refill

> 💡 **เป้าหมาย:** User มี **token quota** สำหรับแต่ละ function + **auto refill** ทุก 5 นาที
>
> | Method | Endpoint | ทำอะไร |
> |---|---|---|
> | POST | `/users/:userId/tokens` | สร้าง token ให้ user |
> | GET | `/users/:userId/tokens` | ดู tokens ทั้งหมดของ user |
> | GET | `/users/:userId/tokens/:functionId` | ดู token 1 อัน |
> | POST | `/users/:userId/tokens/:functionId/use` | ใช้ token (ลด remaining) |
> | PUT | `/users/:userId/tokens/:functionId/refill` | Refill token แบบ manual |
> | ⏰ Cron | ทุก 5 นาที | Refill tokens ทั้งหมดอัตโนมัติ |

---

## 🤔 Concept: Relations ใน TypeORM (ตารางเชื่อมกัน)

Database จริง ๆ tables ต้อง **เชื่อมโยง** กัน ไม่ใช่อยู่แยกกัน:

```
┌──────────┐         ┌──────────────┐         ┌───────────┐
│  users   │         │ user_tokens  │         │ functions │
│──────────│         │──────────────│         │───────────│
│ id (PK)  │◄────────│ userId (FK)  │         │ id (PK)   │
│ name     │  many   │ functionId   │────────►│ name      │
│ email    │◄───────►│   (FK)       │  many   │ isActive  │
└──────────┘         │ remaining    │◄───────►└───────────┘
                     │ maxLimit     │  junction table
                     └──────────────┘
```

`user_tokens` คือ **junction table** — เชื่อม user ↔ function และเก็บข้อมูลเพิ่ม (remaining, maxLimit)

> 💡 **Many-to-Many:**
> - 1 user มีได้หลาย functions
> - 1 function มีได้หลาย users
> - ใช้ **junction table** (`user_tokens`) เชื่อม

---

## 🤔 Concept: Cron Job คืออะไร?

**Cron** = ตั้งเวลาให้ task ทำงานอัตโนมัติ เช่น:
- ทุก 5 นาที → refill tokens
- ทุกวันเที่ยงคืน → ส่ง email สรุป
- ทุกเดือน → คำนวณเงินเดือน

**Cron syntax:** `* * * * *` = `minute hour day month weekday`
| Pattern | ความหมาย |
|---|---|
| `*/5 * * * *` | ทุก 5 นาที |
| `0 0 * * *` | ทุกเที่ยงคืน |
| `0 9 * * 1-5` | ทุกวันจันทร์-ศุกร์ 9 โมงเช้า |

---

## 6.1 ติดตั้ง @nestjs/schedule

```bash
pnpm add @nestjs/schedule
```

---

## 6.2 สร้าง UserToken Entity (มี Relations!)

สร้างไฟล์ `src/tokens/entities/user-token.entity.ts`:

```typescript
import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn,
  CreateDateColumn, UpdateDateColumn, Unique,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Function } from '../../functions/entities/function.entity';

@Entity('user_tokens')
@Unique(['userId', 'functionId'])  // user 1 คนมี token ได้แค่ 1 อันต่อ function
export class UserToken {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // Relation: ManyToOne → User
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column()
  userId!: string;

  // Relation: ManyToOne → Function
  @ManyToOne(() => Function, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'functionId' })
  function!: Function;

  @Column()
  functionId!: string;

  @Column({ default: 0 })
  remaining!: number;  // tokens ที่เหลือใช้

  @Column({ default: 100 })
  maxLimit!: number;   // tokens สูงสุด (refill จะเติมจนเท่านี้)

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
```

**อธิบาย:**
- `@ManyToOne(() => User)` = สร้าง relation กับ User
- `@JoinColumn({ name: 'userId' })` = สร้าง foreign key column ชื่อ `userId`
- `onDelete: 'CASCADE'` = ถ้า user ถูกลบ → tokens ของ user นั้นถูกลบตามอัตโนมัติ
- `@Unique(['userId', 'functionId'])` = user 1 คนมี token ได้แค่ 1 อันต่อ function (กันซ้ำ)

---

## 6.3 สร้าง DTO

`src/tokens/dto/create-token.dto.ts`:

```typescript
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsInt, Min, IsOptional } from 'class-validator';

export class CreateTokenDto {
  @ApiProperty({ example: 'function-uuid-here' })
  @IsString()
  @IsNotEmpty()
  functionId: string;

  @ApiProperty({ example: 100, default: 100, required: false })
  @IsInt()
  @Min(1)
  @IsOptional()
  maxLimit?: number;
}
```

---

## 6.4 สร้าง TokensService

สร้างไฟล์ `src/tokens/tokens.service.ts`:

```typescript
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserToken } from './entities/user-token.entity';
import { CreateTokenDto } from './dto/create-token.dto';

@Injectable()
export class TokensService {
  constructor(
    @InjectRepository(UserToken)
    private readonly tokensRepository: Repository<UserToken>,
  ) {}

  // สร้าง token ให้ user (สำหรับ function นั้น)
  async create(userId: string, createTokenDto: CreateTokenDto): Promise<UserToken> {
    const maxLimit = createTokenDto.maxLimit ?? 100;
    const token = this.tokensRepository.create({
      userId,
      functionId: createTokenDto.functionId,
      maxLimit,
      remaining: maxLimit,  // เริ่มต้น = maxLimit
    });
    return await this.tokensRepository.save(token);
  }

  // ดู tokens ทั้งหมดของ user
  async findAllByUser(userId: string): Promise<UserToken[]> {
    return await this.tokensRepository.find({
      where: { userId },
      relations: { function: true },  // join กับ function table (TypeORM 0.3+ syntax)
    });
  }

  // ดู token 1 อัน
  async findOne(userId: string, functionId: string): Promise<UserToken> {
    const token = await this.tokensRepository.findOne({
      where: { userId, functionId },
      relations: { function: true },
    });
    if (!token) {
      throw new NotFoundException(`Token not found for user ${userId} and function ${functionId}`);
    }
    return token;
  }

  // ใช้ token (ลด remaining ลง 1)
  async use(userId: string, functionId: string): Promise<UserToken> {
    const token = await this.findOne(userId, functionId);
    if (token.remaining <= 0) {
      throw new BadRequestException('No tokens remaining');
    }
    token.remaining -= 1;
    return await this.tokensRepository.save(token);
  }

  // Refill token แบบ manual (ตั้ง remaining = maxLimit)
  async refill(userId: string, functionId: string): Promise<UserToken> {
    const token = await this.findOne(userId, functionId);
    token.remaining = token.maxLimit;
    return await this.tokensRepository.save(token);
  }

  // Refill tokens ทั้งหมด (เรียกจาก Cron)
  async refillAll(): Promise<number> {
    const result = await this.tokensRepository
      .createQueryBuilder()
      .update(UserToken)
      .set({ remaining: () => '"maxLimit"' })  // SQL: SET remaining = maxLimit
      .execute();
    return result.affected ?? 0;
  }
}
```

**อธิบาย:**
- `relations: { function: true }` = join กับ function table → response มีข้อมูล function มาด้วย
- `use()` ตรวจ `remaining > 0` ก่อน → ถ้าไม่มี token throw **400 BadRequest**
- `refillAll()` ใช้ **QueryBuilder** — เขียน SQL ตรง ๆ: `UPDATE user_tokens SET remaining = maxLimit`
- `() => '"maxLimit"'` = arrow function → TypeORM ไม่ escape (ใช้ column name ตรง ๆ)

> 💡 **TypeORM 0.3+ เปลี่ยน `relations` syntax:**
> ```typescript
> // ❌ แบบเก่า (0.2.x) — string array
> relations: ['function']
>
> // ✅ แบบใหม่ (0.3.x+) — object literal
> relations: { function: true }
> ```
> ข้อดี: TypeScript ตรวจได้ว่า `'function'` เป็น relation ที่มีจริงใน entity
>
> **Nested relations:**
> ```typescript
> relations: {
>   function: true,
>   user: {
>     profile: true  // join 2 ชั้น
>   }
> }
> ```

---

## 6.5 สร้าง TokensController (Protected + Nested Route)

สร้างไฟล์ `src/tokens/tokens.controller.ts`:

```typescript
import { Controller, Get, Post, Put, Param, Body, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TokensService } from './tokens.service';
import { CreateTokenDto } from './dto/create-token.dto';
import { UserToken } from './entities/user-token.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('tokens')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users/:userId/tokens')  // ← nested route ใต้ user
export class TokensController {
  constructor(private readonly tokensService: TokensService) {}

  // POST /users/:userId/tokens
  @Post()
  @ApiOperation({ summary: 'Create token for user' })
  @HttpCode(HttpStatus.CREATED)
  create(
    @Param('userId') userId: string,
    @Body() createTokenDto: CreateTokenDto,
  ): Promise<UserToken> {
    return this.tokensService.create(userId, createTokenDto);
  }

  // GET /users/:userId/tokens
  @Get()
  @ApiOperation({ summary: 'Get all tokens for user' })
  findAll(@Param('userId') userId: string): Promise<UserToken[]> {
    return this.tokensService.findAllByUser(userId);
  }

  // GET /users/:userId/tokens/:functionId
  @Get(':functionId')
  @ApiOperation({ summary: 'Get token by userId + functionId' })
  findOne(
    @Param('userId') userId: string,
    @Param('functionId') functionId: string,
  ): Promise<UserToken> {
    return this.tokensService.findOne(userId, functionId);
  }

  // POST /users/:userId/tokens/:functionId/use
  @Post(':functionId/use')
  @ApiOperation({ summary: 'Use token (decrement remaining)' })
  use(
    @Param('userId') userId: string,
    @Param('functionId') functionId: string,
  ): Promise<UserToken> {
    return this.tokensService.use(userId, functionId);
  }

  // PUT /users/:userId/tokens/:functionId/refill
  @Put(':functionId/refill')
  @ApiOperation({ summary: 'Refill token to maxLimit' })
  refill(
    @Param('userId') userId: string,
    @Param('functionId') functionId: string,
  ): Promise<UserToken> {
    return this.tokensService.refill(userId, functionId);
  }
}
```

> `Controller('users/:userId/tokens')` = nested route — ทุก endpoint ขึ้นต้นด้วย `/users/:userId/tokens`

---

## 6.6 สร้าง Cron Task (Auto Refill!)

สร้างไฟล์ `src/tokens/tasks/token-refill.task.ts`:

```typescript
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TokensService } from '../tokens.service';

@Injectable()
export class TokenRefillTask {
  private readonly logger = new Logger(TokenRefillTask.name);

  constructor(private readonly tokensService: TokensService) {}

  // ทุก 5 นาที — refill tokens ทั้งหมด
  @Cron(CronExpression.EVERY_5_MINUTES)
  async handleRefill() {
    const count = await this.tokensService.refillAll();
    this.logger.log(`✅ Refilled ${count} tokens`);
  }
}
```

**อธิบาย:**
- `@Cron(CronExpression.EVERY_5_MINUTES)` = NestJS จะเรียก `handleRefill()` ทุก 5 นาทีอัตโนมัติ
- `Logger` = log เวลา task ทำงาน → เห็นใน terminal

> 💡 **CronExpression อื่น ๆ ที่ใช้บ่อย:**
> ```typescript
> @Cron(CronExpression.EVERY_MINUTE)          // ทุกนาที
> @Cron(CronExpression.EVERY_5_MINUTES)       // ทุก 5 นาที
> @Cron(CronExpression.EVERY_HOUR)            // ทุกชั่วโมง
> @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT) // ทุกเที่ยงคืน
> @Cron(CronExpression.EVERY_WEEK)            // ทุกสัปดาห์
> ```

---

## 6.7 สร้าง TokensModule

สร้างไฟล์ `src/tokens/tokens.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserToken } from './entities/user-token.entity';
import { TokensController } from './tokens.controller';
import { TokensService } from './tokens.service';
import { TokenRefillTask } from './tasks/token-refill.task';

@Module({
  imports: [TypeOrmModule.forFeature([UserToken])],
  controllers: [TokensController],
  providers: [TokensService, TokenRefillTask],  // ← TokenRefillTask ต้องอยู่ใน providers
  exports: [TokensService],
})
export class TokensModule {}
```

> **`TokenRefillTask` ต้องอยู่ใน `providers`** ไม่งั้น NestJS ไม่สร้าง instance → Cron ไม่ทำงาน

---

## 6.8 ลงทะเบียน ScheduleModule + TokensModule ใน AppModule

แก้ไฟไฟล์ `src/app.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';  // ← import
import configuration from './config/configuration';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { FunctionsModule } from './functions/functions.module';
import { TokensModule } from './tokens/tokens.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('database.host'),
        port: config.get<number>('database.port'),
        username: config.get<string>('database.username'),
        password: config.get<string>('database.password'),
        database: config.get<string>('database.database'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    ScheduleModule.forRoot(),  // ← ต้องมี! เปิดใช้ Cron
    UsersModule,
    AuthModule,
    FunctionsModule,
    TokensModule,  // ← เพิ่ม
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

> ⚠️ **`ScheduleModule.forRoot()` ต้องอยู่ใน `imports`** ไม่งั้น `@Cron` decorator ไม่ทำงาน

---

## 6.9 ทดสอบ

```bash
pnpm run start:dev
```

### 🧪 ทดสอบ Token Flow

1. เปิด Swagger → Authorize (ใส่ token)
2. **สร้าง token** — `POST /users/{your-user-id}/tokens` ด้วย:
   ```json
   { "functionId": "function-uuid-here", "maxLimit": 100 }
   ```
3. **ดู tokens** — `GET /users/{user-id}/tokens` → เห็น token (รวมข้อมูล function)
4. **ใช้ token** — `POST /users/{user-id}/tokens/{function-id}/use` → remaining ลดลง 1
5. **Refill แบบ manual** — `PUT /users/{user-id}/tokens/{function-id}/refill` → remaining กลับเป็น maxLimit

### 🧪 ทดสอบใช้ token จนหมด

1. ใช้ token ซ้ำ ๆ จน `remaining = 0`
2. ลองใช้อีกครั้ง → ✅ ได้ **400 BadRequest: "No tokens remaining"**

### 🧪 ทดสอบ Cron Auto-Refill

1. ใช้ token 5-10 ครั้ง → remaining ลดลง
2. **รอ 5 นาที** (หรือเปลี่ยนเป็น `EVERY_MINUTE` เพื่อ dev เร็วขึ้น)
3. ดูใน terminal → เห็น log: `✅ Refilled N tokens`
4. เรียก `GET /users/{user-id}/tokens` → remaining กลับเป็น maxLimit 🎉

> 💡 **เคล็ดลับตอน dev:** เปลี่ยน cron ให้รันบ่อยขึ้น
> ```typescript
> @Cron('*/10 * * * * *')  // ทุก 10 วินาที (6 asterisks!)
> ```

### 🧪 ตรวจสอบใน pgAdmin

Refresh tree → เห็น table `user_tokens` พร้อม columns:
- `id`, `userId`, `functionId`, `remaining`, `maxLimit`, `createdAt`, `updatedAt`

---

## 📁 โครงสร้างไฟล์ที่เพิ่มใน STEP 6

```
my-backend/
├── src/
│   ├── tokens/                            # ← โฟลเดอร์ใหม่
│   │   ├── entities/
│   │   │   └── user-token.entity.ts       # Entity พร้อม Relations
│   │   ├── dto/
│   │   │   └── create-token.dto.ts
│   │   ├── tasks/
│   │   │   └── token-refill.task.ts       # Cron Job
│   │   ├── tokens.controller.ts
│   │   ├── tokens.service.ts
│   │   └── tokens.module.ts
│   ├── app.module.ts                      # ← เพิ่ม ScheduleModule + TokensModule
│   └── ...
```

✅ เสร็จแล้ว → ไปต่อ **STEP 7: ทดลอง End-to-End (Register → Login → ใช้ Token)** 🚀

> 🎉 **STEP 6 คือ STEP ที่ซับซ้อนที่สุด** — มี Relations + Cron Job + Business Logic
> ถ้าผ่านขั้นนี้ได้ = junior พร้อมทำงานจริงแล้ว!

---

# 🧪 STEP 7: ทดลอง End-to-End (Postman Collection)

> 💡 **เป้าหมาย:** ทดสอบ **ทุก endpoint** แบบ end-to-end ด้วย Postman ตาม flow จริง
>
> **Flow:** Register → Login → สร้าง Function → สร้าง Token → ใช้ Token → Refill → รอ Cron

---

## 7.1 ติดตั้ง Postman (ถ้ายังไม่มี)

- ดาวน์โหลด: https://www.postman.com/downloads/
- สร้าง account ฟรี → Login

> 💡 **ทางเลือก:** ใช้ **Thunder Client** (extension ของ VS Code) แทน Postman ได้
> ดูใน STEP 0 — ติดตั้งจาก Extensions tab

---

## 7.1.1 🚀 Import Postman Collection (แนะนำ!)

ผมเตรียม **Collection + Environment** ไว้ให้แล้ว — ไม่ต้องสร้างเอง!

**ไฟล์:**
- `postman/Baby-101-Backend.postman_collection.json` — Collection หลัก (618 บรรทัด)
- `postman/Baby-101-Local.postman_environment.json` — Environment (baseUrl, token, userId, functionId)
- `postman/README.md` — คำอธิบายการใช้งาน

**วิธี Import:**
1. เปิด Postman
2. **File → Import** → เลือกทั้ง 2 ไฟล์ (collection + environment)
3. มุมขวาบน → เลือก environment **"Baby 101 Local"**
4. เริ่มจาก **🔓 Auth → Register** → token จะถูกเก็บอัตโนมัติ!

**✨ Features ของ Collection นี้:**
- ✅ **Auto-set token** หลัง Login/Register (ไม่ต้อง copy token เอง)
- ✅ **Auto-set userId, functionId** หลัง create
- ✅ **Collection-level Bearer Auth** — ไม่ต้องใส่ header ทุก request
- ✅ **Test scripts** — log ทุก request/response ใน Console
- ✅ **Error scenarios** — Login (wrong), Use Token (no remaining), Get Users (no token)

---

## 7.2 ตั้งค่า Postman Environment

**Environment = ตัวแปรที่ใช้ซ้ำได้ในทุก request** (เช่น `baseUrl`, `token`)

### ขั้นตอน:
1. เปิด Postman → กด **"Environments"** (เมนูซ้าย)
2. กด **"+"** → ตั้งชื่อ `Baby 101 Local`
3. เพิ่ม variables 2 ตัว:

| Variable | Initial Value | Current Value |
|---|---|---|
| `baseUrl` | `http://localhost:3000` | (เหมือนกัน) |
| `token` | (ว่างไว้) | (จะใส่หลัง login) |

4. กด **Save**
5. มุมขวาบน → เลือก environment **`Baby 101 Local`**

> 💡 **วิธีใช้:** ใน request ใส่ `{{baseUrl}}/auth/login` แทน URL เต็ม → เปลี่ยน env ครั้งเดียว ใช้ได้ทุก request

---

## 7.3 E2E Flow — ทดสอบทีละขั้น

> 🎯 **ทำตามลำดับนี้** — แต่ละขั้นต้องใช้ output จากขั้นก่อนหน้า

---

### 🔵 STEP 1: Register (สมัคร user ใหม่)

| | |
|---|---|
| **Method** | `POST` |
| **URL** | `{{baseUrl}}/auth/register` |
| **Headers** | `Content-Type: application/json` |
| **Body (raw JSON)** | 👇 |

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@test.com",
  "password": "secret123"
}
```

**Expected Response (201 Created):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "john@test.com"
  }
}
```

✅ **เก็บ `access_token` ไว้** — ต้องใช้ในทุก request ถัดไป

---

### 🔵 STEP 2: ตั้งค่า token ใน Postman

**Option A: ตั้งใน Environment**
1. Environments → `Baby 101 Local` → `token` → วาง access_token
2. Save

**Option B: ใช้ Collection-level Authorization**
1. กดขวาที่ Collection → "Edit" → แท็บ "Authorization"
2. Type: `Bearer Token` → วาง token
3. Save → **ทุก request ใน collection จะมี Authorization header อัตโนมัติ**

> 💡 **แนะนำ Option B** — ไม่ต้องใส่ header ซ้ำทุก request

---

### 🔵 STEP 3: Login (ทดสอบ login)

| | |
|---|---|
| **Method** | `POST` |
| **URL** | `{{baseUrl}}/auth/login` |
| **Auth** | ไม่ต้องใช้ (public endpoint) |
| **Body (raw JSON)** | 👇 |

**Request Body:**
```json
{
  "email": "john@test.com",
  "password": "secret123"
}
```

**Expected Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "john@test.com"
  }
}
```

✅ **ทดสอบ login ผิดด้วย:**

```json
{ "email": "john@test.com", "password": "wrongpassword" }
```

❌ **Expected Response (401 Unauthorized):**
```json
{
  "message": "Invalid credentials",
  "error": "Unauthorized",
  "statusCode": 401
}
```

---

### 🔵 STEP 4: ดู Users ทั้งหมด (ต้องมี token)

| | |
|---|---|
| **Method** | `GET` |
| **URL** | `{{baseUrl}}/users` |
| **Auth** | Bearer Token (จาก environment หรือ collection) |

**Expected Response (200 OK):**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "John Doe",
    "email": "john@test.com",
    "password": "$2b$10$...",  // ← bcrypt hash
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

---

### 🔵 STEP 5: สร้าง Function

| | |
|---|---|
| **Method** | `POST` |
| **URL** | `{{baseUrl}}/functions` |
| **Auth** | Bearer Token |
| **Body (raw JSON)** | 👇 |

**Request Body:**
```json
{
  "name": "generate_image",
  "description": "Generate AI images from text prompt"
}
```

**Expected Response (201 Created):**
```json
{
  "id": "abc-123-uuid",
  "name": "generate_image",
  "description": "Generate AI images from text prompt",
  "isActive": true,
  "createdAt": "2024-01-15T10:35:00.000Z",
  "updatedAt": "2024-01-15T10:35:00.000Z"
}
```

✅ **เก็บ `id` ของ function ไว้** — ต้องใช้ตอนสร้าง token

**สร้างเพิ่มอีก 1 function:**
```json
{
  "name": "summarize_text",
  "description": "Summarize long text"
}
```

---

### 🔵 STEP 6: ดู Functions ทั้งหมด

| | |
|---|---|
| **Method** | `GET` |
| **URL** | `{{baseUrl}}/functions` |
| **Auth** | Bearer Token |

**Expected Response (200 OK):**
```json
[
  {
    "id": "abc-123-uuid",
    "name": "generate_image",
    "description": "...",
    "isActive": true
  },
  {
    "id": "def-456-uuid",
    "name": "summarize_text",
    "description": "...",
    "isActive": true
  }
]
```

---

### 🔵 STEP 7: สร้าง Token (ให้ user ใช้ function)

> ใช้ `userId` จาก STEP 1 และ `functionId` จาก STEP 5

| | |
|---|---|
| **Method** | `POST` |
| **URL** | `{{baseUrl}}/users/{userId}/tokens` |
| **Auth** | Bearer Token |
| **Body (raw JSON)** | 👇 |

**Request Body:**
```json
{
  "functionId": "abc-123-uuid",
  "maxLimit": 100
}
```

**Expected Response (201 Created):**
```json
{
  "id": "token-uuid-789",
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "functionId": "abc-123-uuid",
  "remaining": 100,
  "maxLimit": 100,
  "createdAt": "2024-01-15T10:40:00.000Z",
  "updatedAt": "2024-01-15T10:40:00.000Z"
}
```

---

### 🔵 STEP 8: ดู Tokens ทั้งหมดของ User

| | |
|---|---|
| **Method** | `GET` |
| **URL** | `{{baseUrl}}/users/{userId}/tokens` |
| **Auth** | Bearer Token |

**Expected Response (200 OK):**
```json
[
  {
    "id": "token-uuid-789",
    "userId": "550e8400-...",
    "functionId": "abc-123-uuid",
    "remaining": 100,
    "maxLimit": 100,
    "function": {                    // ← join กับ function table
      "id": "abc-123-uuid",
      "name": "generate_image",
      "description": "...",
      "isActive": true
    }
  }
]
```

---

### 🔵 STEP 9: ใช้ Token (ลด remaining)

| | |
|---|---|
| **Method** | `POST` |
| **URL** | `{{baseUrl}}/users/{userId}/tokens/{functionId}/use` |
| **Auth** | Bearer Token |
| **Body** | ไม่ต้องส่ง |

**Expected Response (200 OK):**
```json
{
  "id": "token-uuid-789",
  "userId": "550e8400-...",
  "functionId": "abc-123-uuid",
  "remaining": 99,   // ← ลดจาก 100 → 99
  "maxLimit": 100,
  "createdAt": "...",
  "updatedAt": "..."
}
```

✅ **ลองเรียกซ้ำหลายครั้ง** → remaining จะลดลงเรื่อย ๆ

---

### 🔵 STEP 10: ใช้ Token จนหมด (ทดสอบ error)

1. ใช้ token ซ้ำจน `remaining = 0` (เรียก STEP 9 ประมาณ 100 ครั้ง 😅)
2. ลองเรียกอีกครั้ง

❌ **Expected Response (400 Bad Request):**
```json
{
  "message": "No tokens remaining",
  "error": "Bad Request",
  "statusCode": 400
}
```

---

### 🔵 STEP 11: Refill Token แบบ Manual

| | |
|---|---|
| **Method** | `PUT` |
| **URL** | `{{baseUrl}}/users/{userId}/tokens/{functionId}/refill` |
| **Auth** | Bearer Token |

**Expected Response (200 OK):**
```json
{
  "id": "token-uuid-789",
  "remaining": 100,   // ← กลับเป็น maxLimit
  "maxLimit": 100,
  ...
}
```

---

### 🔵 STEP 12: ทดสอบ Cron Auto-Refill

1. ใช้ token 5-10 ครั้ง → remaining ลด
2. **รอ 5 นาที** (หรือเปลี่ยน cron เป็น `EVERY_MINUTE` เพื่อ dev เร็วขึ้น)
3. ดูใน terminal → เห็น log: `✅ Refilled N tokens`
4. เรียก `GET /users/{userId}/tokens` → remaining กลับเป็น 100 🎉

---

### 🔵 STEP 13: ทดสอบ Protected โดยไม่มี Token

1. ไปที่ Collection → Authorization → Clear
2. ลอง `GET /users` →

❌ **Expected Response (401 Unauthorized):**
```json
{
  "message": "Unauthorized",
  "statusCode": 401
}
```

---

## 7.4 Quick Reference — All Endpoints

| Method | Endpoint | Auth | Description |
|---|---|:---:|---|
| `POST` | `/auth/register` | ❌ | สมัคร + ได้ token |
| `POST` | `/auth/login` | ❌ | Login + ได้ token |
| `POST` | `/users` | ✅ | สร้าง user (admin) |
| `GET` | `/users` | ✅ | ดู users ทั้งหมด |
| `GET` | `/users/:id` | ✅ | ดู user 1 คน |
| `PATCH` | `/users/:id` | ✅ | แก้ไข user |
| `DELETE` | `/users/:id` | ✅ | ลบ user |
| `POST` | `/functions` | ✅ | สร้าง function |
| `GET` | `/functions` | ✅ | ดู functions ทั้งหมด |
| `GET` | `/functions/:id` | ✅ | ดู function 1 อัน |
| `PATCH` | `/functions/:id` | ✅ | แก้ไข function |
| `DELETE` | `/functions/:id` | ✅ | ลบ function |
| `POST` | `/users/:userId/tokens` | ✅ | สร้าง token ให้ user |
| `GET` | `/users/:userId/tokens` | ✅ | ดู tokens ของ user |
| `GET` | `/users/:userId/tokens/:functionId` | ✅ | ดู token 1 อัน |
| `POST` | `/users/:userId/tokens/:functionId/use` | ✅ | ใช้ token |
| `PUT` | `/users/:userId/tokens/:functionId/refill` | ✅ | Refill manual |

---

## 7.5 cURL Cheat Sheet (ถ้าไม่มี Postman)

> เปิด terminal → copy-paste ได้เลย

**Register:**
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@test.com","password":"secret123"}'
```

**Login (เก็บ token):**
```bash
# macOS/Linux
TOKEN=$(curl -s -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@test.com","password":"secret123"}' \
  | jq -r '.access_token')

# Windows PowerShell
$TOKEN = (curl -X POST http://localhost:3000/auth/login `
  -H "Content-Type: application/json" `
  -d '{"email":"john@test.com","password":"secret123"}' `
  | ConvertFrom-Json).access_token

echo "Token: $TOKEN"
```

**ใช้ token เรียก endpoint:**
```bash
# GET /users
curl http://localhost:3000/users \
  -H "Authorization: Bearer $TOKEN"

# POST /functions
curl -X POST http://localhost:3000/functions \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"generate_image","description":"Generate AI images"}'

# POST /users/{userId}/tokens
curl -X POST http://localhost:3000/users/YOUR_USER_ID/tokens \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"functionId":"YOUR_FUNCTION_ID","maxLimit":100}'

# POST .../use
curl -X POST http://localhost:3000/users/YOUR_USER_ID/tokens/YOUR_FUNCTION_ID/use \
  -H "Authorization: Bearer $TOKEN"
```

---

## 7.6 💡 เคล็ดลับ Postman

### 1. ใช้ Collection + Environment
- **Collection** = กลุ่ม requests (เก็บไว้แชร์ทีมได้)
- **Environment** = ตัวแปร `{{baseUrl}}`, `{{token}}`

### 2. ใช้ "Tests" tab
เขียน JavaScript ตรวจ response อัตโนมัติ:
```javascript
// ใน tab "Tests"
pm.test("Status is 200", () => pm.response.to.have.status(200));
pm.test("Has access_token", () => pm.expect(pm.response.json().access_token).to.exist);
```

### 3. ใช้ "Pre-request Script"
รัน code ก่อน request:
```javascript
// ตั้ง token อัตโนมัติ (ถ้ายังไม่หมดอายุ)
pm.environment.set("token", pm.environment.get("token") || "");
```

### 4. Save Response เป็น Example
- กด "Save Response" → "Save as Example"
- ใช้เป็น template สำหรับ test ใหม่

---

## 7.7 🎯 เช็คลิสต์: ทุก STEP ผ่านหมด = Backend ใช้งานได้!

- [x] Register user → ได้ token
- [x] Login → ได้ token
- [x] GET /users → ดู users ได้
- [x] POST /functions → สร้าง function ได้
- [x] POST /users/{id}/tokens → สร้าง token ได้
- [x] POST .../use → remaining ลด
- [x] ใช้จนหมด → 400 BadRequest
- [x] PUT .../refill → กลับเป็น maxLimit
- [x] รอ 5 นาที → cron refill อัตโนมัติ
- [x] Logout (ลบ token) → endpoint protected → 401

✅ **ถ้าทุก checkbox ผ่าน = Backend ทำงานครบถ้วน!**

✅ เสร็จแล้ว → ไปต่อ **STEP 8: ปัญหาที่พบบ่อย & วิธีแก้** 🚀

> 💡 **มี Postman collection สำเร็จรูป!** ดูที่ `postman/` folder
> Import ใน Postman: File → Import → เลือกทั้ง Collection + Environment
> ได้ทุก request พร้อมใช้ + auto-set token!
