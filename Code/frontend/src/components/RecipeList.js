/* MIT License

Copyright (c) 2024 Ayush, Yaswanth B, Yaswant M  */

import React, { useState } from "react";
import {
  Avatar,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalOverlay,
  ModalHeader,
  ModalFooter,
  ModalContent,
  Box,
  SimpleGrid,
  Text,
  Button,
} from "@chakra-ui/react";
import RecipeCard from "./RecipeCard";

// Component to handle all the recipes
const RecipeList = ({ recipes }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentRecipe, setCurrentRecipe] = useState({});

  const youtube_videos = `https://www.youtube.com/results?search_query=${currentRecipe["TranslatedRecipeName"]}`;

  const handleViewRecipe = (data) => {
    setIsOpen(true);
    setCurrentRecipe(data);
  };

  const onClose = () => {
    setIsOpen(false);
  };

  // Logic to compute or estimate calories
  const getCalories = (recipe) => {
    if (recipe.Calories && recipe.Calories !== "Not Available") {
      return `${recipe.Calories} kcal`;
    }

    // Basic estimation logic (if calories are unavailable)
    if (recipe.TotalTimeInMins) {
      const baseCalories = 200;
      const timeFactor = recipe.TotalTimeInMins * 5; // Add 5 calories per minute
      return `${baseCalories + timeFactor} kcal (Estimated)`;
    }

    return "Calories Not Available";
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
        <SimpleGrid spacing={5} templateColumns="repeat(auto-fill, minmax(250px, 1fr))">
          {recipes.length !== 0 ? (
            recipes.map((recipe) => (
              <RecipeCard
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

      <Modal size={"6xl"} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent data-testid="recipeModal">
          <ModalHeader>{currentRecipe.TranslatedRecipeName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex>
              <Avatar size="2xl" mr={2} mb={2} src={currentRecipe["image-url"]} />
              <Box mt={4}>
                <Text>
                  <Text as={"b"}>Cooking Time: </Text>
                  {currentRecipe.TotalTimeInMins} mins
                </Text>
                <Text>
                  <Text as={"b"}>Rating: </Text> {currentRecipe["Recipe-rating"]}
                </Text>
                <Text>
                  <Text as={"b"}>Diet Type: </Text> {currentRecipe["Diet-type"]}
                </Text>
                <Text>
                  <Text as={"b"}>Calories: </Text> {getCalories(currentRecipe)}
                </Text>
              </Box>
            </Flex>
            <Text>
              <Text as={"b"}>Instructions: </Text> {currentRecipe["TranslatedInstructions"]}
            </Text>
            <Text color={"blue"}>
              <Text color={"black"} as={"b"}>
                Video Url:{" "}
              </Text>
              <a href={youtube_videos} target="_blank" rel="noopener noreferrer">
                Youtube
              </a>
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="teal" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default RecipeList;
