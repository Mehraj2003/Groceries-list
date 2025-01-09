import mongoose from 'mongoose';

const grocerySchema = mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
});

const Grocery = mongoose.model('Grocery', grocerySchema);

export default Grocery;
