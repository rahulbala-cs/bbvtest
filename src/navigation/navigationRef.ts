import { createNavigationContainerRef } from '@react-navigation/native'

export const navigationRef = createNavigationContainerRef<any>()

export function openDrawerSafely() {
	try {
		if (navigationRef.isReady()) {
			navigationRef.dispatch({
				type: 'OPEN_DRAWER',
			})
		}
	} catch (_) {}
}


