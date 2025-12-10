# Student Course Enrollment System

[![NestJS](https://img.shields.io/badge/NestJS-%23E0234E.svg?&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192.svg?&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Swagger](https://img.shields.io/badge/Swagger-85EA2D.svg?&logo=swagger&logoColor=black)](https://swagger.io/)

Backend system for student course enrollment with timetable clash detection.

## Features

✅ **Core Requirements**:

- Colleges, students, courses, course timetables, student-course selections
- Enroll API: `POST /enrollments` validates:
  - Student/courses exist + same college
  - No timetable clashes (new courses + existing enrollment)
  - Edge cases (empty list, invalid IDs)

🎯 **Bonus Points**:

- DB constraints: FKs, unique selections, same-college CHECK, Triggers
- Admin timetable APIs (add/edit/delete) that protect enrolled students

## Tech Stack

- **NestJS** (TypeScript)
- **PostgreSQL** + **Sequelize**
- **Swagger** (OpenAPI docs)

## Quick Start

### 1. Clone & Install

git clone https://github.com/sumitsinghchauhan1210/student-course-enrollment.git
cd student-course-enrollment
npm install

### 2. Environment (.env)

`DB_HOST=localhost`
`DB_PORT=5432`
`DB_USERNAME=postgres`
`DB_PASSWORD=password`
`DB_NAME=enrollment_db`

### 3. Postgres

Docker (recommended)

`docker run -d --name postgres-enroll -e POSTGRES_DB=enrollment_db -e POSTGRES_PASSWORD=password -p 5432:5432 postgres:15`

`npm run start:dev`

**API**: `http://localhost:3000`  
**Swagger**: `http://localhost:3000/api`

## Database Schema

- colleges (id, name)
- students (id, name, college_id → colleges)
- courses (id, code, title, college_id → colleges)
- course_timetables (id, course_id → courses, day_of_week, start_time, end_time)
- student_course_selections (id, student_id → students, course_id → courses)

**Bonus Constraints**:
-- Unique enrollment per student+course
UNIQUE(student_id, course_id)

-- Same college enforcement
CHECK((SELECT college_id FROM students s WHERE s.id = student_id) =
(SELECT college_id FROM courses c WHERE c.id = course_id))

- Full `schema.sql` included in repo.

## API Endpoints

| Method   | Endpoint                        | Description                            |
| -------- | ------------------------------- | -------------------------------------- |
| `POST`   | `/colleges`                     | Create college                         |
| `POST`   | `/students`                     | Create student                         |
| `POST`   | `/courses`                      | Create course                          |
| `POST`   | `/courses/:courseId/timetables` | Add timetable slot                     |
| `POST`   | `/enrollments`                  | **Core**: Enroll with clash validation |
| `PATCH`  | `/timetables/:id`               | **Bonus**: Update safely               |
| `DELETE` | `/timetables/:id`               | **Bonus**: Delete slot                 |

**Test Flow** (Swagger `/api`):

1. `POST /colleges` → `{"name": "MIT"}`
2. `POST /students` → `{"name": "John", "collegeId": 1}`
3. `POST /courses` → `{"code": "CS101", "title": "Intro CS", "collegeId": 1}`
4. `POST /courses/1/timetables` → `{"dayOfWeek": 1, "startTime": "09:00", "endTime": "10:00"}`
5. `POST /enrollments` → `{"studentId": 1, "courseIds": [1]}` ✅

## Assignment Coverage

| Requirement              | Status                                           |
| ------------------------ | ------------------------------------------------ |
| Database schema          | ✅ All entities + relationships                  |
| Save enrollment function | ✅ With all validations                          |
| Edge cases               | ✅ Empty list, invalid IDs                       |
| **Bonus DB constraints** | ✅ FKs, CHECK, UNIQUE                            |
| **Bonus admin APIs**     | ✅ Timetable CRUD w/ protection                  |
| **Bonus Trigger**        | ✅ Same-college validation on enrollment         |
| **Bonus Trigger**        | ✅ No self-overlapping timetables per course/day |
| **ERD**                  | ✅ ERD diagram                                   |

## Deliverables Ready

- `schema.sql` – Complete schema + Triggers
- `ERD.png` - Entity Relationship Diagram
- `src/enrollment/enrollment.service.ts` – Core enroll function
- Full NestJS app with Swagger docs
- This README
