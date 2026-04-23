import express from 'express';
import { getAllRecipes, getRecipeById, createRecipe, deleteRecipe } from '../controllers/recipe.controller.js';
import { validateRecipeCreation } from '../middlewares/validation.recipes.js';

const router = express.Router();

router.get("/", getAllRecipes);
router.get("/:id", getRecipeById);
router.post("/", validateRecipeCreation, createRecipe);
router.delete("/:id", deleteRecipe);

export default router;