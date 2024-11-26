import requests;

def test_find_recipe_with_egg():
    result = requests.get("http://localhost:1000/api/v1/recipes?CleanedIngredients=egg").text
    assert result.find("egg") != -1

def test_find_indian_recipe_with_mango():
    result = requests.get("http://localhost:1000/api/v1/recipes?CleanedIngredients=Mango&Cuisine=Indian").json()
    assert result['recipes'] != 0

def test_find_indian_recipe_with_mango_and_max_time_40():
    result = requests.get("http://localhost:1000/api/v1/recipes?CleanedIngredients=Mango&Cuisine=Indian&maxTime=40").json()
    assert result['recipes'] != 0

def test_find_cheese_recipe():
    result = requests.get("http://localhost:1000/api/v1/recipes?CleanedIngredients=Cheese").text
    assert result.find("Cheese") != -1

def test_find_vegan_indian_recipe_with_mango_max_time_40():
    result = requests.get("http://localhost:1000/api/v1/recipes?CleanedIngredients=Mango&Cuisine=Indian&maxTime=40&type=vegan").json()
    assert result['recipes'] != 0

def test_find_non_vegetarian_indian_recipe_with_mango_max_time_40():
    result = requests.get("http://localhost:1000/api/v1/recipes?CleanedIngredients=Mango&Cuisine=Indian&maxTime=40&type=Non-Vegetarian").json()
    assert result['entries_per_page'] != 0

def test_find_recipe_with_invalid_cuisine():
    result = requests.get("http://localhost:1000/api/v1/recipes?Cuisine=Inidan")
    assert result is not None

def test_find_vegan_recipe_with_egg_and_max_time_5():
    result = requests.get("http://localhost:1000/api/v1/recipes?CleanedIngredients=egg&Cuisine=Indian&maxTime=5&type=vegan").json()
    assert result is not None

def test_find_vegetarian_recipe_with_milk_and_rice():
    result = requests.get("http://localhost:1000/api/v1/recipes?CleanedIngredients=milk,rice&Cuisine=Indian&maxTime=5&type=Vegetarian").text
    assert result.find("Vegetarian") != -1

def test_find_non_vegetarian_recipe_with_chicken_max_time_5():
    result = requests.get("http://localhost:1000/api/v1/recipes?CleanedIngredients=chicken&Cuisine=Indian&maxTime=5&type=Non-Vegetarian").text
    assert result.find("5") != -1

def test_find_non_vegetarian_american_recipe_with_pork_max_time_15():
    result = requests.get("http://localhost:1000/api/v1/recipes?CleanedIngredients=poark&Cuisine=American&maxTime=15&type=Non-Vegetarian").json()
    assert result['total_results'] > 4

def test_find_non_vegetarian_indian_recipe_with_egg_max_time_50():
    result = requests.get("http://localhost:1000/api/v1/recipes?CleanedIngredients=egg&Cuisine=Indian&maxTime=50&type=Non-Vegetarian").json()
    assert result['total_results'] != 0

def test_check_recipe_status_with_fish():
    result = requests.get("http://localhost:1000/api/v1/recipes?CleanedIngredients=fish")
    assert result.status_code == 200

def test_check_recipe_status_with_fish_max_time_5():
    result = requests.get("http://localhost:1000/api/v1/recipes?CleanedIngredients=fish&&maxTime=5")
    assert result.status_code == 200

def test_find_non_vegetarian_indian_recipe_with_chicken_max_time_5():
    result = requests.get("http://localhost:1000/api/v1/recipes?CleanedIngredients=chicken&Cuisine=Indian&maxTime=5&type=Non-Vegetarian").json()
    assert result is not None

def test_find_recipe_with_chicken():
    result = requests.get("http://localhost:1000/api/v1/recipes?CleanedIngredients=chicken").json()
    assert result['recipes'] != 0

def test_find_recipe_with_milk_rice_and_egg():
    result = requests.get("http://localhost:1000/api/v1/recipes?CleanedIngredients=milk,rice,egg").text
    assert result.find("milk,rice") != -1

def test_find_indian_vegetarian_and_vegan_recipe_with_paneer_max_time_50():
    result = requests.get("http://localhost:1000/api/v1/recipes?CleanedIngredients=panner&Cuisine=Indian&maxTime=50&type=Vegetarian,vegan").json()
    assert result['total_results'] > 50

def test_validate_diet_type_in_non_vegetarian_recipe_with_chicken_max_time_40():
    result = requests.get("http://localhost:1000/api/v1/recipes?CleanedIngredients=chicken&Cuisine=Indian&maxTime=40&type=Non-Vegetarian").json()
    assert len(result['recipes'][0]['Diet-type']) != 0

def test_validate_restaurant_location_in_non_vegetarian_recipe_with_chicken_max_time_50():
    result = requests.get("http://localhost:1000/api/v1/recipes?CleanedIngredients=chicken&Cuisine=Indian&maxTime=50&type=Non-Vegetarian").json()
    assert len(result['recipes'][0]['Restaurant-Location']) != 0
