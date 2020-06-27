import '@babel/polyfill';
import wineStyles from './wineStyles';
import grapes from './grapes';
import foods from './foods';

// create a Wine class
// try to understand structure count
// try to solve some of TBD fields in _noData
// structure into steps
//make API obj

// mask the requests using the same url params as the mobile app
class VivinoClient {
  constructor() {
    this._wine = {}
  }

  async getWineByName(wineName, vintageYear) {
    await this._algoliaSearch(wineName, vintageYear);

    await this._wines();
    await this._vintages();
    await this._tastes();
    await this._reviews();
    await this._prices();
    await this._noData();

    return this._wine;
  }

  async _algoliaSearch(wineName, vintageYear) {
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
          query: wineName
        }
      )
    });

    const results = await response.json().then((json) => { return json });
    const obj = results.hits[0];

    const id = obj.id;
    const vintageId = obj.vintages.find(el => el.year == vintageYear).id;
    const name = obj.name;
    const slug = obj.seo_name;
    const description = obj.description.replace(/\n/g, ' ');

    const buyUrl = `https://www.vivino.com/${slug}/w/${id}`;
    const vintageBuyUrl = `${buyUrl}?year=${vintageYear}`;

    const wineUrl = `https://api.vivino.com/wines/${id}`;
    const tastesUrl = `https://api.vivino.com/wines/${id}/tastes`;
    const reviewsUrl = `https://api.vivino.com/wines/${id}/reviews/_ranked`;
    const vintageUrl = `https://api.vivino.com/vintages/${vintageId}`;
    const pricesUrl = `${vintageUrl}/checkout_prices`;

    this._wine = {
      id: id,
      vintageId: vintageId,
      name: name,
      description: description,
      buyUrl: buyUrl,
      vintageBuyUrl: vintageBuyUrl,
      wineUrl: wineUrl,
      vintageUrl: vintageUrl,
      tastesUrl: tastesUrl,
      reviewsUrl: reviewsUrl,
      pricesUrl: pricesUrl,
    };
  };

  async _wines() {
    const response = await fetch(this._wine.wineUrl);
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
    const response = await fetch(this._wine.vintageUrl);
    const obj = await response.json().then((json) => { return json });

    const natural = obj.is_natural;
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
    const response = await fetch(this._wine.tastesUrl);
    const obj = await response.json().then((json) => { return json });

    const acidity = _scale(obj.structure.acidity);
    const fizziness = _scale(obj.structure.fizziness, { low: 'delicate', medium: 'creamy', high: 'aggressive' });
    const intensity = _scale(obj.structure.intensity, { high: 'pronounced' });
    const sweetness = _scale(obj.structure.sweetness, { low: 'dry', mediumMinus: 'off-dry', medium: 'medium dry', mediumPlus: 'medium sweet', high: 'sweet', na: 'dry' });
    const tannin = _scale(obj.structure.tannin);
    const structureCount = obj.structure.calculated_structure_count;
    var primaryFlavorCharacteristics = [];
    var secondaryFlavorCharacteristics = [];

    obj.flavor.forEach(g => {
      if(typeof(g.primary_keywords) !== 'undefined') {
        g.primary_keywords.forEach(n => {
          primaryFlavorCharacteristics.push({ name: `${n.name} (${g.group})`, count: n.count });
        });
      };

      if(typeof(g.secondary_keywords) !== 'undefined') {
        g.secondary_keywords.forEach(n => {
          secondaryFlavorCharacteristics.push({ name: `${n.name} (${g.group})`, count: n.count });
        });
      };
    });

    this._wine = Object.assign(this._wine, {
      acidity: acidity,
      mousse: fizziness,
      intensity: intensity,
      sweetness: sweetness,
      tannin: tannin,
      structureCount: structureCount,
      primaryFlavorCharacteristics: primaryFlavorCharacteristics,
      secondaryFlavorCharacteristics: secondaryFlavorCharacteristics,
    });
  };

  async _reviews() {
    const response = await fetch(this._wine.reviewsUrl);
    const obj = await response.json().then((json) => { return json });
    const reviews = obj.map(r => {
      const tastingNotes = [];
      const description = r.note.replace(/\n/g, ' ');
      if(typeof(r.flavor_word_matches) !== 'undefined') {
        r.flavor_word_matches.forEach(f => { tastingNotes.push(f.match); });
      }
      return {
        description: description,
        tastingNotes: tastingNotes
      };
    });

    this._wine = Object.assign(this._wine, {
      reviews: reviews
    });
  };

  async _prices() {
    const response = await fetch(this._wine.pricesUrl);
    const obj = await response.json().then((json) => { return json });

    const price = `$${obj.availability.median.amount}`;

    this._wine = Object.assign(this._wine, {
      price: price
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
      tertiaryTastingNotes: "combined with secondary",
      noseCharacteristics: "no data, see flavor",
      ageing: "no data, cellar-tracker?", // heuristics or CT
      balance: "no data, see reviews",
      length: "no data, see reviews",
      finish: "no data, see reviews",
      complexity: "no data, see reviews",
      conclusion: "no data, see professional reviews" //calculate
    });
  }
}

const _scale = (levelNum, d = { low: "low", mediumMinus: "medium (-)", medium: "medium", mediumPlus: "medium (+)", high: "high", na: "n/a" }) => {
  const level = levelNum / 5.0 * 9.0; // normalize to 9ths

  if (level < 3) {
    return d.low;
  } else if (3 <= level && level < 4) {
    return d.mediumMinus;
  } else if (4 <= level && level < 5) {
    return d.medium;
  } else if (5 <= level && level < 6) {
    return d.mediumPlus;
  } else if (6 <= level) {
    return d.high;
  } else {
    return d.na;
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

export default VivinoClient;