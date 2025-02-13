<template>
  <v-container>
    <v-card class="pa-5">
      <v-card-title class="text-center text-h4 font-weight-bold">
        หน้าหลัก
      </v-card-title>
      <v-row>
        <v-col
          v-for="workshop in workshops"
          :key="workshop.id"
          cols="12"
          sm="6"
          md="4"
        >
          <v-card class="workshop-card">
            <v-img
              :src="workshop.image"
              height="200px"
              class="rounded"
              cover
            ></v-img>
            <v-card-title class="text-center">
              {{ workshop.name }}
            </v-card-title>
            <v-card-subtitle class="text-center">
              ฿{{ workshop.price.toLocaleString() }}
            </v-card-subtitle>
            <v-card-actions class="text-center">
              <v-btn @click="goToRegisterPage(workshop)" color="primary"
                >ลงทะเบียน</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();

const workshops = ref([]);
const apiUrl = import.meta.env.VITE_API_URL;

const goToRegisterPage = (workshop) => {
  return router.push(`/workshops/${workshop.id}/register`);
};

const fetchWorkshops = async () => {
  try {
    const response = await fetch(`${apiUrl}/api/workshops`, {
      headers: {
        Authorization: import.meta.env.VITE_API_KEY,
      },
    });
    const data = await response.json();
    workshops.value = data.workshops;
  } catch (error) {
    console.error("Error fetching workshops:", error);
  }
};

onMounted(() => {
  fetchWorkshops();
});
</script>

<style scoped>
.workshop-card {
  transition: all 0.3s ease-in-out;
  &:hover {
    box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
    transform: scale(1.02);
  }
}
</style>
