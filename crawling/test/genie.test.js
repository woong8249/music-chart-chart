import {
  describe,
  expect, it,
} from 'vitest';

import {
  fetchAdditionalInformationOfTrack, fetchArtistInfo, fetchChart, fetchChartsForDateRangeInParallel, fetchRealTimeChart,
} from '../src/platforms/domestic/genie.js';
import { extractYearMonthDay } from '../src/util/time.js';

import { getRandomDateRange, moveToNearestFutureDay } from './util.js';

// Genie's weekly chart has been based on Mondays since March 25, 2012, up to the present.
describe('The fetchChart func Test', () => {
  it('The Genie daily chart is available starting from March 28, 2012.So fetchChart(\'2012\', \'03\', \'28\', \'d\') is going to throw Error.', () => {
    expect(() => fetchChart('2012', '03', '27', 'd')).rejects.toThrowError('The Genie daily chart is available starting from March 28, 2012.');
    expect.assertions(1);
  });

  it('The Genie daily chart is available starting from March 28. We will test using a randomly selected day after this date.', async () => {
    const minDate = new Date('2012-08-13');
    const today = new Date();
    const { startDate: _startDate } = getRandomDateRange(minDate, today, 1);
    const testTarget = moveToNearestFutureDay(_startDate, 1);
    const { year, month, day } = extractYearMonthDay(testTarget);
    const { chartDetails, chartScope } = await fetchChart(year, month, day, 'd');
    const { chartType } = chartScope;
    expect(chartType).toBe('d');
    expect(chartDetails[0]).toHaveProperty('rank');
    expect(chartDetails[0]).toHaveProperty('artists');
    expect(chartDetails[0]).toHaveProperty('title');
    expect.assertions(4);
  });

  it('The Genie weekly chart is available starting from March 25, 2012.So fetchChart(\'2012\', \'03\', \'24\', \'w\') is going to throw Error.', () => {
    expect(() => fetchChart('2012', '03', '24', 'w')).rejects.toThrowError('The Genie weekly chart is available starting from March 25, 2012.');
    expect.assertions(1);
  });

  it('The Genie weekly chart has been based on Mondays since March 25, 2012. We will test using a randomly selected day after this date.', async () => {
    const minDate = new Date('2012-03-25');
    const today = new Date();
    const { startDate: _startDate } = getRandomDateRange(minDate, today, 1);
    const testTarget = moveToNearestFutureDay(_startDate, 1);
    const { year, month, day } = extractYearMonthDay(testTarget);
    const { chartDetails, chartScope } = await fetchChart(year, month, day, 'w');
    const { chartType, weekOfMonth } = chartScope;
    expect(chartType).toBe('w');
    expect(weekOfMonth).toHaveProperty('week');
    expect(weekOfMonth).toHaveProperty('month');
    expect(weekOfMonth).toHaveProperty('year');
    expect(chartDetails[0]).toHaveProperty('rank');
    expect(chartDetails[0]).toHaveProperty('artists');
    expect(chartDetails[0]).toHaveProperty('title');
    expect.assertions(7);
  });

  it('The Genie monthly chart is available starting from February 1, 2012.So fetchChart(\'2012\', \'01\', \'15\', \'m\') is going to throw Error.', () => {
    expect(() => fetchChart('2012', '01', '15', 'm')).rejects.toThrowError('The Genie monthly chart is available starting from February 1, 2012.');
    expect.assertions(1);
  });

  it('The Genie monthly chart has been available since February 1, 2012. We will test using a randomly selected first day of month after this date.', async () => {
    const minDate = new Date('2012-01-01');
    const today = new Date();
    const { startDate: _startDate } = getRandomDateRange(minDate, today, 1);
    const testTarget = new Date(_startDate.setDate(1));
    const { year, month, day } = extractYearMonthDay(testTarget);
    const { chartDetails, chartScope } = await fetchChart(year, month, day, 'm');
    const { chartType } = chartScope;
    expect(chartType).toBe('m');
    expect(chartDetails[0]).toHaveProperty('rank');
    expect(chartDetails[0]).toHaveProperty('artists');
    expect(chartDetails[0]).toHaveProperty('title');
    expect.assertions(4);
  });
});

