# Project Setup and Usage Guide

## Getting Started

Follow these steps to clone, set up, build, and run the project with Docker:

### 1. Clone the repository

```bash
git clone <your-repo-url>
```

### 2. Navigate to the backend directory

```bash
cd backend
```

### 3. Install dependencies

```bash
npm install
```

### 4. Create and fill .env and .env-db files

Create two files .env and .env-db in the backend directory and add your environment variables accordingly to
.env-example and .env-db-example files

### 5. Build and start the Docker container

```bash
docker-compose up --build
```

## Restoring the Database

To restore the MongoDB database from a dump archive, follow these steps:

### 1. Go to the dumpDB directory

```bash
cd dumpDB
```

### 2. Run the restore command

Make sure to replace 207cfa815487, myuser, and mypassword with your container ID/name and MongoDB credentials.

```bash
docker exec -i 207cfa815487 mongorestore --archive --username=<myuser> --password=<mypassword> --authenticationDatabase=admin < dump.archive
```

### 3. Rebuild and restart Docker containers

```bash
docker-compose up --build
```
