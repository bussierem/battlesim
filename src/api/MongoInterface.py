from pymongo import MongoClient, ASCENDING, errors
from bson.objectid import ObjectId
import datetime

DB_NAME = 'battle-sim'
DB_CONNECT = "mongodb://{}:{}@ds119078.mlab.com:19078/battle-sim"

# UTILITY FUNCTIONS
def rupff():
  with open('../../data/secrets', 'r') as f:
    return ["".join(re.findall(r'X\w',x)).replace('X','') for x in f.read().split('=')]

def connect_to_database():
  client = MongoClient(DB_CONNECT.format(*rupff()))
  return client[DB_NAME]

# Criteria Building
# Requires comparisons in the format "<key> <operator> <value>"
# valid operators: ['==', '!=', '<', '>', '<=', '>=']
def build_criteria(comparisons):
  criteria = {}
  for c in comparisons:
    key, op, val = c.split(' ')
    val = ObjectId(val) if key == '_id' else val
    func = {
      '==': eq_criteria,
      '!=': not_eq_criteria,
      '<': lt_criteria,
      '<=': lt_eq_criteria,
      '>': gt_criteria,
      '>=': gt_eq_criteria,
    }.get(op)
    criteria = func(key, val, criteria)
  return criteria

def id_eq_criteria(guid):
  return { '_id': ObjectId(guid) }

def lt_criteria(key, value, criteria={}):
  return { **criteria, key: { '$lt': value } }

def lt_eq_criteria(key, value, criteria={}):
  return { **criteria, key: { '$lte': value } }

def gt_criteria(key, value, criteria={}):
  return { **criteria, key: { '$gt': value } }

def gt_eq_criteria(key, value, criteria={}):
  return { **criteria, key: { '$gte': value } }

def eq_criteria(key, value, criteria={}):
  return { **criteria, key: value }

def not_eq_criteria(key, value, criteria={}):
  return { **criteria, key: { '$ne': value } }

def add_creation_date(record):
  return { **record, "created": datetime.datetime.utcnow() }

# CREATE
def create_single(collection, record):
  # Insert Record, get ID
  return collection.insert_one(record).inserted_id

def create_multiple(collection, records):
  # Insert list of records, get list of ObjectId objects back
  return collection.insert_many(records).inserted_ids

# READ
def find_single(collection, criteria):
  # Retrieve a single record matching the criteria
  return collection.find_one(criteria)

def find_multiple(collection, criteria):
  # Returns a list of docs in dict form
  return collection.find(criteria)

# UPDATE
def update_single(collection, guid, new_record):
  # Changes the record with the matching guid to the new provided record
  return collection.replace_one(ObjectId(guid), new_record)

# DELETE
def delete_first(collection, criteria):
  # Removes the first match for the criteria
  return collection.remove(criteria, 1)

def delete_multiple(collection, criteria):
  # Deletes any matches to the criteria
  return collection.remove(criteria)
