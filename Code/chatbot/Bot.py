"""
Copyright (C) 2024 SE Recipe Recommender - All Rights Reserved
You may use, distribute and modify this code under the
terms of the MIT license.
You should have received a copy of the MIT license with
this file. If not, please write to: secheaper@gmail.com

"""

from telegram import Update
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes, CallbackQueryHandler, ConversationHandler
from telegram import InlineKeyboardButton, InlineKeyboardMarkup
from dotenv import load_dotenv
import pandas as pd
import os
import random
import json
import re
from google import genai

load_dotenv()

# Method to get correct CSV file path
def get_csv_path(filename=''):
    return os.path.dirname(__file__).replace('Code\\chatbot', 'Data\\') + filename 

bot_token = os.environ.get('TELEGRAM_BOT_TOKEN')
gemini_api_key = os.environ.get('GEMINI_API_KEY')

client = genai.Client(api_key=gemini_api_key)
app = Application.builder().token(bot_token).build()
recipe_df = pd.read_csv(get_csv_path('final_recipe_recommender.csv'))

# AI recipe conversation states
AWAITING_INGREDIENTS, AWAITING_CUISINE, AWAITING_DIET, AWAITING_MAX_TIME = range(4)

# Helper function to clean and parse JSON data
def parse_json(raw_input):
    try:
        return json.loads(raw_input)
    except json.JSONDecodeError:
        pass
    
    json_pattern = r'```(?:json)?\s*([\s\S]*?)```'
    match = re.search(json_pattern, raw_input)
    
    if match and match.group(1):
        try:
            return json.loads(match.group(1))
        except json.JSONDecodeError:
            pass
    
    json_pattern = r'(\{[\s\S]*\})'
    match = re.search(json_pattern, raw_input)
    
    if match and match.group(1):
        try:
            return json.loads(match.group(1))
        except json.JSONDecodeError:
            pass
    
    return None

