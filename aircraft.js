// ===================================================================
// AIRCRAFT_DATA
// ---------------------------------------------------------------
// One entry per supported type. All speeds are in knots, altitudes
// in feet. These are TYPICAL / PUBLISHED reference values (the kind
// you'd find in a type-rating summary or quick-reference handbook),
// not weight-, temperature- or flap-setting-adjusted numbers from a
// specific aircraft's current AFM/POH. Treat every number here as a
// planning reference, not a certified performance figure.
//
// Fields:
//   name                 display name
//   takeoffSpeedKt       typical VR (rotate speed) at a representative weight
//   cruiseSpeedKt        typical true airspeed at cruiseAltFt
//   cruiseMach           typical cruise Mach number (for display only)
//   cruiseAltFt          typical/optimum cruise altitude for a medium-length sector
//   serviceCeilingFt     max practical cruise altitude for long sectors
//   descentSpeedKt       typical descent IAS (above the deceleration segment)
//   stallSpeedLandingKt  approximate Vs0 (stall speed, landing config)
//   approachSpeedKt      Vref, final approach speed (published; ~1.3 x Vs0)
// ===================================================================

const AIRCRAFT_DATA = {
  'a310-300': {
    name: 'Airbus A310-300',
    takeoffSpeedKt: 155,
    cruiseSpeedKt: 460,
    cruiseMach: 0.80,
    cruiseAltFt: 35000,
    serviceCeilingFt: 41000,
    descentSpeedKt: 300,
    stallSpeedLandingKt: 108,
    approachSpeedKt: 140
  },
  'a320neo': {
    name: 'Airbus A320neo',
    takeoffSpeedKt: 148,
    cruiseSpeedKt: 450,
    cruiseMach: 0.78,
    cruiseAltFt: 37000,
    serviceCeilingFt: 39000,
    descentSpeedKt: 280,
    stallSpeedLandingKt: 104,
    approachSpeedKt: 135
  },
  'a321lr': {
    name: 'Airbus A321LR',
    takeoffSpeedKt: 158,
    cruiseSpeedKt: 450,
    cruiseMach: 0.78,
    cruiseAltFt: 37000,
    serviceCeilingFt: 39000,
    descentSpeedKt: 280,
    stallSpeedLandingKt: 108,
    approachSpeedKt: 140
  },
  'a330': {
    name: 'Airbus A330',
    takeoffSpeedKt: 160,
    cruiseSpeedKt: 470,
    cruiseMach: 0.82,
    cruiseAltFt: 37000,
    serviceCeilingFt: 41000,
    descentSpeedKt: 300,
    stallSpeedLandingKt: 108,
    approachSpeedKt: 140
  },
  'beluga-xl': {
    name: 'Airbus Beluga XL',
    takeoffSpeedKt: 165,
    cruiseSpeedKt: 400,
    cruiseMach: 0.70,
    cruiseAltFt: 31000,
    serviceCeilingFt: 35000,
    descentSpeedKt: 260,
    stallSpeedLandingKt: 112,
    approachSpeedKt: 145
  },
  'b747-8i': {
    name: 'Boeing 747-8 Intercontinental',
    takeoffSpeedKt: 168,
    cruiseSpeedKt: 490,
    cruiseMach: 0.855,
    cruiseAltFt: 39000,
    serviceCeilingFt: 43000,
    descentSpeedKt: 320,
    stallSpeedLandingKt: 115,
    approachSpeedKt: 150
  },
  'b737-max': {
    name: 'Boeing 737 MAX',
    takeoffSpeedKt: 148,
    cruiseSpeedKt: 453,
    cruiseMach: 0.79,
    cruiseAltFt: 37000,
    serviceCeilingFt: 41000,
    descentSpeedKt: 280,
    stallSpeedLandingKt: 104,
    approachSpeedKt: 135
  },
  'cj4': {
    name: 'Cessna Citation CJ4',
    takeoffSpeedKt: 108,
    cruiseSpeedKt: 415,
    cruiseMach: 0.77,
    cruiseAltFt: 41000,
    serviceCeilingFt: 45000,
    descentSpeedKt: 250,
    stallSpeedLandingKt: 84,
    approachSpeedKt: 108
  }
};
