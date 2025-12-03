# 🌾 DZ-Fellah

> Plateforme de mise en relation entre producteurs agricoles algériens et consommateurs locaux.

![Version](https://img.shields.io/badge/version-1.0.0-green)
![React](https://img.shields.io/badge/React-18.x-blue)
![Vite](https://img.shields.io/badge/Vite-5.x-purple)

## 📋 Description

**DZ-Fellah** est une application web moderne qui permet aux producteurs agricoles algériens de vendre leurs produits directement aux consommateurs. La plateforme vise à :

- 🌱 Promouvoir l'agriculture locale et les produits de saison
- 🤝 Créer un lien direct entre producteurs et consommateurs
- 💰 Offrir des prix justes pour les deux parties
- 🚚 Faciliter la logistique de livraison

## ✨ Fonctionnalités

### Pour les Producteurs
- 📊 **Tableau de bord** - Statistiques de ventes, graphiques et activité récente
- 🏪 **Gestion de boutique** - Créer et personnaliser sa vitrine en ligne
- 🌿 **Gestion des produits** - Ajouter, modifier, supprimer des produits avec gestion du stock
- 📦 **Suivi des commandes** - Gérer les commandes clients
- 👤 **Profil producteur** - Informations de contact et paramètres

### Pour les Clients
- 🛒 **Catalogue de produits** - Parcourir les produits disponibles
- 🛍️ **Panier d'achat** - Ajouter des produits et passer commande
- 📋 **Historique des commandes** - Suivre ses achats
- 👤 **Profil client** - Gérer ses informations personnelles

## 🛠️ Technologies utilisées

| Technologie | Description |
|-------------|-------------|
| **React 18** | Bibliothèque UI |
| **Vite** | Build tool rapide |
| **React Router** | Navigation SPA |
| **Context API** | Gestion d'état |
| **CSS3** | Styles modernes avec gradients et animations |

## 📁 Structure du projet

```
dz-fellah/
├── src/
│   ├── components/
│   │   ├── common/          # Composants partagés (Navbar, Footer)
│   │   ├── client/          # Layout et sidebar client
│   │   └── producer/        # Layout et sidebar producteur
│   ├── context/
│   │   ├── AuthContext.jsx  # Authentification
│   │   ├── CartContext.jsx  # Panier d'achat
│   │   └── ProductsContext.jsx # Gestion des produits
│   ├── pages/
│   │   ├── client/          # Pages espace client
│   │   └── producer/        # Pages espace producteur
│   └── styles/              # Styles globaux
├── index.html
├── package.json
└── vite.config.js
```

## 🚀 Installation

### Prérequis
- Node.js 18+ 
- npm ou yarn

### Étapes

1. **Cloner le repository**
```bash
git clone https://github.com/chouaibdh10/dz-fellah.git
cd dz-fellah
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Lancer en mode développement**
```bash
npm run dev
```

4. **Ouvrir dans le navigateur**
```
http://localhost:5173
```

## 📦 Scripts disponibles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Lancer le serveur de développement |
| `npm run build` | Créer la version de production |
| `npm run preview` | Prévisualiser la version de production |

## 🎨 Design

L'application utilise une palette de couleurs naturelles inspirées de l'agriculture :

- 🟢 **Vert principal** : `#4a7c23` - Couleur signature
- 🌿 **Vert foncé** : `#2d5016` - Accents
- 🍃 **Vert clair** : `#f0f7ec` - Arrière-plans
- 🌾 **Fond** : Dégradés subtils verts

### Caractéristiques UI
- ✅ Design responsive (mobile-first)
- ✅ Animations fluides
- ✅ Cartes avec effets de survol
- ✅ Graphiques interactifs
- ✅ Indicateurs de stock visuels

## 🔐 Accès démo

### Producteur
- URL : `/producteur`
- Accès au tableau de bord, boutique, commandes

### Client  
- URL : `/client`
- Accès au profil et historique des commandes

## 📱 Responsive

L'application est optimisée pour :
- 📱 Mobile (< 768px)
- 📱 Tablette (768px - 1024px)
- 💻 Desktop (> 1024px)

## 🗺️ Roadmap

- [ ] Authentification Firebase
- [ ] Base de données Firestore
- [ ] Système de paiement intégré
- [ ] Notifications push
- [ ] Géolocalisation des producteurs
- [ ] Chat entre producteurs et clients
- [ ] Application mobile (React Native)



**Chouaib BDH** - Développeur FRONT-END

- GitHub : [@chouaibdh10](https://github.com/chouaibdh10)
- Portfolio : [chouaibdh-portfolio](https://myportfolio-zeta-eight-71.vercel.app/)

---

<p align="center">
  Fait avec ❤️ pour les agriculteurs algériens 🇩🇿
</p>
