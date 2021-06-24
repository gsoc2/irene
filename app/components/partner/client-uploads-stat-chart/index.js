import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { bb } from 'billboard.js/dist/billboard.min.js';
import { action } from '@ember/object';
import { task } from 'ember-concurrency';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import weekday from 'dayjs/plugin/weekday';
import { inject as service } from '@ember/service';

import moment from 'moment';

export default class PartnerClientUploadsStatChartComponent extends Component {
  // Dependencies
  @service store;
  @service organization;
  @service ajax;
  @service me;
  @service('notifications') notify;
  @service intl;
  @service partner;

  constructor() {
    super(...arguments);
    dayjs.extend(advancedFormat);
    dayjs.extend(weekOfYear);
    dayjs.extend(weekday);
  }

  // Properties
  @tracked isHideLegend = true;

  @tracked chartData = [];

  @tracked isRedrawChart = false;

  @tracked timelinePlaceholders = [
    {
      key: this.intl.t('day'),
      axisKey: 'date',
      format: 'DD/MMM',
      tooltipFormat(d) {
        return new dayjs(d).format('DD-MM-YYYY');
      },
    },
    {
      key: this.intl.t('week'),
      axisKey: 'week',
      format: 'wo',
      tooltipFormat(d) {
        return `${dayjs(d).format('DD-MM-YYYY')} - ${dayjs(d)
          .add(7, 'day')
          .format('DD-MM-YYYY')}`;
      },
    },
    {
      key: this.intl.t('month'),
      axisKey: 'month',
      format: 'MMM/YY',
      tooltipFormat(d) {
        return new dayjs(d).format('MMM/YYYY');
      },
    },
  ];

  @tracked currentTimeline = this.timelinePlaceholders.objectAt(0);

  @tracked chartContainer = null;

  @tracked dateRange = [moment().subtract(1, 'months'), moment()];

  maxDate = dayjs(Date.now());

  get startDate() {
    return this.dateRange.objectAt(0);
  }
  get endDate() {
    return this.dateRange.objectAt(1);
  }

  get targetModel() {
    return this.args.targetModel;
  }

  get queryParams() {
    return { id: this.args.id };
  }

  @action
  onChangeTimeline(option) {
    if (this.currentTimeline !== option.key) {
      this.currentTimeline = option;
      this.isRedrawChart = true;
      this.loadChart.perform();
    }
  }
  @action
  updateDateRange(dateRange) {
    this.dateRange = dateRange;
    this.isRedrawChart = true;
    this.loadChart.perform();
  }

  /**
   * @function loadChart
   * Method to load chart data and inject chart into the DOM
   */
  @task(function* (element) {
    if (this.targetModel) {
      const filter = {
        start_timestamp: dayjs(this.startDate).toISOString(),
        end_timestamp: dayjs(this.endDate).toISOString(),
        ...this.queryParams,
      };
      const rawChartData = yield this.store.queryRecord(
        this.targetModel,
        filter
      );
      yield this.parseChartData(rawChartData.uploadTimeline);
      if (!this.isRedrawChart) {
        yield this.drawChart(element);
      } else {
        yield this.redrawChart();
      }
    }
  })
  loadChart;

  async redrawChart() {
    await this.chartContainer.axis.labels({
      x: this.currentTimeline.key.toUpperCase(),
    });
    await this.chartContainer.load({
      columns: this.chartData,
    });
    return;
  }

  async parseChartData(rawData) {
    const dataPoints = await this.generateTimeseriesData(
      rawData,
      this.currentTimeline.key
    );
    this.chartData = [dataPoints.x, dataPoints.y];
    return;
  }

  async generateTimeseriesData(rawData = [], groupBy = 'day') {
    const x = ['x'];
    const y = ['y'];
    let curPointDate = dayjs(this.startDate);
    while (dayjs(curPointDate).isBefore(this.endDate)) {
      const curpointFormattedDate = curPointDate.format('YYYY-MM-DD');
      // Find all data points which fall under given group
      const dataPoints = rawData.filter(
        (data) =>
          dayjs(data.created_on).startOf(groupBy).format('YYYY-MM-DD') ==
          curpointFormattedDate
      );
      // Insert/Update by date
      if (dataPoints.length) {
        dataPoints.map((dataPoint) => {
          let indexOfPoint = x.indexOf(curpointFormattedDate);
          if (indexOfPoint == -1) {
            x.push(curpointFormattedDate);
            indexOfPoint = x.length - 1;
          }
          if (y[indexOfPoint]) {
            y[indexOfPoint] = y[indexOfPoint] + dataPoint.upload_count;
          } else {
            y[indexOfPoint] = dataPoint.upload_count;
          }
        });
      } else {
        //Default data points {date, count}
        x.push(curpointFormattedDate);
        y.push(0);
      }
      curPointDate = dayjs(curPointDate).add(1, groupBy).startOf(groupBy);
    }
    return {
      x,
      y,
    };
  }

  async drawChart(element) {
    const component = this;
    component.chartContainer = await bb.generate({
      data: {
        x: 'x',
        columns: this.chartData,
        type: 'area', // for ESM specify as: bar()
      },
      grid: {
        focus: {
          show: false,
        },
      },
      axis: {
        x: {
          padding: {
            right: 1000 * 60 * 60 * 12,
          },
          type: 'timeseries',
          tick: {
            format: function (val) {
              return new dayjs(val).format(component.currentTimeline.format);
            },
          },
          label: {
            text: `${component.currentTimeline.key.toUpperCase()}`,
            position: 'outer-center',
          },
        },
        y: {
          default: [0, 5],
          tick: {
            stepSize: 1,
          },
          label: {
            text: this.intl.t('uploadCount'),
            position: 'outer-middle',
          },
        },
      },
      legend: {
        show: false,
      },
      tooltip: {
        contents: function (d) {
          return component.tooltipTemplate(component, d[0].x, d[0].value); // formatted html as you want
        },
      },
      transition: {
        duration: 500,
      },
      bindto: element,
    });
    component.isRedrawChart = false;
    return;
  }

  /**
   * Method to get custom tooltip body
   * @param {Object} component
   * @param {Date} x
   * @param {Number} y
   */
  tooltipTemplate(component = this, x, y) {
    return `${component.currentTimeline.key.toUpperCase()}:
            ${component.currentTimeline.tooltipFormat(x)} <br>
            Uploads: ${y}`;
  }
}
