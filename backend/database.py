import sqlite3
import os

# Absolute path to the SQLite database
DB_PATH = "C:/Users/Shreyash Gaikwad/india_jobs_dataset.db"

def get_db_connection():
    if not os.path.exists(DB_PATH):
        raise FileNotFoundError(f"Database not found at {DB_PATH}")
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row  # enabling dictionary-like row access
    return conn
