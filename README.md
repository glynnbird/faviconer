# faviconer

**faviconer** is simple Node.js module to extract an icon URL given the URL of a web page.

## Installation

```sh
npm install -g faviconer
```

## Usage

```js
const faviconer = require('faviconer')

const main = async function() {

  const iconURL = await faviconer.get('https://news.bbc.co.uk')
  console.log(iconURL)
  // https://m.files.bbci.co.uk/modules/bbc-morph-news-waf-page-meta/5.3.0/apple-touch-icon-57x57-precomposed.png
}
main()
```

## Return values

Faviconer will return a string containing the absolute URL of the icon it found or `null` if the URL is invalid, or doesn't contain a favicon URL.
