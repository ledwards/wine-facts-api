import '@babel/polyfill';
import Wine from './wine';
import wineStyles from './wineStyles';
import grapes from './grapes';
import foods from './foods';

// try to understand structure count
// try to solve some of TBD fields in _noData
// structure into steps of SAT
// refactor out of index

// MISSING:
 // vintage year

// mask the requests using the same url params as the mobile app
class WineClient {
  constructor() {
    this._wine = new Wine;
    this._api = {};
  }

  async getWineByName(wineName, vintageYear) {
    this._wine = new Wine; // in case client gets reused
    this._api = {}; // in case client gets reused

    await this._algoliaSearch(wineName, vintageYear);
    await this._wines();
    await this._vintages();
    await this._tastes();
    await this._reviews();
    await this._prices();
    await this._noData();

    return this._wine;
  }

  async _algoliaSearch(wineName, vintageYear = "N.V.") {
     // sort of factor out
    const algoliaAppId = '9TAKGWJUXL';
    const algoliaApiKey = '9b7aa6e5b9c9b182386a216af561654b';
    const algoliaSearchUrl = `https://${algoliaAppId.toLowerCase()}-dsn.algolia.net/1/indexes/WINES_prod/query`;
    
    const response = await fetch(algoliaSearchUrl, {
      headers: {
        'Content-Type': 'application/json',
        'X-Algolia-API-Key': algoliaApiKey,
        'X-Algolia-Application-Id': algoliaAppId
      },
      method: 'POST',
      body: JSON.stringify(
        {
          hitsPerPage: 1,
          query: wineName,
        }
      )
    });

    const results = await response.json().then((json) => { return json });
    const obj = results.hits[0];

    const id = obj.id;
    const vintage = obj.vintages.find(el => el.year == vintageYear);
    if(typeof(vintage) === 'undefined') { vintage = obj.vintages[0] };
    const name = obj.name;
    const description = obj.description.replace(/\n/g, ' ');
    const _slug = obj.seo_name;
    const buyUrl = `https://www.vivino.com/${_slug}/w/${id}?year=${vintage.year}`;

    this._wine = {
      _id: id,
      _vintageId: vintage.id,
      name: name,
      vintage: vintage.year,
      description: description,
      buyUrl: buyUrl,
    };

    const wineUrl = `https://api.vivino.com/wines/${id}`;
    const tastesUrl = `https://api.vivino.com/wines/${id}/tastes`;
    const reviewsUrl = `https://api.vivino.com/wines/${id}/reviews/_ranked`;
    const vintageUrl = `https://api.vivino.com/vintages/${vintage.id}`;
    const pricesUrl = `${vintageUrl}/checkout_prices`;

    this._wine._api = {
      wines: wineUrl,
      vintages: vintageUrl,
      tastes: tastesUrl,
      reviews: reviewsUrl,
      prices: pricesUrl,
    };
  };

  async _wines() {
    const response = await fetch(this._wine._api.wines);
    const obj = await response.json().then((json) => { return json });

    const rating = obj.statistics.ratings_average;
    const regionName = obj.region.name;
    const regionCountry = obj.region.country.toUpperCase();
    const regionClass = obj.region.class.abbreviation;
    const region = `${regionName}, ${regionCountry} ${regionClass}`;
    const wineryName = obj.winery.name;

    this._wine = Object.assign(this._wine, {
      rating: rating,
      region: region,
      producer: wineryName,
    });
  };

  async _vintages() {
    const response = await fetch(this._wine._api.vintages);
    const obj = await response.json().then((json) => { return json });

    const natural = Boolean(obj.is_natural);
    const organic = Boolean(obj.organic_certification_id);
    const biodynamic = Boolean(obj.certified_biodynamic);
    const alcoholContent = obj.wine.alcohol;
    const style = wineStyles(obj.wine.style_id);
    const foodsList = obj.wine.foods.map(f => { return foods(f) });
    const grapesList = obj.wine.grapes.map(id => { return grapes(id); });
    const alcohol = _scaleAlcohol(alcoholContent);

    this._wine = Object.assign(this._wine, {
      natural: natural,
      organic: organic,
      biodynamic: biodynamic,
      alcoholContent: alcoholContent,
      style: style,
      grapes: grapesList,
      foods: foodsList,
      alcohol: alcohol,
    });
  };

