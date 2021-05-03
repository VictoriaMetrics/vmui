# Packages

## victoria-metrics-ui

Features:

- configurable Server URL
- configurable time range - every variant have own resolution to show around 30 data points
- query editor has basic highlighting and can be multi-line
- chart is responsive by width
- color assignment for series is automatic
- legend with reduced naming
- tooltips for closest data point
- auto-refresh mode with several time interval presets
- table and raw JSON Query viewer

## Docker build

navigate to packages/victoria-metrics-ui

```bash
cd packages/victoria-metrics-ui
```

**Build docker container**
`docker build -t vmui:0.1 .`

**Run builded container on a custom 8080 port**
`docker run --rm --name vmui -p 8080:80 vmui:0.1`

**Note:** this [Dockerfile](https://github.com/VictoriaMetrics/vmui/blob/master/packages/victoria-metrics-ui/Dockerfile) use static builded files from [npm run build](https://github.com/VictoriaMetrics/vmui/tree/master/packages/victoria-metrics-ui#npm-run-eject) .

## Build

In order to build on any machine with stable NodeJS:

```bash
cd packages/victoria-metrics-ui
npm install
npm run build
```

this generates a bundle with static site (in `build` folder) that can be deployed anywhere. Total size is around 950 KB.

## Metrics

In order to gather some metrics locally:

```bash
brew install --cask docker # if you don't have docker
open /Applications/Docker.app # if you don't have docker running
docker run -it --rm -v ~/:/victoria-metrics-data -p 8428:8428 victoriametrics/victoria-metrics --selfScrapeInterval=10s # will gather data to the user's folder
```
