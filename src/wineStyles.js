const WINE_STYLES = {  
  1: 'Spanish Albariño',
  2: 'Portuguese Alentejo Red',
  3: 'Italian Amarone',
  4: 'Italian Asti',
  5: 'Italian Barbaresco',
  6: 'Italian Barbera',
  7: 'Italian Barolo',
  8: 'Beaujolais Red',
  9: 'Italian Bolgheri',
  10: 'Argentinian Bonarda',
  11: 'Argentinian Bordeaux Blend',
  12: 'Australian Bordeaux Blend',
  13: 'Brazilian Bordeaux Blend',
  14: 'Chilean Bordeaux Blend',
  15: 'New Zealand Bordeaux Blend',
  16: 'South African Bordeaux Blend',
  17: 'Californian Bordeaux Blend',
  19: 'Bordeaux Red',
  21: 'Bordeaux White',
  22: 'Italian Brunello',
  23: 'Burgundy Red',
  24: 'Burgundy White',
  25: 'Brazilian Cabernet Franc',
  26: 'Californian Cabernet Franc',
  27: 'Canadian Cabernet Franc',
  28: 'Argentinian Cabernet Sauvignon - Malbec',
  29: 'Argentinian Cabernet Sauvignon',
  30: 'Australian Cabernet Sauvignon',
  31: 'Brazilian Cabernet Sauvignon',
  32: 'Californian Cabernet Sauvignon',
  33: 'Canadian Cabernet Sauvignon',
  34: 'Chilean Cabernet Sauvignon',
  35: 'Israeli Cabernet Sauvignon',
  36: 'Mexican Cabernet Sauvignon',
  37: 'New Zealand Cabernet Sauvignon',
  38: 'South African Cabernet Sauvignon',
  39: 'Spanish Cabernet Sauvignon',
  40: 'Uruguay Cabernet Sauvignon',
  41: 'Washington State Cabernet Sauvignon',
  42: 'Australian Cabernet - Shiraz',
  43: 'Chilean Cabernet - Syrah',
  44: 'South African Cabernet - Syrah',
  45: 'Chilean Carménère',
  46: 'Spanish Cava',
  47: 'Central Italy Red',
  48: 'Central Italy White',
  49: 'Burgundy Chablis',
  50: 'French Champagne',
  51: 'Argentinian Chardonnay',
  52: 'Australian Chardonnay',
  53: 'Austrian Chardonnay',
  54: 'Brazilian Chardonnay',
  55: 'Californian Chardonnay',
  56: 'Canadian Chardonnay',
  57: 'Chilean Chardonnay',
  58: 'German Chardonnay',
  59: 'Mexican Chardonnay',
  60: 'New Zealand Chardonnay',
  61: 'Oregon Chardonnay',
  62: 'South African Chardonnay',
  63: 'Spanish Chardonnay',
  64: 'Swiss Chardonnay',
  65: 'Washington State Chardonnay',
  66: 'Californian Chenin Blanc',
  67: 'South African Chenin Blanc',
  69: 'Italian Chianti',
  70: 'Northern Rhône Côte-Rotie',
  76: 'Luxembourg Crémant',
  79: 'Portuguese Dão Red',
  80: 'German Dornfelder',
  81: 'Portuguese Douro Red',
  82: 'Italian Gavi',
  83: 'Alsace Gewürztraminer',
  84: 'Californian Gewürztraminer',
  85: 'Chilean Gewürztraminer',
  86: 'German Gewürztraminer',
  87: 'Northern Italy Gewürztraminer',
  88: 'Oregon Gewürztraminer',
  89: 'Washington State Gewürztraminer',
  90: 'Languedoc-Roussillon Grenache',
  91: 'Sardinian Cannonau',
  92: 'Spanish Grenache',
  93: 'Austrian Grüner Veltliner',
  94: 'Languedoc-Roussillon Red',
  95: 'Languedoc-Roussillon Rosé',
  96: 'Languedoc-Roussillon White',
  97: 'Portuguese Madeira',
  98: 'Argentinian Malbec',
  99: 'Australian Malbec',
  100: 'Californian Malbec',
  101: 'Chilean Malbec',
  102: 'Mexican Malbec',
  103: 'South African Malbec',
  104: 'Southwest France Malbec',
  105: 'Spanish Mencia',
  106: 'Californian Meritage',
  107: 'Canadian Meritage',
  108: 'Argentinian Merlot',
  109: 'Australian Merlot',
  110: 'Brazilian Merlot',
  111: 'Californian Merlot',
  112: 'Canadian Merlot',
  113: 'Chilean Merlot',
  114: 'Israeli Merlot',
  115: 'Mexican Merlot',
  116: 'New Zealand Merlot',
  117: 'South African Merlot',
  118: 'Spanish Merlot',
  119: 'Swiss Merlot',
  120: 'Washington State Merlot',
  121: 'Spanish Monastrell',
  122: "Italian Montepulciano d'Abruzzo",
  123: 'Spanish Montsant Red',
  124: 'Portuguese Moscatel',
  125: "Italian Moscato d'Asti",
  126: 'German Müller Thurgau',
  127: 'Northern Italy Müller Thurgau',
  128: 'Italian Nebbiolo',
  129: 'Mexican Nebbiolo',
  130: 'Northern Italy Red',
  131: 'Northern Italy White',
  132: 'Northern Portugal Red',
  133: 'Northern Portugal White',
  134: 'Northern Rhône Red',
  135: 'Northern Rhône White',
  136: 'Spanish Pedro Ximenez',
  137: 'Californian Petite Sirah',
  138: 'Mexican Petite Sirah',
  139: 'Alsace Pinot Blanc',
  140: 'Austrian Pinot Blanc',
  141: 'German Pinot Blanc',
  142: 'Northern Italy Pinot Blanc',
  143: 'Alsace Pinot Gris',
  144: 'Austrian Pinot Gris',
  145: 'Australian Pinot Gris',
  146: 'Californian Pinot Gris',
  147: 'Canadian Pinot Gris',
  148: 'German Grauburgunder',
  149: 'Northern Italy Pinot Grigio',
  150: 'New Zealand Pinot Gris',
  151: 'Oregon Pinot Gris',
  152: 'South African Pinot Gris',
  153: 'Argentinian Pinot Noir',
  154: 'Australian Pinot Noir',
  155: 'Austrian Pinot Noir',
  156: 'Brazilian Pinot Noir',
  157: 'Californian Pinot Noir',
  158: 'Canadian Pinot Noir',
  159: 'Chilean Pinot Noir',
  160: 'German Spätburgunder',
  161: 'Northern Italy Pinot Noir',
  162: 'New Zealand Pinot Noir',
  163: 'Oregon Pinot Noir',
  164: 'South African Pinot Noir',
  165: 'Swiss Pinot Noir',
  166: 'Washington State Pinot Noir',
  167: 'South African Pinotage Blend',
  169: 'South African Pinotage',
  170: 'Portuguese Port',
  171: 'Spanish Priorat Red',
  172: 'Italian Prosecco',
  173: 'Provence Rosé',
  174: 'Californian Red Blend',
  175: 'Washington State Red Blend',
  176: 'Spanish Red',
  177: 'Australian Rhône Blend Red',
  178: 'Californian Rhône Blend Red',
  179: 'Spanish Rhône Blend Red',
  180: 'Spanish Ribera Del Duero Red',
  181: 'Alsace Riesling',
  182: 'Australian Riesling',
  183: 'Californian Riesling',
  184: 'Canadian Riesling',
  185: 'Chilean Riesling',
  186: 'German Riesling',
  187: 'New Zealand Riesling',
  188: 'Oregon Riesling',
  189: 'Washington State Riesling',
  190: 'Spanish Rioja Red',
  191: 'Spanish Rioja White',
  192: 'Italian Ripasso',
  193: 'Argentinian Sangiovese',
  194: 'Californian Sangiovese',
  195: 'Bordeaux Sauternes',
  196: 'Argentinian Sauvignon Blanc',
  197: 'Australian Sauvignon Blanc',
  198: 'Austrian Sauvignon Blanc',
  199: 'Californian Sauvignon Blanc',
  200: 'Chilean Sauvignon Blanc',
  201: 'German Sauvignon Blanc',
  202: 'New Zealand Sauvignon Blanc',
  203: 'South African Sauvignon Blanc',
  204: 'Spanish Sauvignon Blanc',
  205: 'Washington State Sauvignon Blanc',
  206: 'Spanish Sherry',
  207: 'Italian Soave',
  208: 'Southern Italy Red',
  209: 'Southern Italy White',
  210: 'Southern Portugal Red',
  211: 'Southern Portugal White',
  212: 'Southern Rhône Red',
  213: 'Southern Rhône Rosé',
  214: 'Southern Rhône White',
  215: 'Californian Sparkling',
  216: 'Spanish Sparkling',
  217: 'Argentinian Syrah',
  218: 'Brazilian Syrah',
  219: 'Californian Syrah',
  220: 'Canadian Syrah',
  221: 'Chilean Syrah',
  222: 'Israeli Syrah',
  223: 'Mexican Syrah',
  224: 'New Zealand Syrah',
  225: 'South African Syrah',
  226: 'Australian Shiraz',
  227: 'Spanish Syrah',
  228: 'Swiss Syrah',
  229: 'Argentinian Syrah - Viognier',
  230: 'Australian Syrah - Viognier',
  231: 'South African Syrah - Viognier',
  232: 'Washington State Syrah',
  233: 'Spanish Toro Red',
  234: 'Upper Loire Red',
  235: 'Upper Loire White',
  236: 'Italian Valpolicella Red',
  237: 'Spanish Verdejo',
  238: 'Portuguese Vinho Verde White',
  239: 'Italian Vino Nobile Di Montepulciano',
  240: 'Argentinian Viognier',
  241: 'Australian Viognier',
  242: 'Californian Viognier',
  243: 'Chilean Viognier',
  244: 'Languedoc-Roussillon Viognier',
  245: 'South African Viognier',
  246: 'Californian White Blend',
  247: 'Californian Zinfandel',
  248: 'Southern Italy Primitivo',
  249: 'Mexican Zinfandel',
  250: 'South African Cabernet Franc',
  251: 'Loire Chenin Blanc',
  252: 'English Sparkling',
  253: 'Brazilian Sparkling',
  254: 'Alsace Pinot Noir',
  255: 'Austrian Zweigelt',
  256: 'Hungarian Bordeaux Blend',
  257: 'Jura White',
  258: 'German Silvaner',
  259: 'Argentinian Pinot Gris',
  260: 'Bordeaux Graves Red',
  261: 'Bordeaux Pessac-Léognan',
  262: 'Bordeaux Médoc',
  263: 'Bordeaux Margaux',
  264: 'Bordeaux Pauillac',
  265: 'Bordeaux Saint-Julien',
  266: 'Bordeaux Saint-Émilion',
  267: 'Bordeaux Pomerol',
  268: 'Bordeaux Libournais Red',
  269: 'Jura Vin Jaune',
  270: 'Swiss Chasselas',
  271: 'Japanese Koshu',
  272: 'Argentinian Torrontés',
  273: 'Greek Nemea Red',
  274: 'Loire Muscadet',
  275: 'Uruguay Tannat',
  276: 'Bordeaux Saint-Estèphe',
  277: 'Rapsani Red',
  278: 'Naoussa Red',
  279: 'Amyndeon Red',
  280: 'Goumenissa Red',
  281: 'Santorini White',
  282: 'Greek Malagouzia',
  283: 'Burgundy Côte de Nuits Red',
  284: 'Burgundy Côte de Beaune Red',
  285: 'Burgundy Côte de Beaune White',
  286: 'Burgundy Côte Chalonnaise Red',
  287: 'Burgundy Côte Chalonnaise White',
  288: 'Burgundy Macônnais White',
  289: 'Napa Valley Cabernet Sauvignon',
  290: 'Napa Valley Bordeaux Blend',
  291: 'Napa Valley Chardonnay',
  292: 'Tuscan Red',
  293: 'French Crémant',
  295: 'Northern Rhône Condrieu',
  296: 'Northern Rhône Cornas',
  297: 'Northern Rhône Crozes-Hermitage',
  298: 'Northern Rhône Hermitage',
  299: 'Northern Rhône Saint-Joseph',
  300: 'Northern Rhône Saint-Péray',
  301: 'Southern Rhône Châteauneuf-du-Pape Red',
  302: 'Austrian Riesling',
  303: 'Austrian Blaufränkisch',
  304: 'Spanish Tempranillo',
  366: 'Russian Krasnostop',
  367: 'Russian Saperavi',
  368: 'Russian Cabernet Sauvignon',
  369: 'Russian Merlot',
  370: 'Russian Cabernet Franc',
  371: 'Russian Pinot Noir',
  372: 'Russian Chardonnay',
  373: 'Russian Riesling',
  374: 'Russian Sauvignon Blanc',
  375: 'Russian Muscat',
  376: 'Russian Red',
  377: 'Russian White',
  378: 'Russian Sparkling',
  379: 'Russian Tsimlyansky Cherny',
  380: 'Russian Sibirkovy',
  400: 'Vintage Port',
  401: 'White Port',
  402: 'Tawny Port',
  403: 'Late Bottled Vintage Port',
  404: 'Ruby Port',
  405: 'Colheita Port',
  406: 'Single Quinta Vintage Port',
  407: 'Crusted Port'
}

const wineStyles = (i) => {
  return WINE_STYLES[i];
}

export default wineStyles;