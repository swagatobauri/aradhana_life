"""get_daily_transits — current planetary transits vs natal chart."""

import json
from typing import Dict, Any, Optional

# pyrefly: ignore [missing-import]
from langchain_core.tools import tool
# pyrefly: ignore [missing-import]
from flatlib.datetime import Datetime  # type: ignore
# pyrefly: ignore [missing-import]
from flatlib.geopos import GeoPos      # type: ignore
# pyrefly: ignore [missing-import]
from flatlib.chart import Chart        # type: ignore
# pyrefly: ignore [missing-import]
from flatlib import const              # type: ignore
import datetime

@tool
def get_daily_transits(lat: float, lng: float, timezone: str) -> str:
    """
    Computes current planetary transits (for right now) to compare against a natal chart.
    
    Args:
        lat: Latitude of the current location (or birth place).
        lng: Longitude of the current location (or birth place).
        timezone: IANA timezone string for current location.
        
    Returns:
        JSON string containing the current positions of planets.
    """
    try:
        # Get current time in UTC
        now = datetime.datetime.now(datetime.timezone.utc)
        
        date_formatted = now.strftime("%Y/%m/%d")
        time_formatted = now.strftime("%H:%M")
        
        f_date = Datetime(date_formatted, time_formatted, "+00:00") # type: ignore
        
        # Format lat/lng
        lat_deg = int(abs(lat))
        lat_min = int((abs(lat) - lat_deg) * 60)
        lat_dir = 'n' if lat >= 0 else 's'
        lat_str = f"{lat_deg}{lat_dir}{lat_min:02d}"
        
        lng_deg = int(abs(lng))
        lng_min = int((abs(lng) - lng_deg) * 60)
        lng_dir = 'e' if lng >= 0 else 'w'
        lng_str = f"{lng_deg}{lng_dir}{lng_min:02d}"
        
        pos = GeoPos(lat_str, lng_str)
        chart = Chart(f_date, pos, IDs=const.LIST_OBJECTS)
        
        planets_to_fetch = [
            const.SUN, const.MOON, const.MERCURY, const.VENUS, 
            const.MARS, const.JUPITER, const.SATURN, const.URANUS, 
            const.NEPTUNE, const.PLUTO
        ]
        
        positions = {}
        for p_name in planets_to_fetch:
            obj = chart.getObject(p_name)
            positions[p_name] = {
                "sign": obj.sign,
                "degree": round(obj.signlon, 2)
            }
            
        return json.dumps({
            "current_date": date_formatted,
            "transiting_planets": positions
        })
    except Exception as e:
        return f'{{"error": "Transit computation failed: {str(e)}"}}'
