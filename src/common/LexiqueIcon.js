import React from 'react'
import { withTheme } from '@emotion/react'
import Svg, { G, Path } from 'react-native-svg'
/* SVGR has dropped some elements not supported by react-native-svg: title */

const SvgComponent = ({ color, theme, ...props }) => (
  <Svg width={22} height={22} viewBox="0 0 18 22" {...props}>
    <G id="Page-1" stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
      <G id="Group" transform="translate(1.000000, 1.000000)">
        <Path
          d="M0,17.5 C0,16.1192881 1.11928813,15 2.5,15 L16,15"
          id="Shape"
          stroke={theme.colors[color] || color || theme.colors.primary}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M12.3640351,12.9589322 L11.9035088,13 C10.0175439,11.0903491 8.04385965,9.26283368 6.04824561,7.45585216 C5.74122807,8.13347023 5.63157895,8.54414784 5.63157895,8.70841889 C5.63157895,8.95482546 5.65350877,9.13963039 6.6622807,11.1519507 L6.42105263,12.7946612 L4.27192982,12.7946612 C3.81140351,12.7946612 3.74561404,12.7946612 3.57017544,12.9589322 L3,12.8562628 L3.32894737,11.4804928 C3.41666667,11.0903491 3.52631579,11.0903491 4.75438596,11.0903491 L5.25877193,11.0903491 C4.53508772,9.50924025 4.53508772,9.38603696 4.53508772,9.13963039 C4.53508772,8.87268994 4.73245614,8.33880903 5.47807018,6.94250513 C4.11842105,5.77207392 3.92105263,5.60780287 3.96491228,5.21765914 L4.25,3 L4.90789474,3.04106776 C4.90789474,3.51334702 5.03947368,4.00616016 6.13596491,4.97125257 C7.16666667,5.87474333 8.15350877,6.75770021 9.1622807,7.70225873 L10.3684211,5.40246407 L10.3245614,5.40246407 C9.55701754,5.40246407 9.20614035,5.27926078 9.27192982,4.64271047 L9.46929825,3 L10.1052632,3.04106776 C10.1052632,3.47227926 10.3903509,3.61601643 11.1140351,3.61601643 L13,3.61601643 L12.7368421,5.34086242 C11.377193,5.3613963 10.9824561,5.87474333 9.79824561,8.25667351 C10.7850877,9.18069815 11.7280702,10.1047228 12.6710526,11.0903491 L12.3640351,12.9589322 Z"
          id="\u05D0"
          fill={theme.colors[color] || color || theme.colors.primary}
          fillRule="nonzero"
        />
        <Path
          d="M2.5,0 L16,0 L16,20 L2.5,20 C1.11928813,20 0,18.8807119 0,17.5 L0,2.5 C0,1.11928813 1.11928813,0 2.5,0 Z"
          id="Shape"
          stroke={theme.colors[color] || color || theme.colors.primary}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>
    </G>
  </Svg>
)

export default withTheme(SvgComponent)
