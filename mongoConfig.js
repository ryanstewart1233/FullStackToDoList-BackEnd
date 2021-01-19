const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// const ToDoListSchema = new Schema({
//     creator_id: String,
//     list_name: String,
//     last_updated_at: Date,
//     allowed_users: {
//         user_id: String
//     }
// })

//user_id below will now become list id

const ToDoSchema = new Schema({
  content: String,
  completed: Boolean,
  due_date: Date,
});

// const UserSchema = new Schema({ // add back when trying to implement multiple users per lists
//     user_id: String
// })

const ListSchema = new Schema({
  creator_id: String,
  list_name: { type: String, required: true },
  updated_at: Date,
  todo_items: [ToDoSchema],
});

exports.ListSchema = ListSchema;
// exports.UserSchema = UserSchema;
exports.ToDoSchema = ToDoSchema;

//this file sets up the connection to mongoDB online
