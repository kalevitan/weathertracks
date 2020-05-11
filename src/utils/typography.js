import Typography from "typography"
import fairyGatesTheme from "typography-theme-fairy-gates"

fairyGatesTheme.overrideThemeStyles = ({ rhythm }, options) => ({
  'a': { 
    color: '#1ed760',
    backgroundImage: 'linear-gradient(to top, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0) 1px, #1ed760 1px, #1ed760 2px, rgba(0, 0, 0, 0) 2px)'
  }
})

const typography = new Typography(fairyGatesTheme)

export default typography
export const rhythm = typography.rhythm