import '@babel/polyfill';

// REMOVE
import 'jsdom';
import 'xpath-html';
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

class VivinoClient {
  constructor() {
  }

  // TODO: optional vintage
  async getWineByName(wineName) {
    const urlSafeName = wineName.replace(/[\W_]+/g,' ').toLowerCase();
    const searchUrl = `https://www.vivino.com/search/wines?q=${encodeURI(urlSafeName)}`

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

        // Idea: display images to let people pick the right label to select vintage!
        // images
        // vintages

        const webUrl = `https://www.vivino.com/wines/${id}`
        const tastesUrl = `https://api.vivino.com/wines/${id}/tastes`
        const reviewsUrl = `https://api.vivino.com/wines/${id}/reviews/_ranked`
        const pricesUrl = `https://api.vivino.com/wines/${id}/checkout_prices`

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
              countryCode: wineryRegionCountry
            }
          },
          styleId: styleId, //lookup
          foodsIds: foodsIds, //lookup
          grapesIds: grapesIds, //lookup
          webUrl: webUrl,
          tastesUrl: tastesUrl,
          reviewsUrl: reviewsUrl,
          pricesUrl: pricesUrl
        };

        // console.log(wine);
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
            console.log(k)
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
      console.log(primaryTastingNotes)

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
      const html = await response.text().then(function(json){
        wine = Object.assign(wine, {
        });
      });
    };
    await _reviews();

    async function _prices() {
      const response = await fetch(wine.pricesUrl);
      const html = await response.text().then(function(json){
        wine = Object.assign(wine, {
        });
      });
    };
    await _prices();

    // /wine-styles/WINESTYLEID

    // get vintage id VID and then:
    // /vintages/VID
    // /vintages/VID/checkout_prices

    //activies/AID e.g. 382305665

    await _tastes();

    return wine;
  }
}

export default VivinoClient;