# Methods to reply to the user
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    keyboard = [
        [InlineKeyboardButton("Get recipe of selected cuisine", callback_data='get_cuisines')],
        [InlineKeyboardButton("Provide ingredients for recipe", callback_data='prov_ingred')],
        [InlineKeyboardButton("Generate AI recipe with Chef Gemini", callback_data='gen_ai_recipe')],
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    await update.message.reply_text('What do you want to do?', reply_markup=reply_markup)

async def provide_ingredients(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.edit_message_text(text="Please enter the ingredients separated by commas: \n(eg: egg,milk,oil)")
    context.user_data['awaiting_ingredients_input'] = True

async def get_cuisines(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    cuisines = recipe_df['Cuisine'].unique()
    keyboard = [[InlineKeyboardButton(cuisine, callback_data=f'cuisine_{cuisine}')] for cuisine in cuisines]
    reply_markup = InlineKeyboardMarkup(keyboard)
    await query.edit_message_text(text="Select a cuisine:", reply_markup=reply_markup)

async def show_dishes_by_cuisine(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    selected_cuisine = query.data.split('_')[1]
    dishes = recipe_df[recipe_df['Cuisine'] == selected_cuisine]['TranslatedRecipeName'].tolist()
    random_dishes = random.sample(dishes, min(20, len(dishes)))
    keyboard = [[InlineKeyboardButton(dish, callback_data=f'recipe_{i}')] for i, dish in enumerate(random_dishes)]
    context.user_data['random_dishes'] = random_dishes
    reply_markup = InlineKeyboardMarkup(keyboard)
    await query.edit_message_text(text=f"Recipes for {selected_cuisine}:", reply_markup=reply_markup)

async def show_recipe_details(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    recipe_index = int(query.data.split('_')[1])
    recipe_name = context.user_data['random_dishes'][recipe_index]
    ingredients, instructions = get_instructions_by_dish_name(recipe_name)
    
    # Format the output with proper formatting
    formatted_text = f"*{recipe_name}*\n\n"
    
    # Format ingredients as a bullet list
    formatted_text += "*Ingredients:*\n"
    ingredient_list = [ing.strip() for ing in ingredients.split(',')]
    for ingredient in ingredient_list:
        formatted_text += f"• {ingredient}\n"
    
    # Format instructions as numbered steps
    formatted_text += "\n*Instructions:*\n"
    instruction_steps = [step.strip() for step in instructions.split('.') if step.strip()]
    for i, step in enumerate(instruction_steps, 1):
        formatted_text += f"{i}. {step}.\n"
    
    # Use Telegram's Markdown parsing for formatting
    await query.edit_message_text(text=formatted_text, parse_mode="Markdown")

def get_instructions_by_dish_name(dish_name):
    selected_recipe = recipe_df[recipe_df['TranslatedRecipeName'] == dish_name].iloc[0]
    ingredients = selected_recipe['TranslatedIngredients']
    instructions = selected_recipe['TranslatedInstructions']
    return ingredients, instructions

def get_recipes_by_ingredients(ingredients):
    matching_recipes = []

    for _, row in recipe_df.iterrows():
        recipe_ingredients = set(row['TranslatedIngredients'].split(','))
        for ingredient in ingredients:
            if any(ingredient in recipe_ingredient for recipe_ingredient in recipe_ingredients):
                matching_recipes.append(row['TranslatedRecipeName'])
    
    return matching_recipes

async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if context.user_data.get('awaiting_ingredients_input'):
        ingredients = update.message.text.split(',')
        ingredients = [ingredient.strip().lower() for ingredient in ingredients]
        context.user_data['awaiting_ingredients_input'] = False
        viable_recipes = get_recipes_by_ingredients(ingredients)
        
        if len(viable_recipes) == 0:
            await update.message.reply_text(f"Sorry, we could not find anything you can make with only those ingredients :(")
        else:
            selected_recipe = viable_recipes[random.randint(0, len(viable_recipes)-1)]
            ingredients, instructions = get_instructions_by_dish_name(selected_recipe)
            
            # Format the output with proper formatting
            formatted_text = f"*{selected_recipe}*\n\n"
            
            # Format ingredients as a bullet list
            formatted_text += "*Ingredients:*\n"
            ingredient_list = [ing.strip() for ing in ingredients.split(',')]
            for ingredient in ingredient_list:
                formatted_text += f"• {ingredient}\n"
            
            # Format instructions as numbered steps
            formatted_text += "\n*Instructions:*\n"
            instruction_steps = [step.strip() for step in instructions.split('.') if step.strip()]
            for i, step in enumerate(instruction_steps, 1):
                formatted_text += f"{i}. {step}.\n"
            
            # Use Telegram's Markdown parsing for formatting
            await update.message.reply_text(formatted_text, parse_mode="Markdown")
    else:
        await update.message.reply_text("Please use the provided buttons to interact with the bot.")

async def generate_ai_recipe(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.edit_message_text(
        text="Let's create a recipe with AI! Please enter the ingredients you have (separated by commas):"
    )
    context.user_data['awaiting_ai_ingredients'] = True
    return AWAITING_INGREDIENTS

async def ask_cuisine(update: Update, context: ContextTypes.DEFAULT_TYPE):
    ingredients = update.message.text.strip()
    
    context.user_data['ai_ingredients'] = ingredients
    
    cuisines = recipe_df['Cuisine'].unique()
    keyboard = [[InlineKeyboardButton(cuisine, callback_data=f'cuisine_{cuisine}')] for cuisine in cuisines]

    keyboard.append(
        [InlineKeyboardButton("Skip", callback_data='cuisine_skip')],
    )
    reply_markup = InlineKeyboardMarkup(keyboard)
    await update.message.reply_text(
        "What cuisine would you like? (or press Skip to leave it open)",
        reply_markup=reply_markup
    )
    return AWAITING_CUISINE

async def ask_diet(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if update.callback_query:
        query = update.callback_query
        await query.answer()
        context.user_data['ai_cuisine'] = None
        msg = await query.edit_message_text(
            text="Any dietary requirements? (e.g., vegetarian, vegan, gluten-free, etc. or type 'none')"
        )
    else:
        context.user_data['ai_cuisine'] = update.message.text.strip()
        await update.message.reply_text(
            "Any dietary requirements? (e.g., vegetarian, vegan, gluten-free, etc. or type 'none')"
        )
    return AWAITING_DIET

async def ask_max_time(update: Update, context: ContextTypes.DEFAULT_TYPE):
    diet = update.message.text.strip()
    if diet.lower() == 'none':
        context.user_data['ai_diet'] = None
    else:
        context.user_data['ai_diet'] = diet
    
    await update.message.reply_text(
        "What's the maximum cooking time in minutes? (or type 'none' for no limit)"
    )
    return AWAITING_MAX_TIME

async def generate_recipe(update: Update, context: ContextTypes.DEFAULT_TYPE):
    max_time = update.message.text.strip()
    if max_time.lower() == 'none':
        context.user_data['ai_max_time'] = None
    else:
        try:
            context.user_data['ai_max_time'] = int(max_time)
        except ValueError:
            context.user_data['ai_max_time'] = None
    
    await update.message.reply_text("Generating your recipe with AI... Please wait a moment.")
    
    # Build the Gemini prompt with user inputs
    ingredients = context.user_data.get('ai_ingredients', '').split(',')
    ingredients = [ing.strip() for ing in ingredients]
    cuisine = context.user_data.get('ai_cuisine')
    diet_type = context.user_data.get('ai_diet')
    max_time = context.user_data.get('ai_max_time')
    
    prompt = f'''Generate a recipe in JSON format with this structure:
            {{
            "name": "Recipe Name",
            "description": "Brief description (include {cuisine + ' cuisine' if cuisine else ''} {('for ' + diet_type + ' diet') if diet_type else ''} {('ready in ' + str(max_time) + ' minutes') if max_time else ''})",
            "ingredients": ["list", "of", "ingredients"],
            "instructions": ["step 1", "step 2", "step 3"]
            }}
    
            Requirements:
            1. Ingredients must be an array of strings with exact measurements (e.g., "1 cup flour")
            2. Instructions must be a numbered array of detailed steps
            3. Include cooking time estimates in instructions where relevant
            4. Never use markdown formatting
            5. Include essential cooking techniques and temperatures
            6. Do not include the initial json structure in the response, just start with the curly brackets
    
            Base the recipe on these ingredients: {', '.join(ingredients)}
            {f'Cuisine style: {cuisine}' if cuisine else ''}
            {f'Dietary requirements: {diet_type}' if diet_type else ''}
            {f'Maximum cooking time: {max_time} minutes' if max_time else ''}
    
            Example response:
            {{
            "name": "Vegetarian Lentil Bolognese",
            "description": "Italian-inspired meat-free pasta sauce ready in 40 minutes",
            "ingredients": [
                "1 cup brown lentils",
                "2 tbsp olive oil",
                "1 onion, diced"
            ],
            "instructions": [
                "Rinse lentils and soak in warm water for 10 minutes",
                "Heat oil in pan over medium heat..."
            ]
            }}
    
            ONLY RETURN VALID JSON WITHOUT MARKDOWN WRAPPING OR ADDITIONAL TEXT'''
    
    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt
        )
        
        response_text = response.text
        recipe_json = parse_json(response_text)
        
        # Format the response with proper formatting
        formatted_text = f"*{recipe_json['name']}*\n\n"
        formatted_text += f"{recipe_json['description']}\n\n"
        
        # Format ingredients as a bullet list
        formatted_text += "*Ingredients:*\n"
        for ingredient in recipe_json['ingredients']:
            formatted_text += f"• {ingredient}\n"
        
        # Format instructions as numbered steps
        formatted_text += "\n*Instructions:*\n"
        for i, step in enumerate(recipe_json['instructions'], 1):
            formatted_text += f"{i}. {step}\n"
        
        # Send the formatted recipe
        await update.message.reply_text(formatted_text, parse_mode="Markdown")
    
    except Exception as e:
        await update.message.reply_text(f"Sorry, I couldn't generate any recipes with these ingredients. Please try again.")
    
    # Clear user data
    context.user_data.clear()
    return ConversationHandler.END

# Linking above methods to the bot/app
app.add_handler(CommandHandler("start", start))
app.add_handler(CallbackQueryHandler(provide_ingredients, pattern='prov_ingred'))
app.add_handler(CallbackQueryHandler(get_cuisines, pattern='get_cuisines'))

ai_recipe_conv_handler = ConversationHandler(
    entry_points=[CallbackQueryHandler(generate_ai_recipe, pattern='gen_ai_recipe')],
    states={
        AWAITING_INGREDIENTS: [MessageHandler(filters.TEXT & ~filters.COMMAND, ask_cuisine)],
        AWAITING_CUISINE: [
            MessageHandler(filters.TEXT & ~filters.COMMAND, ask_diet),
            CallbackQueryHandler(ask_diet, pattern='cuisine_')
        ],
        AWAITING_DIET: [MessageHandler(filters.TEXT & ~filters.COMMAND, ask_max_time)],
        AWAITING_MAX_TIME: [MessageHandler(filters.TEXT & ~filters.COMMAND, generate_recipe)],
    },
    fallbacks=[],
)
app.add_handler(ai_recipe_conv_handler)

app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message))
app.add_handler(CallbackQueryHandler(show_dishes_by_cuisine, pattern='cuisine_'))
app.add_handler(CallbackQueryHandler(show_recipe_details, pattern='recipe_'))


# Running the bot
if __name__ == "__main__":
    app.run_polling()