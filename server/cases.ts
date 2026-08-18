import type { CaseData } from '../src/types';

export const INITIAL_CASES: CaseData[] = [
  {
    id: 'case-observatory-sterling',
    title: 'The Echoes in the Dark: Death at the Observatory',
    subtitle: 'High-Altitude Astrophysical Research Facility • 11:30 PM',
    difficulty: 'Intermediate',
    setting: 'Whispering Pines Mountain Observatory, isolated high in the foggy peak above town.',
    timePeriod: 'Present Day (Late Autumn)',
    victim: {
      name: 'Dr. Alan Sterling',
      role: 'Chief Astrophysicist & Project Director',
      age: 52,
      timeOfDeath: 'Estimated 11:20 PM - 11:35 PM',
      causeOfDeath: 'Blunt force cranial trauma combined with acute neuro-paralytic poisoning (Aconitine variant).',
      briefBio: 'Renowned yet tyrannical researcher on the verge of announcing a breakthrough in deep-space dark matter harmonics. Known for taking sole credit for junior colleagues’ discoveries.',
      foundLocation: 'Primary Telescope Control Dome, slumped over the main console switchboard.',
    },
    synopsis:
      'At 11:30 PM, an emergency high-voltage power trip cut the lights at the Whispering Pines Observatory. When security investigated, Dr. Alan Sterling was discovered dead at his console. The heavy brass telescope calibrator lens was bloodied, and an emptied chemical vial lay smashed on the floor. Five people were inside the locked compound—and every one of them has a secret.',
    suspects: [
      {
        id: 'suspect-evelyn',
        name: 'Dr. Evelyn Sterling',
        role: 'Spouse & Senior Biochemist',
        age: 49,
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
        gender: 'Female',
        summary: 'A sharp, composed pharmaceutical scientist who recently discovered Alan had drained their shared joint accounts.',
        personality: 'Measured, ice-cold composure, speaks with clinical precision, guards her emotions tightly.',
        relationshipToVictim: 'Wife of 22 years. Marriage was privately disintegrating after financial betrayal.',
        statedAlibi: 'Claims she was working alone in the West Sub-Basement Biochemistry Lab synthesizing botanical assays between 10:45 PM and 11:45 PM.',
        actualActivity: 'Was indeed in the lab until 11:10 PM, but slipped up to the observatory corridor to confront Alan about the missing $400,000. She saw someone exiting the dome in a heavy coat at 11:25 PM.',
        secret: 'She had hired a private investigator to document Alan’s fraud and had prepared divorce papers with a freeze on his scientific patents.',
        isGuilty: false,
        motive: 'Large $2,000,000 life insurance policy and revenge for draining their life savings.',
        suspicionLevel: 65,
        nervousness: 40,
        openness: 60,
        privateKnowledge: [
          'Knows Alan kept a hidden audio recorder under the main desk blotter.',
          'Noticed a rare synthetic alkaloid compound was missing from her secure freezer shelf 2 days ago.',
          'Saw a silhouette wearing a navy insulated parka fleeing toward the forest trail at 11:28 PM.'
        ],
        falseBeliefs: [
          'Believes Arthur the neighbor is a deranged stalker who regularly trespassed to steal electronics.'
        ],
        initialGreeting: 'Detective. I am cooperating fully. Alan was a difficult man, but he was still my husband. What do you need to know?',
        voiceStyle: 'Articulate, calm, clinical, slightly distant.'
      },
      {
        id: 'suspect-marcus',
        name: 'Dr. Marcus Vance',
        role: 'Colleague & Rival Astrophysicist',
        age: 44,
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
        gender: 'Male',
        summary: 'Brilliant second-in-command who spent seven years developing the radio telemetry algorithm Alan took sole credit for.',
        personality: 'Arrogant, fidgety, defensive, talks fast when cornered, quick to deflect blame onto Chloe.',
        relationshipToVictim: 'Co-researcher and bitter competitor. Alan threatened to fire and blacklist him from academia that very morning.',
        statedAlibi: 'Claims he was in the Server Core Room on the 2nd floor from 10:30 PM until the power outage, running batch calibrations on the mainframe.',
        actualActivity: 'HE IS THE KILLER. At 11:15 PM, he laced Alan’s evening thermos with aconitine taken from Evelyn’s unlocked lab. When Alan began choking and tried to hit the emergency override, Marcus struck him with the brass calibrator weight, then cut the master breaker to wipe server logging.',
        secret: 'He has a ticket to Geneva booked for tomorrow morning with encrypted flash drives containing the stolen dark matter dataset.',
        isGuilty: true,
        motive: 'Alan discovered Marcus had stolen the proprietary research dataset to sell to a European consortium, and was about to publish a career-ending denunciation.',
        suspicionLevel: 80,
        nervousness: 85,
        openness: 35,
        privateKnowledge: [
          'Knows the exact high-voltage breaker sequence to trigger a facility-wide blackout without tripping backup generators.',
          'Knows the brass lens weight was wiped with industrial alcohol before being dropped near the telescope mount.',
          'Stole Evelyn’s keycard to access the biochemistry cold room 48 hours prior.'
        ],
        falseBeliefs: [
          'Believes the surveillance camera in the server corridor was totally disabled, not knowing the guard’s backup tape was rolling.'
        ],
        initialGreeting: 'Look, Detective, this is a profound tragedy for the international scientific community, but my time is exceptionally valuable. Let’s get this over with.',
        voiceStyle: 'Haughty, intellectual, sharp, quick-tempered when pressed.'
      },
      {
        id: 'suspect-chloe',
        name: 'Chloe Chen',
        role: 'Graduate Research Student',
        age: 24,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
        gender: 'Female',
        summary: 'Dr. Sterling’s hardworking doctoral assistant who recently uncovered massive data falsification in his published papers.',
        personality: 'Anxious, earnest, highly observant, trembling hands, terrified of getting blamed or losing her visa.',
        relationshipToVictim: 'PhD advisee under Dr. Sterling’s strict mentorship.',
        statedAlibi: 'Claims she was in the library reading room reviewing raw optical data logs between 10:00 PM and midnight.',
        actualActivity: 'Sneaked into Sterling’s office at 11:00 PM to photograph falsified logs to send to the university ethics board. Heard loud arguing between Sterling and a man at 11:15 PM and hid in the storage closet until the blackout.',
        secret: 'She has a thumb drive with evidence that Sterling faked 40% of his dark matter telemetry data to secure government grant money.',
        isGuilty: false,
        motive: 'Sterling threatened to revoke her PhD candidacy and report her for academic misconduct if she blew the whistle.',
        suspicionLevel: 55,
        nervousness: 75,
        openness: 70,
        privateKnowledge: [
          'Heard Sterling scream: "You won’t take my life’s work to CERN, you greedy parasite!" at 11:18 PM.',
          'Saw Marcus slip into the sub-basement chemical storage two nights ago around 1:00 AM.',
          'Knows the victim drank Earl Grey tea from his thermos every night at exactly 11:15 PM.'
        ],
        falseBeliefs: [
          'Believes Evelyn knew about the falsified data and helped Alan cover it up.'
        ],
        initialGreeting: 'Officer... I mean Detective! I swear I didn’t do anything wrong. I was just working on my thesis paper in the library... please don’t arrest me.',
        voiceStyle: 'Soft-spoken, rapid, nervous, authentic, eager to help if reassured.'
      },
      {
        id: 'suspect-arthur',
        name: 'Arthur Pendelton',
        role: 'Neighbor & Retired Town Historian',
        age: 68,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
        gender: 'Male',
        summary: 'Lives in the stone cottage 400 yards down the ridge. Keeps high-powered binoculars aimed at the facility due to old property disputes.',
        personality: 'Grumpy, eccentric, speaks in long-winded anecdotes, obsessed with local gossip and nighttime movements.',
        relationshipToVictim: 'Bitter neighbor embroiled in a 5-year lawsuit against Sterling over light pollution and mountain road easements.',
        statedAlibi: 'Claims he was in his porch rocking chair drinking chamomile tea and writing in his nature logbook all evening.',
        actualActivity: 'Was watching the observatory with his night-vision spotting scope. Saw Marcus enter the dome at 11:12 PM carrying a thermos, and saw Marcus run out at 11:28 PM throwing something into the drainage culvert.',
        secret: 'Arthur had planted a directional microphone in the trees near the perimeter fence to gather blackmail on Sterling’s late-night visitors.',
        isGuilty: false,
        motive: 'Vowed to "shut Sterling down by any means necessary" after losing his latest injunction last week.',
        suspicionLevel: 50,
        nervousness: 30,
        openness: 65,
        privateKnowledge: [
          'Saw someone toss a dark object into the eastern storm culvert right after the lights died.',
          'Heard tires screeching in the lower gravel turnoff around 11:35 PM.',
          'Noticed that the security guard Hank Ross was asleep in his truck with the lights off between 11:00 PM and 11:25 PM.'
        ],
        falseBeliefs: [
          'Believes the observatory is involved in clandestine military laser experiments.'
        ],
        initialGreeting: 'Hmph! About time you lawmen got up here. I told the mayor five years ago that Sterling’s cursed contraption was bringing nothing but sin and trouble up this ridge!',
        voiceStyle: 'Gruff, rustic, theatrical, gossipy.'
      },
      {
        id: 'suspect-hank',
        name: 'Officer Hank Ross',
        role: 'Night Security Guard',
        age: 38,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
        gender: 'Male',
        summary: 'Ex-county deputy now working private night patrol. Deep in sports gambling debt.',
        personality: 'Weary, evasive, plays dumb, tries to sound like a dutiful patrolman while sweating under scrutiny.',
        relationshipToVictim: 'Employee of the private security firm contracted by the university.',
        statedAlibi: 'Claims he was performing his mandatory perimeter foot patrol on the outer fence line between 11:00 PM and 11:30 PM.',
        actualActivity: 'Took a $1,000 cash bribe from Marcus earlier in the week to "accidentally forget" to lock the server room and to ignore the camera feed gap between 11:15 PM and 11:30 PM.',
        secret: 'Has an envelope of $1,000 crisp unmarked bills hidden behind the spare tire in his patrol SUV.',
        isGuilty: false,
        motive: 'Sterling caught him dozing on shift last week and threatened to have him fired without his pension.',
        suspicionLevel: 60,
        nervousness: 70,
        openness: 45,
        privateKnowledge: [
          'Marcus specifically asked him three days ago how the backup generator relay was wired.',
          'Found the access gate pad unlocked at 11:32 PM even though it should have been on automatic lockdown.',
          'Admitted he didn’t see Dr. Evelyn leave the building until after the siren went off.'
        ],
        falseBeliefs: [
          'Believes Chloe is romantically involved with Marcus and was helping him.'
        ],
        initialGreeting: 'Evening, Detective. I’ve secured the perimeter just like procedure says. Terrible thing about Dr. Sterling. I was on the north fence line when the power cut out.',
        voiceStyle: 'Casual cop tone, defensive, cautious, pauses before answering.'
      },
      {
        id: 'suspect-morales',
        name: 'Chief Inspector Clara Morales',
        role: 'Police Liaison & Forensics Lead',
        age: 41,
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
        gender: 'Female',
        summary: 'Your lead forensic partner on the scene. Thorough, objective, provides lab analysis and autopsy reports upon request.',
        personality: 'Crisp, professional, supportive, analytical, gives keen insights when presented with evidence.',
        relationshipToVictim: 'Investigator assigned to the case. No personal connection to victim.',
        statedAlibi: 'Dispatched to scene at 11:42 PM following emergency 911 dispatch.',
        actualActivity: 'Securing physical evidence, processing fingerprints, and overseeing chemical screens.',
        secret: 'None (Ally / Investigator partner).',
        isGuilty: false,
        motive: 'None.',
        suspicionLevel: 5,
        nervousness: 10,
        openness: 95,
        privateKnowledge: [
          'Autopsy preliminary: Victim ingested a lethal alkaloid within 15 minutes before receiving the blow to the parietal lobe.',
          'The brass lens calibrator weight matches the skull fracture depth perfectly.',
          'Fingerprint smudge on the high-voltage breaker panel shows traces of thermal compound used exclusively in the server room.'
        ],
        falseBeliefs: [],
        initialGreeting: 'Detective, I have finished cordoning off the dome and the lab. The coroner just completed the preliminary sweep. What area do you want me to analyze next?',
        voiceStyle: 'Sharp, disciplined, authoritative yet collaborative.'
      }
    ],
    locations: [
      {
        id: 'loc-dome',
        name: 'Telescope Control Dome (Crime Scene)',
        description: 'The vast spherical chamber housing the 80-inch reflecting telescope. Dr. Sterling’s body was found slumped in his swivel chair before the illuminated tracking console.',
        imageTheme: 'observatory-dome',
        clueIds: ['clue-lens-weight', 'clue-tea-thermos', 'clue-broken-vial', 'clue-hidden-dictaphone'],
        isCrimeScene: true,
        searchProgress: 0
      },
      {
        id: 'loc-server-room',
        name: 'Server Core & Mainframe Deck',
        description: 'Chilled room humming with supercomputing racks and storage arrays. The master circuit breaker and backup data tape cabinets are located here.',
        imageTheme: 'server-room',
        clueIds: ['clue-tripped-breaker', 'clue-wiped-drive-logs', 'clue-flight-itinerary'],
        isCrimeScene: false,
        searchProgress: 0
      },
      {
        id: 'loc-biochem-lab',
        name: 'Sub-Basement Biochemistry Lab',
        description: 'Dr. Evelyn Sterling’s private laboratory equipped with fume hoods, cryogenic freezers, and botanical alkaloid extraction apparatus.',
        imageTheme: 'chemistry-lab',
        clueIds: ['clue-cold-storage-log', 'clue-divorce-petition'],
        isCrimeScene: false,
        searchProgress: 0
      },
      {
        id: 'loc-library-office',
        name: 'Sterling’s Private Office & Library',
        description: 'Lined with dark mahogany bookshelves, astronomical star charts, a locked steel credenza, and a cluttered research desk.',
        imageTheme: 'vintage-office',
        clueIds: ['clue-falsified-data-sheet', 'clue-threat-email', 'clue-insurance-policy'],
        isCrimeScene: false,
        searchProgress: 0
      },
      {
        id: 'loc-guard-booth',
        name: 'Security Gatehouse & Perimeter',
        description: 'Small glass booth by the electronic iron gates overlooking the winding mountain access road.',
        imageTheme: 'security-booth',
        clueIds: ['clue-bribe-envelope', 'clue-gate-access-log', 'clue-culvert-glove'],
        isCrimeScene: false,
        searchProgress: 0
      }
    ],
    clues: [
      {
        id: 'clue-lens-weight',
        name: 'Heavy Brass Calibrator Lens Weight',
        locationId: 'loc-dome',
        locationName: 'Telescope Control Dome (Crime Scene)',
        category: 'physical',
        description: 'A solid 4-pound cylindrical brass counterweight used to balance the telescope optics. One rim is stained with blood and wiped with solvent.',
        detailedAnalysis: 'Forensics confirmed victim blood and hair follicles on the beveled edge. Latent partial fingerprint on the underside matches Dr. Marcus Vance’s right index finger.',
        isCrucial: true,
        discovered: false,
        icon: 'Wrench'
      },
      {
        id: 'clue-tea-thermos',
        name: 'Sterling’s Insulated Earl Grey Thermos',
        locationId: 'loc-dome',
        locationName: 'Telescope Control Dome (Crime Scene)',
        category: 'forensic',
        description: 'Dr. Sterling’s personal silver thermos. Half-empty, resting beside his keyboard.',
        detailedAnalysis: 'Chemical chromatography detected high concentrations of Aconitine neurotoxin mixed into the tea. The victim would have suffered severe respiratory paralysis within 5 minutes of drinking.',
        isCrucial: true,
        discovered: false,
        icon: 'CupSoda'
      },
      {
        id: 'clue-broken-vial',
        name: 'Shattered Amber Chemical Ampoule',
        locationId: 'loc-dome',
        locationName: 'Telescope Control Dome (Crime Scene)',
        category: 'physical',
        description: 'Glass shards found kicked beneath the pedestal base, labeled with batch code "ACN-94".',
        detailedAnalysis: 'Batch code matches the botanical poison stock registered in the Sub-Basement Biochemistry Lab inventory.',
        isCrucial: false,
        discovered: false,
        icon: 'FlaskConical'
      },
      {
        id: 'clue-hidden-dictaphone',
        name: 'Hidden Micro-Cassette Dictaphone',
        locationId: 'loc-dome',
        locationName: 'Telescope Control Dome (Crime Scene)',
        category: 'digital',
        description: 'Taped to the underside of the central terminal desk, with the voice-activated sensor still engaged.',
        detailedAnalysis: 'Audio recording at 11:17 PM: Sterling gasps, "Marcus... what did you put in... you thief... you won’t get the CERN patent..." followed by the sound of a scuffle and a heavy metallic impact.',
        isCrucial: true,
        discovered: false,
        icon: 'Mic'
      },
      {
        id: 'clue-tripped-breaker',
        name: 'Manually Overridden Master Circuit Breaker',
        locationId: 'loc-server-room',
        locationName: 'Server Core & Mainframe Deck',
        category: 'physical',
        description: 'The 480V high-voltage interlock handle in the server room was physically forced into the "TRIP" position at 11:26 PM.',
        detailedAnalysis: 'Smears of gray thermal paste found on the lever. Only technicians working on the mainframe CPU cooling units had thermal paste on their gloves tonight.',
        isCrucial: true,
        discovered: false,
        icon: 'Zap'
      },
      {
        id: 'clue-wiped-drive-logs',
        name: 'Wiped Hard Drive Partition',
        locationId: 'loc-server-room',
        locationName: 'Server Core & Mainframe Deck',
        category: 'digital',
        description: 'Server Node #4 had its entire optical telemetry backup overwritten with random zeros at 11:22 PM.',
        detailedAnalysis: 'The session was initiated using Dr. Marcus Vance’s root administrator credentials.',
        isCrucial: false,
        discovered: false,
        icon: 'HardDrive'
      },
      {
        id: 'clue-flight-itinerary',
        name: 'One-Way Flight Ticket to Geneva',
        locationId: 'loc-server-room',
        locationName: 'Server Core & Mainframe Deck',
        category: 'document',
        description: 'Folded paper printout tucked into Marcus Vance’s lab coat pocket hanging on the server room coat rack.',
        detailedAnalysis: 'Flight scheduled for 7:45 AM tomorrow out of Metro Airport, under the name Marcus Vance, with a meeting confirmation at the European Particle Physics Institute.',
        isCrucial: true,
        discovered: false,
        icon: 'Plane'
      },
      {
        id: 'clue-cold-storage-log',
        name: 'Biochem Lab Cryo-Storage Access Record',
        locationId: 'loc-biochem-lab',
        locationName: 'Sub-Basement Biochemistry Lab',
        category: 'document',
        description: 'Digital audit log showing keycard swipes for the hazardous toxins freezer.',
        detailedAnalysis: 'Shows an unauthorized access badge swipe at 1:14 AM two nights ago using Dr. Evelyn’s cloned keycard, followed by a 15ml discrepancy in the Aconitine stock.',
        isCrucial: false,
        discovered: false,
        icon: 'FileText'
      },
      {
        id: 'clue-divorce-petition',
        name: 'Unfiled Divorce Petition & Financial Audit',
        locationId: 'loc-biochem-lab',
        locationName: 'Sub-Basement Biochemistry Lab',
        category: 'document',
        description: 'Folder in Evelyn’s locked desk containing bank statements showing Alan withdrew $400,000 from joint accounts to fund speculative offshore shell companies.',
        detailedAnalysis: 'Provides strong motive for Evelyn, but forensic timeline proves she was in the west wing during the time of the fatal blow.',
        isCrucial: false,
        discovered: false,
        icon: 'FileCheck'
      },
      {
        id: 'clue-falsified-data-sheet',
        name: 'Annotated Dark Matter Telemetry Dossier',
        locationId: 'loc-library-office',
        locationName: 'Sterling’s Private Office & Library',
        category: 'document',
        description: 'Printout with red pen markup in Chloe Chen’s handwriting highlighting fabricated statistical anomalies in Sterling’s breakthrough paper.',
        detailedAnalysis: 'Attached note from Chloe: "Dr. Sterling, I cannot co-author this. If you submit to the Astrophysical Journal without corrections, I will notify the ethics committee."',
        isCrucial: false,
        discovered: false,
        icon: 'FileWarning'
      },
      {
        id: 'clue-threat-email',
        name: 'Draft Cease-and-Desist Email to Dr. Vance',
        locationId: 'loc-library-office',
        locationName: 'Sterling’s Private Office & Library',
        category: 'digital',
        description: 'Unsent email draft open on Sterling’s desktop computer timestamped 8:45 PM tonight.',
        detailedAnalysis: 'Sterling wrote: "Marcus, I know you transferred the proprietary dark matter telemetry to your private server. I am calling the Dean and the Federal Trade Commission at 9:00 AM tomorrow. Your career is over."',
        isCrucial: true,
        discovered: false,
        icon: 'Mail'
      },
      {
        id: 'clue-insurance-policy',
        name: 'Life Insurance Policy Renewal Notice',
        locationId: 'loc-library-office',
        locationName: 'Sterling’s Private Office & Library',
        category: 'document',
        description: 'Recent policy stating a $2,000,000 payout to Dr. Evelyn Sterling in case of accidental death or homicide.',
        detailedAnalysis: 'Shows policy was originally taken out 10 years ago when the facility first opened, not a newly created policy.',
        isCrucial: false,
        discovered: false,
        icon: 'DollarSign'
      },
      {
        id: 'clue-bribe-envelope',
        name: 'Cash Envelope Behind SUV Spare Tire',
        locationId: 'loc-guard-booth',
        locationName: 'Security Gatehouse & Perimeter',
        category: 'physical',
        description: 'Brown envelope containing ten crisp $100 bills tucked behind Officer Hank Ross’s vehicle tire.',
        detailedAnalysis: 'Serial numbers match a recent ATM withdrawal made by Dr. Marcus Vance yesterday afternoon.',
        isCrucial: true,
        discovered: false,
        icon: 'Banknote'
      },
      {
        id: 'clue-gate-access-log',
        name: 'Security Gate Digital Log Sheet',
        locationId: 'loc-guard-booth',
        locationName: 'Security Gatehouse & Perimeter',
        category: 'digital',
        description: 'Electronic gate sensor timestamps for vehicles and pedestrian turnstiles.',
        detailedAnalysis: 'Confirms no outside vehicles entered or left the compound between 9:00 PM and 11:42 PM (when police arrived). The killer was 100% inside the facility.',
        isCrucial: false,
        discovered: false,
        icon: 'ShieldCheck'
      },
      {
        id: 'clue-culvert-glove',
        name: 'Discarded Latex Glove in Drainage Culvert',
        locationId: 'loc-guard-booth',
        locationName: 'Security Gatehouse & Perimeter',
        category: 'physical',
        description: 'Found in the stone storm culvert described by the neighbor Arthur. Stained with solvent and silver thermal paste.',
        detailedAnalysis: 'DNA analysis inside the glove matches Dr. Marcus Vance. Chemical traces match both aconitine and telescope lens cleaning fluid.',
        isCrucial: true,
        discovered: false,
        icon: 'Search'
      }
    ],
    timeline: [
      {
        time: '8:45 PM',
        description: 'Dr. Sterling drafts a scathing cease-and-desist email to Marcus Vance threatening academic blacklisting and legal prosecution.',
        source: 'Office Computer Drafts',
        verified: true
      },
      {
        time: '10:30 PM',
        description: 'Chloe Chen seen in the library reading room reviewing raw telemetry logs.',
        source: 'Library Security Camera',
        verified: true
      },
      {
        time: '11:00 PM',
        description: 'Security Guard Hank Ross receives cash payoff, disables perimeter surveillance recording, and pretends to conduct a foot patrol.',
        source: 'Gatehouse Forensics & Cash Envelope',
        verified: true
      },
      {
        time: '11:15 PM',
        description: 'Marcus Vance slips into the observatory dome and spikes Sterling’s Earl Grey thermos with aconitine neurotoxin.',
        source: 'Hidden Dictaphone & Chemical Screen',
        verified: true
      },
      {
        time: '11:18 - 11:22 PM',
        description: 'Sterling ingests the tea, collapses in paralysis, and is struck with the heavy brass lens calibrator by Marcus.',
        source: 'Autopsy & Dictaphone Audio',
        verified: true
      },
      {
        time: '11:26 PM',
        description: 'Marcus runs to the Server Core Room, wipes optical backup drives, and manually trips the 480V main breaker.',
        source: 'Server Logs & Circuit Breaker',
        verified: true
      },
      {
        time: '11:28 PM',
        description: 'Marcus discards latex gloves in the east drainage culvert as witnessed by neighbor Arthur Pendelton.',
        source: 'Neighbor Statement & Culvert Recovery',
        verified: true
      },
      {
        time: '11:30 PM',
        description: 'Compound plunged into darkness; automated emergency power failure alarm triggers 911 dispatch.',
        source: 'Facility Central Control System',
        verified: true
      }
    ],
    solution: {
      culpritId: 'suspect-marcus',
      culpritName: 'Dr. Marcus Vance',
      murderWeapon: 'Heavy Brass Calibrator Lens Weight + Aconitine Neurotoxin in Thermos',
      motive: 'To silence Dr. Sterling before he could expose Marcus’s theft of proprietary dark matter research and to flee to Geneva with the stolen multimillion-dollar dataset.',
      timelineOfCrime: 'At 11:15 PM, Marcus poisoned Sterling’s tea, struck him with the brass calibrator when he resisted, wiped the server backup partitions, tripped the master breaker to cover his escape, bribed the guard to look away, and discarded the evidence in the culvert.',
      methodDescription: 'Laced victim’s Earl Grey tea with stolen biochemical toxin (Aconitine), then delivered a fatal blow with the 4-lb telescope brass counterweight before sabotaging server logs and circuit breakers.',
      keyCluesNeeded: ['clue-hidden-dictaphone', 'clue-lens-weight', 'clue-threat-email', 'clue-flight-itinerary', 'clue-culvert-glove'],
      confessionText:
        '“Fine! Yes, I did it! Alan was a parasite who built his entire reputation on the backs of his colleagues! I gave seven years of my life to that dark matter algorithm—seven years! And when I arranged to take it to CERN where it would actually change humanity, he threatened to destroy my career and throw me in prison. He was going to send that email tomorrow morning! I had no choice... I couldn’t let a dinosaur steal my legacy!”'
    }
  },
  {
    id: 'case-blackwood-poison',
    title: 'The Venom of Highclere: The Blackwood Banquet',
    subtitle: 'Blackwood Manor Dining Hall • 8:45 PM',
    difficulty: 'Master Sleuth',
    setting: 'Gothic English estate during a torrential storm. All phone lines and roads cut off.',
    timePeriod: '1920s Noir / Golden Age Mystery',
    victim: {
      name: 'Lord Reginald Blackwood',
      role: 'Billionaire Industrialist & Patriarch',
      age: 71,
      timeOfDeath: '8:45 PM',
      causeOfDeath: 'Potassium Cyanide ingested in a vintage 1896 Port Wine goblet.',
      briefBio: 'Authoritarian railroad magnate who had summoned his entire household to announce a complete disinheritance of his heirs in favor of an obscure overseas foundation.',
      foundLocation: 'Head of the Grand Mahogany Dining Table, collapsed forward onto his dessert plate.',
    },
    synopsis:
      'During his 71st birthday feast, just as the family lawyer prepared the pen for Lord Blackwood to sign his rewritten last will and testament, the Lord took a final sip of his prized vintage Port, gasped for breath, and collapsed dead. The mahogany doors were locked against the storm, meaning the poisoner sits among the dinner guests.',
    suspects: [
      {
        id: 'suspect-julian',
        name: 'Julian Blackwood',
        role: 'Disinherited Eldest Son',
        age: 36,
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
        gender: 'Male',
        summary: 'A charming but reckless gambler facing bankruptcy and ruin if cut from the family estate.',
        personality: 'Cynical, dry wit, nervous smoker, desperately hides a stack of debts from London bookmakers.',
        relationshipToVictim: 'Eldest son and former sole heir before the dispute.',
        statedAlibi: 'Claims he was in the conservatory smoking a cigar between 8:30 PM and 8:45 PM.',
        actualActivity: 'Was sneaking through his father’s study trying to locate the draft will to burn it before it could be signed.',
        secret: 'Owes £50,000 to ruthless London syndicates due tomorrow.',
        isGuilty: false,
        motive: 'Inheritance of the entire £10,000,000 Blackwood estate.',
        suspicionLevel: 75,
        nervousness: 80,
        openness: 40,
        privateKnowledge: [
          'Saw Beatrice the nurse whispering with Dr. Sterling’s private physician in the pantry earlier.',
          'Noticed the seal on the Port bottle was broken before dinner.'
        ],
        falseBeliefs: ['Believes the butler poisoned the soup.'],
        initialGreeting: 'Detective, father had a thousand enemies. Look around this table and you will see five people who wanted him six feet under.',
        voiceStyle: 'Upper-class English drawl, sarcastic, anxious.'
      },
      {
        id: 'suspect-beatrice',
        name: 'Beatrice Vance-Morley',
        role: 'Private Nurse & Companion',
        age: 32,
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
        gender: 'Female',
        summary: 'Quiet, devoted nurse who administered Lord Blackwood’s daily heart tinctures.',
        personality: 'Demure, soft-spoken, intensely observant, deeply resentful beneath her subservient exterior.',
        relationshipToVictim: 'Personal medical attendant for 4 years.',
        statedAlibi: 'Claims she was preparing Lord Blackwood’s evening digitalis drops in the pantry.',
        actualActivity: 'SHE IS THE KILLER. She is secretly the illegitimate daughter of Reginald’s ruined former business partner Thomas Morley. She coated the inside rim of his dedicated silver monogrammed Port glass with cyanide powder.',
        secret: 'Her real name is Beatrice Morley; she took this position specifically to avenge her father’s suicide after Reginald bankrupted him in 1912.',
        isGuilty: true,
        motive: 'Blood revenge for her father’s destruction and suicide caused by Reginald Blackwood.',
        suspicionLevel: 60,
        nervousness: 45,
        openness: 55,
        privateKnowledge: [
          'Reginald only ever drank from the monogrammed heirloom goblet on his birthday.',
          'The cyanide was concealed inside a hollow locket with her father’s portrait.'
        ],
        falseBeliefs: ['Believed the lawyer had already sent a copy of the will to London.'],
        initialGreeting: 'It was heartbreaking, Inspector. His heart had been frail, but this sudden attack... it was horrifying to watch.',
        voiceStyle: 'Quiet, polite, sorrowful facade masking icy resolve.'
      },
      {
        id: 'suspect-pierre',
        name: 'Chef Pierre Dumont',
        role: 'Executive Head Chef',
        age: 48,
        avatar: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&auto=format&fit=crop&q=80',
        gender: 'Male',
        summary: 'French culinary artist who had a fierce public shouting match with Reginald over poisoned game birds last month.',
        personality: 'Passionate, dramatic, indignant at any suggestion his food was compromised.',
        relationshipToVictim: 'Private estate chef of 8 years.',
        statedAlibi: 'Plating the chocolate soufflé in the kitchen with two scullery maids under his direct supervision.',
        actualActivity: 'Was indeed plating dessert in the kitchen; scullery maids confirm he never left the stove.',
        secret: 'Was skimming expensive vintage wines from the cellar to sell to local speakeasies.',
        isGuilty: false,
        motive: 'Reginald slapped him and threatened to ruin his culinary reputation yesterday.',
        suspicionLevel: 50,
        nervousness: 60,
        openness: 70,
        privateKnowledge: [
          'Nurse Beatrice brought the silver monogrammed goblet into the pantry herself 10 minutes before dinner.'
        ],
        falseBeliefs: ['Believes the wine merchant in town delivered bad liquor.'],
        initialGreeting: 'Mon Dieu! To accuse my kitchen of poison is an insult to France! I cooked for royalty before this madman!',
        voiceStyle: 'French accent, flamboyant, outraged.'
      },
      {
        id: 'suspect-arthur-butler',
        name: 'Wadsworth',
        role: 'Head Butler of Blackwood Manor',
        age: 62,
        avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&auto=format&fit=crop&q=80',
        gender: 'Male',
        summary: 'The impeccably stoic butler who knows every secret in the walls of Blackwood Manor.',
        personality: 'Impassive, formal, unshakeable etiquette, observant eye.',
        relationshipToVictim: 'Loyal servant for 35 years.',
        statedAlibi: 'Serving the port wine from the decanter into each guest’s glass at 8:40 PM.',
        actualActivity: 'Poured the wine from the communal decanter. All guests drank from the same decanter, but only Reginald died.',
        secret: 'Saw Beatrice wiping the rim of Reginald’s goblet with a linen cloth before dinner but assumed she was polishing it.',
        isGuilty: false,
        motive: 'Left a modest annuity in the will.',
        suspicionLevel: 35,
        nervousness: 20,
        openness: 85,
        privateKnowledge: [
          'All guests drank the exact same 1896 Port from the silver decanter; the poison was not in the liquid decanter itself, but on Lord Blackwood’s specific glass.',
          'Lord Blackwood kept a locked diary in the library desk recording his past financial conquests.'
        ],
        falseBeliefs: [],
        initialGreeting: 'The manor is at your disposal, Detective. A most ghastly occurrence on what was meant to be a celebratory evening.',
        voiceStyle: 'Formal British butler, deliberate, dignified.'
      }
    ],
    locations: [
      {
        id: 'loc-dining-hall',
        name: 'Grand Dining Hall (Crime Scene)',
        description: 'Atmospheric banquet room with a 20-foot chandelier, roaring fireplace, and long banquet table set with crystal stemware.',
        imageTheme: 'gothic-dining-hall',
        clueIds: ['clue-monogrammed-goblet', 'clue-wine-decanter', 'clue-unsigned-will'],
        isCrimeScene: true,
        searchProgress: 0
      },
      {
        id: 'loc-manor-pantry',
        name: 'Butler’s Pantry & Medicine Station',
        description: 'Polished silver cabinets, crystal decanters, and the locked medicine chest where Nurse Beatrice stored tinctures.',
        imageTheme: 'butler-pantry',
        clueIds: ['clue-hollow-locket', 'clue-cyanide-residue', 'clue-morley-newspaper'],
        isCrimeScene: false,
        searchProgress: 0
      },
      {
        id: 'loc-manor-library',
        name: 'Lord Blackwood’s Private Study',
        description: 'Leather armchairs, smell of pipe tobacco, heavy steel wall safe, and ledger books dating back to the turn of the century.',
        imageTheme: 'study-room',
        clueIds: ['clue-morley-ledger', 'clue-gambling-letters'],
        isCrimeScene: false,
        searchProgress: 0
      }
    ],
    clues: [
      {
        id: 'clue-monogrammed-goblet',
        name: 'Silver Monogrammed Heirloom Goblet',
        locationId: 'loc-dining-hall',
        locationName: 'Grand Dining Hall (Crime Scene)',
        category: 'physical',
        description: 'Lord Blackwood’s personal goblet, engraved with the Blackwood crest. Smells faintly of bitter almonds.',
        detailedAnalysis: 'Potassium cyanide crystals discovered coated along the interior upper rim where the victim’s lips touched.',
        isCrucial: true,
        discovered: false,
        icon: 'Wine'
      },
      {
        id: 'clue-wine-decanter',
        name: 'Sterling Silver Port Decanter',
        locationId: 'loc-dining-hall',
        locationName: 'Grand Dining Hall (Crime Scene)',
        category: 'forensic',
        description: 'The shared decanter from which Wadsworth poured wine for all five dinner guests.',
        detailedAnalysis: 'Chemical testing of the wine remaining in the decanter showed zero trace of poison. The wine itself was completely pure.',
        isCrucial: true,
        discovered: false,
        icon: 'GlassWater'
      },
      {
        id: 'clue-unsigned-will',
        name: 'Unsigned Last Will and Testament',
        locationId: 'loc-dining-hall',
        locationName: 'Grand Dining Hall (Crime Scene)',
        category: 'document',
        description: 'Drafted legal document revoking all previous inheritances to Julian and leaving the entire fortune to an overseas charity.',
        detailedAnalysis: 'The signature line is completely blank; the gold fountain pen rolled across the table when Reginald collapsed.',
        isCrucial: false,
        discovered: false,
        icon: 'Scroll'
      },
      {
        id: 'clue-hollow-locket',
        name: 'Hollow Filigree Locket with Hidden Compartment',
        locationId: 'loc-manor-pantry',
        locationName: 'Butler’s Pantry & Medicine Station',
        category: 'physical',
        description: 'Antique silver locket found hidden behind the tea canisters in the pantry. Contains a miniature portrait of a man in 1900s attire.',
        detailedAnalysis: 'The miniature portrait is labeled "Thomas Morley, 1865-1912 - Never Forgotten". Swab of the hollow cavity tested positive for cyanide powder.',
        isCrucial: true,
        discovered: false,
        icon: 'Lock'
      },
      {
        id: 'clue-cyanide-residue',
        name: 'Cyanide Residue on Polishing Cloth',
        locationId: 'loc-manor-pantry',
        locationName: 'Butler’s Pantry & Medicine Station',
        category: 'forensic',
        description: 'A damp linen polishing cloth discarded at the bottom of the linen hamper.',
        detailedAnalysis: 'Traces of silver polish mixed with potassium cyanide and Nurse Beatrice’s lavender hand cream.',
        isCrucial: true,
        discovered: false,
        icon: 'Sparkles'
      },
      {
        id: 'clue-morley-newspaper',
        name: 'Yellowed 1912 Newspaper Clipping',
        locationId: 'loc-manor-pantry',
        locationName: 'Butler’s Pantry & Medicine Station',
        category: 'document',
        description: 'Headline: "Tragic Suicide of Thomas Morley Following Hostile Takeover by Reginald Blackwood."',
        detailedAnalysis: 'Handwritten inscription on the margin: "He stole our lives. Justice will be served on his 71st year."',
        isCrucial: true,
        discovered: false,
        icon: 'Newspaper'
      },
      {
        id: 'clue-morley-ledger',
        name: 'Blackwood 1912 Acquisition Ledger',
        locationId: 'loc-manor-library',
        locationName: 'Lord Blackwood’s Private Study',
        category: 'document',
        description: 'Confidential business ledger detailing how Reginald drove his partner Thomas Morley into bankruptcy using forged bank guarantees.',
        detailedAnalysis: 'Establishes the historical motive connecting Reginald’s past crimes directly to the Morley family.',
        isCrucial: false,
        discovered: false,
        icon: 'BookOpen'
      },
      {
        id: 'clue-gambling-letters',
        name: 'Urgent Debt Collection Telegrams',
        locationId: 'loc-manor-library',
        locationName: 'Lord Blackwood’s Private Study',
        category: 'document',
        description: 'Letters addressed to Julian Blackwood from high-stakes gambling syndicates threatening violence.',
        detailedAnalysis: 'Explains Julian’s panic and suspicious behavior, but does not tie him to the cyanide delivery mechanism.',
        isCrucial: false,
        discovered: false,
        icon: 'MailWarning'
      }
    ],
    timeline: [
      {
        time: '7:30 PM',
        description: 'Dinner guests assemble in the salon; Lord Blackwood announces his intention to sign the new disinheriting will over dessert.',
        source: 'Dinner Guest Accounts',
        verified: true
      },
      {
        time: '8:15 PM',
        description: 'Nurse Beatrice slips into the pantry under pretense of preparing medicine and applies cyanide powder to the rim of Reginald’s personal goblet.',
        source: 'Forensics & Linen Hamper',
        verified: true
      },
      {
        time: '8:40 PM',
        description: 'Wadsworth serves the vintage 1896 Port into all guest glasses from the uncontaminated decanter.',
        source: 'Butler Statement & Decanter Analysis',
        verified: true
      },
      {
        time: '8:45 PM',
        description: 'Lord Blackwood raises his glass for a toast, ingests the cyanide from the goblet rim, and collapses immediately.',
        source: 'Dining Room Eye-Witnesses',
        verified: true
      }
    ],
    solution: {
      culpritId: 'suspect-beatrice',
      culpritName: 'Beatrice Vance-Morley',
      murderWeapon: 'Potassium Cyanide coated on the rim of the Heirloom Monogrammed Goblet',
      motive: 'Revenge for Reginald Blackwood driving her father Thomas Morley into bankruptcy and suicide in 1912.',
      timelineOfCrime: 'At 8:15 PM, Beatrice used cyanide concealed in her hollow locket to coat Reginald’s dedicated goblet rim in the pantry. When Wadsworth served the harmless wine at 8:40 PM, only Reginald was exposed when he drank at 8:45 PM.',
      methodDescription: 'Applied potassium cyanide to the drinking rim of the victim’s dedicated silver goblet, ensuring that shared wine from the clean decanter would only poison Lord Blackwood.',
      keyCluesNeeded: ['clue-monogrammed-goblet', 'clue-wine-decanter', 'clue-hollow-locket', 'clue-cyanide-residue', 'clue-morley-newspaper'],
      confessionText:
        '“Do not look at me with pity or horror! That monster ruined my family. He drove my father into the Thames with his forged ledgers and stole every penny we owned while his heirs lived in silk and silver! For thirty years I waited for the day I could look him in the eye as the venom took hold. I have zero regrets!”'
    }
  }
];
