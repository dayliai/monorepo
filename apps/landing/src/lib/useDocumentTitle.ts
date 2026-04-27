import { useEffect } from 'react'

const SUFFIX = ' — Daily Living Labs'

export function useDocumentTitle(title: string) {
  useEffect(() => {
    const previous = document.title
    document.title = `${title}${SUFFIX}`
    return () => {
      document.title = previous
    }
  }, [title])
}
