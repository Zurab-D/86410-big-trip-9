import {render, Position} from './utils';

import {API} from './api';
import {Store} from './store.js';
import {Provider} from './provider.js';

import {Menu} from './components/menu';
import {Filter} from './components/filter';
import {Sort} from './components/sort';

import {TripController} from './controllers/TripController';
import {StatController} from './controllers/StatsController';

const OFFLINE_TITLE = ` [OFFLINE]`;
const AUTHORIZATION = `Basic kTy9gIdsz2317rD`;
const END_POINT = `https://htmlacademy-es-9.appspot.com/big-trip`;
// const END_POINT = `http://localhost:3003`;  // for json-server
const STORE_KEY = `store-key-big-trip-v.1`;

const api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});
const store = new Store(STORE_KEY, localStorage);
const provider = new Provider(api, store);

const pageBody = document.querySelector(`.page-body`);
const elemTripMain = pageBody.querySelector(`.trip-main`);
const elemTripControls = elemTripMain.querySelector(`.trip-controls`);
const elemTripControlsH = elemTripControls.querySelector(`h2.visually-hidden`);
const elemPageMain = pageBody.querySelector(`.page-main`);
const elemTripEvents = elemPageMain.querySelector(`.trip-events`);
const elemTripDays = elemTripEvents.querySelector(`.trip-days`);

window.addEventListener(`offline`, () => {
  document.title = `${document.title}${OFFLINE_TITLE}`;
});

window.addEventListener(`online`, () => {
  document.title = document.title.split(OFFLINE_TITLE)[0];
  provider.syncPoints();
});

provider.getDestinations()
  .then((arrPlaces) => {
    provider.getPoints()
      .then((arrTripEvents) => {
        provider.getOffers()
          .then((arrOffers) => {
            // menu
            const menu = new Menu();
            render(elemTripControlsH, menu.element, Position.afterEnd);

            // sort
            const sort = new Sort();
            render(elemTripDays, sort.element, Position.beforeBegin);
            sort.element.querySelector(`.trip-sort__item--event>input`).click();

            // stats
            const statController = new StatController(elemTripEvents, arrTripEvents);

            // whole trip
            const tripController = new TripController(pageBody, arrTripEvents, arrPlaces, arrOffers, provider);
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
      });
  })
  .catch((err) => console.error(`!!!! ` + err));
