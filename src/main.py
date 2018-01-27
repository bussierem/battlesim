from systems.Dice import *
from systems.CombatSystem import *
# from objects import *
from objects.Combatant import *
from objects.Player import *
from objects.Enemy import *
from objects.attacks.Attack import *
from objects.attacks.Magic import *

if __name__ == "__main__":
  #  NOTE: Using Dice Roller
  # result = roll_dice("5d10-1")
  # print("Total: {}".format(result['total']))
  # print("Rolls: {}".format(result['rolls']))
  # print("Bonus: {}".format(result['bonus']))
  # print(rand_from_range("5-10"))
  # print(rand_from_range("50-100"))
  melee = Attack(Attack_Type.Melee, 4, "1d8+2")
  ranged = Attack(Attack_Type.Ranged, 2, "1d6")
  spell = Magic(1, 4, "5-20")
  p1 = Player(
    name="Max",
    level=4,
    health=20,
    initiative=2,
    defense=15,
    attacks=[melee, ranged],
    spells=[spell],
    consumables=4,
    regenerators=10
  )
  print(p1)
  melee2 = Attack(Attack_Type.Melee, 2, "1d6+2")
  ranged2 = Attack(Attack_Type.Ranged, 1, "1d4")
  enemy = Enemy(
    name="Goblin",
    cr=2,
    health=15,
    initiative=1,
    defense=12,
    attacks=[melee2, ranged2]
  )
  print(enemy)

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
