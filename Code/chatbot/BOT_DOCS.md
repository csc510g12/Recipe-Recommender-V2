# Recipe Recommender Bot Documentation

## Features

### 1. Browse Recipes by Cuisine

Users can explore recipes organized by cuisine type. The bot presents a list of available cuisines, and users can select a cuisine to view available recipes within that category.

- The bot displays up to 20 random recipes from the selected cuisine
- Each recipe includes detailed ingredients and step-by-step cooking instructions
- Instructions are formatted with bullet points and numbered steps for easy reading

### 2. Find Recipes Based on Ingredients

Users can enter ingredients they have on hand, and the bot will suggest recipes that can be made with those ingredients.

- Users provide a comma-separated list of ingredients
- The bot searches its database for recipes containing one or more of the specified ingredients
- If matches are found, the bot randomly selects and displays a recipe with detailed instructions
- If no matches are found, the bot notifies the user

### 3. AI Recipe Generation with Chef Gemini

Users can request custom AI-generated recipes based on their preferences using Google's Gemini 2.0 Flash AI model.

- The bot guides users through a conversational flow to collect their preferences:
  - Available ingredients
  - Preferred cuisine (optional)
  - Dietary requirements (optional)
  - Maximum cooking time (optional)
- The AI generates a personalized recipe with:
  - Recipe name
  - Brief description
  - Ingredient list with measurements
  - Step-by-step cooking instructions

## Using the Bot

### Starting the Bot

To start the bot, send the `/start` command. The bot will respond with three options:
- Get recipe of selected cuisine
- Provide ingredients for recipe
- Generate AI recipe with Chef Gemini

### Browsing Recipes by Cuisine

1. Select "Get recipe of selected cuisine"
2. Choose a cuisine from the list
3. Select a recipe from the displayed options
4. View the full recipe with ingredients and instructions

### Finding Recipes by Ingredients

1. Select "Provide ingredients for recipe"
2. Enter your ingredients separated by commas (e.g., "egg,milk,oil")
3. The bot will suggest a recipe using your ingredients
4. View the full recipe with ingredients and instructions

### Generating AI Recipes

1. Select "Generate AI recipe with Chef Gemini"
2. Enter the ingredients you have available (separated by commas)
3. Optionally select a cuisine or skip this step
4. Specify any dietary requirements (e.g., vegetarian, vegan, gluten-free) or type "none"
5. Enter maximum cooking time in minutes or type "none" for no limit
6. Wait a moment while the AI generates your personalized recipe
7. View the AI-generated recipe with name, description, ingredients, and instructions

## Technical Information

### Data Source

The bot uses the same CSV file as the web app (`final_recipe_recommender.csv`) containing recipes with the following information:
- Recipe names
- Cuisines
- Ingredients
- Step-by-step instructions

### Dependencies

The bot requires the following Python packages:
- python-telegram-bot
- pandas
- python-dotenv
- google-generativeai

### Environment Variables

To run the bot, you need to set up the following environment variables:
- `TELEGRAM_BOT_TOKEN`: Your Telegram bot token obtained from BotFather
- `GEMINI_API_KEY`: Your Google Gemini API key for AI recipe generation