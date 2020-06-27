const FOODS = {
  4: 'Beef',
  5: 'Pasta',
  8: 'Lamb',
  9: 'Veal',
  10: 'Pork',
  11: 'Game (deer, venison)',
  12: 'Rich fish (salmon, tuna etc)',
  13: 'Shellfish',
  15: 'Spicy food',
  16: 'Sweet desserts',
  17: 'Mature and hard cheese',
  19: 'Vegetarian',
  20: 'Poultry',
  21: 'Any junk food will do',
  27: 'Appetizers and snacks',
  28: 'Lean fish',
  34: 'Mushrooms',
  35: 'Mild and soft cheese',
  37: 'Fruity desserts',
  38: 'Blue cheese',
  39: 'Goat cheese',
  40: 'Aperitif',
  41: 'Cured Meat'
}

const foods = (i) => {
  return FOODS[i];
}

export default foods;