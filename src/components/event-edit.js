import {AbstractComponent} from './AbstractComponent';
import {formatDate, FLATPICKR_DATE_FORMAT, Observer} from '../utils';
import {arrEventTypes} from '../data/event-types';
import {arrOffers} from '../data/offers';
import {loremIpsum} from '../data/event';

import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/light.css';

const RED_OUTLINE = `3px solid red`;

const SubmitTitle = {
  saving: `Saving...`,
  save: `Save`
};

export class EventEdit extends AbstractComponent {
  constructor({type, place, description, dateBegin, duration, price, offers, photos, favorite}, arrPlaces) {
    super();
    this._type = type;
    this._typeSelected = undefined;
    this._place = place;
    this._description = description;
    this._dateBegin = dateBegin;
    this._duration = duration;
    this._price = price;
    this._offers = offers;
    this._photos = photos.map((photo) => photo.src);
    this._favorite = favorite;

    this._arrPlaces = arrPlaces;

    this.observer = new Observer();

    this.init();
  }

  _subscribe(event, func) {
    this.observer.subscribe(event, func);
  }

  _emit(event) {
    this.observer.emit(event);
  }

  init() {
    this._typeElem = this.element.querySelector(`.event__type-toggle`);
    this._eventOffersEl = this.element.querySelector(`.event__section--offers`);
    this._subscribe(`typeModified`, this.typeModified.bind(this));
    this._subscribe(`placeModified`, this.placeModified.bind(this));

    this._eventFieldDestEl = this.element.querySelector(`.event__field-group--destination`);
    this._eventDestinationEl = this.element.querySelector(`.event__section--destination`);

    // click event type input
    this._typeElem.addEventListener(`click`, (evt) => {
      this._typeSelected = document.querySelector(`form.event.event--edit`).elements[`event-type`].value;

      // if type modified
      if (!evt.target.checked && this._type.name !== this._typeSelected) {
        this._emit(`typeModified`);
      }
    });

    // if destination changed
    this.element.querySelector(`.event__input--destination`).addEventListener(`change`, () => {
      this._emit(`placeModified`);
    });

    // hide type list when item clicked
    this.element.querySelector(`.event__type-list`).addEventListener(`click`, (evt) => {
      if (evt.target.tagName === `INPUT`) {
        // evt.preventDefault();
        this._typeElem.click();
      }
    });

    flatpickr(this.element.querySelectorAll(`.event__input--time`), {
      enableTime: true,
      dateFormat: FLATPICKR_DATE_FORMAT
    });
  }

  typeModified() {
    if (this._typeSelected) {
      this._type = arrEventTypes.find((type) => type.name === this._typeSelected);

      this._offers = arrOffers.slice(0, Math.floor(Math.random() * 3));
      this._place = this._place.name ? this._arrPlaces[Math.floor(Math.random() * this._arrPlaces.length)] : {name: ``, type: ``};

      this._eventOffersEl.innerHTML = this.offersTemplate;
      this._eventFieldDestEl.innerHTML = this.destinationTmpl;

      this.element.querySelector(`.event__input--destination`).addEventListener(`change`, () => {
        this._emit(`placeModified`);
      });
    }
  }

  placeModified() {
    this._description = loremIpsum.split(`.`).map((str) => str.trim()).filter((str) => str !== ``).sort(() => 0.5 - Math.random()).slice(0, Math.random() * 3 + 1).join(`. `);
    this._photos = new Array(22).
      fill().
      map(() => `http://picsum.photos/300/150?r=${Math.random()}`).
      sort(() => 0.5 - Math.random()).
      slice(0, Math.random() * (7 - 2) + 2);
    this._eventDestinationEl.innerHTML = this.destinationDetailsTemplate;
  }

