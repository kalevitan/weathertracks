import React from "react"
import Header from "./Header/Header"
import "@fontsource/open-sans"
import "@fontsource/noto-sans-jp"

const TemplateWrapper = ({ children }) => { 
  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  )
}

export default TemplateWrapper