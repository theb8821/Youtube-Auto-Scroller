// On installation show html page and set applicationIsOn to true, + settings
browser.runtime.onInstalled.addListener(async () => {
	await browser.storage.local.set({ applicationIsOn: true });
	await browser.storage.local.set({ scrollOnComments: false });
	await browser.storage.local.set({ shortCutKeys: ['shift', 's'] });
	await browser.storage.local.set({ shortCutInteractKeys: ['shift', 'f'] });
});
browser.runtime.onUpdateAvailable.addListener(() => {
	browser.runtime.reload();
});
