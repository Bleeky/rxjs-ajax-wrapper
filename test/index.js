import RxjsWrapper from '../src';

const apiDefs = {
  getAllFilms: {
    url: 'https://ghibliapi.herokuapp.com/films',
    method: 'GET',
    responseType: 'json',
  },
  getSingleRes: {
    url: 'localhost:8080/res/:id',
    method: 'GET',
  },
  postRes: {
    url: 'localhost:8080/res',
    method: 'POST',
  },
};

// api.routes.getSingleRes({id: 2, otherId: 3}, JSON.stringify(truc), {category: 'lol', order_by: 'desc', square: [1, 2, 3]});

describe('Wrapper', () => {
  describe('#init()', () => {
    it('should init wrapper without error', (done) => {
      const api = new RxjsWrapper(apiDefs);
      api.init();
      done();
    });
  });
  describe('#call to getAllFilms()', () => {
    it('should call getAllFilms() without error', (done) => {
      const api = new RxjsWrapper(apiDefs);
      api.init();
      api.routes.getAllFilms();
      done();
    });
  });
  describe('#call to getAllFilms() and verify answer', () => {
    it('Should return an array of movies', (done) => {
      const api = new RxjsWrapper(apiDefs);
      api.init();
      api.routes.getAllFilms().subscribe(
        (data) => {
          done();
        },
        (error) => {
          done();
        },
      );
    });
  });
});
