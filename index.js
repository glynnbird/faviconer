// get a favicon from the URL of a web page
// returns the URL of the icon or null if something went wrong
const get = async function (webpage) {
  let retval = null
  let html
  let parsedURL

  // parse the URL
  try {
    parsedURL = new URL(webpage)
  } catch (e) {
    return null
  }

  // fetch the URL
  try {
    const response = await fetch(webpage)
    html = await response.text()
  } catch (e) {
    return null
  }

  // find the link tag
  const regLink = /<link[^>]+rel=.(icon|shortcut icon|alternate icon|apple-touch-icon|apple-touch-icon-precomposed)[^>]+>/ig
  const matches = html.match(regLink)
  if (matches) {
    // find the href element within the tag
    const linkTag = matches[0]
    const regHref = /href=('|")(.*?)\1/i
    const linkMatches = linkTag.match(regHref)

    // if link tag found
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
        /* eslint-disable no-new */
        new url.URL(retval)
        return retval
      } catch (e) {
        // make an absolute URL from the relative path
        // and the original web page's URL
        const absoluteURL = new URL(retval, parsedURL.href)
        return absoluteURL.href
      }
    }
  }
  return retval
}

module.exports = {
  get
}
