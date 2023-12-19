import mongoose from 'mongoose';

const IngredientSchema = new mongoose.Schema({
  label: { type: String, required: true }
});

const Ingredient = mongoose.model('Ingredient', IngredientSchema);

export default Ingredient;
