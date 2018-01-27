from battle.BattleManager import *

import random

class CombatSystem:
  def __init__(self, combatants):
    self.battle = BattleManager(combatants)
    self.turn_order = []
    self.current_index = 0

  def roll_initiative(self):
    self.turn_order = [[c, c.roll_init()['total']] for c in self.battle.combatants]
    self.turn_order.sort(key=lambda x: x[1], reverse=True)

  def next_combatant(self):
    return self.turn_order[self.current_index][0]

  def play_combat_round(self):
    for i, cur_combatant in enumerate([x[0] for x in self.turn_order]):
      self.current_index = i
      print("{}'s turn! FIGHT!".format(cur_combatant.name))
      turn_result = self.battle.combatant_turn(cur_combatant)
      # NOTE: Verbose output only
      # print("Battle Result:\n", turn_result)
      if self.battle.battle_over():
        print("BATTLE OVER!")
        break

  def play_full_combat(self):
    while not self.battle.battle_over():
      self.play_combat_round()
    print("PLAYERS WON!" if self.battle.enemies == [] else "ENEMIES WON!")

  # --------------------------------- /
  # ------ UTILITY FUNCTIONS -------- /
  # --------------------------------- /

  def print_initiative(self):
    for c in self.turn_order:
      print("{}: {}".format(c[0].name, c[1]))
