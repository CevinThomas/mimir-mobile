import * as React from 'react'
import Svg, { G, Mask, Path } from 'react-native-svg'

export default function SettingsIcon({ ...props }) {
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
          d="m26.133 28.5-8.4-8.4a8.127 8.127 0 0 1-5.067 1.733c-2.422 0-4.472-.839-6.15-2.516C4.84 17.639 4 15.589 4 13.167c0-2.423.839-4.473 2.517-6.15C8.194 5.339 10.244 4.5 12.667 4.5c2.422 0 4.472.839 6.15 2.517 1.677 1.677 2.516 3.727 2.516 6.15a8.127 8.127 0 0 1-1.733 5.066l8.4 8.4-1.867 1.867Zm-13.466-9.333c1.666 0 3.083-.584 4.25-1.75 1.166-1.167 1.75-2.584 1.75-4.25 0-1.667-.584-3.084-1.75-4.25-1.167-1.167-2.584-1.75-4.25-1.75-1.667 0-3.084.583-4.25 1.75-1.167 1.166-1.75 2.583-1.75 4.25 0 1.666.583 3.083 1.75 4.25 1.166 1.166 2.583 1.75 4.25 1.75Z"
        />
      </G>
    </Svg>
  )
}
