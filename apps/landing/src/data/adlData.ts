export interface ADLSolution {
  title: string
  description: string
  personName: string
  timeAgo: string
  whatMadeItWork: string
  detailedDescription: string
}

export interface ADLCategory {
  id: string
  label: string
  icon: string
  solutions: ADLSolution[]
}

export const adlCategories: ADLCategory[] = [
  {
    id: 'bathing',
    label: 'Bathing',
    icon: '🚿',
    solutions: [
      {
        title: 'Shower Transfer Bench',
        description: 'A bench that sits half inside, half outside the tub — slide across instead of stepping over.',
        personName: 'Robert P.',
        timeAgo: '2 weeks ago',
        whatMadeItWork: 'The non-slip feet and adjustable height meant it worked with our oddly sized tub. My wife can now shower independently again.',
        detailedDescription: 'After my wife had her hip replacement, stepping over the tub edge was impossible. We tried grab bars first but they weren\'t enough. The transfer bench lets her sit down outside the tub and slide across safely. We got one with a backrest which makes her feel much more secure. It took about 10 minutes to set up with no tools needed.',
      },
      {
        title: 'Suction-Cup Grab Bars',
        description: 'Portable grab bars that attach to smooth surfaces without drilling — great for renters.',
        personName: 'Linda M.',
        timeAgo: '1 month ago',
        whatMadeItWork: 'No drilling required meant we could use them in our rental apartment. They hold up to 250 lbs and I test them every time before use.',
        detailedDescription: 'We rent our apartment so permanent modifications aren\'t an option. These suction-cup grab bars have been a game changer for my dad who visits frequently. They attach firmly to tile and glass surfaces. The green/red indicator shows when they\'re securely locked. We place them at entry point and inside the shower at chest height.',
      },
      {
        title: 'Long-Handled Bath Sponge',
        description: 'An angled sponge on a 15-inch handle for reaching back, legs, and feet without bending.',
        personName: 'Carol A.',
        timeAgo: '3 weeks ago',
        whatMadeItWork: 'The slight curve in the handle reaches my back perfectly. I don\'t have to twist or bend anymore, which was causing me pain every shower.',
        detailedDescription: 'With my limited shoulder mobility from arthritis, washing my back and lower legs was becoming increasingly difficult and painful. This long-handled sponge has a gentle curve that reaches everywhere. The sponge end is replaceable. I keep it hanging in the shower with a suction hook. Such a simple solution but it gave me back my independence in bathing.',
      },
    ],
  },
  {
    id: 'dressing',
    label: 'Dressing',
    icon: '👔',
    solutions: [
      {
        title: 'Magnetic Button Replacements',
        description: 'Replace regular buttons with magnetic closures — shirts look normal but close with a snap.',
        personName: 'Patricia W.',
        timeAgo: '1 month ago',
        whatMadeItWork: 'My husband\'s dress shirts look completely normal from the outside, but he can put them on one-handed now after his stroke.',
        detailedDescription: 'After my husband\'s stroke left him with limited use of his left hand, buttoning shirts was taking 20+ minutes and leaving him frustrated. A friend told us about magnetic button conversion kits. We converted 5 of his favorite shirts — you sew the magnetic snaps behind the existing buttons. They look identical to regular buttons but close with a satisfying snap. He can dress himself in minutes now.',
      },
      {
        title: 'Long-Handled Shoehorn',
        description: 'A 24-inch shoehorn so you can put on shoes without bending over.',
        personName: 'Frank S.',
        timeAgo: '2 months ago',
        whatMadeItWork: 'The extra length means I don\'t bend at all. Combined with elastic shoelaces, I can be out the door in minutes.',
        detailedDescription: 'Bending down to put on shoes was becoming a real problem with my back issues. A 24-inch shoehorn combined with elastic no-tie shoelaces completely solved it. I converted all my regular shoes with the elastic laces — they stretch to slip on but look like regular tied laces. The long shoehorn has a slight hook that catches the heel of the shoe. Together, I went from struggling for 10 minutes to being ready in under a minute.',
      },
      {
        title: 'Front-Closing Bras',
        description: 'Bras with magnetic front closures — no more reaching behind your back.',
        personName: 'Helen G.',
        timeAgo: '3 weeks ago',
        whatMadeItWork: 'The magnets are strong enough to stay closed all day but I can open them easily with one hand. Finally, a dignified solution.',
        detailedDescription: 'Reaching behind my back to clasp a traditional bra became impossible with my shoulder arthritis. I tried the hook-in-front-and-spin method but it hurt my skin. These front-closing bras with magnetic clasps changed everything. They look and feel like regular bras, provide good support, and I can put them on and take them off completely independently. They come in multiple sizes and styles.',
      },
    ],
  },
  {
    id: 'eating',
    label: 'Eating',
    icon: '🍽️',
    solutions: [
      {
        title: 'Weighted Utensils',
        description: 'Heavy-handled forks and spoons that reduce hand tremors while eating.',
        personName: 'James T.',
        timeAgo: '1 month ago',
        whatMadeItWork: 'The extra weight in the handle steadies my hand enough that I can eat soup again without spilling. Simple but life-changing.',
        detailedDescription: 'My essential tremor made eating embarrassing and messy, especially liquids. These weighted utensils have stainless steel handles filled with weight material. The extra heft dampens the tremor significantly. I can eat soup, rice, and other difficult foods again. I bring them to restaurants in a small carrying case — no one even notices they\'re different from regular silverware.',
      },
      {
        title: 'Plate Guard / Scoop Plate',
        description: 'A raised edge on one side of the plate so food can be pushed against it for one-handed eating.',
        personName: 'Dorothy K.',
        timeAgo: '2 weeks ago',
        whatMadeItWork: 'The suction cup base keeps the plate from sliding, and the raised edge gives me something to push food against. I can eat independently again.',
        detailedDescription: 'After losing function in my left arm, eating with one hand meant food just pushed around the plate. A scoop plate with a high curved edge on one side solved this completely. I push food against the raised edge and it scoops right onto the fork. The suction cup on the bottom prevents the plate from moving. It looks like a regular plate — no one at dinner notices anything different about it.',
      },
      {
        title: 'Universal Cuff Utensil Holder',
        description: 'A strap that wraps around the palm and holds any utensil — for people who can\'t grip.',
        personName: 'Michael R.',
        timeAgo: '6 weeks ago',
        whatMadeItWork: 'It adjusts to hold any utensil securely, and the leather strap is comfortable for a full meal. My son eats independently at school now.',
        detailedDescription: 'My 8-year-old son has limited hand grip due to cerebral palsy. The universal cuff wraps around his palm with an adjustable velcro strap and has a pocket that holds any standard utensil. We slide a fork or spoon in and he can feed himself. We have three — one for home, school, and grandma\'s house. It gave him so much confidence at lunch with his classmates.',
      },
    ],
  },
  {
    id: 'mobility',
    label: 'Mobility',
    icon: '🦽',
    solutions: [
      {
        title: 'Portable Folding Ramp',
        description: 'A lightweight aluminum ramp that folds in half — carry it anywhere for 1-3 step access.',
        personName: 'Thomas H.',
        timeAgo: '1 month ago',
        whatMadeItWork: 'It folds to the size of a briefcase and weighs only 10 lbs. I keep it in my trunk and can access any building with 1-3 steps.',
        detailedDescription: 'So many places I want to go have just 1-2 steps at the entrance that make them completely inaccessible with my wheelchair. This portable folding ramp is made of aircraft-grade aluminum, folds in half, and handles up to 600 lbs. I keep it in my car trunk. When I encounter steps, I unfold it in 30 seconds. It has changed where I can go — restaurants, friends\' houses, small shops.',
      },
      {
        title: 'Stair Climbing Hand Truck',
        description: 'A wheeled cart that rolls up and down stairs — move heavy items between floors safely.',
        personName: 'Barbara L.',
        timeAgo: '3 weeks ago',
        whatMadeItWork: 'The tri-wheel design rolls smoothly over each step. I can move laundry baskets and groceries up from the basement by myself now.',
        detailedDescription: 'Living in a two-story home with knee problems meant I was avoiding going between floors. Carrying laundry or groceries on stairs was dangerous. This stair-climbing hand truck has a rotating tri-wheel on each side that grips each step. I load it up and walk it up or down stairs with minimal effort. It handles up to 150 lbs and folds flat for storage.',
      },
      {
        title: 'Knee Scooter',
        description: 'A wheeled scooter you rest your knee on — faster and more stable than crutches.',
        personName: 'Richard W.',
        timeAgo: '2 months ago',
        whatMadeItWork: 'So much faster than crutches and both hands are free. I could carry things, open doors, and keep up with normal walking speed.',
        detailedDescription: 'After my foot surgery, crutches were exhausting and I kept bumping into things. A knee scooter let me rest my injured leg on a padded platform and push with my good leg. Both hands are completely free. I could carry coffee, open doors, even go grocery shopping. Most models fold up for car transport. It made my 6-week recovery period so much more manageable.',
      },
    ],
  },
  {
    id: 'toileting',
    label: 'Toileting',
    icon: '🚽',
    solutions: [
      {
        title: 'Raised Toilet Seat with Armrests',
        description: 'Adds 4 inches of height plus sturdy armrests — sit down and stand up safely.',
        personName: 'Helen B.',
        timeAgo: '1 month ago',
        whatMadeItWork: 'The padded armrests give me leverage to stand without calling for help. It clamps on securely and I feel completely safe.',
        detailedDescription: 'Getting up from a standard-height toilet was becoming impossible with my knee arthritis. The raised seat adds 4 inches of height which makes all the difference, and the armrests provide leverage. It clamps onto the existing toilet bowl — no tools or permanent modification needed. The padded arms are comfortable and sturdy. I finally have bathroom independence back, which was the most important thing to me.',
      },
      {
        title: 'Bidet Attachment',
        description: 'A simple bidet that connects to your existing toilet — better hygiene with minimal reaching.',
        personName: 'George M.',
        timeAgo: '2 months ago',
        whatMadeItWork: 'Installation took 15 minutes with no plumber needed. The adjustable water pressure and angle mean I don\'t need to reach or twist at all.',
        detailedDescription: 'Limited shoulder mobility made personal hygiene after using the toilet difficult and uncomfortable. A bidet attachment was the answer. It connects between the toilet seat and bowl, hooks up to the existing water supply line. No electricity needed for basic models. The water pressure is adjustable and the nozzle angle covers everything. It improved hygiene significantly and I don\'t need to twist or reach anymore. My only regret is not getting one sooner.',
      },
      {
        title: 'Bedside Commode',
        description: 'A portable toilet chair for nighttime use — avoid risky trips to the bathroom in the dark.',
        personName: 'Ruth K.',
        timeAgo: '3 weeks ago',
        whatMadeItWork: 'Adjustable height, splash guard, and it doesn\'t look medical. Nighttime bathroom trips were the most dangerous — this eliminated the risk.',
        detailedDescription: 'Nighttime trips to the bathroom were becoming dangerous — navigating hallways while groggy, with poor night vision. After a near-fall, we got a bedside commode. Modern ones look like a regular chair. The removable bucket is easy to clean. Adjustable height means it works like a regular chair during the day. The peace of mind alone was worth it — no more risky nighttime walks to the bathroom.',
      },
    ],
  },
  {
    id: 'transferring',
    label: 'Transferring',
    icon: '🔄',
    solutions: [
      {
        title: 'Transfer Board for Bed to Chair',
        description: 'A smooth board you bridge between bed and wheelchair — slide across instead of standing.',
        personName: 'David R.',
        timeAgo: '1 month ago',
        whatMadeItWork: 'The slightly curved shape and slick surface make the slide effortless. My morning transfer went from a two-person job to something I do solo.',
        detailedDescription: 'Transferring from bed to wheelchair was the hardest part of my day — requiring my wife to help lift me. The transfer board bridges the gap between bed and chair. I position it under one hip, then slide across the smooth surface to the other side. The board is contoured to prevent tipping and the surface is friction-free. After a week of practice, I was doing it completely independently. It gave both me and my wife our freedom back.',
      },
      {
        title: 'Bed Rail with Organizer Pouch',
        description: 'A support rail for getting in and out of bed — plus pockets for phone, remote, and water.',
        personName: 'Margaret C.',
        timeAgo: '2 weeks ago',
        whatMadeItWork: 'The rail slides between mattress and box spring — no tools. The organizer pouch keeps everything within arm\'s reach so I don\'t need to get up.',
        detailedDescription: 'Getting in and out of bed was a struggle and I kept everything I needed on the nightstand just out of reach. This bed rail slides between the mattress and box spring for secure installation. The wide grip handle helps me pull myself up and provides support when swinging my legs over. The attached organizer pouch holds my phone, glasses, water bottle, and remote. Everything I need is right there. No more stretching or risking falls to reach the nightstand.',
      },
      {
        title: 'Lift Cushion for Armchair',
        description: 'A powered cushion that gently tilts forward to help you stand up from any chair.',
        personName: 'William J.',
        timeAgo: '6 weeks ago',
        whatMadeItWork: 'It runs on batteries so it works on any chair without cords. The slow, gentle lift gives me time to get my balance before I\'m fully standing.',
        detailedDescription: 'Standing up from my favorite armchair was getting harder every month. I didn\'t want to give up the chair or buy an expensive lift recliner. This portable lift cushion sits on any chair and runs on batteries. When I press the button, it slowly tilts forward, giving me a gentle boost to standing position. The gradual lift means I can get my balance and my walker positioned before I\'m fully upright. It works on dining chairs too — I bring it to family dinners.',
      },
    ],
  },
]
