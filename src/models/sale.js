import mongoose, { Schema } from 'mongoose';

const saleSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'usuario' },
  saleDate: {
    type: 'Date',
    required: true,
    default: Date.now(),
  },
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'product' },
      quantity: {
        type: Number,
        required: true,
        min: 1
      },
      subtotal: {
        type: Number,
        required: true,
        min: 0,
        max: 1000000,
      },
    },
  ],
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
    max: 5000000,
  },
});

const Sale = mongoose.model('sale', saleSchema);
export default Sale;