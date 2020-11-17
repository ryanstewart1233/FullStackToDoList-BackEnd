const ToDoSchema = require('./mongoConfig')
const mongoose = require('mongoose')
require('dotenv').config()

const express = require("express");
const cors = require("cors") //handy package to prevent acces errors when attempting to create/delete etc
const bodyParser = require("body-parser");

const PORT = process.env.PORT || 3001;

const app = express();

app.use(cors())
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.json());

//this seems to be needed to allow access
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});


const ToDo = mongoose.model("Todo", ToDoSchema)

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
    //shows that we're connected to online MongoDB.
    console.log("Connected")
});

function getDate() {
    let date = new Date().toLocaleString("en-UK")
    return date
}

const newTodo = new ToDo({
    user_id: "123456",
    content: "To perfect this app.. mwhahahah",
    completed: false,
    updated_at: getDate()

})

// newTodo.save()


//todo -- app.post, app.put, app.patch, app.delete

//REST API calls for all ToDos
app.route("/todos/:user_id")
    .get(function (req, res) { //gets back all ToDo items for a given userId
        ToDo.find({ user_id: req.params.user_id }, function (err, results) {
            if (err) {
                res.send(err)
            } else {
                console.log("Sent the results of find all for certain userId", req.params.user_id);
                res.send(results)
            }
        })
    })
    .post(function (req, res) { //creates a new toDoItem
        const newToDo = new ToDo({
            user_id: req.params.user_id,
            content: req.body.content,
            completed: false,
            updated_at: getDate()
        })
        newToDo.save(function (err, results) {
            if (err) {
                res.send(err)
            } else {
                console.log("Successfully added new toDoItem")
                res.send(results)
            }
        })
    })

app.route("/todos/:user_id/:todo_id")
    .delete(function (req, res) { //delete specific todo for specific user
        ToDo.deleteOne({
            _id: req.params.todo_id,
            user_id: req.params.user_id
        }, function (err) {
            if (err) {
                res.send(err)
                console.log("delete error: ", err)
            } else {
                res.send("ToDoItem Deleted")
                console.log("deleted to do with id of ", req.params.todo_id)
            }
        }
        )

    })
    .patch(function (req, res) {
        ToDo.updateOne({
            _id: req.params.todo_id,
            user_id: req.params.user_id

        }, {
            content: req.body.content,
            updated_at: getDate()
        }, function (err, results) {
            if (err) {
                res.send(err)
                console.log("Update Error ", err)
            } else {
                res.send(results)
                console.log("Updated item with ID of : ", req.params.todo_id)
            }
        })
    })





app.route("/all")
    .get(function (req, res) { //gets back all ToDo items in the database
        ToDo.find({}, function (err, results) {
            if (err) {
                res.send(err)
                console.log("there has been an error with /all")
            } else {
                console.log("Sent the results of find all")
                res.send("These are all the articles I can find ", results)
            }
        })
    })


app.listen(PORT, () => console.log(`Listening on ${PORT}`));
