import Svg, { Path } from 'react-native-svg'
import * as React from 'react'

export default function BackIcon({ ...props }) {
  return (
    <Svg
      width={9}
      height={15}
      viewBox="0 0 9 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M7.083 14.583L0 7.5 7.083.417l1.258 1.257L2.515 7.5l5.826 5.826-1.258 1.257z"
        fill="#FAF9F6"
      />
    </Svg>
  )
}
