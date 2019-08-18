import {getTripTitle, getTripTitleDates, getTotalCost} from '../utils';

export const getTripHTML = (arrTripEvents) => `
  <div class="trip-info__main">
    <h1 class="trip-info__title">${getTripTitle(arrTripEvents)}</h1>
    <p class="trip-info__dates">${getTripTitleDates(arrTripEvents)}</p>
  </div>
  <p class="trip-info__cost">
    Total: &euro;&nbsp;<span class="trip-info__cost-value">${getTotalCost(arrTripEvents)}</span>
  </p>`;
