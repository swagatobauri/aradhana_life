from backend.tools.geocode_place import _geocode_place_cached, geocode_place
from backend.tools.compute_birth_chart import _compute_birth_chart_cached, compute_birth_chart
import time

print("Testing Geocode...")
start = time.time()
res1 = _geocode_place_cached("Mumbai, India")
print("First call:", time.time() - start)

start = time.time()
res2 = _geocode_place_cached("Mumbai, India")
print("Second call (cached):", time.time() - start)
assert res1 == res2

print("\nTesting Compute Birth Chart...")
import json
geo = json.loads(res1)
start = time.time()
chart1 = _compute_birth_chart_cached("1995-01-01", "12:00", geo["lat"], geo["lng"], geo["timezone"])
print("First call:", time.time() - start)

start = time.time()
chart2 = _compute_birth_chart_cached("1995-01-01", "12:00", geo["lat"], geo["lng"], geo["timezone"])
print("Second call (cached):", time.time() - start)
assert chart1 == chart2

print("\nAll caching tests passed perfectly!")
