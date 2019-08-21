import {createElement, getDateStrShort} from '../utils';

export class Trip {
  constructor(arrTripEvents) {
    this._arrTripEvents = arrTripEvents;
  }

  get element() {
    if (!this._element) {
      this._element = createElement(this.template);
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }

  get tripTitle() {
    return this._arrTripEvents.
      filter((event) => event.place.type === `sity`).
      map((event) => event.place.name).
      reduce((previousValue, sity, idx, arr) => {
        if (idx === 0) {
          if (arr.length === 1) {
            return sity + ` &mdash; ` + sity;
          }
          return sity;
        }

        if (arr.length <= 3) {
          return previousValue + ` &mdash; ` + sity;
        } else {
          if (idx === arr.length - 1) {
            return previousValue + ` &mdash; ... &mdash; ` + sity;
          } else {
            return previousValue;
          }
        }
      }, ``);
  }

  get tripDates() {
    return this._arrTripEvents.reduce((previousValue, event, idx, arr) => {
      if (idx === 0) {
        return getDateStrShort(event.dateBegin);
      }
      if (idx === arr.length - 1) {
        return previousValue + ` &mdash; ` + getDateStrShort(event.dateBegin);
      }
      return previousValue;
    }, ``);
  }

  get totalCost() {
    return this._arrTripEvents.reduce((previousValue, event) =>
      previousValue + event.price + event.offers.reduce((prevOffersSum, offer) =>
        prevOffersSum + offer.price, 0),
    0);
  }

  get template() {
    return `<div class="trip-info__main">
        <h1 class="trip-info__title">${this.tripTitle}</h1>
        <p class="trip-info__dates">${this.tripDates}</p>
      </div>
      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${this.totalCost}</span>
      </p>`;
  }
}
