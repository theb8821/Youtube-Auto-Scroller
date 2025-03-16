// VARIABLES
const YOUTUBE_LINK = 'youtube.com';
const toggleBtn = document.querySelector('.toggleBtn');
const validUrls = [`${YOUTUBE_LINK}/shorts`, `${YOUTUBE_LINK}/hashtag/shorts`];

// Create error message element
const errMsg = document.createElement('div');
errMsg.style.color = 'red';
errMsg.style.marginTop = '1rem';
errMsg.style.textAlign = 'center';
document.body.appendChild(errMsg);

getAllSettingsForPopup();

// Listens to toggle button click
document.onclick = (e) => {
	if (e.target.classList.contains('toggleBtn')) {
		chrome.tabs.query({ active: true, currentWindow: true }).then(async (tabs) => {
			if (validUrls.some((url) => tabs[0]?.url?.includes(url))) {
				try {
					await chrome.tabs.sendMessage(tabs[0].id, { toggle: true }, (response) => {
						if (!response?.success) {
							errMsg.innerText = 'Please refresh the page and try again!';
						} else {
							errMsg.innerText = ''; // Clear error message on success
						}
					});
				} catch (error) {
					errMsg.innerText = 'Error: Could not communicate with the page';
				}
			} else {
				errMsg.innerText = 'Only works for Youtube!';
			}
		});
	}
};

function changeToggleButton(result) {
	toggleBtn.innerText = result ? 'Stop' : 'Start';
	toggleBtn.classList.remove(result ? 'start' : 'stop');
	toggleBtn.classList.add(result ? 'stop' : 'start');
}

function getAllSettingsForPopup() {
	// Since scrollOnComments feature was removed (as noted in content.js),
	// we can simplify this function to only handle the toggle button state
	chrome.storage.onChanged.addListener((result) => {
		if (result['applicationIsOn']?.newValue !== undefined) {
			changeToggleButton(result['applicationIsOn'].newValue);
		}
	});

	chrome.storage.local.get(['applicationIsOn']).then((result) => {
		if (result['applicationIsOn'] == null) {
			changeToggleButton(true);
		} else {
			changeToggleButton(result['applicationIsOn']);
		}
	});
}
