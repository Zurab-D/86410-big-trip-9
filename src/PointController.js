import {strToDate, render} from './utils';

import {EventEdit} from './components/event-edit';
import {EventItem} from './components/event-item';

import {arrEventTypes} from './data/event-types';
import {arrPlaces} from './data/places';

export class PointController {
  constructor(container, data, onDataChange, onChangeView) {
    this._container = container;
		this._data = data;
    this._pointEdit = new EventEdit(data);
    this._pointView = new EventItem(data);

		this._onChangeView = onChangeView;
		this._onDataChange = onDataChange;

    this._init();
  }

  _init() {
    render(this._container, this._pointView.element);

    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        document.removeEventListener(`keydown`, onEscKeyDown);
        this._container.replaceChild(this._pointView.element, this._pointEdit.element);
      }
    };

    this._pointView.element.querySelector(`.event__rollup-btn`).
      addEventListener(`click`, (evt) => {
        evt.preventDefault();
        this._onChangeView();
        document.addEventListener(`keydown`, onEscKeyDown);
        this._container.replaceChild(this._pointEdit.element, this._pointView.element);
      });

    this._pointEdit.element.
      addEventListener(`submit`, (evt) => {
        evt.preventDefault();

        const formData = new FormData(this._pointEdit.element.querySelector(`.event--edit`));

        const offersObj = this._data.offers.reduce((result, offer) => {
          result[offer.id] = false;
          return result;
        }, {});

        const entry = {
          type: arrEventTypes.find((it) => it.name === formData.get(`event-type`)),
          place: arrPlaces.find((it) => it.name === formData.get(`event-destination`)),
          dateBegin: strToDate(formData.get(`event-start-time`)).getTime(),
          duration: strToDate(formData.get(`event-end-time`)).getTime() - strToDate(formData.get(`event-start-time`)).getTime(),
          price: formData.get(`event-price`),
          favorite: formData.get(`event-favorite`) === `checked` ? true : false,
          offers: formData.getAll(`event-offer`)
            .reduce((prev, dataItem) => {
              const offerItem = prev.find((item) => item.id === dataItem);

              offerItem.selected = true;
              return prev;
            }, this._data.offers.map((it) => {
              it.selected = false; return it
            })),
        };

        this._onDataChange(entry, this._data);

        document.removeEventListener(`keydown`, onEscKeyDown);
        this._container.replaceChild(this._pointView.element, this._pointEdit.element);
      });

    this._pointEdit.element.querySelector(`.event__rollup-btn`).
      addEventListener(`click`, () => {
        document.removeEventListener(`keydown`, onEscKeyDown);
        this._container.replaceChild(this._pointView.element, this._pointEdit.element);
      });

    /* this._pointEdit.element.
      addEventListener(`reset`, () => {
        document.removeEventListener(`keydown`, onEscKeyDown);

        unrender(this._pointView.element);
        this._pointView.removeElement();

        unrender(this._pointEdit.element);
        this._pointEdit.removeElement();

        // remove event from events array
        // this._events.splice(this._events.indexOf(event), 1);

        // render events
        this.renderAllEvents();
      }); */

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
