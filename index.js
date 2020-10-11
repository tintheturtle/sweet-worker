// HTML Rewriter Elements
const name = 'Tin Nguyen'
const background =
  'background: linear-gradient(90deg, rgba(233,188,187,1) 0%, rgba(231,172,194,1) 50%, rgba(201,188,218,1) 100%)'
const avatar =
  'https://avatars1.githubusercontent.com/u/49880779?s=460&u=62746099927d9a41e98334805f52f085ff8be643&v=4'

// JSON API Links
const links = [
  {
    name: 'Github',
    url: 'https://github.com/tintheturtle?tab=repositories',
  },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/tin-nguyen-9604b4191/',
  },
  {
    name: 'Personal Website',
    url: 'https://tintheturtle.github.io/personal-website/',
  },
]
// Social Links
const socialLinks = [
  {
    svg: 'https://simpleicons.org/icons/facebook.svg',
    url: 'https://www.facebook.com/tin.nguyen.520562',
  },
  {
    svg: 'https://simpleicons.org/icons/instagram.svg',
    url: 'https://www.instagram.com/tintheturtle/',
  },
]

// Targets divs and adds children anchor and svg tags depending on input
class LinksTransformer {
  constructor(links, type) {
    this.links = links
    this.type = type
  }

  async element(element) {
    switch (this.type) {
      case 'name': {
        this.links.forEach((link) => {
          element.append(
            `
            <a target="_blank" href=${link.url}>
              ${link.name}
            </a>
            `,
            { html: true },
          )
        })
        break
      }
      case 'svg': {
        this.links.forEach((link) => {
          element.append(
            `
            <a target="_blank" href=${link.url}>
              <img src=${link.svg} 
              style="filter: invert(94%) sepia(100%) saturate(0%) hue-rotate(152deg) brightness(105%) contrast(105%)"
              />
            </a>
            `,
            { html: true },
          )
        })
        break
      }
      default: {
        this.links.forEach((link) => {
          element.append(
            `
            <a target="_blank" href=${link.url}>
              ${link.name}
            </a>
            `,
            { html: true },
          )
        })
        break
      }
    }
  }
}

// Transformer to remove an attribute
class RemoveAttributeTransformer {
  constructor(attribute) {
    this.attribute = attribute
  }

  async element(element) {
    element.removeAttribute(this.attribute)
  }
}

// Transformer for setting an attribute
class SetAttributeTransformer {
  constructor(attribute, content) {
    this.attribute = attribute
    this.content = content
  }

  async element(element) {
    element.setAttribute(this.attribute, this.content)
  }
}

// Transformer for setting inner content
class SetInnerContentTransformer {
  constructor(content) {
    this.content = content
  }

  async element(element) {
    element.setInnerContent(this.content)
  }
}

// Combine custom classes to rewrite HTML using Rewriter
const rewriter = new HTMLRewriter()
  .on('title', new SetInnerContentTransformer(name))
  .on('body', new SetAttributeTransformer('style', background))
  .on('h1#name', new SetInnerContentTransformer(name))
  .on('img#avatar', new SetAttributeTransformer('src', avatar))
  .on('div#links', new LinksTransformer(links, 'name'))
  .on('div#profile', new RemoveAttributeTransformer('style'))
  .on('div#social', new RemoveAttributeTransformer('style'))
  .on('div#social', new LinksTransformer(socialLinks, 'svg'))

/**
 * Respond with either links or HTML page
 * @param {Request} request
 */
async function handleRequest(request) {
  if (request.url.includes('/links')) {
    const header = { 'content-type': 'application/json' }
    const body = JSON.stringify(links, null, 3)
    return new Response(body, header)
  }
  const header = { headers: { 'content-type': 'text/html' } }
  const res = await fetch(
    'https://static-links-page.signalnerve.workers.dev',
    header,
  )
  return rewriter.transform(res)
}

addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request))
})
