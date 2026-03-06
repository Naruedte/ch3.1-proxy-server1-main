<template>
  <q-page padding class="bg-grey-1">
    <div class="container q-mx-auto" style="max-width: 800px">
      <div class="row items-center q-mb-xl">
        <div class="col">
          <div class="text-h3 text-weight-bold text-primary">My Tasks in 2026</div>
          <div class="text-subtitle1 text-grey-7">Fullstack Lab: Express + Prisma + Supabase with CI/CD</div>
        </div>
        <div class="col-auto">
          <q-btn round color="primary" icon="refresh" :loading="loading" @click="fetchTasks">
            <q-tooltip>Reload Tasks</q-tooltip>
          </q-btn>
        </div>
      </div>

      <div v-if="errorMessage" class="q-mb-md">
        <q-banner dense rounded class="bg-red-1 text-negative">
          <template v-slot:avatar>
            <q-icon name="error" color="negative" />
          </template>
          {{ errorMessage }}
        </q-banner>
      </div>

      <div class="row q-col-gutter-md">
        <div v-if="loading" class="col-12 flex justify-center q-pa-xl">
          <q-spinner-dots color="primary" size="3em" />
        </div>

        <template v-else>
          <div v-if="tasks.length === 0" class="col-12 text-center q-pa-xl">
            <q-icon name="task_alt" size="4em" color="grey-4" />
            <div class="text-h6 text-grey-5 q-mt-md">No tasks found</div>
            <div class="text-caption text-grey-5">Try creating one using the seed script or API</div>
          </div>

          <div v-for="task in tasks" :key="task.id" class="col-12">
            <q-card flat bordered class="task-card overflow-hidden">
              <q-card-section>
                <div class="row no-wrap items-center">
                  <div class="col">
                    <div class="text-h6 text-weight-medium">{{ task.title }}</div>
                    <div class="text-body2 text-grey-8 q-mt-xs">{{ task.description || 'No description' }}</div>
                  </div>
                </div>
              </q-card-section>

              <q-separator />

              <q-card-section class="bg-grey-2 q-py-xs row items-center no-wrap">
                <q-icon name="schedule" size="xs" color="grey-7" class="q-mr-xs" />
                <div class="text-caption text-grey-7">
                  {{ formatDate(task.createdAt) }}
                </div>
                <q-space />
                <q-chip outline dense size="sm" color="blue-7" text-color="blue-7">
                  {{ task.id.split('-')[0] }}
                </q-chip>
              </q-card-section>
            </q-card>
          </div>
        </template>
      </div>
    </div>
  </q-page>
</template>

<style scoped>
.task-card {
  transition: all 0.3s ease;
  border-radius: 12px;
}

.task-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
  border-color: var(--q-primary);
}
</style>

<script setup>
import { ref, onMounted } from 'vue';
import { api } from 'boot/axios';

const tasks = ref([]);
const loading = ref(false);
const errorMessage = ref('');
const loadingErrorUrl = ref('');

const fetchTasks = async () => {
  loading.value = true;
  errorMessage.value = '';

  try {
    const res = await api.get('/tasks');
    tasks.value = res.data.data; // backend ส่ง { data: [...] }
  } catch (err) {
    console.error('API Error:', err);
    const status = err.response ? err.response.status : 'Network Error';
    errorMessage.value = `โหลดงานไม่สำเร็จ (${status})`;
    loadingErrorUrl.value = api.defaults.baseURL + '/tasks';
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

onMounted(fetchTasks);
</script>
