'use strict';

import {arrEventTypes} from './event-types';
import {arrPlaces} from './places';

function randomDate(start, end, startHour, endHour) {
  var date = new Date(+start + Math.random() * (end - start));
  var hour = startHour + Math.random() * (endHour - startHour) | 0;
  date.setHours(hour);
  return date;
};

export const getEvent = () => ({
  type: new Set(arrEventTypes.sort(() => 0.5 - Math.random()).slice(0, 1)),
  place: arrPlaces[Math.floor(Math.random() * arrPlaces.length)],
  dateBegin: randomDate(new Date('01.01.2019'), new Date('01.04.2019'), 12, 12).getTime(),
  duration: ((Math.floor(Math.random() * (120 - 30 + 1)) + 30) * 60 * 1000),
  price: (Math.random() * (1000-20) + 20),
  offers: [{
    name: `Add luggage`,
    price: 10,
    selected: Boolean(Math.round(Math.random()))
  }, {
    name: `Switch to comfort class`,
    price: 150,
    selected: Boolean(Math.round(Math.random()))
  }, {
    name: `Add meal`,
    price: 2,
    selected: Boolean(Math.round(Math.random()))
  }, {
    name: `Choose seats`,
    price: 9,
    selected: Boolean(Math.round(Math.random()))
  }, {
    name: `Travel by train`,
    price: 40,
    selected: Boolean(Math.round(Math.random()))
  }].slice(0, Math.floor(Math.random() * 3)),
  photos: (new Array(22)).
      fill().
      map((item, i) => i+1).
      sort(() => 0.5 - Math.random()).
      slice(0, Math.random() * (7-2) + 2)
});
