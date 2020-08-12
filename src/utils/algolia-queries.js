const escapeStringRegexp = require("escape-string-regexp")

const pagePath = `docs`
const indexName = `Pages`

const pageQuery = `{
  pages: allMarkdownRemark(
    filter: {
      fileAbsolutePath: { regex: "/${escapeStringRegexp(pagePath)}/" },
      headings: {elemMatch: {}}
    }
  ) {
    edges {
      node {
        id
        frontmatter {
          title
        }
        headings {
            value
        }
        fields {
          slug
        }
        excerpt(pruneLength: 100000)
      }
    }
  }
}`

function pageToAlgoliaRecord({ node: { id, frontmatter, fields, ...rest } }) {
  return {
    objectID: id,
    ...frontmatter,
    ...fields,
    ...rest,
  }
}

const queries = [
  {
    query: pageQuery,
    transformer: ({ data }) => data.pages.edges.map(pageToAlgoliaRecord),
    indexName,
    settings: { attributesToSnippet: [`excerpt:20`] },
  },
]

module.exports = queries