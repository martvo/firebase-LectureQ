import { FirebaseLectureQPage } from './app.po';

describe('firebase-lecture-q App', () => {
  let page: FirebaseLectureQPage;

  beforeEach(() => {
    page = new FirebaseLectureQPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
