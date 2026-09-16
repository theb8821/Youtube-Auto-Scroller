// Universal browser API reference
const api = globalThis.browser || globalThis.chrome;

const toggleBtn = document.getElementById('toggleBtn');
const statusDot = document.getElementById('statusDot');
const statusText = document.getElementById('statusText');
const errMsg = document.getElementById('errMsg');

let currentApplicationState = true;

function renderState(isOn) {
	currentApplicationState = isOn;
	if (isOn) {
		toggleBtn.innerText = 'Stop';
		toggleBtn.className = 'toggleBtn stop';
		statusDot.className = 'status-dot active';
		statusText.innerText = 'Auto-scroll is Active';
	} else {
		toggleBtn.innerText = 'Start';
		toggleBtn.className = 'toggleBtn start';
		statusDot.className = 'status-dot';
		statusText.innerText = 'Auto-scroll is Paused';
	}
}

// Initialize popup settings
function initPopup() {
	api.storage.local.get(['applicationIsOn']).then((result) => {
		const isOn = result.applicationIsOn ?? true;
		renderState(isOn);
	}).catch(() => {
		renderState(true);
	});

	// Listen for state changes (e.g. from keyboard shortcut)
	api.storage.onChanged.addListener((changes, area) => {
		if (area === 'local' && changes.applicationIsOn !== undefined) {
			renderState(changes.applicationIsOn.newValue);
		}
	});
}

// Toggle handler
toggleBtn.addEventListener('click', async () => {
	const newState = !currentApplicationState;
	errMsg.innerText = '';

	// 1. Update storage
	await api.storage.local.set({ applicationIsOn: newState });
	renderState(newState);

	// 2. Notify active tab if it is YouTube Shorts
	try {
		const tabs = await api.tabs.query({ active: true, currentWindow: true });
		const activeTab = tabs[0];
		if (activeTab?.id) {
			const isShorts = activeTab.url && (activeTab.url.includes('youtube.com/shorts') || activeTab.url.includes('youtube.com/hashtag/shorts'));
			if (isShorts) {
				api.tabs.sendMessage(activeTab.id, { toggle: true, state: newState }).catch(() => {
					// Content script may not be loaded yet or page needs refresh
				});
			}
		}
	} catch (err) {
		console.warn('Tab communication error:', err);
	}
});

initPopup();
