# Office Queue Management System - Backend

Backend API for managing office queues, counters, and service types.

## Tech Stack

- **TypeScript** with **Node.js**
- **Express.js** framework
- **sqlite3** for database operations
- In-memory queues for real-time queue management

## Installation

```bash
npm install
```

## Setup

Create a `.env` file based on `.env.example`

```bash
cp .env.example .env
```

## Run

```bash
# Development mode (with auto-restart and TypeScript support)
npm run dev

# Build TypeScript to JavaScript
npm run build

# Production mode (requires build first)
npm start
```

## Current Sprint - Stories

This sprint includes:
1. **Get Ticket** - Customer requests ticket for a service
2. **Next Customer** - Officer calls next customer at counter

## Architecture

This project follows a **layered architecture** pattern:

```
Controller → Service → Repository → DAO → Database
```

### Layer Responsibilities:

- **Controller**: HTTP request/response handling
- **Service**: Business logic and orchestration
- **Repository**: Abstraction layer for data access
- **DAO**: Direct database operations (SQL queries)
- **Database**: SQLite connection and configuration

## Project Structure

```
src/
├── app.ts                  # Express app setup
├── config/
│   └── database.ts         # Database configuration
├── controllers/            # HTTP request handlers
│   ├── counterController.ts
│   ├── serviceController.ts
│   └── ticketController.ts
├── entities/               # In-memory data structures
│   └── Ticket.ts          # Ticket entity (no DB persistence yet)
├── repositories/           # Data access abstraction layer
│   ├── CounterRepository.ts
│   └── ServiceRepository.ts
├── daos/                   # Database access objects
│   ├── CounterDAO.ts      # Direct SQL for counters
│   └── ServiceDAO.ts      # Direct SQL for services
├── middleware/             # Custom middleware
│   ├── authMiddleware.ts  # user-type authorization
│   └── errorHandler.ts    # Global error handling
├── routes/                 # API route definitions
│   ├── counterRoutes.ts
│   ├── serviceRoutes.ts
│   └── ticketRoutes.ts
├── services/               # Business logic layer
│   ├── counterService.ts
│   ├── queueService.ts    # In-memory queue management
│   └── ticketService.ts
└── utils/                  # Helper functions
    └── queueLogic.ts      # Next ticket selection algorithm
```

## Authorization

All endpoints require a `user-type` header with one of these values:
- `customer` - Can request tickets
- `officer` - Can call next customer at counter
- `manager` - Can view/manage services and counters

## TypeScript Configuration

The project uses strict TypeScript configuration:
- Target: ES2020
- Module: CommonJS
- Strict mode enabled
- Output directory: `dist/`

## Notes

- Tickets are stored **in-memory only** (no DB persistence in this sprint)
- Queues are going to be managed in-memory and reset daily
- Database stores only: Services and Counters
- TypeScript files are compiled to `dist/` folder (git ignored)
