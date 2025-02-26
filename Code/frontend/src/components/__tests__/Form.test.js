import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Form from './../Form';
import recipeDB from '../../apis/recipeDB';

// Mock the recipeDB API
jest.mock('../../apis/recipeDB');

describe('Generate Recipe Feature', () => {
  beforeEach(() => {
    recipeDB.post.mockClear();
    // Mock login state
    localStorage.setItem('userName', 'testUser');
  });

  afterEach(() => {
    // Clear localStorage after each test
    localStorage.clear();
  });

  test('should render the ingredient input element', () => {
    render(<Form />);
    const ingredientInputElement = screen.getByTestId('ingredient');
    expect(ingredientInputElement).toBeInTheDocument();
  });

  test('should render the email id input element', () => {
    render(<Form />);
    const emailInputElement = screen.getByTestId('email_id');
    expect(emailInputElement).toBeInTheDocument();
  });

  test('should render the cuisine input element', () => {
    render(<Form />);
    const cuisineInputElement = screen.getByTestId('cuisine');
    expect(cuisineInputElement).toBeInTheDocument();
  });

  test('Search button works as expected', () => {
    const handleMock = jest.fn();
    render(<Form sendFormData={handleMock} />);
    const searchRecipeButton = screen.getByTestId('submit');
    fireEvent.click(searchRecipeButton);
    expect(handleMock).toHaveBeenCalledTimes(1);
  });

  test('renders Generate Recipe button', () => {
    render(<Form />);
    const generateButton = screen.getByTestId('generate');
    expect(generateButton).toBeInTheDocument();
  });

  test('opens modal on clicking Generate Recipe button', () => {
    render(<Form />);
    const generateButton = screen.getByTestId('generate');
    fireEvent.click(generateButton);
    const modalHeader = screen.getByText('AI Generated Recipe based on your suggestions!');
    expect(modalHeader).toBeInTheDocument();
  });

  test('displays loading spinner when generating recipe', async () => {
    recipeDB.post.mockResolvedValueOnce({ data: {} });
    render(<Form />);
    const generateButton = screen.getByTestId('generate');
    fireEvent.click(generateButton);
    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();
    await waitFor(() => expect(spinner).not.toBeInTheDocument());
  });

  test('displays generated recipe in modal', async () => {
    const mockRecipe = {
      generatedRecipe: {
        name: 'Masala Chicken Bread Upma',
        description: 'A savory Indian-style bread dish.',
        ingredients: ['Bread', 'Chicken', 'Onion'],
        instructions: ['Toast the bread', 'Cook the chicken', 'Mix everything'],
      },
    };
    recipeDB.post.mockResolvedValueOnce({ data: mockRecipe });
    render(<Form />);
    const generateButton = screen.getByTestId('generate');
    fireEvent.click(generateButton);
    await waitFor(() => {
      expect(screen.getByText(mockRecipe.generatedRecipe.name)).toBeInTheDocument();
      expect(screen.getByText(mockRecipe.generatedRecipe.description)).toBeInTheDocument();
    });
  });

  test('closes modal on clicking Close button', async () => {
    render(<Form />);
    const generateButton = screen.getByTestId('generate');
    fireEvent.click(generateButton);
    const closeButton = await screen.findByText('Close');
    fireEvent.click(closeButton);
    await waitFor(() => {
      expect(screen.queryByText('AI Generated Recipe based on your suggestions!')).not.toBeInTheDocument();
    });
  });

  test('renders ingredients list correctly', async () => {
    const mockRecipe = {
      generatedRecipe: {
        name: 'Masala Chicken Bread Upma',
        description: 'A savory Indian-style bread dish.',
        ingredients: ['Bread', 'Chicken', 'Onion'],
        instructions: ['Toast the bread', 'Cook the chicken', 'Mix everything'],
      },
    };
    recipeDB.post.mockResolvedValueOnce({ data: mockRecipe });
    render(<Form />);
    const generateButton = screen.getByTestId('generate');
    fireEvent.click(generateButton);
    await waitFor(() => {
      mockRecipe.generatedRecipe.ingredients.forEach((ingredient) => {
        expect(screen.getByText(ingredient)).toBeInTheDocument();
      });
    });
  });

  test('renders instructions list correctly', async () => {
    const mockRecipe = {
      generatedRecipe: {
        name: 'Masala Chicken Bread Upma',
        description: 'A savory Indian-style bread dish.',
        ingredients: ['Bread', 'Chicken', 'Onion'],
        instructions: ['Toast the bread', 'Cook the chicken', 'Mix everything'],
      },
    };
    recipeDB.post.mockResolvedValueOnce({ data: mockRecipe });
    render(<Form />);
    const generateButton = screen.getByTestId('generate');
    fireEvent.click(generateButton);
    await waitFor(() => {
      mockRecipe.generatedRecipe.instructions.forEach((instruction) => {
        expect(screen.getByText(instruction)).toBeInTheDocument();
      });
    });
  });

  test('enables Generate Recipe button when there are ingredients', () => {
    render(<Form />);
    const ingredientInput = screen.getByPlaceholderText('Ingredients');
    fireEvent.change(ingredientInput, { target: { value: 'Chicken' } });
    fireEvent.keyDown(ingredientInput, { key: 'Enter', code: 'Enter' });
    const generateButton = screen.getByTestId('generate');
    expect(generateButton).toBeEnabled();
  });

  test('displays error message when recipe generation fails', async () => {
    recipeDB.post.mockRejectedValueOnce(new Error('Failed to generate recipe'));
    render(<Form />);
    const generateButton = screen.getByTestId('generate');
    fireEvent.click(generateButton);
    await waitFor(() => {
      expect(screen.getByText('No recipe generated')).toBeInTheDocument();
    });
  });
  
});