import { getIcon, iconNames } from '@sd/assets/util';
import FastImage, { FastImageProps } from 'react-native-fast-image';

import { isDarkTheme } from '@sd/client';
import { ClassInput } from 'twrnc';
import { twStyle } from '~/lib/tailwind';

export type IconName = keyof typeof iconNames;

interface IconProps extends Omit<FastImageProps, 'source' | 'style'> {
	name: IconName;
	size?: number;
	theme?: 'dark' | 'light';
	style?: ClassInput;
}

export const Icon = ({ name, size, theme, style, ...props }: IconProps) => {
	const isDark = isDarkTheme();
	return (
		<FastImage
			{...props}
			style={twStyle(style, {
				width: size,
				height: size
			})}
			source={getIcon(name, theme ? theme === 'dark' : isDark)}
		/>
	);
};
