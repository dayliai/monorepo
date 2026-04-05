const steps = [
  {
    number: '1',
    title: 'Explore Activities',
    description: 'Browse the six Activities of Daily Living and find the area where you need support.',
    icon: '🔍',
  },
  {
    number: '2',
    title: 'Find Solutions',
    description: 'Discover practical solutions that real people have found and shared with the community.',
    icon: '💡',
  },
  {
    number: '3',
    title: 'Share What Works',
    description: 'Found something that helps? Share your solution so others can benefit from your experience.',
    icon: '🤝',
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
          Three simple steps to finding and sharing solutions
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.number} className="text-center">
              <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-dayli-vibrant text-white text-sm font-bold mb-3">
                {step.number}
              </div>
              <h3 className="font-heading text-xl font-semibold text-dayli-deep mb-2">
                {step.title}
              </h3>
              <p className="font-body text-dayli-deep/60 text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
