import mongoose, { Schema } from 'mongoose';

const categorySchema = new Schema({
  categoryName: {
    type: String,
    required: true,
    unique: true,
    minLength: 2,
    maxLength: 20,
  },
  image: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
});

const Category = mongoose.model(`categorie`, categorySchema);

export default Category;
