import { Router } from 'express';
import Recipe from '../models/recipe.js';
import Image from '../models/image.js';
import Ingredient from '../models/ingredient.js';

const router = Router();

router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    const userId = req.userId;

    const regex = new RegExp(query, 'i');
    const recipes = await Recipe.find({
      user_created: userId,
      $or: [
        { title: { $regex: regex } },
        { 'ingredients': { $in: await Ingredient.find({ label: { $regex: regex } }).select('_id') } },
      ],
    }).populate('ingredients').populate('images');

    res.json({ recipes });
  } catch (error) {
    console.error('Error searching recipes:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.get('/', async (req, res) => {
  try {
    const userId = req.userId;
    const recipes = await Recipe.find({user_created: userId}).populate('images');
    res.json({ recipes });
  } catch (error) {
    console.error('Error retrieving recipes:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/',  async (req, res) => {
  try {
    const { title, ingredients, steps, description, images } = req.body;
    const userId = req.userId;

    const newRecipe = new Recipe({
      title,
      ingredients,
      steps,
      description,
      images,
      user_created: userId
    });

    const savedRecipe = await newRecipe.save();

    res.json({ message: 'Recipe added successfully', recipeId: savedRecipe._id });
  } catch (error) {
    console.error('Error adding recipe:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/:recipeId', async (req, res) => {
  try {
    const { recipeId } = req.params;
    const userId = req.userId;
    const recipe = await Recipe.find({_id: recipeId, user_created: userId}).populate('images').populate('ingredients');
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    res.json({ recipe });
  } catch (error) {
    console.error('Error fetching recipe:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.patch('/:recipeId', async (req, res) => {
  const { recipeId } = req.params;
  const userId = req.userId;

  try {
    const updatedRecipe = await Recipe.findOneAndUpdate(
      { _id: recipeId, user_created: userId },
      { $set: req.body },
      { new: true }
    );

    if (!updatedRecipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    res.json({ message: 'Recipe updated successfully', updatedRecipe });
  } catch (error) {
    console.error('Error updating recipe:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/:recipeId', async (req, res) => {
  const { recipeId } = req.params;
  const userId = req.userId;
  try {
    // Find the recipe to get the image IDs
    const recipe = await Recipe.findOne({ _id: recipeId, user_created: userId });

    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    // Extract image IDs from the recipe
    const imageIds = recipe.images;

    // Delete images by their IDs
    await Image.deleteMany({ _id: { $in: imageIds } });

    const deletedRecipe = await Recipe.deleteOne({ _id: recipeId, user_created: userId });

    if (deletedRecipe.deletedCount === 0) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    res.json({ message: 'Recipe deleted successfully', deletedRecipe });

  } catch (error) {
    console.error('Error deleting recipe:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
