// utils
import {render, unrender, Position, uniqueDays, SortTypes} from './utils';

// import components
import {Trip} from './components/trip';
import {Menu} from './components/menu';
import {Filter} from './components/filter';
import {Sort} from './components/sort';
import {TripDay} from './components/trip-day';
import {EventEdit} from './components/event-edit';
import {EventItem} from './components/event-item';
import {NoPoints} from './components/no-points';

import {PointController} from './PointController';

export class TripController {
  constructor(container, events) {
    this._container = container;
    this._events = events;

    this._subscriptions = [];
		this._onChangeView = this._onChangeView.bind(this);
		this._onDataChange = this._onDataChange.bind(this);

    this.init();
  }

  // method: init
  init() {
    this.elemTripMain = this._container.querySelector(`.trip-main`);
    this.elemTripInfo = this.elemTripMain.querySelector(`.trip-info`);
    this.elemTripControls = this.elemTripMain.querySelector(`.trip-controls`);
    this.elemTripControlsH = this.elemTripControls.querySelector(`h2.visually-hidden`);
    this.elemPageMain = this._container.querySelector(`.page-main`);
    this.elemTripEvents = this.elemPageMain.querySelector(`.trip-events`);
    this.tripDays = this.elemTripEvents.querySelector(`.trip-days`);

    // trip
    render(this.elemTripMain, (new Trip(this._events)).element, Position.afterBegin);

    // menu
    render(this.elemTripControlsH, (new Menu()).element, Position.afterEnd);

    // filters
    render(this.elemTripControls, (new Filter()).element);

    // sort
    render(this.tripDays, (new Sort()).element, Position.beforeBegin);

    // events for sort elements
    this._container.querySelectorAll(`div.trip-sort__item>input`).forEach((itemSort) => {
      itemSort.addEventListener(`click`, () => {
        switch (itemSort.dataset.sort) {
          case SortTypes.event:
            this._events.sort((eventA, eventB) => eventA.type.name > eventB.type.name ? 1 : -1);
            break;
          case SortTypes.time:
            this._events.sort((eventA, eventB) => eventA.dateBegin > eventB.dateBegin ? 1 : -1);
            break;
          case SortTypes.price:
            this._events.sort((eventA, eventB) => eventA.price > eventB.price ? 1 : -1);
            break;
        }

        this.renderAllEvents();
      });
    });

    // run
    this.renderAllEvents();
  }

  // method: render eventA day with events
  renderTripDay(day, dayIndex, days) {
    const i = days.slice(0).sort((dayA, dayB) => dayA > dayB ? 1 : -1).indexOf(day);
    // day info
    render(this.tripDays, (new TripDay(day, i + 1)).element);

    const daysEl = this.tripDays.querySelectorAll(`.day`);
    const dayElem = daysEl[daysEl.length - 1];
    const eventList = dayElem.querySelector(`.trip-events__list`);

    // events
    this._events
      // get events for current day
      .filter((eventsItem) => eventsItem.dayIndex === dayIndex)
      .forEach((event) => {
        const pointController = new PointController(eventList, event, this._onDataChange, this._onChangeView);
        this._subscriptions.push(pointController.setDefaultView.bind(pointController));
      });
  }

  // method: rendfer all events
  renderAllEvents() {
    this.tripDays.innerHTML = ``;

    // array of trip days
    const arrTripDays = uniqueDays(this._events);

    // render all days
    if (arrTripDays.length) {
      arrTripDays.forEach( this.renderTripDay.bind(this) );
    } else {
      // no event found
      render(this.elemTripEvents, (new NoPoints()).element);
    }
  }

	_onChangeView() {
		this._subscriptions.forEach((item) => item());
	}

  _onDataChange(newData, oldData) {
		this._events[this._events.findIndex((item) => item === oldData)] = newData;
    //this._renderBoard(this._events);
    this.renderAllEvents();
	}
}
