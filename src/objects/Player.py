from Combatant import *
from attacks.Attack import *

class Player(Combatant):
  def __init__(self, **kwargs):
    Combatant.__init__(
      self,
      kwargs.get('name', "Player"),
      kwargs.get('health', 10),
      kwargs.get('init', 0),
      kwargs.get('defense', 10),
      kwargs.get('attacks', [])
    )
    self.level = kwargs.get('level', 1)
    self.consumables = kwargs.get('consumables', 0)
    self.regenerators = kwargs.get('regenerators', 0)

  def to_json(self):
    base = Combatant.to_json(self)
    base['level'] = self.level
    base['consumables'] = self.consumables
    base['regenerators'] = self.regenerators
    return base

  def __str__(self):
    out = ""
    out += "Name: {0}\nLevel: {1}\nHealth: {2}\nInitiative: {3}\n".format(
      self.name, self.level, self.hp,
      ("+" + str(self.init)) if (self.init >= 0) else self.init
    )
    out += "Consumables: {0}\nRegenerators: {1}\n".format(
      self.consumables, self.regenerators
    )
    out += "".join(["  {}\n".format(a) for a in self.attacks])
    return out
