global.XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

import chai from 'chai';
import { RxjsWrapper } from '../src';

const apiDefs = {
  getAllFilms: {
    url: 'https://ghibliapi.herokuapp.com/films',
    method: 'GET',
    responseType: 'json',
  },
  getAllFilmsIgnore: {
    url: 'https://ghibliapi.herokuapp.com/films',
    method: 'GET',
    responseType: 'json',
    ignoreMiddlewares: [
      'token',
    ],
  },
  getWrongAllFilms: {
    url: 'https://ghibliapi.herokuapp.com/filmss',
    method: 'GET',
    responseType: 'json',
  },
  getWrongAllFilmsIgnore: {
    url: 'https://ghibliapi.herokuapp.com/filmss',
    method: 'GET',
    responseType: 'json',
    ignoreMiddlewares: [
      '404',
    ],
  },
};

describe('Wrapper', () => {
  describe('#init', () => {
    it('should construct wrapper without error', (done) => {
      const api = new RxjsWrapper(apiDefs);
      done();
    });
  });
  describe('#setup a middleware', () => {
    it('should add the middleware', (done) => {
      const api = new RxjsWrapper(apiDefs);
      api.addRequestMiddlewares([{ name: 'token', handler: () => ({ headers: { Authorization: 'Bearer testing' } }) }]);
      done();
    });
  });
  describe('#have middleware in request header', () => {
    it('should contains correct headers', (done) => {
      const api = new RxjsWrapper(apiDefs);
      api.addRequestMiddlewares([{ name: 'token', handler: getBearer => ({ headers: { Authorization: getBearer() } }) }], () => 'Bearer testing');
      api.routes.getAllFilms().subscribe(
        (data) => {
          chai.should();
          chai.expect(data.request.headers).to.have.property('Authorization');
          chai.assert.equal('Bearer testing', data.request.headers.Authorization);
          done();
        },
        (error) => {
          done();
        },
      );
    });
  });
  describe('#have ignored middleware in request header', () => {
    it('should contains correct headers', (done) => {
      const api = new RxjsWrapper(apiDefs);
      api.addRequestMiddlewares([{ name: 'token', handler: () => ({ headers: { Authorization: 'Bearer testing' } }) }]);
      api.routes.getAllFilmsIgnore().subscribe(
        (data) => {
          chai.should();
          chai.expect(data.request.headers).to.not.have.property('Authorization');
          done();
        },
        (error) => {
          done();
        },
      );
    });
  });
  describe('#call to getAllFilms()', () => {
    it('should call getAllFilms() without error', (done) => {
      const api = new RxjsWrapper(apiDefs);
      api.routes.getAllFilms();
      done();
    });
  });
  describe('#call to getAllFilms() and subscribe to stream', () => {
    it('Should return an array of movies', (done) => {
      const api = new RxjsWrapper(apiDefs);
      api.routes.getAllFilms().subscribe(
        (data) => {
          chai.should();
          data.response.should.have.lengthOf(20);
          chai.assert.equal(Array, data.response.constructor);
          done();
        },
        (error) => {
          done();
        },
      );
    });
  });
  describe('#call to getWrongAllFilms() and get error', () => {
    it('Should get a 404 error', (done) => {
      const api = new RxjsWrapper(apiDefs);
      api.routes.getWrongAllFilms().subscribe(
        (data) => {
          done();
        },
        (error) => {
          chai.assert.equal(404, error.status);
          done();
        },
      );
    });
  });
  describe('#call to getWrongAllFilms(), call error middleware and get error', () => {
    it('Should get a 404 error', (done) => {
      const api = new RxjsWrapper(apiDefs);
      api.addErrorMiddlewares([
        {
          name: '404',
          handler: (request) => {
            chai.assert.equal('404', request.status);
            if (request.status === 404) {
              chai.should();
              chai.assert.equal('404', request.status);
            }
          },
        },
      ]);
      api.routes.getWrongAllFilms().subscribe(
        (data) => {
          done();
        },
        (error) => {
          chai.assert.equal('404', error.status);
          done();
        },
      );
    });
  });
  describe('#call to getWrongAllFilms(), don\'t call error middleware and get error', () => {
    it('Should get a 404 error', (done) => {
      const api = new RxjsWrapper(apiDefs);
      api.addErrorMiddlewares([
        {
          name: '404',
          handler: (request) => {
            chai.assert.equal('invalid', request.status);
          },
        },
      ]);
      api.routes.getWrongAllFilmsIgnore().subscribe(
        (data) => {
          done();
        },
        (error) => {
          chai.assert.equal('404', error.status);
          done();
        },
      );
    });
  });
});
