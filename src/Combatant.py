from attacks.Attack import *

class Combatant(object):
    def __init__(self, name, health, initiative_mod, attack_list):
        self.name = name
        self.hp = health
        self.init = initiative_mod
        self.attacks = attack_list

    def __str__(self):
      out = "Name: {0}\nHealth: {1}\nInitiative: {2}\n".format(
        self.name, self.hp,
        ("+" + str(self.init)) if (self.init >= 0) else self.init
      )
      out += "".join(["  {}\n".format(a) for a in self.attacks])
      return out
