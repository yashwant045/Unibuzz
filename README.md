# UniBuzz - University Event Management System

## Introduction

UniBuzz is a CRM-based university event management web application designed to centralize academic event information and improve student engagement. It solves the problem of scattered communication across platforms like emails, social media, and notice boards by providing a unified system for managing and accessing events.

The platform enables students, faculty, and administrators to interact efficiently through a secure and structured environment.

---

## Features

### Authentication and Authorization

* Secure login and registration using JWT authentication
* Role-based access control (Admin, Faculty, Student)
* Protected APIs using Spring Security filters

### Event Management

* Create, view, and delete events
* Faculty can manage their own events
* Centralized listing of all academic events

### Student Features

* Register for events (first-come-first-serve)
* View registered events
* Interest-based event recommendations
* Track upcoming and past events

### Faculty Features

* Create and manage events
* View student registrations for events
* Dashboard with analytics (upcoming vs past events)

### System Features

* Real-time seat availability tracking
* Unique registration per student per event
* Token-based authentication system
* Responsive frontend with modern UI

---

## Tech Stack

### Frontend

* React (Vite)
* Tailwind CSS
* Axios
* React Router

### Backend

* Spring Boot
* Spring Security
* JWT Authentication
* JPA (Hibernate)

### Database

* MySQL / PostgreSQL (configurable)

---

## Project Structure

### Backend (Spring Boot)

```
com.unibuzz.crm
│
├── config           # Security and CORS configuration
├── controller       # REST APIs
├── dto              # Request/Response objects
├── entity           # Event and Registration entities
├── model            # User, Role, Student, Faculty
├── repository       # JPA repositories
├── security         # JWT and filters
├── service          # Business logic
```

### Frontend (React)

```
src
│
├── components       # UI components
├── pages            # Application pages
├── services         # API calls
├── routes           # Routing configuration
├── layouts          # Dashboard layouts
```

---

## API Endpoints

### Authentication

* POST /auth/register
* POST /auth/login

### Events

* GET /api/events
* POST /api/events
* GET /api/events/my
* DELETE /api/events/{id}

### Registrations

* POST /api/registrations/{eventId}
* GET /api/registrations/my
* GET /api/registrations/event/{eventId}

---

## Installation and Setup

### Backend Setup

1. Navigate to backend folder
2. Configure database in application.properties
3. Run the application

```
mvn spring-boot:run
```

Backend runs on:

```
http://localhost:8082
```

---

### Frontend Setup

1. Navigate to frontend folder

```
pnpm install
pnpm dev
```

Frontend runs on:

```
http://localhost:5173
```

---

## Security

* JWT-based authentication
* Role-based authorization (ADMIN, FACULTY, STUDENT)
* Protected routes using Spring Security
* Token validation using custom filter

---

## Key Functional Flow

* User registers with role (Student or Faculty)
* User logs in and receives JWT token
* Token is stored in localStorage
* All API requests include Authorization header
* Backend validates token and grants access based on role

---

## Future Enhancements

* Email notifications for events
* Certificate generation
* Advanced analytics dashboard
* AI-based event recommendations
* Mobile application integration

---
