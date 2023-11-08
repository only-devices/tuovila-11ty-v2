
/* ---- Utilities ---- */
function generateRandomInt(max) {
    return Math.floor(Math.random() * max) + 1;
}

/* Retrieve CS SR Link */
function retrieveReplayLink() {
    var srLink = 'https://www.tuovila.com/fake-link';
    if (typeof CS_CONF !== 'undefined' && CS_CONF.integrations_handler !== 'undefined') {
        if (CS_CONF && CS_CONF.integrations_handler) {
        var srLink = CS_CONF.integrations_handler;
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
var darkMode = window.sessionStorage.getItem('darkMode');

function lightsOn() {
    document.querySelector('input[id="mode-toggle"]').checked = false;
    document.querySelector('.switch-label').innerText = 'Lights are on';
}

function lightsOff() {
    document.querySelector('input[id="mode-toggle"]').checked = true;
    document.querySelector('.switch-label').innerText = 'Lights are off';
}

if (!darkMode) {
    darkMode = false;
    lightsOn();
}
else if (darkMode === "true") {
    darkMode = true;
    lightsOff();
}
else {
    darkMode = false;
    lightsOn();
}
mode();
// Unhide page after darkMode config is processed to solve page flicker
document.body.classList.remove("fade");

function darkToggle() {
    toggle();
    mode();
}

function mode() {
    if (darkMode || darkMode) {
        document.querySelectorAll('*').forEach(i => { i.classList.add("dark") });
        lightsOff();
    }
    else {
        document.querySelectorAll('*').forEach(i => { i.classList.remove("dark") });
        lightsOn();
    }
}

function toggle() {
    darkMode = !darkMode;
    window.sessionStorage.setItem('darkMode', darkMode);
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
    alert(`Success! Pages with paths matching regex: '${urlRegex}' will be excluded from Session Replay recording for this session!`);
    resetInputs();
}

/* ---- Contentsquare - setEncryptionSelectors function ---- */
function setEncryptedCaptures(encryptEls) {
    window._uxa = window._uxa || [];
    console.log('*** Encrypting selectors: ' + encryptEls);
    window._uxa.push(['setEncryptionSelectors', encryptEls]);
    alert(`Success! The following elements will be captured and encrypted: '${encryptEls}'`);
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
        console.error('Custom error: ' + errId);
        triggerModal('Custom Error Triggered','🖌 Personalization is so important. You really made that one yours.')
    } if (errType === 'js') {
        try {
            window._uxa.buttonPush(['fakeError']);
        } catch (error) {
            console.error(error);
        }
        triggerModal('JavaScript Error Triggered','💪 Well done.')
    } if (errType === 'api') {
        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'X-Tuovila-Key': '12345678',
                'X-Tuovila-Host': 'tuovila.com',
                'X-Tuovila-Content': '{"username": "test", "email": "fake@email.com", "source": "tuovila.com", "auth_code": "1234"}'
            },
        })
            .catch(err => console.error(err));
            triggerModal('API Error Triggered','🤖 Beep. Boop. Boom.')
    }
}