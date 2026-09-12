// ===================================================================
// planner.js
// ---------------------------------------------------------------
// Wires up the "Plan" view only. All the actual math lives in
// calculations.js — this file just reads inputs, calls it, and
// writes the results into the DOM.
// ===================================================================

(function () {
  const aircraftSelect = document.getElementById('aircraft-select');
  const distanceNmInput = document.getElementById('distance-nm');
  const distanceKmInput = document.getElementById('distance-km');
  const calculateBtn = document.getElementById('calculate-btn');
  const planNote = document.getElementById('plan-note');

  let syncing = false;

  // Keep the nm and km distance fields in sync, whichever one the
  // person is actually typing into.
  distanceNmInput.addEventListener('input', () => {
    if (syncing) return;
    syncing = true;
    const nm = parseFloat(distanceNmInput.value);
    distanceKmInput.value = isNaN(nm) ? '' : Math.round(nmToKm(nm));
    syncing = false;
  });

  distanceKmInput.addEventListener('input', () => {
    if (syncing) return;
    syncing = true;
    const km = parseFloat(distanceKmInput.value);
    distanceNmInput.value = isNaN(km) ? '' : Math.round(kmToNm(km));
    syncing = false;
  });

  function setReadout(id, value, unit) {
    const el = document.getElementById(id);
    if (!el) return;
    const valueEl = el.querySelector('.readout__value');
    const unitEl = el.querySelector('.readout__unit');
    valueEl.childNodes[0].nodeValue = value + ' ';
    if (unit) unitEl.textContent = unit;
  }

  function clearProfile() {
    setReadout('readout-takeoff', '—');
    setReadout('readout-cruise-speed', '—');
    setReadout('readout-cruise-alt', '—');
    setReadout('readout-descent-speed', '—');
    setReadout('readout-tod', '—');
    setReadout('readout-rod', '—');
    setReadout('readout-approach-speed', '—');
    setReadout('readout-flight-level', '—');
  }

  calculateBtn.addEventListener('click', () => {
    const aircraftKey = aircraftSelect.value;
    const distanceNm = parseFloat(distanceNmInput.value);

    if (!aircraftKey) {
      planNote.textContent = 'Select an aircraft first.';
      return;
    }
    if (isNaN(distanceNm) || distanceNm <= 0) {
      planNote.textContent = 'Enter a net distance greater than zero.';
      return;
    }

    const profile = buildFlightProfile(aircraftKey, distanceNm);
    if (!profile) {
      clearProfile();
      planNote.textContent = 'Could not build a profile for that input.';
      return;
    }

    setReadout('readout-takeoff', profile.takeoffSpeedKt, 'kt');
    setReadout('readout-cruise-speed', profile.cruiseSpeedKt, 'kt');
    setReadout('readout-cruise-alt', profile.cruiseAltFt.toLocaleString(), 'ft');
    setReadout('readout-descent-speed', profile.descentSpeedKt, 'kt');
    setReadout('readout-tod', profile.topOfDescentNm, 'nm before dest.');
    setReadout('readout-rod', profile.descentVerticalSpeedFpm, 'ft/min');
    setReadout('readout-approach-speed', profile.approachSpeedKt, 'kt');
    setReadout('readout-flight-level', 'FL' + Math.round(profile.cruiseAltFt / 100), 'rule-based');

    planNote.textContent = 'Profile based on a 3-degree descent path and typical reference speeds for this type — not certified performance data.';
  });
})();
