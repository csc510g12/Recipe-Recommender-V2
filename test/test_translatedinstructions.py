import requests

def test() :
    result = requests.get("http://localhost:1000/api/v1/recipes?CleanedIngredients=Mango&Cuisine=Indian").json()
    assert len(result['recipes'][0]['TranslatedInstructions']) != 0

