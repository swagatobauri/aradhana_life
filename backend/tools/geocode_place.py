"""geocode_place — resolve place name to lat/lng/timezone."""
from typing import Dict, Any, Optional
# pyrefly: ignore [missing-import]
from langchain_core.tools import tool
# pyrefly: ignore [missing-import]
from geopy.geocoders import Nominatim

# pyrefly: ignore [missing-import]
from timezonefinder import TimezoneFinder

import functools

@functools.lru_cache(maxsize=128)
def _geocode_place_cached(place_name: str) -> str:
    try:
        # Nominatim requires a user_agent
        geolocator = Nominatim(user_agent="aradhana_life_agent")
        location = geolocator.geocode(place_name)
        
        if not location:
            return f'{{"error": "Could not resolve coordinates for place: {place_name}"}}'
            
        lat = location.latitude  # type: ignore
        lng = location.longitude # type: ignore
        
        tf = TimezoneFinder()
        timezone_str = tf.timezone_at(lng=lng, lat=lat)
        
        if not timezone_str:
            timezone_str = "UTC" # Fallback if timezone not found
            
        import json
        return json.dumps({
            "place": location.address, # type: ignore
            "lat": lat,
            "lng": lng,
            "timezone": timezone_str
        })
    except Exception as e:
        return f'{{"error": "Geocoding failed: {str(e)}"}}'

@tool
def geocode_place(place_name: str) -> str:
    """
    Geocodes a place name (e.g. "Mumbai, India", "New York") into 
    latitude, longitude, and IANA timezone.
    
    Args:
        place_name: The name of the city, region, or place.
        
    Returns:
        A JSON string containing lat, lng, and timezone, or an error message.
    """
    return _geocode_place_cached(place_name)
