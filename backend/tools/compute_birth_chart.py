"""compute_birth_chart — real ephemeris via flatlib."""

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

def convert_lat_lng_to_geopos(lat: float, lng: float) -> str:
    """Convert float lat/lng to flatlib GeoPos string format."""
    # lat format: e.g., '38n32'
    lat_deg = int(abs(lat))
    lat_min = int((abs(lat) - lat_deg) * 60)
    lat_dir = 'n' if lat >= 0 else 's'
    lat_str = f"{lat_deg}{lat_dir}{lat_min:02d}"
    
    # lng format: e.g., '8w54'
    lng_deg = int(abs(lng))
    lng_min = int((abs(lng) - lng_deg) * 60)
    lng_dir = 'e' if lng >= 0 else 'w'
    lng_str = f"{lng_deg}{lng_dir}{lng_min:02d}"
    
    return f"{lat_str} {lng_str}"

@tool
def compute_birth_chart(date: str, time: str, lat: float, lng: float, timezone: str) -> str:
    """
    Computes real planetary positions and house cusps using flatlib.
    
    Args:
        date: ISO format date (YYYY-MM-DD).
        time: 24-hour time string (HH:MM).
        lat: Latitude of the birth place.
        lng: Longitude of the birth place.
        timezone: IANA timezone string.
        
    Returns:
        JSON string containing exact planetary positions and houses.
    """
    try:
        # Date and time string needs to be formatted for flatlib Datetime
        # Expected format for flatlib Datetime is 'YYYY/MM/DD'
        date_formatted = date.replace("-", "/")
        
        # Calculate UTC offset for the given timezone, date, and time
        import zoneinfo
        import datetime
        tz = zoneinfo.ZoneInfo(timezone)
        dt = datetime.datetime.strptime(f"{date} {time}", "%Y-%m-%d %H:%M")
        localized_dt = dt.replace(tzinfo=tz)
        offset = localized_dt.utcoffset()
        utc_offset_hours = offset.total_seconds() / 3600.0 if offset else 0.0
        
        # Format UTC offset string for flatlib (e.g. "+05:30")
        offset_hours = int(utc_offset_hours)
        offset_mins = int(abs(utc_offset_hours - offset_hours) * 60)
        offset_sign = "+" if utc_offset_hours >= 0 else "-"
        utc_offset_str = f"{offset_sign}{abs(offset_hours):02d}:{offset_mins:02d}"
        
        f_date = Datetime(date_formatted, time, utc_offset_str) # type: ignore
        geopos_str = convert_lat_lng_to_geopos(lat, lng)
        # Parse custom format manually to pass correctly to flatlib
        lat_str, lng_str = geopos_str.split(" ")
        pos = GeoPos(lat_str, lng_str)
        
        chart = Chart(f_date, pos, IDs=const.LIST_OBJECTS)
        
        planets_to_fetch = [
            const.SUN, const.MOON, const.MERCURY, const.VENUS, 
            const.MARS, const.JUPITER, const.SATURN, const.URANUS, 
            const.NEPTUNE, const.PLUTO, const.NORTH_NODE
        ]
        
        positions = {}
        for p_name in planets_to_fetch:
            obj = chart.getObject(p_name)
            house_obj = chart.houses.getObjectHouse(obj) if chart.houses else None
            positions[p_name] = {
                "sign": obj.sign,
                "degree": round(obj.signlon, 2),
                "house": house_obj.id if house_obj else None
            }
            
        # Add Ketu (South Node)
        rahu = chart.getObject(const.NORTH_NODE)
        
        # Manually compute opposite sign for South Node
        zodiac_signs = [
            const.ARIES, const.TAURUS, const.GEMINI, const.CANCER,
            const.LEO, const.VIRGO, const.LIBRA, const.SCORPIO,
            const.SAGITTARIUS, const.CAPRICORN, const.AQUARIUS, const.PISCES
        ]
        
        if rahu.sign in zodiac_signs:
            rahu_idx = zodiac_signs.index(rahu.sign)
            south_node_sign = zodiac_signs[(rahu_idx + 6) % 12]
        else:
            south_node_sign = "Unknown"
            
        south_node_signlon = rahu.signlon # Degrees within sign are exactly the same
        positions["South Node"] = {
            "sign": south_node_sign,
            "degree": round(south_node_signlon, 2),
            "house": None # Simplified
        }
            
        ascendant = chart.get(const.ASC)
        mc = chart.get(const.MC)
        
        result = {
            "ascendant": {"sign": ascendant.sign, "degree": round(ascendant.signlon, 2)},
            "midheaven": {"sign": mc.sign, "degree": round(mc.signlon, 2)},
            "planets": positions
        }
        
        return json.dumps(result)
    except Exception as e:
        return f'{{"error": "Birth chart computation failed: {str(e)}"}}'
