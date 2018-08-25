### rxjs-ajax-wrapper

*Disclaimer*: Uses RxJS v6, for RxJS v5 compatible wrapper, please check `v0.1.38`.

[![Version](https://img.shields.io/npm/v/rxjs-ajax-wrapper.svg)](https://www.npmjs.org/package/rxjs-ajax-wrapper)
[![npm download][download-image]][download-url]

[download-image]: https://img.shields.io/npm/dm/rxjs-ajax-wrapper.svg?style=flat-square
[download-url]: https://npmjs.org/package/rxjs-ajax-wrapper

Simple to use and simple to setup wrapper for rxjs. Allows you to define your distant resources api and call them on the fly, while having set custom middlewares beforehand !

# How to use

**Step 1**: Define your api routes.

```javascript
const apiDefs = {
  getAllFilms: {
    url: 'https://ghibliapi.herokuapp.com/films',
    method: 'GET',
    responseType: 'json',
  },
  getSingleFilm: {
    url: 'https://ghibliapi.herokuapp.com/films/:filmID',
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

**Step 2**: Initialize the wrapper

```javascript
import { RxjsWrapper } from 'rxjs-ajax-wrapper';

const api = new RxjsWrapper(apiDefs);
```

**Step 3**: Call the routes

```javascript
api.routes.getAllFilms(params)
```

#### Parameters

When calling a route, 3 different parameters can be added to the request:

`params`: `Object` -> Will replace the `:someParam`, in the request definition with the desired parameters.
`query`: `Object` -> Will append some query parameters to the request.
`body`: `*` -> The body of the request.

*Example*
```javascript
api.routes.getSingleFilm({
  params: {
    filmID: 2,
  },
  body,
  query: {
    lim: 3,
  }  
})
```

#### Return value

Return an `Observable`.
Checkout [https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/doc/operators/ajax.md](https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/doc/operators/ajax.md) for more details.

# Library functions

#### CombineWrappers

Function | Explanation | Arguments | Return Value | Example
------------ | ------------- | -------------  | -------------  | -------------
`CombineWrappers()` | Combine multiples wrappers. | `({wrapperKey: wrapper, ...})` | The combined wrappers, with each wrapper routes in the respective wrapper object. | `new CombineWrappers({auth: authWrapper, film: filmWrapper});`

`CombineWrappers` will return an object like this:
```javascript
{
  resources: {
    auth,
    film,
  }
  addErrorMiddlewares, // See Methods
  addRequestMiddlewares, // See Methods
}
```

It is then possible to add an error/request middleware after the creation of the `Wrapper` (ex: when having logged-in etc ...).

**Example**

Here is a very basic example using `redux-observable` library.

```javascript
import { CombineWrappers } from 'rxjs-ajax-wrapper';

import exampleApi from 'exampleApi';
import anotherApi from 'anotherApi';

const appApi = new CombineWrappers({
  example: exampleApi;
  another: anotherApi;
});

...


const loginEpic = action$ =>
  action$.pipe(
    ofType('LOGIN_REQUEST'),
    mergeMap(action =>
      race(
        appApi.resources.login.login({body: JSON.stringify(action.payload)}).pipe(
          flatMap(response => {
            appApi.addRequestMiddlewares([
              {
                name: 'token',
                handler: () => ({ headers: { Authorization: 'sometoken' } }),
              }
            ]);
            return of(loginFulfilled(response.response));
          }),
          catchError(error => of(loginRejected(error))),
        ),
        action$.pipe(
          ofType('LOGIN_REQUEST'),
          flatMap(() => of(loginCancelled(action.payload))),
          take(1),
        ),
      )),
  );

export default loginEpic;
```

#### `RxjsWrapper` methods

Method | Explanation | Arguments | Example
------------ | ------------- | -------------  | -------------
`addRequestMiddlewares()` | Define a function that returns arguments to append to the request header. | `([{name: middlewareName: handler: middlewareFunc}], middlewareFuncParams)` | `api.addRequestMiddlewares([name: 'token', handler: (store) => ({Authorization: store.getState().token})], store);`
`addErrorMiddlewares()` | Define a function that returns functions to call when an error occurs. | `([{name: middlewareName: handler: middlewareFunc}], middlewareFuncParams)` | `api.addErrorMiddlewares([name: '404Middleware', handler: (request) => { if (request.status === 404) dispatch(somtething()) }]);`

# Ignore middleware on specific route.

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

* Update/remove middleware.
