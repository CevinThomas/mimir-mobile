import * as React from 'react'
import Svg, { ClipPath, Defs, G, LinearGradient, Path, Stop } from 'react-native-svg'

export default function DeckBackground({ ...props }) {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" width={402} height={309} fill="none" {...props}>
      <G clipPath="url(#a)">
        <Path fill="#251BA7" d="M581-51.788H0v412h581v-412Z" />
        <Path
          stroke="#F8F0E4"
          strokeMiterlimit={10}
          d="M324.817 498.951c79.428 0 143.817-68.489 143.817-152.975C468.634 261.49 404.245 193 324.817 193 245.389 193 181 261.49 181 345.976s64.389 152.975 143.817 152.975Z"
        />
        <Path
          fill="url(#b)"
          d="M359 101c20.987 0 38-17.013 38-38s-17.013-38-38-38-38 17.013-38 38 17.013 38 38 38Z"
        />
        <Path
          fill="url(#c)"
          d="M131.445 300.43c6.88 0 12.457-5.932 12.457-13.25 0-7.317-5.577-13.25-12.457-13.25-6.879 0-12.456 5.933-12.456 13.25 0 7.318 5.577 13.25 12.456 13.25Z"
        />
        <Path
          fill="url(#d)"
          d="M483.926 463.557c53.66 0 97.159-46.269 97.159-103.346 0-57.076-43.499-103.346-97.159-103.346-53.659 0-97.158 46.27-97.158 103.346 0 57.077 43.499 103.346 97.158 103.346Z"
        />
        <Path
          fill="url(#e)"
          d="M8.776 287.18c84.223 0 152.5-68.489 152.5-152.975 0-84.487-68.277-152.976-152.5-152.976s-152.5 68.49-152.5 152.976S-75.447 287.18 8.776 287.18Z"
        />
        <Path
          fill="url(#f)"
          d="M.093 51.557c53.66 0 97.159-46.27 97.159-103.346S53.751-155.135.091-155.135c-53.658 0-97.158 46.27-97.158 103.346 0 57.077 43.5 103.346 97.159 103.346Z"
        />
        <Path
          stroke="#F8F0E4"
          strokeMiterlimit={10}
          d="M91.802 117.866c.043-12.426-9.995-22.54-22.422-22.589-12.426-.049-22.534 9.985-22.578 22.412-.043 12.426 9.995 22.539 22.422 22.588 12.426.049 22.535-9.985 22.578-22.411Z"
        />
      </G>
      <Defs>
        <LinearGradient
          id="b"
          x1={359}
          x2={359}
          y1={100.999}
          y2={25}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#40A4FF" />
          <Stop offset={1} stopColor="#311996" />
        </LinearGradient>
        <LinearGradient
          id="c"
          x1={143.902}
          x2={118.991}
          y1={287.176}
          y2={287.176}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#40A4FF" />
          <Stop offset={1} stopColor="#311996" />
        </LinearGradient>
        <LinearGradient
          id="d"
          x1={386.768}
          x2={581.089}
          y1={360.207}
          y2={360.207}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#E12179" />
          <Stop offset={1} stopColor="#311996" />
        </LinearGradient>
        <LinearGradient
          id="e"
          x1={8.772}
          x2={8.772}
          y1={287.176}
          y2={-18.767}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#2B00FF" />
          <Stop offset={1} stopColor="#311996" />
        </LinearGradient>
        <LinearGradient
          id="f"
          x1={0.089}
          x2={0.089}
          y1={51.556}
          y2={-155.141}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#384EDD" />
          <Stop offset={1} stopColor="#311996" />
        </LinearGradient>
        <ClipPath id="a">
          <Path fill="#fff" d="M0 0h581v309H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  )
}
