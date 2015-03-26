# Microdatabase for beginners
This repository contains the pre-project for my GSoC '15 proposal under Pencil Code. The project is aimed at making it easier for teachers to teach the concept of databases and information management and providing uncomplicated platform for teachers and students to contribute data. The project is live at http://vps.rkravi.com:3000/.

## Details
The project presents a straightforward UI to perform CRUD operations on a microdatabase. The authetication is done through secret tokens.

## Usage
### Generating a token
Click on `Don't have a secret token? Click here to generate one!` option and enter your name to generate a secret token.

### Creating a database
Enter the name of a microdatabase(file) you want to create and press `Create`. 
You can leave the second input blank.

### Reading a database
Enter the name of the microdatabase to read. A default value `val = 40` is entered in the databases while creation.

For executing a dojox json query, enter it in the second input along with the file name. Leaving the second input blank will read the whole file

### Updating
Enter the name of the microdatabase to be updated in the first input and enter the new values separated by an `&` in the second input. Values in the query which do not exist will already be created.

For example, entering the update query `val=70&name=rishabh` will update the value of `val` to `70` and create a new key `name` with the value `rishabh`

### Deleting
Enter the name of the microdatabase to be deleted. You can leave the second input empty.

If you face any difficulty, feel free to open an issue.

## Technicalities
1. The application is an [Express](http://expressjs.com/) app
2. [Handlebars](http://handlebarsjs.com/) is used for views
3. [jsonql](https://github.com/PencilCode/jsonql) is used to implement dojox json query.
4. [jwt](https://github.com/auth0/express-jwt) is used for token generation and authorization.

## Setting Up
1. Clone the repository
2. Run `npm install`
3. Run `node index.js`
4. The application would be running on `localhost:3000`

## Features to be implemented
1. Add API documentation
2. Handle form submission on enter (which doesn't work currently) through JavaScript.
3. Add passwords for authentication
4. Protect against vulnerabilities


