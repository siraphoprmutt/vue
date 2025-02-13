import "@testing-library/jest-dom"; // โหลด matchers ของ jest-dom
import { config } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import { VBtn, VTextField, VForm } from "vuetify/components"; // Import เฉพาะ Components ที่ใช้
import { Ripple } from "vuetify/directives"; // Import Directive เฉพาะที่ต้องใช้

// สร้าง Vuetify instance สำหรับทดสอบ
const vuetify = createVuetify({
  components: {
    VBtn,
    VTextField,
    VForm,
  },
  directives: {
    Ripple,
  },
});

// ตั้งค่า global config สำหรับ Vue Test Utils
config.global.plugins = [vuetify];
