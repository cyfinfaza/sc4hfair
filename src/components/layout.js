/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import * as React from "react"

import Header from "./header"
import ThemePicker from "./themepicker"
import * as layoutStyle from "./layout.module.css"

const Layout = ({ children }) => {
  return (
    <>
      <Header />
      <div className={layoutStyle.content}>{children}</div>
      <ThemePicker />
    </>
  )
}

export default Layout
