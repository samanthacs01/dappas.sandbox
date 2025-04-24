# Getting Started

Welcome to the project! This guide will help you set up and run the project locally using Nx.

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Node.js](https://nodejs.org/) (for Nx)
- [Nx CLI](https://nx.dev/getting-started/intro) (optional but recommended)
- [Golang](https://golang.org/doc/install)
- [Swag](https://github.com/swaggo/swag) (for the backend, use version v1.8.12)

## Installation

1. **Install Nx CLI (optional)**:

   ```sh
   npm ci
   ```

2. **Build and run the API**:

   ```sh
   nx run pulse-api:serve
   ```

3. **Watching changes on the API**:
   ```sh
   nx run pulse-api:watch
   ```
   This command will build the Docker image and start the application in development mode with live reloading.

## Running the Application

Once the Docker containers are up and running, the application will be accessible at `http://localhost:8080`.

## Development

To make changes to the code, simply edit the files in your local repository. The application will automatically reload to reflect the changes.

### Using Nx

Nx provides powerful tools for managing your monorepo. Here are some useful commands:

- **Run a specific project**:

  ```sh
  nx serve pulse-api
  ```

- **Build a specific project**:

  ```sh
  nx build pulse-api
  ```

- **Run tests for a specific project**:
  ```sh
  nx test pulse-api
  ```
- **Run tests coverage for a specific project**:
  ```sh
  nx test-cover pulse-api
  ```
- **Run lint to a specific project**:
  ```sh
  nx lint pulse-api
  ```
- **Run format to a specific project**:
  ```sh
  nx format pulse-api
  ```
- **Run tidy to a specific project**:
  ```sh
  nx tidy pulse-api
  ```
- **Run download dependencies of API**:
  ```sh
  nx download pulse-api
  ```

# Docs

## Backend

The backend documentation is available at `http://localhost:8080/swagger/index.html`.

## Generate swagger

To generate docs after add new endpoints with godocs definition run

    ```sh
    nx run pulse-api:gendocs
    ```
