import {TimeParams} from "../types";

import * as dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import {UnitTypeShort} from "dayjs";

dayjs.extend(duration);

export enum TimePreset {
  "lastHour",
  "last15Min",
  "last2Min",
  "last24Hours"
}

export const getTimeperiodForPreset = (p: TimePreset): TimeParams => {
	const n = (new Date()).valueOf() / 1000;
	let delta = 0;
	switch (p) {
	case TimePreset.last2Min:
		delta = 60 * 2;
		break;
	case TimePreset.last15Min:
		delta = 60 * 15;
		break;
	case TimePreset.lastHour:
		delta = 60 * 60;
		break;
	case TimePreset.last24Hours:
		delta = 60 * 60 * 24;
	}

	const MAX_ITEMS_PER_CHART = 300; // TODO: make dependent from screen size
	return {
		start: n - delta,
		end: n,
		step: delta / MAX_ITEMS_PER_CHART
	};
};

export const supportedDurations = [
	{long: "days", short: "d", possible: "day"},
	{long: "weeks", short: "w", possible: "week"},
	{long: "months", short: "M", possible: "mon"},
	{long: "years", short: "y", possible: "year"},
	{long: "hours", short: "h", possible: "hour"},
	{long: "minutes", short: "m", possible: "min"},
	{long: "seconds", short: "s", possible: "sec"},
	{long: "milliseconds", short: "ms", possible: "millisecond"}
];

const shortDurations = supportedDurations.map(d => d.short);

export const isSupportedDuration = (str: string): Partial<Record<UnitTypeShort, string>> | undefined => {

	const digits = str.match(/\d+/g);
	const words = str.match(/[a-zA-Z]+/g);

	if (words && digits && shortDurations.includes(words[0])) {
		return {[words[0]]: digits[0]};
	}
};

export const getTimeperiodForDuration = (dur: string): TimeParams => {
	const n = (new Date()).valueOf() / 1000;

	const durItems = dur.trim().split(" ");

	const durObject = durItems.reduce((prev, curr) => {

		const dur = isSupportedDuration(curr);
		if (dur) {
			return {
				...prev,
				...dur
			};
		} else {
			return {
				...prev
			};
		}
	}, {});

	const delta = dayjs.duration(durObject).asSeconds();

	const MAX_ITEMS_PER_CHART = 300; // TODO: make dependent from screen size
	return {
		start: n - delta,
		end: n,
		step: delta / MAX_ITEMS_PER_CHART
	};
};
