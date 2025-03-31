/* MIT License

Copyright (c) 2025 Ayush Gala, Ayush Pathak, Keyur Gondhalekar */

import React, { useState } from "react";
import {
  Box,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import RecipeCard from "./RecipeCard";
import recipeDB from "../apis/recipeDB";
import RecipeModal from "./RecipeModal";

// Component to handle all the recipes
const RecipeList = ({ recipes }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentRecipe, setCurrentRecipe] = useState({});
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleViewRecipe = (data) => {
    setCurrentRecipe(data);
    setIsOpen(true);
    setAiResponse("");
    setAiPrompt("");
  };

  const onClose = () => {
    setIsOpen(false);
    setCurrentRecipe({});
  };

  // Logic to compute or estimate calories
  const getCalories = (recipe) => {
    if (recipe.Calories && recipe.Calories !== "Not Available") {
      return `${recipe.Calories} kcal`;
    }

    // Basic estimation logic (if calories are unavaila`ble)
    if (recipe.TotalTimeInMins) {
      const baseCalories = 200;
      const timeFactor = recipe.TotalTimeInMins * 5; // Add 5 calories per minute
      return `${baseCalories + timeFactor} kcal (Estimated)`;
    }

    return "Calories Not Available";
  };

  // function to handle GEMINI ingredient substitutions
  const handleAiSuggestion = async () => {
    if (!aiPrompt.trim()) return;
    setAiResponse("");
    setIsLoading(true);
    try {
      // Prepare context for the API call
      const context = {
        recipeName: currentRecipe.TranslatedRecipeName,
        instructions: currentRecipe.TranslatedInstructions,
        dietType: currentRecipe["Diet-type"],
        query: aiPrompt,
      };

      const response = await recipeDB.post("/recipes/aiChef", {
        context,
      });

      console.log(response);

      if (response.status !== 200) {
        throw new Error(
          "The chef is currently unreachable. Please try again in sometime!"
        );
      }

      const data = await response.data;
      console.log(data);
      setAiResponse(data.response);
    } catch (error) {
      console.error("Error getting AI suggestions:", error);
      setAiResponse(
        "Sorry, I couldn't process your request at the moment. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Box
        borderRadius={"lg"}
        border="1px"
        boxShadow={"10px"}
        borderColor={"gray.100"}
        fontFamily="regular"
        m={10}
        width={"70%"}
        p={5}
      >
        <SimpleGrid
          spacing={5}
          templateColumns="repeat(auto-fill, minmax(250px, 1fr))"
        >
          {recipes.length !== 0 ? (
            recipes.map((recipe) => (
              <RecipeCard
                key={recipe._id}
                handler={handleViewRecipe}
                recipe={{
                  ...recipe,
                  calories: getCalories(recipe), // Attach computed or estimated calories
                }}
              />
            ))
          ) : (
            <Text data-testid="noResponseText" fontSize={"lg"} color={"gray"}>
              Searching for a recipe?
            </Text>
          )}
        </SimpleGrid>
      </Box>

      <RecipeModal
        isOpen={isOpen}
        onClose={onClose}
        recipe={currentRecipe}
        getCalories={getCalories}
        aiPrompt={aiPrompt}
        setAiPrompt={setAiPrompt}
        aiResponse={aiResponse}
        isLoading={isLoading}
        handleAiSuggestion={handleAiSuggestion}
      />
    </>
  );
};

export default RecipeList;
