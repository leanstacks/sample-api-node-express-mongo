# Example: REST API using Node.js, Express, and MongoDB

Example REST API using Node, Express, and MongoDB

## Install

### Project Pre-requisites

The project has the following pre-requisites which must be in place prior to installation of the project libraries.

1. [Node Version Manager](https://github.com/nvm-sh/nvm)

### Install the Dependencies

To install the project dependencies, issue the following commands at a terminal prompt.

```
nvm use

npm install
```

## Run

### Local Development

To run the project on your local machine, issue the following commands at a terminal prompt.

```
npm start
```

Node Package Manager (NPM) runs the `start` script. This script starts the Express server and listens for requests on port `3001`.

> **NOTE:** The `start` script uses `nodemon` to watch the `/src` directory for changes to source files and restarts the application when source file changes are saved.

## Test

This project provides a REST API. You may test this API using an API client such as PostMan or by issuing `curl` commands at a terminal prompt.

The following sections provide examples of `curl` commands.

### Get all Todos

To fetch all todos, issue the following `curl` command at a terminal prompt.

```
curl http://localhost:3001/v1/todos [--verbose]
```

> **NOTE:** You may optionally include the `--verbose` option to view the complete details the call.

### Get a single Todo by Identifier

To fetch a single todo by its identifier, issue the following `curl` command at a terminal prompt.

```
curl http://localhost:3001/v1/todos/:id [--verbose]
```

Replace the `:id` portion of the URL with the `_id` attribute of the todo you wish to fetch.

### Create a Todo

To create a todo, issue the following `curl` command at a terminal prompt.

```
curl --request POST \
     --header 'Content-Type: application/json' \
     --data '{"title": "Buy groceries", "isComplete": false}' \
     --verbose \
     http://localhost:3001/v1/todos
```

### Update a Todo

To update one or more attributes of a todo, issue the following `curl` command at a terminal prompt.

```
curl --request PUT \
     --header 'Content-Type: application/json' \
     --data '{"isComplete": true}' \
     --verbose \
     http://localhost:3001/v1/todos/:id
```

Replace the `:id` portion of the URL with the `_id` attribute of the todo you wish to update.

### Delete a Todo

To delete a todo, issue the following `curl` command at a terminal prompt.

```
curl --request DELETE \
     --verbose \
     http://localhost:3001/v1/todos/:id
```

Replace the `:id` portion of the URL with the `_id_ attribute of the todo you wish todelete.

### Server Health

To assess if the server is processing requests, use the health check endpoint at path: `/health`.

To test this endpoint, issue the following `curl` command at a terminal prompt.

```
curl http://localhost:3001/health [--verbose]
```

| Status Code | Description                 |
| ----------- | --------------------------- |
| 200         | Service is healthy.         |
| 4xx or 5xx  | Service is **not** healthy. |

If running the server in a load balanced cluster, this endpoint should be used to determine the node's availability.

## Docker

> **NOTE:** To use Docker with this project you must have [Docker installed](https://docs.docker.com/get-docker/) on the machine where Docker commands will be executed, e.g. your local machine and/or a CI/CD pipeline.

This application may be packaged and run as a Docker container.

### Building the Docker Image

To build the Docker image, issue the following command at a terminal prompt.

```
npm run docker:build
```

This command builds a Docker container image named `leanstacks/todo-api` with the tag `latest`.

### Running the Docker Container

To run the application with Docker, first build the Docker image following the instructions in the section above.

After creating the Docker image, issue the following command at a terminal prompt to start a new running container using that image.

```
npm run docker:run

OR WITH DOCKER...

docker container run --publish 3001:3001 leanstacks/todo-api
```

The command above starts a new Docker container in the foreground (i.e. it is **not** detached). This is fine for local development when you may wish to have the application logs printed to the console; however, it should not be used in production.

To run the container in the background (i.e. detached), issue the following command at a terminal prompt.

```
npm run docker:run:detached

OR WITH DOCKER...

docker container run --publish 3001:3001 --detached leanstacks/todo-api
```

### Manage Docker Containers

To list running Docker containers on the machine, issue the following command at a terminal prompt.

```
docker container ls
```

To view **ALL** containers regardless of their status, issue the following command at a terminal prompt.

```
docker container ls --all
```

> **NOTE:** The container list provides the container name such as `sleepy_willow`, etc. The container name is used in some container management commands illustrated below.

To stop a running container, issue the following command at a terminal prompt.

```
docker container stop [CONTAINER]
```

To start a stopped container, issue the following command at a terminal prompt.

```
docker container start [CONTAINER]
```

To remove a stopped container, issue the following command at a terminal prompt.

```
docker container rm [CONTAINER]
```

To remove **ALL** stopped containers, issue the following command at a terminal prompt.

```
docker container prune
```

## Related Information

[Docker Install Guide](https://docs.docker.com/get-docker/)  
[Docker CLI Reference](https://docs.docker.com/engine/reference/commandline/docker/)
