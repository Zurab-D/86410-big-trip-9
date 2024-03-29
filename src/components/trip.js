import {AbstractComponent} from './AbstractComponent';

import {getDateStrShort, getDateStrShortD, getDateStrMonth} from '../utils';

export class Trip extends AbstractComponent {
  constructor(arrTripEvents) {
    super();
    this._arrTripEvents = arrTripEvents;
  }

  get _events() {
    return this._arrTripEvents.slice(0).sort((eventA, eventB) => eventA.dateBegin > eventB.dateBegin ? 1 : -1);
  }

  get tripTitle() {
    return this._events
      .map((event) => event.place.name)
      .reduce((previousValue, sity, idx, arr) => {
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
    const arrLen = this._events.length;

    return getDateStrShort(this._events[0].dateBegin)
      + ` &mdash; `
      + (getDateStrMonth(this._events[0].dateBegin) === getDateStrMonth(this._events[arrLen - 1].dateBegin)
        ? getDateStrShortD(this._events[arrLen - 1].dateBegin)
        : getDateStrShort(this._events[arrLen - 1].dateBegin));
  }

  get totalCost() {
    return this._events.reduce((previousValue, event) => {
      return +(previousValue) + +(event.price) + event.offers.reduce((prevOffersSum, offer) =>
        offer.selected ? prevOffersSum + offer.price : prevOffersSum, 0);
    }, 0);
  }

  get template() {
    return `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${this.tripTitle}</h1>
        <p class="trip-info__dates">${this.tripDates}</p>
      </div>
      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${this.totalCost}</span>
      </p>
    </section>`;
  }
}
