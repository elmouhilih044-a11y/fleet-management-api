# API de Gestion de Flotte de Transport Routier

API REST permettant de gérer une flotte de transport routier composée de camions, remorques, pneus, chauffeurs, trajets et opérations de maintenance.

## Description

Cette application est une API backend destinée à une entreprise de transport routier basée à Youssoufia.

L'entreprise utilise actuellement des fichiers Excel, des appels téléphoniques et des documents papier pour gérer sa flotte. L'objectif de cette API est de centraliser la gestion des véhicules, des trajets, du kilométrage, du carburant, des pneus et de la maintenance.

L'application ne possède pas de frontend. Elle fournit uniquement une API REST consommable par différents clients. :contentReference[oaicite:0]{index=0}

## Objectifs

L'API permet de :

- gérer les camions ;
- gérer les remorques ;
- gérer les pneus ;
- gérer les chauffeurs ;
- créer et affecter des trajets ;
- suivre le kilométrage ;
- suivre la consommation de carburant ;
- gérer les règles de maintenance ;
- générer des alertes de maintenance ;
- générer un ordre de mission au format PDF ;
- gérer les utilisateurs et leurs rôles ;
- produire des informations sur la consommation, le kilométrage et la maintenance. :contentReference[oaicite:1]{index=1}

## Rôles

### Administrateur

L'administrateur peut :

- gérer les camions ;
- gérer les remorques ;
- gérer les pneus ;
- créer et affecter des trajets ;
- consulter les rapports ;
- configurer les règles de maintenance ;
- gérer les comptes des chauffeurs. :contentReference[oaicite:2]{index=2}

### Chauffeur

Le chauffeur peut :

- consulter ses trajets affectés ;
- télécharger l'ordre de mission PDF ;
- mettre à jour le statut de ses trajets ;
- saisir le kilométrage de départ et d'arrivée ;
- saisir le volume de carburant ;
- ajouter des remarques concernant le véhicule. :contentReference[oaicite:3]{index=3}

## Fonctionnalités principales

### Gestion des ressources

L'administrateur peut créer, consulter, modifier et archiver les camions et les remorques.

Les pneus sont associés aux camions et leur état ainsi que leur kilométrage d'usure sont suivis.

Les informations concernant le carburant sont également enregistrées afin de suivre le volume et le coût par trajet et par véhicule. :contentReference[oaicite:4]{index=4}

### Gestion des trajets

Un trajet contient notamment :

- le lieu de départ ;
- le lieu d'arrivée ;
- les marchandises transportées ;
- les dates prévues ;
- le chauffeur affecté ;
- le camion affecté ;
- la remorque affectée ;
- le statut du trajet.

Les statuts possibles sont :

- À faire ;
- En cours ;
- Terminé.

Un ordre de mission peut être généré au format PDF. :contentReference[oaicite:5]{index=5}

### Kilométrage et carburant

Le chauffeur saisit :

- le kilométrage de départ ;
- le kilométrage d'arrivée ;
- le volume de diesel.

Le système calcule ensuite la distance parcourue et la consommation moyenne.

Le kilométrage d'arrivée doit être strictement supérieur au kilométrage de départ. :contentReference[oaicite:6]{index=6}

### Maintenance

L'administrateur peut configurer des règles de maintenance périodique concernant notamment :

- les pneus ;
- les vidanges ;
- les inspections.

Le système génère des alertes lorsque les seuils de maintenance sont dépassés. :contentReference[oaicite:7]{index=7}

## Règles métier

Les principales règles métier sont :

- Un camion ou une remorque en maintenance ne peut pas être affecté à un trajet.
- Un camion ne peut avoir qu'un seul trajet actif à la fois.
- Un chauffeur ne peut pas avoir deux trajets qui se chevauchent.
- L'affectation d'un trajet nécessite la disponibilité du chauffeur, du camion et de la remorque.
- En cas de conflit d'affectation, l'API retourne une erreur HTTP 409.
- Un pneu dépassant son seuil d'usure déclenche une alerte de remplacement.
- Un véhicule possédant une alerte de maintenance non traitée ne peut pas être affecté.
- Un chauffeur suspendu ne peut pas se connecter ni être affecté.
- Les statuts d'un trajet suivent l'ordre : À faire → En cours → Terminé.
- Le retour à un statut précédent n'est pas autorisé, sauf intervention administrative.
- Le kilométrage d'arrivée doit être supérieur au kilométrage de départ. :contentReference[oaicite:8]{index=8}

## Technologies

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- Joi ou express-validator
- PDFKit
- Jest ou Mocha/Chai
- Supertest
- Docker
- Docker Compose

L'API suit une architecture REST et utilise les méthodes HTTP GET, POST, PUT et DELETE. :contentReference[oaicite:9]{index=9}

## Architecture

Le projet suit une architecture en couches :

```text
src/
├── config/
├── models/
├── controllers/
├── services/
├── routes/
├── middlewares/
├── validators/
├── utils/
├── app.js
└── server.js