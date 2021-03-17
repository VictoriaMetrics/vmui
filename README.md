## Packages

### victoria-metrics-ui

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

In order to see docker-related instructions please see Readme inside the package

In order to build on any machine with stable NodeJS:
```
cd packages/victoria-metrics-ui
npm install
npm run build
```
this generates a bundle with static site (in `build` folder) that can be deployed anywhere. Total size is around 950 KB.

In order to gather some metrics locally:
```bash
brew install --cask docker # if you don't have docker
open /Applications/Docker.app # if you don't have docker running
docker run -it --rm -v ~/:/victoria-metrics-data -p 8428:8428 victoriametrics/victoria-metrics --selfScrapeInterval=10s # will gather data to the user's folder
```