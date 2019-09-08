import {render, Position, uniqueDays, SortTypes, FilterValues} from '../utils';

import {Trip} from '../components/trip';
import {TripDay} from '../components/trip-day';
import {NoPoints} from '../components/no-points';

import {PointController} from './PointController';

const SHOW_NO_DAY = -1;

class Observer {
  constructor() {
    this._subscriptions = [];
  }

  subscribe(event, func) {
    this._subscriptions.push(
        {event, func}
    );
  }

  emit(event) {
    this._subscriptions
      .filter((item) => item.event === event)
      .forEach((item) => {
        item.func();
      });
  }
}

export class TripController {
  constructor(container, events) {
    this._container = container;
    this._events = events;
    this._eventsFiltered = this._events;

    this._subscribtions = [];
    this._onChangeView = this._onChangeView.bind(this);
    this._onDataChange = this._onDataChange.bind(this);

    this.filtering = new Observer();
    this.filtering.subscribe(FilterValues.everything, this._filterEventsF(FilterValues.everything, this));
    this.filtering.subscribe(FilterValues.future, this._filterEventsF(FilterValues.future, this));
    this.filtering.subscribe(FilterValues.past, this._filterEventsF(FilterValues.past, this));
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
    this._sortBy = SortTypes.event;
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
    let showNoDay = 0;
    if (days.length === 1 && days[0] === SHOW_NO_DAY) {
      showNoDay = SHOW_NO_DAY;
      render(this.elemTripDays, (new TripDay()).element);
    } else {
      // day info
      const i = days.slice(0).sort((dayA, dayB) => dayA > dayB ? 1 : -1).indexOf(day);
      render(this.elemTripDays, (new TripDay(day, i + 1)).element);
    }

    const eventList = this.lastDayEventListElem;

    // events
    this._eventsFiltered
      // get events for current day
      .filter((eventsItem) => showNoDay === SHOW_NO_DAY || eventsItem.dayIndex === dayIndex)
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
      case SortTypes.time:
        this._eventsFiltered.sort((eventA, eventB) => eventA.duration < eventB.duration ? 1 : -1);
        break;
      case SortTypes.price:
        this._eventsFiltered.sort((eventA, eventB) => eventA.price < eventB.price ? 1 : -1);
        break;
      default:
        this._eventsFiltered.sort((eventA, eventB) => eventA.dateBegin > eventB.dateBegin ? 1 : -1);
        break;
    }

    this.elemTripDays.innerHTML = ``;

    // array of trip days
    let arrTripDays = [];
    if (this._sortBy !== SortTypes.event) {
      arrTripDays.push(SHOW_NO_DAY);
    } else {
      arrTripDays = uniqueDays(this._eventsFiltered);
    }

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
    } else if (newData && !oldData) {
      // add event item
      this._events.push(newData);
    }

    this.renderAllEvents();

    // re-render header
    this._trip.removeElement();
    render(this.elemTripMain, this._trip.element, Position.afterBegin);
  }

  _filterEventsF(filterType, self) {
    // const filterType = filterType;
    return function () {
      self._filterEvents(filterType);
    };
  }

  _filterEvents(filterType) {
    switch (filterType) {
      case FilterValues.everything:
        this._eventsFiltered = this._events;
        break;

      case FilterValues.future:
        this._eventsFiltered = this._events.slice(0).filter((event) => event.dateBegin > Date.now());
        break;

      case FilterValues.past:
        this._eventsFiltered = this._events.slice(0).filter((event) => event.dateBegin <= Date.now());
        break;
    }

    this.renderAllEvents();
  }
}
