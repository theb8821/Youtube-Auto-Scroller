// CONSTANT SELECTORS VARIABLES
const VIDEOS_LIST_SELECTOR = '.reel-video-in-sequence';
const NEXT_VIDEO_BUTTON_SELECTOR = '#navigation-button-down > ytd-button-renderer > yt-button-shape > button';
const LIKE_BUTTON_SELECTOR = 'ytd-reel-video-renderer[is-active] #like-button > yt-button-shape > label > button';
const DISLIKE_BUTTON_SELECTOR = 'ytd-reel-video-renderer[is-active] #dislike-button > yt-button-shape > label > button';
const COMMENTS_SELECTOR = 'body > ytd-app > ytd-popup-container > tp-yt-paper-dialog > ytd-engagement-panel-section-list-renderer > div';
// APP VARIABLES
let scrollOnCommentsCheck = false; // Keep this, default to false as per requirement

// STATE VARIABLES
let currentVideoIndex = null;
let applicationIsOn = false;
let scrollingIsDone = true;
let lastVideo = null;
// -------
async function startAutoScrolling() {
	if (!applicationIsOn) {
		applicationIsOn = true;
		// Save state to chrome storage, so it will be on next time on page load
		await chrome.storage.local.set({ applicationIsOn: true });
		if (window.location.href.includes('hashtag/shorts')) {
			// If on hashtag page, click on a shorts video to start the auto scrolling (WHEN THIS FUNCTION CALLED)
			document.querySelector("#thumbnail [aria-label='Shorts']").parentElement.parentElement.parentElement.click();
		}
	}
}
async function stopAutoScrolling() {
	if (applicationIsOn) {
		applicationIsOn = false;
		// Save state to chrome storage, so it will be off next time on page load
		await chrome.storage.local.set({ applicationIsOn: false });
	}
	const currentVideo = document.querySelector("#shorts-container video[tabindex='-1']");
	// Lets the video loop again
	if (currentVideo) currentVideo.setAttribute('loop', '');
}
async function checkForNewShort() {
	const currentVideo = document.querySelector("#shorts-container video[tabindex='-1']");
	// Check to see if the video has loaded
	if (isNaN(currentVideo?.duration) || currentVideo?.duration == null) return;
	// Checks if the application is on. If not, lets the video loop again
	if (!applicationIsOn) return currentVideo.setAttribute('loop', '');
	else currentVideo.removeAttribute('loop');
	const newCurrentShortsIndex = Array.from(document.querySelectorAll(VIDEOS_LIST_SELECTOR)).findIndex((e) => e.hasAttribute('is-active'));
	if (scrollingIsDone /*to prevent double scrolls*/) {
		if (newCurrentShortsIndex !== currentVideoIndex) {
			lastVideo?.removeEventListener('ended', videoFinished);
			lastVideo = currentVideo;
			currentVideoIndex = newCurrentShortsIndex;
		}
		if (!checkIfValidVideo()) {
			await scrollToNextShort();
			return;
		}
		currentVideo.addEventListener('ended', videoFinished);
	}
}
async function videoFinished() {
	const currentVideo = document.querySelector("#shorts-container video[tabindex='-1']");
	if (!applicationIsOn) return currentVideo.setAttribute('loop', '');

	// If the video is finished, check if the comments are open.
	const comments = document.querySelector(COMMENTS_SELECTOR);
	if (comments && comments.getBoundingClientRect().x > 0) {
		if (!scrollOnCommentsCheck) {
			// Only check if scrollOnCommentsCheck is false, otherwise always scroll
			let intervalComments = setInterval(async () => {
				if (!comments.getBoundingClientRect().x) {
					await scrollToNextShort();
					clearInterval(intervalComments);
				}
			}, 100);
			return;
		} else {
			// If the comments are open and the user wants to scroll on comments, close the comments (removed feature, so always scroll)
		}
	}
	await scrollToNextShort();
}
async function scrollToNextShort() {
	const currentVideoParent = getParentVideo();
	if (!currentVideoParent) return;
	const currentVideo = currentVideoParent.querySelector('video');
	if (!applicationIsOn) return currentVideo?.setAttribute('loop', '');

	scrollingIsDone = false;
	const nextVideoParent = document.getElementById(`${Number(currentVideoParent?.id) + 1}`);
	if (nextVideoParent) {
		nextVideoParent.scrollIntoView({
			behavior: 'smooth',
			block: 'center',
			inline: 'center',
		});
	} else {
		const nextButton = document.querySelector(NEXT_VIDEO_BUTTON_SELECTOR);
		if (nextButton) {
			nextButton.click();
		} else {
			currentVideo?.setAttribute('loop', '');
		}
	}
	setTimeout(() => {
		// Hardcoded timeout to make sure the video is scrolled before other scrolls are allowed
		scrollingIsDone = true;
	}, 700);
}
function checkIfValidVideo() {
	const currentVideoParent = getParentVideo();
	const currentVideo = currentVideoParent?.querySelector('video');
	if (!currentVideo) return false;
	if (!applicationIsOn) {
		currentVideo.setAttribute('loop', '');
		return false;
	}
	return true; // Always true now, filters removed
}
// Helper function to get the parent of the current short playing/played
function getParentVideo() {
	const VIDEOS_LIST = [...document.querySelectorAll(VIDEOS_LIST_SELECTOR)];
	return VIDEOS_LIST.find((e) => {
		return e.hasAttribute('is-active') && e.querySelector("#shorts-container video[tabindex='-1']");
	});
}
// Sets up the application with the settings from chrome storage
// Checks if the application is on and if it is, starts the application
// Creates an Interval to check for new shorts every 100ms
(function initiate() {
	chrome.storage.local.get(['applicationIsOn']).then(async (result) => {
		if (result['applicationIsOn'] == null) {
			return startAutoScrolling();
		}
		if (result['applicationIsOn']) await startAutoScrolling();
	});
	setInterval(checkForNewShort, 100);
})();

// Listens for toggle application from the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.toggle) {
		chrome.storage.local.get(['applicationIsOn']).then(async (result) => {
			if (!result['applicationIsOn']) await startAutoScrolling();
			if (result['applicationIsOn']) await stopAutoScrolling();
			sendResponse({ success: true });
		});
	}
	return true;
});
