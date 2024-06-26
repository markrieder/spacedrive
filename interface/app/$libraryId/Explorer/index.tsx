import { CSSProperties, Suspense, type PropsWithChildren, type ReactNode } from 'react';
import { FolderNotchOpen } from '@phosphor-icons/react';
import {
	explorerLayout,
	useExplorerLayoutStore,
	useLibrarySubscription,
	useRspcLibraryContext,
	useSelector
} from '@sd/client';
import { useShortcut } from '~/hooks';
import { useTopBarContext } from '../TopBar/Context';
import { useExplorerContext } from './Context';
import DismissibleNotice from './DismissibleNotice';
import { ExplorerPathBar, PATH_BAR_HEIGHT } from './ExplorerPathBar';
import { Inspector, INSPECTOR_WIDTH } from './Inspector';
import ExplorerContextMenu from './ParentContextMenu';
import { getQuickPreviewStore } from './QuickPreview/store';
import { explorerStore } from './store';
import { useKeyRevealFinder } from './useKeyRevealFinder';
import { ExplorerViewProps, View } from './View';

import 'react-slidedown/lib/slidedown.css';

import ContextMenu from './ContextMenu';
import { useExplorerDnd } from './useExplorerDnd';
import { useExplorerSearchParams } from './util';
import { EmptyNotice } from './View/EmptyNotice';
import { ExplorerTagBar, TAG_BAR_HEIGHT } from './ExplorerTagBar';
import clsx from 'clsx';

interface Props {
	emptyNotice?: ExplorerViewProps['emptyNotice'];
	contextMenu?: () => ReactNode;
}

/**
 * This component is used in a few routes and acts as the reference demonstration of how to combine
 * all the elements of the explorer except for the context, which must be used in the parent component.
 */
export default function Explorer(props: PropsWithChildren<Props>) {
	const explorer = useExplorerContext();
	const layoutStore = useExplorerLayoutStore();
	const [showInspector, showTagBar] = useSelector(explorerStore, (s) => [
		s.showInspector,
		s.isTagAssignModeActive
	]);

	const [{ path }] = useExplorerSearchParams();

	const showPathBar = explorer.showPathBar && layoutStore.showPathBar;
	const rspc = useRspcLibraryContext();
	// Can we put this somewhere else -_-
	useLibrarySubscription(['jobs.newThumbnail'], {
		onData: (thumbKey) => {
			explorerStore.addNewThumbnail(thumbKey);
		}
	});
	useLibrarySubscription(['jobs.newFilePathIdentified'], {
		onData: (ids) => {
			if (ids?.length > 0) {
				// I had planned to somehow fetch the Object, but its a lot more work than its worth given
				// id have to fetch the file_path explicitly and patch the query
				// for now, it seems to work a treat just invalidating the whole query
				rspc.queryClient.invalidateQueries(['search.paths']);
			}
		}
	});

	useShortcut('showPathBar', (e) => {
		e.stopPropagation();
		explorerLayout.showPathBar = !layoutStore.showPathBar;
	});

	useShortcut('showInspector', (e) => {
		e.stopPropagation();
		if (getQuickPreviewStore().open) return;
		explorerStore.showInspector = !explorerStore.showInspector;
	});

	useShortcut('showHiddenFiles', (e) => {
		e.stopPropagation();
		explorer.settingsStore.showHiddenFiles = !explorer.settingsStore.showHiddenFiles;
	});

	useKeyRevealFinder();

	useExplorerDnd();

	const topBar = useTopBarContext();

	const paths = [undefined, ...(path?.split('/').filter(Boolean) ?? [])];

	return (
		<>
			<ExplorerContextMenu>
				<div
					ref={explorer.scrollRef}
					className="flex flex-col flex-1 overflow-x-hidden custom-scroll explorer-scroll"
				>
					{explorer.items && explorer.items.length > 0 && <DismissibleNotice />}

					<div className="flex flex-1 overflow-hidden">
						<Suspense fallback={<SuspanceFb />}>
							{paths.map((path, i) => {
								const p = !path ? undefined : paths.slice(0, i + 1).join('/') + '/';
								return (
									<View
										key={path}
										style={
											{
												'--scrollbar-margin-top': `${topBar.topBarHeight}px`,
												'--scrollbar-margin-bottom': `${showPathBar ? PATH_BAR_HEIGHT + (showTagBar ? TAG_BAR_HEIGHT : 0) : 0}px`,
												'paddingTop': topBar.topBarHeight,
												'paddingRight': showInspector ? INSPECTOR_WIDTH : 0
											} as CSSProperties
										}
										path={p}
										contextMenu={props.contextMenu?.() ?? <ContextMenu />}
										emptyNotice={
											props.emptyNotice ?? (
												<EmptyNotice
													icon={FolderNotchOpen}
													message="This folder is empty"
												/>
											)
										}
										listViewOptions={{ hideHeaderBorder: true }}
										scrollPadding={{
											top: topBar.topBarHeight,
											bottom: showPathBar ? PATH_BAR_HEIGHT + (showTagBar ? TAG_BAR_HEIGHT : 0) : undefined
										}}
									/>
								);
							})}
						</Suspense>
					</div>
				</div>
			</ExplorerContextMenu>

			{/* TODO: wrap path bar and tag bar in nice wrapper, ideally animate tag bar in/out directly above path bar */}
			<div className="absolute inset-x-0 bottom-0 z-50 flex flex-col">
				{showTagBar && <ExplorerTagBar />}
				{showPathBar && <ExplorerPathBar />}
			</div>

			{showInspector && (
				<Inspector
					className={clsx(
						'no-scrollbar absolute right-1.5 top-0 pb-3 pl-3 pr-1.5'
					)}
					style={{
						paddingTop: topBar.topBarHeight + 12,
						bottom: showPathBar ? PATH_BAR_HEIGHT + (showTagBar ? TAG_BAR_HEIGHT : 0) : 0
					}}
				/>
			)}
		</>
	);
}

const SuspanceFb = () => {
	console.log('Loading...');

	return <div className="flex items-center justify-center size-full">Loading...</div>;
};
