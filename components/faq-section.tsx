'use client'

const FAQS = [
  {
    q: 'What services do you provide?',
    a: 'We specialise in the servicing, inspection, and repair of scuba diving equipment, including regulators, BCDs, cylinders and accessories. We are IDEST-accredited for cylinder inspection, O2 cleaning and testing of steel, aluminium and composite cylinders.',
  },
  {
    q: 'What does IDEST accreditation mean?',
    a: `IDEST accreditation ensures that our cylinder inspections and testing meet strict UK safety and quality standards. It guarantees:\n\n- Certified inspection procedures\n- Calibrated testing equipment\n- Fully trained and audited technicians`,
  },
  {
    q: 'How often do scuba cylinders need testing in the UK?',
    a: `Under UK and UKAS guidelines, SCUBA cylinders:\n\n- Periodic Inspection (PI): Every 2.5 years (commonly known as visual inspection)\n- Hydrostatic Test (PIAT): Every 5 years (commonly known as hydro inspection)\n- O2 Clean Cylinders: Every 15 months (excluding 100% O2 dedicated cylinders)\n\nAll testing is carried out in accordance with IDEST standards and marked accordingly.`,
  },
  {
    q: 'Do you provide IDEST cylinder testing and stamping?',
    a: 'Yes, we carry out both visual inspections and hydrostatic testing, and issue official IDEST inspection stickers and stamps where applicable on all cylinders, including SCUBA, air gun, BA and emergency O2.',
  },
  {
    q: 'How often should I service my regulators and BCD?',
    a: `We recommend:\n\n- Annual servicing or every 100 dives (whichever comes first)\n\nThis aligns with most manufacturer guidelines and ensures optimal performance and safety. We must follow manufacturer guidelines as a priority. Unfortunately, most people wait too long to have their BCD or regulators serviced, causing unnecessary corrosion and damage and leading to a more costly service.`,
  },
  {
    q: 'Are your technicians certified?',
    a: 'Yes, our technicians are trained and qualified to service major scuba equipment brands and follow manufacturer-approved procedures alongside IDEST requirements.',
  },
  {
    q: 'Do you use genuine manufacturer parts?',
    a: 'Absolutely. We pride ourselves on only using approved service kits and genuine parts to maintain performance, safety, and warranty compliance. We will not entertain using inferior products.',
  },
  {
    q: 'How long does servicing take?',
    a: `Typical turnaround times:\n\n- Regulators/BCDs: 5–10 working days\n- Cylinder visual inspections: 2–5 working days\n- Hydrostatic testing: 5–10 working days\n\nTurnaround will vary depending on workload and parts availability. This will be fully communicated to our customers in advance.`,
  },
  {
    q: 'Can I get my equipment serviced urgently?',
    a: 'We may be able to offer priority servicing depending on demand. Please contact us in advance to discuss availability and costs.',
  },
  {
    q: 'Do I need to book my equipment in?',
    a: 'Yes. We cannot commence any work until we have full customer and equipment details and consent for the work to start.',
  },
  {
    q: 'What happens if my equipment fails inspection?',
    a: `If any faults are found:\n\n- We will contact you with a detailed report\n- Provide a quote for repairs or replacement\n- No extra work is carried out without your approval\n- If your cylinder fails inspection, we are legally required to destroy and dispose of it - it will not be returned to you.\n- There is a set surcharge for cylinder failures. Please see our price list`,
  },
  {
    q: 'Do you service all cylinder types?',
    a: `We service most common UK cylinder types, including:\n\n- Air cylinders\n- Nitrox-compatible cylinders\n- Steel, aluminium and composite cylinders\n\nPlease contact us if you have specialist cylinders.`,
  },
  {
    q: 'Can I send my equipment by post?',
    a: `Yes, we accept mail-in servicing across the UK, however a booking form must be completed and agreed before you ship your equipment. Your equipment must be securely packaged and include your contact details and service requirements. Please note that Log-It take no responsibility for the postage to our workshop. Return shipping of equipment is the customer’s responsibility, unless otherwise agreed in advance.`,
  },
  {
    q: 'What documentation will I receive?',
    a: `At Log-It, we do things differently. Similar to a modern car MOT, you will receive:\n\n- Video/photo evidence of pre-inspection and testing\n- Video/photo evidence during inspection and cleaning\n- Video/photo evidence of final set up and testing, proving your serviced equipment is within manufacturer specification and to your requirements\n- IDEST inspection quadrant sticker (for cylinders)\n- Service report (always)\n- Updated test dates and certification for any equipment`,
  },
  {
    q: 'Why is regular servicing important?',
    a: `Routine servicing:\n\n- Ensures compliance with UK safety standards\n- Reduces risk of equipment failure\n- Extends the lifespan of your gear\n- Maintains insurance and warranty requirements\n- Ultimately, regular servicing saves you money in the long term. Heavily corrosion-damaged equipment not only can cost you considerable money, it may cost your safety`,
  },
  {
    q: 'Do you offer servicing warranties?',
    a: 'Yes, we provide a service warranty covering workmanship and replaced parts for a specified period. Please ask for details.',
  },
  {
    q: 'Where are you based and who do you serve?',
    a: 'Log-It Scuba Services is UK-based (Grantham, Lincolnshire) and serves recreational, commercial and professional divers nationwide via drop-off and postal service.',
  },
  {
    q: 'Are you insured?',
    a: `Yes. We hold full commercial liability insurance including:\n\n- Public Liability\n- Product Liability\n- Professional Indemnity\n- Employers Liability`,
  },
  {
    q: 'I’ve only used my equipment a couple of times over the last year or so. Should I still have it serviced?',
    a: `Yes, definitely! We should always adhere to manufacturer specifications or annual inspection/testing.\n\nIf you leave your equipment unused for extended periods of time or stored incorrectly, this is far more damaging for the internal components and o-rings, than frequent use and proper maintenance.\n\nIf you are a commercial or professional diver, you are legally required to adhere to the relevant servicing requirements. We can help you with this.`,
  },
  {
    q: 'I’ve purchased second-hand equipment. Should I have it serviced even if the seller says it was serviced recently?',
    a: 'Yes, absolutely. You can never be sure of the history of your second-hand equipment so it’s only sensible to have it serviced prior to first use.',
  },
  {
    q: 'There’s something wrong my equipment but I’m not sure what. Can you help?',
    a: 'We certainly can! Our experienced technicians provide a comprehensive diagnostic service to identify any issues with your equipment and determine whether (and how) it can be restored to a reliable, fully operational condition. Please note that a diagnostic fee applies - please see our price list.',
  },
  {
    q: 'I know my regulators and my BCD need servicing, but what about my hoses?',
    a: `Absolutely. Regulators are classed as life-saving equipment and your hoses are a crucial part of this. It is a misconception that hoses last until they break. Manufacturer specifications and guidelines are:\n\n- 5 years from first use or 500 dives, whichever comes sooner\n- with Miflex hoses we are looking for frayed and damaged outer casing or the hose collapsing when bent back on itself. Dates can usually be found on the hoses.\n- with rubber hoses we are looking for cracks, crazing, splits cuts, bulges or the hose collapsing when bent back on itself.\n- all good quality hoses are stamped or numbered with their manufacture date or serial number. If your hoses are missing a manufacture date or serial number, they do not conform to the required UK and European standards (EN250A) and must not be used`,
  },
  {
    q: 'Does my gauge need checking for conformity?',
    a: `Yes - at Log-It, we do things differently. Under EN 250, UK and European requirements state that a service centre must verify the accuracy of your pressure gauge against a calibrated master gauge to ensure user safety during servicing.\n\nAt Log-It, this gauge conformity check is included as standard within our regulator service fee. We also offer it as a standalone service for a nominal charge.\n\nIn addition to completing the check, we provide you with the recorded readings afterwards, so you have full transparency and peace of mind.`,
  },
  {
    q: 'What is included in a BCD service?',
    a: `- full visual inspection of all components\n- pressure check and leak detection\n- full disinfection with a 99.9% Chemgene solution\n- de-fluff of Velcro\n- full power inflator service\n- all dump/over-pressure valves serviced and checked for full working order`,
  },
  {
    q: 'Does Log-It only provide servicing?',
    a: 'No! We also have a shop which sells diving equipment including regulators, BCDs, hoses, cylinders, emergency O2 kits, multi-coloured bungee cord and reel/cave line and most other diving accessories.',
  },
  {
    q: 'What brands can you supply?',
    a: 'Lots! Northern Diver, Dynamic Nord, Nammu Tech, X-Deep, Beaver, Omniswivel, Best Divers, Oceanarium, Miflex hoses and Kubi dry gloves. Not to mention Log-It’s own branded items including the prestigious log book!',
  },
] as const

