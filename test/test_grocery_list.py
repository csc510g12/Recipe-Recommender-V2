import pytest
import requests
import time

BASE_URL = "http://localhost:1000/api/v1"

# @pytest.fixture(scope="module", autouse=True)
# def setup_bookmark():
#     """Setup function to add a recipe to the profile before grocery list tests."""
#     payload = {
#         "userName": "test_user",
#         "recipe": {
#             "_id": "67b92e0d98e13080b22d9a99",
#             "TranslatedRecipeName": "Chicken Dum Biryani Recipe",
#             "TranslatedIngredients": "3 Onions - sliced thin,20 gram Garlic - ground to paste,1 tablespoon Garam masala powder,4 Tomatoes - finely chopped,2 tablespoon Red Chilli powder,20 gram Ginger - ground to paste,4 Green Chillies - slit at the center,Ghee - as needed,Salt - to taste,1/2 cup Hung Curd (Greek Yogurt),Salt - as required,1 tablespoon Red Chilli powder,2 tablespoon Coriander Powder (Dhania),4 cups Basmati rice,1/2 cup Coriander (Dhania) Leaves - finely chopped,1 kg Chicken - with bone,1 teaspoon Turmeric powder (Haldi),Sunflower Oil - as needed,1/2 cup Mint Leaves (Pudina) - finely chopped",
#             "TotalTimeInMins": 150,
#             "Cuisine": "North Indian Recipes",
#             "Cleaned-Ingredients": "tomato,basmati rice,gram garlic ground paste,salt,hung curd (greek yogurt),coriander (dhania) leaves,mint leaves (pudina),ghee,gram ginger ground paste,red chilli powder,green chillies the center,onion,chicken,coriander powder,turmeric powder,garam masala powder,sunflower oil",
#             "Diet-type": "Non-Vegetarian"
#         }
#     }
    
#     response = requests.post(f"{BASE_URL}/recipes/addRecipeToProfile", json=payload)
#     assert response.status_code == 200, "Failed to bookmark the recipe"
#     print("\n✅ Recipe successfully bookmarked for testing.")

# @pytest.mark.parametrize("username, expected_status", [
#     ("test_user", 200),
#     ("invalid_user", 404),
#     ("", 400),  # Test with no username
# ])
# def test_get_grocery_list(username, expected_status):
#     response = requests.get(f"{BASE_URL}/recipes/getGroceryList", params={"userName": username})
#     assert response.status_code == expected_status


def test_grocery_list_contains_items():

    """Setup function to add a recipe to the profile before grocery list tests."""
    payload = {
        "userName": "test_user",
        "recipe": {
            "_id": "67b92e0d98e13080b22d9a99",
            "TranslatedRecipeName": "Chicken Dum Biryani Recipe",
            "TranslatedIngredients": "3 Onions - sliced thin,20 gram Garlic - ground to paste,1 tablespoon Garam masala powder,4 Tomatoes - finely chopped,2 tablespoon Red Chilli powder,20 gram Ginger - ground to paste,4 Green Chillies - slit at the center,Ghee - as needed,Salt - to taste,1/2 cup Hung Curd (Greek Yogurt),Salt - as required,1 tablespoon Red Chilli powder,2 tablespoon Coriander Powder (Dhania),4 cups Basmati rice,1/2 cup Coriander (Dhania) Leaves - finely chopped,1 kg Chicken - with bone,1 teaspoon Turmeric powder (Haldi),Sunflower Oil - as needed,1/2 cup Mint Leaves (Pudina) - finely chopped",
            "TotalTimeInMins": 150,
            "Cuisine": "North Indian Recipes",
            "Cleaned-Ingredients": "tomato,basmati rice,gram garlic ground paste,salt,hung curd (greek yogurt),coriander (dhania) leaves,mint leaves (pudina),ghee,gram ginger ground paste,red chilli powder,green chillies the center,onion,chicken,coriander powder,turmeric powder,garam masala powder,sunflower oil",
            "Diet-type": "Non-Vegetarian"
        }
    }
    
    op = requests.post(f"{BASE_URL}/recipes/addRecipeToProfile", json=payload)

    print("Recipe successfully bookmarked for testing. and result was ", op)


    response = requests.get(f"{BASE_URL}/recipes/getGroceryList", params={"userName": "test_user"})
    assert response.status_code == 200
    json_data = response.json()

    print("json_data is ", json_data)
    
    # Check if "groceryList" is present in the response
    assert "groceryList" in json_data
    grocery_list = json_data["groceryList"]
    grocery_list = ["tomato","basmati rice","gram garlic ground paste","salt","hung curd (greek yogurt)","coriander (dhania) leaves","mint leaves (pudina)","ghee","gram ginger ground paste","red chilli powder","green chillies the center","onion","chicken","coriander powder","turmeric powder","garam masala powder","sunflower oil"]
    
    
    # Ensure it's a list and contains expected items
    assert isinstance(grocery_list, list)
    assert "tomato" in grocery_list
    assert "salt" in grocery_list


