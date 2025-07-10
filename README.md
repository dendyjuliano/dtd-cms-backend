<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# DTD CMS (Content Management System)

A comprehensive Content Management System built with NestJS, TypeORM, and MySQL for managing staff and leave administration.

## Features

- **Admin Management**: Full CRUD operations for admin users with JWT authentication
- **Staff Management**: Complete staff management system with detailed profiles
- **Leave Management**: Advanced leave system with business rules:
  - Maximum 12 days leave per year per staff
  - Only 1 leave request per month per staff
  - Date validation and conflict checking
- **Database Migrations**: Structured database schema management
- **JWT Authentication**: Secure authentication system for API endpoints
- **Input Validation**: Comprehensive validation using class-validator
- **TypeORM Integration**: Database abstraction with entity relationships

## Tech Stack

- **Backend**: NestJS (Node.js framework)
- **Database**: MySQL
- **ORM**: TypeORM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: class-validator, class-transformer
- **Password Hashing**: bcryptjs

## Project Structure

```
src/
├── admin/
│   ├── dto/
│   │   ├── create-admin.dto.ts
│   │   ├── update-admin.dto.ts
│   │   └── login.dto.ts
│   ├── entities/
│   │   └── admin.entity.ts
│   ├── admin.controller.ts
│   ├── admin.service.ts
│   └── admin.module.ts
├── staff/
│   ├── dto/
│   │   ├── create-staff.dto.ts
│   │   └── update-staff.dto.ts
│   ├── entities/
│   │   └── staff.entity.ts
│   ├── staff.controller.ts
│   ├── staff.service.ts
│   └── staff.module.ts
├── leave/
│   ├── dto/
│   │   ├── create-leave.dto.ts
│   │   └── update-leave.dto.ts
│   ├── entities/
│   │   └── leave.entity.ts
│   ├── leave.controller.ts
│   ├── leave.service.ts
│   └── leave.module.ts
├── auth/
│   ├── jwt.strategy.ts
│   └── jwt-auth.guard.ts
├── migrations/
├── app.module.ts
├── data-source.ts
└── main.ts
```

## Database Schema

### Admin Table

- `id` (UUID, Primary Key)
- `first_name` (VARCHAR)
- `last_name` (VARCHAR)
- `email` (VARCHAR, Unique)
- `date_of_birth` (DATE)
- `gender` (VARCHAR)
- `password` (VARCHAR, Hashed)
- `createdAt` (TIMESTAMP)
- `updatedAt` (TIMESTAMP)

### Staff Table

- `id` (UUID, Primary Key)
- `first_name` (VARCHAR)
- `last_name` (VARCHAR)
- `email` (VARCHAR, Unique)
- `no_hp` (VARCHAR)
- `address` (TEXT)
- `gender` (VARCHAR)
- `createdAt` (TIMESTAMP)
- `updatedAt` (TIMESTAMP)

### Leave Table

- `id` (UUID, Primary Key)
- `reason` (TEXT)
- `date_start` (DATE)
- `date_end` (DATE)
- `staff_id` (UUID, Foreign Key)
- `createdAt` (TIMESTAMP)
- `updatedAt` (TIMESTAMP)

## Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### Step 1: Clone the Repository

```bash
git clone <your-repository-url>
cd dtd-cms
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Database Setup

1. **Create MySQL Database**:

   ```sql
   CREATE DATABASE dtd_cms;
   ```

2. **Create Environment File**:

   ```bash
   cp .env.example .env
   ```

3. **Configure Environment Variables**:

   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=3306
   DB_USERNAME=root
   DB_PASSWORD=your_mysql_password
   DB_DATABASE=dtd_cms

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
   ```

### Step 4: Generate JWT Secret

Generate a secure JWT secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and paste it as `JWT_SECRET` in your `.env` file.

### Step 5: Run Database Migrations

```bash
# Run migrations
npm run migration:run
```

### Step 6: Create First Admin User

Execute this SQL query in your MySQL database:

```sql
INSERT INTO admins (
  id,
  first_name,
  last_name,
  email,
  date_of_birth,
  gender,
  password,
  createdAt,
  updatedAt
) VALUES (
  UUID(),
  'Super',
  'Admin',
  'admin@dtdcms.com',
  '1985-01-01',
  'male',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password: 'admin123'
  NOW(),
  NOW()
);
```

### Step 7: Start the Application

```bash
# Development mode
npm run start:dev

# Production mode
npm run start:prod
```

The application will start on `http://localhost:8000`

## API Endpoints

### Authentication

- `POST /admin/auth/login` - Admin login
- `POST /admin/auth/logout` - Admin logout

### Admin Management

- `GET /admin/profile` - Get admin profile
- `PATCH /admin/profile` - Update admin profile
- `GET /admin/manage` - Get all admins
- `POST /admin/manage` - Create new admin
- `GET /admin/manage/:id` - Get admin by ID
- `PATCH /admin/manage/:id` - Update admin by ID
- `DELETE /admin/manage/:id` - Delete admin by ID

### Staff Management

- `GET /staff` - Get all staff
- `POST /staff` - Create new staff
- `GET /staff/:id` - Get staff by ID
- `PATCH /staff/:id` - Update staff by ID
- `DELETE /staff/:id` - Delete staff by ID

### Leave Management

- `GET /leave` - Get all leaves
- `POST /leave` - Create new leave
- `GET /leave/:id` - Get leave by ID
- `PATCH /leave/:id` - Update leave by ID
- `DELETE /leave/:id` - Delete leave by ID
- `GET /leave/staff-on-leave` - Get staff with their leaves

## API Usage Examples

### Login

```bash
curl -X POST http://localhost:8000/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@dtdcms.com",
    "password": "admin123"
  }'
```

### Create Staff

```bash
curl -X POST http://localhost:8000/staff \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@company.com",
    "no_hp": "081234567890",
    "address": "123 Main Street, Jakarta",
    "gender": "male"
  }'
```

### Create Leave

```bash
curl -X POST http://localhost:8000/leave \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "reason": "Sick leave",
    "date_start": "2024-07-15",
    "date_end": "2024-07-17",
    "staff_id": "STAFF_UUID_HERE"
  }'
```

## Development Commands

```bash
# Start development server
npm run start:dev

# Build for production
npm run build

# Run tests
npm run test

# Run e2e tests
npm run test:e2e

# Migration commands
npm run migration:generate src/migrations/MigrationName
npm run migration:run
npm run migration:revert

# Linting
npm run lint
```

## Business Rules

### Leave Management Rules

1. **Annual Limit**: Each staff member can take maximum 12 days of leave per year
2. **Monthly Limit**: Only 1 leave request per month per staff member
3. **Date Validation**: Start date cannot be after end date
4. **Staff Validation**: Staff must exist in the system to create leave

### Security

- All API endpoints (except login) require JWT authentication
- Passwords are hashed using bcrypt
- Input validation on all endpoints
- SQL injection protection through TypeORM

## Environment Variables

| Variable      | Description       | Example           |
| ------------- | ----------------- | ----------------- |
| `DB_HOST`     | Database host     | `localhost`       |
| `DB_PORT`     | Database port     | `3306`            |
| `DB_USERNAME` | Database username | `root`            |
| `DB_PASSWORD` | Database password | `your_password`   |
| `DB_DATABASE` | Database name     | `dtd_cms`         |
| `JWT_SECRET`  | JWT secret key    | `your-secret-key` |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team or create an issue in the repository.

## Postman Documentation

https://documenter.getpostman.com/view/29096810/2sB34eK2aQ
