const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', 
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', 
      required: true,
    },
    messages: [
      {
        content: {
          type: String,
          required: true, 
          trim: true,
        },
        timestamp: {
          type: Date,
          default: Date.now, 
        },
      },
    ],
  },
  {
    timestamps: true, 
    toJSON: { virtuals: true },
    toObject: { virtuals: true }, 
  }
);

// Index for faster querying of one-on-one chats
chatSchema.index({ sender: 1, receiver: 1 });

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;
