global.XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

import chai from 'chai';
import { RxjsWrapper } from '../src';

const apiDefs = {
  getAllFilms: {
    url: 'https://ghibliapi.herokuapp.com/films',
    method: 'GET',
    responseType: 'json',
  },
  getWrongAllFilms: {
    url: 'https://ghibliapi.herokuapp.com/filmss',
    method: 'GET',
    responseType: 'json',
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
      api.addRequestMiddleware(() => ({ headers: { Authorization: 'Bearer testing' } }));
      done();
    });
  });
  describe('#have middleware in request header', () => {
    it('should contains correct headers', (done) => {
      const api = new RxjsWrapper(apiDefs);
      api.addRequestMiddleware(() => ({ headers: { Authorization: 'Bearer testing' } }));
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
});
