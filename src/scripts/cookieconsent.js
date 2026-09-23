import * as CookieConsent from 'vanilla-cookieconsent';


/* ==========================================================
   CONSENT MANAGEMENT
========================================================== */

function updateConsent() {

	const analyticsAllowed =
		CookieConsent.acceptedCategory('analytics');

	const marketingAllowed =
		CookieConsent.acceptedCategory('marketing');


	window.dataLayer = window.dataLayer || [];


	function gtag() {
		window.dataLayer.push(arguments);
	}


	/* ----------------------------------------------------------
	   GOOGLE CONSENT MODE
	---------------------------------------------------------- */

	gtag('consent', 'update', {

		analytics_storage:
			analyticsAllowed ? 'granted' : 'denied',

		ad_storage:
			marketingAllowed ? 'granted' : 'denied',

		ad_user_data:
			marketingAllowed ? 'granted' : 'denied',

		ad_personalization:
			marketingAllowed ? 'granted' : 'denied'

	});


	/* ----------------------------------------------------------
	   MARKETING CONSENT EVENT
	   
	   GTM listens for this event and fires marketing tags
	   such as LinkedIn Insight.
	---------------------------------------------------------- */

	if (marketingAllowed) {

		window.dataLayer.push({
			event: 'marketing_consent_granted'
		});

	}

}


/* ==========================================================
   COOKIE CONSENT
========================================================== */

CookieConsent.run({

	mode: 'opt-in',


	/* ----------------------------------------------------------
	   CONSENT EVENTS
	---------------------------------------------------------- */

	onFirstConsent: () => {
		updateConsent();
	},

	onConsent: () => {
		updateConsent();
	},

	onChange: () => {
		updateConsent();
	},


	/* ----------------------------------------------------------
	   UI
	---------------------------------------------------------- */

	guiOptions: {

		consentModal: {
			layout: 'box inline',
			position: 'bottom left',
			equalWeightButtons: true,
			flipButtons: false
		},

		preferencesModal: {
			layout: 'box',
			equalWeightButtons: true,
			flipButtons: false
		}

	},


	/* ----------------------------------------------------------
	   COOKIE CATEGORIES
	---------------------------------------------------------- */

	categories: {

		necessary: {
			enabled: true,
			readOnly: true
		},


		analytics: {

			enabled: true,

			autoClear: {

				cookies: [
					{
						name: /^_ga/
					}
				]

			}

		},


		marketing: {
			enabled: false
		}

	},


	/* ----------------------------------------------------------
	   LANGUAGE / CONTENT
	---------------------------------------------------------- */

	language: {

		default: 'en',

		translations: {

			en: {

				/* --------------------------------------------------
				   MAIN CONSENT MODAL
				-------------------------------------------------- */

				consentModal: {

					title: 'Cookies',

					description:
						'I use analytics cookies to understand how people use Complexity Clarified and optional marketing cookies to understand and measure engagement with the site. You can change your preferences at any time.',

					acceptAllBtn:
						'Accept all',

					acceptNecessaryBtn:
						'Necessary only',

					showPreferencesBtn:
						'Manage preferences'

				},


				/* --------------------------------------------------
				   PREFERENCES MODAL
				-------------------------------------------------- */

				preferencesModal: {

					title:
						'Cookie preferences',

					acceptAllBtn:
						'Accept all',

					acceptNecessaryBtn:
						'Necessary only',

					savePreferencesBtn:
						'Save preferences',

					closeIconLabel:
						'Close',


					sections: [

						{
							title:
								'Your privacy',

							description:
								'Analytics is enabled by default to help me understand how the site is used. Marketing cookies are optional and are only enabled with your consent. You can change these preferences at any time.'
						},


						{
							title:
								'Strictly necessary cookies',

							description:
								'These cookies are required for the website to function and to remember your cookie preferences.',

							linkedCategory:
								'necessary'
						},


						{
							title:
								'Analytics cookies',

							description:
								'Google Analytics helps me understand how visitors use the website, including which pages are viewed and how visitors arrive at the site.',

							linkedCategory:
								'analytics'
						},


						{
							title:
								'Marketing cookies',

							description:
								'LinkedIn Insight helps me understand how professional audiences engage with Complexity Clarified and may be used to measure or support advertising activity.',

							linkedCategory:
								'marketing'
						},


						{
							title:
								'More information',

							description:
								'For more information, see the <a href="/cookie-policy/">Cookie Policy</a> and <a href="/privacy/">Privacy Policy</a>.'
						}

					]

				}

			}

		}

	}

});