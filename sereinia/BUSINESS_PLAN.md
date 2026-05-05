# Sereinia — Plan Bootstrap

**Le SaaS de gestion pour pompes funèbres indépendantes**

> *Plan version bootstrap — solo founder, sans levée de fonds — mai 2026*

---

## ⚡ TL;DR — La version honnête

| | |
|---|---|
| **Investissement total** | **~ 4 500 €** (pas 350 k€) |
| **Équipe** | **Toi, seul** |
| **Temps avant 1ᵉʳ client payant** | 3 mois |
| **Temps avant rentabilité perso** (= tu te paies) | 6-9 mois |
| **Objectif réaliste 12 mois** | 30 clients × 249 € = **7 470 €/mois MRR** |
| **Objectif réaliste 24 mois** | 100 clients × ACV ~3 200 €/an = **320 k€ ARR** |

C'est largement faisable. Pas besoin d'investisseurs.

---

## 1. Le principe bootstrap

**Règle n°1** : tu ne dépenses jamais d'argent que tu n'as pas encore gagné.
**Règle n°2** : tu vends **avant** de coder.
**Règle n°3** : tu utilises des outils gratuits ou quasi gratuits.
**Règle n°4** : tu encaisses dès le mois 1 (paiement annuel à l'avance).

---

## 2. Investissement initial : **4 500 €**

| Poste | Coût | Notes |
|---|---|---|
| Domaine `.fr` ou `.io` | 15 € | OVH ou Cloudflare |
| Logo + identité visuelle | 200 € | Fiverr ou Canva Pro |
| Hébergement (Vercel + Supabase) | 0 € → 25 €/mois | Gratuit jusqu'à 100+ utilisateurs |
| Outils SaaS (Stripe, Resend, Sentry) | 0 € | Gratuit jusqu'au volume |
| Stripe | 0 € fixe | 1,5 % + 0,25 € par transaction |
| Statut juridique (auto-entreprise → SASU plus tard) | 0 € | Auto-entreprise gratuit |
| Marge de sécurité (publicité ciblée, salon test) | 2 000 € | Optionnel mois 4-6 |
| **Trésorerie perso** (vivre 3 mois sans revenu) | 2 200 € | Calé sur 750 €/mois minimum |

> **Si tu n'as pas 4 500 €**, tu peux démarrer avec 500 € (domaine + ARCE chômage si tu y as droit).

---

## 3. Stack technique gratuite

| Couche | Outil | Coût mois 1-12 |
|---|---|---|
| Frontend | **Next.js + Tailwind** (open source) | 0 € |
| Backend / Auth / DB | **Supabase** | 0 € jusqu'à 500 Mo |
| Hébergement | **Vercel** | 0 € (plan Hobby) |
| Email transactionnel | **Resend** | 0 € (3 000 emails/mois) |
| Paiements | **Stripe** | 1,5 % + 0,25 € / paiement |
| Signature électronique | **Yousign** ou DocuSeal | ~ 9 €/mois |
| Monitoring | **Sentry** | 0 € (5k events/mois) |
| Domain + DNS | **Cloudflare** | 0-15 € |

**Total tech an 1 : ~ 100 €/mois max.**

---

## 4. Plan d'attaque en 4 étapes

### 🎯 Étape 1 — Vendre avant de coder (semaines 1-3)

**Objectif : 5 LOI (Letter of Intent) signées avant la première ligne de code.**

Tu appelles 30 pompes funèbres indépendantes. Script :

> "Bonjour, je m'appelle [prénom]. Je travaille sur un outil web simple pour gérer dossiers familles, devis et facturation des pompes funèbres indépendantes. Je n'essaie pas de vous vendre quelque chose aujourd'hui, j'aimerais juste 15 minutes pour comprendre comment vous gérez votre admin actuellement. Vous avez un créneau cette semaine ?"

Si l'entretien va bien, à la fin :
> "Si je construis exactement ce dont on vient de parler, et que je vous le facture 199 € HT/mois la première année (au lieu de 249 €), vous seriez prêt à me signer une lettre d'intérêt non engageante ?"

**Coût : 0 €. Temps : 20 h sur 3 semaines.**

> 💡 Une LOI signée = tu sais que ton produit sera acheté.

---

### 🛠️ Étape 2 — MVP solo en 60 jours (semaines 4-12)

**Périmètre minimum vital** (tu coupes tout le reste) :

1. ✅ Création dossier famille (formulaire simple)
2. ✅ Génération devis PDF (avec ta charte)
3. ✅ Signature électronique du devis
4. ✅ Facture PDF + envoi email
5. ✅ Mini-tableau de bord (CA du mois, dossiers en cours)

**Ce qu'on coupe pour le MVP** :
- ❌ Multi-agences
- ❌ App mobile
- ❌ Marketplace partenaires
- ❌ Connecteurs comptables
- ❌ IA / automatisations

**Si tu sais coder** : tu fais tout toi-même en 60 j.
**Si tu ne sais pas coder** : tu utilises **Bubble.io** ou **Softr** (no-code) pour 30 €/mois et tu construis le MVP en 30 j.

**Coût : 0 € si tu codes, 90 € si no-code.**

---

### 💰 Étape 3 — Premiers clients payants (mois 3-6)

Tu reviens vers tes 5 LOI et tu leur dis :
> "L'outil est prêt. Comme convenu, 199 €/mois HT pour les early adopters. Vous voulez démarrer cette semaine ?"

**Conversion attendue : 3-4 sur 5 → 600-800 €/mois MRR.**

Puis tu reprends le téléphone. Maintenant tu peux dire :
> "On est utilisé par X agences en France, dont Pompes funèbres Y à [ville]. Vous voulez un démo de 15 min ?"

**Objectif mois 6 : 15 clients × 199 € = 2 985 €/mois MRR.**

À ce stade tu te paies déjà.

---

### 📈 Étape 4 — Croissance auto-financée (mois 6-12)

Maintenant chaque euro de CA finance le suivant. Tu choisis ce que tu fais avec :

| Option | Coût | Retour |
|---|---|---|
| **Salon Funéraire Paris** (1 jour) | 1 500 € | 5-8 prospects qualifiés |
| **Annonces LinkedIn ciblées gérants** | 300 €/mois | 2-3 leads/mois |
| **Article SEO "comment moderniser sa pompe funèbre"** | 200 € (rédacteur) | trafic long terme |
| **1 commercial freelance à la commission** | 0 € fixe + 30 % | 2-3 clients/mois |

**Objectif mois 12 : 30 clients × 249 € = 7 470 €/mois (89 k€ ARR).**

Tu vis bien (prélèvement mensuel ~4 500 € net) et tu réinvestis 3 000 €/mois en croissance.

---

## 5. Modèle économique simplifié

### Pricing bootstrap (uniquement 2 plans)

| Plan | Prix | Cible |
|---|---|---|
| **Essentiel** | **149 €/mois HT** | Solo, < 60 dossiers/an |
| **Agence** | **249 €/mois HT** | Équipe, jusqu'à 5 utilisateurs |

> Pas de "Multi-agences" ni "Enterprise" au début. Tu ajouteras quand tu auras 50 clients.

### Encaissement

- **Paiement annuel obligatoire à -15 %** → tu encaisses 12 mois d'avance
- Stripe Subscriptions ou GoCardless (prélèvement SEPA, frais 0,25 % vs 1,5 % CB)

> 💡 Si 1 client te paie 2 540 € (12 × 249 € − 15 %) en mois 1, tu as déjà couvert ton hébergement de l'année.

---

## 6. Projections financières bootstrap (12 mois)

Hypothèses prudentes :
- ACV moyen : 2 700 € (mix Essentiel/Agence avec remise annuelle)
- Acquisition : 1 client/mois en moyenne sur 12 mois (croissance linéaire)
- Aucun salaire fondateur (tu te paies en dividendes ou TNS dès rentabilité)

| Mois | Clients | MRR | ARR | Cash-flow |
|---|---|---|---|---|
| M1-3 | 0 | 0 | 0 | −1 500 € (dev MVP) |
| M4 | 3 | 600 € | 7,2 k€ | +600 € |
| M6 | 8 | 1 700 € | 21 k€ | +1 700 € |
| M9 | 18 | 4 200 € | 50 k€ | +4 200 € |
| **M12** | **30** | **7 500 €** | **90 k€** | **+7 500 €/mois** |

**Total cash sortie an 1 : ~ 4 500 € (investissement initial).**
**Total cash entrée an 1 : ~ 35 000 € (MRR cumulé).**
**Bénéfice an 1 : ~ 30 000 €** que tu te verses ou réinvestis.

### Année 2 — sans rien changer à la stratégie

| Mois | Clients | MRR | ARR |
|---|---|---|---|
| M18 | 60 | 14 k€ | 175 k€ |
| **M24** | **100** | **23 k€** | **280 k€** |

À ce stade tu peux embaucher 1 personne (commercial ou support) et viser 500 k€ ARR an 3.

---

## 7. Tâches concrètes pour les 30 prochains jours

### Semaine 1
- [ ] Listing 50 pompes funèbres indépendantes (Pages Jaunes, filtre indépendants)
- [ ] Réservation domaine + création compte Stripe + SIREN micro-entreprise
- [ ] Brief logo sur Fiverr (50-100 €)

### Semaine 2
- [ ] Appels de découverte (10/jour pendant 5 jours = 50 appels)
- [ ] 5 entretiens visio de 30 min programmés
- [ ] Landing page simple (1 page Notion ou 1 fichier HTML hébergé sur Vercel)

### Semaine 3
- [ ] 10 entretiens approfondis menés
- [ ] Synthèse des 5 douleurs principales (à coder en MVP)
- [ ] Demande de 5 LOI signées (à 199 €/mois early bird)

### Semaine 4
- [ ] Choix tech : Next.js + Supabase OU Bubble (no-code)
- [ ] Architecture data (4 tables : agences, dossiers, devis, factures)
- [ ] Wireframes (Figma gratuit ou papier)

---

## 8. Ce qui peut foirer (et comment l'éviter)

| Risque | Mitigation |
|---|---|
| **Personne ne te répond au téléphone** | Demande à un proche dans le BTP/funéraire de te présenter à 1 gérant. Effet boule de neige. |
| **Tu codes 6 mois sans vendre** | Bloque toi-même : "interdit de coder tant que je n'ai pas 5 LOI" |
| **Tu mets 6 mois à faire un MVP** | Coupe tout sauf les 5 features vitales. Si une feature n'est pas dans 5 LOI sur 5, tu la coupes. |
| **Tu dépenses en pub avant d'avoir un produit** | Aucun budget marketing avant 10 clients payants |
| **Tu sous-tarifes** | Ne descends jamais en dessous de 149 €/mois. Mieux vaut 5 clients à 249 € que 20 à 49 €. |

---

## 9. Quand passer en mode "scale" ?

Tu repenseras à lever des fonds **uniquement si** :

- ✅ Tu as **>100 clients payants**
- ✅ Tu as un **churn < 1 %/mois**
- ✅ Tu as identifié 1 canal d'acquisition qui fonctionne (CAC < 1 200 €)
- ✅ Tu veux **embaucher 5+ personnes en 18 mois** pour grossir vite

Avant ça, **toute levée de fonds te diluera pour rien**.

> Beaucoup de SaaS bootstrappés font 1-3 M€ ARR et restent rentables, profitables et indépendants. Doctolib a démarré ainsi. Pennylane aussi.

---

## 10. Prochaine action **maintenant**

Pas dans 3 jours. **Maintenant.**

1. Ouvre Pages Jaunes
2. Cherche "pompes funèbres" dans ta ville + 2 villes voisines
3. Note 20 numéros
4. Demain matin, appelle 10. Le surlendemain, les 10 autres.

C'est tout. Tout le reste découle de ces 20 appels.

---

**Document à itérer après chaque entretien client.**