  get destinationDetailsTemplate() {
    return `
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${this._description}</p>
      ${this._photos.length > 0 ? `
        <div class="event__photos-container">
          <div class="event__photos-tape">
          ${this._photos.map((photo) => `
            <img class="event__photo" src="${photo}" alt="Event photo">
          `).join(``)}
          </div>
        </div>` : ``
}`;
  }

  get offersTemplate() {
    return this._offers.length > 0 ? `
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
      ${this._offers.map((offer) => `
        <div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.id}" type="checkbox" name="event-offer" value="${offer.id}" ${offer.selected ? `checked` : ``}>
          <label class="event__offer-label" for="event-offer-${offer.id}">
            <span class="event__offer-title">${offer.name}</span>
            &plus;
            &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
          </label>
        </div>
        `).join(``)}
      </div>` : ``;
  }

  get destinationTmpl() {
    return `<label class="event__label event__type-output" for="event-destination-1">
        ${this._type.actionName}
      </label>
      <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${this._place.name}" list="destination-list-1">
      <datalist id="destination-list-1">
        ${this._arrPlaces.map((placeItem) => `
        <option value="${placeItem.name}"></option>
        `).join(``)}
      </datalist>`;
  }

  _onTypeModified() {
    this._emit(`typeModified`);
  }

  get template() {
    return `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${this._type.icon}" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
          ${arrEventTypes.
            reduce((prev, type) => {
              if (!prev.includes(type.group)) {
                prev.push(type.group);
              }
              return prev;
            }, []).
            map((group) => {
              return `<fieldset class="event__type-group">
                <legend class="visually-hidden">${group}</legend>
                  ${arrEventTypes.
                    filter((type) => type.group === group).
                    map((eventType) => `<div class="event__type-item">
                        <input
                          id="event-type-${eventType.name.toLowerCase()}-1"
                          class="event__type-input visually-hidden"
                          type="radio"
                          name="event-type"
                          value="${eventType.name}"
                          ${this._type.name === eventType.name ? `checked` : ``}
                        >
                        <label class="event__type-label event__type-label--${eventType.name.toLowerCase()}" for="event-type-${eventType.name.toLowerCase()}-1">${eventType.name}</label>
                      </div>`
                    ).join(``)}
              </fieldset>`;
            }).join(``)}
          </div>
        </div>

        <div class="event__field-group event__field-group--destination">
          ${this.destinationTmpl}
        </div>

        <div class="event__field-group event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">
            From
          </label>
          <input class="event__input event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${formatDate(new Date(this._dateBegin))}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">
            To
          </label>
          <input class="event__input event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${formatDate(this._dateBegin + this._duration)}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${this._price}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>

        <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${this._favorite ? `checked` : ``}>
        <label class="event__favorite-btn" for="event-favorite-1">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </label>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>

      <section class="event__details">
        <section class="event__section event__section--offers">
          ${this.offersTemplate}
        </section>
        <section class="event__section event__section--destination">
          ${this.destinationDetailsTemplate}
        </section>
      </section>
    </form></li>`;
  }

  lockForm() {
    this._element.querySelectorAll(`.event--edit input, .event--edit  button`).forEach((elem) => {
      elem.setAttribute(`disabled`, `disabled`);
    });
    this._element.querySelector(`.event--edit .event__save-btn`).innerText = SubmitTitle.saving;
  }

  unlockForm() {
    this._element.querySelectorAll(`.event--edit input, .event--edit  button`).forEach((elem) => {
      elem.removeAttribute(`disabled`);
    });
    this._element.querySelector(`.event--edit .event__save-btn`).innerText = SubmitTitle.save;
  }

  outlineForm(setOutline = true) {
    if (setOutline) {
      this.element.querySelector(`.event--edit`).style.outline = RED_OUTLINE;
      this.element.querySelector(`.event--edit`).classList.add(`shake`);
    } else {
      this.element.querySelector(`.event--edit`).style.outline = ``;
      this.element.querySelector(`.event--edit`).classList.remove(`shake`);
    }
  }
}
