const mongoose = require("mongoose");
const Schema = mongoose.Schema


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
    updated_at: Date

})

const UserSchema = new Schema({
    user_id: String
})

const ListSchema = new Schema({
    creator_id: String,
    list_name: String,
    updated_at: Date,
    todo_items: [ToDoSchema],
    allowed_users: [UserSchema]
})

exports.ListSchema = ListSchema
exports.UserSchema = UserSchema
exports.ToDoSchema = ToDoSchema

//this file sets up the connection to mongoDB online