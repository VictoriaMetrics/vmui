import React, {Component} from 'react';
import './Graph.scss';
import moment from 'moment';
import URI from 'urijs';
import invert from 'lodash.invert';
import * as d3 from 'd3';

import MetricsGraphics from 'react-metrics-graphics';
import 'metrics-graphics/dist/metricsgraphics.css';
// import * as YAML from "yamljs";

class Graph extends Component {
	stateToUrlParams = {
		'expr': 'e',
		'date': 'd',
		'range': 'r',
		'step': 'step',
		'stacked': 's',
	};
	urlToStateParams = invert(this.stateToUrlParams);

	defaultState = {
		expr: 'rate(process_cpu_seconds_total[1m])',
		date: moment().format('YYYY-MM-DD HH:mm'), // end of interval
		range: '1h',
		step: 14,
		stacked: false,
		data: [{'date': new Date(), 'value': 0}],
		labels: [''],
		loadedInMs: ''
	};

	ranges = [
		'1s', '10s',
		'1m', '5m', '15m', '30m',
		'1h', '2h', '6h', '12h',
		'1d', '2d',
		'1w', '2w', '4w', '8w',
		'1M', '3M',
		'1y', '2y'
	];

	constructor(props, context) {
		super(props);
		this.chartWrapper = React.createRef();

		this.state = this.initState();

		this.rangeRegex = new RegExp('^([0-9.]+)([yMwdhms]+)$')
	}

	initState() {
		let prometheusParams = {
			'g0.expr': 'expr',
			'g0.range_input': 'range',
			'g0.end_input': 'date',
			'g0.step_input': 'step',
			'g0.stacked': 'stacked',
			// 'g0.tab',
		};

		let state = {...this.defaultState}; // shallow copy

		let queryObj = URI(window.location.href).query(true);
		let queryMap = new Map(Object.entries(queryObj));

		queryMap.forEach((value, key) => {
			let stateParam = this.urlToStateParams[key];
			let promParam = prometheusParams[key];
			if (stateParam) {
				state[stateParam] = value;
			} else if (promParam && value !== 'undefined') {
				state[promParam] = value;
			}
		});

		return state;
	}

	getDateFormat(): string {
		let lastLetter = this.state.range[this.state.range.length - 1];
		if (lastLetter === 's') {
			return 'YYYY-MM-DD HH:mm:ss';
		}

		if (['d', 'w', 'M', 'y'].indexOf(lastLetter) > -1) {
			return 'YYYY-MM-DD';
		}

		return 'YYYY-MM-DD HH:mm';
	}

	async componentDidMount() {
		await this.fetchAndSetData();
	}

	componentWillUnmount(): void {
		this._unmounted = true;
	}

	getDuration(): moment.Duration {
		let range = this.state.range;
		let matches = range.match(this.rangeRegex);
		if (!matches) {
			this.setState({error: 'Cannot parse range: ' + range});
			return null;
		}
		return moment.duration(parseFloat(matches[1]), matches[2]);
	}

	getInterval() {
		let duration = this.getDuration();
		if (duration == null) {
			return null;
		}

		let end = moment(this.state.date);
		let start = end.clone().subtract(duration);

		return {
			start: start,
			end: end
		};
	}

	async fetchAndSetData() {
		let interval = this.getInterval();
		if (interval == null) {
			return;
		}

		let startedAt = moment();

		let url = new URI('http://localhost:8428/api/v1/query_range')
			.addQuery('query', this.state.expr)
			.addQuery('start', interval.start.valueOf() / 1000)
			.addQuery('end', interval.end.valueOf() / 1000)
			.addQuery('step', this.state.step)
			.addQuery('_', interval.start.valueOf());

		let response = await fetch(url);
		let responseBody = await response.json();

		if (this._unmounted) {
			console.log('Unmounted, skipping processing data');
			return;
		}

		this.setState({loadedInMs: moment.duration(moment().diff(startedAt)).asMilliseconds()});

		if (response.ok) {
			let series = responseBody.data.result;

			let metricsData = series.map((serie) => {
				return serie.values
					.map((el) => {
						return {'date': new Date(el[0] * 1000), 'value': el[1]}
					})
			});

			let labels = series.map((serie) => {
				return JSON.stringify(serie['metric'])
				// return YAML.stringify(serie['metric']);
			});

			if (metricsData.length) {
				this.setState({data: metricsData, labels: labels});
				this.setState({queryError: null});
			} else {
				this.setState({queryError: 'No data to display'});
			}
		} else {
			this.setState({queryError: responseBody.errorType + ': ' + responseBody.error})
		}
	}

	onChange(key: string) {
		return (event: Event) => {
			let newValue = event.target.value;
			if (event.target.type === 'checkbox') {
				newValue = event.target.checked;
			}
			this.setState({[key]: newValue}, this.updateData.bind(this));
		}
	}

