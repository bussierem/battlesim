import random

class CombatSystem:
  def __init__(self, combatants):
    self.combatants = combatants
    self.turn_order = []

  def roll_initiative(self):
    for c in combatants:
    rolls = {c: c.roll_init()['total'] for c in self.combatants}
