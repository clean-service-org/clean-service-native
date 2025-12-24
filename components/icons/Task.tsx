import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

interface Props {
    width?: number;
    height?: number;
    stroke?: string;
    fill?: string;
}

const TaskIcon: React.FC<Props> = ({
    width = 24,
    height = 24,
    stroke = 'white',
    fill = 'none',
}) => (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
        <Path
            d="M9 11L12 14L22 4M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16"
            stroke={stroke}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill={fill}
        />
    </Svg>
);

export default TaskIcon;
