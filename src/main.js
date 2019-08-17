// import components
import {getTripHTML} from './components/trip';
import {getMenuHTML} from './components/menu';
import {getFilterHTML} from './components/filter';
import {getSortHTML} from './components/sort';
import {getTripDayHTML} from './components/trip-day';
import {getEventEditHTML} from './components/event-edit';
import {getEventItemHTML} from './components/event-item';
import {getEvent} from './data/event';

(function () {
  // consts for renderElem function (values for param "place")
  const where = {
    beforeBegin: `beforeBegin`,
    afterBegin: `afterBegin`,
    beforeEnd: `beforeEnd`,
    afterEnd: `afterEnd`
  };

  // render element function
  const renderElem = function (elem, htmlCode, place = where.beforeEnd) {
    elem.insertAdjacentHTML(place, htmlCode);
  };

  // get unique elements of array
  function uniqueArray(arr) {
    let result = [];

    for (let str of arr) {
      if (!result.includes(str)) {
        result.push(str);
      }
    }

    return result;
  }

  const elemTripMain = document.querySelector(`.page-header .trip-main`);
  const elemTripInfo = elemTripMain.querySelector(`.trip-info`);
  const elemTripControls = elemTripMain.querySelector(`.trip-controls`);
  const elemTripControlsH = elemTripControls.querySelector(`h2.visually-hidden`);

  const elemPageMain = document.querySelector(`.page-main`);
  const elemTripEvents = elemPageMain.querySelector(`.trip-events`);

  // trip
  renderElem(elemTripInfo, getTripHTML(`Amsterdam &mdash; ... &mdash; Amsterdam`, `Mar 18&nbsp;&mdash;&nbsp;22`), where.afterBegin);

  // menu
  renderElem(elemTripControlsH, getMenuHTML(), where.afterEnd);

  // filters
  renderElem(elemTripControls, getFilterHTML());

  // sort
  renderElem(elemTripEvents, getSortHTML());

  // create tip days element
  const tripDays = document.createElement(`ul`);
  tripDays.className = `trip-days`;


  const EVENT_COUNT = 10;
  const arrTripEvents = new Array(EVENT_COUNT).fill().map(getEvent);

  window.arrTripEvents = arrTripEvents;

  // array of trip days
  const arrTripDays = uniqueArray(arrTripEvents.map((event) => (new Date(event.dateBegin).setHours(0, 0, 0, 0)))).sort();


  // days
  arrTripDays.forEach((day, dayItndex) => {
    // day info
    renderElem(tripDays, getTripDayHTML(day, dayItndex + 1));
    const days = tripDays.querySelectorAll(`.day`);
    const dayElem = days[days.length - 1];
    const eventList = dayElem.querySelector(`.trip-events__list`);

    // events
    arrTripEvents
      // get events for current day
      .filter((eventsItem) => new Date(eventsItem.dateBegin).setHours(0, 0, 0, 0) === new Date(day).setHours(0, 0, 0, 0))
      .forEach((event, eventIndex) => {
        // LI for event
        const eventsItem = document.createElement(`li`);
        eventsItem.className = `trip-events__item`;
        eventList.append(eventsItem);

        // render event item
        if (dayItndex === 0 && eventIndex === 0) {
          // event edit
          renderElem(eventsItem, getEventEditHTML(event), where.beforeEnd);
        } else {
          renderElem(eventsItem, getEventItemHTML(event));
        }
      });
  });

  // append days to page
  elemTripEvents.append(tripDays);
})();