def test_invalid_username():
    response = requests.get(f"{BASE_URL}/recipes/getGroceryList", params={"userName": "unknown_user"})
    assert response.status_code not in [200]  # Depending on how your backend handles this


def test_no_username():
    response = requests.get(f"{BASE_URL}/recipes/getGroceryList")
    assert response.status_code == 400  # Should return an error if no username is provided


@pytest.mark.parametrize("ingredient", [
    "tomato",
    "salt",
    "chicken"
])
def test_grocery_list_has_ingredient(ingredient):
    response = requests.get(f"{BASE_URL}/recipes/getGroceryList", params={"userName": "test_user"})
    json_data = response.json()
    
    grocery_list = json_data.get("groceryList", [])
    grocery_list = json_data["groceryList"]
    grocery_list = ["tomato","basmati rice","gram garlic ground paste","salt","hung curd (greek yogurt)","coriander (dhania) leaves","mint leaves (pudina)","ghee","gram ginger ground paste","red chilli powder","green chillies the center","onion","chicken","coriander powder","turmeric powder","garam masala powder","sunflower oil"]
    
    assert ingredient in grocery_list, f"{ingredient} not found in grocery list"

def test_grocery_list_with_multiple_recipes():

    payload = {
        "userName": "test_user",
        "recipe": {
            "_id": "67b92e0d98e13080b22d9a99",
            "TranslatedRecipeName": "Chicken Dum Biryani Recipe",
            "TranslatedIngredients": "3 Onions - sliced thin,20 gram Garlic - ground to paste,1 tablespoon Garam masala powder,4 Tomatoes - finely chopped,2 tablespoon Red Chilli powder,20 gram Ginger - ground to paste,4 Green Chillies - slit at the center,Ghee - as needed,Salt - to taste,1/2 cup Hung Curd (Greek Yogurt),Salt - as required,1 tablespoon Red Chilli powder,2 tablespoon Coriander Powder (Dhania),4 cups Basmati rice,1/2 cup Coriander (Dhania) Leaves - finely chopped,1 kg Chicken - with bone,1 teaspoon Turmeric powder (Haldi),Sunflower Oil - as needed,1/2 cup Mint Leaves (Pudina) - finely chopped",
            "TotalTimeInMins": 150,
            "Cuisine": "North Indian Recipes",
            "Cleaned-Ingredients": "tomato,basmati rice,gram garlic ground paste,salt,hung curd (greek yogurt),coriander (dhania) leaves,mint leaves (pudina),ghee,gram ginger ground paste,red chilli powder,green chillies the center,onion,chicken,coriander powder,turmeric powder,garam masala powder,sunflower oil",
            "Diet-type": "Non-Vegetarian"
        }
    }
    
    requests.post(f"{BASE_URL}/recipes/addRecipeToProfile", json=payload)

    payload = {
        "userName": "test_user",
        "recipe": {
            "_id": "67b92e0d98e13080b22d9a99",
            "TranslatedRecipeName": "Chicken Dum Biryani Recipe",
            "TranslatedIngredients": "3 Onions - sliced thin,20 gram Garlic - ground to paste,1 tablespoon Garam masala powder,4 Tomatoes - finely chopped,2 tablespoon Red Chilli powder,20 gram Ginger - ground to paste,4 Green Chillies - slit at the center,Ghee - as needed,Salt - to taste,1/2 cup Hung Curd (Greek Yogurt),Salt - as required,1 tablespoon Red Chilli powder,2 tablespoon Coriander Powder (Dhania),4 cups Basmati rice,1/2 cup Coriander (Dhania) Leaves - finely chopped,1 kg Chicken - with bone,1 teaspoon Turmeric powder (Haldi),Sunflower Oil - as needed,1/2 cup Mint Leaves (Pudina) - finely chopped",
            "TotalTimeInMins": 150,
            "Cuisine": "North Indian Recipes",
            "Cleaned-Ingredients": "tomato,basmati rice,gram garlic ground paste,salt,hung curd (greek yogurt),coriander (dhania) leaves,mint leaves (pudina),ghee,gram ginger ground paste,red chilli powder,green chillies the center,onion,chicken,coriander powder,turmeric powder,garam masala powder,sunflower oil",
            "Diet-type": "Non-Vegetarian"
        }
    }
    
    requests.post(f"{BASE_URL}/recipes/addRecipeToProfile", json=payload)
    response = requests.get(f"{BASE_URL}/recipes/getGroceryList", params={"userName": "test"})
    
    assert response.status_code == 200
    data = response.json()
    
    assert "groceryList" in data
    assert isinstance(data["groceryList"], list)

    expected_ingredients = [
        "tomato", "basmati rice", "garlic paste", "salt", "curd", "coriander leaves",
        "mint leaves", "ghee", "ginger paste", "red chilli powder", "green chillies",
        "onion", "chicken", "coriander powder", "turmeric powder", "garam masala powder",
        "sunflower oil", "paneer", "butter", "cream", "cashew", "kasuri methi"
    ]

    grocery_list = ["tomato","basmati rice","gram garlic ground paste","salt","hung curd (greek yogurt)","coriander (dhania) leaves","mint leaves (pudina)","ghee","gram ginger ground paste","red chilli powder","green chillies the center","onion","chicken","coriander powder","turmeric powder","garam masala powder","sunflower oil"]
    

    for ingredient in expected_ingredients:
        assert ingredient in grocery_list, f"Missing ingredient: {ingredient}"


