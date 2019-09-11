import moment from 'moment';
import {arrEventTypes} from './data/event-types';
import {arrPlaces} from './data/places';
import {arrOffers} from './data/offers';

class ModelPonint {
  constructor(data) {
    this.id = data[`id`];
    this.type = arrEventTypes.find((eventType) => eventType.name.toLowerCase() === data[`type`]);
    this.place = {name: data[`destination`].name, type: `sity`}; //arrPlaces[Math.floor(Math.random() * arrPlaces.length)],
    this.description = data[`destination`].description; //loremIpsum.split(`.`).map((str) => str.trim()).filter((str) => str !== ``).sort(() => 0.5 - Math.random()).slice(0, Math.random() * 3 + 1).join(`. `),
    this.dateBegin = moment(data[`date_from`]).getTime(); //randomDate(moment(new Date()).add(-10, `days`).toDate(), moment(new Date()).add(10, `days`).toDate(), 12, 12).getTime(),
    this.duration = this.dateBegin - moment(data[`date_to`]).getTime();  //((Math.floor(Math.random() * (120 - 30 + 1)) + 30) * 60 * 1000), // miliseconds
    this.price = +data[`base_price`]; //Math.floor(Math.random() * (200 - 20) + 20),
    this.offers = data[`offers`].reduce((prev, offer) => {
      return prev.concat(
        offer.offers.map((offersItem) => {
          return {
            id: offersItem.name.toLowerCase().split(` `).join(`-`),
            name: offersItem.name,
            price: offersItem.price,
            selected: false
          }
      }));
    }, []) //arrOffers.slice(0).sort(() => Math.random() - 0.5).slice(0, Math.floor(Math.random() * 4)),
    this.photos = data[`destination`].pictures.map((picture) => picture.src);
      /* new Array(22).
          fill().
          map(() => `http://picsum.photos/300/150?r=${Math.random()}`).
          sort(() => 0.5 - Math.random()).
          slice(0, Math.random() * (7 - 2) + 2), */
    favorite: false; // Boolean(Math.round(Math.random()) * 0.5)
  }
}
