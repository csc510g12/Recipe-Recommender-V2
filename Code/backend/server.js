import express from "express";
import cors from "cors";
import recipes from "./api/recipes.route.js";
import social from "./api/social.route.js";
import path from "path";

const app = express();

app.use(cors());
app.use(express.json());
//Result URL
app.use("/api/v1/recipes", recipes);
app.use("/api/v1/social", social);
app.use("/uploads", express.static("uploads"));

//Error thrown when page is not found
app.use("*", (req, res) => res.status(404).json({ error: "not found" }));

export default app;
