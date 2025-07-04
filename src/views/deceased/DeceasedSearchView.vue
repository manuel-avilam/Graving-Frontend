<template>
  <div class="deceased-container">
    <h2>Buscador de Difuntos</h2>

    <div class="search-section">
      <div class="search-group">
        <div class="input-group">
          <input
            type="text"
            v-model="searchQuery"
            class="data-input"
            placeholder=" "
          />
          <label class="input-label">Nombre del difunto</label>
        </div>

        <div class="input-group">
          <input
            type="number"
            v-model="filterDeathYear"
            class="data-input"
            placeholder=" "
          />
          <label class="input-label">Año de defunción</label>
        </div>
      </div>

      <div v-if="isAdmin" class="toggle-group">
        <label class="toggle-label">
          <input type="checkbox" v-model="showInactive" />
          Ver difuntos eliminados
        </label>
      </div>
    </div>

    <div class="results-container" v-if="showResults">
      <button 
        class="purple-button arrow-button desktop-only" 
        @click="prevCard" 
        :class="{ 'disabled-arrow': !canScrollLeft }"
        aria-label="Resultados anteriores"
      >
        &lt;
      </button>

      <div class="cards-wrapper">
        <div class="cards-track" :class="{ 'vertical-mode': !isDesktop }">
          <DeceasedCard
            v-for="(deceased) in visibleDeceased"
            :key="deceased.id"
            :deceased="formatDeceasedData(deceased)"
            :is-inactive="showInactive"
            class="fixed-size-card"
            @deleted="handleDeleted"
          />
        </div>
      </div>

      <button 
        class="purple-button arrow-button desktop-only" 
        @click="nextCard" 
        :class="{ 'disabled-arrow': !canScrollRight }"
        aria-label="Siguientes resultados"
      >
        &gt;
      </button>
    </div>

    <div class="no-results" v-if="searchQuery && !showResults">
      <p>No se encontraron resultados para "{{ searchQuery }}"</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onBeforeUnmount } from 'vue'
import { getAllDeceased, getInactiveDeceased } from '@/services/deceasedService'
import DeceasedCard from '@/components/deceased/DeceasedCard.vue'
import { useToast } from '@/composables/useToast'
import { useAuthStore } from '@/stores/authStore'

const auth = useAuthStore()
const isAdmin = computed(() => auth.isAdmin)
const showInactive = ref(false)

const { showToast } = useToast()
const searchQuery = ref('')
const filterDeathYear = ref('')
const currentIndex = ref(0)
const allDeceased = ref([])
const isDesktop = ref(window.innerWidth > 768)

const handleResize = () => {
  isDesktop.value = window.innerWidth > 768
  if (!isDesktop.value) currentIndex.value = 0
}

const loadDeceased = async () => {
  try {
    const response = showInactive.value
      ? await getInactiveDeceased()
      : await getAllDeceased()

    allDeceased.value = response
  } catch (err) {
    showToast('Error al obtener difuntos', 'error')
  }
}

onMounted(() => {
  loadDeceased()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})

const filteredDeceased = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  return allDeceased.value.filter(d => {
    const matchesName = d.name.toLowerCase().includes(query)
    const matchesYear =
      !filterDeathYear.value ||
      new Date(d.deathDate).getFullYear().toString() === filterDeathYear.value.toString()

    return matchesName && matchesYear
  })
})

const visibleDeceased = computed(() => {
  if (!isDesktop.value) return filteredDeceased.value
  return filteredDeceased.value.slice(currentIndex.value, currentIndex.value + 3)
})

