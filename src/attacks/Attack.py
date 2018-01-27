import random
from enum import Enum

class Attack_Type(Enum):
  Melee = "Melee"
  Ranged = "Ranged"
  Magic = "Magic"

class Attack:
  def __init__(self, self_type, hit_bonus, damage_str):
    self.type = self_type
    self.hit = hit_bonus
    # damage_str can be either "<min>-<max>" or "XdY+B" format
    self.damage = damage_str

  def to_json(self):
    return {
      'type': self.type.name,
      'hit': self.hit,
      'damage': self.damage
    }

  def __str__(self):
    dmg = self.damage.split('-') if '-' in self.damage else self.damage
    isRange = isinstance(dmg, tuple)
    return "{0} Attack: {1}, {2}{3} damage".format(
      self.type.name,
      "+{}".format(self.hit) if self.hit >= 0 else self.hit,
      dmg[0] if isRange else dmg,
      "-" + dmg[1] if isRange else ""
    )
