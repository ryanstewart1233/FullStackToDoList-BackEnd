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

const ToDoSchema = new Schema({
    user_id: String,
    content: String,
    completed: Boolean,
    updated_at: Date

})

module.exports = ToDoSchema

//this file sets up the connection to mongoDB online