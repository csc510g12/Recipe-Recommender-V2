// RecipeModal.jsx

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  UnorderedList,
  OrderedList,
  ListItem,
  Code,
  VStack,
} from "@chakra-ui/react";
import { FaPaperPlane } from "react-icons/fa";
import TextToSpeech from "./TextToSpeech";

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
};

const RecipeModal = ({
  isOpen,
  onClose,
  recipe,
  getCalories,
  aiPrompt,
  setAiPrompt,
  aiResponse,
  isLoading,
  handleAiSuggestion,
}) => {
  const [showInstructionModal, setShowInstructionModal] = useState(false);

  const youtubeLink = `https://www.youtube.com/results?search_query=${recipe.TranslatedRecipeName}`;
  const ingredients = recipe.TranslatedIngredients?.split(",") || [];

  return (
    <>
      <Modal size="6xl" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent borderRadius="2xl" overflow="hidden">
          <Box
            h="200px"
            bgImage={`url(${recipe["image-url"]})`}
            bgSize="cover"
          />
          <ModalHeader fontSize="2xl" fontWeight="bold">
            {recipe.TranslatedRecipeName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody px={8} pb={6}>
            <Flex gap={10} direction={["column", "column", "row"]}>
              <Box flex="1">
                <Heading size="md" mb={3}>
                  Recipe Details
                </Heading>
                <Flex align="center" gap={4} mb={4}>
                  <Avatar size="lg" src={recipe["image-url"]} />
                  <Box>
                    <Text>
                      <b>Cooking Time:</b> {recipe.TotalTimeInMins} mins
                    </Text>
                    <Text>
                      <b>Rating:</b> {recipe["Recipe-rating"]}
                    </Text>
                    <Text>
                      <b>Diet Type:</b> {recipe["Diet-type"]}
                    </Text>
                    <Text>
                      <b>Calories:</b> {getCalories(recipe)}
                    </Text>
                  </Box>
                </Flex>
                <Text fontWeight="bold" mt={2}>
                  Ingredients:
                </Text>
                <UnorderedList spacing={1} pl={5}>
                  {ingredients.map((ing, i) => (
                    <ListItem key={i}>{ing.trim()}</ListItem>
                  ))}
                </UnorderedList>
                <Text fontWeight="bold" mt={4}>
                  Instructions:
                </Text>
                <Box mt={2}>
                  <ReactMarkdown components={ChakraUIRenderers}>
                    {recipe.TranslatedInstructions ||
                      "No instructions provided."}
                  </ReactMarkdown>
                </Box>
                <TextToSpeech text={recipe["TranslatedInstructions"]} />
                <Text mt={4}>
                  <b>Video Url:</b>{" "}
                  <Link color="blue.500" href={youtubeLink} isExternal>
                    Youtube
                  </Link>
                </Text>
              </Box>

              <Box
                flex="1"
                p={5}
                borderRadius="lg"
                boxShadow="lg"
                border="1px"
                backdropFilter="blur(8px)"
              >
                <Heading size="md" mb={3}>
                  Ask Chef Gemini 👨‍🍳✨
                </Heading>
                <InputGroup>
                  <Input
                    placeholder="e.g., What can I substitute for eggs?"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && handleAiSuggestion()
                    }
                  />
                  <InputRightElement width="3rem">
                    <Button
                      size="sm"
                      onClick={handleAiSuggestion}
                      isLoading={isLoading}
                    >
                      <FaPaperPlane />
                    </Button>
                  </InputRightElement>
                </InputGroup>
                {aiResponse && (
                  <VStack mt={4} align="stretch">
                    <Divider />
                    <Box p={3} borderRadius="md" shadow="sm">
                      <ReactMarkdown components={ChakraUIRenderers}>
                        {aiResponse}
                      </ReactMarkdown>
                    </Box>
                  </VStack>
                )}

                <Button
                  mt={6}
                  size="lg"
                  colorScheme="purple"
                  width="100%"
                  height="60px"
                  fontSize="xl"
                  onClick={() => setShowInstructionModal(true)}
                >
                  Display Instructions 👀
                </Button>
              </Box>
            </Flex>
          </ModalBody>

          <ModalFooter>
            <Button onClick={onClose} colorScheme="teal">
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal /* Fullscreen Instructions Modal */
        isOpen={showInstructionModal}
        onClose={() => setShowInstructionModal(false)}
        size="full"
        scrollBehavior="inside"
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody px={[4, 10]} py={10}>
            <Box maxW="5xl" mx="auto" fontSize={["md", "lg", "xl"]}>
              <ReactMarkdown components={ChakraUIRenderers}>
                {recipe.TranslatedInstructions || "No instructions available."}
              </ReactMarkdown>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default RecipeModal;
