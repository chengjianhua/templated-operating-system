import bundlePage from '../bundlePage';
import pageData from './pageData.json';

describe('bundlePage', () => {
  it('should run webpack', () => {
    bundlePage(pageData);
  });
});
