# Target Experience Spec — synthèse des 4 brainstorms (2026-06-12)

> Source : 4 analyses parallèles (funnel complet · hub quotidien · boucle d'apprentissage ·
> progression/identité), chacune avec wireframes, copy mot-à-mot et deltas P0/P1/P2.
> Ce document fige LES DÉCISIONS et l'ordre de construction. Fil rouge unique :
> **chiffre réel → conséquence dite → une action** — et **le board EST le bouton**.

## A. Bugs critiques découverts (à corriger AVANT toute feature)

| # | Bug | Effet | Fichiers |
|---|---|---|---|
| F1 | Le résultat du DNA test n'est JAMAIS envoyé au serveur (nouveau flow zustand n'écrit ni `chq_pending_dna` ni POST `/api/dna-test`) | 100% des nouveaux inscrits voient « Take the Chess DNA Test » après l'avoir fini — churn J0 maximal | `useDnaTest.ts`, `PendingDnaSync.tsx`, signup |
| F2 | `/welcome` post-paiement affiche `DEMO_ARRIVAL` codé en dur | Chaque acheteur lit le diagnostic d'un autre, juste après avoir payé | `app/welcome/page.tsx` |
| F3 | Checkout Paddle possible SANS compte (entitlement orphelin, puis mur /signin) | Revenu payé non rattaché + pire post-achat possible | `HeroSelectScreen`, `paddle.ts` |
| F4 | Témoignages fabriqués (photos randomuser, « +180 rating ») + panneau analytics non étiqueté démo, sur l'écran de paiement | Violation loi d'honnêteté au moment le plus sensible | `HeroSelectScreen.tsx:303-315` |
| F5 | Carte démo landing affiche « Position 7/20 » (test réel = 8) | Incohérence détectée en 30 s par la cible | `ProductDemoS3.tsx` |

## B. Systèmes transversaux (composants à créer une fois, utilisés partout)

1. **`MiniBoard`** — Board read-only, 3 tailles (hero ~380px · card ~96px · chip ~72px),
   cliquable = c'est le CTA. Règle : montre toujours LA position que le clic fait travailler ;
   jamais de position générique/inventée (tout sort de `fenAfter()` + file SRS réelle).
2. **`NotationStrip`** — 3 variantes : `full` (Learn : ruban complet, coup courant en or),
   `path` (Drill/Review : chemin parcouru = indice de rappel), `scoresheet` (Duel : feuille de partie).
3. **`ModeChip`** — le contrat du mode en 200 ms : `GUIDED — the move is shown` (or) ·
   `RECALL — from memory` (neutre) · `EXAM — 1 slip forgiven` (accent realm). Le plateau
   reste identique dans les trois ; seul le chrome change.
4. **Tap-tap** sur `Board.tsx` (en plus du drag) — un endroit, bénéficie aux 6 écrans de jeu.
5. **`Nudge`** — popover ancré, 1 phrase + 1 lien, à la PREMIÈRE rencontre signifiante du
   concept (IQ quand il change · streak J2 · XP au 1er gain · seal au 1er sceau · realm à
   l'arrivée sur /quest). Max 1/session, file de priorité seal>IQ>streak>realm>XP, localStorage.
6. **Célébrations 3 paliers** — toast (level/streak) · carte inline (ligne **Gold**) ·
   plein écran une-seule-fois (**Seal posé** · **Realm conquis**). Chaque célébration contient
   le chiffre réel qui l'a déclenchée. Jamais de confetti générique — stamp/flamme/bannière.

## C. Décisions par surface (cibles arbitrées)

### Funnel
- **Ordre conservé** : / → dna-test → style-quiz → result → hero-select (Premium défaut,
  décision fondateur — instrumenter checkout_start vs bounce, inverser si bounce >60%).
- **Email capture sur /result** (pic émotionnel, jamais bloquant) : « Keep your result —
  your DNA card + your 3-opening plan, in your inbox. » → débloque retargeting + emails.
- **Compte obligatoire avant Paddle** (email magic-link léger) ; post-paiement → /welcome
  en VRAIES données ; /welcome servi aussi aux free signups.
- **/result** : reco #1 de la Road répond TOUJOURS à la faiblesse affichée ; board du leak
  (« This is where it goes wrong for you ») ; reveal séquencé crest→gauge→raisons→road.
- **Signup** = « Save your Chess DNA » avec récap de ce qu'on sauvegarde ; POST du résultat (F1).
- **Landing** : carte démo → vérité (« Position 3/8 », nom+ECO au stage TEST, feedback
  explorer dans la démo, stepper cliquable, mention « Demo data ») ; three-steps carte 2 →
  mini-drill avec board ; CTA sous la rangée ; mini-board dans le hero.
- **/train first-run** : « Day 1 — Your first line awaits » + missions J1 (jamais
  « Streak lost » ni « All clear » sur un compte de 3 minutes).

### Hub quotidien
- **Today** : héros split 55/45 — texte directive | **échiquier du jour** (1ʳᵉ carte SRS due,
  orientation joueur, dernier coup marqué) ; mini-boards 96px sur les 3 mission cards ;
  streak retiré du HUD (vit dans la topbar, source unique) ; padding tabbar mobile.
- **Quest** : la carte reste l'écran ; le chess entre par le **dossier de nœud** (panneau
  droit desktop / bottom-sheet mobile, ouvert par défaut sur le nœud actif : tabiya en
  mini-board + « 0/5 lines · ~6 min » + CTA nommé). Dash-draw du chemin à chaque conquête.
