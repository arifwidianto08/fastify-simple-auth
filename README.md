# News & Topic Management

A simple CRUD app for news & topic management that runs on top of [Node.js](https://nodejs.org/en/) & [nx](https://nx.dev/).

## Table of content

- [News & Topic Management](#news--topic-management)
  - [Table of content](#table-of-content)
  - [Usage](#usage)
    - [Environment Variables](#environment-variables)
    - [Install all the dependencies](#install-all-the-dependencies)
    - [Running Development server](#running-development-server)
    - [Build the app](#build-the-app)
    - [Running Production App/Build Artifact](#running-production-app/build-artifact)
    - [Database Setup](#database-setup)
      - [Generating Prisma Client](#generating-prisma-client)
      - [Migrate the database](#migrate-the-database)
      - [Rollback the database](#rollback-the-database)
      - [Seed the database](#seed-the-database)
    - [Test the app](#test-the-app)
      - [Running e2e tests](#running-e2e-tests)
    - [API Documentation](#api-documentation)

## Usage

### Environment Variables

You can neither place the environment variables ( `.env` ) at the [root directory](https://github.com/arifwidianto08/news-topic-management) of the project or inside of the [api](/apps/api) folder

Here's the properties

| Name                 | Description                                                                                                                 | Required | Example                                                                      |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------- | -------- | ---------------------------------------------------------------------------- |
| `API_HOST`           | Your app hostname,                                                                                                          | ❌       | `localhost`                                                                  |
| `API_PORT`           | Your app port, if it's empty then your app should be running at the default `PORT` which is 9000                            | ❌       | 9000                                                                         |
| `DATABASE_URL`       | Specify the subprotocol (the database connectivity mechanism), the database or server identifier, and a list of properties. | ✅       | `postgresql://dev:emc2@localhost:5432/fastify?schema=public` ( PostgresSQL ) |
| `APP_JWT_SECRET`     | Your JSON Web Token. secret                                                                                                 | ✅       | KaNdRgUkXp2s5v8y/B?E(H+MbQeShVmYq3t6w9z$C&F)J@NcRfUjWnZr4u7x!A%D             |
| `RESET_PASSWORD_URL` | URL from your website for reset password. port.                                                                             | ✅       | `5432`                                                                       |
| `SENDGRID_API_KEY`   | SendGrid API Key for integrating the app with SendGrid SDK.                                                                 | ✅       | `postgres`                                                                   |
| `EMAIL_SENDER`       | Your SendGrid email sender password.                                                                                        | ✅       | `arifwidiantoworks@gmail.com`                                                |

Complete example of Environment Variables :

```
# General
NODE_ENV=development
LOG_LEVEL=debug

API_HOST=127.0.0.1
API_PORT=9000

# Auth
APP_JWT_SECRET=KaNdRgUkXp2s5v8y/B?E(H+MbQeShVmYq3t6w9z$C&F)J@NcRfUjWnZr4u7x!A%D
RESET_PASSWORD_URL=http://example.com/user/password/verify

# docker connection
# DATABASE_URL="postgresql://dev:emc2@host.docker.internal:5432/fastify?schema=public"

# local connection
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/simple-auth-task?schema=public"

# Email Configuration
SENDGRID_API_KEY=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
EMAIL_SENDER=arifwidiantoworks@gmail.com
```

### Install all the dependencies

With [yarn](https://yarnpkg.com/) install, run

```
$ yarn install
```

### Running Development server

To run the app in development server you can run

```
$ yarn dev
```

Once the app is started, you can navigate to http://localhost:9000/. The app will automatically reload if you change any of the source files.

### Build the app

To build the project, you can run

```
$ yarn build
```

The build artifacts will be stored in the `build/` directory.

### Running Production App/Build Artifact

To build the project, you can run

```
$ yarn start
```

Once the app is started, you can navigate to http://localhost:9000/.

### Database Setup

#### Generating Prisma Client

To generate the Prisma.io client, since Prisma Client is an auto-generated database client that's tailored to your database schema. By default, Prisma Client is generated into the node_modules/.prisma/client folder, but you can specify a custom location.

```
$ yarn db:generate
```

`Important`: You need to re-run the prisma generate command after every change that's made to your Prisma schema to update the generated Prisma Client code.

#### Migrate the database

To migrate the database ( setup all the tables, .etc ), you can run

```
$ yarn db:migrate
```

#### Seed the database

To seed all the tables that exists in the database, run
Run `yarn run seed`

```
$ yarn seed
```

I am using faker to generate all the random data that would be inserted on the data seed.

### Test the app

You can use the commands bellow in order to setup your test database and run the test script.

#### Running e2e tests

To execute the e2e tests via [Jest](https://jestjs.io), run

```
$ yarn test
```

To setup the environment for the test ( including the database rollback/reset, migration, and seeding ) and running the e2e tests via [Jest](https://jestjs.io), you can run this command instead

### API Documentation

Check the [News & Topic Management API Docs](https://documenter.getpostman.com/view/5050305/2s83zgsjG8)
