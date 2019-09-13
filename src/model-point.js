import moment from 'moment';
import {arrEventTypes} from './data/event-types';

// server data to client data
export class ModelPoint {
  constructor(data) {
    // console.log('ModelPoint');
    // console.log(data);

    // this._data = data;
    this.id = data[`id`];
    this.type = arrEventTypes.find((eventType) => eventType.name.toLowerCase() === data[`type`]);
    this.place = {name: data[`destination`].name, type: `sity`}; // arrPlaces[Math.floor(Math.random() * arrPlaces.length)],
    this.description = data[`destination`].description; // loremIpsum.split(`.`).map((str) => str.trim()).filter((str) => str !== ``).sort(() => 0.5 - Math.random()).slice(0, Math.random() * 3 + 1).join(`. `),
    this.dateBegin = moment(data[`date_from`]).toDate().getTime(); // randomDate(moment(new Date()).add(-10, `days`).toDate(), moment(new Date()).add(10, `days`).toDate(), 12, 12).getTime(),
    this.duration = this.dateBegin - moment(data[`date_to`]).toDate().getTime(); // ((Math.floor(Math.random() * (120 - 30 + 1)) + 30) * 60 * 1000), // miliseconds
    this.price = +data[`base_price`]; // Math.floor(Math.random() * (200 - 20) + 20),
    this.offers = data[`offers`].reduce((prev, offer) => {
      return prev.concat(
          offer.offers.map((offersItem) => {
            return {
              id: offersItem.name.toLowerCase().split(` `).join(`-`),
              name: offersItem.name,
              price: offersItem.price,
              type: offer.type,
              selected: false
            };
          }));
    }, []); // arrOffers.slice(0).sort(() => Math.random() - 0.5).slice(0, Math.floor(Math.random() * 4)),
    this.photos = data[`destination`].pictures;
    /* new Array(22).
        fill().
        map(() => `http://picsum.photos/300/150?r=${Math.random()}`).
        sort(() => 0.5 - Math.random()).
        slice(0, Math.random() * (7 - 2) + 2), */
    this.favorite = data[`is_favorite`]; // Boolean(Math.round(Math.random()) * 0.5)
    // console.log(this);
  }

  static parsePoint(data) {
    return new ModelPoint(data);
  }

  static parsePoints(data) {
    return data.map(ModelPoint.parsePoint);
  }

  toRAW() {
    window.moment = moment;
    window.myPointModel = this;
    return {
        id: this.id,
        base_price: this.price,
        date_from: moment(this.dateBegin).format(`YYYY-MM-DDTHH:mm:ss.sssZZ`),
        date_to: moment(this.dateBegin + this.duration).format(`YYYY-MM-DDTHH:mm:ss.sssZZ`),
        destination: {
          description: this.description,
          name: this.place.name,
          pictures: this.photos
        },
        is_favorite: this.favorite,
        offers: this.offers
          .reduce((prev, offerItem) => {
            if (!prev.includes(offerItem.type)) {
              prev.push(offerItem.type);
            }
            return prev;
          }, [])
          .reduce((prev, offerType) => {
            const filteredOffers = this.offers.filter((offer) => offer.type === offerType);
            prev.push({
              type: offerType,
              offers: filteredOffers.map((offerIt) => {
                return {
                  name: offerIt.name,
                  price: offerIt.price
                }
              })
            });
            return prev;
          }, []),
        type: this.type.name.toLowerCase()
    }
  }

  static toRAW(data) {
    return {
        id: data.id,
        base_price: data.price,
        date_from: moment(data.dateBegin).format(`YYYY-MM-DDTHH:mm:ss.sssZZ`),
        date_to: moment(data.dateBegin + data.duration).format(`YYYY-MM-DDTHH:mm:ss.sssZZ`),
        destination: {
          description: data.description,
          name: data.place.name,
          pictures: data.photos
        },
        is_favorite: data.favorite,
        offers: data.offers
          .reduce((prev, offerItem) => {
            if (!prev.includes(offerItem.type)) {
              prev.push(offerItem.type);
            }
            return prev;
          }, [])
          .reduce((prev, offerType) => {
            const filteredOffers = data.offers.filter((offer) => offer.type === offerType);
            prev.push({
              type: offerType,
              offers: filteredOffers.map((offerIt) => {
                return {
                  name: offerIt.name,
                  price: offerIt.price
                }
              })
            });
            return prev;
          }, []),
        type: data.type.name.toLowerCase()
    }
  }
}
