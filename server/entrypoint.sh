#!/bin/bash

# Make database migrations
echo "[+] Make database migrations"
python manage.py makemigrations

# Apply database migrations
echo "[+] Apply database migrations"
python manage.py migrate

echo "[+] Creating permissions"
python manage.py create_roles_permissions

# Load configurations into db
echo "[+] Loading configuration data"
python manage.py load_config

# Create Superuser
echo "[+] Create Superuser"
DJANGO_SUPERUSER_PASSWORD=1234 python manage.py createsuperuser \
    --no-input \
    --username=x21 \
    --email=x21@gft.com

# Create default company
echo "[+] Create default company"
python manage.py create_default_company

# Load default templates
echo "[+] Creating default templates"
python manage.py load_default_templates

# Start server
echo "[+] Starting server"
gunicorn zcore.wsgi --log-file -
