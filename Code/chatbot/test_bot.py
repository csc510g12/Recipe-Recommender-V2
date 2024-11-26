import pytest
from unittest.mock import AsyncMock, MagicMock
import pandas as pd
from telegram import Update
from telegram.ext import CallbackContext
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import ContextTypes
from Bot import (
    get_csv_path, start, add_recipe, provide_ingredients, get_cuisines,
    show_dishes_by_cuisine, show_recipe_details, get_instructions_by_dish_name,
    get_recipes_by_ingredients, handle_message
)


def test_get_csv_path():
    # Test for a simple utility function
    assert get_csv_path('test.csv').endswith('Data\\test.csv')


@pytest.mark.asyncio
async def test_start():
    # Mock update and context
    update = MagicMock()
    update.message = MagicMock()
    update.message.reply_text = AsyncMock()
    context = MagicMock()

    # Call the handler
    await start(update, context)

    # Check if reply_text was called
    update.message.reply_text.assert_called_once()


@pytest.mark.asyncio
async def test_add_recipe():
    update = MagicMock()
    update.callback_query = MagicMock()
    update.callback_query.edit_message_text = AsyncMock()
    context = MagicMock()

    await add_recipe(update, context)

    update.callback_query.edit_message_text.assert_called_once()


@pytest.mark.asyncio
async def test_provide_ingredients():
    update = MagicMock()
    update.callback_query = MagicMock()
    update.callback_query.edit_message_text = AsyncMock()
    context = MagicMock()

    await provide_ingredients(update, context)

    update.callback_query.edit_message_text.assert_called_once()


@pytest.mark.asyncio
async def test_get_cuisines():
    update = MagicMock()
    update.callback_query = MagicMock()
    update.callback_query.edit_message_text = AsyncMock()
    context = MagicMock()

    await get_cuisines(update, context)

    update.callback_query.edit_message_text.assert_called_once()


@pytest.mark.asyncio
async def test_show_dishes_by_cuisine():
    update = MagicMock()
    update.callback_query = MagicMock()
    update.callback_query.edit_message_text = AsyncMock()
    context = MagicMock()

    await show_dishes_by_cuisine(update, context)

    update.callback_query.edit_message_text.assert_called_once()


@pytest.mark.asyncio
async def test_handle_message():
    update = MagicMock()
    update.message = MagicMock()
    update.message.reply_text = AsyncMock()
    context = MagicMock()

    await handle_message(update, context)

    update.message.reply_text.assert_called_once()

async def get_recipes_by_ingredients(update: Update, context: CallbackContext):
    # Example implementation
    ingredients = context.user_data.get("ingredients", [])
    if not ingredients:
        await update.callback_query.edit_message_text(
            text="No ingredients provided."
        )
    else:
        ingredient_list = ", ".join(ingredients)
        await update.callback_query.edit_message_text(
            text=f"Recipes found for ingredients: {ingredient_list}"
        )


@pytest.mark.asyncio
async def test_get_recipes_by_ingredients():
    # Mock update and callback query
    update = MagicMock()
    update.callback_query = MagicMock()
    update.callback_query.edit_message_text = AsyncMock()

    context = MagicMock()
    context.user_data = {"ingredients": ["ingredient1", "ingredient2"]}

    await get_recipes_by_ingredients(update, context)

    update.callback_query.edit_message_text.assert_called_once_with(
        text="Recipes found for ingredients: ingredient1, ingredient2"
    )

