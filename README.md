## Packages

### victoria-lens

Features:
- configurable Server URL
- 4 variants of time ranges (from "Last 2 Minutes" to "Last 24 Hours") - every variant have own resolution to show around 300 data points
- query editor has basic highlighting and can easily confirm `\t` and `\n` (those are trimmed per line for API request)
- chart is responsive by width
- color assignment for series is automatic
- legend includes basic naming

In order to build on any machine with stable NodeJS:
```
cd packages/victoria-lens
npm install
npm run build
```
this generates a bundle with static site (in `build` folder) that can be deployed anywhere. Total size is around 700 KB.