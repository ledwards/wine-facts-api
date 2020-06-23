import '@babel/polyfill';

// REMOVE
import 'jsdom';
import 'xpath-html';
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

class VivinoClient {
  constructor() {
  }

  async getWineByName(wineName, vintageYear) {
    const urlSafeName = wineName.replace(/[\W_]+/g,' ').toLowerCase();

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
      // can these combined with a then????
      const json = await response.json().then(function(json){
        const obj = json.hits[0];

        const id = obj.objectID;
        const name = obj.name;
        const slug = obj.seo_name;
        const description = obj.description;
        const rating = obj.statistics.ratings_average;
        const alcohol = obj.alcohol;

        const regionName = obj.region.name;
        const regionCountry = obj.region.country;
        const regionClass = obj.region.class.abbreviation;

        const wineryName = obj.winery.name;
        const wineryRegionName = obj.winery.region.name;
        const wineryRegionCountry = obj.winery.region.country;
        const wineryRegionClass = obj.winery.region.class.abbreviation;

        const styleId = obj.style;
        const foodsIds = obj.foods;
        const grapesIds = obj.grapes;

        const vintageId = obj.vintages.find(el => el.year == vintageYear).id;

        // Idea: display images to let people pick the right label to select vintage!
        // images

        const webUrl = `https://www.vivino.com/${slug}/w/${id}`;
        const vintageWebUrl = `${webUrl}?year=${vintageYear}`;

        const vintageUrl = `https://api.vivino.com/vintages/${vintageId}`;
        const tastesUrl = `https://api.vivino.com/wines/${id}/tastes`;
        const reviewsUrl = `https://api.vivino.com/wines/${id}/reviews/_ranked`;
        const pricesUrl = `${vintageUrl}/checkout_prices`;

        wine = {
          id: id,
          name: name,
          description: description,
          rating: rating,
          alcohol: alcohol,
          region: {
            name: regionName,
            countryCode: regionCountry,
            class: regionClass
          },
          winery: {
            name: wineryName,
            region: {
              name: wineryRegionName,
              countryCode: wineryRegionCountry,
              class: wineryRegionClass
            }
          },
          vintageId: vintageId,
          styleId: styleId, //lookup
          foodsIds: foodsIds, //lookup
          grapesIds: grapesIds, //lookup
          webUrl: webUrl,
          vintageWebUrl: vintageWebUrl,
          vintageUrl: vintageUrl,
          tastesUrl: tastesUrl,
          reviewsUrl: reviewsUrl,
          pricesUrl: pricesUrl,
        };
      });
    };
    await _algoliaSearch();

    async function _tastes() {
      const response = await fetch(wine.tastesUrl);
      const html = await response.json().then(function(obj){
        const acidity = obj.structure.acidity // normalize
        const fizziness = obj.structure.fizziness // normalize
        const intensity = obj.structure.fizziness // normalize
        const sweetness = obj.structure.sweetness // normalize
        const tannin = obj.structure.tannin // normalize
        const userStructureCount = obj.structure.user_structure_count // pick one and understand
        const calculatedStructureCount = obj.structure.calculated_structure_count // pick one and understand

        var flavorCount;
        var primaryTastingNotes;
        var secondaryTastingNotes;
        [flavorCount, primaryTastingNotes, secondaryTastingNotes] = obj.flavor.map(o => {
          try {
          var primaryTastingNotes =
            ((typeof(o["primary_keywords"]) == 'undefined') ? [] : o["primary_keywords"]).map(k => {
              return { name: k.name, count: k.count } 
            });
          } catch (error) {
          var primaryTastingNotes = [];
          };

          try {
          var secondaryTastingNotes =
            ((typeof(o["secondary_keywords"]) == 'undefined') ? [] : o["secondary_keywords"]).map(k => {
              return { name: k.name, count: k.count } 
            });
          } catch (error) {
          var secondaryTastingNotes = [];
          };

          // TODO: Remove counts, and just take the first 5 results for each

          return [
            o.stats.count,
            primaryTastingNotes,
            secondaryTastingNotes
          ]
        });

        wine = Object.assign(wine, {
          acidity: acidity,
          fizziness: fizziness,
          intensity: intensity,
          sweetness: sweetness,
          tannin: tannin,
          userStructureCount: userStructureCount,
          calculatedStructureCount: calculatedStructureCount,
          flavorCount: flavorCount,
          primaryTastingNotes,
          secondaryTastingNotes
        });
      });
    };
    await _tastes();

    async function _reviews() {
      const response = await fetch(wine.reviewsUrl);
      const html = await response.json().then(function(obj){
        const reviews = obj.map(r => {
          const description = r.note;
          const notes = (typeof(r["flavor_word_matches"]) == 'undefined' ? [] : r["flavor_word_matches"].map(f => { f.match }));
          return {
            description: description,
            notes: notes
          };
        });
        wine = Object.assign(wine, {
          reviews: reviews
        });
      });
    };
    await _reviews();

    // Q: Is there a price URL for the specific vintage?
    // TODO: Find the vintage earlier on and use it here
    // then maybe use:
    // /vintages/VID
    // /vintages/VID/checkout_prices
    async function _vintage() {
      const response = await fetch(wine.vintageUrl);
      const html = await response.json().then(function(obj){
        const organic = Boolean(obj.organic_certification_id);
        const biodynamic = Boolean(obj.certified_biodynamic);
        wine = Object.assign(wine, {
          organic: organic,
          biodyamic: biodynamic
        });
      });
    };
    await _vintage();

    // is this info somewhere else too?
    async function _prices() {
      const response = await fetch(wine.pricesUrl);
      const html = await response.json().then(function(obj){
        console.log(JSON.stringify(obj));
        const price = obj.availability.median.amount;
        wine = Object.assign(wine, {
          price: price
        });
      });
    };
    await _prices();

    // /wine-styles/WINESTYLEID

    console.log(wine);
    return wine;
  }
}

export default VivinoClient;