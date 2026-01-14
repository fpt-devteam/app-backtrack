import { useMutation } from '@tanstack/react-query'
import { useMemo } from 'react'
import { analyzeImageApi } from '../api'
import { POST_ANALYZE_IMAGE_KEY } from '../constants'
import type { AnalyzeImageRequest } from '../types'

interface UseAnalyzeImageOptions {
  onSuccess?: (data: { itemName: string; description: string }) => void
  onError?: (error: Error) => void
}

const useAnalyzeImage = (options?: UseAnalyzeImageOptions) => {
  const mutation = useMutation({
    mutationKey: POST_ANALYZE_IMAGE_KEY,
    mutationFn: async (request: AnalyzeImageRequest) => {
      const response = await analyzeImageApi(request)
      if (!response.success) throw new Error('Failed to analyze image')
      return response.data
    },

    onSuccess: (data) => {
      options?.onSuccess?.(data)
    },

    onError: (error) => {
      const err = error instanceof Error ? error : new Error('Failed to analyze image')
      options?.onError?.(err)
    },
  })

  const error = useMemo(() => {
    if (!mutation.error) return null
    if (mutation.error instanceof Error) return mutation.error
    return new Error('Failed to analyze image')
  }, [mutation.error])

  return {
    analyzeImage: mutation.mutateAsync,
    isAnalyzing: mutation.isPending,
    error,
    data: mutation.data,
  }
}

export default useAnalyzeImage
