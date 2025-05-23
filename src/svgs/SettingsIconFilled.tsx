import * as React from 'react'
import Svg, { Path } from 'react-native-svg'

export default function SettingsIconFilled({ ...props }) {
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
        d="M20.156 8.438c-.23 3.097-2.578 5.624-5.156 5.624s-4.93-2.526-5.156-5.624C9.609 5.215 11.894 2.811 15 2.811c3.105 0 5.39 2.461 5.156 5.626z"
        stroke="#fff"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="#fff"
      />
      <Path
        d="M15 17.813c-5.098 0-10.271 2.812-11.229 8.12-.115.64.247 1.255.917 1.255h20.625c.67 0 1.032-.615.917-1.254-.959-5.309-6.132-8.122-11.23-8.122z"
        stroke="#fff"
        strokeWidth={1.8}
        strokeMiterlimit={10}
        fill="#fff"
      />
    </Svg>
  )
}