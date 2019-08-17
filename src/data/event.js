import {arrEventTypes} from './event-types';
import {setPlaces} from './places';
import {arrOffers} from './offers';
import {randomDate} from '../utils';

export const getEvent = () => ({
  type: arrEventTypes.sort(() => 0.5 - Math.random()).slice(0, 1)[0],
  place: Array.from(setPlaces)[Math.floor(Math.random() * setPlaces.size)],
  dateBegin: randomDate(new Date(`01.01.2019`), new Date(`01.04.2019`), 12, 12).getTime(),
  duration: ((Math.floor(Math.random() * (120 - 30 + 1)) + 30) * 60 * 1000), // miliseconds
  price: Math.floor(Math.random() * (200 - 20) + 20),
  offers: arrOffers.slice(0, Math.floor(Math.random() * 3)),
  photos: new Array(22).
      fill().
      map((item, i) => i + 1 + `.jpg`).
      sort(() => 0.5 - Math.random()).
      slice(0, Math.random() * (7 - 2) + 2),
  favorite: Boolean(Math.round(Math.random()) * 0.5)
});
