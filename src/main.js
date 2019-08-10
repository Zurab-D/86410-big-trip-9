// import components
import {getTripHTML} from './components/trip';
import {getMenuHTML} from './components/menu';
import {getFilterHTML} from './components/filter';
import {getSortHTML} from './components/sort';
import {getTripDayHTML} from './components/trip-day';
import {getEventEditHTML} from './components/event-edit';
import {getEventItemHTML} from './components/event-item';

// import data
import {arrTripDays} from './data/days';
import {arrTripEvents} from './data/events';

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

  // days
  arrTripDays.forEach((day, dayItndex) => {
    // day info
    renderElem(tripDays, getTripDayHTML(day));
    const days = tripDays.querySelectorAll(`.day`);
    const dayElem = days[days.length - 1];
    const eventList = dayElem.querySelector(`.trip-events__list`);

    // events
    arrTripEvents
      // get events for current day
      .filter((eventsItem) => eventsItem.day === day.id)
      .forEach((event, eventIndex) => {
        // LI for event
        const eventsItem = document.createElement(`li`);
        eventsItem.className = `trip-events__item`;
        eventList.append(eventsItem);

        // render event item
        if (dayItndex === 0 && eventIndex === 0) {
          // event edit
          renderElem(eventsItem, getEventEditHTML(), where.beforeEnd);
        } else {
          renderElem(eventsItem, getEventItemHTML(event));
        }
      });
  });

  // append days to page
  elemTripEvents.append(tripDays);
})();
