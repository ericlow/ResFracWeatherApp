#!/bin/bash

# --------------------------------------------------------
# Script Name: reset_users_table.sh
# Description: This script drops the existing 'users' table
#              in the specified SQLite database if it exists,
#              and recreates it with the defined structure.
#
# Usage: ./create_db.sh
#
# --------------------------------------------------------

DB_FILE="./users.db"

sqlite3 "$DB_FILE" <<EOF
DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first TEXT NOT NULL,
    last TEXT NOT NULL,
    email TEXT NOT NULL,
    apikey TEXT
);
EOF

echo "Users table has been reset."