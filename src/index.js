import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import errorHandler from "./middlewares/error.handler.js";
import recipeRoutes from "./routes/recipe.route.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.use(cors({
    origin: process.env.FE_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());

app.use(express.urlencoded({ extended: true }))

app.get("/", (req, res) => {
    res.send("Hello, World!");
});

app.use("/api/recipes", recipeRoutes);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
