// ===================================================================
// calculations.js
// ---------------------------------------------------------------
// Pure functions only — no DOM access. planner.js and portal.js both
// call into this file so the underlying math exists in exactly one
// place. See the design notes for the theory behind each formula:
//   - Top of descent: the 3:1 rule (3 nm per 1,000 ft to lose)
//   - Vertical speed: groundspeed x tan(3 degrees), which simplifies
//     to the well-known "groundspeed x 5" shortcut for a 3-degree path
//   - Final approach speed: Vref = 1.3 x Vs0 (published directly per
//     aircraft where available)
// ===================================================================

const NM_PER_KM = 1 / 1.852;
const KM_PER_NM = 1.852;

/** Convert nautical miles to kilometers. */
function nmToKm(nm) {
  return nm * KM_PER_NM;
}

/** Convert kilometers to nautical miles. */
function kmToNm(km) {
  return km * NM_PER_KM;
}

/** Look up an aircraft's reference data by its select-option key. */
function getAircraft(key) {
  return AIRCRAFT_DATA[key] || null;
}

/**
 * Suggest a cruise flight level for the sector, based on the
 * aircraft's typical/optimum altitude and the sector distance.
 * Short sectors don't get enough time to climb, stabilize and
 * descend efficiently at the aircraft's full optimum altitude, so
 * this steps the suggestion down for shorter distances.
 *
 * This does NOT apply the ICAO semicircular (hemispheric) rule,
 * because that requires the magnetic track between origin and
 * destination, and this app only takes a net distance, not
 * coordinates or a heading.
 */
function suggestCruiseAltitude(aircraft, distanceNm) {
  if (!aircraft || !distanceNm || distanceNm <= 0) return null;

  let fraction;
  if (distanceNm < 150) {
    fraction = 0.55;
  } else if (distanceNm < 400) {
    fraction = 0.75;
  } else if (distanceNm < 800) {
    fraction = 0.9;
  } else {
    fraction = 1.0;
  }

  const target = aircraft.cruiseAltFt * fraction;
  // Round to the nearest 1,000 ft, matching how flight levels are set.
  return Math.round(target / 1000) * 1000;
}

/**
 * Top of descent, in nm before the destination, using the 3:1 rule:
 * 3 nm of track distance for every 1,000 ft to lose, plus a fixed
 * buffer for deceleration from cruise/descent speed down to
 * approach speed.
 */
function getTopOfDescentNm(cruiseAltFt, targetAltFt = 1500, bufferNm = 10) {
  if (!cruiseAltFt || cruiseAltFt <= targetAltFt) return null;
  const altToLoseThousands = (cruiseAltFt - targetAltFt) / 1000;
  return Math.round(altToLoseThousands * 3 + bufferNm);
}

/**
 * Vertical speed (rate of descent) to hold a 3-degree descent path
 * at a given groundspeed: ROD = groundspeed x tan(3deg) x 101.3,
 * which simplifies to the standard "groundspeed x 5" shortcut.
 */
function getDescentVerticalSpeed(groundspeedKt) {
  if (!groundspeedKt || groundspeedKt <= 0) return null;
  return Math.round(groundspeedKt * 5);
}

/**
 * Full profile for the pre-flight planning view: takeoff, cruise,
 * descent and approach speeds, suggested cruise altitude, top of
 * descent and the vertical speed to plan for.
 */
function buildFlightProfile(aircraftKey, distanceNm) {
  const aircraft = getAircraft(aircraftKey);
  if (!aircraft) return null;

  const cruiseAltFt = suggestCruiseAltitude(aircraft, distanceNm);
  const tod = getTopOfDescentNm(cruiseAltFt || aircraft.cruiseAltFt);
  const rod = getDescentVerticalSpeed(aircraft.descentSpeedKt);

  return {
    aircraft,
    takeoffSpeedKt: aircraft.takeoffSpeedKt,
    cruiseSpeedKt: aircraft.cruiseSpeedKt,
    cruiseAltFt: cruiseAltFt || aircraft.cruiseAltFt,
    descentSpeedKt: aircraft.descentSpeedKt,
    topOfDescentNm: tod,
    descentVerticalSpeedFpm: rod,
    approachSpeedKt: aircraft.approachSpeedKt
  };
}

/**
 * Live descent advisory for the portal view.
 *
 * Compares the current altitude against the altitude the 3:1 rule
 * says the aircraft should be at, given the remaining distance, to
 * classify the aircraft as on/above/below profile, and returns a
 * target vertical speed and target speed to correct or maintain it.
 */
function getLiveAdvisory(aircraftKey, currentSpeedKt, currentAltFt, distanceRemainingNm, targetAltFt = 1500) {
  const aircraft = getAircraft(aircraftKey);
  if (!aircraft || !currentSpeedKt || currentAltFt == null || !distanceRemainingNm) {
    return null;
  }

  const bufferNm = 10;
  const usableDistanceNm = Math.max(distanceRemainingNm - bufferNm, 0);

  // Altitude the 3:1 rule expects at this distance from the destination.
  const idealAltFt = targetAltFt + (usableDistanceNm / 3) * 1000;
  const deviationFt = currentAltFt - idealAltFt;

  let status;
  if (Math.abs(deviationFt) <= 500) {
    status = 'on';
  } else if (deviationFt > 500) {
    status = 'above';
  } else {
    status = 'below';
  }

  // Vertical speed needed to reach targetAltFt by the time distance
  // remaining reaches the deceleration buffer, at current groundspeed.
  const altToLoseFt = Math.max(currentAltFt - targetAltFt, 0);
  let targetRodFpm;
  if (usableDistanceNm > 0 && altToLoseFt > 0) {
    const timeMinutes = (usableDistanceNm / currentSpeedKt) * 60;
    targetRodFpm = timeMinutes > 0 ? Math.round(altToLoseFt / timeMinutes) : getDescentVerticalSpeed(currentSpeedKt);
  } else {
    targetRodFpm = getDescentVerticalSpeed(currentSpeedKt);
  }

  return {
    aircraft,
    status,
    deviationFt: Math.round(deviationFt),
    idealAltFt: Math.round(idealAltFt),
    targetRodFpm,
    targetSpeedKt: currentAltFt <= 3000 ? aircraft.approachSpeedKt : aircraft.descentSpeedKt
  };
}
