# Introduction

Learning project — NestJS REST API dengan TypeORM, MySQL, JWT Authentication, soft delete, dan response formatting.

---

## Fitur

- **CRUD Users** — `GET/POST/DELETE /users`
- **CRUD Photos** — `GET/POST/PUT/DELETE /photos`
- **Relasi OneToMany** — User has many Photos
- **JWT Authentication** — Register & Login via `/auth`, seluruh endpoint users/photos terproteksi
- **Soft Delete** — Data tidak dihapus permanen, hanya diberi timestamp `deletedAt`
- **Timestamps** — `createdAt` & `updatedAt` otomatis dari TypeORM
- **Consistent API Response** — Format `{ status, message, data }` di semua response sukses
- **Error Handling** — NotFoundException (404) & InternalServerErrorException (500) di setiap controller
- **Password Hashing** — Otomatis hash via `@BeforeInsert` menggunakan bcrypt

---

## Entity Structure

### User
| Column | Type | Keterangan |
|---|---|---|
| id | number | Primary key, auto increment |
| email | string | Unique |
| firstName | string | |
| lastName | string | |
| password | string | Di-hash otomatis |
| isActive | boolean | Default `true` |
| createdAt | Date | Otomatis |
| updatedAt | Date | Otomatis |
| deletedAt | Date | Nullable, soft delete |

### Photo
| Column | Type | Keterangan |
|---|---|---|
| id | number | Primary key, auto increment |
| name | string | |
| url | string | |
| userId | number | Foreign key ke User |
| createdAt | Date | Otomatis |
| updatedAt | Date | Otomatis |
| deletedAt | Date | Nullable, soft delete |

---

## API Endpoints

### Auth (Public)
| Method | Endpoint | Body |
|---|---|---|
| POST | `/auth/register` | `{ email, firstName, lastName, password }` |
| POST | `/auth/login` | `{ email, password }` |

### Users (Protected — perlu Bearer token)
| Method | Endpoint | Body |
|---|---|---|
| GET | `/users` | - |
| GET | `/users/:id` | - |
| POST | `/users` | `{ email, firstName, lastName, password }` |
| DELETE | `/users/:id` | - |

### Photos (Protected — perlu Bearer token)
| Method | Endpoint | Body |
|---|---|---|
| GET | `/photos` | - |
| GET | `/photos/:id` | - |
| POST | `/photos` | `{ name, url, userId }` |
| PUT | `/photos/:id` | `{ name?, url?, userId? }` |
| DELETE | `/photos/:id` | - |

---

## Cara Pakai

```bash
# 1. Register
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","firstName":"John","lastName":"Doe","password":"123456"}'

# 2. Login (dapat token)
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"123456"}'

# 3. Akses protected endpoint
curl http://localhost:3000/users \
  -H "Authorization: Bearer <token>"
```

---

## CLI Commands

```bash
# Development
npm run start          # Start server
npm run start:dev      # Start with watch mode (auto restart)
npm run start:debug    # Start with debug + watch
npm run build          # Compile TypeScript ke dist/
npm run lint           # ESLint fix
npm run test           # Unit test (Jest)
npm run test:e2e       # E2E test

# Database
mysql -u root -p       # Akses MySQL langsung

# Install dependencies tambahan
npm install @nestjs/typeorm typeorm mysql2
npm install @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt
npm install -D @types/passport-jwt @types/bcrypt
```

---

## Dependencies

### Production
| Package | Versi | Fungsi |
|---|---|---|
| `@nestjs/common` | ^11.0.1 | NestJS core decorators & utilities |
| `@nestjs/core` | ^11.0.1 | NestJS runtime |
| `@nestjs/platform-express` | ^11.0.1 | Express adapter |
| `@nestjs/typeorm` | ^11.0.1 | TypeORM integration |
| `@nestjs/jwt` | latest | JWT token generation |
| `@nestjs/passport` | latest | Passport strategy integration |
| `typeorm` | latest | ORM database |
| `mysql2` | latest | MySQL driver |
| `passport` | latest | Authentication middleware |
| `passport-jwt` | latest | JWT strategy for Passport |
| `bcrypt` | latest | Password hashing |
| `reflect-metadata` | ^0.2.2 | Decorators support |
| `rxjs` | ^7.8.1 | Reactive extensions |

### Dev
| Package | Fungsi |
|---|---|
| `typescript` | TypeScript compiler |
| `jest` / `ts-jest` | Unit testing |
| `supertest` | E2E testing |
| `eslint` / `prettier` | Code quality |
| `ts-node` | TypeScript execution |
| `@types/passport-jwt` | Type definitions |
| `@types/bcrypt` | Type definitions |

---

## Catatan

- **JWT Secret** saat ini hardcoded (`'secretKey'`). Untuk production, gunakan environment variable.
- **synchronize: true** hanya untuk development. Untuk production gunakan migration.
- **Database**: MySQL `testnestjs` di `localhost:3306`.