	updateData() {
		let self = this;

		let newQueryParams = {};

		function setParamIfNotDefault(key: string, urlKey: string) {
			if (self.state[key] !== self.defaultState[key]) {
				newQueryParams[urlKey] = self.state[key];
			}
		}

		setParamIfNotDefault('expr', 'e');
		setParamIfNotDefault('date', 'd');
		setParamIfNotDefault('range', 'r');
		setParamIfNotDefault('step', 'res');
		setParamIfNotDefault('stacked', 's');

		let urlState = JSON.stringify(newQueryParams);
		// console.log(urlState, 'vs', window.history.state);

		if (window.history.state === urlState) {
			// same state
			return;
		}

		let newParams = URI(window.location.href)
			.query(newQueryParams)
			.toString();

		window.history.pushState(urlState, '', newParams);

		this.fetchAndSetData().then();
	}

	onRangeChange(sign: string) {
		return (event: Event) => {
			let knownRangeI = this.ranges.indexOf(this.state.range);
			if (knownRangeI === -1) {
				let duration = this.getDuration();
				knownRangeI = this.ranges.findIndex((val, i) => {
					let matches = val.match(this.rangeRegex);
					let knowRangeDuration = moment.duration(parseFloat(matches[1]), matches[2]);

					return knowRangeDuration > duration;
				});

				if (knownRangeI === -1) {
					knownRangeI = this.ranges.length;
				}
			}

			let changeBy = sign === '-' ? -1 : 1;
			let newRangeI = knownRangeI + changeBy;

			// Clip
			if (newRangeI < 0) {
				newRangeI = 0
			} else if (newRangeI >= this.ranges.length) {
				newRangeI = this.ranges.length - 1
			}

			this.setState({range: this.ranges[newRangeI]}, this.updateData.bind(this));
		}
	}

	onDateChange(sign: string) {
		return (event: Event) => {
			let newValue = moment(this.state.date)
				.add(this.getDuration() * (sign === '<' ? -1 : 1))
				.format(this.getDateFormat());
			this.setState({date: newValue}, this.updateData.bind(this));
		}
	}

	getQueryRows() {
		return 1 + (this.state.expr.match(/\n/g) || []).length;
	}

	async onQueryKeyPress(event: Event) {
		if (event.nativeEvent.code === 'Enter' && event.nativeEvent.ctrlKey) {
			await this.fetchAndSetData();
		}
	}

	render() {
		return (
			<div className="Graph">
				<div className="graph-params">
					<div className="row query">
					<textarea rows={this.getQueryRows()} className="query-input" spellCheck={false}
					          value={this.state.expr}
					          onChange={this.onChange('expr')}
					          onKeyPress={this.onQueryKeyPress.bind(this)}
					/>
					</div>

					<div className="row">
						<button type="submit" className="query-submit" onClick={this.fetchAndSetData.bind(this)}>
							Query
						</button>

						<div className="range">
							<button className="range-minus" onClick={this.onRangeChange('-')}>
								-
							</button>
							<input type="text" className="range"
							       value={this.state.range}
							       onChange={this.onChange('range')}
							       placeholder="Range"
							/>
							<button className="range-plus" onClick={this.onRangeChange('+')}>
								+
							</button>
						</div>

						<div className="date">
							<button className="date-prev" onClick={this.onDateChange('<')}>
								&lt;
							</button>
							<input type="text"
							       value={moment(this.state.date).format(this.getDateFormat())}
							       onChange={this.onChange('date')}
							/>
							<button className="date-next" onClick={this.onDateChange('>')}>
								&gt;
							</button>
						</div>

						<div className="step">
							<input placeholder="Res. (s)"
							       value={this.state.step}
							       onChange={this.onChange('step')}
							/>
						</div>

						<div className="stacked">
							<label>
								<input type="checkbox"
								       value="true"
								       checked={this.state.stacked ? "checked" : ""}
								       onChange={this.onChange('stacked')}
								/>
								stacked
							</label>
						</div>
					</div>
				</div>

				< div
					className="query-error">
					{this.state.queryError}
				</div>

				<div
					className="chartWrapper"
					ref={this.chartWrapper}
				>
					< MetricsGraphics
						data={this.state.data}
						legend={this.state.labels}
						animate_on_load={false}
						area={this.state.stacked}
						x_accessor="date"
						y_accessor="value"
						full_width={true}
						height={400}
						transition_on_update={false}
						brush="x"
						interpolate={d3.curveLinear}
						missing_is_hidden={true}
					/>
				</div>

				<div className="statistics">
					Loaded in: {this.state.loadedInMs}ms.
					Resolution: {this.state.step}s.
					Total time series: {this.state.data.length}.
				</div>
			</div>
		);
	}
}

export default Graph;
