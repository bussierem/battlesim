# Battle Simulator

# Installation/Run Instructions

## Endpoints
  - GET ALL /battle
  - GET /battle/<id>
  - GET /battle/<id>/step/<id>
  - POST /enemy
  - POST /player

## Client Installation
1. `npm install`
2. `npm start`

---

## Game
  - Dice System (d20, d100, **future:  Dice Pool**)

## COMBATANTS
  - Health
  - [Attack](#attacks) List
  - Initiative bonus
  - Defense
  - Sub-Types:  [Player](#players) or [Enemy](#enemies)

## PLAYERS
  - [Resources](#resources)
  - Level

## ENEMIES
  - Challenge Rating (CR)

## TRAPS
  - Attack(s)
  - Damage Range

## ATTACKS
  - Hit bonus
  - Attack Type (Melee, Ranged, Magic)
  - Damage Range (Min-Max)
    - **ALTERNATIVE:**  Damage _roll text_ **XdY(+/-)B**
  - Sub-Types:  [Spell](#spells)

## SPELLS
  - Spell Level
  - **FUTURE:** Saving Throws (would require saving throws on [Combatants](#combatants))

## RESOURCES
  - Represents:
    - "Consumables":
      - Potions, Scrolls, etc
    - "Regenerators":
      - Magic Spell Slots
        - IDEA:  Each spell level uses (level) resources from Regenerators pool
      - Daily Abilities
      - Daily Item uses
  - Option 1:  Single "Resource" value representing all things for players
    - CON:  There is a difference between "Consumables" and "Regenerators"
    - PRO:  Simplest
  - Option 2:  2 Resource values (Consumables and Regenerators)
    - CON:  Might not be granular enough for encounter vs. daily regen
    - PRO:  Versatile but still relatively easy
  - Option 3:  Track/add resources separately
    - CON:  Extremely Granular, and different systems have lists of these
    - PRO:  Most versatile, allows for system-like simulation

## OTHER SYSTEMS:
  - Something that translates from "Level" to stats for Combatants
  - Turn tracking for a combat
  - **FUTURE:**
    - Something for adding/storing enemies from bestiaries
    - Balancing around taking full day instead of using resources
