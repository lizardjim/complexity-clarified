import * as CookieConsent from 'vanilla-cookieconsent';

CookieConsent.run({
	mode: 'opt-in',

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
						'I use optional analytics cookies to understand how people use Complexity Clarified and improve the site.',
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
								'You can choose whether to allow analytics cookies. You can change your choice at any time.'
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