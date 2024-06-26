import { useMemo } from 'react';

import { useLocationExplorerSettings } from '../location/$id';
import { useSearchFromSearchParams } from '../search';
import { useSearchExplorerQuery } from '../search/useSearchExplorerQuery';
import { useExplorerContext } from './Context';
import { explorerStore } from './store';
import { useExplorerSearchParams } from './util';

export function useExplorerWindow(path?: string) {
	const explorer = useExplorerContext();

	if (explorer.parent?.type !== 'Location') {
		throw new Error('useExplorerWindow must be used within a LocationExplorer');
	}

	const location = explorer.parent.location;

	const [{ take }] = useExplorerSearchParams();

	const { explorerSettings, preferences } = useLocationExplorerSettings(location);

	const { layoutMode, mediaViewWithDescendants, showHiddenFiles } =
		explorerSettings.useSettingsSnapshot();

	const defaultFilters = useMemo(
		() => [{ filePath: { locations: { in: [location.id] } } }],
		[location.id]
	);

	const search = useSearchFromSearchParams();

	const searchFiltersAreDefault = useMemo(
		() => JSON.stringify(defaultFilters) !== JSON.stringify(search.filters),
		[defaultFilters, search.filters]
	);

	//

	const items = useSearchExplorerQuery({
		search,
		explorerSettings,
		filters: [
			...(search.allFilters.length > 0 ? search.allFilters : defaultFilters),
			{
				filePath: {
					path: {
						location_id: location.id,
						path: path ?? '',
						include_descendants:
							search.search !== '' ||
							(search.filters &&
								search.filters.length > 0 &&
								searchFiltersAreDefault) ||
							(layoutMode === 'media' && mediaViewWithDescendants)
					}
				}
			},
			...(!showHiddenFiles ? [{ filePath: { hidden: false } }] : [])
		],
		take,
		paths: { order: explorerSettings.useSettingsSnapshot().order },
		onSuccess: () => explorerStore.resetNewThumbnails()
	});

	return items;
}
