/* MIT License

Copyright (c) 2025 Ayush Gala, Ayush Pathak, Keyur Gondhalekar */

import React, { useState } from "react";
import {
  Box,
  SimpleGrid,
  Text,
  Heading,
  UnorderedList,
  OrderedList,
  ListItem,
  Link,
  Code,
  Divider,
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

  const youtube_videos = `https://www.youtube.com/results?search_query=${currentRecipe["TranslatedRecipeName"]}`;

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

  //to render the markdown UI of the AIs response properly.
  const ChakraUIRenderers = {
    p: (props) => <Text mb={4} {...props} />,
    h1: (props) => <Heading as="h1" size="xl" mt={6} mb={4} {...props} />,
    h2: (props) => <Heading as="h2" size="lg" mt={5} mb={3} {...props} />,
    h3: (props) => <Heading as="h3" size="md" mt={4} mb={2} {...props} />,
    h4: (props) => <Heading as="h4" size="sm" mt={3} mb={2} {...props} />,
    ul: (props) => <UnorderedList pl={4} mb={4} {...props} />,
    ol: (props) => <OrderedList pl={4} mb={4} {...props} />,
    li: (props) => <ListItem mb={1} {...props} />,
    a: (props) => <Link color="teal.500" isExternal {...props} />,
    blockquote: (props) => (
      <Box
        borderLeft="4px"
        borderColor="gray.200"
        pl={4}
        py={1}
        my={4}
        {...props}
      />
    ),
    code: (props) => <Code p={2} {...props} />,
    hr: () => <Divider my={4} />,
    // Add more elements as needed
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

  const ingredientsString = currentRecipe["TranslatedIngredients"] || "";
  const ingredientsArray = ingredientsString.split(",");

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
