import { mongoose } from "mongoose";

const RecipeSchema = new mongoose.Schema({
  title: String,
  ingredients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient' }],
  steps: [String],
  description: String,
  images: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Image' }],
  user_created: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date_created: { type: Date, default: Date.now }
});

const Recipe = mongoose.model('Recipe', RecipeSchema);

export default Recipe;