import { CaretRight } from '@phosphor-icons/react';
import clsx from 'clsx';
import { memo } from 'react';
import { getItemFilePath, type ExplorerItem } from '@sd/client';

import { FileThumb } from '../../FilePath/Thumb';
import { RenamableItemText } from '../RenamableItemText';

export interface ColumnsViewItemProps {
	data: ExplorerItem;
	selected?: boolean;
	cut?: boolean;
}

export const ColumnsViewItem = memo((props: ColumnsViewItemProps) => {
	const filePath = getItemFilePath(props.data);

	const isHidden = filePath?.hidden;
	const isFolder = filePath?.is_dir;
	const isLocation = props.data.type === 'Location';

	return (
		<div
			className={clsx(
				'flex items-center rounded px-4 py-1 pr-3',
				props.selected && 'bg-accent'
			)}
		>
			<FileThumb
				data={props.data}
				frame
				frameClassName={clsx('!border', props.data.type === 'Label' && '!rounded-lg')}
				blackBars
				size={24}
				className={clsx('mr-0.5 transition-[height_width]', props.cut && 'opacity-60')}
			/>

			<div className="relative flex-1">
				<RenamableItemText
					item={props.data}
					selected={props.selected}
					allowHighlight={false}
					style={{ fontSize: 13 }}
					className="absolute top-1/2 z-10 max-w-full -translate-y-1/2"
					idleClassName="!w-full"
					editLines={3}
				/>
			</div>

			{isFolder && <CaretRight weight="bold" size={10} opacity={0.5} />}
		</div>
	);
});
