import Svg, { Rect } from 'react-native-svg'
import * as React from 'react'

export default function DeckIconFilled({ ...props }) {
  return (
    <Svg
      width={29}
      height={30}
      viewBox="0 0 29 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Rect
        x={1.12941}
        y={5.04522}
        width={16.6011}
        height={23.6104}
        rx={2}
        transform="rotate(-7.998 1.13 5.045)"
        fill="#fff"
        stroke="#fff"
        strokeWidth={2}
      />
      <Rect
        x={8.29883}
        y={1}
        width={19.7012}
        height={27.4517}
        rx={2}
        fill="#1A2330"
        stroke="#1A2330"
        strokeWidth={2}
      />
      <Rect
        x={9.84888}
        y={2.55011}
        width={16.6011}
        height={24.3515}
        rx={2}
        fill="#fff"
        stroke="#fff"
        strokeWidth={2}
      />
    </Svg>
  )
}
