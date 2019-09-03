import {render, Position} from './utils';

import {getEvent, getEventEmpty} from './data/event';

import {Menu} from './components/menu';
import {Filter} from './components/filter';
import {Sort} from './components/sort';
import {Statistics} from './components/statistics';

import {TripController} from './controllers/TripController';

const pageBody = document.querySelector(`.page-body`);

const elemTripMain = pageBody.querySelector(`.trip-main`);
const elemTripControls = elemTripMain.querySelector(`.trip-controls`);
const elemTripControlsH = elemTripControls.querySelector(`h2.visually-hidden`);
const elemPageMain = pageBody.querySelector(`.page-main`);
const elemTripEvents = elemPageMain.querySelector(`.trip-events`);
const elemTripDays = elemTripEvents.querySelector(`.trip-days`);

const EVENT_COUNT = 6;
const arrTripEvents = (new Array(EVENT_COUNT).fill().map(getEvent))
  .sort((eventA, eventB) => eventA.dateBegin > eventB.dateBegin ? 1 : -1);

// menu
const menu = new Menu();
render(elemTripControlsH, menu.element, Position.afterEnd);

// filters
render(elemTripControls, (new Filter()).element);

// sort
render(elemTripDays, (new Sort()).element, Position.beforeBegin);

// stats
const stats = new Statistics();
render(elemTripEvents, stats.element, Position.afterEnd);
stats.element.classList.add(`visually-hidden`);

export const tripController = new TripController(pageBody, arrTripEvents);
tripController.init();

// toggle events/stats
const menuItems = menu.element.querySelectorAll(`.trip-tabs__btn`)
menu.element.addEventListener(`click`, (evt) => {
  evt.preventDefault();

  if (evt.target.tagName != `A`) {
    return;
  }

  menuItems.forEach((elem) => {
    elem.classList.remove(`trip-tabs__btn--active`);
  });

  switch (evt.target === menuItems[0]) {
    case true:
      stats.hide();
      tripController.show();
      menuItems[0].classList.add(`trip-tabs__btn--active`);
      break;

    default:
      stats.show();
      tripController.hide();
      menuItems[1].classList.add(`trip-tabs__btn--active`);
      break;
  }
});

// New event
const newEventBtn = elemTripMain.querySelector(`.trip-main__event-add-btn`);
newEventBtn.addEventListener(`click`, () => {
  // const newEvent = getEventEmpty();
  // tripController._onDataChange(null, newEvent);
  tripController.createTripEvent();
});
