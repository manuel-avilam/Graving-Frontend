<template>
  <div class="modal-overlay" @click.self="emit('close')">
    <div class="modal-container">
      <button class="close-icon" @click="emit('close')">✕</button>
      <h2 class="modal-title">Selecciona una tumba disponible</h2>

      <div class="cemetery-map-scroll">
        <div class="cemetery-blocks">
          <div class="block" v-for="block in 4" :key="'block-'+block">
            <div class="block-title">Manzana {{ block }}</div>

            <div class="row" v-for="row in getRowsForBlock(block)" :key="`row-${block}-${row}`">
              <div class="row-label"><span>{{ row }}</span></div>

              <div class="row-graves">
                <div class="grave-container" v-for="col in 5" :key="`grave-${block}-${row}-${col}`">
                  <button
                    class="grave"
                    :class="{
                      occupied: getGrave(block, row, col)?.status === 'occupied',
                      maintenance: getGrave(block, row, col)?.underMaintenance === 1
                    }"
                    :disabled="
                      getGrave(block, row, col)?.status === 'occupied' ||
                      getGrave(block, row, col)?.underMaintenance === 1
                    "
                    @click="selectGrave(getGrave(block, row, col))"
                  >
                    {{ getGrave(block, row, col)?.graveNumber || '-' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button class="purple-button" @click="emit('close')">Cerrar</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, defineEmits } from 'vue'
import { getAllGraves } from '@/services/graveService'

const emit = defineEmits(['close', 'selected'])

const graves = ref([])
const graveMap = ref({})

const getGrave = (block, row, col) => {
  return graveMap.value[block]?.[row]?.[col] || null
}

const getRowsForBlock = (block) => block <= 2 ? [1, 2, 3, 4, 5] : [6, 7, 8, 9, 10]

const indexGraves = (list) => {
  const map = {}
  for (const grave of list) {
    const { blockId, graveRow, section } = grave
    if (!map[blockId]) map[blockId] = {}
    if (!map[blockId][graveRow]) map[blockId][graveRow] = {}
    map[blockId][graveRow][section] = grave
  }
  graveMap.value = map
}

const selectGrave = (grave) => {
  emit('selected', grave)
}

onMounted(async () => {
  const data = await getAllGraves()
  graves.value = data
  indexGraves(data)
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-container {
  background: white;
  width: 95%;
  max-width: 1100px;
  max-height: 90vh;
  overflow-y: auto;
  border-radius: 10px;
  padding: 30px 20px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
  position: relative;
}

.modal-title {
  text-align: center;
  margin-bottom: 20px;
  color: var(--purple-color);
}

.close-icon {
  position: absolute;
  top: 15px;
  right: 20px;
  background: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #666;
}

.purple-button {
  margin-top: 20px;
  display: block;
  margin-left: auto;
  margin-right: auto;
  padding: 10px 20px;
  border: none;
  color: white;
  border-radius: 5px;
  cursor: pointer;
}

.cemetery-map-scroll {
  overflow: auto;
  padding: 10px;
  max-height: 70vh;
}

.cemetery-blocks {
  display: grid;
  grid-template-columns: repeat(2, minmax(300px, 1fr));
  gap: 20px;
}

.block {
  background: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 15px;
}

.block-title {
  text-align: center;
  font-weight: bold;
  color: var(--purple-color);
  margin-bottom: 10px;
}

.row {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.row-label {
  width: 2%;
  text-align: center;
  font-weight: bold;
  font-size: 14px;
  color: #432c48;
}

.row-graves {
  width: 96%;
  display: flex;
  justify-content: space-around;
}

.grave-container {
  position: relative;
}

.grave {
  width: 60px;
  height: 40px;
  border: 1px solid #b0bec5;
  border-radius: 6px;
  background-color: #432c48;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: 0.2s;
}

.grave.occupied {
  background-color: #ccc;
  color: #666;
  cursor: not-allowed;
}

.grave.maintenance {
  background-color: #e7b41c;
  color: #222121;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .grave {
    width: 45px;
    height: 35px;
    font-size: 12px;
  }

  .block {
    min-width: 320px;
  }

  .cemetery-blocks {
    grid-template-columns: repeat(2, minmax(320px, 1fr));
  }
}
</style>