  async _tastes() {
    const response = await fetch(this._wine._api.tastes);
    const obj = await response.json().then((json) => { return json });

    const acidity = _scale(obj.structure.acidity);
    const intensity = _scale(obj.structure.intensity, 'light', 'medium (-)', 'medium', 'medium (+)', 'pronounced', 'n/a');
    const sweetness = _scale(obj.structure.sweetness, 'dry', 'off-dry', 'medium dry', 'medium sweet', 'sweet', 'dry');
    const tannin = _scale(obj.structure.tannin);
    const structureCount = obj.structure.calculated_structure_count; // come back to this
    var primaryFlavors = [];
    var secondaryFlavors = [];
    const fizziness = _scale(obj.structure.fizziness, 'delicate', 'creamy', 'creamy', 'creamy', 'aggressive', 'n/a');

    obj.flavor.forEach(g => {
      if(typeof(g.primary_keywords) !== 'undefined') {
        g.primary_keywords.forEach(n => {
          primaryFlavors.push({ name: n.name, count: n.count });
        });
      };

      if(typeof(g.secondary_keywords) !== 'undefined') {
        g.secondary_keywords.forEach(n => {
          secondaryFlavors.push({ name: n.name, count: n.count });
        });
      };
    });

    this._wine = Object.assign(this._wine, {
      acidity: acidity,
      flavorIntensity: intensity,
      sweetness: sweetness,
      tannin: tannin,
      structureCount: structureCount,
      primaryFlavors: primaryFlavors,
      secondaryFlavors: secondaryFlavors,
      mousse: fizziness,
    });
  };

  async _reviews() {
    const response = await fetch(this._wine._api.reviews);
    const obj = await response.json().then((json) => { return json });
    const reviews = obj.map(r => {
      const tastingNotes = [];
      const description = r.note.replace(/\n/g, ' ');
      if(typeof(r.flavor_word_matches) !== 'undefined') {
        r.flavor_word_matches.forEach(f => { tastingNotes.push(f.match); });
      }
      return {
        notes: description,
        flavors: tastingNotes
      };
    });

    this._wine = Object.assign(this._wine, {
      userReviews: reviews,
    });
  };

  async _prices() {
    const response = await fetch(this._wine._api.prices);
    const obj = await response.json().then((json) => { return json });

    const price = `$${obj.availability.median.amount}`;

    this._wine = Object.assign(this._wine, {
      price: price,
    });
  };

  // document features with no data
  async _noData() {
    this._wine = Object.assign(this._wine, {
      color: "no data, see reviews",
      colorIntensity: "no data, see reviews",
      noseIntensity: "no data",
      noseDevelopment: "no data",
      body: "no data, see structure", // calculate?
      quality: "no data, see scores",
      tertiaryFlavors: "combined with secondary",
      colorIntensity: "no data, see reviews",
      aromaIntensity: "no data, see reviews",
      primaryAromas: "no data, see flavor",
      secondaryAromas: "no data, see flavor",
      tertiaryAromas: "no data, see flavor",
      ageing: "no data, cellar-tracker?", // heuristics or CT
      balance: "no data, see reviews",
      length: "no data, see reviews",
      finish: "no data, see reviews",
      intensity: "no data, see reviews", // or make it the same as flavorIntensity
      complexity: "no data, see reviews",
      conclusion: "no data, see professional reviews", //calculate
    });
  }
}

const _scale = (num, low = "low", mediumMinus = "medium (-)", medium = "medium", mediumPlus = "medium (+)", high = "high", na = "n/a") => {
  const level = num / 5.0 * 9.0; // normalize to 9ths

  if (0 < level && level < 3) {
    return low;
  } else if (3 <= level && level < 4) {
    return mediumMinus;
  } else if (4 <= level && level < 5) {
    return medium;
  } else if (5 <= level && level < 6) {
    return mediumPlus;
  } else if (6 <= level) {
    return high;
  } else {
    return na;
  };
};

const _scaleAlcohol = (level) => {
  if (level <= 11) {
    return "low";
  } else if (11 < level && level <= 14) {
    return "medium";
  } else if (14 < level) {
    return "high";
  } else {
    return "no data";
  };
};

export default WineClient;