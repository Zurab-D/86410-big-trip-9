import {AbstractComponent} from './AbstractComponent';

import {formatDate, getDuration} from '../utils';

export class EventItem extends AbstractComponent {
  constructor({type, place, dateBegin, duration, price, offers, id}) {
    super();
    this._type = type;
    this._place = place;
    this._dateBegin = dateBegin;
    this._duration = duration;
    this._price = price;
    this._offers = offers;
    this._id = id;
  }

  get template() {
    return `<li class="trip-events__item" data-id="${this._id}">
    <div class="event">
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${this._type.icon}" alt="Event type icon">
      </div>
      <h3 class="event__title">${this._type.actionName} ${this._place.name}</h3>

      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="2019-03-18T10:30">${formatDate(this._dateBegin)}</time>
          &mdash;
          <time class="event__end-time" datetime="2019-03-18T11:00">${formatDate(this._dateBegin + this._duration)}</time>
        </p>
        <p class="event__duration">${getDuration(this._duration)}</p>
      </div>

      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${this._price}</span>
      </p>

      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
        ${this._offers.filter((offer) => offer.selected).slice(0, 3).map((offer) => `
          <li class="event__offer">
          <span class="event__offer-title">${offer.name}</span>
          &plus;
          &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
        </li>
        `).join(``)}
      </ul>

      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div></li>`;
  }

  refresh({type, place, dateBegin, duration, price, offers, id}) {
    this._type = type;
    this._place = place;
    this._dateBegin = dateBegin;
    this._duration = duration;
    this._price = price;
    this._offers = offers;
    this._id = id;
    this._element.innerHTML = this.template;
  }
}
