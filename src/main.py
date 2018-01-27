from Player import *
from Combatant import *
from attacks.Attack import *
from attacks.Magic import *

import json

if __name__ == "__main__":
  ranged = Attack(Attack_Type.Ranged, 3, "1-5")
  melee = Attack(Attack_Type.Melee, -2, "3d6+5")
  magic = Magic(2, 0, "10d6")
  c = Combatant("Test", 1, 2, [ranged, melee])
  p1 = Player()
  p2 = Player(
    name = 'Max',
    health = 15,
    init = -2,
    attacks = [melee, magic]
  )
  print(json.dumps(c.to_json(), indent=2))
  print(json.dumps(p1.to_json(), indent=2))
  print(json.dumps(p2.to_json(), indent=2))
