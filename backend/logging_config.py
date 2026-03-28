import logging
import os

LOG_DIR = "logs"
LOG_FILE = "logs/app.log"

os.makedirs(LOG_DIR, exist_ok=True)

logger = logging.getLogger("app")
logger.setLevel(logging.INFO)

formatter = logging.Formatter(
    "[%(levelname)s]   %(asctime)s - %(message)s"
)

# Console handler
console_handler = logging.StreamHandler()
console_handler.setFormatter(formatter)

# File handler
file_handler = logging.FileHandler(LOG_FILE)
file_handler.setFormatter(formatter)

# Avoid duplicate logs
if not logger.hasHandlers():
    logger.addHandler(console_handler)
    logger.addHandler(file_handler)