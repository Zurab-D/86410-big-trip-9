import {arrEventTypes} from './event-types';
import {arrPlaces} from './places';
import {arrOffers} from './offers';
import {randomDate} from '../utils';

const loremIpsum = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;

export const getEvent = () => ({
  type: arrEventTypes.sort(() => 0.5 - Math.random()).slice(0, 1)[0],
  place: arrPlaces[Math.floor(Math.random() * arrPlaces.length)],
  description: loremIpsum.split(`.`).map((str) => str.trim()).filter((str) => str !== ``).sort(() => 0.5 - Math.random()).slice(0, Math.random() * 3 + 1).join(`. `),
  dateBegin: randomDate(new Date(`01.01.2019`), new Date(`01.10.2019`), 12, 12).getTime(),
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
