import random

class CombatSystem:
  def __init__(self, combatants):
    self.combatants = combatants
    self.turn_order = []

  def roll_initiative(self):
    for c in combatants:
      roll = c.roll_init()['total']
      if self.turn_order == []:
        self.turn_order.append(roll)
        continue

      
