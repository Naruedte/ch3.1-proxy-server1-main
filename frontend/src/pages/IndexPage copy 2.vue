<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const tasks = ref([])
const loading = ref(false)
const errorMessage = ref('')

const fetchTasks = async () => {
  loading.value = true
  errorMessage.value = ''
  try {
    const res = await axios.get(
      import.meta.env.VITE_API_URL + '/api/tasks'
    )
    tasks.value = res.data.data
  } catch (err) {
    console.error('API error:', err)
    errorMessage.value = 'โหลดงานไม่สำเร็จ'
  } finally {
    loading.value = false
  }
}

onMounted(fetchTasks)
</script>

<template>
  <q-page padding>
    <div class="text-h5 q-mb-md">
      Task List (เชื่อม Supabase ผ่าน Backend)
    </div>

    <q-btn
      color="primary"
      label="Refresh"
      @click="fetchTasks"
      class="q-mb-md"
      :loading="loading"
    />

    <div v-if="errorMessage" class="text-negative q-mb-md">
      {{ errorMessage }}
    </div>

    <q-list bordered separator>
      <q-item v-for="task in tasks" :key="task.id">
        <q-item-section>
          <q-item-label>{{ task.title }}</q-item-label>
          <q-item-label caption>{{ task.description }}</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-item-label caption>{{ new Date(task.createdAt).toLocaleString() }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>