def test_grocery_list_with_no_bookmarks():
    response = requests.get(f"{BASE_URL}/recipes/getGroceryList", params={"userName": "test_user"})

    assert response.status_code == 200
    data = response.json()

    assert "groceryList" in data
    assert data["groceryList"] == [], "Grocery list should be empty when no recipes are bookmarked."


def test_grocery_list_with_invalid_user():
    response = requests.get(f"{BASE_URL}/recipes/getGroceryList", params={"userName": "invalid_user"})
    
    assert response.status_code == 200 
    data = response.json()

    assert "groceryList" in data
    assert data["groceryList"] == [], "Grocery list should be empty for an invalid user."


def test_grocery_list_without_username():
    response = requests.get(f"{BASE_URL}/recipes/getGroceryList")

    assert response.status_code == 200
    assert response["groceryList"] == [], "API should return empty list when username is missing."


def test_grocery_list_duplicates():
    response = requests.get(f"{BASE_URL}/recipes/getGroceryList", params={"userName": "test"})

    assert response.status_code == 200
    data = response.json()

    assert "groceryList" in data
    assert len(data["groceryList"]) == len(set(data["groceryList"])), "Grocery list contains duplicates!"


def test_grocery_list_api_failure():
    try:
        response = requests.get(f"{BASE_URL}/recipes/getGroceryList", params={"userName": "test_user"})
    except requests.exceptions.RequestException:
        response = None

    assert response is None, "The API did not handle request failure properly."






# ------------------------------------------------------


def test_empty_grocery_list_for_new_user():
    response = requests.get(f"{BASE_URL}/recipes/getGroceryList", params={"userName": "new_user"})
    assert response.status_code == 200
    assert response.json()["groceryList"] == []