const formatDeceasedData = (deceased) => ({
  id: deceased.id,
  name: deceased.name,
  imageUrl: deceased.imageUrl,
  graveNumber: deceased.graveNumber,
  deathDate: new Date(deceased.deathDate).toLocaleDateString('es-MX', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
})

const showResults = computed(() => filteredDeceased.value.length > 0)

const canScrollLeft = computed(() => currentIndex.value > 0)
const canScrollRight = computed(() => currentIndex.value + 3 < filteredDeceased.value.length)

const nextCard = () => {
  if (canScrollRight.value) currentIndex.value++
}

const prevCard = () => {
  if (canScrollLeft.value) currentIndex.value--
}

watch(searchQuery, () => {
  currentIndex.value = 0
})

watch(showInactive, () => {
  loadDeceased()
  currentIndex.value = 0
})

const handleDeleted = (id) => {
  allDeceased.value = allDeceased.value.filter(d => d.id !== id)
  currentIndex.value = 0
}
</script>


<style scoped>
.deceased-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  background-color: #f5f5f5;
  min-height: 70vh;
}

h2 {
  color: #333;
  text-align: center;
  margin-bottom: 20px;
  font-size: 1.8rem;
}

.search-section {
  margin-bottom: 30px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.input-group {
  margin: 20px;
}

.search-group {
  display: flex;
  gap: 15px;
  align-items: center;
}

.input-group {
  flex-grow: 1;
  position: relative;
}

.results-container {
  position: relative;
  display: flex;
  align-items: center;
  gap: 20px;
  margin-top: 30px;
  justify-content: center;
  min-height: 300px; 
}
.cards-wrapper {
  overflow: hidden;
  width: calc(100% - 100px); 
  flex: 1;
}


.cards-track {
  display: flex;
  gap: 20px;
  width: 100%;
  justify-content: center;
  align-items: stretch;
  min-height: 250px; 
}

.fixed-size-card {
  width: calc((100% - 40px) / 3);
  min-width: 0;
  flex-shrink: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  overflow: hidden;
  height: 100%; 
}

.arrow-button {
  font-size: 1.4rem;
  padding: 0.5rem 1.2rem;
  border-radius: 50px;
  z-index: 1;
  cursor: pointer;
  border: none;
  background-color: var(--purple-color);
  color: white;
  transition: all 0.2s ease, opacity 0.2s ease;
  opacity: 1;
  pointer-events: auto;
}


.arrow-button.disabled-arrow {
  opacity: 0;
  pointer-events: none;
}

.toggle-group {
  margin-top: 15px;
  display: flex;
  justify-content: center;
}

.toggle-label {
  font-size: 0.95rem;
  color: #555;
  display: flex;
  gap: 8px;
  align-items: center;
}

/* Modo Desktop (>768px) */
@media (min-width: 769px) {
  .cards-wrapper {
    width: calc(100% - 100px);
  }

  .cards-track {
    flex-direction: row;
  }

  .fixed-size-card {
    width: calc((100% - 40px) / 3); 
    min-width: 0;
    flex-shrink: 0;
  }

  .desktop-only {
    display: block;
  }
}

@media (max-width: 768px) {
  .results-container {
    flex-direction: column;
    gap: 15px;
  }

  .cards-track.vertical-mode {
    flex-direction: column;
    width: 100%;
    align-items: center;
  }

  .fixed-size-card {
    width: 100%;
    max-width: 400px;
    min-width: 0;
  }

  .desktop-only {
    display: none;
  }
}

.fixed-size-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  overflow: hidden;
}

.arrow-button {
  font-size: 1.4rem;
  padding: 0.5rem 1.2rem;
  border-radius: 50px;
  z-index: 1;
  cursor: pointer;
  border: none;
  background-color: var(--purple-color);
  color: white;
  transition: all 0.2s;
}

.arrow-button:hover {
  background-color: #974392;
}

.arrow-button:active {
  transform: scale(0.95);
}

.arrow-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.no-results {
  text-align: center;
  padding: 30px;
  color: #666;
  font-size: 1.1rem;
}

@media (max-width: 480px) {
  .search-group {
    flex-direction: column;
  }

  h2 {
    font-size: 1.5rem;
  }

  .fixed-size-card {
    margin-bottom: 15px;
  }
}
</style>
