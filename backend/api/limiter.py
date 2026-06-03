# pyrefly: ignore [missing-import]
from slowapi import Limiter
# pyrefly: ignore [missing-import]
from slowapi.util import get_remote_address

# Initialize rate limiter using client IP address
limiter = Limiter(key_func=get_remote_address)