function formatAnswer(text: string) {
  const lines = text.split('\n')
  const nodes: React.ReactNode[] = []
  let listItems: string[] = []

  const flushList = (keyBase: string) => {
    if (listItems.length === 0) return
    nodes.push(
      <ul key={`${keyBase}-ul-${nodes.length}`} className="list-disc pl-5 space-y-1">
        {listItems.map((li, i) => (
          <li key={i}>{li}</li>
        ))}
      </ul>
    )
    listItems = []
  }

  return (
    <div className="space-y-2">
      {lines.map((line, idx) => {
        const trimmed = line.trim()
        if (!trimmed) {
          flushList(`l${idx}`)
          return null
        }
        if (trimmed.startsWith('- ')) {
          listItems.push(trimmed.slice(2))
          return null
        }
        flushList(`l${idx}`)
        nodes.push(<p key={`p-${idx}`}>{trimmed}</p>)
        return null
      })}
      {(() => {
        flushList('end')
        return nodes
      })()}
    </div>
  )
}

export default function FaqSection({ bgClassName = 'bg-background' }: { bgClassName?: string }) {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.a.replace(/\n/g, '<br/>'),
      },
    })),
  }

  return (
    <section id="faq" className={`min-h-screen ${bgClassName} py-20 px-4`} aria-labelledby="faq-heading">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p
            className="text-sm font-semibold tracking-[0.3em] uppercase text-[var(--brand-red)] mb-3"
            style={{ fontFamily: 'var(--font-rajdhani)' }}
          >
            Helpful Answers
          </p>
          <h2
            id="faq-heading"
            className="text-4xl md:text-5xl font-black text-white mb-4 text-balance"
            style={{ fontFamily: 'var(--font-orbitron)' }}
          >
            FREQUENTLY ASKED <span className="text-[var(--brand-red)]">QUESTIONS</span>
          </h2>
          <div className="w-16 h-0.5 bg-[var(--brand-red)] mx-auto" style={{ boxShadow: '0 0 10px var(--brand-red-glow)' }} aria-hidden="true" />
        </div>

        <div className="space-y-3">
          {FAQS.map((f) => (
            <details key={f.q} className="glass-card border border-[var(--charcoal-light)] p-5 group">
              <summary
                className="cursor-pointer list-none flex items-start justify-between gap-6 text-white font-bold"
                style={{ fontFamily: 'var(--font-orbitron)' }}
              >
                <span className="text-base md:text-lg">{f.q}</span>
                <span className="text-[var(--brand-red)] group-open:rotate-45 transition-transform select-none" aria-hidden="true">
                  +
                </span>
              </summary>
              <div className="mt-4 text-white/70 text-base leading-relaxed" style={{ fontFamily: 'var(--font-rajdhani)' }}>
                {formatAnswer(f.a)}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

