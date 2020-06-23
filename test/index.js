import * as assert from 'assert';
import VivinoClient from '../src/index';
import "isomorphic-fetch";

describe('VivinoClient', () => {
  describe('#getWine()', () => {
    it('fetches data for a wine', async function() {
      this.timeout(30000);

      const client = new VivinoClient;
      const wine = await client.getWineByName("Trinchero Mario's Vineyard", "2017");
      assert.equal(wine.name, "Mario's Vineyard Cabernet Sauvignon", "2017");
      // more assertions
      assert.equal(wine.webUrl, "https://www.vivino.com/mario-s-vineyard-cabernet-sauvignon/w/1845119");
    }); 
  });
});