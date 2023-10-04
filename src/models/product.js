import mongoose, { Schema } from "mongoose";

const productSchema = new Schema({
    productName:{
        type: String,
        required: true,
        unique: true,
        minLength: 3,
        maxLength: 50
    },
    price:{
        type: Number,
        required: true,
        min: 0,
        max: 100000
    },
    image:{
        public_id: String,
        secure_url: String
    },
    detail:{
        type: String,
        required: true,
        minLength: 5,
        maxLength: 500        
    },
    stock: {
        type: Number,
        required: true,
        min: 0,
        default: 0,
      },
    status:{
        type: String,
        required: true
    },
    category:{
        type: String,
        required: true
    }
})

const Product = mongoose.model(`product`, productSchema) 

export default Product;