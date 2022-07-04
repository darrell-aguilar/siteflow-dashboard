# HP Siteflow Dashboard

This project was created using Create-React-App

## Purpose of Project

The purpose of this project is to be able to dynamically view, search and filter data from HP Siteflow such as printers and users by communicating with its REST API
The API for HP Siteflow is this endpoint: [HP Siteflow](https://pro-api.oneflowcloud.com/api)

## Configuration requirements

A .env file has to be created with the following information added:

1. Secret
2. Token
3. Site Names

The secret and token should use the following naming convention:

```
SF_SiteName_SECRET
SF_SiteName_TOKEN
```

If multiple sites will be needed, create multipl Secret and Token variables with the relevant site name added onto it

Site Names should be concattenated in a string separated by spaces and saved with the Variable

`REACT_APP_SITES`

Example .env config if site names are 'Site1' and 'Site2'
```
SF_Site1_SECRET='add secret here'
SF_Site2_TOKEN='add token here'
SF_Site1_SECRET='add secret here'
SF_Site2_TOKEN='add token here'
REACT_APP_SITES='Site1 Site2'
```

## Run in dev

In the project directory, you can run:

`npm run start` & `npm run react` to run separate instances of React and Express

using [Concurrently](https://www.npmjs.com/package/concurrently), you can run

`npm run dev`

and access it from [localhost:3000](http://localhost:3000)

## Build and run

To build and run the app, run the following commands in order:

```
npm run build
npm run start
```

and access from [localhost:5000](http://localhost:5000) to which links to the Express backend server

## Run in docker

A custom docker image has also been created for this application. To create the docker image run 

```
docker build -t *docker_image_name* .
```

Once this has been created, run a docker container using
```
docker run -d -p 5000:5000 --name *docker_container_name* *docker_image_name*
```

This can now be accessed from [localhost:5000](http://localhost:5000)