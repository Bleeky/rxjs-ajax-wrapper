### rxjs-ajax-wrapper

[![Version](https://img.shields.io/npm/v/rxjs-ajax-wrapper.svg)](https://www.npmjs.org/package/rxjs-ajax-wrapper)
[![npm download][download-image]][download-url]

[download-image]: https://img.shields.io/npm/dm/rxjs-ajax-wrapper.svg?style=flat-square
[download-url]: https://npmjs.org/package/rxjs-ajax-wrapper

Simple to use and simple to setup wrapper for rxjs. Allows you to define your distant resources api and call them on the fly.

## How to use

Step 1: Define your api routes.

```javascript
const apiDefs = {
  getAllFilms: {
    url: 'https://ghibliapi.herokuapp.com/films',
    method: 'GET',
    responseType: 'json',
  },
  getSingleFilm: {
    url: 'https://ghibliapi.herokuapp.com/films/:id',
    method: 'GET',
    responseType: 'json',
  },
  postFilm: {
    url: 'https://ghibliapi.herokuapp.com/films',
    method: 'POST',
    responseType: 'json',
  },
};
```

You can check all the available request params [here](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/doc/operators/ajax.md)

Step 2: Initialize the wrapper

```javascript
import { RxjsWrapper } from 'rxjs-ajax-wrapper';

const api = new RxjsWrapper(apiDefs);
```

Step 3: Call the routes

```javascript
api.routes.getAllFilms()
```

## Return value

Return an `Observable`.
Checkout [https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/doc/operators/ajax.md](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/doc/operators/ajax.md) for more details.

## Options

## Functions

Function | Explanation | Arguments | Return Value | Example
------------ | ------------- | -------------  | -------------  | -------------
`combineWrappers()` | Combine multiples wrappers. | `({wrapperKey: wrapper, ...})` | The combined wrappers, with each wrapper routes in the respective wrapper object. | `combineWrappers({authWrapper, filmWrapper});`

## Methods

Method | Explanation | Arguments | Example
------------ | ------------- | -------------  | -------------
`addRequestMiddlewares()` | Define a function that returns arguments to append to the request header. | `([{name: middlewareName: handler: middlewareFunc}], middlewareFuncParams)` | `api.addRequestMiddlewares([name: 'token', handler: (store) => ({Authorization: store.getState().token})], store);`
`addErrorMiddlewares()` | Define a function that returns functions to call when an error occurs. | `([{name: middlewareName: handler: middlewareFunc}], middlewareFuncParams)` | `api.addErrorMiddlewares([name: '404Middleware', handler: (request) => { if (request.status === 404) dispatch(somtething()) }]);`

## Ignore middleware on specific route.

Simple, just an set an array `ignoreMiddlewares` containing the names of the middlewares you wish to ignore. Works for both errorMiddlewares and requestMiddlewares.

Example :
```javascript
const apiDefs = {
  specialRoute: {
    url: 'https://ghibliapi.herokuapp.com/films',
    method: 'GET',
    responseType: 'json',
    ignoreMiddlewares: [
      '404',
      'tokenMiddleware',
    ]
  },
};
```

# Todo ideas

* Update/delete middleware.
