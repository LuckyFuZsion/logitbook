import type { FaqData } from '@/lib/faq-types'

export const DEFAULT_FAQ_DATA: FaqData = {
  items: [
    {
      id: 'faq-01',
      question: 'What services do you provide?',
      answer:
        'We specialise in the servicing, inspection, and repair of scuba diving equipment, including regulators, BCDs, cylinders and accessories. We are IDEST-accredited for cylinder inspection, O2 cleaning and testing of steel, aluminium and composite cylinders.',
    },
    {
      id: 'faq-02',
      question: 'What does IDEST accreditation mean?',
      answer:
        'IDEST accreditation ensures that our cylinder inspections and testing meet strict UK safety and quality standards. It guarantees:\n\n- Certified inspection procedures\n- Calibrated testing equipment\n- Fully trained and audited technicians',
    },
    {
      id: 'faq-03',
      question: 'How often do scuba cylinders need testing in the UK?',
      answer:
        'Under UK and UKAS guidelines, SCUBA cylinders:\n\n- Periodic Inspection (PI): Every 2.5 years (commonly known as visual inspection)\n- Hydrostatic Test (PIAT): Every 5 years (commonly known as hydro inspection)\n- O2 Clean Cylinders: Every 15 months (excluding 100% O2 dedicated cylinders)\n\nAll testing is carried out in accordance with IDEST standards and marked accordingly.',
    },
    {
      id: 'faq-04',
      question: 'Do you provide IDEST cylinder testing and stamping?',
      answer:
        'Yes, we carry out both visual inspections and hydrostatic testing, and issue official IDEST inspection stickers and stamps where applicable on all cylinders, including SCUBA, air gun, BA and emergency O2.',
    },
    {
      id: 'faq-05',
      question: 'How often should I service my regulators and BCD?',
      answer:
        'We recommend:\n\n- Annual servicing or every 100 dives (whichever comes first)\n\nThis aligns with most manufacturer guidelines and ensures optimal performance and safety. We must follow manufacturer guidelines as a priority. Unfortunately, most people wait too long to have their BCD or regulators serviced, causing unnecessary corrosion and damage and leading to a more costly service.',
    },
    {
      id: 'faq-06',
      question: 'Are your technicians certified?',
      answer:
        'Yes, our technicians are trained and qualified to service major scuba equipment brands and follow manufacturer-approved procedures alongside IDEST requirements.',
    },
    {
      id: 'faq-07',
      question: 'Do you use genuine manufacturer parts?',
      answer:
        'Absolutely. We pride ourselves on only using approved service kits and genuine parts to maintain performance, safety, and warranty compliance. We will not entertain using inferior products.',
    },
    {
      id: 'faq-08',
      question: 'How long does servicing take?',
      answer:
        'Typical turnaround times:\n\n- Regulators/BCDs: 5–10 working days\n- Cylinder visual inspections: 2–5 working days\n- Hydrostatic testing: 5–10 working days\n\nTurnaround will vary depending on workload and parts availability. This will be fully communicated to our customers in advance.',
    },
    {
      id: 'faq-09',
      question: 'Can I get my equipment serviced urgently?',
      answer:
        'We may be able to offer priority servicing depending on demand. Please contact us in advance to discuss availability and costs.',
    },
    {
      id: 'faq-10',
      question: 'Do I need to book my equipment in?',
      answer:
        'Yes. We cannot commence any work until we have full customer and equipment details and consent for the work to start.',
    },
    {
      id: 'faq-11',
      question: 'What happens if my equipment fails inspection?',
      answer:
        'If any faults are found:\n\n- We will contact you with a detailed report\n- Provide a quote for repairs or replacement\n- No extra work is carried out without your approval\n- If your cylinder fails inspection, we are legally required to destroy and dispose of it - it will not be returned to you.\n- There is a set surcharge for cylinder failures. Please see our price list',
    },
    {
      id: 'faq-12',
      question: 'Do you service all cylinder types?',
      answer:
        'We service most common UK cylinder types, including:\n\n- Air cylinders\n- Nitrox-compatible cylinders\n- Steel, aluminium and composite cylinders\n\nPlease contact us if you have specialist cylinders.',
    },
    {
      id: 'faq-13',
      question: 'Can I send my equipment by post?',
      answer:
        "Yes, we accept mail-in servicing across the UK, however a booking form must be completed and agreed before you ship your equipment. Your equipment must be securely packaged and include your contact details and service requirements. Please note that Log-It take no responsibility for the postage to our workshop. Return shipping of equipment is the customer's responsibility, unless otherwise agreed in advance.",
    },
    {
      id: 'faq-14',
      question: 'What documentation will I receive?',
      answer:
        'At Log-It, we do things differently. Similar to a modern car MOT, you will receive:\n\n- Video/photo evidence of pre-inspection and testing\n- Video/photo evidence during inspection and cleaning\n- Video/photo evidence of final set up and testing, proving your serviced equipment is within manufacturer specification and to your requirements\n- IDEST inspection quadrant sticker (for cylinders)\n- Service report (always)\n- Updated test dates and certification for any equipment',
    },
    {
      id: 'faq-15',
      question: 'Why is regular servicing important?',
      answer:
        'Routine servicing:\n\n- Ensures compliance with UK safety standards\n- Reduces risk of equipment failure\n- Extends the lifespan of your gear\n- Maintains insurance and warranty requirements\n- Ultimately, regular servicing saves you money in the long term. Heavily corrosion-damaged equipment not only can cost you considerable money, it may cost your safety',
    },
    {
      id: 'faq-16',
      question: 'Do you offer servicing warranties?',
      answer:
        'Yes, we provide a service warranty covering workmanship and replaced parts for a specified period. Please ask for details.',
    },
    {
      id: 'faq-17',
      question: 'Where are you based and who do you serve?',
      answer:
        'Log-It Scuba Services is UK-based (Grantham, Lincolnshire) and serves recreational, commercial and professional divers nationwide via drop-off and postal service.',
    },
    {
      id: 'faq-18',
      question: 'Are you insured?',
      answer:
        'Yes. We hold full commercial liability insurance including:\n\n- Public Liability\n- Product Liability\n- Professional Indemnity\n- Employers Liability',
    },
    {
      id: 'faq-19',
      question:
        "I've only used my equipment a couple of times over the last year or so. Should I still have it serviced?",
      answer:
        "Yes, definitely! We should always adhere to manufacturer specifications or annual inspection/testing.\n\nIf you leave your equipment unused for extended periods of time or stored incorrectly, this is far more damaging for the internal components and o-rings, than frequent use and proper maintenance.\n\nIf you are a commercial or professional diver, you are legally required to adhere to the relevant servicing requirements. We can help you with this.",
    },
    {
      id: 'faq-20',
      question:
        "I've purchased second-hand equipment. Should I have it serviced even if the seller says it was serviced recently?",
      answer:
        "Yes, absolutely. You can never be sure of the history of your second-hand equipment so it's only sensible to have it serviced prior to first use.",
    },
    {
      id: 'faq-21',
      question:
        "There's something wrong my equipment but I'm not sure what. Can you help?",
      answer:
        'We certainly can! Our experienced technicians provide a comprehensive diagnostic service to identify any issues with your equipment and determine whether (and how) it can be restored to a reliable, fully operational condition. Please note that a diagnostic fee applies - please see our price list.',
    },
    {
      id: 'faq-22',
      question:
        'I know my regulators and my BCD need servicing, but what about my hoses?',
      answer:
        "Absolutely. Regulators are classed as life-saving equipment and your hoses are a crucial part of this. It is a misconception that hoses last until they break. Manufacturer specifications and guidelines are:\n\n- 5 years from first use or 500 dives, whichever comes sooner\n- with Miflex hoses we are looking for frayed and damaged outer casing or the hose collapsing when bent back on itself. Dates can usually be found on the hoses.\n- with rubber hoses we are looking for cracks, crazing, splits cuts, bulges or the hose collapsing when bent back on itself.\n- all good quality hoses are stamped or numbered with their manufacture date or serial number. If your hoses are missing a manufacture date or serial number, they do not conform to the required UK and European standards (EN250A) and must not be used",
    },
    {
      id: 'faq-23',
      question: 'Does my gauge need checking for conformity?',
      answer:
        'Yes - at Log-It, we do things differently. Under EN 250, UK and European requirements state that a service centre must verify the accuracy of your pressure gauge against a calibrated master gauge to ensure user safety during servicing.\n\nAt Log-It, this gauge conformity check is included as standard within our regulator service fee. We also offer it as a standalone service for a nominal charge.\n\nIn addition to completing the check, we provide you with the recorded readings afterwards, so you have full transparency and peace of mind.',
    },
    {
      id: 'faq-24',
      question: 'What is included in a BCD service?',
      answer:
        '- full visual inspection of all components\n- pressure check and leak detection\n- full disinfection with a 99.9% Chemgene solution\n- de-fluff of Velcro\n- full power inflator service\n- all dump/over-pressure valves serviced and checked for full working order',
    },
    {
      id: 'faq-25',
      question: 'Does Log-It only provide servicing?',
      answer:
        'No! We also have a shop which sells diving equipment including regulators, BCDs, hoses, cylinders, emergency O2 kits, multi-coloured bungee cord and reel/cave line and most other diving accessories.',
    },
    {
      id: 'faq-26',
      question: 'What brands can you supply?',
      answer:
        "Lots! Northern Diver, Dynamic Nord, Nammu Tech, X-Deep, Beaver, Omniswivel, Best Divers, Oceanarium, Miflex hoses and Kubi dry gloves. Not to mention Log-It's own branded items including the prestigious log book!",
    },
  ],
  updatedAt: new Date(0).toISOString(),
}

export function mergeFaqData(raw: Partial<FaqData> | null | undefined): FaqData {
  if (!raw || !Array.isArray(raw.items) || raw.items.length === 0) {
    return { ...DEFAULT_FAQ_DATA }
  }
  return {
    items: raw.items,
    updatedAt: raw.updatedAt ?? DEFAULT_FAQ_DATA.updatedAt,
  }
}
