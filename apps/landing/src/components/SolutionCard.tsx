import type { ADLSolution } from '../data/adlData'

interface SolutionCardProps {
  solution: ADLSolution
  onClick: () => void
}

export default function SolutionCard({ solution, onClick }: SolutionCardProps) {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-xl p-5 text-left hover:shadow-md transition-all hover:-translate-y-0.5 w-full"
    >
      <h4 className="font-heading text-lg font-semibold text-dayli-deep mb-2">
        {solution.title}
      </h4>
      <p className="font-body text-sm text-dayli-deep/70 mb-3 line-clamp-2">
        {solution.description}
      </p>
      <div className="flex items-center justify-between">
        <span className="font-body text-sm font-medium text-dayli-vibrant">
          {solution.personName}
        </span>
        <span className="font-body text-xs text-dayli-deep/40">
          {solution.timeAgo}
        </span>
      </div>
    </button>
  )
}
