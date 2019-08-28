import {getEvent} from './data/event';

import {TripController} from './TripController';

const pageBody = document.querySelector(`.page-body`);

const EVENT_COUNT = 6;
const arrTripEvents = (new Array(EVENT_COUNT).fill().map(getEvent)).
  sort((eventA, eventB) => eventA.dateBegin > eventB.dateBegin ? 1 : -1);

const tripController = new TripController(pageBody, arrTripEvents);
