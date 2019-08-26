import {AbstractComponent} from './AbstractComponent';

import {getDateStrShort} from '../utils';

export class TripDay extends AbstractComponent {
  constructor(day, dayIndex) {
    super();
    this._day = day;
    this._dayIndex = dayIndex;
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
