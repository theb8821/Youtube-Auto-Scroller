// Universal browser API reference
const api = globalThis.browser || globalThis.chrome;

function updateBadge(isOn) {
	if (!api.action?.setBadgeText) return;
	const text = isOn ? 'ON' : 'OFF';
	const color = isOn ? '#2e7d32' : '#757575';
	try {
		api.action.setBadgeText({ text });
		api.action.setBadgeBackgroundColor({ color });
	} catch (e) {
		console.warn('Could not set badge:', e);
	}
}

// On installation initialize default settings and badge
api.runtime.onInstalled.addListener(async () => {
	await api.storage.local.set({
		applicationIsOn: true,
		scrollOnComments: false,
		shortCutKeys: ['shift', 's']
	});
	updateBadge(true);
});

// Update badge when storage changes
api.storage.onChanged.addListener((changes, area) => {
	if (area === 'local' && changes.applicationIsOn !== undefined) {
		updateBadge(changes.applicationIsOn.newValue);
	}
});

// Sync badge on startup
api.storage.local.get(['applicationIsOn']).then((result) => {
	const isOn = result.applicationIsOn ?? true;
	updateBadge(isOn);
}).catch(() => {
	updateBadge(true);
});

api.runtime.onUpdateAvailable?.addListener(() => {
	api.runtime.reload();
});
