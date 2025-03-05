import colors from './styles/styles'

export const getColorProperty = (theme?: 'dark' | 'light', key: string) => {
  if (theme === 'dark') {
    return colors.darkTheme[key]
  }

  if (theme === 'light') {
    return colors.lightTheme[key]
  }

  return colors[key]
}
