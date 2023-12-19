import { mongoose } from "mongoose";

const RecipeSchema = new mongoose.Schema({
  title: String,
  ingredients: [String],
  steps: [String],
  description: String,
  images: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Image' }],
});

const Recipe = mongoose.model('Recipe', RecipeSchema);

export default Recipe;