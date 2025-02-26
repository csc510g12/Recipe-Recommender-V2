import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
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

  // test("Clicking 'Add' button adds an ingredient", async () => {
  //   render(<Form />);
  //   const inputElement = screen.getByPlaceholderText("Ingredients");
  //   const addButton = screen.getByTestId("add-btn");
  //   expect(addButton).toBeInTheDocument();
  //   fireEvent.change(inputElement, { target: { value: "Tomato" } });
  //   fireEvent.click(addButton);
  //   const ingredientList = screen.getByRole("list", { class: "addedIngredientList" });
  //   expect(within(ingredientList).getByText("Tomato")).toBeInTheDocument();

  // });

  // test('removes an ingredient when clicked', () => {
  //   render(<Form />);
  //   const ingredientInput = screen.getByPlaceholderText('Ingredients');
  //   const addButton = screen.getByTestId('add-btn');
  
  //   fireEvent.change(ingredientInput, { target: { value: 'Tomato' } });
  //   fireEvent.click(addButton);
  
  //   const ingredientBadge = screen.getByText('Tomato');
  //   fireEvent.click(ingredientBadge);
  
  //   expect(screen.queryByText('Tomato')).not.toBeInTheDocument();
  // });

  test('submits form data correctly', () => {
    const handleMock = jest.fn();
    render(<Form sendFormData={handleMock} />);
  
    const searchButton = screen.getByTestId('submit');
    fireEvent.click(searchButton);
  
    expect(handleMock).toHaveBeenCalledWith(expect.objectContaining({
      ingredient: expect.any(Set),
      cuisine: '',
      email_id: '',
      flag: false,
      TotalTimeInMins: '',
      type: '',
    }));
  });

  test('updates max time input correctly', () => {
    render(<Form />);
    const maxTimeInput = screen.getByTestId('max_time');
  
    fireEvent.change(maxTimeInput, { target: { value: '30' } });
  
    expect(maxTimeInput.value).toBe('30');
  });
  
  test('updates type input correctly', () => {
    render(<Form />);
    const typeInput = screen.getByTestId('type');
  
    fireEvent.change(typeInput, { target: { value: 'Vegetarian' } });
  
    expect(typeInput.value).toBe('Vegetarian');
  });
  
  // test('prevents duplicate ingredients from being added', () => {
  //   render(<Form />);
  //   const ingredientInput = screen.getByPlaceholderText('Ingredients');
  //   const addButton = screen.getByTestId('add-btn');
  
  //   fireEvent.change(ingredientInput, { target: { value: 'Tomato' } });
  //   fireEvent.click(addButton);
  //   fireEvent.change(ingredientInput, { target: { value: 'Tomato' } });
  //   fireEvent.click(addButton);
  
  //   const ingredients = screen.getAllByText('Tomato');
  //   expect(ingredients.length).toBe(1);
  // });

  test('does not add empty ingredient', () => {
    render(<Form />);
    const addButton = screen.getByTestId('add-btn');
  
    fireEvent.click(addButton);
  
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
  });
  
  // test('toggles email alert checkbox correctly', () => {
  //   render(<Form />);
  //   const emailSwitch = screen.getByTestId('email-switch');
  
  //   fireEvent.click(emailSwitch);
  //   expect(emailSwitch).toHaveValue('true');
  
  //   fireEvent.click(emailSwitch);
  //   expect(emailSwitch).not.toHaveValue('true');
  // });

  // test('updates cuisine input correctly', () => {
  //   render(<Form />);
  //   const cuisineInput = screen.getByTestId('cuisine');
  
  //   fireEvent.change(cuisineInput, { target: { value: 'Italian' } });
  
  //   expect(cuisineInput.value).toBe('Italian');
  // });

  // test('modal content updates when ingredients are added', async () => {
  //   render(<Form />);
  //   const ingredientInput = screen.getByPlaceholderText('Ingredients');
  //   const addButton = screen.getByTestId('add-btn');
  //   const generateButton = screen.getByTestId('generate');
  
  //   fireEvent.change(ingredientInput, { target: { value: 'Cheese' } });
  //   fireEvent.click(addButton);
  //   fireEvent.click(generateButton);
  
  //   await waitFor(() => {
  //     expect(screen.getByText(/AI Generated Recipe based on your suggestions!/i)).toBeInTheDocument();
  //     expect(screen.getByText('Cheese')).toBeInTheDocument();
  //   });
  // });
  
  
  // test('suggests "Italian" when typing "Itali" in the cuisine input', async () => {
  //   render(<Form />);
  //   const cuisineInput = screen.getByPlaceholderText('Cuisine');
    
  //   fireEvent.change(cuisineInput, { target: { value: 'Itali' } });
    
  //   await waitFor(() => {
  //     expect(screen.getByText('Italian')).toBeInTheDocument();
  //   });
  // });
  
  
});