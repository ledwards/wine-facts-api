import '@babel/polyfill';
import wineStyles from './wineStyles';
import grapes from './grapes';
import foods from './foods';

// create a Wine class
// refactor Vivino Client to be simple
// test out removing some async/wait for thens
// try to understand structure count
// try to solve some of TBD fields in _noData

// mask the requests using the same url params as the mobile app
class VivinoClient {
  constructor() {
  }

  async getWineByName(wineName, vintageYear) {
    const algoliaAppId = '9TAKGWJUXL';
    const algoliaApiKey = '9b7aa6e5b9c9b182386a216af561654b';
    const algoliaSearchUrl = `https://${algoliaAppId.toLowerCase()}-dsn.algolia.net/1/indexes/WINES_prod/query`;
    
    var wine = {};

    async function _algoliaSearch() {
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

      await response.json().then(function(json){
        const obj = json.hits[0];

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

        wine = {
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
      });
    };
    await _algoliaSearch();

    async function _wines() {
      const response = await fetch(wine.wineUrl);
      await response.json().then(function(obj){
        const rating = obj.statistics.ratings_average;

        const regionName = obj.region.name;
        const regionCountry = obj.region.country.toUpperCase();
        const regionClass = obj.region.class.abbreviation;
        const region = `${regionName}, ${regionCountry} ${regionClass}`;
        const wineryName = obj.winery.name;

        wine = Object.assign(wine, {
          rating: rating,
          region: region,
          producer: wineryName,
        });
      });
    };
    await _wines();

    async function _vintages() {
      const response = await fetch(wine.vintageUrl);
      await response.json().then(function(obj){
        const natural = obj.is_natural;
        const organic = Boolean(obj.organic_certification_id);
        const biodynamic = Boolean(obj.certified_biodynamic);
        const alcoholContent = obj.wine.alcohol;

        const style = wineStyles(obj.wine.style_id);
        const foodsList = obj.wine.foods.map(f => { return foods(f) });
        const grapesList = obj.wine.grapes.map(id => { return grapes(id); });

        const alcohol = _scaleAlcohol(alcoholContent);

        wine = Object.assign(wine, {
          natural: natural,
          organic: organic,
          biodynamic: biodynamic,
          alcoholContent: alcoholContent,
          style: style,
          grapes: grapesList,
          foods: foodsList,
          alcohol: alcohol,
        });
      });
    };
    await _vintages();


    async function _tastes() {
      const response = await fetch(wine.tastesUrl);
      await response.json().then(function(obj){
        const acidity = _scale(obj.structure.acidity);
        const fizziness = _scale(obj.structure.fizziness, { low: 'delictae', medium: 'creamy', high: 'aggressive' });
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

        wine = Object.assign(wine, {
          acidity: acidity,
          mousse: fizziness,
          intensity: intensity,
          sweetness: sweetness,
          tannin: tannin,
          structureCount: structureCount,
          primaryFlavorCharacteristics: primaryFlavorCharacteristics,
          secondaryFlavorCharacteristics: secondaryFlavorCharacteristics,
        });
      });
    };
    await _tastes();

    async function _reviews() {
      const response = await fetch(wine.reviewsUrl);
      await response.json().then(function(obj){
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
        wine = Object.assign(wine, {
          reviews: reviews
        });
      });
    };
    await _reviews();

    // is this info somewhere else too?
    async function _prices() {
      const response = await fetch(wine.pricesUrl);
      await response.json().then(function(obj){
        const price = `$${obj.availability.median.amount}`;
        wine = Object.assign(wine, {
          price: price
        });
      });
    };
    await _prices();

    // document features with no data
    async function _noData() {
      wine = Object.assign(wine, {
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
        intensity: "no data, see reviews",
        complexity: "no data, see reviews",

        conclusion: "no data, see professional reviews" //calculate
      });
    }

    return wine;
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