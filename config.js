/*
 * NOTORITE site configuration — the ONLY file you need to edit for company details.
 *
 * Every contact field below is rendered on the site ONLY if it is non-empty.
 * Leave a field as "" to keep it hidden. Never put placeholder text like "TBD" here.
 */
window.NOTORITE_CONFIG = {
  COMPANY_LEGAL_NAME: "NOTORITE LLC",

  // Public business email. Also used as the mailto: fallback for the quote form.
  CONTACT_EMAIL: "info@notoritellc.com",

  // Public phone number, written the way you want it shown, e.g. "+1 (555) 010-0000".
  PHONE: "+1 (727) 590-4600",

  // Business address. Use \n for a line break, e.g. "123 Example St, Suite 100\nCity, ST 00000".
  ADDRESS: "7901 4th St N, STE 36444\nSt. Petersburg, FL 33702, US",

  // US state where the LLC was formed, e.g. "Delaware". Shown in the footer.
  STATE_OF_FORMATION: "",

  // Quote form endpoint (Formspree, Web3Forms, etc.). See README.md.
  // If empty, the form opens the visitor's email app addressed to CONTACT_EMAIL.
  FORM_ENDPOINT: "",

  // Optional extra fields sent with every submission, e.g. { access_key: "..." } for Web3Forms.
  FORM_EXTRA_FIELDS: {}
};
