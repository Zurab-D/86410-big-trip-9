// import components
import {Trip} from './components/trip';
import {Menu} from './components/menu';
import {Filter} from './components/filter';
import {Sort} from './components/sort';
import {TripDay} from './components/trip-day';
import {EventEdit} from './components/event-edit';
import {EventItem} from './components/event-item';
import {NoPoints} from './components/no-points';
import {getEvent} from './data/event';

import {render, unrender, Position, uniqueArray} from './utils';

const elemTripMain = document.querySelector(`.trip-main`);
const elemTripInfo = elemTripMain.querySelector(`.trip-info`);
const elemTripControls = elemTripMain.querySelector(`.trip-controls`);
const elemTripControlsH = elemTripControls.querySelector(`h2.visually-hidden`);
const elemPageMain = document.querySelector(`.page-main`);
const elemTripEvents = elemPageMain.querySelector(`.trip-events`);

const EVENT_COUNT = 6;
const arrTripEvents = (new Array(EVENT_COUNT).fill().map(getEvent)).
  sort((eventA, eventB) => eventA.dateBegin > eventB.dateBegin ? 1 : -1);

// trip
render(elemTripInfo, (new Trip(arrTripEvents)).element);

// menu
render(elemTripControlsH, (new Menu()).element, Position.afterEnd);

// filters
render(elemTripControls, (new Filter()).element);

// sort
render(elemTripEvents, (new Sort()).element);

// create tip days html element
const tripDays = document.createElement(`ul`);
tripDays.className = `trip-days`;

// array of trip days
const arrTripDays = uniqueArray(arrTripEvents.map((event) => (new Date(event.dateBegin).setHours(0, 0, 0, 0)))).sort();

// --- render a day with events ------------------------
const renderTripDay = (day, dayIndex) => {
  // day info
  render(tripDays, (new TripDay(day, dayIndex + 1)).element);

  const days = tripDays.querySelectorAll(`.day`);
  const dayElem = days[days.length - 1];
  const eventList = dayElem.querySelector(`.trip-events__list`);

  // events
  arrTripEvents
    // get events for current day
    .filter((eventsItem) => new Date(eventsItem.dateBegin).setHours(0, 0, 0, 0) === new Date(day).setHours(0, 0, 0, 0))
    .forEach((event) => {
      const eventEdit = new EventEdit(event);
      const eventItem = new EventItem(event);

      render(eventList, eventItem.element);

      const onEscKeyDown = (evt) => {
        if (evt.key === `Escape` || evt.key === `Esc`) {
          eventList.replaceChild(eventItem.element, eventEdit.element);
          document.removeEventListener(`keydown`, onEscKeyDown);
        }
      };

      eventItem.element.querySelector(`.event__rollup-btn`).
        addEventListener(`click`, () => {
          eventList.replaceChild(eventEdit.element, eventItem.element);
          document.addEventListener(`keydown`, onEscKeyDown);
        });

      eventEdit.element.
        addEventListener(`submit`, () => {
          eventList.replaceChild(eventItem.element, eventEdit.element);
        });

      eventEdit.element.querySelector(`.event__rollup-btn`).
        addEventListener(`click`, () => {
          eventList.replaceChild(eventItem.element, eventEdit.element);
        });

      eventEdit.element.
        addEventListener(`reset`, () => {
          unrender(eventItem.element);
          eventItem.removeElement();

          unrender(eventEdit.element);
          eventEdit.removeElement();
        });

      Array.from(eventEdit.element.querySelectorAll(`input`)).forEach((elem) => {
        elem.addEventListener(`focus`, () => {
          document.removeEventListener(`keydown`, onEscKeyDown);
        });

        elem.addEventListener(`blur`, () => {
          document.addEventListener(`keydown`, onEscKeyDown);
        });
      });
    });
};

// render all days
if (arrTripDays.length) {
  arrTripDays.forEach(renderTripDay);
} else {
  // no event found
  render(elemTripEvents, (new NoPoints()).element);
}

// append days to page
elemTripEvents.append(tripDays);
