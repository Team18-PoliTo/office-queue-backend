# Office Queue Management System - Backend

Backend API for managing office queues, counters, and service types.

## Tech Stack

- **Node.js** with **Express.js**
- **SQLite** (will migrate to PostgreSQL later)
- **better-sqlite3** for database operations
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
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

## Current Sprint - Stories

This sprint includes:
1. **Get Ticket** - Customer requests ticket for a service
2. **Next Customer** - Officer calls next customer at counter

## Project Structure

```
src/
├── app.js                  # Express app setup
├── config/
│   └── database.js         # SQLite configuration
├── controllers/            # HTTP request handlers
│   ├── counterController.js
│   ├── serviceController.js
│   └── ticketController.js
├── entities/               # In-memory data structures
│   └── Ticket.js          # Ticket entity (no DB persistence yet)
├── middleware/             # Custom middleware
│   ├── authMiddleware.js  # user-type authorization
│   └── errorHandler.js    # Global error handling
├── models/                 # Database models
│   ├── Counter.js         # Counter DB operations
│   └── Service.js         # Service DB operations
├── routes/                 # API route definitions
│   ├── counterRoutes.js
│   ├── serviceRoutes.js
│   └── ticketRoutes.js
├── services/               # Business logic layer
│   ├── counterService.js
│   ├── queueService.js    # In-memory queue management
│   └── ticketService.js
└── utils/                  # Helper functions
    └── queueLogic.js      # Next ticket selection algorithm
```

## Authorization

All endpoints require a `user-type` header with one of these values:
- `customer` - Can request tickets
- `officer` - Can call next customer at counter

## Notes

- Tickets are stored **in-memory only** (no DB persistence in this sprint)
- Queues are going to be managed in-memory and reset daily
- Database stores only: Services and Counters
