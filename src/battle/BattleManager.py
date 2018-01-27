from objects.Player import *
from objects.Enemy import *
from systems.Utilities import *

class BattleManager:
  def __init__(self, combatants):
    self.combatants = combatants
    self.players = [c for c in combatants if isinstance(c, Player)]
    self.enemies = [c for c in combatants if isinstance(c, Enemy)]

  def get_by_name(self, name):
    return next(c for c in self.combatants if c.name == name)

  def battle_over(self):
    return 0 in [len(self.enemies), len(self.players)]

  def kill_combatant(self, combatant):
    if isinstance(combatant, Player):
      print("Killing Player {}".format(combatant.name))
      self.players.remove(combatant)
    else:
      print("Killing Enemy {}".format(combatant.name))
      self.enemies.remove(combatant)
    self.combatants.remove(combatant)

  def combatant_turn(self, combatant):
    result = {}
    result['attacker'] = combatant
    if isinstance(combatant, Enemy):
      target = rand_from_list(self.players)
    else:
      target = rand_from_list(self.enemies)
    print("Target:  {} ({} HP, {} DEF)".format(target.name, target.hp, target.defense))
    result['defender'] = target
    # Get attack results
    atk_result = combatant.attack(target)
    print("-------------")
    killed = False
    if target.hp <= 0:
      print("Target Died!")
      self.kill_combatant(target)
      killed = True
    result['killed_target'] = killed
    return {**result, **atk_result}