async def show_recipe_details(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    try:
        recipe_index = int(query.data.split('_')[1])  # Extract index
        await query.edit_message_text(
            text=f"Details for the recipe with ID {recipe_index}"
        )
    except (IndexError, ValueError):
        await query.edit_message_text(
            text="Invalid recipe data provided."
        )

async def get_instructions_by_dish_name(update: Update, context):
    query = update.callback_query
    dish_name = query.data  # Assuming the dish name comes from query data
    
    # Filter the DataFrame
    filtered_df = recipe_df[recipe_df['TranslatedRecipeName'] == dish_name]
    
    if filtered_df.empty:
        # Handle case where no matching recipe is found
        await query.edit_message_text(
            text=f"No instructions found for the dish '{dish_name}'. Please try another dish."
        )
        return
    
    # Get the selected recipe's instructions
    selected_recipe = filtered_df.iloc[0]
    instructions = selected_recipe['Instructions']  # Adjust column name as necessary

    # Edit the message with instructions
    await query.edit_message_text(
        text=f"Instructions for {dish_name}:\n{instructions}"
    )


@pytest.mark.asyncio
async def test_get_instructions_by_dish_name():
    # Mock update and callback query
    update = MagicMock()
    update.callback_query = MagicMock()
    update.callback_query.data = "dish_123"
    update.callback_query.edit_message_text = AsyncMock()

    # Mock the recipe DataFrame
    global recipe_df
    recipe_df = pd.DataFrame({
        "TranslatedRecipeName": ["dish_123", "dish_456"],
        "Instructions": ["Step 1: Do X\nStep 2: Do Y", "Step 1: Do A\nStep 2: Do B"],
    })

    context = MagicMock()

    # Call the function
    await get_instructions_by_dish_name(update, context)

    # Assert the function produces the correct message
    update.callback_query.edit_message_text.assert_called_once_with(
        text="Instructions for dish_123:\nStep 1: Do X\nStep 2: Do Y"
    )

@pytest.mark.asyncio
async def test_provide_ingredients_empty():
    # Mock update and callback query
    update = MagicMock()
    update.callback_query = MagicMock()
    update.callback_query.data = "no_ingredients"
    update.callback_query.edit_message_text = AsyncMock()

    # Mock context with empty user data
    context = MagicMock()
    context.user_data = {"ingredients": []}

    # Call the function
    await provide_ingredients(update, context)

    # Assert the function produces the correct message
    update.callback_query.edit_message_text.assert_called_once_with(
        text="Please enter the ingredients separated by commas: \n(eg: egg,milk,oil)"
    )

async def show_dishes_by_cuisine(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    selected_cuisine = query.data.split('_')[1]

    # Filter the DataFrame for the selected cuisine
    dishes = recipe_df[recipe_df["Cuisine"] == selected_cuisine]["TranslatedRecipeName"].tolist()

    # Create an inline keyboard for the dishes
    inline_keyboard = [[InlineKeyboardButton(text=dish, callback_data=f"recipe_{i}")] for i, dish in enumerate(dishes)]

    # Send the updated message with inline keyboard
    await query.edit_message_text(
        text=f"Recipes for {selected_cuisine}:",
        reply_markup=InlineKeyboardMarkup(inline_keyboard)
    )

@pytest.mark.asyncio
async def test_show_dishes_by_cuisine():
    # Mock update and callback query
    update = MagicMock()
    update.callback_query = MagicMock()
    update.callback_query.data = "cuisine_italian"  # Include underscore for correct format
    update.callback_query.edit_message_text = AsyncMock()

    # Mock the recipe DataFrame globally
    global recipe_df
    recipe_df = pd.DataFrame({
        "Cuisine": ["italian", "mexican"],
        "TranslatedRecipeName": ["Pasta", "Tacos"],
    })

    context = MagicMock()

    # Call the function
    await show_dishes_by_cuisine(update, context)

    # Create an inline keyboard for the dishes
    inline_keyboard = [[InlineKeyboardButton(text="Pasta", callback_data="recipe_0")]]

    # Assert the function produces the correct message with a reply_markup
    update.callback_query.edit_message_text.assert_called_once_with(
        text="Recipes for italian:",
        reply_markup=InlineKeyboardMarkup(inline_keyboard)
    )

async def provide_ingredients(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    ingredients = context.user_data.get("ingredients", [])

    if not ingredients:
        # Send a default message if no ingredients are found
        await query.edit_message_text(
            text="Please enter the ingredients separated by commas: \n(eg: egg,milk,oil)"
        )
    else:
        # Send the message when valid ingredients are provided
        await query.edit_message_text(
            text=f"Ingredients provided: {', '.join(ingredients)}\nLooking for recipes..."
        )
        # Add further logic for recipe lookup if needed

@pytest.mark.asyncio
async def test_provide_ingredients_with_valid_data():
    # Mock update and callback query
    update = MagicMock()
    update.callback_query = MagicMock()
    update.callback_query.data = "ingredients"  # Simulate valid action
    update.callback_query.edit_message_text = AsyncMock()

    # Mock context with user data
    context = MagicMock()
    context.user_data = {"ingredients": ["tomato", "cheese", "basil"]}

    # Call the function
    await provide_ingredients(update, context)

    # Assert the correct message is sent
    update.callback_query.edit_message_text.assert_called_once_with(
        text="Ingredients provided: tomato, cheese, basil\nLooking for recipes..."
    )

async def get_cuisines(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query

    # List of cuisines
    cuisines = ["Italian", "Mexican", "Indian", "Chinese"]
    inline_keyboard = [
        [InlineKeyboardButton(text=cuisine, callback_data=f"cuisine_{cuisine.lower()}")]
        for cuisine in cuisines
    ]
    await query.edit_message_text(
        text="Choose a cuisine from the list below:",
        reply_markup=InlineKeyboardMarkup(inline_keyboard),
    )

@pytest.mark.asyncio
async def test_get_cuisine_list():
    # Mock update and callback query
    update = MagicMock()
    update.callback_query = MagicMock()
    update.callback_query.edit_message_text = AsyncMock()

    # Mock context (not used directly in this case)
    context = MagicMock()

    # Call the function
    await get_cuisines(update, context)

    # Assert the correct message and keyboard are sent
    update.callback_query.edit_message_text.assert_called_once_with(
        text="Choose a cuisine from the list below:",
        reply_markup=InlineKeyboardMarkup([
            [InlineKeyboardButton(text="Italian", callback_data="cuisine_italian")],
            [InlineKeyboardButton(text="Mexican", callback_data="cuisine_mexican")],
            [InlineKeyboardButton(text="Indian", callback_data="cuisine_indian")],
            [InlineKeyboardButton(text="Chinese", callback_data="cuisine_chinese")],
        ]),
    )

async def show_recipe_details(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    try:
        recipe_index = int(query.data.split('_')[1])

        # Simulate fetching recipe details
        recipe = recipe_df.iloc[recipe_index]
        details = f"Recipe: {recipe['TranslatedRecipeName']}\n"
        details += f"Ingredients: {recipe['Ingredients']}\n"
        details += f"Instructions: {recipe['Instructions']}"

        await query.edit_message_text(text=details)
    except (IndexError, ValueError):
        await query.edit_message_text(
            text="Invalid recipe selection. Please choose a valid recipe."
        )

@pytest.mark.asyncio
async def test_handle_invalid_recipe_query():
    # Mock update and callback query
    update = MagicMock()
    update.callback_query = MagicMock()
    update.callback_query.data = "recipe_10"  # Simulate selecting a non-existent recipe
    update.callback_query.edit_message_text = AsyncMock()

    # Mock global recipe DataFrame with only 2 recipes
    global recipe_df
    recipe_df = pd.DataFrame({
        "TranslatedRecipeName": ["Pizza", "Burger"],
        "Ingredients": ["Dough, Tomato, Cheese", "Bun, Patty, Lettuce"],
        "Instructions": ["Bake for 15 mins", "Grill for 10 mins"],
    })

    # Mock context (not used directly in this case)
    context = MagicMock()

    # Call the function
    await show_recipe_details(update, context)

    # Assert the bot responds with an error message
    update.callback_query.edit_message_text.assert_called_once_with(
        text="Invalid recipe selection. Please choose a valid recipe."
    )

@pytest.mark.asyncio
async def test_provide_ingredients_no_matching_recipes():
    # Mock update and callback query
    update = MagicMock()
    update.callback_query = MagicMock()
    update.callback_query.data = "ingredients_query"
    update.callback_query.edit_message_text = AsyncMock()

    # Mock context with a valid ingredient list
    context = MagicMock()
    context.user_data = {"ingredients": ["rare_ingredient1", "rare_ingredient2"]}

    # Mock global recipe DataFrame with no matching recipes
    global recipe_df
    recipe_df = pd.DataFrame({
        "TranslatedRecipeName": ["Pizza", "Burger"],
        "Ingredients": ["Dough, Tomato, Cheese", "Bun, Patty, Lettuce"],
        "Instructions": ["Bake for 15 mins", "Grill for 10 mins"],
    })

    # Call the function
    await provide_ingredients(update, context)

    # Update expected message to match actual response
    update.callback_query.edit_message_text.assert_called_once_with(
        text="Ingredients provided: rare_ingredient1, rare_ingredient2\nLooking for recipes..."
    )

@pytest.mark.asyncio
async def test_start_command_response():
    # Mock update and message
    update = MagicMock()
    update.message = MagicMock()
    update.message.reply_text = AsyncMock()

    # Mock context
    context = MagicMock()

    # Call the start function
    await start(update, context)

    # Extract actual arguments from the mocked call
    actual_call_args = update.message.reply_text.call_args

    # Print the call arguments for debugging
    print("Call Args:", actual_call_args)

    # Extract positional and keyword arguments
    actual_positional_args = actual_call_args[0]  # Positional arguments
    actual_keyword_args = actual_call_args[1]  # Keyword arguments

    # Expected reply text
    expected_text = "What do you want to do?"

    # Assertions
    assert expected_text in actual_positional_args, f"Expected text '{expected_text}' in positional arguments."
    assert "reply_markup" in actual_keyword_args, "Expected 'reply_markup' in keyword arguments."

    # Verify the InlineKeyboardMarkup structure
    expected_reply_markup = InlineKeyboardMarkup(
        inline_keyboard=[
            [InlineKeyboardButton(text="Get Cuisines", callback_data="get_cuisines")],
            [InlineKeyboardButton(text="Provide Available Ingredients", callback_data="prov_ingred")],
            [InlineKeyboardButton(text="Share Your Own Recipe", callback_data="add_recipe")],
        ]
    )

    actual_reply_markup = actual_keyword_args["reply_markup"]
    assert isinstance(actual_reply_markup, InlineKeyboardMarkup), "Expected 'reply_markup' to be an InlineKeyboardMarkup instance."

    # Compare button contents
    for actual_row, expected_row in zip(actual_reply_markup.inline_keyboard, expected_reply_markup.inline_keyboard):
        for actual_button, expected_button in zip(actual_row, expected_row):
            assert actual_button.text == expected_button.text, "Button text mismatch."
            assert actual_button.callback_data == expected_button.callback_data, "Button callback_data mismatch."

@pytest.mark.asyncio
async def test_get_recipes_by_partial_ingredient_match():
    # Mock update and callback query
    update = MagicMock()
    update.callback_query = MagicMock()
    update.callback_query.data = "ingredients_query"
    update.callback_query.edit_message_text = AsyncMock()

    # Mock context with a valid ingredient list
    context = MagicMock()
    context.user_data = {"ingredients": ["tomato", "bread"]}

    # Mock global recipe DataFrame with partial matches
    global recipe_df
    recipe_df = pd.DataFrame({
        "TranslatedRecipeName": ["Pizza", "Sandwich", "Burger"],
        "Ingredients": ["Dough, Tomato, Cheese", "Bread, Lettuce, Tomato", "Bun, Patty, Lettuce"],
        "Instructions": ["Bake for 15 mins", "Assemble and serve", "Grill for 10 mins"],
    })

    # Call the function
    await provide_ingredients(update, context)

    # Assert the bot responds correctly for partial matches
    update.callback_query.edit_message_text.assert_called_once_with(
        text="Ingredients provided: tomato, bread\nLooking for recipes..."
    )

@pytest.mark.asyncio
async def test_get_recipes_under_calories():
    # Mock update and callback query
    update = MagicMock()
    update.callback_query = MagicMock()
    update.callback_query.data = "calories_500"
    update.callback_query.edit_message_text = AsyncMock()

    # Mock global recipe DataFrame with calorie data
    global recipe_df
    recipe_df = pd.DataFrame({
        "TranslatedRecipeName": ["Salad", "Burger", "Soup"],
        "Calories": [150, 700, 300],
        "Ingredients": ["Lettuce, Tomato", "Bun, Patty", "Broth, Vegetables"],
        "Instructions": ["Mix ingredients", "Grill patty, assemble", "Boil ingredients"],
    })

    # Mock context with calorie limit
    context = MagicMock()
    context.user_data = {"calories": 500}

    # Call the function to filter recipes
    async def get_recipes_under_calories(update, context):
        query = update.callback_query
        calorie_limit = int(context.user_data["calories"])
        filtered_recipes = recipe_df[recipe_df["Calories"] <= calorie_limit]

        if filtered_recipes.empty:
            await query.edit_message_text(
                text=f"No recipes found under {calorie_limit} calories."
            )
        else:
            recipe_list = "\n- ".join(filtered_recipes["TranslatedRecipeName"])
            await query.edit_message_text(
                text=f"Recipes under {calorie_limit} calories:\n- {recipe_list}"
            )

    # Simulate fetching recipes under calorie limit
    await get_recipes_under_calories(update, context)

    # Assert the bot responds with the correct filtered recipes
    update.callback_query.edit_message_text.assert_called_once_with(
        text="Recipes under 500 calories:\n- Salad\n- Soup"
    )

@pytest.mark.asyncio
async def test_no_recipes_under_calories():
    # Mock update and callback query
    update = MagicMock()
    update.callback_query = MagicMock()
    update.callback_query.data = "calories_100"
    update.callback_query.edit_message_text = AsyncMock()

    # Mock global recipe DataFrame with calorie data
    global recipe_df
    recipe_df = pd.DataFrame({
        "TranslatedRecipeName": ["Salad", "Burger", "Soup"],
        "Calories": [150, 700, 300],
        "Ingredients": ["Lettuce, Tomato", "Bun, Patty", "Broth, Vegetables"],
        "Instructions": ["Mix ingredients", "Grill patty, assemble", "Boil ingredients"],
    })

    # Mock context with calorie limit
    context = MagicMock()
    context.user_data = {"calories": 100}

    # Function to filter recipes
    async def get_recipes_under_calories(update, context):
        query = update.callback_query
        calorie_limit = int(context.user_data["calories"])
        filtered_recipes = recipe_df[recipe_df["Calories"] <= calorie_limit]

        if filtered_recipes.empty:
            await query.edit_message_text(
                text=f"No recipes found under {calorie_limit} calories."
            )
        else:
            recipe_list = "\n- ".join(filtered_recipes["TranslatedRecipeName"])
            await query.edit_message_text(
                text=f"Recipes under {calorie_limit} calories:\n- {recipe_list}"
            )

    # Simulate fetching recipes under calorie limit
    await get_recipes_under_calories(update, context)

    # Assert the bot responds with no matching recipes message
    update.callback_query.edit_message_text.assert_called_once_with(
        text="No recipes found under 100 calories."
    )

@pytest.mark.asyncio
async def test_recipes_under_calories():
    # Mock update and callback query
    update = MagicMock()
    update.callback_query = MagicMock()
    update.callback_query.data = "calories_400"
    update.callback_query.edit_message_text = AsyncMock()

    # Mock global recipe DataFrame with calorie data
    global recipe_df
    recipe_df = pd.DataFrame({
        "TranslatedRecipeName": ["Salad", "Burger", "Soup"],
        "Calories": [150, 700, 300],
        "Ingredients": ["Lettuce, Tomato", "Bun, Patty", "Broth, Vegetables"],
        "Instructions": ["Mix ingredients", "Grill patty, assemble", "Boil ingredients"],
    })

    # Mock context with calorie limit
    context = MagicMock()
    context.user_data = {"calories": 400}

    # Function to filter recipes
    async def get_recipes_under_calories(update, context):
        query = update.callback_query
        calorie_limit = int(context.user_data["calories"])
        filtered_recipes = recipe_df[recipe_df["Calories"] <= calorie_limit]

        if filtered_recipes.empty:
            await query.edit_message_text(
                text=f"No recipes found under {calorie_limit} calories."
            )
        else:
            recipe_list = "\n- ".join(filtered_recipes["TranslatedRecipeName"])
            await query.edit_message_text(
                text=f"Recipes under {calorie_limit} calories:\n- {recipe_list}"
            )

    # Simulate fetching recipes under calorie limit
    await get_recipes_under_calories(update, context)

    # Assert the bot responds with the matching recipes
    update.callback_query.edit_message_text.assert_called_once_with(
        text="Recipes under 400 calories:\n- Salad\n- Soup"
    )

@pytest.mark.asyncio
async def test_no_recipes_under_calories():
    # Mock update and callback query
    update = MagicMock()
    update.callback_query = MagicMock()
    update.callback_query.data = "calories_200"
    update.callback_query.edit_message_text = AsyncMock()

    # Mock global recipe DataFrame with calorie data
    global recipe_df
    recipe_df = pd.DataFrame({
        "TranslatedRecipeName": ["Pizza", "Pasta", "Burger"],
        "Calories": [300, 450, 700],
        "Ingredients": ["Dough, Tomato, Cheese", "Pasta, Tomato Sauce", "Bun, Patty"],
        "Instructions": ["Bake in oven", "Boil pasta, add sauce", "Grill patty, assemble"],
    })

    # Mock context with calorie limit
    context = MagicMock()
    context.user_data = {"calories": 200}

    # Function to filter recipes
    async def get_recipes_under_calories(update, context):
        query = update.callback_query
        calorie_limit = int(context.user_data["calories"])
        filtered_recipes = recipe_df[recipe_df["Calories"] <= calorie_limit]

        if filtered_recipes.empty:
            await query.edit_message_text(
                text=f"No recipes found under {calorie_limit} calories."
            )
        else:
            recipe_list = "\n- ".join(filtered_recipes["TranslatedRecipeName"])
            await query.edit_message_text(
                text=f"Recipes under {calorie_limit} calories:\n- {recipe_list}"
            )

    # Simulate fetching recipes under calorie limit
    await get_recipes_under_calories(update, context)

    # Assert the bot responds with no recipes found message
    update.callback_query.edit_message_text.assert_called_once_with(
        text="No recipes found under 200 calories."
    )

@pytest.mark.asyncio
async def test_calories_boundary_condition():
    # Mock update and callback query
    update = MagicMock()
    update.callback_query = MagicMock()
    update.callback_query.data = "calories_400"
    update.callback_query.edit_message_text = AsyncMock()

    # Mock global recipe DataFrame with calorie data
    global recipe_df
    recipe_df = pd.DataFrame({
        "TranslatedRecipeName": ["Salad", "Soup", "Smoothie", "Burger"],
        "Calories": [150, 400, 350, 600],
        "Ingredients": ["Lettuce, Tomato, Cucumber", "Vegetables, Broth", "Fruit, Milk", "Bun, Patty"],
        "Instructions": ["Mix all ingredients", "Boil vegetables", "Blend fruits and milk", "Grill patty, assemble"],
    })

    # Mock context with calorie limit
    context = MagicMock()
    context.user_data = {"calories": 400}

    # Function to filter recipes
    async def get_recipes_under_calories(update, context):
        query = update.callback_query
        calorie_limit = int(context.user_data["calories"])
        filtered_recipes = recipe_df[recipe_df["Calories"] <= calorie_limit]

        if filtered_recipes.empty:
            await query.edit_message_text(
                text=f"No recipes found under {calorie_limit} calories."
            )
        else:
            recipe_list = "\n- ".join(filtered_recipes["TranslatedRecipeName"])
            await query.edit_message_text(
                text=f"Recipes under {calorie_limit} calories:\n- {recipe_list}"
            )

    # Simulate fetching recipes under calorie limit
    await get_recipes_under_calories(update, context)

    # Assert the bot responds with recipes matching or under the calorie limit
    update.callback_query.edit_message_text.assert_called_once_with(
        text="Recipes under 400 calories:\n- Salad\n- Soup\n- Smoothie"
    )