describe('fetchChartsForDateRangeInParallel', () => {
  it('It can obtain monthly charts for a specific period.', async () => {
    const result = await fetchChartsForDateRangeInParallel(new Date('2024-02-01'), new Date('2024-03-01'), 'm');
    const { chartScope: chartScope2M } = result.find(item => item.chartScope.date.getDate() === new Date('2024-02-01').getDate());
    const { chartScope: chartScope3M } = result.find(item => item.chartScope.date.getDate() === new Date('2024-03-01').getDate());
    expect(result.length).toBe(2);
    expect(chartScope2M.date.getTime() === new Date('2024-02-01').getDate());
    expect(chartScope3M.date.getTime() === new Date('2024-03-01').getDate());
    expect.assertions(3);
  });

  it('It can obtain weekly charts for a specific period.', async () => {
    const result = await fetchChartsForDateRangeInParallel(new Date('2024-02-05'), new Date('2024-02-16'), 'w');
    const { chartScope: chartScope2M2W } = result.find(item => item.chartScope.startDate.getDate() === new Date('2024-02-05').getDate());
    const { chartScope: chartScope2M3W } = result.find(item => item.chartScope.startDate.getDate() === new Date('2024-02-12').getDate());
    expect(result.length).toBe(2);
    expect(chartScope2M2W.startDate.getTime() === new Date('2024-02-05').getDate());
    expect(chartScope2M3W.startDate.getTime() === new Date('2024-02-12').getDate());
    expect.assertions(3);
  });

  it('It can obtain daily charts for a specific period.', async () => {
    const result = await fetchChartsForDateRangeInParallel(new Date('2024-02-21'), new Date('2024-03-01'), 'd');
    const { chartScope: chartScope2M } = result.find(item => item.chartScope.date.getDate() === new Date('2024-02-01').getDate());
    const { chartScope: chartScope3M } = result.find(item => item.chartScope.date.getDate() === new Date('2024-03-01').getDate());
    expect(result.length).toBe(10);
    expect(chartScope2M.date.getTime() === new Date('2024-02-21').getDate());
    expect(chartScope3M.date.getTime() === new Date('2024-03-01').getDate());
    expect.assertions(3);
  });
});

describe('func fetchAdditionalInformationOfTrack', () => {
  it('This function can fetch the releaseDate,trackImage and lyrics.', async () => {
    const { releaseDate, trackImage, lyrics } = await fetchAdditionalInformationOfTrack(103151984, 84181610);
    const urlPattern = /^https?:\/\/[\w-]+(\.[\w-]+)+\/[\w-\\/]+\.JPG(\/[\w-]+\/[\w-]+\/[\w-]+,[\w-]+)?$/;
    const isURL = urlPattern.test(trackImage);
    expect(releaseDate.getTime()).toBe(new Date('2023-08-21').getTime());
    expect(isURL).toBe(true);
    expect(lyrics.length > 100).toBe(true);
    expect.assertions(3);
  });
});

describe('Test fetchRealTimeChart', () => {
  it('check properties', async () => {
    const randomIndex = Math.floor(Math.random() * 100);
    const result = await fetchRealTimeChart();
    const target = result[randomIndex];
    expect(target);
    expect(target).toHaveProperty('rank');
    expect(target).toHaveProperty('artists');
    expect(target).toHaveProperty('title');
    expect(target).toHaveProperty('titleKeyword');
    expect(target).toHaveProperty('thumbnail');
  });
});

describe('Test ArtistInfo function', () => {
  it('ArtistInfo function', async () => {
    const result = await fetchArtistInfo(82007551);
    console.log(result);
    expect(typeof (result.artistImage)).toBe('string');
    expect(typeof (result.debut)).toBe('string');
  });
});

// "genie": {"artistID": "82007551"
