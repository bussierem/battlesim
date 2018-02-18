from objects.Player import *
from objects.Enemy import *
from systems.Utilities import *

class BattleManager:
  def __init__(self, players, enemies):
    self.players = players
    self.enemies = enemies
    self.combatants = [*players, *enemies]

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
    if isinstance(combatant, Enemy):
      target = rand_from_list(self.players)
    else:
      target = rand_from_list(self.enemies)
    print("Target:  {} ({} HP, {} DEF)".format(target.name, target.hp, target.defense))
    # Get attack results
    result['attacker_before'] = combatant.to_json()
    result['defender_before'] = target.to_json()
    atk_result = combatant.attack(target)
    result['attacker_after'] = combatant.to_json()
    result['defender_after'] = target.to_json()
    print("-------------")
    killed = False
    if target.hp <= 0:
      print("Target Died!")
      self.kill_combatant(target)
      killed = True
    atk_result['killed'] = killed
    return {**result, "attack": atk_result}
