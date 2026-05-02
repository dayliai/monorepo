import type { ADLSolution } from '../data/adlData'
import { useModalA11y } from '../lib/useModalA11y'

interface SolutionDetailModalProps {
  solution: ADLSolution
  onClose: () => void
}

export default function SolutionDetailModal({ solution, onClose }: SolutionDetailModalProps) {
  const dialogRef = useModalA11y(onClose)
  const titleId = 'solution-detail-title'

  return (
    <div
      className="fixed inset-0 bg-black/60 z-[300] flex items-center justify-center p-6"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="bg-white rounded-2xl p-10 max-w-[680px] w-full relative max-h-[85vh] overflow-y-auto focus:outline-none"
        style={{ boxShadow: '0 20px 60px rgba(70, 31, 101, 0.3)', animation: 'fadeInUp 0.3s ease' }}
      >
        <button
          onClick={onClose}
          aria-label="Close solution details"
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-dayli-vibrant text-white flex items-center justify-center text-lg hover:bg-dayli-deep transition-colors focus-visible:outline-2 focus-visible:outline-dayli-deep focus-visible:outline-offset-2"
        >
          <span aria-hidden="true">&times;</span>
        </button>

        <h3 id={titleId} className="font-heading text-2xl font-semibold text-dayli-deep mb-2 pr-12">
          {solution.title}
        </h3>

        <div className="flex items-center gap-3 text-sm text-dayli-deep/70 mb-6">
          <span>{solution.personName}</span>
          <span>{solution.timeAgo}</span>
        </div>

        <p className="font-body text-base text-dayli-deep/70 leading-relaxed mb-7">
          {solution.detailedDescription}
        </p>

        <div className="bg-dayli-pale rounded-xl p-6">
          <h4 className="font-heading text-lg font-semibold text-dayli-deep mb-2">
            What made this work
          </h4>
          <p className="font-body text-[15px] text-dayli-deep/70 leading-relaxed">
            {solution.whatMadeItWork}
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
