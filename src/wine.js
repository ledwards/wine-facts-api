import '@babel/polyfill';

class Wine {
  constructor(params = DEFAULTS) {
    this.name = params.name; // Algolia
    this.producer = params.producer; // Vivino : wines
    this.vintage = params.vintage;
    this.region = params.region; // Vivino : wines
    this.grapes = params.grapes; // Vivino : vintages
    this.style = params.style; // Vivino : vintages
    this.photo = params.photoUrl;

    this.color = params.color;
    this.appearanceIntensity = params.appearaneIntensity;

    this.noseIntensity = params.noseIntensity;
    this.primaryAromas = params.primaryAromas;
    this.secondaryAromas = params.secondaryAromas;
    this.tertiaryAromas = params.tertiaryAromas;

    this.sweetness = params.sweetness; // Vivino : tastes
    this.acidity = params.acidity; // Vivino : tastes
    this.tanin = params.tanin; // Vivino : tastes
    this.taninNature = params.taninNature;
    this.alcohol = params.alcohol; // Vivino : vintages
    this.body = params.body;
    // missing: structure / structureCount
    this.flavorIntensity = params.flavorIntensity; // Vivino : tastes
    this.primaryFlavors = params.primaryFlavors; // Vivino : tastes
    this.secondaryFlavors = params.secondaryFlavors; // Vivino : tastes
    this.tertiaryFlavors = params.tertiaryFlavors;
    this.palateObservations = params.palateObservations;
    this.finish = params.finish;

    this.balance = params.balance;
    this.length = params.length;
    this.intensity = params.intensity;
    this.complexity = params.complexity;
    this.quality = params.quality;
    this.qualityExplanation = params.qualityExplanation;
    this.bottleAgeing = params.ageing;
    this.bottleAgeingExplanation = params.bottleAgeingExplanation;

    this.rating = params.rating; // Vivino : wines
    this.description = params.description;
    this.professionalReviews = params.professionalReviews;
    this.userReviews = params.userReviews; // Vivino : reviews
    this.organic = params.organic; // Vivino : vintages
    this.natural = params.natural; // Vivino : vintages
    this.biodynamic = params.biodynamic; // Vivino : vintages
    this.alcoholContent = params.alcoholContent; // Vivino : vintages
    this.foods = params.foods; // Vivino : vintages
    this.price = params.price; // Vivino : price
    this.buyUrl = params.buyUrl; // Vivino : wines
  };
};

const DEFAULTS = {
  primaryAromas: [],
  secondaryAromas: [],
  tertiaryAromas: [],
  primaryFlavors: [],
  secondaryFlavors: [],
  tertiaryFlavors: [],
  professionalReviews: [],
  userReviews: [],
  grapes: [],
  foods: [],
  reviews: [],
  natural: false,
  organic: false,
  biodynamic: false
};

export default Wine;