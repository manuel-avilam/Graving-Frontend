let confirmModalRef = null

export function setConfirmModalRef(ref) {
  confirmModalRef = ref
}

export function useConfirmModal() {
  return {
    showConfirmModal(message) {
      return confirmModalRef?.show(message)
    }
  }
}