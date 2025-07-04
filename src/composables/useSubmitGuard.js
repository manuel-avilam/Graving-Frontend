import { ref } from 'vue'

export function useSubmitGuard() {
  const isSubmitting = ref(false)

  const guardedSubmit = async (submitFn) => {
    if (isSubmitting.value) return
    isSubmitting.value = true
    try {
      await submitFn()
    } finally {
      isSubmitting.value = false
    }
  }

  return {
    isSubmitting,
    guardedSubmit
  }
}