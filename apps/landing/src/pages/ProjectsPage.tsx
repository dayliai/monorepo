import PageHero from '../components/ui/PageHero'
import { Band } from '../components/ui/Section'
import { ButtonLink, ForumNote } from '../components/ui/Button'
import { forum } from '../data/site'
import { useDocumentTitle } from '../lib/useDocumentTitle'

const THREADS = `${forum.home}threads`

/** Same file the Partners page uses. */
const cvadLogo = { src: '/images/partners/partner-unt-cvad.png', alt: 'UNT College of Visual Arts and Design', w: 500, h: 314 }

interface Project {
  name: string
  oneLine: string
  whoItHelps: string
  credit: string
  status: string
  href: string
  image: { src: string; alt: string; width: number; height: number; /** object-position, keeps the main object in the crop */ position?: string }
}

const projects: Project[] = [
  {
    name: 'Stationary Toothbrush',
    oneLine: 'Brush your teeth hands free with a face height brush and three foot pedals.',
    whoItHelps:
      'People with little or no arm and hand movement, such as people with quadriplegia, paralysis, or after a stroke.',
    credit: 'Concept by Jakael Meadows, user research by Hannah Vice',
    status: 'Open for feedback',
    href: `${THREADS}/stationary-toothbrush-hands-free-brushing-with-foot-pedals.16/`,
    image: {
      src: '/images/projects/card_toothbrush.jpg',
      alt: 'A hands free toothbrush station next to a sink, with a tall padded pole holding the brush at face height and a foot pedal on the floor.',
      width: 606,
      height: 805,
      position: '50% 75%',
    },
  },
  {
    name: 'Automatic Shampoo Aid',
    oneLine: 'Wash your hair hands free with a touchless shampoo dispenser and a fixed scrub brush.',
    whoItHelps:
      "People who find it hard to raise their arms or scrub, such as people with Parkinson's, cerebral palsy, MS, Ehlers Danlos syndrome, or chronic fatigue.",
    credit: 'Created by Kerime Siller, user research by Hannah Vice',
    status: 'Open for feedback',
    href: `${THREADS}/automatic-shampoo-aid-wash-your-hair-without-raising-your-arms.17/`,
    image: {
      src: '/images/projects/card_shampoo.jpg',
      alt: 'A white shampoo dispenser in a cup and a scrub brush, each on an adjustable arm attached to a shower wall.',
      width: 654,
      height: 1163,
      position: '50% 52%',
    },
  },
  {
    name: 'Leg Lift',
    oneLine: 'Lift and move your legs on your own during transfers, with an adjustable cane and foot scoop.',
    whoItHelps: 'Wheelchair users and people with reduced lower body strength.',
    credit: 'Created by Camryn Yanes, user research by Cameron Bell',
    status: 'Open for feedback',
    href: `${THREADS}/leg-lift-move-your-own-legs-during-transfers.18/`,
    image: {
      src: '/images/projects/card_leglift.jpg',
      alt: 'The Leg Lift standing against a brick wall: a black walking cane joined to a black and green dustpan scoop.',
      width: 852,
      height: 479,
      position: '44% 50%',
    },
  },
  {
    name: 'Adapted Utensil',
    oneLine: 'One 3D printed utensil that spears and scoops, for eating with little or no wrist movement.',
    whoItHelps: 'People with carpal tunnel, arthritis, tendon injuries, or hand fractures.',
    credit: 'Created by Amber Waters, user research by Aaron Tang',
    status: 'Open for feedback',
    href: `${THREADS}/adapted-utensil-a-free-3d-printable-fork-and-spoon-in-one.19/`,
    image: {
      src: '/images/projects/card_utensil.jpg',
      alt: 'Four 3D printed utensils in pink and black, each with a deep spoon bowl and fork prongs in one piece, on round or long grips.',
      width: 665,
      height: 641,
    },
  },
]

function ProjectCard({ p }: { p: Project }) {
  return (
    // Image left, text right from 480px; stacked (image on top) below that, where a side column would squeeze the text.
    <article className="flex flex-col min-[480px]:flex-row min-[480px]:items-start gap-5 md:gap-6 h-full p-6 bg-dll-card border border-dll-line rounded-2xl">
      <img
        src={p.image.src}
        alt={p.image.alt}
        width={p.image.width}
        height={p.image.height}
        loading="lazy"
        decoding="async"
        style={p.image.position ? { objectPosition: p.image.position } : undefined}
        className="block flex-none w-full min-[480px]:w-[140px] md:w-[160px] lg:w-[180px] h-auto aspect-square object-cover rounded-xl bg-dll-soft"
      />
      <div className="flex flex-col flex-1 min-w-0">
        <span className="self-start inline-block px-[.75em] py-[.2em] rounded-full bg-dll-sky text-dll-ink text-[.8rem] font-bold">
          {p.status}
        </span>
        <h3 className="text-[1.35rem] mt-3 mb-2">{p.name}</h3>
        <p className="mt-0 mb-4">{p.oneLine}</p>
        <p className="text-dll-muted text-[.95rem] mt-0 mb-4">
          <b className="text-dll-ink">Who it helps:</b> {p.whoItHelps}
        </p>
        <p className="text-dll-muted text-[.9rem] mt-0 mb-2">{p.credit}</p>
        <p className="flex flex-wrap items-center gap-2 text-dll-muted text-[.9rem] mt-0 mb-5">
          Made with
          {/* White chip in both themes (like the Partners page logo tiles) so the green logo stays visible in dark mode */}
          <span className="inline-flex items-center px-2 py-1 rounded-md bg-dll-logo-tile border border-dll-line">
            <img
              src={cvadLogo.src}
              alt={cvadLogo.alt}
              width={cvadLogo.w}
              height={cvadLogo.h}
              loading="lazy"
              decoding="async"
              className="block h-7 w-auto"
            />
          </span>
        </p>
        <div className="mt-auto">
          <ButtonLink href={p.href} size="sm">
            See the project<ForumNote /><span className="sr-only">: {p.name}</span>
          </ButtonLink>
        </div>
      </div>
    </article>
  )
}

export default function ProjectsPage() {
  useDocumentTitle('Projects')
  return (
    <>
      <PageHero
        title="Projects"
        intro="Projects here stay in use and keep improving. Each one is backed by a forum thread where the community keeps building on it."
      />

      <Band>
        <h2 id="wk-h" className="sr-only">
          Projects
        </h2>

        {/* One card per row; capped width so the text lines stay a comfortable length next to the image */}
        <ul className="grid gap-6 list-none p-0 m-0 max-w-[880px]">
          {projects.map((p) => (
            <li key={p.name}>
              <ProjectCard p={p} />
            </li>
          ))}
        </ul>

        <p className="mt-8 mb-0 max-w-[720px] text-[.95rem] bg-dll-card border-l-[6px] border-dll-yellow rounded-r-2xl px-[22px] py-5">
          These are community made prototypes, not medical devices. Build them carefully and test them slowly before
          everyday use.
        </p>

        <p className="mt-6 mb-0 text-[1.05rem] font-bold">
          <a href={forum.shareSolution}>
            Have a solution to share?
            <ForumNote />
          </a>
        </p>
      </Band>
    </>
  )
}
