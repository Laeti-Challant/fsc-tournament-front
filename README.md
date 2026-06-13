# fsc-tournament-front

Interface web de gestion de tournoi Blood Bowl, développée en stage pour l'association Fil Sanguinaire.

---

## Contexte

Ce projet est le frontend de l'application fsc-tournament. Il consomme l'API REST [fsc-tournament-back](https://github.com/Laeti-Challant/fsc-tournament-back) et propose une interface permettant aux organisateurs et aux coachs de suivre le déroulement du tournoi.

---

## Fonctionnalités

- Authentification (connexion / déconnexion, gestion du token JWT)
- Consultation et inscription des coachs
- Suivi des rounds et des matchs
- Saisie des résultats
- Consultation des règles du tournoi

---

## Stack technique

- **Angular 21**
- **TypeScript**

---

## Lancer le projet

```bash
npm install
ng serve
```

L'application sera disponible sur `http://localhost:4200`. L'API fsc-tournament-back doit être démarrée au préalable.

---

## État du projet

Projet en cours de développement, réalisé en stage. Les principales vues sont implémentées ; des évolutions sont prévues pour finaliser l'interface.
