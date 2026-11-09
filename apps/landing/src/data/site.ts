/** Site-wide links and page names shared by the header, footer, and pages. */

const FORUM = 'https://dailylivinglabs.community.forum'

export const forum = {
  home: `${FORUM}/`,
  register: `${FORUM}/register/`,
  shareChallenge: `${FORUM}/forums/share-a-challenge.32/`,
  exploreChallenges: `${FORUM}/forums/explore-challenges.33/`,
  shareSolution: `${FORUM}/forums/share-a-solution.34/`,
  exploreSolutions: `${FORUM}/forums/explore-solutions.35/`,
  volunteerHub: `${FORUM}/forums/volunteer-hub.36/`,
  privacy: `${FORUM}/help/privacy-policy/`,
  terms: `${FORUM}/help/terms/`,
  cookies: `${FORUM}/help/cookies/`,
}

export const waysToHelp = [
  { to: '/share-challenges', label: 'Share a Challenge', description: "Share what's hard and see how it works" },
  { to: '/volunteer', label: 'Volunteer', description: 'Contribute knowledge and skills' },
  { to: '/partner', label: 'Partner', description: 'Partner with us to get involved' },
]

export const mainLinks = [
  { to: '/who-we-are', label: 'Who We Are' },
  { to: '/projects', label: 'Projects' },
  { to: '/connect', label: 'Connect' },
]

export const legalLinks = [
  { to: '/accessibility', label: 'Accessibility' },
  { to: '/terms', label: 'Terms of Service' },
  { to: '/privacy', label: 'Privacy Policy' },
  { to: '/cookies', label: 'Cookies' },
]

export const socialLinks = [
  { href: 'https://facebook.com/dailylivinglabs', label: 'Facebook', logo: '/images/social/facebook.png', w: 80, h: 80 },
  { href: 'https://www.instagram.com/dailylivinglabs/', label: 'Instagram', logo: '/images/social/instagram.png', w: 80, h: 80 },
  { href: 'https://www.linkedin.com/company/daily-living-labs/', label: 'LinkedIn', logo: '/images/social/linkedin.png', w: 94, h: 80 },
]

export const contactEmail = 'info@dailylivinglabs.com'
