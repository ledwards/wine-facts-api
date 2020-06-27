import * as assert from 'assert';
import VivinoClient from '../src/index';
import "isomorphic-fetch";

describe('VivinoClient', () => {
  describe('#getWine()', () => {
    it('fetches data for a wine', async function() {
      this.timeout(30000);

      const client = new VivinoClient;
      const wine = await client.getWineByName("Trinchero Mario's Vineyard", "2017");
      assert.equal(wine.name, "Mario's Vineyard Cabernet Sauvignon");
      assert.equal(wine.id, 1845119);
      assert.equal(wine.vintageId, 153409940);
      assert.equal(wine.name, "Mario's Vineyard Cabernet Sauvignon");
      assert.equal(wine.description, 'The fruit from this benchland area of St. Helena has great structure and velvety tannins. On the nose, I get sweet white floral, crushed anise seed and mineral aromas followed by dark cherry, fig jam, toasted brioche and savory flavors. It is an elegant and pretty wine with firm tannins. I hope that if Mario Trinchero were looking down he would be proud of this vineyard and the resulting wine');
      assert.equal(wine.rating, 4.3);
      assert.equal(wine.alcoholContent, 14.5);
      assert.equal(wine.alcohol, "high");
      assert.equal(wine.region, "Napa Valley, US AVA");
      assert.equal(wine.producer, "Trinchero");
      assert.equal(wine.style, "Napa Valley Cabernet Sauvignon");
      assert.equal(wine.foods[0], "Beef");
      assert.equal(wine.grapes[0], "Cabernet Sauvignon");
      assert.equal(wine.buyUrl, "https://www.vivino.com/mario-s-vineyard-cabernet-sauvignon/w/1845119?year=2017");

      assert.equal(wine.acidity, 'high');
      assert.equal(wine.fizziness, null);
      assert.equal(wine.intensity, 'pronounced');
      assert.equal(wine.sweetness, 'dry');
      assert.equal(wine.tannin, 'high');
      assert.equal(wine.structureCount, 211);
      assert.equal(wine.primaryFlavorCharacteristics[0].name, 'oak (oak)');
      assert.equal(wine.secondaryFlavorCharacteristics[0].name, 'leather (oak)');

      assert.equal(wine.reviews[0].description, "This is a textbook Napa Valley Cabernet. Perfectly balanced and silky smooth while at the same time big and bold.Fruity, dry, good value etc..");
      assert.equal(wine.reviews[1].tastingNotes[0], "blueberry");

      assert.equal(wine.organic, false);
      assert.equal(wine.biodynamic, false);

      assert.equal(wine.price, "$49.98");

      assert.equal(wine._api.vintages, "https://api.vivino.com/vintages/153409940");
      assert.equal(wine._api.tastes, "https://api.vivino.com/wines/1845119/tastes");
      assert.equal(wine._api.reviews, "https://api.vivino.com/wines/1845119/reviews/_ranked");
      assert.equal(wine._api.prices, "https://api.vivino.com/vintages/153409940/checkout_prices");
    }); 
  });
});