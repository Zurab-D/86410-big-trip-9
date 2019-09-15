import moment from 'moment';
import {arrEventTypes} from '../data/event-types';
import {ModelOffer} from './model-offer';

// server data to client data
export class ModelPoint {
  constructor(data) {
    this.id = data[`id`];
    this.type = arrEventTypes.find((eventType) => eventType.name.toLowerCase() === data[`type`]);
    this.place = data[`destination`];
    this.description = data[`destination`].description;
    this.dateBegin = moment(data[`date_from`]).toDate().getTime();
    this.duration = moment(data[`date_to`]).toDate().getTime() - this.dateBegin;
    this.price = +data[`base_price`];
    this.offers = data[`offers`].map((offersItem) => new ModelOffer(offersItem));
    this.photos = data[`destination`].pictures;
    this.favorite = data[`is_favorite`];
  }

  static parsePoint(data) {
    return new ModelPoint(data);
  }

  static parsePoints(data) {
    return data.map(ModelPoint.parsePoint);
  }

  toRAW() {
    return {
      "id": this.id,
      "base_price": this.price,
      "date_from": moment(this.dateBegin).format(`YYYY-MM-DDTHH:mm:ss.sssZZ`),
      "date_to": moment(this.dateBegin + this.duration).format(`YYYY-MM-DDTHH:mm:ss.sssZZ`),
      "destination": {
        description: this.description,
        name: this.place.name,
        pictures: this.photos
      },
      "is_favorite": this.favorite,
      "offers": this.offers.map((offer) => {
        return {
          title: offer.name,
          price: offer.price,
          accepted: offer.selected
        };
      }),
      "type": this.type.name.toLowerCase()
    };
  }

  static toRAW(data) {
    return {
      "id": data.id,
      "base_price": data.price,
      "date_from": moment(data.dateBegin).format(`YYYY-MM-DDTHH:mm:ss.sssZZ`),
      "date_to": moment(data.dateBegin + data.duration).format(`YYYY-MM-DDTHH:mm:ss.sssZZ`),
      "destination": {
        description: data.description,
        name: data.place.name,
        pictures: data.photos
      },
      "is_favorite": data.favorite,
      "offers": data.offers,
      "type": data.type.name.toLowerCase()
    };
  }
}
