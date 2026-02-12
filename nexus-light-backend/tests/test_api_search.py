import os
import pytest
from unittest.mock import Mock
from app.routes.search import google_web_search

# --- Mocked Tests for Serper.dev Integration ---

def test_google_web_search_success(mocker):
    """
    Tests the google_web_search function with a mocked successful API response.
    """
    # 1. Prepare the mock response
    mock_response = Mock()
    mock_response.status_code = 200
    mock_response.json.return_value = {
        "organic": [
            {"title": "Test Title 1", "link": "http://test.com/1", "snippet": "Snippet 1"},
            {"title": "Test Title 2", "link": "http://test.com/2", "snippet": "Snippet 2"},
        ]
    }
    
    # 2. Patch the requests.post method
    mocker.patch('app.routes.search.requests.post', return_value=mock_response)
    
    # 3. Set the necessary environment variable for the test
    mocker.patch.dict(os.environ, {"SERPER_API_KEY": "test_key"})
    
    # 4. Call the function
    result = google_web_search("test query")
    
    # 5. Assert the results
    assert "Google Search Results:" in result
    assert "Test Title 1" in result
    assert "http://test.com/1" in result
    assert "Snippet 1" in result
    assert "Test Title 2" in result

def test_google_web_search_no_results(mocker):
    """
    Tests the google_web_search function when the API returns no results.
    """
    mock_response = Mock()
    mock_response.status_code = 200
    mock_response.json.return_value = {"organic": []}
    
    mocker.patch('app.routes.search.requests.post', return_value=mock_response)
    mocker.patch.dict(os.environ, {"SERPER_API_KEY": "test_key"})
    
    result = google_web_search("a query with no results")
    
    assert "No Google search results found" in result

def test_google_web_search_api_error(mocker):
    """
    Tests how the function handles an API error (e.g., a 4xx or 5xx response).
    """
    mock_response = Mock()
    mock_response.status_code = 401  # Unauthorized
    mock_response.raise_for_status.side_effect = Exception("API Error")

    mocker.patch('app.routes.search.requests.post', return_value=mock_response)
    mocker.patch.dict(os.environ, {"SERPER_API_KEY": "invalid_key"})
    
    result = google_web_search("test query")
    
    assert "An unexpected error occurred" in result
