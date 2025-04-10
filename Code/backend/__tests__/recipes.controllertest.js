const { TextEncoder, TextDecoder } = require("util");

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

const RecipesController = require('../api/recipes.controller').default;
const { GoogleGenerativeAI } = require('@google/generative-ai');

jest.mock('@google/generative-ai');
jest.mock("axios");
jest.mock("../dao/recipesDAO.js");

describe('RecipesController', () => {
  describe('apiGenerateRecipe', () => {
    let req, res;
    let originalEnv;

    beforeEach(() => {
      // Save original environment
      originalEnv = process.env;
      
      // Set up mock environment
      process.env = { ...originalEnv, GEMINI_API_KEY: 'mock-api-key' };

      req = {
        body: {
          ingredients: ['Chicken', 'Rice'],
          cuisineFromForm: 'Indian',
          maxTime: 30,
          type: 'Non-veg',
        },
      };

      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
    });

    afterEach(() => {
      // Restore original environment
      process.env = originalEnv;
    });

    it('should return a 400 status code when no ingredients are provided', async () => {
      req.body.ingredients = [];

      await RecipesController.apiGenerateRecipe(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Recipe ingredients are required',
      });
    });

    it('should generate a recipe based on the provided ingredients', async () => {
      const mockResponse = {
        response: {
          text: jest.fn().mockReturnValueOnce(
            JSON.stringify({
              name: 'Chicken Biryani',
              description: 'Indian cuisine Non-veg diet ready in 30 minutes',
              ingredients: ['1 cup rice', '200g chicken', '1 tbsp oil'],
              instructions: [
                'Rinse the rice and soak for 10 minutes',
                'Heat oil in a pan and cook the chicken',
                'Add rice and cook for 20 minutes',
              ],
            })
          ),
        },
      };

      GoogleGenerativeAI.mockImplementation(() => ({
        getGenerativeModel: jest.fn().mockReturnValue({
          generateContent: jest.fn().mockResolvedValue(mockResponse),
        }),
      }));

      await RecipesController.apiGenerateRecipe(req, res);

      expect(res.json).toHaveBeenCalledWith({
        generatedRecipe: {
          name: 'Chicken Biryani',
          description: 'Indian cuisine Non-veg diet ready in 30 minutes',
          ingredients: ['1 cup rice', '200g chicken', '1 tbsp oil'],
          instructions: [
            'Rinse the rice and soak for 10 minutes',
            'Heat oil in a pan and cook the chicken',
            'Add rice and cook for 20 minutes',
          ],
        },
      });
    });

    it('should handle errors during recipe generation', async () => {
      const errorMessage = 'Failed to generate response';
      GoogleGenerativeAI.mockImplementation(() => ({
        getGenerativeModel: jest.fn().mockReturnValue({
          generateContent: jest.fn().mockRejectedValue(new Error(errorMessage)),
        }),
      }));

      await RecipesController.apiGenerateRecipe(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Failed to generate response',
        error: errorMessage,
      });
    });

    it('should include the cuisine in the recipe description', async () => {
      const mockResponse = {
        response: {
          text: jest.fn().mockReturnValueOnce(
            JSON.stringify({
              name: 'Chicken Biryani',
              description: 'Indian cuisine Non-veg diet ready in 30 minutes',
              ingredients: ['1 cup rice', '200g chicken', '1 tbsp oil'],
              instructions: [
                'Rinse the rice and soak for 10 minutes',
                'Heat oil in a pan and cook the chicken',
                'Add rice and cook for 20 minutes',
              ],
            })
          ),
        },
      };

      GoogleGenerativeAI.mockImplementation(() => ({
        getGenerativeModel: jest.fn().mockReturnValue({
          generateContent: jest.fn().mockResolvedValue(mockResponse),
        }),
      }));

      await RecipesController.apiGenerateRecipe(req, res);

      expect(res.json).toHaveBeenCalledWith({
        generatedRecipe: {
          name: 'Chicken Biryani',
          description: expect.stringContaining('Indian cuisine'),
          ingredients: ['1 cup rice', '200g chicken', '1 tbsp oil'],
          instructions: [
            'Rinse the rice and soak for 10 minutes',
            'Heat oil in a pan and cook the chicken',
            'Add rice and cook for 20 minutes',
          ],
        },
      });
    });

    it('should include the dietary requirements in the recipe description', async () => {
      const mockResponse = {
        response: {
          text: jest.fn().mockReturnValueOnce(
            JSON.stringify({
              name: 'Chicken Biryani',
              description: 'Indian cuisine Non-veg diet ready in 30 minutes',
              ingredients: ['1 cup rice', '200g chicken', '1 tbsp oil'],
              instructions: [
                'Rinse the rice and soak for 10 minutes',
                'Heat oil in a pan and cook the chicken',
                'Add rice and cook for 20 minutes',
              ],
            })
          ),
        },
      };

      GoogleGenerativeAI.mockImplementation(() => ({
        getGenerativeModel: jest.fn().mockReturnValue({
          generateContent: jest.fn().mockResolvedValue(mockResponse),
        }),
      }));

      await RecipesController.apiGenerateRecipe(req, res);

      expect(res.json).toHaveBeenCalledWith({
        generatedRecipe: {
          name: 'Chicken Biryani',
          description: expect.stringContaining('Non-veg diet'),
          ingredients: ['1 cup rice', '200g chicken', '1 tbsp oil'],
          instructions: [
            'Rinse the rice and soak for 10 minutes',
            'Heat oil in a pan and cook the chicken',
            'Add rice and cook for 20 minutes',
          ],
        },
      });
    });

    it('should include the maximum cooking time in the recipe description', async () => {
      const mockResponse = {
        response: {
          text: jest.fn().mockReturnValueOnce(
            JSON.stringify({
              name: 'Chicken Biryani',
              description: 'Indian cuisine Non-veg diet ready in 30 minutes',
              ingredients: ['1 cup rice', '200g chicken', '1 tbsp oil'],
              instructions: [
                'Rinse the rice and soak for 10 minutes',
                'Heat oil in a pan and cook the chicken',
                'Add rice and cook for 20 minutes',
              ],
            })
          ),
        },
      };

      GoogleGenerativeAI.mockImplementation(() => ({
        getGenerativeModel: jest.fn().mockReturnValue({
          generateContent: jest.fn().mockResolvedValue(mockResponse),
        }),
      }));

      await RecipesController.apiGenerateRecipe(req, res);

      expect(res.json).toHaveBeenCalledWith({
        generatedRecipe: {
          name: 'Chicken Biryani',
          description: expect.stringContaining('ready in 30 minutes'),
          ingredients: ['1 cup rice', '200g chicken', '1 tbsp oil'],
          instructions: [
            'Rinse the rice and soak for 10 minutes',
            'Heat oil in a pan and cook the chicken',
            'Add rice and cook for 20 minutes',
          ],
        },
      });
    });

    it('should include the correct ingredients in the generated recipe', async () => {
      const mockResponse = {
        response: {
          text: jest.fn().mockReturnValueOnce(
            JSON.stringify({
              name: 'Chicken Biryani',
              description: 'Indian cuisine Non-veg diet ready in 30 minutes',
              ingredients: ['1 cup rice', '200g chicken', '1 tbsp oil'],
              instructions: [
                'Rinse the rice and soak for 10 minutes',
                'Heat oil in a pan and cook the chicken',
                'Add rice and cook for 20 minutes',
              ],
            })
          ),
        },
      };

      GoogleGenerativeAI.mockImplementation(() => ({
        getGenerativeModel: jest.fn().mockReturnValue({
          generateContent: jest.fn().mockResolvedValue(mockResponse),
        }),
      }));

      await RecipesController.apiGenerateRecipe(req, res);

      expect(res.json).toHaveBeenCalledWith({
        generatedRecipe: {
          name: 'Chicken Biryani',
          description: 'Indian cuisine Non-veg diet ready in 30 minutes',
          ingredients: ['1 cup rice', '200g chicken', '1 tbsp oil'],
          instructions: [
            'Rinse the rice and soak for 10 minutes',
            'Heat oil in a pan and cook the chicken',
            'Add rice and cook for 20 minutes',
          ],
        },
      });
    });

    it('should include the correct instructions in the generated recipe', async () => {
      const mockResponse = {
        response: {
          text: jest.fn().mockReturnValueOnce(
            JSON.stringify({
              name: 'Chicken Biryani',
              description: 'Indian cuisine Non-veg diet ready in 30 minutes',
              ingredients: ['1 cup rice', '200g chicken', '1 tbsp oil'],
              instructions: [
                'Rinse the rice and soak for 10 minutes',
                'Heat oil in a pan and cook the chicken',
                'Add rice and cook for 20 minutes',
              ],
            })
          ),
        },
      };

      GoogleGenerativeAI.mockImplementation(() => ({
        getGenerativeModel: jest.fn().mockReturnValue({
          generateContent: jest.fn().mockResolvedValue(mockResponse),
        }),
      }));

      await RecipesController.apiGenerateRecipe(req, res);

      expect(res.json).toHaveBeenCalledWith({
        generatedRecipe: {
          name: 'Chicken Biryani',
          description: 'Indian cuisine Non-veg diet ready in 30 minutes',
          ingredients: ['1 cup rice', '200g chicken', '1 tbsp oil'],
          instructions: [
            'Rinse the rice and soak for 10 minutes',
            'Heat oil in a pan and cook the chicken',
            'Add rice and cook for 20 minutes',
          ],
        },
      });
    });

    it('should handle invalid JSON responses', async () => {
      const mockResponse = {
        response: {
          text: jest.fn().mockReturnValueOnce('Invalid JSON response'),
        },
      };

      GoogleGenerativeAI.mockImplementation(() => ({
        getGenerativeModel: jest.fn().mockReturnValue({
          generateContent: jest.fn().mockResolvedValue(mockResponse),
        }),
      }));

      await RecipesController.apiGenerateRecipe(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Failed to generate response',
        error: expect.any(String),
      });
    });

    it('should handle missing API keys', async () => {
      // Temporarily remove the API key for this specific test
      delete process.env.GEMINI_API_KEY;

      await RecipesController.apiGenerateRecipe(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Failed to generate response',
        error: 'API key is missing',
      });
    });
  });


  /*
  * TESTS ADDED BY AGALA2
  */

  let req, res;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Setup request and response objects
    req = {
      method: "POST",
      body: {},
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  // Test 16
  test("apiAiChef rejects non-POST requests", async () => {
    req.method = "GET";
    
    await RecipesController.apiAiChef(req, res);
    
    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.json).toHaveBeenCalledWith({ message: "Method not allowed" });
  });

  // Test 17
  test("apiAiChef calls Gemini API with correct parameters", async () => {
    // Mock the Gemini API
    const generateContentMock = jest.fn().mockResolvedValue({
      response: { text: jest.fn().mockReturnValue("AI response") }
    });
    
    const getGenerativeModelMock = jest.fn().mockReturnValue({
      generateContent: generateContentMock
    });
    
    GoogleGenerativeAI.mockImplementation(() => ({
      getGenerativeModel: getGenerativeModelMock
    }));
    
    // Setup request
    req.method = "POST";
    req.body = {
      context: {
        recipeName: "Test Recipe",
        instructions: "Test instructions",
        dietType: "Vegetarian",
        query: "What can I substitute for eggs?"
      }
    };
    
    // Call the function
    await RecipesController.apiAiChef(req, res);
    
    // Verify Gemini API was called correctly
    expect(getGenerativeModelMock).toHaveBeenCalledWith({ model: "gemini-2.0-flash" });
    expect(generateContentMock).toHaveBeenCalledWith(expect.stringContaining("Test Recipe"));
    expect(generateContentMock).toHaveBeenCalledWith(expect.stringContaining("Vegetarian"));
    expect(generateContentMock).toHaveBeenCalledWith(expect.stringContaining("Test instructions"));
    expect(generateContentMock).toHaveBeenCalledWith(expect.stringContaining("What can I substitute for eggs?"));
  });

  // Test 18
  test("apiAiChef returns Gemini API response", async () => {
    // Mock the Gemini API
    const generateContentMock = jest.fn().mockResolvedValue({
      response: { text: jest.fn().mockReturnValue("AI response") }
    });
    
    const getGenerativeModelMock = jest.fn().mockReturnValue({
      generateContent: generateContentMock
    });
    
    GoogleGenerativeAI.mockImplementation(() => ({
      getGenerativeModel: getGenerativeModelMock
    }));
    
    // Setup request
    req.method = "POST";
    req.body = {
      context: {
        recipeName: "Test Recipe",
        instructions: "Test instructions",
        dietType: "Vegetarian",
        query: "What can I substitute for eggs?"
      }
    };
    
    // Call the function
    await RecipesController.apiAiChef(req, res);
    
    // Verify response
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ response: "AI response" });
  });

  // Test 19
  test("apiAiChef handles API errors", async () => {
    // Mock the Gemini API to throw an error
    const generateContentMock = jest.fn().mockRejectedValue(new Error("API Error"));
    
    const getGenerativeModelMock = jest.fn().mockReturnValue({
      generateContent: generateContentMock
    });
    
    GoogleGenerativeAI.mockImplementation(() => ({
      getGenerativeModel: getGenerativeModelMock
    }));
    
    // Setup request
    req.method = "POST";
    req.body = {
      context: {
        recipeName: "Test Recipe",
        instructions: "Test instructions",
        dietType: "Vegetarian",
        query: "What can I substitute for eggs?"
      }
    };
    
    // Call the function
    await RecipesController.apiAiChef(req, res);
    
    // Verify error handling
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Failed to get AI suggestions",
      error: "API Error"
    });
  });

  // Test 20
  test("apiAiChef handles missing context data", async () => {
    // Setup request with missing context
    req.method = "POST";
    req.body = {};
    
    // Call the function
    await RecipesController.apiAiChef(req, res);
    
    // Verify error handling
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Failed to get AI suggestions",
      error: expect.any(String)
    });
  });
  
  // Test 21
  test("apiAiChef handles empty parameters", async () => {
    // Mock the Gemini API
    const generateContentMock = jest.fn().mockResolvedValue({
      response: { text: jest.fn().mockReturnValue("AI response") }
    });
    
    const getGenerativeModelMock = jest.fn().mockReturnValue({
      generateContent: generateContentMock
    });
    
    GoogleGenerativeAI.mockImplementation(() => ({
      getGenerativeModel: getGenerativeModelMock
    }));
    
    // Setup request with empty parameters
    req.method = "POST";
    req.body = {
      context: {
        recipeName: "",
        instructions: "",
        dietType: "",
        query: "What can I substitute?"
      }
    };
    
    // Call the function
    await RecipesController.apiAiChef(req, res);
    
    // Verify Gemini API was still called
    expect(generateContentMock).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });
  
  // Test 22
  test("apiAiChef constructs prompt with recipe context", async () => {
    // Mock the Gemini API
    const generateContentMock = jest.fn().mockResolvedValue({
      response: { text: jest.fn().mockReturnValue("AI response") }
    });
    
    const getGenerativeModelMock = jest.fn().mockReturnValue({
      generateContent: generateContentMock
    });
    
    GoogleGenerativeAI.mockImplementation(() => ({
      getGenerativeModel: getGenerativeModelMock
    }));
    
    // Setup request
    req.method = "POST";
    req.body = {
      context: {
        recipeName: "Chocolate Cake",
        instructions: "Mix flour, sugar, and eggs...",
        dietType: "Vegetarian",
        query: "Can I make this vegan?"
      }
    };
    
    // Call the function
    await RecipesController.apiAiChef(req, res);
    
    // Verify prompt construction
    const expectedPromptParts = [
      "Recipe: Chocolate Cake",
      "Diet Type: Vegetarian",
      "Instructions: Mix flour, sugar, and eggs...",
      "User's Question: Can I make this vegan?"
    ];
    
    expectedPromptParts.forEach(part => {
      expect(generateContentMock).toHaveBeenCalledWith(expect.stringContaining(part));
    });
  });
  
  // Test 23
  test("apiAiChef uses the correct Gemini model", async () => {
    // Mock the Gemini API
    const generateContentMock = jest.fn().mockResolvedValue({
      response: { text: jest.fn().mockReturnValue("AI response") }
    });
    
    const getGenerativeModelMock = jest.fn().mockReturnValue({
      generateContent: generateContentMock
    });
    
    GoogleGenerativeAI.mockImplementation(() => ({
      getGenerativeModel: getGenerativeModelMock
    }));
    
    // Setup request
    req.method = "POST";
    req.body = {
      context: {
        recipeName: "Test Recipe",
        instructions: "Test instructions",
        dietType: "Vegetarian",
        query: "What can I substitute for eggs?"
      }
    };
    
    // Call the function
    await RecipesController.apiAiChef(req, res);
    
    // Verify correct model is used
    expect(getGenerativeModelMock).toHaveBeenCalledWith({ model: "gemini-2.0-flash" });
  });
  
  // Test 24
  test("apiAiChef uses environment variable for API key", async () => {
    // Mock environment variable
    const originalEnv = process.env;
    process.env = { ...originalEnv, GEMINI_API_KEY: "test-api-key" };
    
    // Mock the Gemini API
    const generateContentMock = jest.fn().mockResolvedValue({
      response: { text: jest.fn().mockReturnValue("AI response") }
    });
    
    const getGenerativeModelMock = jest.fn().mockReturnValue({
      generateContent: generateContentMock
    });
    
    GoogleGenerativeAI.mockImplementation(() => ({
      getGenerativeModel: getGenerativeModelMock
    }));
    
    // Setup request
    req.method = "POST";
    req.body = {
      context: {
        recipeName: "Test Recipe",
        instructions: "Test instructions",
        dietType: "Vegetarian",
        query: "What can I substitute for eggs?"
      }
    };
    
    // Call the function
    await RecipesController.apiAiChef(req, res);
    
    // Verify API key is used
    expect(GoogleGenerativeAI).toHaveBeenCalledWith("test-api-key");
    
    // Restore environment
    process.env = originalEnv;
  });
  
  // Test 25
  test("apiAiChef logs console message when called", async () => {
    // Mock console.log
    const originalConsoleLog = console.log;
    console.log = jest.fn();
    
    // Mock the Gemini API
    const generateContentMock = jest.fn().mockResolvedValue({
      response: { text: jest.fn().mockReturnValue("AI response") }
    });
    
    const getGenerativeModelMock = jest.fn().mockReturnValue({
      generateContent: generateContentMock
    });
    
    GoogleGenerativeAI.mockImplementation(() => ({
      getGenerativeModel: getGenerativeModelMock
    }));
    
    // Setup request
    req.method = "POST";
    req.body = {
      context: {
        recipeName: "Test Recipe",
        instructions: "Test instructions",
        dietType: "Vegetarian",
        query: "What can I substitute for eggs?"
      }
    };
    
    // Call the function
    await RecipesController.apiAiChef(req, res);
    
    // Verify console.log was called
    expect(console.log).toHaveBeenCalledWith("Lemme see what I can do!");
    
    // Restore console.log
    console.log = originalConsoleLog;
  });
});