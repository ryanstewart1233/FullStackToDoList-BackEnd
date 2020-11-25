This is the custom back end RESTful APi I built for my React/Redux TodoList project.

The back end uses node.js and express to create the server.
It then links up with a mongoDB either in the cloud or on local machine, both work correctly.

I used mongoose to connect with the database and to create all the schemas.

This backend handles get/post/patch/delete requests to two end points lists and todos and is always specific to the user that is using the app.