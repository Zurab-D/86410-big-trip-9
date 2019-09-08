import {unrender} from '../utils';

export class AbstractComponent {
  constructor() {
    this._element = null;

    if (new.target === AbstractComponent) {
      throw new Error(`Can't instantiate AbstractComponent, only concrete one.`);
    }
  }

  createElement() {
    const newElement = document.createElement(`div`);
    newElement.innerHTML = this.template;
    return newElement.firstChild;
  }

  get element() {
    if (!this._element) {
      this._element = this.createElement();
    }

    return this._element;
  }

  hide() {
    this._element.classList.add(`visually-hidden`);
  }

  show() {
    this._element.classList.remove(`visually-hidden`);
  }

  removeElement() {
    unrender(this.element);
    this._element = null;
  }

  get template() {
    throw new Error(`Abstract getter not implemented: template`);
  }
}
