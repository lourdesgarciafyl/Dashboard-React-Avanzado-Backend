import mongoose, { Schema } from 'mongoose';

const saleSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  saleDate: {
    type: String,
    required: true,
    default: Date.now(),
  },
  cartProducts: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId, ref: 'product' },
      productName: String,
      price: Number,
      quantity: Number,
    },
  ],
  paymentType: {
    type: String,
    required: true,
    MinLength: 3,
    MaxLength: 20,
  },
  status: {
    type: String,
    required: true,
    MinLength: 3,
    maxLength: 20,
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0,
  },
});

const Sale = mongoose.model('sale', saleSchema);
export default Sale;
