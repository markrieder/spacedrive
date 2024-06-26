import { useVirtualizer } from '@tanstack/react-virtual';
import { useCallback } from 'react';
import { getExplorerItemData } from '@sd/client';

import { useExplorerContext } from '../../Context';
import { useExplorerViewContext } from '../Context';
import { ColumnsViewItem } from './Item';

const ROW_HEIGHT = 20;

export function ColumnsView() {
	const explorer = useExplorerContext();
	const explorerView = useExplorerViewContext();

	const rowVirtualizer = useVirtualizer({
		count: Math.max(explorerView.items?.length ?? 0, explorerView.count ?? 0),
		getScrollElement: useCallback(() => explorerView.ref.current, [explorerView.ref]),
		estimateSize: useCallback(() => ROW_HEIGHT, []),
		paddingStart: 8,
		paddingEnd: 8 + (explorerView.scrollPadding?.bottom ?? 0),
		// scrollMargin: listOffset,
		overscan: explorer.overscan ?? 10,
		scrollPaddingStart: explorerView.scrollPadding?.top,
		scrollPaddingEnd: explorerView.scrollPadding?.bottom
	});

	const virtualRows = rowVirtualizer.getVirtualItems();

	return (
		<div>
			<div className="relative" style={{ height: `${rowVirtualizer.getTotalSize()}px` }}>
				<div
					className="absolute left-0 top-0 min-w-full"
					style={{
						transform: `translateY(${
							(virtualRows[0]?.start ?? 0) - rowVirtualizer.options.scrollMargin
						}px)`
					}}
				>
					{virtualRows.map((virtualRow) => {
						const row = explorerView.items?.[virtualRow.index];
						if (!row) return null;

						const itemData = getExplorerItemData(row);

						const previousRow = explorerView.items?.[virtualRow.index - 1];
						const nextRow = explorerView.items?.[virtualRow.index + 1];

						return (
							<div
								key={virtualRow.key}
								data-index={virtualRow.index}
								ref={rowVirtualizer.measureElement}
								className="relative"
							>
								<ColumnsViewItem
									data={row}
									// selected={itemData.name === 'spacedrive'}
								/>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}
