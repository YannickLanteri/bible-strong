import React from 'react'
import { withTheme } from '@emotion/react'
import Svg, { G, Path } from 'react-native-svg'
/* SVGR has dropped some elements not supported by react-native-svg: title */

const SvgComponent = ({ color, theme, size = 22, ...props }) => (
  <Svg width={size} height={size} viewBox="0 0 18 22" {...props}>
    <G id="Page-1" stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
      <G id="Group" transform="translate(1.000000, 1.000000)">
        <Path
          d="M0,17.5 C0,16.1192881 1.11928813,15 2.5,15 L16,15"
          id="Shape"
          stroke={color || theme.colors.quart}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M2.5,0 L16,0 L16,20 L2.5,20 C1.11928813,20 0,18.8807119 0,17.5 L0,2.5 C0,1.11928813 1.11928813,0 2.5,0 Z"
          id="Shape"
          stroke={color || theme.colors.quart}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M8.54589844,3 C9.00162988,3 9.39127442,3.0193683 9.71484375,3.05810547 C10.0384131,3.09684264 10.3300768,3.17545514 10.5898438,3.29394531 C10.9042984,3.42610743 11.1822905,3.61523314 11.4238281,3.86132812 C11.6653658,4.10742311 11.8487949,4.3933903 11.9741211,4.71923828 C12.0994472,5.04508626 12.1621094,5.39029766 12.1621094,5.75488281 C12.1621094,6.50228238 11.9513367,7.09928162 11.5297852,7.54589844 C11.1082336,7.99251525 10.4690798,8.30924386 9.61230469,8.49609375 C9.97233253,8.68750096 10.3164046,8.97005021 10.6445312,9.34375 C10.9726579,9.71744979 11.265461,10.1150695 11.5229492,10.5366211 C11.7804375,10.9581727 11.9809563,11.3387027 12.1245117,11.6782227 C12.2680671,12.0177426 12.3398438,12.2513014 12.3398438,12.3789062 C12.3398438,12.5110684 12.2976892,12.6420892 12.2133789,12.7719727 C12.1290686,12.9018561 12.0139981,13.0043942 11.8681641,13.0795898 C11.72233,13.1547855 11.5537119,13.1923828 11.3623047,13.1923828 C11.134439,13.1923828 10.9430346,13.1388352 10.7880859,13.0317383 C10.6331372,12.9246414 10.4998378,12.7890633 10.3881836,12.625 L10.2350586,12.3909376 C10.1776369,12.3005212 10.113835,12.197709 10.0436527,12.0825005 L9.12011719,10.546875 C8.82844906,10.0501277 8.56754672,9.6718763 8.33740234,9.41210938 C8.10725796,9.15234245 7.8736991,8.97460985 7.63671875,8.87890625 C7.3997384,8.78320265 7.10123878,8.73535156 6.74121094,8.73535156 L6.03027344,8.73535156 L6.03027344,11.9550781 C6.03027344,12.3789084 5.93684989,12.6910797 5.75,12.8916016 C5.56315011,13.0921234 5.31933744,13.1923828 5.01855469,13.1923828 C4.69498536,13.1923828 4.44433683,13.0875662 4.26660156,12.8779297 C4.0888663,12.6682932 4,12.3606791 4,11.9550781 L4,4.24414062 C4,3.80663844 4.09798079,3.48990983 4.29394531,3.29394531 C4.48990983,3.09798079 4.80663844,3 5.24414062,3 L8.54589844,3 Z M7.90332031,4.52441406 L6.03027344,4.52441406 L6.03027344,7.27929688 L7.84863281,7.27929688 C8.33626546,7.27929688 8.74641761,7.23714235 9.07910156,7.15283203 C9.41178552,7.06852171 9.66585199,6.92496846 9.84130859,6.72216797 C10.0167652,6.51936748 10.1044922,6.24023615 10.1044922,5.88476562 C10.1044922,5.60676944 10.0338549,5.36181747 9.89257812,5.14990234 C9.75130138,4.93798722 9.55533979,4.77962292 9.3046875,4.67480469 C9.06770715,4.57454377 8.60058942,4.52441406 7.90332031,4.52441406 L7.90332031,4.52441406 Z"
          id="R"
          fill={color || theme.colors.quart}
          fillRule="nonzero"
        />
      </G>
    </G>
  </Svg>
)

export default withTheme(SvgComponent)
