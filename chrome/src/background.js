// On installation show html page and set applicationIsOn to true, + settings
chrome.runtime.onInstalled.addListener(async () => {
	await chrome.storage.local.set({ applicationIsOn: true });
	await chrome.storage.local.set({ scrollOnComments: false });
	await chrome.storage.local.set({ shortCutKeys: ['shift', 's'] });
	await chrome.storage.local.set({ shortCutInteractKeys: ['shift', 'f'] });
});

chrome.runtime.onUpdateAvailable.addListener(() => {
	chrome.runtime.reload();
});
