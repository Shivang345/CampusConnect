# Docker Setup Guide

This guide explains how to build and run the CampusConnect application using Docker.

## Prerequisites

- Docker installed on your system
- Docker Compose installed (usually comes with Docker Desktop)

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Backend Environment Variables
PORT=4000
MONGO_URI=mongodb://mongo:27017/campusconnect
CLIENT_ORIGIN=http://localhost:3000

# JWT Secret (if needed)
# JWT_SECRET=your-secret-key-here

# Redis (if needed)
# REDIS_URL=redis://redis:6379
```

**Note:** The `MONGO_URI` uses `mongo` as the hostname, which is the Docker service name. This allows the backend to connect to MongoDB within the Docker network.

## Building and Running

### Build and Start All Services

```bash
docker-compose up --build
```

This command will:
- Build the backend and frontend Docker images
- Start MongoDB, backend, and frontend services
- Create a persistent volume for MongoDB data

### Run in Detached Mode (Background)

```bash
docker-compose up -d --build
```

### Stop All Services

```bash
docker-compose down
```

### Stop and Remove Volumes (⚠️ This will delete MongoDB data)

```bash
docker-compose down -v
```

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongo
```

### Rebuild Specific Service

```bash
docker-compose build backend
docker-compose build frontend
```

## Accessing the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:4000
- **MongoDB:** localhost:27017 (if you need to connect directly)

## Docker Services

The application consists of three services:

1. **mongo** - MongoDB database (port 27017)
2. **backend** - Node.js Express API (port 4000)
3. **frontend** - React app served by Nginx (port 3000)

All services are connected via a Docker bridge network (`campusconnect-network`), allowing them to communicate using service names.

## Data Persistence

MongoDB data is persisted in a Docker volume named `mongo_data`. This ensures your data survives container restarts and removals (unless you use `docker-compose down -v`).

## Troubleshooting

### Port Already in Use

If you get an error about ports being in use, you can:
1. Stop the service using the port
2. Change the port mapping in `docker-compose.yml`

### Rebuild After Code Changes

After making code changes, rebuild the affected service:

```bash
docker-compose up --build backend
docker-compose up --build frontend
```

### Check Service Status

```bash
docker-compose ps
```

### Access Container Shell

```bash
# Backend container
docker exec -it campusconnect-backend sh

# Frontend container
docker exec -it campusconnect-frontend sh

# MongoDB container
docker exec -it campusconnect-mongo sh
```

