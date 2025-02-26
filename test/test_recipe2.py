import requests

def test_1() :
    result = requests.get("http://localhost:1000/api/v1/recipes?CleanedIngredients=Tomato").text
    assert result.find("Tomato") != -1

def test_2() :
    result = requests.get("http://localhost:1000/api/v1/recipes?CleanedIngredients=pear").text
    assert result.find("pear") != -1    
def test_3() :
    result = requests.get("http://localhost:1000/api/v1/recipes?CleanedIngredients=peach").text
    assert result.find("peach") != -1

def test_4() :
    result = requests.get("http://localhost:1000/api/v1/recipes?CleanedIngredients=salt").text
    assert result.find("salt") != -1

def test_5() :
    result = requests.get("http://localhost:1000/api/v1/recipes?CleanedIngredients=sugar").text
    assert result.find("sugar") != -1
    
def test_6() :
    result = requests.get("http://localhost:1000/api/v1/recipes?CleanedIngredients=cheese").text
    assert result.find("cheese") != -1    
def test_7() :
    result = requests.get("http://localhost:1000/api/v1/recipes?CleanedIngredients=lemon").text
    assert result.find("lemon") != -1

def test_8() :
    result = requests.get("http://localhost:1000/api/v1/recipes?CleanedIngredients=spinach").text
    assert result.find("spinach") != -1
def test_9() :
    result = requests.get("http://localhost:1000/api/v1/recipes?CleanedIngredients=apple").text
    assert result.find("apple") != -1
def test_10() :
    result = requests.get("http://localhost:1000/api/v1/recipes?CleanedIngredients=tortillas").text
    assert result.find("tortillas") != -1    
