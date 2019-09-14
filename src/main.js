import {render, Position} from './utils';

import {API} from './api';

import {Menu} from './components/menu';
import {Filter} from './components/filter';
import {Sort} from './components/sort';

import {TripController} from './controllers/TripController';
import {StatController} from './controllers/StatsController';

const AUTHORIZATION = `Basic kTy9gIdsz2317rD`;
const END_POINT = `https://htmlacademy-es-9.appspot.com/big-trip`;
// const END_POINT = `http://localhost:3003`;  // for json-server
const api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});

const pageBody = document.querySelector(`.page-body`);
const elemTripMain = pageBody.querySelector(`.trip-main`);
const elemTripControls = elemTripMain.querySelector(`.trip-controls`);
const elemTripControlsH = elemTripControls.querySelector(`h2.visually-hidden`);
const elemPageMain = pageBody.querySelector(`.page-main`);
const elemTripEvents = elemPageMain.querySelector(`.trip-events`);
const elemTripDays = elemTripEvents.querySelector(`.trip-days`);

api.getDestinations()
  .then((arrPlaces) => arrPlaces)
  .then((arrPlaces) => {
    api.getPoints()
      .then((arrTripEvents) => {
        // menu
        const menu = new Menu();
        render(elemTripControlsH, menu.element, Position.afterEnd);

        // sort
        render(elemTripDays, (new Sort()).element, Position.beforeBegin);

        // stats
        const statController = new StatController(elemTripEvents, arrTripEvents);

        // whole trip
        const tripController = new TripController(pageBody, arrTripEvents, arrPlaces, api);
        tripController.init();

        // filters
        const filters = new Filter(tripController);
        render(elemTripControls, filters.element);

        // toggle events/stats
        const menuItems = menu.element.querySelectorAll(`.trip-tabs__btn`);
        menu.element.addEventListener(`click`, (evt) => {
          evt.preventDefault();

          if (evt.target.tagName !== `A`) {
            return;
          }

          menuItems.forEach((elem) => {
            elem.classList.remove(`trip-tabs__btn--active`);
          });

          switch (evt.target === menuItems[0]) {
            case true:
              statController.hide();
              filters.show();
              tripController.show();
              menuItems[0].classList.add(`trip-tabs__btn--active`);
              break;

            default:
              statController.show();
              filters.hide();
              tripController.hide();
              menuItems[1].classList.add(`trip-tabs__btn--active`);
              break;
          }
        });

        // uncomment this to go to the stats directly
        // menu.element.querySelectorAll(`.trip-tabs__btn`)[1].click();

        // New event
        elemTripMain
          .querySelector(`.trip-main__event-add-btn`)
          .addEventListener(`click`, () => {
            tripController.createTripEvent();
          });
      });
  })
  .catch((err) => console.error(`!!!! ` + err));
