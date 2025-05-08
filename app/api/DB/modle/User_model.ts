import mongoose from "mongoose";

const user = new mongoose.Schema({
  email: String,
  name: String,
  avatar: String,
  tasks: [
    {
      task: {
        type: String,
        required: true,
      },
      finished: {
        type: Boolean,
        default: false,
      },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

export const userDB = mongoose.models.user || mongoose.model("user", user);
