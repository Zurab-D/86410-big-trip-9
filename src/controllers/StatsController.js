import {render, Position, getDuration} from '../utils';
import {Chart} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {Statistics} from '../components/statistics';

const EVENT_TYPE_TRANSPORT = `transfer`;
const BAR_THICKNESS = 40;

export class StatController {
  constructor(container, events) {
    this._container = container;
    this._events = events;

    this._stats = new Statistics();
    this._stats.element.classList.add(`visually-hidden`);
  }

  _init() {
    render(this._container, this._stats.element, Position.afterEnd);

    this._ctxMoney = this._stats.element.querySelector(`.statistics__chart--money`);
    this._ctxTransport = this._stats.element.querySelector(`.statistics__chart--transport`);
    this._ctxTime = this._stats.element.querySelector(`.statistics__chart--time`);

    this._moneyArr = this._events.reduce((result, event) => {
      const moneyItem = result.find((it) => it.name === event.type.name);
      if (moneyItem) {
        moneyItem.sum += event.price;
      } else {
        result.push({
          name: event.type.name,
          sum: event.price,
          emoji: event.type.emoji
        });
      }
      return result;
    }, []);

    this._transportArr = this._events.reduce((result, event) => {
      if (event.type.group === EVENT_TYPE_TRANSPORT) {
        const transportItem = result.find((it) => it.name === event.type.name);
        if (transportItem) {
          transportItem.count += 1;
        } else {
          result.push({
            name: event.type.name,
            count: 1,
            emoji: event.type.emoji
          });
        }
      }
      return result;
    }, []);

    this._timeByTypeArr = this._events.reduce((result, event) => {
      const timeItem = result.find((it) => it.name === event.type.name);
      if (timeItem) {
        timeItem.time += event.duration;
      } else {
        result.push({
          name: event.type.name,
          time: event.duration,
          emoji: event.type.emoji
        });
      }
      return result;
    }, []);
  }

  _destroyMoneyChart() {
    if (this._moneyChart) {
      this._moneyChart.destroy();
    }
  }

  _destroyTransportChart() {
    if (this._transportChart) {
      this._transportChart.destroy();
    }
  }

  _destroyTimeChart() {
    if (this._timeChart) {
      this._timeChart.destroy();
    }
  }

  _showMoneyChart() {
    this._ctxMoney.height = this._moneyArr.length * BAR_THICKNESS;

    this._moneyChart = new Chart(this._ctxMoney, {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        labels: [...this._moneyArr.map((item) => item.emoji + ` ` + item.name)],
        datasets: [{
          data: [...this._moneyArr.map((item) => item.sum)],
          backgroundColor: `#ffffff`,
          hoverBackgroundColor: `#ffffff`,
          anchor: `start`
        }]
      },
      options: {
        plugins: {
          datalabels: {
            font: {
              size: 13
            },
            color: `#000000`,
            anchor: `end`,
            align: `start`,
            formatter: (value) => `€ ${value}`
          }
        },
        title: {
          display: true,
          text: `MONEY`,
          fontColor: `#000000`,
          fontSize: 23,
          position: `left`
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              display: true,
              fontColor: `#000000`,
              padding: 5,
              fontSize: 13,
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            minBarLength: 50,
            barThickness: BAR_THICKNESS,
          }],
          xAxes: [{
            ticks: {
              fontStyle: `bold`,
              fontColor: `#000000`,
              display: false,
              beginAtZero: true,
            },
            gridLines: {
              display: false,
              drawBorder: false,
            },
            minBarLength: 50
          }]
        },
        legend: {
          display: false
        },
        layout: {
          padding: {
            top: 10
          }
        },
        tooltips: {
          enabled: false
        }
      }
    });
  }

  _showTransportChart() {
    this._ctxTransport.height = this._transportArr.length * BAR_THICKNESS;

    this._transportChart = new Chart(this._ctxTransport, {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        labels: [...this._transportArr.map((item) => item.emoji + ` ` + item.name)],
        datasets: [{
          data: [...this._transportArr.map((item) => item.count)],
          backgroundColor: `#ffffff`,
          hoverBackgroundColor: `#ffffff`,
          anchor: `start`
        }]
      },
      options: {
        plugins: {
          datalabels: {
            font: {
              size: 13
            },
            color: `#000000`,
            anchor: `end`,
            align: `start`,
            formatter: (value) => `${value}x`
          }
        },
        title: {
          display: true,
          text: `TRANSPORT`,
          fontColor: `#000000`,
          fontSize: 23,
          position: `left`
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              display: true,
              fontColor: `#000000`,
              padding: 5,
              fontSize: 13,
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            barThickness: BAR_THICKNESS,
            minBarLength: 50
          }],
          xAxes: [{
            ticks: {
              fontStyle: `bold`,
              fontColor: `#000000`,
              display: false,
              beginAtZero: true,
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            minBarLength: 50
          }]
        },
        legend: {
          display: false
        },
        layout: {
          padding: {
            top: 10
          }
        },
        tooltips: {
          enabled: false
        }
      }
    });
  }

  _showTimeChart() {
    this._ctxTime.height = this._timeByTypeArr.length * BAR_THICKNESS;

    this._timeChart = new Chart(this._ctxTime, {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        labels: [...this._timeByTypeArr.map((item) => item.emoji + ` ` + item.name)],
        datasets: [{
          data: [...this._timeByTypeArr.map((item) => item.time)],
          backgroundColor: `#ffffff`,
          hoverBackgroundColor: `#ffffff`,
          anchor: `start`
        }]
      },
      options: {
        plugins: {
          datalabels: {
            font: {
              size: 13
            },
            color: `#000000`,
            anchor: `end`,
            align: `start`,
            formatter: (value) => `${getDuration(value)}`
          }
        },
        title: {
          display: true,
          text: `TIME SPENT`,
          fontColor: `#000000`,
          fontSize: 23,
          position: `left`
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              display: true,
              fontColor: `#000000`,
              padding: 5,
              fontSize: 13,
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            barThickness: BAR_THICKNESS,
          }],
          xAxes: [{
            ticks: {
              fontStyle: `bold`,
              fontColor: `#000000`,
              display: false,
              beginAtZero: true,
            },
            gridLines: {
              display: false,
              drawBorder: false,
            },
            minBarLength: 50
          }]
        },
        legend: {
          display: false
        },
        layout: {
          padding: {
            top: 10
          }
        },
        tooltips: {
          enabled: false
        }
      }
    });
  }

  show() {
    this._init();
    this._stats.show();

    this._showMoneyChart();
    this._showTransportChart();
    this._showTimeChart();
  }

  hide() {
    this._stats.hide();
    this._destroyMoneyChart();
    this._destroyTransportChart();
    this._destroyTimeChart();
  }
}
