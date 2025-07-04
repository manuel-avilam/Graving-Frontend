<template>
  <div class="home-view-map">
    <div class="home-view-map-container">
      <h1 class="center">Cementerio Perlas La Paz</h1>
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
                      maintenance: getGrave(block, row, col)?.underMaintenance === 1,
                      selected: selectedGrave === getGrave(block, row, col)?.id,
                      highlighted: highlightedGraves.some(g => g.id === getGrave(block, row, col)?.id)
                    }"
                    @click="toggleGraveModal(getGrave(block, row, col))"
                  >
                    {{ getGrave(block, row, col)?.graveNumber || '-' }}
                  </button>

                  <div
                    class="grave-modal"
                    :class="{ 'top-modal': block <= 2, 'bottom-modal': block > 2 }"
                    v-if="showModal && currentGrave?.id === getGrave(block, row, col)?.id"
                    @click.stop
                  >
                    <div class="modal-content">
                      <h3>Tumba #{{ currentGrave?.graveNumber }}</h3>
                      <p><strong>Manzana:</strong> {{ currentGrave?.blockId }}</p>
                      <p><strong>Cuadro:</strong> {{ currentGrave?.section }}</p>
                      <p><strong>Fila:</strong> {{ currentGrave?.graveRow }}</p>
                      <p><strong>Tipo:</strong> {{ translateType(currentGrave?.type) }}</p>

                      <div class="modal-actions">
                        <template v-if="currentGrave?.status === 'occupied'">
                          <router-link 
                            :to="{ name: 'deceased', params: { id: getDeceasedByGraveId(currentGrave?.id)?.id } }" 
                            class="purple-button"
                          >Ver Difunto</router-link>

                          <router-link 
                            v-if="isLoggedIn && getDeceasedByGraveId(currentGrave?.id)" 
                            :to="{ name: 'visit', params: { id: getDeceasedByGraveId(currentGrave?.id)?.id } }"
                            class="green-button"
                          >Agendar Visita</router-link>
                        </template>

                        <template v-else>
                          <router-link 
                            v-if="isAdmin && !currentGrave?.underMaintenance" 
                            :to="{ name: 'registerDeceased', params: { graveId: currentGrave?.id } }" 
                            class="purple-button"
                          >Registrar Difunto</router-link>
                        </template>

                        <router-link 
                            v-if="isAdmin" 
                            :to="{ name: 'registerRepair', params: { graveId: currentGrave?.id } }" 
                            id="repair-button" 
                            class="purple-button"
                          >Reparación</router-link>

                        <button class="outline-white-button" @click="closeModal">Cerrar</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, defineExpose } from 'vue'
import { getAllGraves } from '@/services/graveService'
import { getAllDeceased } from '@/services/deceasedService'
import { useAuthStore } from '@/stores/authStore'
import { useToast } from '@/composables/useToast'

const { showToast } = useToast()
const authStore = useAuthStore()
const isLoggedIn = computed(() => authStore.isLoggedIn)
const isAdmin = computed(() => authStore.isAdmin)

const allDeceased = ref([])
const graves = ref([])
const graveMap = ref({})
const selectedGrave = ref(null)
const currentGrave = ref(null)
const showModal = ref(false)
const highlightedGraves = ref([])

const getGrave = (block, row, col) => {
  return graveMap.value[block]?.[row]?.[col] || null
}

const indexGraves = (list) => {
  graves.value = list
  const map = {}
  for (const grave of list) {
    const { blockId, graveRow, section } = grave
    if (!map[blockId]) map[blockId] = {}
    if (!map[blockId][graveRow]) map[blockId][graveRow] = {}
    map[blockId][graveRow][section] = grave
  }
  graveMap.value = map
}

onMounted(async () => {
  try {
    const data = await getAllGraves()
    allDeceased.value = await getAllDeceased()
    indexGraves(data)
  } catch (err) {
    showToast('Error al obtener tumbas', 'error')
  }
})

const getDeceasedByGraveId = (graveId) => {
  return allDeceased.value.find(d => d.graveId === graveId)
}

const getRowsForBlock = (block) => block <= 2 ? [1, 2, 3, 4, 5] : [6, 7, 8, 9, 10]

const toggleGraveModal = (grave) => {
  if (!grave) return
  selectedGrave.value = grave.id
  currentGrave.value = grave
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  currentGrave.value = null
}

const translateType = (type) => {
  switch (type) {
    case 'niche': return 'Nicho'
    case 'grave': return 'Tumba'
    case 'ossuary': return 'Osario'
    default: return 'Desconocido'
  }
}

