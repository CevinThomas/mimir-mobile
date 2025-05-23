import * as React from 'react'
import Svg, { Path } from 'react-native-svg'

export default function HomeIconFilled(props) {
  return (
    <Svg
      width={30}
      height={30}
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M18.75 26.25v-10A1.25 1.25 0 0017.5 15h-5a1.25 1.25 0 00-1.25 1.25v10"
        stroke="#fff"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="#fff"
      />
      <Path
        d="M3.75 12.5a2.5 2.5 0 01.886-1.91l8.75-7.499a2.5 2.5 0 013.228 0l8.75 7.499a2.502 2.502 0 01.886 1.91v11.25a2.5 2.5 0 01-2.5 2.5H6.25a2.5 2.5 0 01-2.5-2.5V12.5z"
        stroke="#fff"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="#fff"
      />
    </Svg>
  )
}
