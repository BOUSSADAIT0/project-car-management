# API de Gestion de Voitures

API backend pour une application de gestion de voitures pour la vente, l'achat et la location.

## Technologies utilisées

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Swagger (Documentation API)
- Multer (Upload d'images)

## Installation

1. Cloner ce dépôt
2. Installer les dépendances:
   ```bash
   npm install
   ```
3. Créer un fichier `.env` (voir exemple ci-dessous)
4. Démarrer le serveur:
   ```bash
   npm run dev
   ```

## Configuration

Créez un fichier `.env` à la racine du projet avec le contenu suivant:

```
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/car-management
JWT_SECRET=your_secret_key
```

## Fonctionnalités

- Système d'authentification et d'autorisation (JWT)
- CRUD pour véhicules, utilisateurs et demandes
- Upload de plusieurs images pour les véhicules
- Documentation API avec Swagger
- Pagination et recherche

## Documentation API

La documentation Swagger est disponible à l'adresse suivante:
```
http://localhost:5000/api-docs
```

## Structure du projet

```
backend/
  ├── config/
  │   └── db.js
  ├── controllers/
  │   ├── vehicleController.js
  │   ├── userController.js
  │   └── requestController.js
  ├── models/
  │   ├── Vehicle.js
  │   ├── User.js
  │   └── Request.js
  ├── routes/
  │   ├── vehicleRoutes.js
  │   ├── userRoutes.js
  │   └── requestRoutes.js
  ├── middleware/
  │   └── authMiddleware.js
  ├── uploads/
  │   └── car_images/
  ├── .env
  ├── server.js
  └── package.json
```

## Endpoints API

### Véhicules

- `GET /api/vehicles` - Obtenir tous les véhicules
- `GET /api/vehicles/:id` - Obtenir un véhicule par ID
- `POST /api/vehicles` - Créer un véhicule (admin)
- `PUT /api/vehicles/:id` - Mettre à jour un véhicule (admin)
- `DELETE /api/vehicles/:id` - Supprimer un véhicule (admin)

### Utilisateurs

- `POST /api/users` - Enregistrer un nouvel utilisateur
- `POST /api/users/login` - Authentifier un utilisateur
- `GET /api/users/profile` - Obtenir le profil utilisateur
- `PUT /api/users/profile` - Mettre à jour le profil utilisateur
- `GET /api/users` - Obtenir tous les utilisateurs (admin)
- `DELETE /api/users/:id` - Supprimer un utilisateur (admin)

### Demandes

- `POST /api/requests` - Créer une nouvelle demande
- `GET /api/requests` - Obtenir toutes les demandes (admin)
- `GET /api/requests/myRequests` - Obtenir les demandes d'un utilisateur
- `PUT /api/requests/:id` - Mettre à jour le statut d'une demande (admin)