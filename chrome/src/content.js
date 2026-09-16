// ============================================================
// YouTube Shorts Auto Scroller - Content Script
// ============================================================

const api = globalThis.browser || globalThis.chrome;

// State Variables
let applicationIsOn = true;
let isScrolling = false;
let lastRecordedTime = 0;
let currentVideo = null;
let checkInterval = null;

// Helper: Check if current page is YouTube Shorts
function isShortsPage() {
	return (
		window.location.pathname.includes('/shorts') ||
		window.location.pathname.includes('/hashtag/shorts') ||
		Boolean(document.querySelector('ytd-shorts'))
	);
}

// Helper: Get active video element
function getActiveVideo() {
	// 1. Inside active reel renderer
	const activeReel = document.querySelector('ytd-reel-video-renderer[is-active]');
	if (activeReel) {
		const vid = activeReel.querySelector('video');
		if (vid) return vid;
	}

	// 2. Currently playing video
	const allVideos = [...document.querySelectorAll('video')];
	const playing = allVideos.find((v) => !v.paused && v.duration > 0);
	if (playing) return playing;

	// 3. Any video with valid duration
	return allVideos.find((v) => v.duration > 0) || allVideos[0] || null;
}

// Click the next button inside #navigation-button-down
function clickNextButton() {
	const selectors = [
		'#navigation-button-down button',
		'#navigation-button-down > ytd-button-renderer > yt-button-shape > button',
		'#navigation-button-down yt-button-shape button',
		'#navigation-button-down ytd-button-renderer',
		'#navigation-button-down',
		'button[aria-label="Next video"]',
		'button[aria-label="Next Video"]'
	];

	for (const sel of selectors) {
		const el = document.querySelector(sel);
		if (el) {
			console.log(`[Auto-Scroll] Triggered next button via '${sel}'`);
			el.click();
			return true;
		}
	}

	console.warn('[Auto-Scroll] Could not find next button in DOM');
	return false;
}

// Expose on window for easy DevTools console testing
window.clickNextShortButton = clickNextButton;

// Show subtle floating toast notification on screen
function showToast(message, isSuccess = true) {
	const existingToast = document.getElementById('yt-shorts-scroller-toast');
	if (existingToast) existingToast.remove();

	const toast = document.createElement('div');
	toast.id = 'yt-shorts-scroller-toast';
	toast.innerText = message;
	Object.assign(toast.style, {
		position: 'fixed',
		bottom: '24px',
		right: '24px',
		backgroundColor: isSuccess ? 'rgba(46, 125, 50, 0.92)' : 'rgba(33, 33, 33, 0.92)',
		color: '#ffffff',
		padding: '10px 18px',
		borderRadius: '8px',
		fontSize: '14px',
		fontWeight: '600',
		fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
		zIndex: '999999',
		boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
		pointerEvents: 'none',
		transition: 'opacity 0.3s ease, transform 0.3s ease',
		opacity: '0',
		transform: 'translateY(10px)'
	});

	document.body.appendChild(toast);
	requestAnimationFrame(() => {
		toast.style.opacity = '1';
		toast.style.transform = 'translateY(0)';
	});

	setTimeout(() => {
		toast.style.opacity = '0';
		toast.style.transform = 'translateY(10px)';
		setTimeout(() => toast.remove(), 300);
	}, 1600);
}

// Action when short has genuinely finished
function onVideoCompleted(reason) {
	if (!applicationIsOn || isScrolling || !isShortsPage()) return;

	console.log(`[Auto-Scroll] Short finished (${reason})! Advancing to next Short...`);
	isScrolling = true;
	lastRecordedTime = 0;

	clickNextButton();

	// Debounce to allow YouTube to transition to the new short
	setTimeout(() => {
		isScrolling = false;
	}, 1200);
}

// Check if the video has actually finished (no premature cutoff)
function checkCompletion(video) {
	if (!video || !video.duration || video.duration <= 0) return;

	// 1. Native HTML5 ended property
	if (video.ended) {
		onVideoCompleted('video.ended === true');
		return;
	}

	// 2. Exact end of playback reached
	if (video.currentTime >= video.duration) {
		onVideoCompleted('currentTime >= duration');
		return;
	}

	// 3. Loop wraparound detection:
	// YouTube resets currentTime from near duration back to 0 when it loops
	const wasNearEnd = lastRecordedTime > 0 && lastRecordedTime >= video.duration - 0.8;
	const loopedBackToStart = video.currentTime < 0.5 && video.currentTime < lastRecordedTime - 1.0;

	if (wasNearEnd && loopedBackToStart) {
		onVideoCompleted('loop wraparound detected');
		return;
	}

	// 4. Progress bar / scrubber completed (100%)
	const scrubber = document.querySelector('.ytPlayerProgressBarDragContainer[role="slider"]');
	if (scrubber) {
		const val = parseFloat(scrubber.getAttribute('aria-valuenow'));
		if (val >= 100) {
			onVideoCompleted('scrubber aria-valuenow 100%');
			return;
		}
	}

	// Record current time for the next frame check
	lastRecordedTime = video.currentTime;
}

