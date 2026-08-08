import * as CookieConsent from 'vanilla-cookieconsent';

function updateGoogleConsent() {
	const analyticsAllowed = CookieConsent.acceptedCategory('analytics');

	window.dataLayer = window.dataLayer || [];

	window.dataLayer.push(function () {
		this.gtag('consent', 'update', {
			analytics_storage: analyticsAllowed ? 'granted' : 'denied'
		});
	});
}

CookieConsent.run({
	mode: 'opt-in',

	onFirstConsent: () => {
		updateGoogleConsent();
	},

	onChange: () => {
		updateGoogleConsent();
	},

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
		}
	},

	language: {
		default: 'en',

		translations: {
			en: {
				consentModal: {
					title: 'Cookies',
					description:
						'I use analytics cookies to understand how people use Complexity Clarified and improve the site. You can opt out at any time.',
					acceptAllBtn: 'Accept analytics',
					acceptNecessaryBtn: 'Necessary only',
					showPreferencesBtn: 'Manage preferences'
				},

				preferencesModal: {
					title: 'Cookie preferences',
					acceptAllBtn: 'Accept analytics',
					acceptNecessaryBtn: 'Necessary only',
					savePreferencesBtn: 'Save preferences',
					closeIconLabel: 'Close',

					sections: [
						{
							title: 'Your privacy',
							description:
								'Analytics is enabled by default to help me understand how the site is used. You can turn analytics off at any time.'
						},
						{
							title: 'Strictly necessary cookies',
							description:
								'These cookies are required for the website to function and to remember your cookie preferences.',
							linkedCategory: 'necessary'
						},
						{
							title: 'Analytics cookies',
							description:
								'Google Analytics helps me understand how visitors use the website, including which pages are viewed and how visitors arrive at the site.',
							linkedCategory: 'analytics'
						},
						{
							title: 'More information',
							description:
								'For more information, see the <a href="/cookie-policy/">Cookie Policy</a> and <a href="/privacy/">Privacy Policy</a>.'
						}
					]
				}
			}
		}
	}
});