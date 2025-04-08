# Kafka Producer/Consumer for User Activity Logs

This project implements an event-driven microservice using Node.js and Kafka for real-time processing of user activity logs. The logs are stored in a MongoDB database and exposed via RESTful APIs for querying. The service is containerized using Docker and deployed on a cloud hosting platform.

---

## Table of Contents

- [Overview](#overview)
- [Data Model](#data-model)
- [Kafka Configuration](#kafka-configuration)
- [Consumer and Producer Workflow](#consumer-and-producer-workflow)
- [API Endpoints](#api-endpoints)
- [Development and Deployment](#development-and-deployment)
- [Hosting and Access](#hosting-and-access)

---

## Overview

This project demonstrates how to process user activity logs in real-time using Kafka. The logs are validated and stored in a MongoDB database, and a RESTful API is provided to query the logs. The service is designed to handle financial activities such as sending money, receiving money, and balance inquiries.

![consumer/producer architecture](/consumer-producer%20arch.jpg)

---

## Data Model

The data model represents financial activities with the following types:

1. **Send Money**: A user sends money to another user.
2. **Receive Money**: A user receives money from another user.
3. **Balance Inquiry**: A user checks their account balance.

The schema is defined using `mongoose` to ensure data consistency and enforce validation and constraints.

---

## Kafka Configuration

- **Broker**: The Kafka setup uses a single broker for simplicity.
- **Topic**: The topic is named `transaction-activity`.
- **Partitioning**: A single partition is used for the topic.

The producer continuously generates activity logs (send, receive, or balance inquiry) and sends them to the Kafka topic at a predefined rate.

---

## Consumer and Producer Workflow

### Producer
- Generates random user activity logs.
- Sends logs to the Kafka topic `transaction-activity` queue at a predefined rate.

### Consumer
- Connects to a remote MongoDB Atlas database.
- Validates and stores the logs in the database.
- Ensures data consistency and applies constraints using the `mongoose` schema.

---

## API Endpoints

The stored logs can be accessed through the following RESTful API endpoints:

1. **GET `/user-logs/:id`**
   - Fetch a specific log by its ID.
   - Example:
     ```bash
     curl "http://localhost/user-logs/<valid-transaction-id>"
     ```

2. **GET `/user-logs`**
   - Fetch logs with optional filters and pagination.
   - Query Parameters:
     - `userId`: Filter by user ID.
     - `action`: Filter by action (`send`, `receive`, or `balance_inquiry`).
     - `page`: Page number (default: 1).
     - `limit`: Number of logs per page (default: 10).
   - Example:
     ```bash
     curl "http://localhost/user-logs?userId=user-1&action=send&page=1&limit=10"
     ```

---

## Development and Deployment

### Local Development
- **Docker Compose**: Used for local development to spin up Kafka, MongoDB, and the application.
- **Commands**:
  - Start services:
    ```bash
    docker-compose up
    ```
  - Run the producer:
    ```bash
    npm run producer
    ```
  - Run the consumer:
    ```bash
    npm run consumer
    ```
  - Start the API server:
    ```bash
    npm start
    ```

### Deployment
- **Docker Image**: The project is containerized, and the Docker image is pushed to a container registry.
- **Kubernetes**: The service can be deployed on Kubernetes for scalability and reliability.

---

## Hosting and Access

- **Cloud Hosting**: The project is hosted on [Railway](https://railway.app).
- **API Endpoint**: The API  accessibleis at:
[endpoint](https://transaction-activity-service-production.up.railway.app/)