// Video ended event listener
function handleVideoEnded() {
	if (!applicationIsOn) return;
	onVideoCompleted('ended event fired');
}

// Video timeupdate watcher
function handleTimeUpdate(e) {
	if (!applicationIsOn || isScrolling) return;
	checkCompletion(e.target);
}

// Reset tracking when new video loads or plays from start
function handlePlaying(e) {
	const vid = e.target;
	if (vid && vid.currentTime < 1.0) {
		lastRecordedTime = 0;
	}
}

// Monitor video element and attach listeners
function monitorVideo() {
	if (!isShortsPage()) return;

	const video = getActiveVideo();
	if (!video) return;

	if (video !== currentVideo) {
		if (currentVideo) {
			currentVideo.removeEventListener('ended', handleVideoEnded);
			currentVideo.removeEventListener('timeupdate', handleTimeUpdate);
			currentVideo.removeEventListener('playing', handlePlaying);
		}

		currentVideo = video;
		lastRecordedTime = currentVideo.currentTime || 0;

		currentVideo.addEventListener('ended', handleVideoEnded);
		currentVideo.addEventListener('timeupdate', handleTimeUpdate);
		currentVideo.addEventListener('playing', handlePlaying);
	}

	// Manage loop attribute
	if (applicationIsOn) {
		if (currentVideo.loop || currentVideo.hasAttribute('loop')) {
			currentVideo.loop = false;
			currentVideo.removeAttribute('loop');
		}
	} else {
		if (!currentVideo.loop || !currentVideo.hasAttribute('loop')) {
			currentVideo.loop = true;
			currentVideo.setAttribute('loop', '');
		}
	}
}

// Periodic check: monitors video and detects completion every 100ms
function checkStatus() {
	if (!isShortsPage()) return;

	monitorVideo();

	if (applicationIsOn && !isScrolling && currentVideo) {
		checkCompletion(currentVideo);
	}
}

// Toggle auto-scrolling
async function toggleAutoScroll(forcedState = null) {
	const newState = forcedState !== null ? forcedState : !applicationIsOn;
	applicationIsOn = newState;

	await api.storage.local.set({ applicationIsOn: newState });

	if (currentVideo) {
		if (applicationIsOn) {
			currentVideo.loop = false;
			currentVideo.removeAttribute('loop');
		} else {
			currentVideo.loop = true;
			currentVideo.setAttribute('loop', '');
		}
	}

	showToast(`Auto-Scroll: ${applicationIsOn ? 'ON' : 'OFF'}`, applicationIsOn);
}

// Keyboard shortcut listener (Shift + S)
window.addEventListener('keydown', (e) => {
	const target = e.target;
	if (
		target.tagName === 'INPUT' ||
		target.tagName === 'TEXTAREA' ||
		target.isContentEditable
	) {
		return;
	}

	if (e.shiftKey && (e.code === 'KeyS' || e.key === 'S' || e.key === 's')) {
		e.preventDefault();
		toggleAutoScroll();
	}
});

// Storage sync listener
api.storage.onChanged.addListener((changes, area) => {
	if (area === 'local' && changes.applicationIsOn !== undefined) {
		applicationIsOn = changes.applicationIsOn.newValue;
		if (currentVideo) {
			if (applicationIsOn) {
				currentVideo.loop = false;
				currentVideo.removeAttribute('loop');
			} else {
				currentVideo.loop = true;
				currentVideo.setAttribute('loop', '');
			}
		}
	}
});

// Message listener from popup
api.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.toggle) {
		const desiredState =
			message.state !== undefined ? message.state : !applicationIsOn;
		toggleAutoScroll(desiredState);
		sendResponse({ success: true, applicationIsOn });
	}
	return true;
});

// SPA Navigation listener (YouTube page transitions)
window.addEventListener('yt-navigate-finish', () => {
	if (isShortsPage()) {
		lastRecordedTime = 0;
		monitorVideo();
	}
});

// Periodic monitoring loop (checks every 100ms)
function startMonitoring() {
	if (checkInterval) clearInterval(checkInterval);
	checkInterval = setInterval(checkStatus, 100);
}

// Initialization
(async function init() {
	try {
		const result = await api.storage.local.get(['applicationIsOn']);
		applicationIsOn = result.applicationIsOn ?? true;
	} catch (err) {
		applicationIsOn = true;
	}

	startMonitoring();
})();
