<template>
  <teleport to="body">
    <div v-if="visible" class="modal-backdrop">
      <div class="modal-box">
        <p class="modal-message">{{ message }}</p>
        <div class="modal-actions">
          <button @click="confirm(true)" class="purple-button">Confirmar</button>
          <button @click="confirm(false)" class="outline-white-button">Cancelar</button>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { ref, defineExpose } from 'vue'

const visible = ref(false)
const message = ref('')
let resolver = null

function show(msg) {
  message.value = msg
  visible.value = true
  return new Promise(resolve => {
    resolver = resolve
  })
}

function confirm(result) {
  visible.value = false
  resolver?.(result)
}

defineExpose({ show })
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: grid;
  place-items: center;
  z-index: 1001;
}
.modal-box {
  background: white;
  padding: 24px;
  border-radius: 8px;
  width: 300px;
  max-width: 90%;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
}
.modal-message {
  margin-bottom: 20px;
  font-size: 16px;
  text-align: center;
}
.modal-actions {
  display: flex;
  justify-content: space-between;
}
.modal-actions button {
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}
</style>
