from attacks.Attack import *

class Combatant(object):
    def __init__(self, name, health, initiative_mod, defense, attack_list):
        self.name = name
        self.hp = health
        self.init = initiative_mod
        self.defense = defense
        self.attacks = attack_list

    def to_json(self):
      return {
        'name': self.name,
        'health': self.hp,
        'initiative': self.init,
        'defense': self.defense,
        'attacks': [atk.to_json() for atk in self.attacks if atk.type != Attack_Type.Magic],
        'spells': [atk.to_json() for atk in self.attacks if atk.type == Attack_Type.Magic],
      }

    def __str__(self):
      out = "Name: {0}\nHealth: {1}\nInitiative: {2}\nDefense: {3}\n".format(
        self.name, self.hp,
        ("+" + str(self.init)) if (self.init >= 0) else self.init,
        self.defense
      )
      out += "".join(["  {}\n".format(a) for a in self.attacks])
      return out