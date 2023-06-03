# How to Run

To run without a docker container simply run the commands:
```shell
npm install
npm run start
```

To run the Docker container for the "event-services" application, follow the steps below:

## Prerequisites

Make sure you have Docker installed on your machine. You can download and install Docker Desktop for Windows or macOS from the official Docker website. For Linux, follow the instructions specific to your distribution.

## Building the Docker Image

Open your terminal or command prompt and navigate to the directory where the Dockerfile is located. Then, execute the following command to build the Docker image:

```shell
docker build . -t event-services
```

This command uses the `docker build` command to build an image based on the Dockerfile in the current directory. The `-t` flag assigns a tag (in this case, "event-services") to the image, making it easier to reference later.

## Running the Docker Container

Ensure that the Docker daemon is running. On Docker Desktop for Windows or macOS, you should see the Docker icon in your system tray or menu bar. For Linux, make sure the Docker service is running.

To start the Docker container, run the following command:

```shell
docker run -d -p 3000:3000 event-services
```

This command uses the `docker run` command to create and start a container based on the "event-services" image. The `-d` flag runs the container in detached mode, meaning it runs in the background. The `-p` flag maps port 3000 from the container to port 3000 on your host machine, allowing you to access the application.

Once the container is running, you can access the "event-services" application by opening a web browser and navigating to `http://localhost:3000`.

The "event-services" Docker image provides an API/microservice for managing events. It exposes various API endpoints for creating, updating, deleting, and retrieving events.

## Stopping the Docker Container

To stop the Docker container running the "event-services" application, you can use the following command:

```shell
docker stop <container-id>
```

Replace `<container-id>` with the ID or name of the running container. You can find the container ID or name by running the `docker ps` command and locating the corresponding container.

That's it! You have successfully built, run, and managed the Docker container for the "event-services" application.
