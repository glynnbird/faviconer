const http = require('http')
const https = require('https')
const url = require('url')

const request = async function (opts) {
  return new Promise((resolve, reject) => {
    let h

    // Build the post string from an object
    opts.method = opts.method ? opts.method : 'get'
    const allMethods = ['get', 'head', 'post', 'put', 'delete']
    if (!allMethods.includes(opts.method)) {
      throw new Error('invalid method')
    }
    const methods = ['post', 'put']
    let postData
    if (methods.includes(opts.method)) {
      postData = new URLSearchParams(opts.data).toString()
    }
    // parse
    if (!opts.url) {
      throw new Error('invalid url')
    }
    const parsed = new url.URL(opts.url)
    if (parsed.protocol === 'https:') {
      h = https
    } else if (parsed.protocol === 'http:') {
      h = http
    } else {
      throw new Error('invalid protocol')
    }
    opts.qs = opts.qs ? opts.qs : {}
    for (const key in opts.qs) {
      parsed.searchParams.append(key, opts.qs[key])
    }

    // headers
    opts.headers = opts.headers || {}
    if (postData) {
      opts.headers['Content-Length'] = Buffer.byteLength(postData)
    }

    // An object of options to indicate where to post to
    const req = {
      host: parsed.hostname,
      path: parsed.pathname + parsed.search,
      method: opts.method,
      headers: opts.headers
    }

    // Set up the request
    let response = ''
    const r = h.request(req, function (res) {
      res.setEncoding('utf8')
      res.on('data', function (chunk) {
        response += chunk
      })
      res.on('close', function () {
        if (res.statusCode >= 400) {
          return reject(response)
        }
        if ([301, 302].includes(res.statusCode) && res.headers.location && res.headers.location !== opts.url) {
          let loc = res.headers.location

          // try to parse this URL
          try {
            // if it succeeds then it's an absolute URL
            // which can be used as is
            /* eslint-disable no-new */
            new url.URL(loc)
          } catch (e) {
            // make an absolute URL from the relative path
            // and the original web page's URL
            const absoluteURL = new url.URL(loc, opts.url)
            loc = absoluteURL.href
          }
          opts.url = loc
          request(opts).then(resolve)
          r.end()
          return
        }
        resolve(response)
      })
    })

    // handle errors
    r.on('error', function (e) {
      reject(e)
    })

    // post the data
    if (postData) {
      r.write(postData)
    }
    r.end()
  })
}

module.exports = request
