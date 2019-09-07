import {strToDate, render, Position} from '../utils';

import {EventEdit} from '../components/event-edit';
import {EventItem} from '../components/event-item';

import {arrEventTypes} from '../data/event-types';
import {arrPlaces} from '../data/places';
import {getEventEmpty} from '../data/event';

export class PointController {
  constructor(container, data, onDataChange, onChangeView) {
    this._container = container;
    if (data) {
      this._data = data;
      this.isNew = false;
    } else {
      this._data = getEventEmpty();
      this.isNew = true;
    }

    this._pointEdit = new EventEdit(this._data);
    this._pointView = new EventItem(this._data);

    this._onChangeView = onChangeView;
    this._onDataChange = onDataChange;

    this._init();
  }

  _init() {
    render(this._container, this._pointView.element, this.isNew ? Position.afterBegin : undefined);

    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        document.removeEventListener(`keydown`, onEscKeyDown);
        this._container.replaceChild(this._pointView.element, this._pointEdit.element);
      }
    };

    this._pointView.element.querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, (evt) => {
        evt.preventDefault();
        this._onChangeView();
        document.addEventListener(`keydown`, onEscKeyDown);
        this._container.replaceChild(this._pointEdit.element, this._pointView.element);
      });

    this._pointEdit.element.querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, () => {
        document.removeEventListener(`keydown`, onEscKeyDown);
        this._container.replaceChild(this._pointView.element, this._pointEdit.element);
      });


    this._pointEdit.element
      .addEventListener(`submit`, (evt) => {
        evt.preventDefault();

        const formData = new FormData(this._pointEdit.element.querySelector(`.event--edit`));

        const entry = {
          type: arrEventTypes.find((it) => it.name === formData.get(`event-type`)),
          place: arrPlaces.find((it) => it.name === formData.get(`event-destination`)),
          description: this._pointEdit._description,
          dateBegin: strToDate(formData.get(`event-start-time`)).getTime(),
          duration: strToDate(formData.get(`event-end-time`)).getTime() - strToDate(formData.get(`event-start-time`)).getTime(),
          price: formData.get(`event-price`),
          favorite: formData.get(`event-favorite`) === `on` ? true : false,
          offers: formData.getAll(`event-offer`)
            .reduce((prev, dataItem) => {
              const offerItem = prev.find((item) => item.id === dataItem);
              if (offerItem) {
                offerItem.selected = true;
              }
              return prev;
            }, this._data.offers.map((it) => {
              it.selected = false;
              return it;
            })),
          photos: this._pointEdit._photos,
        };

        this._onDataChange(this.isNew ? null : this._data, entry);

        document.removeEventListener(`keydown`, onEscKeyDown);
        this._container.replaceChild(this._pointView.element, this._pointEdit.element);
      });

    // delete event
    this._pointEdit.element
      .addEventListener(`reset`, () => {
        document.removeEventListener(`keydown`, onEscKeyDown);
        this._pointView.removeElement();
        this._pointEdit.removeElement();
        this._onDataChange(this._data, null);
      });

    this._pointEdit.element.querySelectorAll(`input`).forEach((elem) => {
      elem.addEventListener(`focus`, () => {
        document.removeEventListener(`keydown`, onEscKeyDown);
      });

      elem.addEventListener(`blur`, () => {
        document.addEventListener(`keydown`, onEscKeyDown);
      });
    });
  }

  setDefaultView() {
    if (this._container.contains(this._pointEdit.element)) {
      this._container.replaceChild(this._pointView.element, this._pointEdit.element);
    }
  }
}
