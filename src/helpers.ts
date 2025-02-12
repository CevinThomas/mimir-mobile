import colors from './styles/styles'

export const getColorProperty = (theme: 'dark' | 'light', key: string) => {
  if (theme === 'dark') {
    return colors.darkTheme[key]
  }
  return colors.lightTheme[key]
}
