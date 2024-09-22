# My Online Compiler

This project allows you to compile and run code either locally or inside a Docker container.

## Files Overview

- **index.js**: This file is used to compile and run code directly on the local machine without Docker(windows os only).
- **index1.js**: This file compiles and runs code inside a Docker container, providing a consistent and isolated environment.

## Running Locally

To compile and run code locally, use the `index.js` file. This will execute the code directly on your machine.

```bash
node index.js
```

Running with Docker

To compile and run code using Docker, follow these steps:

Prerequisites
1.Install Docker with WSL 2 support.
2.install wsl 2 as  well
Follow the official Docker installation guide to install Docker Desktop with WSL 2 integration on Windows.
  Steps to Run
  1.Make sure Docker is installed and running.
  2.Build the Docker image for the compiler environment:
bash
```
docker build -t my-online-compiler .
Once the image is built, you can run the backend using the index1.js file:
```
```
bash
node index1.js
```
This will execute the code inside the Docker container, ensuring it runs in a controlled environment.

How to Use
Clone the repository.
Install necessary dependencies using:

```
bash
npm install
```

Depending on your setup:
For local execution, use index.js.
For Docker-based execution, install Docker, build the Docker image, and use index1.js.
