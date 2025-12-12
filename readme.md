# 🚗 Vehicle Rental System

## 🎯 Project Overview

A backend API for a vehicle rental management system that handles:
- **Vehicles** - Manage vehicle inventory with availability tracking
- **Customers** - Manage customer accounts and profiles
- **Bookings** - Handle vehicle rentals, returns and cost calculation
- **Authentication** - Secure role-based access control (Admin and Customer roles)

Live link: [Vehicle rental system](https://vehicle-rental-system-opal-alpha.vercel.app/)

---

## 🛠️ Technology Stack

- **Node.js** + **TypeScript**
- **Express.js** (web framework)
- **PostgreSQL** (database)
- **bcrypt** (password hashing)
- **jsonwebtoken** (JWT authentication)

---

## 🔐 Authentication & Authorization
When put token in postman select Auth -> Auth type -> Bearer token

### User Roles
- **Admin** - Full system access to manage vehicles, users and all bookings
- **Customer** - Can register, view vehicles, create/manage own bookings

---

### Authentication
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/v1/auth/signup` | Public | for signup, uniqe email, role- costomer or admin, put every value name, email - uniqe, password, phone, role |
| POST | `/api/v1/auth/signin` | Public | for signin, put email and password must,Login and receive JWT token |

---

### Vehicles
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/v1/vehicles` | Admin only | for create vehicle put every value vehicle_name, type, registration_number - uniqe, daily_rent_price, availability_status |
| GET | `/api/v1/vehicles` | Public | for get all vehicles for public |
| GET | `/api/v1/vehicles/:vehicleId` | Public | for get single vehicle for public |
| PUT | `/api/v1/vehicles/:vehicleId` | Admin only | for update single vehicle for admin only, put all value vehicle_name, type, registration_number - uniqe, daily_rent_price, availability_status |
| DELETE | `/api/v1/vehicles/:vehicleId` | Admin only | Delete vehicle (only if no active bookings exist) |

---

### Users
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/v1/users` | Admin only | get all users in the system |
| PUT | `/api/v1/users/:userId` | Admin or Own | for update users, admin can update users role also details, customer can update own profile not his own role, admin can change users role customer to admin when admin change costomer role to admin, customer need to login agin for get new token, for access full system |
| DELETE | `/api/v1/users/:userId` | Admin only | for delete user, for admin only but if customer have active booking admin can not delete this user |

---

### Bookings
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/v1/bookings` | Customer or Admin | for create booking, for customer or admin. When you create a booking you must put token customer_id in request body. |
| GET | `/api/v1/bookings` | Role-based | for Get all bookings, Role-based (Admin sees all, Customer sees own) |
| PUT | `/api/v1/bookings/:bookingId` | Role-based | For change status in bookings, admin can change any customers booking status acative to returned. For change status in bookings, if change active to cancel then same time update vehicle status booked to available. when you update bookings status you must put valid token, which one create bookings. |