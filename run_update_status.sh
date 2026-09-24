#!/bin/bash
# Cron job script to update order statuses based on 1-Day Buffer Rule
# This runs daily at midnight

# Change to the project directory
cd /d/projects/electronics

# Activate virtual environment if you have one (uncomment if needed)
# source venv/bin/activate

# Run the management command
python manage.py update_order_status
