import random

def rand_from_list(lst):
  return lst[random.randint(0, len(lst) - 1)]
