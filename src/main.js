// import components
import {getTripHTML} from './components/trip';
import {getMenuHTML} from './components/menu';
import {getFilterHTML} from './components/filter';
import {getSortHTML} from './components/sort';
import {getTripDayHTML} from './components/trip-day';
import {getEventEditHTML} from './components/event-edit';
import {getEventItemHTML} from './components/event-item';

// import data
// import {arrEventType} from './data/event-types';
// import {arrPlaces} from './data/places';
import {arrTripDays} from './data/days';
import {arrTripEvents} from './data/events';

(function () {
  // consts for renderElem function (values for param "place")
  // const beforeBegin = `beforeBegin`;
  const afterBegin = `afterBegin`;
  const beforeEnd = `beforeEnd`;
  const afterEnd = `afterEnd`;

  // render element function
  const renderElem = function (elem, htmlCode, place = beforeEnd) {
    elem.insertAdjacentHTML(place, htmlCode);
  };

  const elemTripMain = document.querySelector(`.page-header .trip-main`);
  const elemTripInfo = elemTripMain.querySelector(`.trip-info`);
  const elemTripControls = elemTripMain.querySelector(`.trip-controls`);
  const elemTripControlsH = elemTripControls.querySelector(`h2.visually-hidden`);

  const elemPageMain = document.querySelector(`.page-main`);
  const elemTripEvents = elemPageMain.querySelector(`.trip-events`);

  // trip
  renderElem(elemTripInfo, getTripHTML(`Amsterdam &mdash; ... &mdash; Amsterdam`, `Mar 18&nbsp;&mdash;&nbsp;22`), afterBegin);

  // menu
  renderElem(elemTripControlsH, getMenuHTML(), afterEnd);

  // filters
  renderElem(elemTripControls, getFilterHTML());

  // sort
  renderElem(elemTripEvents, getSortHTML());

  // create tip days element
  const tripDays = document.createElement(`ul`);
  tripDays.className = `trip-days`;

  // days
  arrTripDays.forEach((daysItem, di) => {
    // day info
    renderElem(tripDays, getTripDayHTML(daysItem));
    const days = tripDays.querySelectorAll(`.day`);
    const day = days[days.length - 1];

    // create event list
    const eventList = document.createElement(`ul`);
    eventList.className = `trip-events__list`;
    day.append(eventList);

    // events
    arrTripEvents
      // get events for current day
      .filter((eventsItem) => {
        return eventsItem.day === daysItem.id;
      })
      .forEach((item, ei) => {
        // LI for event
        const eventsItem = document.createElement(`li`);
        eventsItem.className = `trip-events__item`;
        eventList.append(eventsItem);

        // render event item
        renderElem(eventsItem, getEventItemHTML(item));

        if (di === 0 && ei === 0) {
          // event edit
          renderElem(eventsItem, getEventEditHTML(), beforeEnd);
        }
      });
  });

  // append days to page
  elemTripEvents.append(tripDays);
})();
