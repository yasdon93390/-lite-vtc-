# ChantierFlow AI

> Assistant IA WhatsApp pour artisans BTP. L'artisan envoie un message texte ou vocal sur WhatsApp, l'IA s'occupe du reste : devis, facture, relance, post Instagram.

**Pas d'app à télécharger. Pas de login. Tout passe par WhatsApp.**

---

## ✨ Ce que ça fait

| Demande de l'artisan | Action de ChantierFlow |
|---|---|
| "Devis rénovation salle de bain 5m² + douche italienne" | Devis PDF chiffré renvoyé en 10 s |
| Note vocale "j'ai fini la cuisine il reste la peinture" | Transcription + statut chantier mis à jour |
| "Facture le chantier Dupont" | Facture PDF générée depuis le devis correspondant |
| Photo d'un chantier fini | Post Instagram clé en main (caption + hashtags) |
| "Qui me doit de l'argent ?" | Liste impayés + relances automatiques quotidiennes |

---

## 🛠️ Stack

- **Node.js 20 + Express** (ESM)
- **PostgreSQL**
- **OpenAI** (GPT-4o-mini pour le texte, GPT-4o pour la vision, Whisper pour le vocal)
- **Twilio WhatsApp Business API**
- **PDFKit** pour les PDF
- **S3** (optionnel) ou stockage local pour les PDF/images
- **node-cron** pour les relances automatiques quotidiennes

---

## 🚀 Démarrage rapide (local, 5 minutes)

### 1. Pré-requis

