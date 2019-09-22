import {ModelPoint} from './models/model-point';

const HTTPMethod = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

const toJSON = (response) => {
  return response.json();
};

export const API = class {
  constructor({endPoint, authorization}) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getPoints() {
    return this._load({url: `points`})
      .then(toJSON)
      .then(ModelPoint.parsePoints);
  }

  getDestinations() {
    return this._load({url: `destinations`})
      .then(toJSON);
  }

  getOffers(type) {
    return this._load({url: `offers`})
      .then(toJSON)
      .then((offers) => offers.filter((offer) => {
        return offer.type === type || type === undefined;
      }));
  }

  createPoint({point}) {
    return this._load({
      url: `points`,
      method: HTTPMethod.POST,
      body: JSON.stringify(point)
    })
      .then(toJSON)
      .then(ModelPoint.parsePoint);
  }

  updatePoint({id, data}) {
    return this._load({
      url: `points/${id}`,
      method: HTTPMethod.PUT,
      body: JSON.stringify(data)
    })
      .then(toJSON)
      .then(ModelPoint.parsePoint);
  }

  deletePoint({id}) {
    return this._load({url: `points/${id}`, method: HTTPMethod.DELETE});
  }

  syncPoints({points}) {
    return this._load({
      url: `points/sync`,
      method: HTTPMethod.POST,
      body: JSON.stringify(points)
    })
      .then(toJSON);
  }

  _load({url, method = HTTPMethod.GET, body = null, headers = new Headers({'Content-Type': `application/json`})}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        // console.error(`fetch error: ${err}`);
        throw err;
      });
  }
};
