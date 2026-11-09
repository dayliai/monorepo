/** Footer photo credits, from dll-site-assets/README.md and the prototype. */

export interface CreditLink {
  name: string
  href: string
}

const chona = { name: 'Chona Kasinger', href: 'https://www.chonakasinger.com/' }
const disabledAndHere = { name: 'Disabled And Here', href: 'https://affecttheverb.com/disabledandhere' }
const ccBy = { name: 'CC BY 4.0', href: 'https://creativecommons.org/licenses/by/4.0/' }

export const ccCredits = [
  { section: 'How it works, Discover', people: [chona, disabledAndHere, ccBy] },
  { section: 'How it works, Share', people: [chona, disabledAndHere, ccBy] },
]

export const unsplashCredits: { section: string; people: CreditLink[] }[] = [
  {
    section: 'Who we need',
    people: [
      { name: 'Vitaly Gariev', href: 'https://unsplash.com/@silverkblack' },
      { name: 'boris misevic', href: 'https://unsplash.com/@borisview' },
      { name: 'ThisisEngineering', href: 'https://unsplash.com/@thisisengineering' },
    ],
  },
  {
    section: 'Community',
    people: [
      { name: 'Raj Tuladhar', href: 'https://unsplash.com/@reazonsraj' },
      { name: 'Centre for Ageing Better', href: 'https://unsplash.com/@ageing_better' },
      { name: 'Zoe Graham', href: 'https://unsplash.com/@grahams_photography' },
    ],
  },
  {
    section: 'Six essential activities',
    people: [
      { name: 'Musmuliady Jahi', href: 'https://unsplash.com/@musmuliadyjahi' },
      { name: 'Adiel Gavish', href: 'https://unsplash.com/@adigavi' },
      { name: 'Annie Spratt', href: 'https://unsplash.com/@anniespratt' },
      { name: 'Nando García', href: 'https://unsplash.com/@masklim' },
      { name: 'Point3D Commercial Imaging Ltd.', href: 'https://unsplash.com/@3dottawa' },
      { name: 'Samuele Dean', href: 'https://unsplash.com/@samuele_dean' },
    ],
  },
]
