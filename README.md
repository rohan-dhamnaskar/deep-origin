# Deep Origin URL Shortener

A full-stack URL shortening application built with React, Node.js, PostgreSQL, and Redis.

## Getting Started

This application is containerized using Docker for easy setup and deployment.

### Prerequisites

- [Docker](https://www.docker.com/products/docker-desktop/)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Running the Application

1. Clone this repository:
   ```
   git clone https://github.com/rohan-dhamnaskar/deep-origin.git
   cd deep-origin
   ```

2. Start the application stack:
   ```
   docker compose up
   ```

3. Access the applications:
   - Frontend: http://localhost:3001
   - Backend API: http://localhost:3000

### Development

To rebuild containers after making changes:
```
docker compose up --build
```

To run in detached mode:
```
docker compose up -d
```

To stop the services:
```
docker compose down
```

## API Documentation

The backend provides the following API endpoints:

### URL Shortener API

#### Shorten a URL
- **URL**: `/shorten`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "url": "https://example.com/some/long/url"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "shortCodeRecord": {
      "id": "uuid",
      "original_url": "https://example.com/some/long/url",
      "short_code": "abc123",
      "created_at": "2025-01-01T00:00:00Z",
      "visits": 0
    }
  }
  ```
- **Status Codes**:
  - `200 OK`: URL successfully shortened
  - `500 Internal Server Error`: Server error

#### Get Original URL from Short Code
- **URL**: `/shorten/{shortCode}`
- **Method**: `GET`
- **URL Parameters**:
  - `shortCode`: The generated short code for the URL
- **Response**:
  ```json
  {
    "success": true,
    "originalUrl": {
      "id": "uuid",
      "original_url": "https://example.com/some/long/url",
      "short_code": "abc123",
      "created_at": "2025-01-01T00:00:00Z",
      "visits": 1
    }
  }
  ```
- **Status Codes**:
  - `200 OK`: URL found
  - `404 Not Found`: Short code not found
  - `500 Internal Server Error`: Server error

#### Get All Shortened URLs
- **URL**: `/shorten`
- **Method**: `GET`
- **Response**:
  ```json
  {
    "success": true,
    "allUrls": [
      {
        "id": "uuid",
        "original_url": "https://example.com/some/long/url",
        "short_code": "abc123",
        "created_at": "2025-01-01T00:00:00Z",
        "visits": 1
      },
      {
        "id": "uuid2",
        "original_url": "https://anotherexample.com",
        "short_code": "def456",
        "created_at": "2025-01-02T00:00:00Z",
        "visits": 3
      }
    ]
  }
  ```
- **Status Codes**:
  - `200 OK`: URLs fetched successfully
  - `400 Bad Request`: No URLs found
  - `500 Internal Server Error`: Server error

## Completed Features

✅ Build a React application that allows you to enter a URL  
✅ When the form is submitted, return a shortened version of the URL  
✅ Save a record of the shortened URL to a database  
✅ Ensure the slug of the URL (abc123 in the screenshot) is unique  
✅ When the shortened URL is accessed, redirect to the stored URL  
✅ If an invalid slug is accessed, display a 404 Not Found page  
✅ List of all URLs saved in the database  
✅ Validate the URL provided is an actual URL  
✅ Display an error message if invalid  
✅ Make it easy to copy the shortened URL to the clipboard  
✅ Track visits to the shortened URL  
✅ Build a Docker image of the application  

## Architecture

The application consists of:

- **Frontend**: Next.js React application
- **Backend**: Node.js with Hapi.js
- **Databases**:
  - PostgreSQL: Primary data store for URL records
  - Redis: Caching layer for fast URL lookups

## Tech Stack

- **Frontend**: React, Next.js, TypeScript, Tailwind CSS
- **Backend**: Node.js, Hapi.js, TypeScript
- **Database**: PostgreSQL, Redis
- **Containerization**: Docker, Docker Compose


