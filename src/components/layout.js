import React from "react"
import Header from "./Header"
import "@fontsource/open-sans"
import "@fontsource/noto-sans-jp"

const TemplateWrapper = ({ children }) => { 
  return (
    <>
      <Header />
      <div>{children}</div>
    </>
  )
}

export default TemplateWrapper