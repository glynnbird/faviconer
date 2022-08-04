const axios = require('axios').default
const url = require('url')

const get = async function (webpage) {
  let retval = null
  let html
  let parsedURL

  // parse the URL
  try {
    parsedURL = new url.URL(webpage)
  } catch (e) {
    return null
  }

  // fetch the URL
  try {
    const response = await axios.get(webpage)
    html = response.data
  } catch(e) {
    return null
  }

  // find the link tag
  const regLink = /<link[^>]+rel=.(icon|shortcut icon|alternate icon|apple-touch-icon-precomposed)[^>]+>/ig
  const matches = html.match(regLink)
  if (matches) {
    const linkTag = matches[0]
    const regHref = /href=('|")(.*?)\1/i
    const linkMatches = linkTag.match(regHref)
    if (linkMatches) {
      // linkMatches contains
      // [0] - the matches string
      // [1] - the quote (' or ")
      // [2] - the URL
      retval = linkMatches[2]

      // try to parse this URL
      try {
        // if it succeeds then it's an absolute URL
        // which can be used as is
        const parsedLink = new url.URL(retval)
        return retval
      } catch (e) {
        // make an absolute URL from the relative path
        // and the original web page's URL
        const absoluteURL = new url.URL(retval, parsedURL.href)
        return absoluteURL.href
      }
    }
  }
  return retval
}

module.exports = {
  get
}
