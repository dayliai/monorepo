import type { ADLSolution } from '../data/adlData'

interface SolutionDetailModalProps {
  solution: ADLSolution
  onClose: () => void
}

export default function SolutionDetailModal({ solution, onClose }: SolutionDetailModalProps) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="relative bg-white rounded-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-dayli-pale text-dayli-deep hover:bg-dayli-light transition-colors"
        >
          &times;
        </button>

        <h3 className="font-heading text-2xl font-bold text-dayli-deep mb-2 pr-10">
          {solution.title}
        </h3>

        <div className="flex items-center gap-3 mb-4">
          <span className="font-body text-sm font-medium text-dayli-vibrant">
            {solution.personName}
          </span>
          <span className="font-body text-xs text-dayli-deep/40">
            {solution.timeAgo}
          </span>
        </div>

        <p className="font-body text-dayli-deep/80 leading-relaxed mb-6">
          {solution.detailedDescription}
        </p>

        <div className="bg-dayli-pale rounded-xl p-4">
          <h4 className="font-heading text-sm font-semibold text-dayli-deep mb-2">
            What made this work
          </h4>
          <p className="font-body text-sm text-dayli-deep/70 leading-relaxed">
            {solution.whatMadeItWork}
          </p>
        </div>
      </div>
    </div>
  )
}
