const { ToDoSchema, ListSchema } = require("./mongoConfig");
const mongoose = require("mongoose");
require("dotenv").config();

const express = require("express");
const cors = require("cors"); //handy package to prevent access errors when attempting to create/delete etc
const bodyParser = require("body-parser");

const PORT = process.env.PORT || 3001;

const app = express();

app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.json());

//this seems to be needed to allow access
// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*');
//     next();
// });

const ToDo = mongoose.model("Todo", ToDoSchema);
const ToDoList = mongoose.model("List", ListSchema);
// const User = mongoose.model("User", UserSchema);

mongoose.connect(
  `mongodb+srv://Admin-RyanS:${process.env.MONGO_CLOUD_PASSWORD}@todotogether.acizm.mongodb.net/todotogether?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
); //this one connects to online

// mongoose.connect("mongodb://localhost:27017/toDoTogetherDB", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// }) //this one connects to local mongoDb server

//below line is needed to avoid depreciation warning for findOneAndUpdate()
mongoose.set("useFindAndModify", false);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  //shows that we're connected to online MongoDB.
  console.log("Connected");
});

function getDate() {
  let date = new Date().toLocaleString("en-UK");
  return date;
}

const newToDo = new ToDo({
  content: "To perfect this app.. mwhahahah",
  completed: false,
  due_date: getDate(),
});

// const testUser1 = new User({
//     user_id: "104679491571848883142"

// })

// const testUser2 = new User({
//     user_id: "102549098797720434531"

// })

const testItems = [newToDo, newToDo, newToDo];
// const testUsers = [testUser1, testUser2];

const newList = new ToDoList({
  creator_id: "104679491571848883142",
  list_name: "First ever list",
  updated_at: getDate(),
  todo_items: testItems,
});

// newToDo.save();
// newList.save();

//REST API calls for all ToDos
app
  .route("/todos/:user_id/:list_id")
  .get(function (req, res) {
    //gets back all ToDo items for a given userId
    ToDoList.find(
      {
        creator_id: req.params.user_id,
        _id: req.params.list_id,
      },
      function (err, results) {
        if (err) {
          res.send(err);
        } else {
          console.log(
            "Sent the results of find all for certain userId",
            req.params.user_id
          );
          console.log(results);
          res.send(results);
        }
      }
    );
  })
  .post(function (req, res) {
    //creates a new toDoItem
    console.log("new to do attempted to be made", req.body);
    const newToDo = new ToDo({
      user_id: req.params.user_id,
      content: req.body.content,
      completed: false,
      due_date: req.body.due_date,
    });
    ToDoList.findOneAndUpdate(
      {
        creator_id: req.params.user_id,
        _id: req.params.list_id,
      },
      {
        $push: { todo_items: newToDo },
        updated_at: getDate(),
      },
      { new: true },
      function (err, results) {
        if (err) {
          res.send(err);
          console.log("Error adding todo item to list ", err);
        } else {
          res.send(results);
          console.log(
            "Successfully added todo item to list: ",
            req.params.list_id
          );
        }
      }
    );
  });

app
  .route("/todos/:user_id/:list_id/:todo_id")
  .delete(function (req, res) {
    //delete specific todo for a specific list
    ToDoList.findOneAndUpdate(
      {
        creator_id: req.params.user_id,
        _id: req.params.list_id,
      },
      {
        $pull: { todo_items: { _id: req.params.todo_id } },
      },
      { new: true },
      function (err, results) {
        if (err) {
          res.send(err);
          console.log("Error removing todo-item from the list ", err);
        } else {
          res.send(results);
          console.log(
            "Successfully removed todo item : ",
            req.params.todo_id,
            "from list: ",
            req.params.list_id
          );
        }
      }
    );
  })
  .patch(function (req, res) {
    const setCompleted = () => {
      if (req.body.completed) {
        console.log(req.body.completed);
        return req.body.completed;
      } else {
        return false;
      }
    };
    function setUpdate() {
      //prevents content being overridden if only updated is passed into the patch request
      if (req.body.content) {
        return {
          $set: {
            "todo_items.$.content": req.body.content,
            "todo_items.$.completed": setCompleted(),
            "todo_items.$.due_date": req.body.due_date,
          },
        };
      } else
        return {
          $set: {
            "todo_items.$.completed": setCompleted(),
          },
        };
    }

    ToDoList.findOneAndUpdate(
      {
        creator_id: req.params.user_id,
        _id: req.params.list_id,
        "todo_items._id": req.params.todo_id,
      },
      setUpdate(),
      { new: true },
      function (err, results) {
        if (err) {
          res.send(err);
          console.log("Update Error ", err);
        } else {
          res.send(results);
          console.log("Updated item with ID of : ", req.params.todo_id);
        }
      }
    );
  });

//REST api calls for specifically lists

app
  .route("/lists/:user_id")
  .get(function (req, res) {
    ToDoList.find(
      {
        creator_id: req.params.user_id,
      },
      function (err, results) {
        if (err) {
          console.log("error with lists");
          res.send(err);
        } else {
          console.log("Sent lists to client");
          res.send(results);
        }
      }
    );
  })
  .post(function (req, res) {
    const newList = new ToDoList({
      creator_id: req.params.user_id,
      list_name: req.body.list_name,
      updated_at: getDate(),
      todo_items: [],
    });
    newList.save(function (err, results) {
      if (err) {
        res.send(err);
      } else {
        console.log("Successfully created new list");
        res.send(results);
      }
    });
  });

app
  .route("/lists/:user_id/:list_id")
  .delete(function (req, res) {
    ToDoList.deleteOne(
      {
        _id: req.params.list_id,
        creator_id: req.params.user_id,
      },
      function (err, results) {
        if (err) {
          res.send(err);
        } else {
          console.log("deleted list id: ", req.params.list_id);
          res.send(results);
        }
      }
    );
  })
  .patch(function (req, res) {
    ToDoList.findOneAndUpdate(
      {
        _id: req.params.list_id,
        creator_id: req.params.user_id,
      },
      {
        $set: req.body, //using this line of code means that only what is sent is updated. So if completed is sent then thats updated, where as if just content is sent then that is updated
        updated_at: getDate(), //the updated_at is ran every time to the date is always recent
      },
      { new: true },
      function (err, results) {
        if (err) {
          res.send(err);
        } else {
          console.log(
            "Successfully updated list with ID : ",
            req.params.list_id
          );
          res.send(results);
        }
      }
    );
  });

//Call to all todos for testing purposes.
app.route("/alltodo").get(function (req, res) {
  //gets back all ToDo items in the database
  ToDo.find({}, function (err, results) {
    if (err) {
      res.send(err);
      console.log("there has been an error with /all");
    } else {
      console.log("Sent the results of find all");
      res.send(results);
    }
  });
});

//Call to all lists for testing purposes
app.route("/everylist").get(function (req, res) {
  //gets back all ToDo items in the database
  ToDoList.find({}, function (err, results) {
    if (err) {
      res.send(err);
      console.log("there has been an error with /everylist");
    } else {
      console.log("Sent the results of find all");
      res.send(results);
    }
  });
});

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
