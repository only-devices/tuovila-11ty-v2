
/* ---- Utilities ---- */
function generateRandomInt(max) {
    return Math.floor(Math.random() * max) + 1;
}

// Reset all input fields on the page
function resetInputs() {
    var elements = document.getElementsByTagName("input");
    for (var ii = 0; ii < elements.length; ii++) {
        if (elements[ii].type === "text") {
            elements[ii].value = "";
        }
    }
}

/* Retrieve CS SR Link */
function retrieveReplayLink() {
    var srLink = 'https://www.tuovila.com/fake-link';
    if (typeof CS_CONF !== 'undefined' && CS_CONF.integrations_handler !== 'undefined') {
        if (CS_CONF && CS_CONF.integrations_handler && CS_CONF.integrations_handler.getReplayLink()) {
            var srLink = CS_CONF.integrations_handler.getReplayLink();
        }
    }
    return srLink;
}

/* Modal trigger with CS Replay link every time */
function triggerModal(dynModalTitle, dynModalBody) {
    var infoModal = document.getElementById('infoModal');
    infoModal.addEventListener('show.bs.modal', function () {
        // Update the modal's content.
        var modalTitle = infoModal.querySelector('.modal-title');
        var modalBody = infoModal.querySelector('.modal-body');
        modalTitle.textContent = dynModalTitle;
        var replayLink = retrieveReplayLink();
        modalBody.innerHTML = dynModalBody + `<br/><br/>👉 SR link: <a href="${replayLink}">${replayLink}</a>`;
    })
    var bsInfoModal = new bootstrap.Modal(document.getElementById('infoModal'));
    bsInfoModal.show();
}

/* ---- Dark mode ---- */

const darkModeToggle = document.getElementById('darkModeToggle');
const body = document.body;
const navElements = document.querySelectorAll('[class^="nav"]');

function setDarkMode() {
    body.classList.toggle('dark-mode');
    navElements.forEach(i => {
        i.classList.toggle("navbar-dark");
    });
}

darkModeToggle.addEventListener('click', () => {
    setDarkMode();
    // Update aria-label for accessibility
    if (body.classList.contains('dark-mode')) {
        darkModeToggle.setAttribute('aria-label', 'Toggle light mode');
    } else {
        darkModeToggle.setAttribute('aria-label', 'Toggle dark mode');
    }

    // Save preference to localStorage
    localStorage.setItem('darkMode', body.classList.contains('dark-mode'));
});

// Check for saved user preference
const savedDarkMode = localStorage.getItem('darkMode');

if (savedDarkMode === 'true') {
    setDarkMode();
    darkModeToggle.setAttribute('aria-label', 'Toggle light mode');
}

/* ---- UNIBOX ---- */

function unibox() {
    window._uxa = window._uxa || [];
    var e = document.getElementById('unibox-select');
    var v = document.getElementById('unibox-input');
    if (e.value) {
        console.log('*** Unibox ACTIVATED! - ' + e.value + ' method detected. Transmission rendering... ***')
        if (v.value) {
            if (e.value === 'ui') {
                window._uxa.push(['trackPageEvent', '@user-identifier@' + v.value]);
            }
            if (e.value === 'dv') {
                window._uxa.push(['trackDynamicVariable', { 'key': 'Unibox Testing', 'value': v.value }]);
            }
            if (e.value === 'cv') {
                window._uxa.push(['setCustomVariable', 20, 'Unibox Testing', v.value, 4]);
                window._uxa.push(['trackPageview']);
            }
            if (e.value === 'pe') {
                window._uxa.push(['trackPageEvent', v.value]);
            }
            if (e.value === 'heapuser') {
                heap.identify(v.value);
            }
            triggerModal('Boom!', `Success! ${v.value} was pushed as selected. You're welcome.`);
            resetInputs();
        } else {
            triggerModal('You\'re doing it wrong 😨', '🚫 Try again, but the correct way this time');
            resetInputs();
        }
    }
}

/* ---- Contentsquare - ETR function ---- */
function triggerRecording(recType) {
    window._uxa = window._uxa || [];
    console.log(recType);
    if (recType === 'ETP') {
        window._uxa.push(['trackEventTriggerRecording', '@ETP@buttonClicked']);
    }
    if (recType === 'ETS') {
        window._uxa.push(['trackEventTriggerRecording', '@ETS@buttonClicked']);
    }
    console.log(`*** ${recType} recording triggered! ***`);
}

/* ---- Contentsquare - Exclude SR function ---- */
function excludeCsRecording(urlRegex) {
    window._uxa = window._uxa || [];
    console.log(urlRegex);
    window._uxa.push(['excludeURLforReplay', urlRegex]);
    triggerModal('Session Replay Exclusion Rule Set!', `Success! Pages with paths matching regex: <b>${urlRegex}</b> will be excluded from Session Replay recording for this session! To test, browse to any page matching that URL pattern NOW!`);
    resetInputs();
}

/* ---- Contentsquare - setEncryptionSelectors function ---- */
function setEncryptedCaptures(encryptEls) {
    window._uxa = window._uxa || [];
    console.log('*** Encrypting selectors: ' + encryptEls);
    window._uxa.push(['setEncryptionSelectors', encryptEls]);
    triggerModal('Controlled Exposure Rule Set!', `Success! The following elements will be captured and encrypted: <b>${encryptEls}</b>`);
    resetInputs();
}
/* Contentsquare - Errors */

function setError(errType) {
    window._uxa = window._uxa || [];
    var errId = generateRandomInt(1000000);
    var apiUrl = document.location.origin + '/api/fake';
    console.log('*** Error triggered: ' + errType);
    if (errType === 'custom') {
        window._uxa.push([
            'trackError',
            'FATAL: Manually generated custom error!',
            {
                type: 'custom',
                initiator: 'button_click',
                errId: errId
            }
        ]);
        heap.track('Error', { 'id': errId });
        console.error('Custom error: ' + errId);
        triggerModal('Custom Error Triggered', '🖌 Personalization is so important. You really made that one yours.')
    } if (errType === 'js') {
        try {
            window._uxa.buttonPush(['fakeError']);
        } catch (error) {
            heap.track('Error', { 'message': error });
            console.error(error);
        }
        triggerModal('JavaScript Error Triggered', '💪 Well done.')
    } if (errType === 'api') {
        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'X-Tuovila-Key': '12345678',
                'X-Tuovila-Host': 'tuovila.com',
                'X-Tuovila-Content': '{"username": "test", "email": "fake@email.com", "source": "tuovila.com", "auth_code": "1234"}'
            },
        })
            .catch(err => heap.track('Error', { 'message': err }));
        triggerModal('API Error Triggered', '🤖 Beep. Boop. Boom.')
    }
}