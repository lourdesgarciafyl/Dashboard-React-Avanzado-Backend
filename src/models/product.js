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
        type: String,
        required: true
    },
    detail:{
        type: String,
        required: true,
        minLength: 5,
        maxLength: 500        
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