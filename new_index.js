const ToDoSchema = require('./mongoConfig')
const mongoose = require('mongoose')
require('dotenv').config()

const express = require("express");
const cors = require("cors") //handy package to prevent access errors when attempting to create/delete etc
const bodyParser = require("body-parser");

const PORT = process.env.PORT || 3001;

const app = express();

app.use(cors())
app.use(bodyParser.urlencoded({
    extended: true
}));

// mongoose.connect(`mongodb+srv://Admin-RyanS:${process.env.MONGO_CLOUD_PASSWORD}@todotogether.acizm.mongodb.net/todotogether?retryWrites=true&w=majority`, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// }) //this one connects to online

mongoose.connect("mongodb://localhost:27017/toDoTogetherDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    //shows that we're connected to MongoDB.
    console.log("Connected")
});


function getDate() {
    let date = new Date().toLocaleString("en-UK")
    return date
}

const Todo = new ToDo({
    user_id: "123456",
    content: "To perfect this app.. mwhahahah",
    updated_at: getDate()

})

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
