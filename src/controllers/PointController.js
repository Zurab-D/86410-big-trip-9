import {strToDate, render, Position} from '../utils';

import {EventEdit} from '../components/event-edit';
import {EventItem} from '../components/event-item';

import {arrEventTypes} from '../data/event-types';
import {getEventEmpty} from '../data/event';

import {ModelPoint} from '../model-point';

export class PointController {
  constructor(container, data, arrPlaces, onDataChange, onChangeView) {
    this._container = container;
    if (data) {
      this._data = data;
      this.isNew = false;
    } else {
      this._data = getEventEmpty();
      this.isNew = true;
    }

    this._arrPlaces = arrPlaces;
    this._pointEdit = new EventEdit(this._data, this._arrPlaces);
    this._pointView = new EventItem(this._data);

    this._onChangeView = onChangeView;
    this._onDataChange = onDataChange;

    this._onEscKeyDownBinded = this._onEscKeyDown.bind(this);

    this._init();
  }

  _onEscKeyDown(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      document.removeEventListener(`keydown`, this._onEscKeyDownBinded);
      this._container.replaceChild(this._pointView.element, this._pointEdit.element);
    }
  }

  _addRollupEventToView() {
    this._pointView.element.querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, (evt) => {
        evt.preventDefault();
        this._onChangeView();
        document.addEventListener(`keydown`, this._onEscKeyDownBinded);
        this._container.replaceChild(this._pointEdit.element, this._pointView.element);
      });
  }

  _init() {
    render(this._container, this._pointView.element, this.isNew ? Position.afterBegin : undefined);

    this._addRollupEventToView();

    this._pointEdit.element.querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, () => {
        document.removeEventListener(`keydown`, this._onEscKeyDownBinded);
        this._container.replaceChild(this._pointView.element, this._pointEdit.element);
      });

    this._pointEdit.element
      .addEventListener(`submit`, (evt) => {
        evt.preventDefault();
        const self = this;

        // remove red outline from the edit form
        this._pointEdit.outlineForm(false);

        const formData = new FormData(this._pointEdit.element.querySelector(`.event--edit`));

        const entry = {
          id: this._data.id,
          type: arrEventTypes.find((it) => it.name === formData.get(`event-type`)),
          place: this._arrPlaces.find((it) => it.name === formData.get(`event-destination`)),
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
          photos: this._data.photos,
        };

        this._pointEdit.lockForm();

        // insert or edit event
        this._onDataChange(this.isNew ? null : this._data, (new ModelPoint(ModelPoint.toRAW(entry))),
            () => {
              self.setDefaultView(true);
            },
            () => {
              // add red outline to the editing form
              self._pointEdit.outlineForm();
              self._pointEdit.unlockForm();
            }
        );

        document.removeEventListener(`keydown`, this._onEscKeyDownBinded);
      });

    // delete event
    this._pointEdit.element
      .addEventListener(`reset`, (evt) => {
        evt.preventDefault();
        const self = this;

        // remove red outline from the edit form
        this._pointEdit.outlineForm(false);

        document.removeEventListener(`keydown`, this._onEscKeyDownBinded);
        this._onDataChange(this._data, null, () => {
          self._pointView.removeElement();
          self._pointEdit.removeElement();
        }, () => {
          // add red outline to the editing form
          self._pointEdit.outlineForm();
          self._pointEdit.unlockForm();
        });
      });

    this._pointEdit.element.querySelectorAll(`input`).forEach((elem) => {
      elem.addEventListener(`focus`, () => {
        document.removeEventListener(`keydown`, this._onEscKeyDownBinded);
      });

      elem.addEventListener(`blur`, () => {
        document.addEventListener(`keydown`, this._onEscKeyDownBinded);
      });
    });
  }

  setDefaultView(refresh) {
    if (this._container.contains(this._pointEdit.element)) {
      if (refresh) {
        this._pointView.refresh(this._data);
        this._addRollupEventToView();
      }
      this._pointEdit.unlockForm();
      this._container.replaceChild(this._pointView.element, this._pointEdit.element);
    }
  }
}
