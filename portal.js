// ===================================================================
// portal.js
// ---------------------------------------------------------------
// Wires up the "Live portal" view only. All the actual math lives in
// calculations.js — this file just reads inputs, calls it, and
// writes the results into the DOM.
// ===================================================================

(function () {
  const aircraftSelect = document.getElementById('portal-aircraft-select');
  const speedInput = document.getElementById('current-speed');
  const altitudeInput = document.getElementById('current-altitude');
  const distanceInput = document.getElementById('distance-remaining');
  const updateBtn = document.getElementById('update-btn');
  const portalNote = document.getElementById('portal-note');

  const statusBand = document.getElementById('portal-status');
  const statusText = statusBand.querySelector('.status-band__text');
  const marker = document.getElementById('deviation-marker');

  const STATUS_LABEL = {
    on: 'On profile',
    above: 'Above profile — descend sooner',
    below: 'Below profile — level off or reduce descent'
  };

  const STATUS_COLOR = {
    on: 'var(--green)',
    above: 'var(--amber)',
    below: 'var(--red)'
  };

  function setReadout(id, value, unit) {
    const el = document.getElementById(id);
    if (!el) return;
    const valueEl = el.querySelector('.readout__value');
    const unitEl = el.querySelector('.readout__unit');
    valueEl.childNodes[0].nodeValue = value + ' ';
    if (unit) unitEl.textContent = unit;
  }

  function updateDeviationMarker(deviationFt) {
    const trackCenterPx = 48; // half of the 96px track height
    const maxOffsetPx = 40;
    const maxDeviationFt = 3000; // deviation beyond this pins the marker at the end of the track

    const clamped = Math.max(Math.min(deviationFt, maxDeviationFt), -maxDeviationFt);
    const offsetPx = (clamped / maxDeviationFt) * maxOffsetPx;

    // Positive deviation = above profile, which moves the marker up
    // (toward the "Above profile" label at the top of the track).
    marker.style.top = (trackCenterPx - offsetPx) + 'px';
  }

  updateBtn.addEventListener('click', () => {
    const aircraftKey = aircraftSelect.value;
    const currentSpeedKt = parseFloat(speedInput.value);
    const currentAltFt = parseFloat(altitudeInput.value);
    const distanceRemainingNm = parseFloat(distanceInput.value);

    if (!aircraftKey) {
      portalNote.textContent = 'Select an aircraft first.';
      return;
    }
    if ([currentSpeedKt, currentAltFt, distanceRemainingNm].some(v => isNaN(v))) {
      portalNote.textContent = 'Enter current speed, altitude and distance remaining.';
      return;
    }

    const advisory = getLiveAdvisory(aircraftKey, currentSpeedKt, currentAltFt, distanceRemainingNm);
    if (!advisory) {
      portalNote.textContent = 'Could not build an advisory for that input.';
      return;
    }

    statusBand.classList.remove('is-on', 'is-above', 'is-below');
    statusBand.classList.add('is-' + advisory.status);
    statusText.textContent = STATUS_LABEL[advisory.status];

    updateDeviationMarker(advisory.deviationFt);
    marker.style.background = STATUS_COLOR[advisory.status];

    setReadout('readout-target-rod', advisory.targetRodFpm, 'ft/min');
    setReadout('readout-target-speed', advisory.targetSpeedKt, 'kt');

    portalNote.textContent = 'Ideal altitude at this distance is about '
      + advisory.idealAltFt.toLocaleString() + ' ft, on a 3-degree path.';
  });
})();
