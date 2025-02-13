<template>
  <v-container class="py-5">
    <v-card class="pa-5 mx-auto" max-width="800">
      <v-card-title class="text-center text-h4 font-weight-bold pb-4">
        ลงทะเบียน Workshop
      </v-card-title>

      <v-form ref="form" @submit.prevent="handleFormSubmit">
        <!-- Personal Information -->
        <v-card outlined class="mb-4">
          <v-card-title>ข้อมูลส่วนตัว</v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.firstname"
                  label="ชื่อ"
                  placeholder="กรอกชื่อ"
                  required
                  outlined
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.lastname"
                  label="นามสกุล"
                  placeholder="กรอกนามสกุล"
                  required
                  outlined
                ></v-text-field>
              </v-col>
            </v-row>
            <v-text-field
              v-model="formData.email"
              label="อีเมล"
              placeholder="example@email.com"
              required
              outlined
            ></v-text-field>
            <v-card outlined class="mb-4">
              <v-card-title>แนบหลักฐานการชำระเงิน</v-card-title>
              <v-divider></v-divider>
              <v-card-text>
                <v-file-input
                  v-model="formData.paymentProof"
                  label="อัปโหลดไฟล์หลักฐานการชำระเงิน"
                  accept="image/*"
                  placeholder="เลือกไฟล์"
                  show-size
                  outlined
                  required
                ></v-file-input>
              </v-card-text>
            </v-card>
          </v-card-text>
        </v-card>

        <!-- Workshop Details -->
        <v-card outlined class="mb-4">
          <v-card-title>ข้อมูล Workshop</v-card-title>
          <v-divider></v-divider>
          <v-img
            :src="workshop.image"
            height="250px"
            contain
            class="my-4 rounded"
          ></v-img>
          <v-card-subtitle>
            <strong>ชื่อ:</strong> {{ workshop.name }}
          </v-card-subtitle>
          <v-card-subtitle>
            <strong>ราคาเดิม:</strong> <s>฿{{ workshop.price }}</s>
          </v-card-subtitle>
          <v-card-subtitle v-if="discountedPrice < workshop.price">
            <strong>ราคาหลังส่วนลด:</strong>
            <span class="text-success text-h6 font-weight-bold">
              ฿{{ discountedPrice }}
            </span>
          </v-card-subtitle>
          <v-card-subtitle>
            <strong>วันที่:</strong> {{ workshop.date }}
          </v-card-subtitle>
          <v-card-subtitle>
            <strong>เวลา:</strong> {{ workshop.startTime }} -
            {{ workshop.endTime }}
          </v-card-subtitle>
        </v-card>

        <!-- Submit Button -->
        <v-btn
          :disabled="!isFormValid"
          type="submit"
          :color="isFormValid ? 'primary' : 'grey'"
          block
          large
        >
          <v-icon left>mdi-check-circle</v-icon>
          ลงทะเบียน
        </v-btn>
      </v-form>
    </v-card>
  </v-container>
</template>

<script setup>
import { computed, ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useToast } from "vue-toastification";
import { useWorkshop } from "@/composables/useWorkshop";
import { convertFileToBase64 } from "@/utils/convertFileToBase64";

const route = useRoute();
const toast = useToast();

const id = route.params.id;
const { workshop, discountedPrice, loadWorkshop, submitForm, loading } =
  useWorkshop(id);

const formData = ref({
  firstname: "siraphop",
  lastname: "nonpala",
  email: "siraphop.rmutt@gmail.com",
  paymentProof: null, // เพิ่มฟิลด์สำหรับไฟล์ที่แนบมา
});

const isFormValid = computed(() => {
  return (
    formData.value.firstname.trim() !== "" &&
    formData.value.lastname.trim() !== "" &&
    formData.value.email.trim() !== "" &&
    formData.value.paymentProof !== null // ตรวจสอบว่าไฟล์ถูกแนบแล้ว
  );
});

const handleFormSubmit = async () => {
  try {
    const base64Proof = await convertFileToBase64(formData.value.paymentProof);

    const dataToSubmit = {
      firstname: formData.value.firstname,
      lastname: formData.value.lastname,
      email: formData.value.email,
      paymentProof: base64Proof, // แปลงไฟล์เป็น Base64
    };

    console.log("dataToSubmit: ", dataToSubmit);
    const res = await submitForm(dataToSubmit); // เรียก API เพื่อส่งข้อมูล
    console.log("res: ", res);
    toast.success("ลงทะเบียนสำเร็จ!");

    // Reset form
    formData.value = {
      firstname: "",
      lastname: "",
      email: "",
      paymentProof: null,
    };
  } catch (error) {
    toast.error(error.message);
  }
};

onMounted(() => {
  loadWorkshop().catch((error) => toast.error(error.message));
});
</script>
