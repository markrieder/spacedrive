import { Slider } from '@sd/ui';
import { useLocale } from '~/hooks';

import { Subheading } from '..';
import { useExplorerContext } from '../../Context';
import { LIST_VIEW_ICON_SIZES } from '../../View/ListView/useTable';
import { getSizes } from './util';

const sizes = getSizes(LIST_VIEW_ICON_SIZES);

export const IconSize = () => {
	const { t } = useLocale();

	const explorer = useExplorerContext();
	const settings = explorer.useSettingsSnapshot();

	const defaultValue = sizes.indexMap.get(settings.listViewIconSize)!;

	return (
		<div>
			<Subheading>{t('icon_size')}</Subheading>
			<Slider
				step={1}
				max={sizes.indexMap.size - 1}
				defaultValue={[defaultValue]}
				onValueChange={([value]) => {
					const size = value !== undefined && sizes.sizeMap.get(value);
					if (size) explorer.settingsStore.listViewIconSize = size;
				}}
			/>
		</div>
	);
};
