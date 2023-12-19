import { Router } from "express";
import Ingredient from "../models/ingredient.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const ingredients = await Ingredient.find();
    res.json({ ingredients });
  } catch (error) {
    console.error("Error retrieving ingredients:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { label } = req.body;

    const newIngredient = new Ingredient({
      label,
    });
    const savedIngredient = await newIngredient.save();
    res.json({
      message: "ingredient added successfully",
      IngredientId: savedIngredient._id,
    });
  } catch (error) {
    console.error("Error adding ingredient:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/:ingredientId", async (req, res) => {
  try {
    const { ingredientId } = req.params;
    const ingredient = await Ingredient.findById(ingredientId);

    if (!ingredient) {
      return res.status(404).json({ error: "Ingredient not found" });
    }
    res.json({ ingredient });
  } catch (error) {
    console.error("Error fetching ingredient:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.patch("/:ingredientId", async (req, res) => {
  const { ingredientId } = req.params;

  try {
    const updatedIngredient = await Ingredient.findOneAndUpdate(
      { _id: ingredientId },
      { $set: req.body },
      { new: true }
    );

    if (!updatedIngredient) {
      return res.status(404).json({ error: "Ingredient not found" });
    }

    res.json({ message: "Ingredient updated successfully", updatedIngredient });
  } catch (error) {
    console.error("Error updating Ingredient:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/:ingredientId", async (req, res) => {
  const { ingredientId } = req.params;
  try {
    const deletedIngredient = await Ingredient.deleteOne({ _id: ingredientId });

    if (deletedIngredient.deletedCount === 0) {
      return res.status(404).json({ error: "Ingredient not found" });
    }

    res.json({ message: "Ingredient deleted successfully", deletedIngredient });
  } catch (error) {
    console.error("Error deleting ingredient:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
