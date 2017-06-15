### rxjs-ajax-wrapper

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

Step 2: Initialize the wrapper

```javascript
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

Method | Explanation | Arguments | Example
------------ | ------------- | -------------
`addRequestMiddleware()` | Define a function that returns arguments to append to the request header. | `(middlewareFunc, middlewareFuncParams)` | `api.addRequestMiddleware((store) => ({Authorization: store.getState().token}));`

# Todo ideas

* All of the Rx.Ajax options compatibility.
* Error handling middleware.
Example : 
```javascript
api.addErrorMiddleware([{ code: 404, handler: (request) => { dispatch(errorHandler(request.error)); }} ]);
```
