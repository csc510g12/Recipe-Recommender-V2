import requests

def test_get_result():
    result = requests.get("http://localhost:1000/api/v1/recipes?CleanedIngredients=Tomato")
    assert result is not None

def test_get_result_status():
    result = requests.get("http://localhost:1000/api/v1/recipes?CleanedIngredients=Tomato")
    assert result.status_code == 200