// Copyright (C) 2025 SE Recipe Recommender - All Rights Reserved
// You may use, distribute and modify this code under the
// terms of the MIT license.
// You should have received a copy of the MIT license with
// this file. If not, please write to: secheaper@gmail.com

import React, { useState } from "react";
import {
  Avatar, Flex, Modal, ModalBody, ModalCloseButton,
  ModalOverlay, ModalHeader, ModalFooter, ModalContent,
  Box, SimpleGrid, Text, Button, Heading, InputGroup,
  Input, InputRightElement, VStack, Divider,
  UnorderedList, OrderedList, ListItem, Link, Code
 } from "@chakra-ui/react"
import BookMarksRecipeCard from "./BookMarksRecipeCard";
import {FaPaperPlane} from "react-icons/fa"
import recipeDB from "../apis/recipeDB";
import ReactMarkdown from "react-markdown";

// component to handle all the recipes
const BookMarksRecipeList = ({ recipes, currentUserName, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentRecipe, setCurrentRecipe] = useState({});
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  var youtube_videos = "https://www.youtube.com/results?search_query=" + currentRecipe["TranslatedRecipeName"];
  
  const handleViewRecipe = (data) => {
    setIsOpen(true)
    setAiResponse("");
    setCurrentRecipe(data);
    setAiPrompt("");
  }

  const onClose = () => {
    setIsOpen(false)
    setCurrentRecipe({});
  }

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
        query: aiPrompt
      };
      
      const response = await recipeDB.post('/recipes/aiChef', {
        context
      });

      console.log(response)
      
      if (response.status !== 200) {
        throw new Error('The chef is currently unreachable. Please try again in sometime!');
      }

      const data = await response.data;
      console.log(data)
      setAiResponse(data.response);

    } catch (error) {
      console.error('Error getting AI suggestions:', error);
      setAiResponse("Sorry, I couldn't process your request at the moment. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Box borderRadius={"lg"} border="1px" boxShadow={"10px"} borderColor={"gray.100"} fontFamily="regular" m={10} width={"94%"} p={5}>
        <SimpleGrid spacing={5} templateColumns='repeat(auto-fill, minmax(250px, 1fr))'>
          {recipes.length !==0 ? recipes.map((recipe) => (
            <BookMarksRecipeCard
              key={recipe._id}
              recipe={recipe}
              handler={handleViewRecipe}
              onDelete={onDelete}
            />
          )) : <Text data-testid="noResponseText" fontSize={"lg"} color={"gray"}>Searching for a recipe?</Text>}
        </SimpleGrid>
      </Box>

      <Modal size={"6xl"} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent data-testid="recipeModal" >
          <ModalHeader>{currentRecipe.TranslatedRecipeName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex >
            <Avatar size="2xl" mr={2} mb={2} src={currentRecipe["image-url"]} />
              <Box mt={4}>
                <Text><Text as={"b"}>Cooking Time: </Text>{currentRecipe.TotalTimeInMins} mins</Text>
                <Text><Text as={"b"}>Rating: </Text> {currentRecipe['Recipe-rating']}</Text>
                <Text mb={2}><Text as={"b"}>Diet Type: </Text> {currentRecipe['Diet-type']}</Text>
              </Box>
            </Flex>
            <Text><Text as={"b"}>Instructions: </Text> {currentRecipe["TranslatedInstructions"]}</Text>
            <Text color={"blue"}><Text color={"black"}  as={"b"}>Video Url: </Text><a href={youtube_videos}>Youtube</a></Text>

            {/* AI Chef Suggestion Box */}
            <Box mt={6} p={4} borderWidth="1px" borderRadius="lg">
              <Heading size="md" mb={3}>
                Want to make a few substitutions? Ask Chef Gemini! 👨‍🍳✨
              </Heading>
              <InputGroup>
                <Input
                  placeholder="e.g., What can I substitute for eggs in this recipe?" 
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') handleAiSuggestion();
                  }}
                  pr="4.5rem"
                />
                <InputRightElement width="3rem">
                  <Button
                    h="1.75rem"
                    size="sm"
                    onClick={handleAiSuggestion}
                    isLoading={isLoading}
                    aria-label="Send prompt to AI Chef"
                  >
                    <FaPaperPlane />
                  </Button>
                </InputRightElement>
              </InputGroup>
              
              {aiResponse && (
                <VStack mt={4} align="stretch">
                  <Divider />
                  <Box p={3} bg="gray.50" borderRadius="md">
                    <ReactMarkdown components={ChakraUIRenderers}>
                      {aiResponse}
                    </ReactMarkdown>
                  </Box>
                </VStack>
              )}
            </Box>

          </ModalBody>

          <ModalFooter>
            <Button colorScheme='teal' mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
};

export default BookMarksRecipeList;