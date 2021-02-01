import {TimeParams} from "../types";

export const getQueryRangeUrl = (server: string, query: string, period: TimeParams) =>
    `${server}/api/v1/query_range?query=${query}&start=${period.start}&end=${period.end}&step=${period.step}`

export const getQueryUrl = (server: string, query: string, period: TimeParams) =>
    `${server}/api/v1/query?query=${query}&start=${period.start}&end=${period.end}&step=${period.step}`
