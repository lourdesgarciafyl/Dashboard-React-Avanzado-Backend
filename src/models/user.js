import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema({
  firstname: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 30,
  },
  lastname: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 40,
  },
  email: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 60,
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
  },
  status: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  avatar: {
    public_id: String,
    secure_url: String
  }
});

const User = mongoose.model(`user`, userSchema);

export default User;
