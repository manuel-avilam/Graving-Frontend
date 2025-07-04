<template>
  <div class="graves-container">
    <div class="graves-box">
      <h2>Filtros</h2>
      <div class="search-group">
        <!-- Número de Tumba -->
        <div class="input-group">
          <input 
            type="number" 
            v-model="searchGraveNumber" 
            class="data-input" 
            placeholder=" "
          />
          <label class="input-label">Número de Tumba</label>
        </div>

        <!-- Fila -->
        <div class="input-group">
          <input 
            type="text" 
            v-model="filterRow" 
            class="data-input" 
            placeholder=" "
          />
          <label class="input-label">Fila</label>
        </div>

        <!-- Manzana -->
        <div class="input-group">
          <select v-model="filterBlock" class="data-input">
            <option value="">Todas las manzanas</option>
            <option v-for="block in uniqueBlocks" :key="block" :value="block">
              {{ block }}
            </option>
          </select>
          <label class="input-label">Manzana</label>
        </div>
      </div>

      <div class="table-title">
        <h2>Administración de Tumbas</h2>
      </div>

      <div class="graves-table-wrapper">
        <table class="graves-table">
          <thead>
            <tr>
              <th>N° Tumba</th>
              <th>Manzana</th>
              <th>Cuadro</th>
              <th>Fila</th>
              <th>Tipo</th>
              <th>Funciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(grave, index) in filteredGraves" :key="index">
              <td>{{ grave.graveNumber }}</td>
              <td>{{ grave.blockName }}</td>
              <td>{{ grave.section }}</td>
              <td>{{ grave.graveRow }}</td>
              <td>{{ typeLabels[grave.type] }}</td>
              <td class="actions">
                <button class="purple-button" @click="editGrave(grave)">Editar</button>
                <router-link :to="{ name: 'registerRepair', params: { graveId: grave.id } }" id="repair-button" class="purple-button">Reparación</router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <div v-if="editingGrave" class="modal-backdrop">
    <div class="modal">
      <h2>Editar Tumba #{{ editingGrave.graveNumber }}</h2>

      <div class="input-group">
        <input :value="editingGrave.blockName" class="data-input" disabled placeholder=" " />
        <label class="input-label input-label-focused">Manzana</label>
      </div>

      <div class="input-group">
        <input :value="editingGrave.section" class="data-input" disabled placeholder=" " />
        <label class="input-label input-label-focused">Cuadro</label>
      </div>

      <div class="input-group">
        <input :value="editingGrave.graveRow" class="data-input" disabled placeholder=" " />
        <label class="input-label input-label-focused">Fila</label>
      </div>

      <div class="input-group">
        <select v-model="editingGrave.type" class="data-input">
          <option value="niche">Nicho</option>
          <option value="grave">Tumba</option>
          <option value="ossuary">Osario</option>
        </select>
        <label class="input-label input-label-focused">Tipo</label>
      </div>

      <div class="modal-actions">
        <button class="outline-white-button" @click="editingGrave = null">Cancelar</button>
        <button 
          class="purple-button" 
          @click="handleUpdate" 
          :disabled="isSubmitting"
        >
          Guardar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getAllGraves, updateGrave } from '@/services/graveService'
import { useToast } from '@/composables/useToast'
import { useSubmitGuard } from '@/composables/useSubmitGuard'

const { showToast } = useToast()
const { isSubmitting, guardedSubmit } = useSubmitGuard()

const searchGraveNumber = ref('')
const filterRow = ref('')
const filterBlock = ref('')
const graves = ref([])
const editingGrave = ref(null)

onMounted(async () => {
  try {
    graves.value = await getAllGraves()
  } catch (err) {
    showToast('Error al obtener tumbas', 'error')
  }
})

const uniqueBlocks = computed(() => {
  const blocks = new Set(graves.value.map(g => g.blockName))
  return Array.from(blocks).sort()
})

