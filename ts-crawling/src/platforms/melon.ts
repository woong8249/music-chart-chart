/* eslint-disable max-len */
import * as cheerio from 'cheerio';
import _ from 'lodash';
import {
  addSixDaysToYYYYMMDD, calculateWeekOfMonth,
  createMonthlyFirstDatesBetween, createWeeklyDatesBetween,
  extractYearMonthDay,
} from '../util/time';
import extractKeyword from '../util/regex';
import { getHtml } from '../util/fetch';
import winLogger from '../logger/winston';
import { validateChartDetails } from '../util/typeChecker';
import type {
  ChartDetail, WeeklyChartScope, ChartType, MonthlyChartScope,
} from 'src/types';

export type MelonFetchWeeklyChartResult ={
    platform: 'melon'
    chartScope:WeeklyChartScope
    chartDetails:ChartDetail[]
}

export type MelonFetchMonthlyChartResult ={
  platform: 'melon'
  chartScope:MonthlyChartScope
  chartDetails:ChartDetail[]
}

const ERRORS = {
  CHART_WE: 'The Melon weekly chart has been available since January 3, 2010.',
  CHART_MO: 'The Melon monthly chart has been available since January 1, 2010.',
  MAX_CHUNK: 'max 30',
  CHECK_CHART_TYPE: 'check chartType',
};

const options = {
  method: 'GET',
  headers: {
    Accept: 'text/html,*/*;q=0.8',
    Cookie: 'PCID=17121918065252841818955; PC_PCID=17121918065252841818955; _fwb=242U7bhDvKHCzBdbaLyYjGl.1712191806875; wcs_bt=s_f9c4bde066b:1712191806; __T_=1; POC=MP10; _T_ANO=FczVMLYpX+DwN1lq1jEO0+DZjC1nWqjRRUwlx+zCTW1eQEWKWp7dWs/9MCj03lUJo3IL6Q+HHGK3irQr0GNjYHnqN2K2xxKbVSrJ6TVhHqBV+Ka4j2Nws9pWY+BMv85a1I69LYp8ZABqzh11YA5JkFA+yKM2Yaf6332wJVJvXAKDL4hiThgFf5OcsXvzKgNYvHZZr2O53QpW6Kac3rl2eJVbSoNNs+EnupNzgJOecMmtla1mA70l1Tl+KdfSQ7+ZTFt+VTJjiPBA9FHvhrYMNbO1vxPMdJ+luqKpkeUI/NGTznjJXhzz31pDCYfropNqY4mpBAKLKd4z00519SQeKg==',
  },
};

const minDateWE = new Date('2010-01-03').getTime();
const minDateMO = new Date('2010-01-01').getTime();

type MelonChartType ='WE' | 'MO' |'NO'
function standardizeChartType(chartType : ChartType) {
  if (chartType === 'm') return 'MO';
  if (chartType === 'w') return 'WE';
  throw Error('chart type is able only \'m\'|\'w\'');
}

function validateDateAvailability(year:string, month:string, day:string, chartType :MelonChartType):void {
  const inputDate = new Date(`${year.toString()}-${month}-${day}`).getTime();
  if (chartType === 'WE' && inputDate < minDateWE) throw new Error(ERRORS.CHART_WE);
  if (chartType === 'MO' && inputDate < minDateMO) throw new Error(ERRORS.CHART_MO);
}

function generateDatesForChartType(startDate:Date, endDate:Date, chartType:ChartType) {
  if (chartType === 'm') {
    return createMonthlyFirstDatesBetween(startDate, endDate);
  } if (chartType === 'w') {
    const offset = startDate.getTime() < new Date('2012-08-11').getTime() ? 0 : 1;
    return createWeeklyDatesBetween(startDate, endDate, offset);
  }
  throw new Error('Invalid chart type.');
}

function makeChartDetails(melonHtml:string) :ChartDetail[] {
  const $ = cheerio.load(melonHtml);
  const songSelectors = $('tr.lst50, tr.lst100');
  const chartDetails = songSelectors.map((_i, element) => {
    const rank = $(element).find('span.rank').text().match(/\d+/)?.[0];
    const title = $(element).find('div.ellipsis.rank01 strong').text().trim();
    const artistElements = $(element).find('div.ellipsis.rank02 span.checkEllipsis');
    const artistNames = artistElements.text().trim().split(',');
    const artistIDs = artistElements.find('a').map((_i, el) => {
      const href = $(el).attr('href');
      if (href === undefined) {
        throw new Error('melon href for artistID is undefined.');
      }
      const match = href.match(/goArtistDetail\('(\d+)'\)/)?.[1];
      if (match === undefined) {
        throw new Error('melon href.match for artistID is undefined.');
      }
      return match;
    }).get();
    const artists = artistNames.map((artistName, index) => ({
      artistName: artistName.trim(),
      artistKeyword: extractKeyword(artistName),
      artistID: artistIDs[index],
    }));
    const trackID = $(element).find('input.input_check').val();
    const titleKeyword = extractKeyword(title);
    return {
      rank, title, titleKeyword, artists, trackID,
    };
  }).get();
  validateChartDetails(chartDetails);
  return chartDetails;
}

function isValidDate(dateString:string) {
  // YYYY.MM.DD, YYYY.MM, YYYY 형식 검증
  const fullDatePattern = /^\d{4}\.\d{2}\.\d{2}$/;
  const partialDatePattern = /^\d{4}\.\d{2}$/;
  const yearPattern = /^\d{4}$/;

  return fullDatePattern.test(dateString) || partialDatePattern.test(dateString) || yearPattern.test(dateString);
}

