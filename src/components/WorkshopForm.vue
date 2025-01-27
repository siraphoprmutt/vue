<template>
  <v-container class="register-form">
    <v-card class="pa-5">
      <v-card-title class="text-center text-h4 font-weight-bold">
        ลงทะเบียน Workshop
      </v-card-title>

      <v-form ref="form" @submit.prevent="submitForm">
        <v-row class="workshop-container my-5">
          <v-col
            v-for="workshop in workshops"
            :key="workshop.id"
            cols="12"
            sm="6"
            md="4"
          >
            <v-card
              class="workshop-card"
              :class="{ selected: selectedWorkshops.includes(workshop.id) }"
              @click="selectWorkshop(workshop.id)"
            >
              <v-img
                :src="workshop.image"
                height="200px"
                class="rounded"
                cover
              ></v-img>
              <v-card-title class="text-center">
                {{ workshop.name }}
              </v-card-title>
              <v-card-subtitle class="text-center mb-3">
                ฿{{ workshop.price.toLocaleString() }}
                <span class="text-decoration-line-through"
                  >฿{{
                    (
                      workshop.price *
                      (workshop.discount / 100)
                    ).toLocaleString()
                  }}</span
                >
              </v-card-subtitle>
              <v-card-subtitle class="text-center mb-3">
                {{ workshop.date }}
              </v-card-subtitle>
              <v-card-subtitle class="text-center mb-3">
                {{ workshop.startTime }} - {{ workshop.endTime }}
              </v-card-subtitle>
            </v-card>
          </v-col>
        </v-row>

        <v-text-field
          v-model="formData.email"
          label="อีเมล"
          required
        ></v-text-field>
        <v-text-field
          v-model="formData.firstname"
          label="ชื่อ"
          required
        ></v-text-field>
        <v-text-field
          v-model="formData.lastname"
          label="นามสกุล"
          required
        ></v-text-field>

        <v-select
          v-model="formData.paymentAccount"
          :items="paymentAccounts"
          item-title="displayName"
          item-value="account"
          label="เลือกบัญชีธนาคาร"
          prepend-icon="mdi-bank"
          required
        ></v-select>

        <v-file-input
          label="อัพโหลดไฟล์ (รูปภาพเท่านั้น)"
          accept="image/*"
          @change="handleFileUpload"
        ></v-file-input>

        <v-img
          v-if="filePreview"
          :src="filePreview"
          max-height="200px"
          class="mt-3"
        ></v-img>

        <v-btn type="submit" color="primary" block class="mt-4"
          >ลงทะเบียน</v-btn
        >
      </v-form>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useToast } from "vue-toastification";

const apiUrl = "https://disappointed-phentermine-managers-fo.trycloudflare.com";
const toast = useToast();

const workshops = ref([
  {
    id: 1,
    name: "Frontend",
    image: "https://placehold.co/600x400",
    price: 5000,
    discount: 10,
    date: "2024-04-01",
    startTime: "09:00",
    endTime: "16:00",
  },
  {
    id: 2,
    name: "Backend",
    image: "https://placehold.co/600x400",
    price: 6000,
    discount: 20,
    date: "2024-04-05",
    startTime: "10:00",
    endTime: "17:00",
  },
  {
    id: 3,
    name: "Fullstack",
    image: "https://placehold.co/600x400",
    price: 7000,
    discount: 30,
    date: "2024-04-10",
    startTime: "08:30",
    endTime: "15:30",
  },
]);

const paymentAccounts = ref([
  { account: "1234567890", displayName: "Krungsri - Siraphop (1234567890)" },
  { account: "0987654321", displayName: "Kankornbank - Siraphop (0987654321)" },
]);

const formData = ref({
  email: "siraphop.rmutt@gmail.com",
  firstname: "siraphop",
  lastname: "nonpala",
  paymentAccount: "1234567890",
  fileBase64: "",
});

const filePreview = ref("");
const selectedWorkshops = ref([]);

const selectWorkshop = (id) => {
  const index = selectedWorkshops.value.indexOf(id);
  if (index === -1) {
    selectedWorkshops.value.push(id);
  } else {
    selectedWorkshops.value.splice(index, 1);
  }
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      formData.value.fileBase64 = reader.result.split(",")[1];
      filePreview.value = reader.result;
    };
    reader.readAsDataURL(file);
  }
};

const submitForm = async () => {
  if (selectedWorkshops.value.length === 0) {
    toast.warning("กรุณาเลือก Workshop อย่างน้อยหนึ่งรายการ");
    return;
  }

  toast.info("กำลังลงทะเบียน...", { timeout: false });

  try {
    const response = await fetch(`${apiUrl}/save-data`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData.value,
        workshops: selectedWorkshops.value,
      }),
    });

    if (response.ok) {
      toast.clear();
      toast.success("ลงทะเบียนสำเร็จ!");
    } else {
      throw new Error("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
  } catch (error) {
    toast.clear();
    toast.error(error.message);
  }
};

const init = async () => {
  try {
    const response = await fetch(`${apiUrl}/`);
    const data = await response.json();
    if (data) {
      console.log("data:", data);
    }
  } catch (error) {
    toast.error("เกิดข้อผิดพลาดในการโหลดข้อมูล");
  }
};

onMounted(() => {
  init();
});
</script>

<style lang="scss" scoped>
$primary-color: #1976d2;

.register-form {
  max-width: 900px;
  margin: auto;

  .workshop-container {
    justify-content: center;
  }

  .workshop-card {
    transition: all 0.3s ease-in-out;
    cursor: pointer;
    border: 2px solid transparent;
    &:hover {
      box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
    }
    &.selected {
      border: 2px solid $primary-color;
      transform: scale(1.05);
      background-color: rgba($primary-color, 0.1);
    }
  }

  .v-card {
    border-radius: 15px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  }

  .v-btn {
    font-size: 18px;
    font-weight: bold;
  }

  .v-select,
  .v-text-field,
  .v-file-input {
    border-radius: 10px;
  }

  @media (max-width: 768px) {
    .workshop-card {
      .v-img {
        height: 150px;
      }
      .v-card-title,
      .v-card-subtitle {
        font-size: 14px;
      }
    }

    .v-btn {
      font-size: 16px;
    }
  }

  @media (max-width: 480px) {
    .workshop-card {
      .v-img {
        height: 120px;
      }
      .v-card-title,
      .v-card-subtitle {
        font-size: 12px;
      }
    }

    .v-text-field,
    .v-select,
    .v-file-input {
      font-size: 14px;
    }
  }
}
</style>