const filteredGraves = computed(() => {
  return graves.value.filter(grave => {
    const matchesNumber = !searchGraveNumber.value || Number(grave.graveNumber) === Number(searchGraveNumber.value)
    const matchesRow = filterRow.value === '' || grave.graveRow.toString().includes(filterRow.value)
    const matchesBlock = filterBlock.value === '' || grave.blockName === filterBlock.value
    return matchesNumber && matchesRow && matchesBlock
  })
})

const handleUpdate = () => {
  guardedSubmit(async () => {
    try {
      const { id, type } = editingGrave.value
      await updateGrave(id, { type })
      showToast('Tumba actualizada correctamente', 'success')
      editingGrave.value = null
      graves.value = await getAllGraves()
    } catch (err) {
      showToast('Error al actualizar tumba', 'error')
    }
  })
}

const editGrave = (grave) => {
  editingGrave.value = { ...grave }
}

const typeLabels = {
  niche: 'Nicho',
  grave: 'Tumba',
  ossuary: 'Osario'
}
</script>



<style scoped>
.graves-container {
  display: flex;
  justify-content: center;
  min-height: 80vh;
  padding: 20px;
  background-color: #f5f5f5;
}

.graves-box {
  margin-top: 20px;
  width: 80%;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.search-group {
  display: flex;
  gap: 15px;
  margin-bottom: 25px;
  align-items: center;
}

.input-group {
  position: relative;
  flex-grow: 1;
}

.input-label {
  position: absolute;
  left: 15px;
  top: 12px;
  color: #999;
  transition: all 0.3s;
  pointer-events: none;
}

.table-title {
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.input-group {
  margin: 20px;
}

.table-title h2 {
  color: #333;
  font-size: 1.5rem;
  margin: 0;
}

.graves-table-wrapper {
  max-height: 600px;
  overflow-y: auto;
  border: 1px solid #ddd;
  border-radius: 6px;
}

.graves-table {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
}

.graves-table th {
  background-color: var(--purple-color);
  color: white;
  padding: 12px;
  text-align: left;
  position: sticky;
  top: 0;
  z-index: 1;
  border: 1px solid #e0e0e0;
}

.graves-table td {
  border: 1px solid #e0e0e0;
  padding: 10px 12px;
}

.pending {
  color: #ff9800;
  font-weight: 500;
}

.completed {
  color: #4caf50;
  font-weight: 500;
}

.graves-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.graves-table tr:hover {
  background-color: #f1f1f1;
}

.actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.action-link {
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
  padding: 2px 4px;
  border-radius: 3px;
  white-space: nowrap;
}

.edit-link {
  color: #4a7cff;
}

#repair-button {
  background-color: rgb(179, 129, 37);
  width: 90px;
}

#repair-button:hover {
  background-color: rgb(214, 155, 45);
}

.action-link:hover {
  text-decoration: underline;
  background-color: rgba(0, 0, 0, 0.05);
}

.action-link:active {
  transform: translateY(1px);
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 30px;
  border-radius: 10px;
  max-width: 400px;
  width: 90%;
}

.modal h2 {
  text-align: center;
}

.modal-field {
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
}

.modal-field label {
  font-weight: bold;
  margin-bottom: 5px;
}

.modal-actions {
  display: flex;
  justify-content: center;
  margin-top: 30px;
  gap: 10px;
}

.modal-actions button {
  width: 40%;
}

@media (max-width: 768px) {
  .search-group {
    flex-direction: column;
    gap: 10px;
  }

  .purple-button, #repair-button {
    width: 100%;
  }

  .graves-table-wrapper {
    max-height: none;
    overflow-x: auto;
  }

  .graves-table {
    min-width: 700px;
  }

  .actions {
    flex-direction: column;
    gap: 8px;
    align-items: center;
  }
}

@media (max-width: 480px) {
  .graves-container {
    padding: 10px;
  }

  .graves-box {
    width: 100%;
    padding: 15px;
  }

  .table-title h2 {
    font-size: 1.3rem;
  }

  .action-link {
    padding: 4px 8px;
  }

  .modal {
    width: 280px;
  }

  .modal-actions button {
    font-size: 0.5rem;
  }
}
</style>
