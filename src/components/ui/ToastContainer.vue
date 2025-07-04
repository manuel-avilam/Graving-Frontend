<template>
  <div class="toast-container">
    <transition-group name="toast" tag="div">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="toast"
        :class="toast.type"
      >
        {{ toast.message }}
      </div>
    </transition-group>
  </div>
</template>

<script setup>
  import { ref, defineExpose } from 'vue'

  const toasts = ref([])

  function addToast(message, type = 'success', duration = 3000) {
    const id = generateUUID()
    toasts.value.push({ id, message, type })

    setTimeout(() => {
      toasts.value = toasts.value.filter(t => t.id !== id)
    }, duration)
  }

  function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

  defineExpose({ addToast })
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 1000;
}

.toast {
  padding: 12px 20px;
  border-radius: 8px;
  color: white;
  font-weight: bold;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  min-width: 220px;
  animation: fadein 0.3s ease;
  margin-bottom: 5px;
}

.success {
  background-color: var(--purple-color);
}
.error {
  background-color: #e53e3e;
}
.info {
  background-color: #3182ce;
}

.toast-enter-from, .toast-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
.toast-enter-to, .toast-leave-from  {
  opacity: 1;
  transform: translateY(0);
}
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

</style>
