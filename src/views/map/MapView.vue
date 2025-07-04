<template>
  <div class="map-container-top">
 
    <div class="search-section">
      <div class="search-header">
        <h2>Buscar Tumba</h2>
      </div>
      
      <div class="search-filters">
    

        <div class="input-row">
          <div class="input-group">
            <input 
              type="text" 
              v-model="searchFilters.name" 
              class="data-input" 
              placeholder=" "
              required
            />
            <label class="input-label">Nombre del Difunto</label>
          </div>

           <div class="input-group">
            <input 
              type="text" 
              v-model="searchFilters.block" 
              class="data-input" 
              placeholder=" "
              required
            />
            <label class="input-label">Manzana</label>
          </div>
           <div class="input-group">
            <input 
              type="text" 
              v-model="searchFilters.graveRow" 
              class="data-input" 
              placeholder=" "
              required
            />
            <label class="input-label">Fila</label>
          </div>
          
          

           <div class="input-group">
            <input 
              type="text" 
              v-model="searchFilters.graveNumber" 
              class="data-input" 
              placeholder=" "
              required
            />
            <label class="input-label">Tumba</label>
          </div>
        </div>   
               
        <button class="purple-button" @click="handleSearch">Buscar</button>
      </div>
    </div>        
    </div>
    <GraveMap ref="graveMap"/>
</template>

<script setup>
import { ref } from 'vue'
import GraveMap from '@/components/map/GraveMap.vue'

const graveMap = ref(null)

const searchFilters = ref({
  name: '',
  block: '',
  graveRow: '',
  graveNumber: ''
})

const handleSearch = () => {
  if (graveMap.value) {
    graveMap.value.searchGraves(searchFilters.value)
  }
}
</script>

<style scoped>
.map-container-top {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 10px;
  padding: 20px;
  box-sizing: border-box;
}

.search-section {
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.search-header {
  text-align: center;
}

.search-header h2 {
  color: #333;
  font-size: 1.5rem;
  margin: 0;
}

.search-filters {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.input-row {
  display: flex;
  gap: 15px;
  
}

.input-group {
  flex: 1;
  max-width: 30%;
  display: flex;
  margin-right: 100px;
  flex-direction: column;
}


.purple-button {
  align-self: center;
  padding: 10px 25px;
 font-size: 15px;
  color: white;
  margin-bottom: 30px;

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
  max-width: 1600px;
  height: 100%;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}


.map-section {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.purple-button{
    width: 200px;
}

/* Estilos responsivos */
@media (max-width: 768px) {
  .input-row {
    flex-direction: column;
  }
  
  .search-button {
    width: 100%;
  }
  .input-group{
    max-width: 90%;
  }
 
}
</style>