import type { TeamMember } from '@/lib/team-types'

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'eve',
    name: 'Eve',
    imageSrc: '/Meet-The-Team/Eve.webp?v=2',
    qualifications: [
      'BSAC Dive Leader',
      'Assistant Instructor',
      'Snorkel Instructor',
      'AED & O2 Instructor',
      'Boat Handler',
      'Diveheart Buddy',
    ],
    aboutParagraphs: [
      'I’ve been diving for nearly 7 years, and after wanting to learn for a long time, I finally got qualified after meeting Dan! I’m now working towards becoming a fully qualified Open Water Instructor.',
      'I work full time in Commercial Procurement, but as soon as the 9-5 ends, the Log-It work begins! My main focus is keeping everything running smoothly behind the scenes - from meeting deadlines and maintaining the website, to managing online sales, insurance, and all the less glamorous paperwork that keeps the business ticking over!',
    ],
  },
  {
    id: 'dan',
    name: 'Dan',
    imageSrc: '/Meet-The-Team/Dan.webp',
    qualifications: [
      '3× Guinness World Record Holder',
      'BSAC Open Water Instructor',
      'Boat Handler',
      'AED & O2 Instructor',
      'SSI Professional Instructor',
      'SSI Sidemount Instructor',
      'SSI Advanced Wreck Instructor',
      'IDEST Technician (steel, aluminium & composite cylinders, including O₂ cleaning)',
      'Regulator Service Technician (various brands)',
    ],
    aboutParagraphs: [
      'My life changed on 22nd June 2014 following a motorcycle accident that left me paralysed from T8, with no movement or sensation from the chest down. Adjusting to life in a wheelchair, I turned to sport and competed in a range of disciplines before finding my passion in handcycling. I went on to reach 5th in the UK rankings.',
      'While being assessed by British Cycling for the Rio Olympics, I discovered scuba diving. However, in June 2018, during a 600-mile charity bike ride, I suffered a second life-changing accident, resulting in a C4 compression injury, significant shoulder damage, a head injury, and PTSD. This ultimately brought my racing career to an end, and I found myself struggling significantly with my mental health.',
      'At that point, I was heading in a very difficult direction, but with support from close friends, I was introduced more deeply to scuba diving. That moment changed everything. Diving became a form of therapy for me - a place of calm where I could quiet what I call “the noise of life”. It’s widely recognised for its physical and mental health benefits, and I’ve become a strong advocate for disability diving.',
      'From there, I progressed through BSAC and SSI training, completing a range of disability diving qualifications and going on to instruct many disabled divers myself.',
      'Alongside an incredible team, I’ve also had the privilege of completing three Guinness World Records in scuba diving, across both disabled and able-bodied categories. All of these events have been driven by a desire to raise funds and awareness for charities and disability sport.',
      'My passion for diving naturally evolved alongside my background in engineering, leading me to become an IDEST service technician. As the first technician in a wheelchair in this field, my workshop has been fully adapted to suit the way I work. That approach reflects everything I do - adapting equipment, systems, and solutions to meet individual needs while maintaining the highest possible standards.',
      'I’ve been immensely fortunate to meet some amazing people within the diving community along the way, including instructors from the Dive Heart organisation and close friends based out at Aquanauts in Grenada.',
      'There is still much more to come… watch this space!',
    ],
  },
  {
    id: 'skye',
    name: 'Skye',
    imageSrc: '/Meet-The-Team/Skye.webp',
    qualifications: [
      'BSAC Ocean Diver',
      'Working towards becoming a Dive Instructor',
      'AED & CPR Trained',
      'Dolphin Snorkeller',
    ],
    aboutParagraphs: [
      'I help Mum and Dad out as much as I can with the business, and I also lend a hand with some of the marketing.',
      'I’ve been diving for a few years now and have loved every second of it. My favourite place I’ve dived so far is Jamaica - it was an amazing experience and somewhere I’d love to visit again.',
      'When I’m not diving, I’m studying Photography and Art. My dream is to turn that passion into a career as an underwater photographer!',
    ],
  },
  {
    id: 'luna',
    name: 'Luna',
    imageSrc: '/Meet-The-Team/Luna.webp',
    qualifications: [
      'Advanced Workshop Supervisor',
      'Specialist in Welcoming New Customers',
      'Senior Break-Time Enforcer',
    ],
    aboutParagraphs: [
      'I’m a very important member of the Log-It team and take my duties extremely seriously.',
      'My main responsibilities include greeting customers, keeping morale high, and making sure everyone takes regular breaks for cuddles and treats.',
      'When I’m not supervising the workshop, you’ll usually find me out on long walks, on the hunt for snacks, or carefully monitoring any food that might mysteriously fall to the floor.',
    ],
  },
]

export function teamMemberImageAlt(name: string, placeholder?: boolean): string {
  if (placeholder) {
    return `${name}, LOG-IT team member - profile photo coming soon`
  }
  return `Portrait photo of ${name}, member of the LOG-IT team at LOGITSHOP`
}

/** Flat about text for schema.org / metadata */
export function teamMemberAboutPlain(member: TeamMember): string {
  return member.aboutParagraphs.join(' ')
}
