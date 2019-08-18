import {getDateStrShort} from '../utils';

export const getTripDayHTML = (day, dayItndex) => `
  <li class="trip-days__item  day">
    <div class="day__info">
      <span class="day__counter">${dayItndex}</span>
      <time class="day__date" datetime="0000-00-00">${getDateStrShort(day)}</time>
    </div>
    <ul class="trip-events__list"></ul>
  </li>`;
