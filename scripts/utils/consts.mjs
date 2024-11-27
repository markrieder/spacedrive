// this is temporarily hardcoded, just for the 0.4.3 release.
// PLEASE IF THIS EVER MAKES IT INTO MAIN FIX IT.
// keywords if someone needs to do a codebase search to find out why something breaks:
// (each one on a new line so they're apparent in VS Code search results)
// libav !!! FIX THIS
// libavcodec !!! FIX THIS
// libavformat !!! FIX THIS
// native-deps !!! FIX THIS
// ~ilynxcat 26/nov/2024
export const NATIVE_DEPS_URL =
	'https://github.com/spacedriveapp/native-deps/releases/download/v0.18'

export const NATIVE_DEPS_ASSETS = {
	Linux: {
		x86_64: {
			musl: 'native-deps-x86_64-linux-musl.tar.xz',
			glibc: 'native-deps-x86_64-linux-gnu.tar.xz',
		},
		aarch64: {
			musl: 'native-deps-aarch64-linux-musl.tar.xz',
			glibc: 'native-deps-aarch64-linux-gnu.tar.xz',
		},
	},
	Darwin: {
		x86_64: 'native-deps-x86_64-darwin-apple.tar.xz',
		aarch64: 'native-deps-aarch64-darwin-apple.tar.xz',
	},
	Windows_NT: {
		x86_64: 'native-deps-x86_64-windows-gnu.tar.xz ',
		aarch64: 'native-deps-aarch64-windows-gnu.tar.xz',
	},
	IOS: {
		iossim: {
			x86_64: 'native-deps-x86_64-iossim-apple.tar.xz',
			aarch64: 'native-deps-aarch64-iossim-apple.tar.xz',
		},
		ios: {
			aarch64: 'native-deps-aarch64-ios-apple.tar.xz',
		},
	},
}

/**
 * @param {Record<string, unknown>} constants
 * @param {string[]} identifiers
 * @returns {string?}
 */
export function getConst(constants, identifiers) {
	/** @type {string | Record<string, unknown>} */
	let constant = constants

	for (const id of identifiers) {
		constant = /** @type {string | Record<string, unknown>} */ (constant[id])
		if (!constant) return null
		if (typeof constant !== 'object') break
	}

	return typeof constant === 'string' ? constant : null
}
