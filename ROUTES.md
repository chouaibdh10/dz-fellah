# 🗺️ Routes de la Plateforme DZ Fellah

## 📍 Routes Publiques

| Route | Description |
|-------|-------------|
| `/` | Page d'accueil |
| `/about` | À propos |
| `/demo` | **NOUVEAU** Page de démonstration avec comptes de test |
| `/login` | Connexion |
| `/register-choice` | Choix du type d'inscription |
| `/register` | Inscription |
| `/verify-email` | Vérification email |
| `/email-verified` | Confirmation email vérifié |
| `/products` | Catalogue produits |

## 👑 Routes Admin (Nouvelles)

| Route | Description |
|-------|-------------|
| `/administrateur` | Accès rapide admin (redirige vers dashboard) |
| `/admin/dashboard` | Tableau de bord principal |
| `/admin/users` | Gestion des utilisateurs |
| `/admin/products` | Gestion des produits |
| `/admin/orders` | Gestion des commandes |
| `/admin/producers` | Liste des producteurs |
| `/admin/analytics` | Analytiques détaillées |
| `/admin/settings` | Paramètres de la plateforme |

## 🌾 Routes Producteur

| Route | Description |
|-------|-------------|
| `/producteur` | Accès rapide producteur |
| `/producer/dashboard` | Tableau de bord producteur |
| `/producer/shop` | Ma boutique |
| `/producer/orders` | Mes commandes |
| `/producer/profile` | Mon profil |

## 👤 Routes Client

| Route | Description |
|-------|-------------|
| `/client` | Accès rapide client |
| `/client/profile` | Mon profil |
| `/client/orders` | Mes commandes |
| `/cart` | Mon panier |

## 🔐 Accès selon le Rôle

### Admin
- Email doit contenir : `admin` ou `administrateur`
- Exemple : `admin@dzfellah.dz`, `administrateur@test.com`
- Accès à toutes les routes `/admin/*`

### Producteur
- Email doit contenir : `producteur`, `producer` ou `ferme`
- Exemple : `producteur@ferme.dz`, `farmer@producer.com`
- Accès aux routes `/producer/*`

### Client
- Tout autre email
- Exemple : `client@test.dz`, `user@email.com`
- Accès aux routes `/client/*` et `/cart`

## 🚀 Navigation Rapide

Pour tester rapidement chaque interface :

```bash
# Admin
http://localhost:5173/demo
# → Utilisez : admin@dzfellah.dz

# Producteur
http://localhost:5173/demo
# → Utilisez : producteur@ferme.dz

# Client
http://localhost:5173/demo
# → Utilisez : client@test.dz
```

## 📊 Structure de Navigation

```
/
├── Public
│   ├── Home (/)
│   ├── About (/about)
│   ├── Demo (/demo) ⭐ NOUVEAU
│   ├── Login (/login)
│   └── Products (/products)
│
├── Admin (/admin) ⭐ NOUVEAU
│   ├── Dashboard
│   ├── Users
│   ├── Products
│   ├── Orders
│   ├── Analytics
│   └── Settings
│
├── Producer (/producer)
│   ├── Dashboard
│   ├── Shop
│   ├── Orders
│   └── Profile
│
└── Client (/client)
    ├── Profile
    ├── Orders
    └── Cart
```

## 🎨 Pages sans Navbar

Les pages suivantes n'affichent pas la navbar horizontale (utilisant leur propre sidebar) :

- `/client/*`
- `/producer/*`
- `/admin/*` ⭐ NOUVEAU
- `/cart`
- `/products`

## 💡 Recommandations

1. **Page de démo** : Visitez `/demo` pour voir tous les comptes de test
2. **Test rapide** : Utilisez les "Accès Direct" depuis la page démo
3. **Développement** : Gardez `ADMIN_GUIDE.md` ouvert pour référence

## 🔄 Redirections Automatiques

- `/administrateur` → `/admin/dashboard` (si admin connecté)
- `/producteur` → `/producer/dashboard` (si producteur connecté)
- `/client` → `/client/profile` (si client connecté)
- Toutes les routes protégées → `/login` (si non connecté)

---

**Total des routes** : 30+ routes  
**Nouvelles routes admin** : 8 routes  
**Page démo** : 1 route ⭐
