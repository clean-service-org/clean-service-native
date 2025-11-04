import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface Props {
  width?: number;
  height?: number;
  stroke?: string;
  fill?: string;
}

const MessageIcon: React.FC<Props> = ({
  width = 24,
  height = 24,
  stroke = '#8E8E93',
  fill = 'none',
}) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M7.51 19.8C8.83 20.56 10.37 21 12 21C16.97 21 21 16.97 21 12C21 7.03 16.97 3 12 3C7.03 3 3 7.03 3 12C3 13.64 3.44 15.17 4.2 16.49L3.51 19.48C3.34 19.97 3.26 20.21 3.32 20.38C3.37 20.52 3.48 20.63 3.62 20.68C3.78 20.74 4.03 20.66 4.52 20.49L7.51 19.8Z"
      stroke={stroke}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill={fill}
    />
  </Svg>
);

export default MessageIcon;
