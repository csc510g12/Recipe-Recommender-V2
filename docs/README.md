# Changes Compared to Previous Version V1.0

In version 2.0, significant improvements have been made to the overall functionality, user interface, and database architecture. These updates introduce a range of new features, enhanced performance, and a streamlined user experience, making the project more robust and scalable.

#### Checkout the main respository [README.md](../README.md) for details on: <br>
1. Motivation and Problem Statement
2. System Overview
3. User Case-Studies and screenshots
4. Demo Video for V2.0
5. Quick Start Guide
6. Techstack details

#### Checkout the API Documentation [here](./API-DOCS.md).

---

<p align="center">
  <a href="#functionality">Functionality</a> |
  <a href="#database">Database</a> |
  <a href="#documentation">Documentation</a> |
  <a href="#user-interface">User Interface</a>
</p>

---

## Functionality

Version 2.0 introduces several key features that improve the functionality of the project:

### 1. **Recipe Management Enhancements**

- **Adding New Recipes**: The previous version lacked functionality for users to add new recipes directly through the user interface. In version 2.0, users can now add recipes to the database via a dedicated form. This feature supports structured data input, ensuring recipes are added in the correct format.
  
- **Updating Ingredient List**: Whenever a new recipe is added, the ingredient list is automatically updated to include any new ingredients that do not already exist in the database. This ensures that the ingredient database is always up to date and includes all ingredients across recipes.

### 2. **Advanced Search Capabilities**

- **Regex-Supported Ingredient Search**: A powerful, regex-enabled search functionality has been added to allow users to filter recipes by ingredients. This feature supports Type-Ahead Drop-Down search, providing suggestions based on existing ingredients in the database. It enables users to quickly find recipes containing specific ingredients, reducing friction and improving user experience.

- **Cuisine-Based Filtering**: Users can now filter recipes based on cuisine type, offering a more tailored search experience. The search mechanism allows for multi-ingredient filtering, enabling more granular recipe results.

### 3. **Chef-Gemini AI-Powered Substitutions** 

- **Ingredient Substitutions**: Chef-Gemini, the AI assistant, suggests ingredient substitutions based on dietary restrictions, missing ingredients, or fitness goals. This allows users to modify recipes without compromising on taste or quality, significantly improving the flexibility of the platform.

- **Custom Recipe Generation**: Chef-Gemini can generate custom recipes based on available pantry ingredients, chosen cuisine, and a specified cooking time. This feature helps users decide what to cook with what they already have, promoting efficient use of ingredients.

### 4. **Personalized Grocery List Generator**

- **Grocery List Creation**: Users can now generate personalized grocery lists based on selected recipes. This feature saves time and reduces the chances of missing ingredients when shopping, ensuring a smooth culinary experience.

---

## Database

The database schema remains mostly unchanged, but a critical new table has been added to improve functionality and scalability:


### 1. **Recipe Collection**

- The `recipe` collection, which contains the details of all available recipes, has been enhanced to include fields for `Cuisine`, `Diet-Type`, and `Recipe-Rating`, providing users with more filtering options.
  
- **Example Document**:
    ```json
    {
      "_id": {"$oid": "67b92dfd98e13080b22d8d98"},
      "TranslatedRecipeName": "Cauliflower Leaves Chutney",
      "TranslatedIngredients": "3 cloves garlic, 1 big Spoon oil, ...",
      "TotalTimeInMins": 25,
      "Cuisine": "South Indian",
      "TranslatedInstructions": "Instructions here...",
      "Cleaned-Ingredients": "tomato,salt,turmeric powder,...",
      "Recipe-rating": 2,
      "Diet-type": "Vegan",
      "Restaurant": "Lime & Lemon Indian Grill",
      "Restaurant-Location": "105 Friendly Dr #101, Raleigh, NC 27607"
    }
    ```

The database now supports enhanced functionality with ingredients dynamically added based on the recipes, which ensures data integrity and consistency across the platform.

---

## Documentation

The documentation has been significantly updated to reflect the new changes and provide better clarity for developers:

### 1. **README**

- The [`README`](../README.md) file has been updated to include detailed instructions on setting up and running the project, along with guidance for setting up the database. It also covers various configuration steps that need to be completed before running the project, ensuring that developers have a clear setup path.

- The sections on **deployment**, **troubleshooting**, and **feature integrations** have been expanded to provide a better understanding of the internal architecture and functionality.

---

## User Interface

The user interface (UI) has been redesigned for a more user-friendly experience, focusing on simplicity and functionality.

### 1. **Simplified, User-Friendly Design**

- The previous version of the UI was criticized for being too colorful and difficult to navigate. In version 2.0, the design has been streamlined with a fresh green theme that improves visual clarity and ease of navigation. The new design is simple, intuitive, and focused on enhancing the user experience while maintaining an aesthetically pleasing interface.

### 2. **Add New Recipe Page**

- A dedicated "Add New Recipe" page has been added to allow users to easily add recipes to the system. This feature provides an intuitive form where users can input recipe details such as ingredients, instructions, and cuisine type. Navigation between different pages is made seamless with a button at the top to switch between recipe views.

### 3. **Card-Based Display of Recipes**

- The recipe display format has been optimized to show recipes in a card-based layout, rather than a long, continuous list. This change reduces the need for excessive scrolling and allows users to quickly find the recipe they are looking for. Each card contains key information such as the recipe name, a thumbnail image, and key details, all presented in a compact format.

### 4. **Modal View for Recipe Details**

- To improve the accessibility of recipe details, a modal view has been introduced. When a user clicks on a recipe card, the full details of the recipe are displayed in a modal, providing a focused, distraction-free view of the recipe instructions, ingredients, and other relevant information.

---

These changes in version 2.0 significantly improve the functionality, usability, and scalability of the project, providing a more comprehensive and enjoyable experience for both developers and end-users.

