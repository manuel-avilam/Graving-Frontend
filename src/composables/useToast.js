let toastRef = null

export function setToastRef(ref) {
  toastRef = ref
}

export function useToast() {
  return {
    showToast(message, type = 'success', duration = 3000) {
      toastRef?.addToast(message, type, duration)
    }
  }
}