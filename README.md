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

To run the project on your local machine, issue the following commands at a terminal prompt.

```
npm start
```

Node Package Manager (NPM) runs the `start` script. This script starts the Express server and listens for requests on port `3001`.

> **NOTE:** The `start` script uses `nodemon` to watch the `/src` directory for changes to source files and restarts the application when source file changes are saved.

## Test

This project provides a REST API. You may test this API using an API client such as PostMan or by issuing `curl` commands at a terminal prompt.

The following sections provide examples of `curl` commands.

### Get all Greetings

To fetch all greetings, issue the following `curl` command at a terminal prompt.

```
curl http://localhost:3001/ [--verbose]
```

> **NOTE:** You may optionally include the `--verbose` option to view the complete details the call.

### Get a single Greeting by Identifier

To fetch a single greeting by its identifier, issue the following `curl` command at a terminal prompt.

```
curl http://localhost:3001/:id [--verbose]
```

Replace the `:id` portion of the URL with the `_id` attribute of the greeting you wish to fetch.

### Create a Greeting

To create a greeting, issue the following `curl` command at a terminal prompt.

```
curl --request POST \
     --header 'Content-Type: application/json' \
     --data '{"title": "Hello world!"}' \
     --verbose \
     http://localhost:3001/
```

### Update a Greeting

To update one or more attributes of a greeting, issue the following `curl` command at a terminal prompt.

```
curl --request PUT \
     --header 'Content-Type: application/json' \
     --data '{"title": "Hola Mundo!"}' \
     --verbose \
     http://localhost:3001/:id
```

Replace the `:id` portion of the URL with the `_id` attribute of the greeting you wish to update.

### Delete a Greeting

To delete a greeting, issue the following `curl` command at a terminal prompt.

```
curl --request DELETE \
     --verbose \
     http://localhost:3001/:id
```

Replace the `:id` portion of the URL with the `_id_ attribute of thegreeting you wish todelete.
