import os
import re
from dotenv import load_dotenv

load_dotenv()

BASE_URL = os.getenv("REACT_APP_BASE_URL") or ""
WEB_CLIENT_ID = os.getenv("REACT_APP_WEB_CLIENT_ID") or ""
MANAGEMENT_CLIENT_ID = os.getenv("MANAGEMENT_CLIENT_ID") or ""
PRIVATE_KEY = re.sub(
    r"\\n",
    r"\n",
    os.getenv("PRIVATE_KEY") or ""
)
