from Player import *
from Combatant import *
from attacks.Attack import *

if __name__ == "__main__":
  ranged = Attack(3, Attack_Type.Ranged, "1-5")
  melee = Attack(-2, Attack_Type.Melee, "3d6+5")
  magic = Attack(0, Attack_Type.Magic, "10d6")
  c = Combatant("Test", 1, 2, [ranged, melee])
  p1 = Player()
  p2 = Player(
    name = 'Max',
    health = 15,
    init = -2,
    attacks = [melee, magic]
  )
  print(c)
  print(p1)
  print(p2)
