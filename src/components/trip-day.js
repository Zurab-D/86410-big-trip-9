import {createElement, getDateStrShort} from '../utils';

export class TripDay {
  constructor(day, dayIndex) {
    this._day = day;
    this._dayIndex = dayIndex;
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
    return `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${this._dayIndex}</span>
        <time class="day__date" datetime="0000-00-00">${getDateStrShort(this._day)}</time>
      </div>
      <ul class="trip-events__list"></ul>
    </li>`;
  }
}
