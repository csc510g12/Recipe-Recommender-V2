const { TextEncoder, TextDecoder } = require("util");

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

const RecipesController = require('../api/recipes.controller').default;
const { GoogleGenerativeAI } = require('@google/generative-ai');

jest.mock('@google/generative-ai');

describe('RecipesController', () => {
  describe('apiGenerateRecipe', () => {
    let req, res;

    beforeEach(() => {
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

      console.log(res.json.mock.calls);

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
      process.env.GEMINI_API_KEY = '';

      await RecipesController.apiGenerateRecipe(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Failed to generate response',
        error: 'API key is missing',
      });
    });
  });
});