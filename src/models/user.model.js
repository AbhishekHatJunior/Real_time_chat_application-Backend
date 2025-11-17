import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: [true, "Username is required"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    chats: [
        {
            type: String,
        }
    ]
});

const User = mongoose.Model("User", userSchema);