from systems.Dice import *

if __name__ == "__main__":
  roll_dice("1d6+1")
  roll_dice("5d10-1")
  roll_dice("1d20")

"""
roll initiative
setup turn orders
COMBAT:
  for each round:
    select next combatant
    for each turn:
      pick target
      grab both combatants, send to "fight"
      FIGHTS:
        pick attacker.attack from attacker.attacks or attacker.spells
        get dice system, roll + attacker.attack.hit
        check vs. defender.defense
        if hit:
          roll attacker.attack.damage (randrange or actual dice roll)
          deal that damage to defender.hp
        if magic:
          subtract attacker.spell.level from attacker.regenerators
        if defender.hp <= 0:
          kill defender
      move combatants back to parties if alive
"""
