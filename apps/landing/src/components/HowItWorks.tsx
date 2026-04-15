const steps = [
  {
    number: '1',
    title: 'Identify',
    description: 'Where can you make a difference in the lives of people facing ADL challenges?',
    image: '/images/how it works image identify.png',
  },
  {
    number: '2',
    title: 'Invent',
    description: 'What can you imagine, create, and build that will improve someone\u2019s daily life?',
    image: '/images/how it works image invent.png',
  },
  {
    number: '3',
    title: 'Integrate',
    description: 'Submit your solution to the Daily Living Labs community to get it added to Dayli AI.',
    image: '/images/how it works image integrate.png',
  },
]

export default function HowItWorks() {
  return (
    <section id="community" className="py-20 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-heading text-3xl sm:text-4xl font-bold text-dayli-deep text-center mb-4">
          How It Works
        </h2>
        <p className="font-body text-dayli-deep/60 text-center mb-14 max-w-xl mx-auto">
          Three steps towards building a community of solutions.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.number} className="text-center flex flex-col items-center">
              <img
                src={encodeURI(step.image)}
                alt={step.title}
                className="w-full max-w-[280px] h-auto object-contain mb-4"
              />
              <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-dayli-vibrant text-white text-sm font-bold mb-3">
                {step.number}
              </div>
              <h3 className="font-heading text-xl font-semibold text-dayli-deep mb-2">
                {step.title}
              </h3>
              <p className="font-body text-dayli-deep/60 text-sm leading-relaxed max-w-[260px]">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
