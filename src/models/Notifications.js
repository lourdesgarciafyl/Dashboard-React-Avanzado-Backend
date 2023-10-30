import mongoose, { Schema } from 'mongoose';

const NotificationsSchema = new Schema({
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    avatar: {
        type: String,
        required: false,
        trim: true
    },
    type: {
        type: String,
        required: false,
        trim: true
    },
    isUnRead: {
        type: Boolean,
        default: true,
        required: true,
    },
    createdAt:{
        type: String,
        required: false,
        trim: true
    },
    create_at: {
        type: Date,
        default: Date.now(),
    }
});

const Notifications = mongoose.model(`Notifications`, NotificationsSchema);

export default Notifications;