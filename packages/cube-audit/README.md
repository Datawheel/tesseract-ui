# @datawheel/cube-audit

A quick script to audit metainformation annotations on cubes from tesseract-olap servers.

## Description

This script will analyze the cubes in a given tesseract endpoint, and produce a markdown checklist of suggested annotations and dimension types to better improve the performance and user experience for vizbuilder, tesseract-explorer and it's plugins, and other products from Datawheel.

## Usage

The easiest usage is simply running the `cube-audit` script followed by a base tesseract endpoint:

```sh
npx @datawheel/cube-audit https://api.oec.world/tesseract/
```

No installation needed. `npx` will take care of downloading the script and running it.

You can also add it as a dependency on another project and import the `auditServer` named export:

```js
const {auditServer} = require("@datawheel/cube-audit");

auditServer("https://api.oec.world/tesseract/").then(result => { ... });
```

The `auditServer` function accepts an url `string` or an [`AxiosRequestConfig`](https://github.com/axios/axios#request-config) object. The `result` of the audit is an object you can interpret easily to do other actions.

## Annotations

### Cube

|Annotation Name|Description|
|:---|:---|:---:|
|source_name|Organization that produces/published the data (ex. "Census Bureau" or "BACI").|
|source_link|Web address for the organization (will turn `source_name` display into an anchor link).|
|source_description|Description of the source organization (typically a few short sentences).||
|dataset_name|Title for the specific dataset/table (ex. "ACS 1-Year Estimate" or "HS6 REV. 1992 (1995 - 2018)").|
|dataset_link|Web address for the dataset (will turn `dataset_name` display into an anchor link).|
|dataset_description|Description of the dataset (typically a few short sentences).||

### Measures

|Annotation Name|Description|
|:---|:---|:--:|
|aggregation_method|The method by which a measure should be aggregated (if the root aggregation type is unknown).<br /><br />Valid values include: `COUNT`, `SUM`, `AVERAGE`, `MEDIAN`, `RCA`.|
|format_template|A template string that specifies how the numeric values of a measure should be displayed to users. Can be any valid [d3plus-format](https://github.com/d3plus/d3plus-format/#d3plusformatspecifier-) string specifier, which extends the base specifiers defined by [d3-format](https://github.com/d3/d3-format/#locale_format).<br /><br />Defaults to `".3~a"`, which abbreviates large numbers and adds the appropriate suffix (ie. `1234567890` becomes `1.23B`).|
|description|The text description of a measure, typically 1-3 short sentences.|

## Locale Support

The annotations mentioned here are the default values. However, if you need texts for different languages, you can add `_<locale>` as a suffix. For example, `source_name` for English and Spanish should be `source_name_en` and `source_name_es`.
Applications will then try to use the annotation with suffix, and if it's not available, will default to the annotation without suffix.