const mongoose = require("mongoose")

const toDoListSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        maxLength: [80, "Title can't exceed 80 characters"]
    },
   
    status: {
        type: String,
        default: "pending"
    },
   
}, {
    timestamps: true
})


module.exports = mongoose.model('ToDoList', toDoListSchema, 'toDoLists')