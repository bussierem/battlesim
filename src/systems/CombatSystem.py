from battle.BattleManager import *
from systems.Utilities import *
import api.MongoInterface as mongo
import bson.json_util as bson
from objects.Player import *
from objects.Enemy import *

import random
import json
import sys, os
import uuid

def get_collection(dtype):
  db = mongo.connect_to_database()
  return {
    'players': db.Players,
    'enemies': db.Enemies,
    'battles': db.Battles,
    'overviews': db.Overviews
  }.get(dtype)

class CombatSystem:
  def __init__(self, players, enemies):
    self.players = [Player(**self.get_combatant('players', p)) for p in players]
    self.enemies = [Enemy(**self.get_combatant('enemies', e)) for e in enemies]
    self.battle = BattleManager(self.players, self.enemies)
    self.turn_order = []
    self.current_index = 0
    self.battle_coll = get_collection('battles')

  def get_combatant(self, dtype, guid):
    collection = get_collection(dtype)
    return mongo.find_single(collection, mongo.id_eq_criteria(guid))

  def roll_initiative(self):
    self.turn_order = [[c, c.roll_init()['total']] for c in self.battle.combatants]
    self.turn_order.sort(key=lambda x: x[1], reverse=True)

  def next_combatant(self):
    return self.turn_order[self.current_index][0]

  def play_combat_round(self):
    round_result = []
    for i, cur_combatant in enumerate([x[0] for x in self.turn_order]):
      self.current_index = i
      print("{}'s turn! FIGHT!".format(cur_combatant.name))
      round_result.append(self.battle.combatant_turn(cur_combatant))
      if self.battle.battle_over():
        print("BATTLE OVER!")
        break
    return round_result

  def play_full_combat(self):
    combat_data = {
      "players": [p.to_json() for p in self.battle.players],
      "enemies": [e.to_json() for e in self.battle.enemies],
      "rounds": [],
      "winner": "",
      "loser": ""
    }
    self.roll_initiative()
    while not self.battle.battle_over():
      combat_data['rounds'].append(self.play_combat_round())
    if self.battle.enemies == []:
      combat_data['winner'] = "Players"
      combat_data['loser'] = "Enemies"
    else:
      combat_data['winner'] = "Enemies"
      combat_data['loser'] = "Players"
    return self.record_battle(combat_data)

  # --------------------------------- /
  # ------ UTILITY FUNCTIONS -------- /
  # --------------------------------- /

  def record_battle(self, combat_data):
    with open("test.json", "w") as wf:
      json.dump(combat_data, wf, indent=2)
    # record separate battle
    ovid = mongo.create_single(self.battle_coll, combat_data)
    return ovid


  def print_initiative(self):
    for c in self.turn_order:
      print("{}: {}".format(c[0].name, c[1]))
