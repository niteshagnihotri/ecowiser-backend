import 'dotenv/config'
import express, { json } from 'express';
import recipeRoutes from './routes/recipe.js';
import authRoutes from './routes/auth.js';
import cookieParser from 'cookie-parser';
import connectToDatabase from './db/connection.js';
import cors from 'cors';
import authenticate from './middleware/authenticate.js';
import bodyParser from 'body-parser';
import imageRoutes from './routes/images.js';
import ingredientRoutes from './routes/ingredient.js';


const app = express();
const PORT = 8000 || process.env.PORT;

connectToDatabase();
app.use(cors());
app.use(json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/api/recipes', authenticate, recipeRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/ingredients', ingredientRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
