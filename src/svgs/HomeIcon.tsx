import Svg, { G, Mask, Path } from 'react-native-svg'
import * as React from 'react'

export default function HomeIcon({ ...props }) {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" width={32} height={33} fill="none" {...props}>
      <Mask
        id="a"
        width={32}
        height={33}
        x={0}
        y={0}
        maskUnits="userSpaceOnUse"
        style={{
          maskType: 'alpha'
        }}
      >
        <Path fill="#D9D9D9" d="M0 .5h32v32H0z" />
      </Mask>
      <G mask="url(#a)">
        <Path
          fill={props.fill}
          d="M8 25.833h4v-8h8v8h4v-12l-8-6-8 6v12ZM5.333 28.5v-16L16 4.5l10.667 8v16h-9.334v-8h-2.666v8H5.333Z"
        />
      </G>
    </Svg>
  )
}