export async function fetchChart(
  year: string,
  month: string,
  day: string,
  chartType: ChartType,
): Promise<MelonFetchWeeklyChartResult | MelonFetchMonthlyChartResult> {
  const validateChartType = standardizeChartType(chartType);
  validateDateAvailability(year, month, day, validateChartType);
  const age = Math.floor(Number(year) / 10) * 10;
  const startDay = `${year}${month}${day}`;
  const endDay = validateChartType === 'WE' ? addSixDaysToYYYYMMDD(startDay) : startDay;

  // chartScope를 조건에 따라 정확한 타입으로 설정
  const chartScope = validateChartType === 'WE'
    ? {
      startDate: new Date(`${year}-${month}-${day}`),
      endDate: new Date(new Date(`${year}-${month}-${day}`).getTime() + 6 * 24 * 60 * 60 * 1000),
      weekOfMonth: calculateWeekOfMonth(
        new Date(`${year}-${month}-${day}`),
        new Date(new Date(`${year}-${month}-${day}`).getTime() + 6 * 24 * 60 * 60 * 1000),
      ),
      chartType,
    }
    : {
      date: new Date(`${year}-${month}-${day}`),
      chartType,
    };

  const url = `https://www.melon.com/chart/search/list.htm?chartType=${validateChartType}&age=${age.toString()}&year=${year}&mon=${month}&day=${startDay}^${endDay}&classCd=DP0000&startDay=${startDay}&endDay=${endDay}&moved=Y`;
  const melonHtml = await getHtml(url, options);
  const chartDetails = makeChartDetails(melonHtml);

  // chartScope 타입에 따라 반환값을 명확하게 구분
  if (validateChartType === 'WE') {
    return {
      chartDetails: chartDetails.filter((item) => item.title),
      chartScope: chartScope as WeeklyChartScope, // 타입 단언
      platform: 'melon',
    };
  }
  return {
    chartDetails: chartDetails.filter((item) => item.title),
    chartScope: chartScope as MonthlyChartScope, // 타입 단언
    platform: 'melon',
  };
}

/**
- The Melon weekly chart has been available since January 3, 2010.
- The Melon monthly chart has been available since January 1, 2010.
 */
export async function fetchChartsForDateRangeInParallel(startDate:Date, endDate:Date, chartType:ChartType, chunkSize = 10) {
  const copiedStartDate = new Date(startDate);
  const copiedEndDate = new Date(endDate);
  if (chunkSize > 31) {
    throw Error('max 30');
  }

  const dates = generateDatesForChartType(copiedStartDate, copiedEndDate, chartType);
  const dateChunks = _.chunk(dates, chunkSize);
  const result = await Promise.all(dateChunks.map(async (chunk) => {
    const chunkResults = await Promise.all(chunk.map((date) => {
      const { year, month, day } = extractYearMonthDay(date);
      return fetchChart(year, month, day, chartType).catch((err: unknown) => {
        winLogger.error({
          err, year, month, day, chartType,
        });
        return [];
      });
    }));
    return chunkResults.flat();
  }));

  return result.flat();
}

export async function fetchAdditionalInformationOfTrack(trackID:string) {
  const url = `https://www.melon.com/song/detail.htm?songId=${trackID}`;
  const html = await getHtml(url);
  const $ = cheerio.load(html);
  // eslint-disable-next-line func-names
  const releaseDateText = $('dt').filter(function () {
    return $(this).text().trim() === '발매일';
  }).next('dd').text()
    .trim();
  const releaseDate = new Date(releaseDateText.split('.').join('-'));
  const trackImage = $('div.thumb img').attr('src');
  const lyrics = $('div.lyric').text();
  if (!(trackImage && lyrics)) {
    winLogger.warn('Fail extract trackImage or lyrics', {
      trackID, lyrics, trackImage, releaseDate,
    });
    throw new Error(`Fail extract trackImage or lyrics  from trackID: ${trackID}`);
  }

  return { releaseDate, trackImage, lyrics };
}

export async function fetchArtistInfo(artistID:string) {
  const url = `https://www.melon.com/artist/timeline.htm?artistId=${artistID}`;
  const html = await getHtml(url);
  const $ = cheerio.load(html);
  const artistImage = $('span#artistImgArea img').attr('src') || null;
  const candi1 = $('span.gubun').text().trim();
  const candi2 = $('dd.debut_song').text().trim();
  const candi3 = $('dd.debut_song span.ellipsis').contents().first().text()
    .trim();

  let debut = null;
  if (isValidDate(candi1)) {
    debut = candi1;
  } else if (isValidDate(candi3)) {
    debut = candi3;
  } else {
    const possibleDate = (candi2.split('\n')[0] as string).trim();
    if (isValidDate(possibleDate)) {
      debut = possibleDate;
    }
  }
  if (!artistImage) {
    winLogger.warn('artistImage', { artistImage });
    throw new Error(`Fail extract artistImage from artistID ${artistID}`);
  }

  if (!debut) {
    winLogger.warn('debug', { debut });
    throw new Error(`Fail extract debut from artistID ${artistID}`);
  }

  return { artistImage, debut };
}

// export async function fetchRealTimeChart() {
//   const url = 'https://www.melon.com/chart/index.htm';
//   const chartDetails = await makeChartDetails(url, options, 'now');
//   return chartDetails;
// }