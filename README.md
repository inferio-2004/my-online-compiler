# Online Compiler

This project is an online compiler that allows users to compile and run code in various programming languages.<br> 
It provides two modes of operation: one for local execution and another using Docker for an isolated environment.

https://github.com/user-attachments/assets/bc118ff0-661e-4bd1-be5e-cb2e103a8d6c

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

Prerequisites<br>
1.Install Docker with WSL 2 support.<br>
Follow the official Docker installation guide to install Docker Desktop with WSL 2 integration on Windows.
2.install wsl 2 as  well<br>

Steps to Run<br>
1.Make sure Docker is installed and running.<br>
2.Build the Docker image for the compiler environment:

```bash
docker build -t my-online-compiler .
```
Once the image is built, you can run the backend using the index1.js file:

```bash
node index1.js
```
This will execute the code inside the Docker container, ensuring it runs in a controlled environment.

How to Use
Clone the repository.
Install necessary dependencies using:

```bash
npm install
```

Depending on your setup:
For local execution, use index.js.
For Docker-based execution, install Docker, build the Docker image, and use index1.js.
