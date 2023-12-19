import { Router } from 'express';
import Recipe from '../models/recipe.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const recipes = await Recipe.find().populate('images');
    res.json({ recipes });
  } catch (error) {
    console.error('Error retrieving recipes:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/',  async (req, res) => {
  try {
    const { title, ingredients, steps, description, images } = req.body;

    const newRecipe = new Recipe({
      title,
      ingredients,
      steps,
      description,
      images
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
    const recipe = await Recipe.findById(recipeId).populate('images');

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

  try {
    const updatedRecipe = await Recipe.findOneAndUpdate(
      { _id: recipeId },
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
  try {
    const deletedRecipe = await Recipe.deleteOne({ _id: recipeId });

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
