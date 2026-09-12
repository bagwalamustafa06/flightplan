// Tab switching between Plan and Live portal views.
// No calculation or aircraft-data logic lives here — see calculations.js,
// planner.js and portal.js for that.

(function () {
  const tabPlan = document.getElementById('tab-plan');
  const tabPortal = document.getElementById('tab-portal');
  const planView = document.getElementById('plan-view');
  const portalView = document.getElementById('portal-view');

  function activate(tab) {
    const showPlan = tab === 'plan';

    tabPlan.classList.toggle('is-active', showPlan);
    tabPortal.classList.toggle('is-active', !showPlan);
    tabPlan.setAttribute('aria-selected', String(showPlan));
    tabPortal.setAttribute('aria-selected', String(!showPlan));

    planView.hidden = !showPlan;
    portalView.hidden = showPlan;
    planView.classList.toggle('is-hidden', !showPlan);
    portalView.classList.toggle('is-hidden', showPlan);
  }

  tabPlan.addEventListener('click', () => activate('plan'));
  tabPortal.addEventListener('click', () => activate('portal'));
})();
