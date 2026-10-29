/**
 * BUSINESS DETAILS: the single place to update contact info site-wide.
 * Only verified details belong here. Leave unknown values as null.
 */
export const business = {
  name: 'Houston Cooling & Heating',
  type: 'HVAC, Heating, Cooling & Electrical Services',
  phoneDisplay: '(346) 535-2585',
  phoneE164: '+13465352585',
  email: 'Alanmav0411@gmail.com',
  location: 'Highway 6 South, Houston, Texas',
  serviceArea: 'Houston and surrounding communities',
  /** Brand handle supplied by the owner; add the full verified URL below before linking it. */
  brandHandle: 'houstoncoolingandelectric',
  social: {
    facebook: null as string | null, // e.g. 'https://www.facebook.com/houstoncoolingandelectric' once verified
    instagram: null as string | null,
  },
  /**
   * Texas license numbers. Texas (TDLR) rules require HVAC (ACR) and electrical
   * contractors to show their license numbers in advertising. Add them before launch.
   */
  licenses: {
    hvac: null as string | null, // e.g. 'TACLA12345C'
    electrical: null as string | null, // e.g. 'TECL 12345'
  },
};

export const links = {
  call: `tel:${business.phoneE164}`,
  text: `sms:${business.phoneE164}`,
  email: `mailto:${business.email}`,
};
