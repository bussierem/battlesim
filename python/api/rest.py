from flask import Flask
import json
app = Flask(__name__)

def load_battle_file(battle_file):
  data = ""
  with open(battle_file, "r") as bf:
    data = json.loads(bf.read())
  print(json.dumps(data, indent=2))
  return data

@app.route("/battles")
def get_battles():
  battles = load_battle_file("../../data/battle.json")
  return json.dumps(battles, indent=2)
