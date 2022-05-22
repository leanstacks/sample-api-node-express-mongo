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

```bash
# start the application
npm start

# or to start forcing in-memory database
MONGO_INMEMORY=true npm start
```

Node Package Manager (NPM) runs the `start` script. This script starts the Express server and listens for requests on port `3001`.

> **NOTE:** The `start` script uses `nodemon` to watch the `/src` directory for changes to source files and restarts the application when source file changes are saved.

## Test

This project provides a REST API. You may test this API using an API client such as PostMan or by issuing `curl` commands at a terminal prompt.

The following sections provide examples of `curl` commands.

### Get all Todos

To fetch all todos, issue the following `curl` command at a terminal prompt.

```
curl [--verbose] http://localhost:3001/v1/todos
```

> **NOTE:** You may optionally include the `--verbose` option to view the complete details the call.

### Get a single Todo by Identifier

To fetch a single todo by its identifier, issue the following `curl` command at a terminal prompt.

```
curl [--verbose] http://localhost:3001/v1/todos/:id
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
curl [--verbose] http://localhost:3001/health
```

| Status Code | Description                 |
| ----------- | --------------------------- |
| 200         | Service is healthy.         |
| 4xx or 5xx  | Service is **not** healthy. |

If running the server in a load balanced cluster, this endpoint should be used to determine the node's availability.

### Server Status

To perform a deeper assessment of the server status including downstream dependencies, use the status endpoint at path: `/status`.

To perform a status check, issue the following `curl` command at a terminal prompt.

```
curl [--verbose] http://localhost:3001/status
```

> **NOTE:** Do **not** use the status check to assess if the server is up, i.e. from a load balancer. The status check consumes more server resources than the health check.

## Docker

> **NOTE:** To use Docker with this project you must have [Docker installed](https://docs.docker.com/get-docker/) on the machine where Docker commands will be executed, e.g. your local machine and/or a CI/CD pipeline.

This application may be packaged and run as a Docker container. Or you may run the application **and** MongoDB with Docker Compose, see the section further below.

### Building the Docker Image

To build the Docker image, issue the following commands at a terminal prompt.

```bash
# build the application
npm run build

# build the docker image
npm run docker:build
```

This command builds a Docker container image named `leanstacks/todo-api` with the tag `latest`.

### Running the Docker Container

To run the application with Docker, first build the Docker image following the instructions in the section above.

After creating the Docker image, issue the following command at a terminal prompt to start a new running container using that image.

```bash
# via npm scripts
npm run docker:run

# with docker
docker container run --publish 3001:3001 leanstacks/todo-api
```

The command above starts a new Docker container in the foreground (i.e. it is **not** detached). This is fine for local development when you may wish to have the application logs printed to the console; however, it should not be used in production.

To run the container in the background (i.e. detached), issue the following command at a terminal prompt.

```bash
# via npm scripts
npm run docker:run:detached

# with docker
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

## Docker Compose

This project is Docker Compose ready. Use Docker Compose to run the project **and** MongoDB on your local machine without needing to install the database.

> **NOTE:** Requires that you have Docker and Docker Compose installed.

### Start the Application

To start the application, issue the following command at a terminal prompt.

```bash
# if building a new image with --build, first build the application
npm run build

# start the environment
docker compose up [--build] --detach
```

Include the `--build` option and Docker will rebuild the application Docker image using the latest code, using that image when running the application.

### Stop the Application

To stop the application, issue the following command at a terminal prompt.

```
docker compose down
```

This command stops and removes the containers and cleans up ephemeral resources.

### View Logs

To view the logs from running compose application, issue the following command at a terminal prompt.

```
docker compose logs --follow
```

Press `ctrl-C` to return to the command prompt.

## Configuration Guide

This section provides detailed information regarding the configuration of this component.

### Variable Expansion

Variable expansion is supported. This means that the value of a configuration variable may include a reference to a previously defined variable. For example...

```
FOO=foo             // foo
BAR=bar             // bar
FOOBAR=${FOO}${BAR} // foobar
```

## Configuration Values

| name                         | default                                  | description                                                           |
| ---------------------------- | ---------------------------------------- | --------------------------------------------------------------------- |
| JWT_AUDIENCE                 |                                          | The JWT audience attribute value.                                     |
| JWT_ACCESS_TOKEN_EXPIRES_IN  | `1h`                                     | The JWT duration an access token is valid.                            |
| JWT_ISSUER                   |                                          | The JWT issuer attribute value.                                       |
| JWT_REFRESH_TOKEN_EXPIRES_IN | `24h`                                    | The JWT duration a refresh token is valid.                            |
| JWT_SECRET                   |                                          | The JWT signing secret value.                                         |
| MONGO_DBNAME                 | `todo_db`                                | The MongoDB database name.                                            |
| MONGO_INMEMORY               | `false`                                  | Use an in-memory MongoDB instance.                                    |
| MONGO_URL                    | `mongodb://username:password@host:27017` | The connection URL for MongoDB. Optional if `MONGO_INMEMORY` is true. |
| NODE_ENV                     | `development`                            | The environment type. One of: `development`, `test`, `production`     |
| SERVER_PORT                  | `3001`                                   | The port on which the application listens for requests.               |
| SERVER_HOST                  | `localhost`                              | The hostname (or DNS name) on which the server is hosted.             |
| SERVER_BASEURL               | `http://${SERVER_PORT}:${SERVER_PORT}`   | The base URL of the application.                                      |

## Related Information

[Docker Install Guide](https://docs.docker.com/get-docker/)  
[Docker CLI Reference](https://docs.docker.com/engine/reference/commandline/docker/)  
[Docker Compose][dockercompose]

[dockercompose]: https://docs.docker.com/compose/ 'Docker Compose'
