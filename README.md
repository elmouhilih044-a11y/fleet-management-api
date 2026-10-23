# FleetTrack API

API REST de gestion d'une flotte de transport routier (camions, remorques, pneus, trajets, maintenance). Version 2.0.

## Technologies

- Node.js 24, Express 5, MongoDB (Mongoose)
- Authentification JWT, mots de passe hachés avec bcrypt
- Validation avec Joi
- Redis (limitation du trafic), MinIO (stockage des PDF)
- Tests avec Jest, qualité avec ESLint
- Docker et Docker Compose, CI/CD avec GitHub Actions

## Architecture

```
routes -> controllers -> services -> repositories -> models
```

- **routes** : URL, authentification et rôles
- **controllers** : reçoivent la requête et renvoient la réponse, sans logique métier
- **services** : règles métier (disponibilité, statuts, kilométrage, ordre de mission)
- **repositories** : seules requêtes vers MongoDB (trajets et ordre de mission)
- **models** : schémas Mongoose

La vérification de disponibilité (camion, remorque, chauffeur) est centralisée dans `availabilityService`, utilisée à la création et à la modification d'un trajet.

## Modèle de données

| Entité | Champs principaux |
|---|---|
| Camion (Truck) | registrationNumber, brand, model, currentMileage, status (available, maintenance, inactive) |
| Remorque (Trailer) | registrationNumber, type, currentMileage, status |
| Pneu (Tire) | serialNumber, truck, position, installationMileage, currentMileage, wearThreshold, status (good, worn, to_replace) |
| Trajet (Trip) | departureSite, arrivalSite, goods, plannedStartDate, plannedEndDate, driver, truck, trailer, status (todo, in_progress, completed), startMileage, endMileage, fuelConsumed, missionOrder |
| Utilisateur (User) | firstName, lastName, email, password, role (admin, driver), status (active, suspended) |
| Règle de maintenance | vehicleType, maintenanceType (oil_change, inspection, tire), mileageInterval, isActive |
| Alerte de maintenance | vehicleType, vehicle, maintenanceType, message, mileage, status (pending, resolved) |

## Règles de maintenance

L'admin configure, pour chaque type de véhicule, un intervalle en kilomètres (vidange, révision, pneus). À la fin d'un trajet, le kilométrage cumulé du camion, de la remorque et des pneus augmente. Quand un seuil est dépassé, une alerte `pending` est créée. Un véhicule avec une alerte non traitée, ou un pneu à remplacer, ne peut plus être assigné à un trajet (erreur 409).

## Rôles

- **Admin** : gère camions, remorques, pneus, règles de maintenance, chauffeurs et trajets
- **Chauffeur** : consulte et met à jour uniquement ses propres trajets, télécharge son ordre de mission

## Versions de l'API

- `/api/v1` : routes historiques (en-têtes `X-API-Version: 1.0.0`, `X-API-Deprecated: true`, `Sunset`)
- `/api/v2` : nouvelles routes (`X-API-Version: 2.0.0`, `X-API-Deprecated: false`)

Route v2 : `GET /api/v2/trips/:id/mission-order-url` renvoie une URL MinIO pré-signée valable 15 minutes (admin ou chauffeur assigné).

## Limitation du trafic (Redis)

| Zone | Quota |
|---|---|
| `/api/v*/auth/*` | 10 requêtes / 15 min |
| `/api/v*/*` | 120 requêtes / minute |
| `/api/v2/analytics/*` | 20 requêtes / minute |

Au-delà : erreur 429 avec l'en-tête `Retry-After`. Après 50 requêtes en 15 minutes sur les routes sensibles, chaque requête est ralentie de 150 ms de plus (maximum 2 secondes).

## Installation avec Docker

```bash
cp .env.example .env
docker compose up -d --build
docker compose exec api node src/scripts/createAdmin.js
```

- API : http://localhost:3000
- Documentation Swagger : http://localhost:3000/api-docs
- Console MinIO : http://localhost:9001

Services : `api`, `mongo`, `redis`, `minio` (et `createbucket`, qui crée le bucket privé `fleettrack-documents`).

## Variables d'environnement

| Variable | Rôle |
|---|---|
| DATABASE_URL | Adresse MongoDB |
| JWT_SECRET | Clé de signature des tokens |
| REDIS_URL | Adresse Redis |
| MINIO_ROOT_USER, MINIO_ROOT_PASSWORD | Identifiants MinIO |
| MINIO_ENDPOINT | Adresse interne de MinIO |
| MINIO_PUBLIC_ENDPOINT | Adresse utilisée dans les URL pré-signées |
| MINIO_BUCKET | Nom du bucket |
| PRESIGNED_TTL_SECONDS | Durée de validité des URL (900 = 15 min) |

Aucun secret n'est écrit dans le code : tout vient du fichier `.env`.

## Dépendances principales

| Paquet | Rôle |
|---|---|
| express | Serveur HTTP |
| mongoose | Accès à MongoDB |
| jsonwebtoken, bcrypt | Authentification et hachage |
| joi | Validation des entrées |
| pdfkit | Génération du PDF de l'ordre de mission |
| @aws-sdk/client-s3, @aws-sdk/s3-request-presigner | Envoi des fichiers et URL pré-signées (MinIO) |
| ioredis, express-rate-limit, rate-limit-redis, express-slow-down | Limitation du trafic |
| swagger-ui-express | Documentation interactive |
| jest, eslint | Tests et qualité du code |

## Tests

```bash
npm test
```

Tests unitaires sur les services (disponibilité, trajets, kilométrage, stockage, ordre de mission) et sur les validateurs Joi. Seuil de couverture exigé : 70 %.

## CI/CD

Le workflow `.github/workflows/ci-cd.yml` enchaîne : qualité (ESLint, npm audit), tests Jest (échec sous 70 % de couverture), build Docker multi-architecture (amd64, arm64), puis publication sur Docker Hub (`TON_UTILISATEUR/fleet-management-api`, tags `v2.0.0` et `latest`).