const searchGraves = (filters) => {
  const emptyFilters =
    !filters.name?.trim() &&
    !filters.block &&
    !filters.graveRow &&
    !filters.graveNumber

  if (emptyFilters) {
    highlightedGraves.value = []
    return
  }
  
  highlightedGraves.value = graves.value.filter(grave => {
    const deceased = getDeceasedByGraveId(grave.id)
    return (
      (!filters.name || deceased?.name?.toLowerCase().includes(filters.name.toLowerCase())) &&
      (!filters.block || grave.blockId === Number(filters.block)) &&
      (!filters.graveRow || grave.graveRow === Number(filters.graveRow)) &&
      (!filters.graveNumber || grave.graveNumber === Number(filters.graveNumber))
    )
  })

  let results = highlightedGraves.value.length
  
  if (results=== 0) {
    showToast('No se encontraron coincidencias', 'info')
  } else {
    showToast(`Se encontraron ${results} coincidencias`, 'success')
  }
}

defineExpose({ searchGraves })
</script>


<style scoped>
.center {
  text-align: center;
}

.home-view-map {
  position: relative;
  display: flex;
  justify-content: center; 
  align-items: center;     
  width: 100%;
 
  padding: 20px;
  box-sizing: border-box;
}
.home-view-map-container {
  width: 100%;
  margin-bottom: 40px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.cemetery-map-scroll {
  flex: 1; 
  overflow: auto;
  padding: 15px;
  box-sizing: border-box;
}

.cemetery-blocks {
  display: grid;
  grid-template-columns: repeat(2, minmax(300px, 1fr));
  grid-template-rows: repeat(2, auto);
  gap: 20px;
  min-width: 800px;
  min-height: 600px;
}


.block {
  display: flex;
  flex-direction: column;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 15px;
  background-color: #f9f9f9;
  min-width: 300px;
}

.block-title {
  font-weight: bold;
  margin-bottom: 15px;
  text-align: center;
  color: var(--purple-color);
  font-size: 1.1rem;
}


.row {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.row-label {
  width: 2%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: #432c48;
  font-size: 14px;
}

.row-graves {
  width: 96%;
  display: flex;
  justify-content: space-around;
}

.grave-container {
  position: relative;
  display: inline-block;
}

.grave {
  width: 60px;
  height: 40px;
  border: 1px solid #b0bec5;
  border-radius: 6px;
  background-color: #432c48;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  font-weight: bold;
  color: #ffffff;
  transition: all 0.2s ease;
  position: relative;
  z-index: 1;
}

.grave.occupied {
  background-color: #ccc;
  color: #535252;
}

.grave.maintenance {
  background-color: #e7b41c;
  color: #222121;
}

.grave.selected {
  border: 2px solid #7E57C2;
  box-shadow: 0 0 12px rgba(126, 87, 194, 0.6);
}


.grave-modal {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  width: 150px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  padding: 15px;
  animation: fadeIn 0.2s ease-out;
}


.grave-modal.top-modal {
  top: 100%;
  margin-top: 10px;
}

.grave-modal.bottom-modal {
  bottom: 100%;
  margin-bottom: 10px;
}

.modal-content {
  text-align: center;
}

.modal-content h3 {
  margin-top: 0;
  color: #7E57C2;
  font-size: 1rem;
}

.modal-content p {
  margin: 10px 0;
  color: #555;
}

.modal-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 15px;
}

.modal-btn {
  padding: 8px 12px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.grave.highlighted {
  outline: 3px solid #ee0e0e;
}

#repair-button {
  background-color: rgb(179, 129, 37);
}

#repair-button:hover {
  background-color: rgb(214, 155, 45);
}
.purple-button,
.green-button,
.outline-white-button{
    font-size: 12px;
}
.outline-white-button{
    height:40px;

}

@keyframes fadeIn {
  from { opacity: 0; transform: translateX(-50%) translateY(10px); }
  to { opacity: 1; transform: translateX(-50%) translateY(0); }
}


@media (max-width: 768px) {
  .home-view-map {
    height: 80vh;
    padding: 10px;
  }
  
  .cemetery-blocks {
    gap: 15px;
  }
  
  .block {
    min-width: 250px;
    padding: 10px;
  }
  
  .grave {
    width: 50px;
    height: 35px;
  }
  
  .grave-modal {
    width: 100px;
  }
  .purple-button,
  .green-button,
  .outline-white-button{
      font-size: 10px;
  }
}

@media (max-width: 600px) {
     .purple-button,
.green-button,
.outline-white-button{
    font-size: 10px;
  
}
  .block {
    min-width: 200px;
    height: 240px;
  }
  
  .grave {
    width: 40px;
    height: 30px;
    font-size: 9px;
  }
  
  .grave-modal {
    width: 100px;
    padding: 10px;
  }
  
  .modal-btn {
    padding: 6px 10px;
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .cemetery-map-scroll {
    padding: 10px;
  }
  
  .block {
    min-width: 180px;
  }
  
  .grave {
    width: 35px;
    height: 25px;
    font-size: 8px;
  }
}
</style>