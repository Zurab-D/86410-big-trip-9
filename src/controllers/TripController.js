import {render, unrender, Position, uniqueDays, SortTypes} from '../utils';

import {Trip} from '../components/trip';
import {TripDay} from '../components/trip-day';
import {NoPoints} from '../components/no-points';

import {PointController} from './PointController';

export class TripController {
  constructor(container, events) {
    this._container = container;
    this._events = events;

    this._subscribtions = [];
    this._onChangeView = this._onChangeView.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
  }

  subscribe(event, func) {
    this._subscribtions.push(
        {event, func}
    );
  }

  emit(event) {
    this._subscribtions
      .filter((subscr) => subscr.event === event)
      .forEach((subscr) => {
        subscr.func();
      });
  }

  // method: init
  init() {
    this._sortBy = SortTypes.time;
    this.elemTripMain = this._container.querySelector(`.trip-main`);
    this.elemTripControls = this.elemTripMain.querySelector(`.trip-controls`);
    this.elemPageMain = this._container.querySelector(`.page-main`);
    this.elemTripEvents = this.elemPageMain.querySelector(`.trip-events`);
    this.elemTripDays = this.elemTripEvents.querySelector(`.trip-days`);

    // trip
    this._trip = new Trip(this._events);
    render(this.elemTripMain, this._trip.element, Position.afterBegin);

    // events for sort elements
    this._container.querySelectorAll(`div.trip-sort__item>input`).forEach((itemSort) => {
      itemSort.addEventListener(`click`, () => {
        this._sortBy = itemSort.dataset.sort;

        this.renderAllEvents();
      });
    });

    // run
    this.renderAllEvents();
  }

  // get first day's event list element
  get firstDayEventListElem() {
    const daysEl = this.elemTripDays.querySelectorAll(`.day`);
    return daysEl[0].querySelector(`.trip-events__list`);
  }

  // get last day's event list element
  get lastDayEventListElem() {
    const daysEl = this.elemTripDays.querySelectorAll(`.day`);
    return daysEl[daysEl.length - 1].querySelector(`.trip-events__list`);
  }

  // method: render event day with events
  renderTripDay(day, dayIndex, days) {
    const i = days.slice(0).sort((dayA, dayB) => dayA > dayB ? 1 : -1).indexOf(day);
    // day info
    render(this.elemTripDays, (new TripDay(day, i + 1)).element);

    const eventList = this.lastDayEventListElem;

    // events
    this._events
      // get events for current day
      .filter((eventsItem) => eventsItem.dayIndex === dayIndex)
      .forEach((event) => {
        const pointController = new PointController(eventList, event, this._onDataChange, this._onChangeView);
        this.subscribe(`view`, pointController.setDefaultView.bind(pointController));
      });
  }

  // method: rendfer all events
  createTripEvent() {
    const pointController = new PointController(this.firstDayEventListElem, null, this._onDataChange, this._onChangeView);
    pointController._pointView.element.querySelector(`.event__rollup-btn`).click();
  }

  // method: rendfer all events
  renderAllEvents() {
    // sort items
    switch (this._sortBy) {
      case SortTypes.event:
        this._events.sort((eventA, eventB) => eventA.type.name > eventB.type.name ? 1 : -1);
        break;
      case SortTypes.price:
        this._events.sort((eventA, eventB) => eventA.price > eventB.price ? 1 : -1);
        break;
      default:
        this._events.sort((eventA, eventB) => eventA.dateBegin > eventB.dateBegin ? 1 : -1);
        break;
    }

    this.elemTripDays.innerHTML = ``;

    // array of trip days
    const arrTripDays = uniqueDays(this._events);

    // render all days
    if (arrTripDays.length) {
      arrTripDays.forEach(this.renderTripDay.bind(this));
    } else {
      // no event found
      render(this.elemTripEvents, (new NoPoints()).element);
    }
  }

  // method: hide
  hide() {
    this.elemTripEvents.classList.add(`visually-hidden`);
  }

  // method: show
  show() {
    this.elemTripEvents.classList.remove(`visually-hidden`);
  }

  // method: emit event "view"
  _onChangeView() {
    this.emit(`view`);
  }

  // method:
  _onDataChange(oldData, newData) {
    if (newData && oldData) {
      Object.assign(this._events[this._events.findIndex((event) => event === oldData)], newData);
    } else if (!newData && oldData) {
      // delete event item
      this._events.splice(this._events.indexOf(oldData), 1);
    } else {
      // add event item
      this._events.push(newData);
    }
    this.renderAllEvents();

    // re-render header
    unrender(this._trip.element);
    this._trip.removeElement();
    render(this.elemTripMain, this._trip.element, Position.afterBegin);
  }
}
