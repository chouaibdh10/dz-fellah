# Backend Django (DZ-Fellah)

Backend API (Django + DRF) pour le frontend Vite.

## Démarrage (dev)

Dans un terminal:

```powershell
Set-Location "C:\Users\acer\Documents\GitHub\chouaibdh-portfolio\dz-fellah"

# (Optionnel) copier les variables d'env
Copy-Item backend\.env.example backend\.env

# Installer les dépendances python (si besoin)
C:/Users/acer/Documents/GitHub/chouaibdh-portfolio/dz-fellah/.venv/Scripts/python.exe -m pip install -r backend/requirements.txt

# Migrations
Set-Location backend
C:/Users/acer/Documents/GitHub/chouaibdh-portfolio/dz-fellah/.venv/Scripts/python.exe manage.py makemigrations
C:/Users/acer/Documents/GitHub/chouaibdh-portfolio/dz-fellah/.venv/Scripts/python.exe manage.py migrate

# Lancer le serveur
C:/Users/acer/Documents/GitHub/chouaibdh-portfolio/dz-fellah/.venv/Scripts/python.exe manage.py runserver 8000
```

API base: `http://127.0.0.1:8000/api/`

## Endpoints

- `POST /api/auth/register/`
- `POST /api/auth/login/` (JWT: access/refresh + user)
- `POST /api/auth/refresh/`
- `GET/PATCH /api/auth/me/`

- `GET /api/products/` (public)
- `POST /api/products/` (producer/admin)
- `GET/PATCH/DELETE /api/products/{id}/`

- `GET /api/orders/` (scopé par rôle)
- `POST /api/orders/` (client)
- `GET /api/orders/{id}/`
- `PATCH /api/orders/{id}/status/` (admin/producer)
