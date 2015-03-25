# Microdatabase for beginners
This repository contains the pre-project for my GSoC '15 proposal under Pencil Code. The project is aimed at making it easier for teachers to teach the concept of databases and information management and providing uncomplicated platform for teachers and students to contribute data.

## Details
The project presents a straightforward UI to perform CRUD operations on a microdatabase. The authetication is done through secret tokens.

## Technicalities
1. The application is an [Express](http://expressjs.com/) app
2. [Handlebars](http://handlebarsjs.com/) is used for views
3. [jsonql](https://github.com/PencilCode/jsonql) is used to implement dojox json query.
4. [jwt](https://github.com/auth0/express-jwt) is used for token generation and authorization.

## Usage
1. Clone the repository
2. Run `npm install`
3. Run `node index.js`
4. The application would be running on `localhost:3000`

## Features to be implemented
1. Add API documentation
2. Add passwords for authentication
3. Protect against vulnerabilities


