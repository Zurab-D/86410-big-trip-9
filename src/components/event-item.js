import {createElement, formatDate, getDurationHours, getDurationMinutes} from '../utils';

export class EventItem {
  constructor({type, place, dateBegin, duration, price, offers}) {
    this._type = type;
    this._place = place;
    this._dateBegin = dateBegin;
    this._duration = duration;
    this._price = price;
    this._offers = offers;
    this._element = null;
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

  get template() {
    return `<li class="trip-events__item">
    <div class="event">
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${this._type.icon}" alt="Event type icon">
      </div>
      <h3 class="event__title">${this._type.actionName} ${this._place.name}</h3>

      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="2019-03-18T10:30">${formatDate(new Date(this._dateBegin))}</time>
          &mdash;
          <time class="event__end-time" datetime="2019-03-18T11:00">${formatDate(new Date(this._dateBegin + this._duration))}</time>
        </p>
        <p class="event__duration">${getDurationHours(this._duration)}h ${getDurationMinutes(this._duration)}m</p>
      </div>

      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${this._price}</span>
      </p>

      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
        ${this._offers.map((offer) => `
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
}
