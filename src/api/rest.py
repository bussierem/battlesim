from objects.attacks.Attack import *
from objects.attacks.Magic import *
from systems.CombatSystem import *
from systems.Utilities import *
import api.MongoInterface as mongo
import bson.json_util as bson

from flask import Flask, request, Response, send_from_directory
from flask_cors import CORS
from flasgger import Swagger, swag_from
import json
import os

static_folder = 'js/build'
app = Flask(__name__,static_folder=static_folder)
CORS(app)
swagger = Swagger(app)

# ------------------ /
# UTILTITY FUNCTIONS /
# ------------------ /

def get_collection(dtype):
  db = mongo.connect_to_database()
  return {
    'players': db.Players,
    'enemies': db.Enemies,
    'battles': db.Battles,
    'overviews': db.Overviews
  }.get(dtype)

def get_object_response(dtype, guid):
  collection = get_collection(dtype)
  record = mongo.find_single(collection, mongo.id_eq_criteria(guid))
  if record:
    return Response(bson.dumps(record, indent=2), status=200, mimetype="application/json")
  error = { "error": "INVALID GUID {}".format(guid) }
  return Response(json.dumps(error, indent=2), status=404)

def delete_object(dtype, guid):
  collection = get_collection(dtype)
  criteria = mongo.id_eq_criteria(guid)
  if mongo.find_single(collection, criteria) == None:
    return Response(status=404)
  mongo.delete_first(collection, criteria)
  return Response(status=204)

def create_combatant(request, ctype):
  combatant = request.get_json()
  if combatant == None:
    error = { "error": "ERROR WITH POST DATA" }
    return Response(json.dumps(error, indent=2), status=400)
  new_combatant = Player(**combatant) if ctype == "players" else Enemy(**combatant)
  collection = get_collection(ctype)
  new_id = mongo.create_single(collection, new_combatant.to_json())
  out = { "id": new_id }
  return Response(bson.dumps(out), status=201)

def update_combatant(request, ctype, guid):
  combatant = request.get_json()
  if combatant == None:
    error = { "error": "ERROR WITH POST DATA" }
    return Response(json.dumps(error, indent=2), status=400)
  updated_combatant = Player(**combatant) if ctype == "players" else Enemy(**combatant)
  collection = get_collection(ctype)
  cid = mongo.update_single(collection, guid, updated_combatant.to_json())
  out = { "id": cid }
  return Response(bson.dumps(out), status=204)


# ------------------ /
# ROUTING FUNCTIONS
# ------------------ /

# Thanks - https://stackoverflow.com/questions/44209978/serving-a-create-react-app-with-flask
@app.route('/', defaults={'path': ''})
@app.route('/static/<path:path>')
def serve(path):
  cwd = os.getcwd()
  static_path = cwd+'/'+static_folder
  if(path == ""):
    return send_from_directory(static_path, 'index.html')
  else:
    if(os.path.exists(static_path + "/" + path)):
      static_path,file = os.path.split(static_path + "/" + path)
      return send_from_directory(static_path, file)
    else:
      return send_from_directory(static_path,  'index.html')

@app.route("/spec")
def spec():
    return jsonify(swagger(app))

@app.route("/battles", endpoint='battles_no_guid', methods=['GET', 'POST'])
def battles_methods():
  if request.method == "GET":
    collection = get_collection('battles')
    battles = mongo.find_multiple(collection, {})
    resp = Response(bson.dumps(battles, indent=2), status=200, mimetype="application/json")
  elif request.method == "POST":
    teams = request.get_json()
    if teams == None:
      error = { "error": "ERROR WITH POST DATA" }
      resp = Response(json.dumps(error, indent=2), status=400)
    else:
      system = CombatSystem(teams['players'], teams['enemies'])
      overview = system.play_full_combat()
      collection = get_collection('overviews')
      ovid = mongo.create_single(collection, overview)
      overview = mongo.find_single(collection, mongo.id_eq_criteria(ovid))
      resp = Response(bson.dumps(overview, indent=2), status=200, mimetype="application/json")
  else:
    error = { "error": "UNSUPPORTED METHOD /battles [{}]".format(request.method) }
    resp = Response(json.dumps(error, indent=2), status=400)
  return resp

