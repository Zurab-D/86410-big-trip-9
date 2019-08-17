const arrMonthNames = [
  `Jan`,
  `Feb`,
  `Mar`,
  `Apr`,
  `May`,
  `Jun`,
  `Jul`,
  `Aug`,
  `Sep`,
  `Oct`,
  `Nov`,
  `Dec`,
];

export const getTripDayHTML = (day, dayItndex) => `
  <li class="trip-days__item  day">
    <div class="day__info">
      <span class="day__counter">${dayItndex}</span>
      <time class="day__date" datetime="0000-00-00">${arrMonthNames[(new Date(day)).getMonth()]} ${(new Date(day)).getDate()}</time>
    </div>
    <ul class="trip-events__list"></ul>
  </li>`;
