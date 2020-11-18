import {TimeParams} from "../types";

export const getQueryRange = async (server: string, query: string, period: TimeParams) =>
    await fetch(`${server}/api/v1/query_range?query=${query}&start=${period.start}&end=${period.end}&step=${period.step}`)