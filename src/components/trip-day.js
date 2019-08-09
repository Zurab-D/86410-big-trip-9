export const getTripDayHTML = function ({id, name}) {
  return `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${id}</span>
        <time class="day__date" datetime="0000-00-00">${name}</time>
      </div>
    </li>`;
};