- **Realms** : mini-board « Next: {opening} » par carte + ligne Realm Boss ; carte courante
  en double format.
- **Shell** : 3 fixes mobile (chip IQ déborde, tabbar recouvre, streak doublon) ;
  count-up des chips quand la valeur change — le dynamique = la donnée qui bouge.

### Boucle d'apprentissage
- **Gating arbitré** : Guardian débloqué par UN passage de drill complet (pas gold) ;
  Gauntlet = 5/5 gold (inchangé). Stepper `Learn ✓ → Drill ✓ → Guardian` par ligne sur
  Opening detail + **bouton unique calculé** (l'étape suivante, le reste en ghost).
- **Learn** : ruban notation + hints from/to + chip de camp (« You play White — Black's
  replies are shown so you learn WHY ») ; fusionner le prototype /world/learn puis le retirer.
- **Drill** : orientation FIXE = ton camp ; idée affichée au succès (encodage) ; fix `j`→`d`.
- **Review** : ré-ancrage par carte (nom + camp + chemin) ; fin = CTA calculé sur la pire ligne.
- **Duel** : toast pédagogique au slip (coup attendu + idée, à rejouer pour continuer) ;
  feuille de partie ; victoire = récap ligne (slip marqué) + delta maîtrise + UN CTA contextuel.
- **Gauntlet** : interlude annonce le CAMP (« Next: Scandinavian — you command Black ») ;
  double rangée de dots (ouvertures + coups) ; défaite nomme la ligne fautive.

### Progression & identité
- **Insights** : carte Road → « Opening Readiness » avec état 100% atteint ; carte Focus →
  « Fix first » : UNIQUEMENT leak/review, couleur par état, conséquence dite (« You'd be out
  of book by move 6 ») + bouton « Patch it → 3 min » ; delta IQ daté (« +324 since May 14 ») ;
  sync inline (fait ✔). P1 : mini-board du leak n°1 ; croisement sync↔leak.
- **Passport** : **4 états de médaillon** (Unexplored · In training avec anneau x/y ·
  Ready-to-seal pulsant or · Sealed daté) ; bandeau **« Next seal »** calculé en tête
  (mini-board + portrait Gardien + CTA) ; règle du jeu en 3 pas sur le cover ; header de
  realm avec état du Realm Boss.
- **Profile** : carte de héros partageable — portrait plein, titre dominant gagné, IQ +
  sparkline + delta, rangée des sceaux réels, records, « At the board » (meilleure ouverture
  sur vraies parties), DNA + retake, RoadGoalPicker. Que des acquis, jamais des à-faire.
- **Emails** : streak rescue + dueCount et ligne fragile nommée ; weekly + mouvement de
  sceaux + leak de la semaine + CTA conditionnel.

## D. Ordre de construction

**Sprint 1 — réparer (les F1-F5 + sémantique)** : F1 sync DNA au signup · F2 /welcome vraies
données (+ servir aux free) · F3 compte avant Paddle · F4 témoignages out + analytics
étiquetée · F5 « /8 » partout · Insights sémantique (readiness/fix-first/couleurs) ·
3 fixes mobile shell.
**Sprint 2 — chess-first (les boards)** : MiniBoard + NotationStrip + ModeChip + tap-tap ·
Today échiquier du jour + missions · Opening detail stepper/gating · Duel toast slip +
feuille · Drill orientation/idée · Quest dossier de nœud.
**Sprint 3 — comprendre & vouloir** : Passport 4 états + Next seal · Profile carte de héros ·
Célébrations Gold/Seal · Nudges · first-run /train · email capture /result · landing démo.

Détails complets (wireframes + copy intégral) : rapports des 4 agents, session du 2026-06-12.
