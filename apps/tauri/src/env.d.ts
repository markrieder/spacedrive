/// <reference types="vite/client" />

interface SpacedriveGlobal {
	showContextMenu?: (
		items: import("@sd/interface").ContextMenuItem[],
		position: { x: number; y: number }
	) => Promise<void>;
	registerKeybind?: (
		id: string,
		accelerator: string,
		handler: () => void | Promise<void>
	) => Promise<void>;
	unregisterKeybind?: (id: string) => Promise<void>;
}

interface Window {
	__SPACEDRIVE__: SpacedriveGlobal;
}
