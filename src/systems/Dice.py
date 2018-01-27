import re

BEAST = r'(?P<count>\d+)d(?P<dice>[\d]+)(?P<bonus>[+-]\d+)?'

def roll_dice(dice_str):
  results = re.match(BEAST, dice_str)
  print(results)