@app.route("/battles/<guid>", endpoint='battles_guid', methods=['GET', 'DELETE'])
def battle_methods(guid):
  resp = None
  if request.method == "GET":
    resp = get_object_response("battles", guid)
  elif request.method == "DELETE":
    resp = delete_object("battles", guid)
  else:
    error = { "error": "UNSUPPORTED METHOD /battles/<id> [{}]".format(request.method) }
    resp = Response(json.dumps(error, indent=2), status=400)
  return resp

@app.route("/players", endpoint='players_no_guid', methods=['GET', 'POST'])
@swag_from("swagger/get_players.yml", endpoint='players_no_guid', methods=['GET'])
@swag_from("swagger/create_player.yml", endpoint='players_no_guid', methods=['POST'])
def players_methods():
  if request.method == "GET":
    collection = get_collection('players')
    players = mongo.find_multiple(collection, {})
    resp = Response(bson.dumps(players, indent=2), status=200, mimetype="application/json")
  elif request.method == "POST":
    try:
      resp = create_combatant(request, 'players')
    except TypeError as e:
      error = { "error": "ERROR WITH POST DATA: {}".format(e) }
      resp = Response(json.dumps(error, indent=2), status=400)
  else:
    error = { "error": "UNSUPPORTED METHOD /players [{}]".format(request.method) }
    resp = Response(json.dumps(error, indent=2), status=400)
  return resp

@app.route("/players/<guid>", endpoint='players_guid', methods=['GET', 'PUT', 'DELETE'])
@swag_from("swagger/get_player.yml", endpoint='players_guid', methods=['GET'])
@swag_from("swagger/update_player.yml", endpoint='players_guid', methods=['PUT'])
@swag_from("swagger/delete_player.yml", endpoint='players_guid', methods=['DELETE'])
def player_methods(guid):
  if request.method == "GET":
    resp = get_object_response("players", guid)
  elif request.method == "PUT":
    resp = update_combatant(request, 'players', guid)
  elif request.method == "DELETE":
    resp = delete_object('players', guid)
  else:
    error = { "error": "UNSUPPORTED METHOD /players/<id> [{}]".format(request.method) }
    resp = Response(json.dumps(error, indent=2), status=400)
  return resp

@app.route("/enemies", endpoint='enemies_no_guid', methods=['GET', 'POST'])
@swag_from("swagger/get_enemies.yml", endpoint='enemies_no_guid', methods=['GET'])
@swag_from("swagger/create_enemy.yml", endpoint='enemies_no_guid', methods=['POST'])
def enemies_methods():
  if request.method == "GET":
    collection = get_collection('enemies')
    enemies = mongo.find_multiple(collection, {})
    resp = Response(bson.dumps(enemies, indent=2), status=200, mimetype="application/json")
  elif request.method == "POST":
    try:
      resp = create_combatant(request, 'enemies')
    except TypeError as e:
      error = { "error": "ERROR WITH POST DATA: {}".format(e) }
      resp = Response(json.dumps(error, indent=2), status=400)
  else:
    error = { "error": "UNSUPPORTED METHOD /enemies [{}]".format(request.method) }
    resp = Response(json.dumps(error, indent=2), status=400)
  return resp

@app.route("/enemies/<guid>", endpoint='enemies_guid', methods=['GET', 'PUT', 'DELETE'])
@swag_from("swagger/get_enemy.yml", endpoint='enemies_guid', methods=['GET'])
@swag_from("swagger/update_enemy.yml", endpoint='enemies_guid', methods=['PUT'])
@swag_from("swagger/delete_enemy.yml", endpoint='enemies_guid', methods=['DELETE'])
def enemy_methods(guid):
  if request.method == "GET":
    resp = get_object_response("enemies", guid)
  elif request.method == "PUT":
    resp = update_combatant(request, 'enemies', guid)
  elif request.method == "DELETE":
    resp = delete_object('enemies', guid)
  else:
    error = { "error": "UNSUPPORTED METHOD /enemies/<id> [{}]".format(request.method) }
    resp = Response(json.dumps(error, indent=2), status=400)
  return resp
