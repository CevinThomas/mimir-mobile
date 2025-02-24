import Svg, { Path } from 'react-native-svg'
import * as React from 'react'

export default function HomeIconFilled({ ...props }) {
  return (
    <Svg
      width={22}
      height={25}
      viewBox="0 0 22 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path d="M.333 24.5v-16L11 .5l10.667 8v16h-8v-9.333H8.333V24.5h-8z" fill="#FAF9F6" />
    </Svg>
  )
}
