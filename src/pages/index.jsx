import * as React from "react"
import { graphql, Link } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"
import { useEffect, useState } from "react"
import ReactMarkdown from "react-markdown"
import Post from "../components/post"

import Layout from "../components/layout"
import SEO from "../components/seo"

const contentfulQuery = `
{
  postCollection {
    items {
      title
      contentText
    }
  }
}
`

const IndexPage = ({ data }) => {
  const [pageContent, setPageContent] = useState(null)
  useEffect(() => {
    window
      .fetch(`https://graphql.contentful.com/content/v1/spaces/e34g9w63217k/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Authenticate the request
          Authorization: `Bearer ${atob(
            "VFJsQ28xQmxUbXB3eUtJT0hKMDhYMmxZQWFOTmxjZUY0MTVLTW1La01Gaw=="
          )}`,
        },
        // send the GraphQL query
        body: JSON.stringify({ query: contentfulQuery }),
      })
      .then(response => response.json())
      .then(({ data, errors }) => {
        if (errors) {
          console.error(errors)
        }

        // rerender the entire component with new data
        setPageContent(data.postCollection)
      })
  }, [])
  return (
    <Layout>
      <div style={{ textAlign: "center" }}>
        <h1>Welcome to the Somerset County 4-H Fair.</h1>
        <h2>Latest Updates</h2>
      </div>
      <div className="columnCentered">
        {pageContent
          ? pageContent.items.map((post, i) => {
              console.log(post)
              return (
                <Post
                  key={post.title}
                  title={post.title}
                  content={post.contentText}
                  index={i}
                />
              )
            })
          : null}
      </div>
    </Layout>
  )
}

export const query = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`

export default IndexPage