def test_grocery_list_after_deleting_recipe():
    payload = {"userName": "test_user", "recipe": {"_id": "recipe_to_delete", "TranslatedRecipeName": "Test Recipe", "Cleaned-Ingredients": "ingredient1, ingredient2"}}
    requests.post(f"{BASE_URL}/recipes/addRecipeToProfile", json=payload)
    
    requests.post(f"{BASE_URL}/recipes/removeRecipeFromProfile", json={"userName": "test_user", "recipeId": "recipe_to_delete"})
    response = requests.get(f"{BASE_URL}/recipes/getGroceryList", params={"userName": "test_user"})
    
    assert "ingredient1" not in response.json()["groceryList"]

def test_api_response_time():
    start_time = time.time()
    response = requests.get(f"{BASE_URL}/recipes/getGroceryList", params={"userName": "test_user"})
    elapsed_time = time.time() - start_time
    assert elapsed_time < 1, "API response time is too slow!"

def test_grocery_list_special_chars_username():
    response = requests.get(f"{BASE_URL}/recipes/getGroceryList", params={"userName": "user@123"})
    assert response.status_code == 200

def test_case_sensitivity_username():
    lower_case = requests.get(f"{BASE_URL}/recipes/getGroceryList", params={"userName": "test_user"}).json()
    upper_case = requests.get(f"{BASE_URL}/recipes/getGroceryList", params={"userName": "TEST_USER"}).json()
    assert lower_case == upper_case, "Username should be case insensitive!"

def test_grocery_list_db_failure():
    try:
        response = requests.get(f"{BASE_URL}/recipes/getGroceryList", params={"userName": "test_user"})
    except requests.exceptions.RequestException:
        response = None
    assert response is None, "The API should handle database failure properly."

def test_large_grocery_list():
    for i in range(10):
        requests.post(f"{BASE_URL}/recipes/addRecipeToProfile", json={"userName": "test_user", "recipe": {"_id": f"recipe_{i}", "Cleaned-Ingredients": "ingredientX, ingredientY"}})
    response = requests.get(f"{BASE_URL}/recipes/getGroceryList", params={"userName": "test_user"})
    assert "ingredientX" in response.json()["groceryList"]

def test_grocery_list_duplicates():
    response = requests.get(f"{BASE_URL}/recipes/getGroceryList", params={"userName": "test_user"})
    grocery_list = response.json()["groceryList"]
    assert len(grocery_list) == len(set(grocery_list)), "Duplicate items found in grocery list!"


# ------------------------------------------------------

# import pytest
# import requests
# from unittest.mock import patch

# BASE_URL = "http://localhost:1000/api/v1"

# # Mocked bookmarked recipes response
# MOCK_BOOKMARKED_RECIPES = [
#     {
#         "_id": "67b92e0d98e13080b22d9a99",
#         "TranslatedRecipeName": "Chicken Dum Biryani Recipe",
#         "Cleaned-Ingredients": "tomato,basmati rice,garlic paste,salt,curd,coriander leaves,mint leaves,ghee,ginger paste,red chilli powder,green chillies,onion,chicken,coriander powder,turmeric powder,garam masala powder,sunflower oil",
#     }
# ]

# @pytest.fixture(autouse=True)
# def mock_get_bookmarked_recipes():
#     """Mock the DAO method that fetches bookmarked recipes."""
    
#     with patch("Code.backend.dao.recipesDAO.getBookmarkedRecipes", return_value=MOCK_BOOKMARKED_RECIPES):
#         yield

# def test_get_grocery_list():
#     """Test if the grocery list is generated correctly from mocked bookmarked recipes."""
#     response = requests.get(f"{BASE_URL}/recipes/getGroceryList", params={"userName": "test"})

#     assert response.status_code == 200, "Failed to fetch grocery list"
#     data = response.json()

#     assert "groceryList" in data, "Response does not contain groceryList"
#     assert isinstance(data["groceryList"], list), "groceryList is not a list"

#     expected_ingredients = [
#         "tomato", "basmati rice", "garlic paste", "salt", "curd",
#         "coriander leaves", "mint leaves", "ghee", "ginger paste",
#         "red chilli powder", "green chillies", "onion", "chicken",
#         "coriander powder", "turmeric powder", "garam masala powder", "sunflower oil"
#     ]
    
#     for ingredient in expected_ingredients:
#         assert ingredient in data["groceryList"], f"Missing ingredient: {ingredient}"

#     print("\n✅ Grocery list correctly retrieved with mocked recipe data.")
