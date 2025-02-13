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

const apiUrl = import.meta.env.VITE_API_URL;
console.log("apiUrl:", apiUrl);
const toast = useToast();

const workshops = ref([]);
const paymentAccounts = ref([]);

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
      headers: {
        "Content-Type": "application/json",
        Authorization: import.meta.env.VITE_API_KEY,
      },
      body: JSON.stringify({
        ...formData.value,
        workshops: selectedWorkshops.value,
      }),
    });
    console.log("response:", response);
    if (response.ok) {
      toast.clear();
      toast.success("ลงทะเบียนสำเร็จ!");
    } else {
      const error = await response.json();
      console.log("error:", error);
      throw new Error(error.statusText || "เกิดข้อผิดพลาดในการลงทะเบียน");
    }
  } catch (error) {
    toast.clear();
    toast.error(error.message);
  }
};

const init = async () => {
  toast.info("กำลังโหลดข้อมูล...", { timeout: false });
  try {
    const response = await fetch(`${apiUrl}/workshops`, {
      headers: {
        Authorization: import.meta.env.VITE_API_KEY,
      },
    });
    console.log("response:", response);
    if (!response.ok) {
      throw new Error("เกิดข้อผิดพลาดในการโหลดข้อมูล");
    }
    const data = await response.json();
    console.log("data:", data);
    workshops.value = data.workshops;
    paymentAccounts.value = data.paymentAccounts;
  } catch (error) {
    // toast.error("เกิดข้อผิดพลาดในการโหลดข้อมูล");
  } finally {
    toast.clear();
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
