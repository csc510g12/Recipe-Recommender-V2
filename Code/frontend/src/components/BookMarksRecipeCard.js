// Copyright (C) 2024 SE Recipe Recommender - All Rights Reserved
// You may use, distribute and modify this code under the
// terms of the MIT license.
// You should have received a copy of the MIT license with
// this file. If not, please write to: secheaper@gmail.com

import React, { useState } from "react";
import {
  Box,
  Card,
  CardHeader,
  Heading,
  Text,
  CardBody,
  Image,
  useToast,
  Flex,
  Badge,
  Skeleton,
  Stack,
  Button,
} from "@chakra-ui/react";
import { ClockIcon, StarIcon, TrashIcon } from "lucide-react";
import recipeDB from "../apis/recipeDB"; // Import API module required to access recipe DB
import { useAuth0 } from "@auth0/auth0-react"; // Import Auth0 for user info

const BookMarksRecipeCard = ({key, recipe, handler, onDelete }) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Loading state for delete
  const toast = useToast(); // Toast notifications
  const { user } = useAuth0(); // Get user info from Auth0

  const handleClick = () => {
    if (handler) {
      handler(recipe);
    }
  };

  const handleDelete = async () => {
    if (!user) {
      toast({
        title: "User not logged in",
        description: "Please log in to manage bookmarks",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true); // Show loading state while deleting

    try {
      // Make API call to remove the recipe from bookmarks
      await recipeDB.post("/recipes/removeRecipeFromProfile", {
        userName: user.nickname, // Pass user identifier
        recipe,
      });

      // Trigger parent component's delete handler
      if (onDelete) {
        onDelete(recipe);
      }

      toast({
        title: "Recipe Removed",
        description: "The recipe has been removed from your bookmarks.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error removing recipe:", error);
      toast({
        title: "Error",
        description: "Unable to remove recipe. Please try again later.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return "green.500";
    if (rating >= 4.0) return "teal.500";
    if (rating >= 3.0) return "yellow.500";
    return "orange.500";
  };

  const getCalories = () => {
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
    <Card
      data-testid="recipeCard"
      overflow="hidden"
      transition="all 0.3s"
      _hover={{
        transform: "translateY(-8px)",
        boxShadow: "xl",
        cursor: "pointer",
      }}
    >
      <Box position="relative">
        {!imageError ? (
          <Image
            data-testid="recipeImg"
            src={recipe["image-url"]}
            alt={recipe.TranslatedRecipeName}
            objectFit="cover"
            height="200px"
            width="100%"
            onError={handleImageError}
            fallback={<Skeleton height="200px" />}
          />
        ) : (
          <Box
            height="200px"
            bg="gray.100"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Text color="gray.500">Image not available</Text>
          </Box>
        )}
      </Box>

      <CardHeader onClick={handleClick} pb="2">
        <Heading data-testid="recipeName" size="md" noOfLines={2}>
          {recipe.TranslatedRecipeName}
        </Heading>
      </CardHeader>

      <CardBody pt="0">
        <Stack spacing="3">
          <Flex align="center" justify="space-between">
            <Flex align="center">
              <ClockIcon size={16} />
              <Text data-testid="time" ml="2" fontSize="sm">
                {recipe.TotalTimeInMins} mins
              </Text>
            </Flex>
            <Flex align="center">
              <StarIcon size={16} />
              <Text
                data-testid="rating"
                ml="2"
                color={getRatingColor(recipe["Recipe-rating"])}
                fontWeight="bold"
              >
                {recipe["Recipe-rating"]}
              </Text>
            </Flex>
          </Flex>

          <Flex align="center" justify="space-between">
            <Text>
              <Text as="b">Calories: </Text>
              {getCalories()}
            </Text>
            <Badge
              data-testid="diet"
              colorScheme={
                recipe["Diet-type"]?.toLowerCase() === "vegetarian"
                  ? "green"
                  : "purple"
              }
              alignSelf="flex-start"
            >
              {recipe["Diet-type"]}
            </Badge>
          </Flex>

          {/* Delete Button */}
          <Button
            mb="3"
            colorScheme="red"
            leftIcon={<TrashIcon />}
            isLoading={isLoading}
            onClick={handleDelete}
          >
            Delete
          </Button>
        </Stack>
      </CardBody>
    </Card>
  );
};

export default BookMarksRecipeCard;