- Node.js 20+ et Docker installés
- Compte [Twilio](https://www.twilio.com) (essai gratuit avec sandbox WhatsApp activable en 2 min)
- Clé [OpenAI](https://platform.openai.com/api-keys)

### 2. Cloner + configurer

```bash
git clone <ce-repo>
cd chantierflow
cp .env.example .env
```

Édite `.env` et renseigne au minimum :
- `OPENAI_API_KEY`
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`
- `TWILIO_WHATSAPP_FROM` (le numéro sandbox de Twilio, par défaut `whatsapp:+14155238886`)

### 3. Lancer Postgres + l'app

```bash
docker compose up -d
docker compose exec app npm run db:init
```

L'app tourne sur `http://localhost:3000`.

### 4. Exposer en HTTPS pour Twilio (dev)

Twilio doit pouvoir appeler ton webhook. En local, on utilise [ngrok](https://ngrok.com) :

```bash
ngrok http 3000
```

Tu obtiens une URL `https://abcd1234.ngrok-free.app`.

### 5. Configurer le webhook Twilio

Dans la console Twilio → **Messaging > Try it out > Send a WhatsApp message** :

- **When a message comes in** :
  `https://abcd1234.ngrok-free.app/webhooks/whatsapp`
- **HTTP method** : `POST`

### 6. Activer la sandbox Twilio

Envoie depuis ton téléphone un message WhatsApp au numéro Twilio (+1 415 523 8886) avec le mot magique fourni dans la console (`join <mot-clé>`).

### 7. Tester

Depuis WhatsApp :
- Tape `aide` → tu reçois le menu
- Tape `fais-moi un devis pour rénovation salle de bain 5m² + carrelage + douche italienne` → tu reçois un PDF
- Envoie un vocal "j'ai fini la cuisine" → tu reçois la transcription et l'action déduite
- Envoie une photo de chantier → tu reçois un post Instagram prêt à publier

---

## 🌍 Déploiement production

### Option A — Railway (le plus simple)

1. [railway.app](https://railway.app) → New Project → Deploy from GitHub
2. Ajoute un service **PostgreSQL** (Railway le provisionne en 1 clic)
3. Variables d'environnement (Settings → Variables) : recopie tout `.env`
4. Récupère l'URL publique du service (ex. `https://chantierflow-prod.up.railway.app`)
5. Configure le webhook Twilio avec cette URL : `/webhooks/whatsapp`
6. Première init :
   ```bash
   railway run npm run db:init
   ```

### Option B — Render

1. New → Web Service → connecte le repo
2. Build command : `npm install`
3. Start command : `node server.js`
4. Add a PostgreSQL database (gratuit jusqu'à 1 Go)
5. Variables d'env (recopie `.env`)
6. Déploie, puis init la DB via Shell : `npm run db:init`

### Option C — VPS classique (Hetzner, OVH, Scaleway)

```bash
docker compose -f docker-compose.yml up -d --build
docker compose exec app npm run db:init
```

Mets un Caddy ou Nginx en reverse proxy avec HTTPS.

---

## 🔐 Passer en production WhatsApp (Twilio)

La sandbox suffit pour les tests, mais pas pour les vrais clients.
Pour passer en prod :

1. Twilio → **Messaging > Senders > WhatsApp senders > New**
2. Renseigne ton numéro pro (ou loue-en un Twilio)
3. Soumets ton **profil Meta Business** (vérification ~1-3 jours)
4. Une fois validé, mets à jour `TWILIO_WHATSAPP_FROM` avec ton numéro
5. Crée tes **templates de messages** approuvés Meta pour les notifications sortantes

---

## 📊 Endpoints HTTP utiles

| Méthode | Chemin | Description |
|---|---|---|
| `POST` | `/webhooks/whatsapp` | Webhook Twilio (entrant) |
| `GET` | `/api/health` | Healthcheck |
| `GET` | `/api/users` | Liste des utilisateurs |
| `GET` | `/api/quotes` | 200 derniers devis |
| `GET` | `/api/invoices` | 200 dernières factures |
| `POST` | `/api/invoices/:id/paid` | Marquer une facture payée |
| `GET` | `/files/...` | Servir les PDF stockés en local |

---

## 🧠 Personnaliser les prompts AI

Tous les prompts sont dans `src/prompts/index.js` :

- `INTENT_SYSTEM` : classification du message (devis / facture / vocal / photo / relance / …)
- `QUOTE_SYSTEM` : génération de devis (avec tarifs de référence BTP 2026)
- `INVOICE_SYSTEM` : génération de facture
- `PHOTO_SYSTEM` : caption Instagram
- `REMINDER_SYSTEM` : message de relance impayé

> Tu peux les ajuster avec ta propre grille tarifaire pour rendre les devis plus précis.

---

## 💰 Modèle commercial (suggéré)

| Plan | Prix/mois | Devis/mois | Vocaux | Photos | Relances auto |
|---|---|---|---|---|---|
| **Basic** | 29 € | 20 | 50 | 50 | ✅ |
| **Pro** | 49 € | 100 | 300 | illimitées | ✅ + relances SMS |
| **Premium** | 79 € | illimité | illimité | illimitées | ✅ + multi-utilisateurs |

> L'économie unitaire fonctionne car OpenAI coûte ~0,002 €/devis, ~0,01 €/photo, ~0,005 €/transcription. Marge brute ~95 % sur le plan Basic.

---

## 🧪 Test sans Twilio (curl)

Tu peux simuler un webhook Twilio sans WhatsApp :

```bash
curl -X POST http://localhost:3000/webhooks/whatsapp \
  -d 'From=whatsapp:+33612345678' \
  -d 'Body=fais-moi un devis pour pose carrelage 20m² salle de bain'
```

Vérifie ensuite que le devis est bien créé :

```bash
curl http://localhost:3000/api/quotes | jq
```

Le PDF est dans `storage/quotes/<userId>/`.

---

## 🗂️ Structure du code

```
chantierflow/
├── server.js                      # Entrée Express + cron
├── package.json
├── .env.example
├── Dockerfile
├── docker-compose.yml
├── src/
│   ├── db/
│   │   ├── schema.sql             # Schéma PostgreSQL
│   │   ├── init.js                # Création des tables
│   │   └── index.js               # Pool + helpers (users, quotes, invoices, …)
│   ├── prompts/
│   │   └── index.js               # Tous les prompts AI optimisés
│   ├── services/
│   │   ├── openai.js              # GPT-4o + Whisper
│   │   ├── whatsapp.js            # Twilio (envoi + download media)
│   │   ├── pdf.js                 # PDFKit (devis & factures)
│   │   └── storage.js             # S3 ou local
│   ├── handlers/
│   │   ├── router.js              # Dispatch d'intentions
│   │   ├── quote.js
│   │   ├── invoice.js
│   │   ├── voice.js
│   │   ├── photo.js
│   │   ├── reminder.js
│   │   └── client_update.js
│   ├── routes/
│   │   ├── whatsapp.js            # Webhook Twilio
│   │   └── api.js                 # API admin
│   └── jobs/
│       └── reminders.js           # Cron quotidien
└── storage/                       # PDFs locaux (si S3 désactivé)
```

---

## 🔮 Roadmap future

- [ ] App admin (Next.js) avec connexion par téléphone
- [ ] Calendrier intégré (Google Calendar / iCal)
- [ ] Géolocalisation chantier (suivi temps de présence)
- [ ] Multi-utilisateurs (équipes, ouvriers)
- [ ] Connecteurs comptables (Pennylane, Sage)
- [ ] Paiement client en ligne via le PDF (Stripe Payment Link)
- [ ] Export Factur-X conforme à la facturation électronique 2026

---

## 📝 Licence

Propriétaire — © 2026 ChantierFlow AI.
