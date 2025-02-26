# API Documentation for Saveurs Sélection v2.0

## Table of Contents

## Table of Contents

- [Directory Structure](#directory-structure)
- [API docs](#api-docs)
    - [recipes.route.js](#recipesroutejs)
        - [Recipe Management](#1-recipe-management)
        - [Ingredient Management](#2-ingredient-management)
        - [User Authentication](#3-user-authentication)
        - [Bookmark Management](#4-bookmark-management)
        - [Profile Management](#5-profile-management)
        - [Grocery List Management](#6-grocery-list-management)
        - [AI Chef Integration](#7-ai-chef-integration)

    - [recipes.controller.js](#recipescontrollerjs)
        - [Design Methodology](#design-methodology)
        - [Imported Dependencies](#imported-dependencies)
        - [Helper Functions](#helper-functions)
        - [Authentication Endpoints](#authentication-endpoints)
        - [Bookmark Management](#bookmark-management-1)
        - [Recipe Management](#recipe-management-1)
        - [Ingredient & Cuisine Retrieval](#ingredient--cuisine-retrieval)
        - [AI-Powered Features](#ai-powered-features)
        - [Grocery List Generation](#grocery-list-generation)
        - [Error Handling & Logging](#error-handling--logging)
        - [Scalability & Future Improvements](#scalability--future-improvements)

    - [recipesDAO.js](#recipesdaojs)
        - [Database Connection & Initialization](#database-connection--initialization)
        - [User Management](#user-management)
        - [Bookmark Management](#bookmark-management-2)
        - [Recipe Retrieval](#recipe-retrieval)
        - [Recipe Management](#recipe-management-2)
        - [Ingredient Management](#ingredient-management-1)
        - [Grocery List Generation](#grocery-list-generation-2)
        - [Design Methodologies & Best Practices](#design-methodologies--best-practices)


## Directory Structure

```
backend/
├── __tests__/                  # Contains all test files for the backend
│   ├── recipes.controller.test.js  # Unit tests for the recipes controller
│   ├── test.spec.js               # General test specifications
│   ├── test1.js                   # Placeholder or additional test file
│   ├── test2.js                   # Placeholder or additional test file
│   ├── testBookmarksAndUserProfile.js  # Tests for bookmarks and user profile functionality
│   ├── testGetGroceryList.js      # Tests for grocery list retrieval functionality
│   ├── testGetRecipes.js          # Tests for recipe retrieval functionality
│   ├── testLoginPage.js           # Tests related to login page functionality
│
├── api/                          # Handles API routes and controllers
│   ├── recipes.controller.js     # Logic for handling recipe-related requests
│   ├── recipes.route.js          # Routes for recipe-related endpoints
│
├── dao/                          # Data access layer for database interactions
│   ├── mail_param.js             # Configuration or logic for email-related parameters
│   ├── recipesDAO.js             # Data Access Object (DAO) for recipe-related database operations
│
├── node_modules/                 # Dependencies installed via npm (auto-generated)
├── .env                          # Environment variables configuration file
├── .eslintrc.yml                 # ESLint configuration file for code linting rules
├── Dockerfile                    # Docker configuration file for containerization
├── index.js                      # Entry point of the backend application
├── package-lock.json             # Auto-generated file to lock dependency versions
├── package.json                  # Project metadata and npm dependencies configuration
└── server.js                     # Server setup and application initialization
```

## API Docs

## recipes.route.js

The recipes.route.js file defines the API endpoints related to recipe management, user authentication, and other functionalities. It uses the Express framework to route HTTP requests to the appropriate controller methods in recipes.controller.js. The design of this file follows a modular approach, where each route is mapped to a specific controller method. The routes are organized by functionality, such as fetching recipes, user authentication, or managing user profiles. This structure ensures separation of concerns and makes it easier to maintain and extend.

### 1. **Recipe Management**
- **`GET /`**  
  Fetches all recipes using `RecipesCtrl.apiGetRecipes`.  
  **Example Use Case**: Displaying all available recipes on the homepage.

- **`GET /cuisines`**  
  Fetches available cuisines using `RecipesCtrl.apiGetRecipeCuisines`.  
  **Example Use Case**: Providing cuisine filters for recipe searches.

- **`POST /addRecipe`**  
  Adds a new recipe using `RecipesCtrl.apiPostRecipe`.  
  **Example Use Case**: Allowing users to contribute their own recipes.

- **`GET /getRecipeByName`**  
  Fetches a recipe by its name using `RecipesCtrl.apiGetRecipeByName`.  
  **Example Use Case**: Searching for a specific recipe by its title.

- **`POST /generateRecipe`**  
  Generates a recipe using AI with `RecipesCtrl.apiGenerateRecipe`.  
  **Example Use Case**: Creating new recipes dynamically based on user input.

### 2. **Ingredient Management**
- **`GET /callIngredients`**  
  Retrieves ingredients using `RecipesCtrl.apiGetIngredients`.  
  **Example Use Case**: Displaying ingredients for a selected recipe.

### 3. **User Authentication**
- **`POST /signup`**  
  Handles user signup with `RecipesCtrl.apiAuthSignup`.  
  **Example Use Case**: Registering new users.

- **`GET /login`**  
  Handles user login with `RecipesCtrl.apiAuthLogin`.  
  **Example Use Case**: Authenticating existing users.

- **`POST /oAuthLogin`**  
  Handles OAuth login with `RecipesCtrl.apiOAuthLogin`.  
  **Example Use Case**: Logging in via third-party providers like Google or Facebook.

### 4. **Bookmark Management**
- **`GET /getBookmarks`**  
  Fetches user bookmarks using `RecipesCtrl.apiGetBookmarks`.  
  **Example Use Case**: Displaying recipes saved by the user.

- **`GET /getBookmarkedRecipes`**  
  Retrieves bookmarked recipes using `RecipesCtrl.apiGetBookmarkedRecipes`.  
  **Example Use Case**: Showing detailed information about bookmarked recipes.

### 5. **Profile Management**
- **`POST /addRecipeToProfile`**  
  Adds a recipe to the user's profile with `RecipesCtrl.apiPostRecipeToProfile`.  
  **Example Use Case**: Saving favorite recipes to the user's profile.

- **`POST /removeRecipeFromProfile`**  
  Removes a recipe from the user's profile with `RecipesCtrl.apiRemoveRecipeFromProfile`.  
  **Example Use Case**: Allowing users to manage their saved recipes.

### 6. **Grocery List Management**
- **`GET /getGroceryList`**  
  Retrieves a grocery list using `RecipesCtrl.apiGetGroceryList`.  
  **Example Use Case**: Generating a shopping list based on selected recipes.

### 7. **AI Chef Integration**
- **`POST /aiChef`**  
  Interacts with an AI chef feature using `RecipesCtrl.apiAiChef`.  
  **Example Use Case**: Providing AI-generated cooking advice or suggestions.

<br>

---

## recipes.controller.js

`recipes.controller.js` is the controller module in the Saveurs Sélection v2.0 backend. It manages API request handling for various endpoints related to authentication, recipe management, AI-powered functionalities, and grocery lists. This controller interfaces with `RecipesDAO` to interact with the MongoDB database and integrates the **Google Generative AI API (Gemini)** for AI-powered recipe generation and ingredient substitutions.

### **Design Methodology**
The controller follows the **MVC (Model-View-Controller)** architecture pattern where:
- **Model** (`recipesDAO.js`) handles data operations.
- **Controller** (`recipes.controller.js`) processes client requests and invokes the appropriate data-access functions.
- **View** is represented by the JSON responses sent to the client.

The controller also adopts the **DAO (Data Access Object) pattern**, which ensures separation of concerns between database logic and business logic.

### **Imported Dependencies**
```javascript
import { request } from "express";
import RecipesDAO from "../dao/recipesDAO.js";
import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";
```
- `express`: Used for handling HTTP requests.
- `RecipesDAO`: Facilitates database interactions.
- `axios`: (Unused in the current file but likely intended for external API calls).
- `GoogleGenerativeAI`: Enables AI-powered recipe generation and ingredient substitutions.

### **Helper Functions**
#### `parseJSON(rawInput)`
This function extracts JSON content from a raw string output, typically from AI-generated responses.
```javascript
function parseJSON(rawInput) {
    const jsonPattern = /```json\s*([\s\S]*?)```/;
    const match = rawInput.match(jsonPattern);
    if (match && match[1]) {
        try {
            return JSON.parse(match[1]);
        } catch (error) {
            console.error("Error parsing JSON:", error);
        }
    }
    console.error("No JSON content found between backticks");
    return null;
}
```
- **Purpose**: Cleans AI-generated JSON by removing markdown artifacts.
- **Error Handling**: Catches parsing errors and logs them.

### **Authentication Endpoints**
#### `apiOAuthLogin(req, res)`
Handles OAuth-based user login and registration.
- **Checks** if the `email` is provided.
- **Queries `RecipesDAO.getUser`** to verify if the user exists.
- **Registers a new user** if not found.
- **Returns appropriate status codes** for success or failure.

#### `apiAuthLogin(req, res)`
Authenticates a user based on `userName` and `password` passed via query parameters.
- **Queries `RecipesDAO.getUser`** with credentials.
- **Returns success status** along with user data.

#### `apiAuthSignup(req, res)`
Registers a new user with `userName` and `password`.
- **Calls `RecipesDAO.addUser`** to insert new user data.
- **Returns user creation success status**.

### **Bookmark Management**
#### `apiGetBookmarks(req, res)`
Retrieves the list of bookmarked recipe IDs for a user.
- **Requires `userName` in query**.
- **Fetches bookmarks using `RecipesDAO.getBookmarks`**.
- **Returns the list of bookmarks**.

#### `apiGetBookmarkedRecipes(req, res)`
Fetches detailed recipe data for bookmarked recipes.
- **Calls `RecipesDAO.getBookmarkedRecipes`**.
- **Handles errors gracefully** and returns a `500` status code on failure.

### **Recipe Management**
#### `apiPostRecipeToProfile(req, res)`
Adds a recipe to a user's saved profile.
- **Requires `userName` and `recipe` in request body**.
- **Calls `RecipesDAO.addRecipeToProfile`**.
- **Handles exceptions gracefully**.

#### `apiRemoveRecipeFromProfile(req, res)`
Removes a saved recipe from the user profile.
- **Requires `userName` and `recipe`**.
- **Uses `RecipesDAO.removeRecipeFromProfile`**.
- **Responds with success or failure**.

#### `apiGetRecipeByName(req, res)`
Fetches a recipe by its name.
- **Accepts `recipeName` as a query parameter**.
- **Calls `RecipesDAO.getRecipeByName`**.
- **Returns matching recipes**.

#### `apiGetRecipes(req, res)`
Supports advanced recipe searches with multiple filters.
- **Filters recipes by**:
  - `CleanedIngredients`
  - `Cuisine`
  - `Email`
  - `Flag`
  - `maxTime`
  - `type`
- **Implements pagination** (`recipesPerPage` and `page`).
- **Fetches results from `RecipesDAO.getRecipes`**.

#### `apiPostRecipe(req, res)`
Adds a new recipe to the database.
- **Calls `RecipesDAO.addRecipe`**.
- **Returns insertion status**.

### **Ingredient & Cuisine Retrieval**
#### `apiGetIngredients(req, res)`
Fetches the list of available ingredients.
- **Calls `RecipesDAO.getIngredients`**.
- **Handles errors with `500` status code**.

#### `apiGetRecipeCuisines(req, res)`
Retrieves a list of distinct cuisines available in the database.
- **Calls `RecipesDAO.getCuisines`**.
- **Handles errors properly**.

### **AI-Powered Features**
#### `apiGenerateRecipe(req, res)`
Generates a recipe based on user-specified ingredients, cuisine, and dietary preferences using Google Gemini AI.
- **Validates input** (ensures `ingredients` list is provided).
- **Constructs a structured prompt** with JSON constraints.
- **Calls `GoogleGenerativeAI` to generate content**.
- **Parses AI-generated response using `parseJSON`**.

#### `apiAiChef(req, res)`
Provides AI-powered ingredient substitution recommendations.
- **Takes `recipeName`, `instructions`, `dietType`, and `query`**.
- **Formats a natural language prompt** for Gemini.
- **Returns AI-generated ingredient substitutions**.

### **Grocery List Generation**
#### `apiGetGroceryList(req, res)`
Fetches a grocery list based on a user's saved recipes.
- **Requires `userName`**.
- **Calls `RecipesDAO.getGroceryList`**.
- **Returns the aggregated grocery list**.

### **Error Handling & Logging**
- **Consistent try-catch blocks** prevent crashes due to unexpected errors.
- **HTTP status codes** (`400`, `500`, etc.) correctly communicate error states.
- **Console logging** helps debug API request flows.

### **Scalability & Future Improvements**
- **Rate limiting** can be introduced to prevent API abuse.
- **Caching** frequently requested recipes can improve performance.
- **Unit testing** for all controller functions should be implemented.
- **Proper authentication mechanisms** (e.g., JWT) should replace the default password mechanism.

<br>

---

## recipesDAO.js

`recipesDAO.js` is the Data Access Object (DAO) responsible for interacting with MongoDB in the recipe recommender system. This module provides methods to query, insert, update, and delete data related to users, recipes, ingredients, and bookmarks.

### Database Connection & Initialization

#### `injectDB(conn)`
This function initializes database collections upon connection.
- **Arguments**:
  - `conn`: MongoDB client connection object.
- **Functionality**:
  - Initializes three collections:
    - `recipe` (stores recipes)
    - `ingredient_list` (stores ingredient names)
    - `user` (stores user data including bookmarks)
  - Ensures that collections are set only once to prevent redundant database connections.
- **Error Handling**:
  - Logs errors if unable to establish a collection handle.

---

### User Management

#### `getUser({ filters = null })`
Fetches user details from the `user` collection based on provided filters.
- **Arguments**:
  - `filters`: Object containing user query parameters (`userName`, `password`).
- **Functionality**:
  - Searches for a user by `userName`.
  - Validates password if a user is found.
  - Returns `{ success: true, user }` if credentials are correct.
  - Returns `{ success: false }` if credentials are incorrect or user does not exist.

#### `addUser({ data = null })`
Inserts a new user into the `user` collection.
- **Arguments**:
  - `data`: Object containing user details (`userName`, `password`, etc.).
- **Functionality**:
  - Checks if a user already exists.
  - If user exists, returns `{ success: false }`.
  - If user does not exist, inserts user data and returns `{ success: true }`.

---

### Bookmark Management

#### `getBookmarks(userName)`
Retrieves the list of bookmarked recipes for a user.
- **Arguments**:
  - `userName`: String representing the user’s name.
- **Functionality**:
  - Queries the `user` collection for bookmarks.
  - Returns an array of bookmarked recipes if found, otherwise returns `{ bookmarks: [] }`.
- **Error Handling**:
  - Logs errors if the database query fails.

#### `getBookmarkedRecipes(userName)`
Fetches only bookmarked recipes for a user.
- **Arguments**:
  - `userName`: String representing the user’s name.
- **Functionality**:
  - Queries the `user` collection to retrieve bookmarked recipes.
  - Returns an array of recipes or an error object.

#### `addRecipeToProfile(userName, recipe)`
Adds a recipe to a user’s bookmarked list.
- **Arguments**:
  - `userName`: String representing the user’s name.
  - `recipe`: Object representing the recipe details.
- **Functionality**:
  - Uses `$push` to add the recipe to the user’s `bookmarks` array.
  - Returns a response from MongoDB update operation.

#### `removeRecipeFromProfile(userName, recipe)`
Removes a recipe from a user’s bookmarked list.
- **Arguments**:
  - `userName`: String representing the user’s name.
  - `recipe`: Object containing `_id` to identify the recipe.
- **Functionality**:
  - Uses `$pull` to remove the recipe from the `bookmarks` array.
  - Returns a response from MongoDB update operation.

---

### Recipe Retrieval

#### `getRecipeByName({ filters = null })`
Fetches recipes based on the `recipeName`.
- **Arguments**:
  - `filters`: Object containing `recipeName`.
- **Functionality**:
  - Converts `recipeName` into a case-insensitive regex pattern.
  - Queries `recipe` collection using regex to match similar recipe names.
  - Returns a list of matching recipes.

#### `getRecipes({ filters = null, page = 0, recipesPerPage = 10 })`
Retrieves paginated recipes based on filters.
- **Arguments**:
  - `filters`: Object with filtering criteria (e.g., `CleanedIngredients`, `Cuisine`).
  - `page`: Pagination index.
  - `recipesPerPage`: Number of recipes per page.
- **Functionality**:
  - Constructs a regex-based query for ingredient filtering.
  - Fetches recipes from MongoDB.
  - Returns a paginated list of recipes.
  - Optionally sends recommended recipes via email using `nodemailer`.

#### `getCuisines()`
Fetches distinct cuisine names from the `recipe` collection.
- **Functionality**:
  - Uses `distinct("Cuisine")` to retrieve unique cuisine types.

---

### Recipe Management

#### `addRecipe(recipe)`
Inserts a new recipe into the database.
- **Arguments**:
  - `recipe`: Object containing recipe details (`recipeName`, `cookingTime`, `dietType`, etc.).
- **Functionality**:
  - Maps frontend input to database schema fields.
  - Serializes `ingredients` and `restaurants` as string lists separated by `%`.
  - Inserts the recipe into the `recipe` collection.
- **Error Handling**:
  - Logs errors if insertion fails.

---

### Ingredient Management

#### `getIngredients()`
Retrieves all unique ingredient names.
- **Functionality**:
  - Uses `distinct("item_name")` on the `ingredient_list` collection.
  - Returns an array of ingredient names.
- **Error Handling**:
  - Logs errors if query execution fails.

---

### Grocery List Generation

#### `getGroceryList(userName)`
Generates a grocery list from a user’s bookmarked recipes.
- **Arguments**:
  - `userName`: String representing the user’s name.
- **Functionality**:
  - Fetches bookmarked recipes using `getBookmarkedRecipes(userName)`.
  - Extracts `Cleaned-Ingredients` from bookmarked recipes.
  - Converts ingredient list to a set to remove duplicates.
  - Returns a deduplicated grocery list.
- **Error Handling**:
  - Logs errors if the database query fails.

---

### Design Methodologies & Best Practices

#### **1. Singleton Pattern for Database Connection**
- `injectDB()` ensures that MongoDB collections are initialized only once, preventing multiple redundant connections.

#### **2. Query Optimization**
- Uses regex-based searching (`$regex`) for flexible text-based queries.
- Uses collation (`{ locale: "en", strength: 2 }`) to improve case-insensitive text searches.

#### **3. Indexing for Performance**
- Consider adding indexes on `userName` and `TranslatedRecipeName` fields for faster queries.

#### **4. Security Considerations**
- Passwords should be stored using hashing techniques (e.g., bcrypt) instead of plain-text storage.
- Environment variables (`process.env`) are used for credentials and collection names.
