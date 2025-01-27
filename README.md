# **จัดการหลายระบบใน Vue ผ่าน GitHub Pages**

## **1. แนวทางที่ 1: ใช้เส้นทางแบบ Nested Routing (แนะนำ)**

หากระบบทั้งหมดแชร์โค้ดเดียวกัน สามารถใช้ **Vue Router** เพื่อจัดการเส้นทางสำหรับแต่ละระบบ:

```ts
import { createRouter, createWebHashHistory } from "vue-router";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/workshops",
      component: () => import("@/layouts/WorkshopsLayout.vue"),
      children: [
        { path: "", component: () => import("@/views/workshops/Home.vue") },
        {
          path: "details",
          component: () => import("@/views/workshops/Details.vue"),
        },
      ],
    },
    {
      path: "/courses",
      component: () => import("@/layouts/CoursesLayout.vue"),
      children: [
        { path: "", component: () => import("@/views/courses/Home.vue") },
        { path: "info", component: () => import("@/views/courses/Info.vue") },
      ],
    },
  ],
});

export default router;
```

### **โครงสร้างไฟล์**

```plaintext
src/
│-- layouts/
│   ├── WorkshopsLayout.vue
│   ├── CoursesLayout.vue
│-- views/
│   ├── workshops/
│   │   ├── Home.vue
│   │   ├── Details.vue
│   ├── courses/
│       ├── Home.vue
│       ├── Info.vue
```

### **ตั้งค่า**

```js
export default defineConfig({
  base: isProduction ? "/vue/" : "./",
});
```

---

## **2. แนวทางที่ 2: ใช้การ build แยกสำหรับแต่ละระบบ**

หากต้องการแยกโฟลเดอร์สำหรับแต่ละระบบ เช่น `dist/workshops/` และ `dist/courses/` ให้สร้าง config และ script แยกสำหรับแต่ละระบบ

```js
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  base: "/vue/workshops/",
  build: {
    outDir: "dist/workshops",
  },
});
```

```js
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  base: "/vue/courses/",
  build: {
    outDir: "dist/courses",
  },
});
```

### **เพิ่ม script ใน**

```json
"scripts": {
  "build:workshops": "vite build --config vite.workshops.config.js",
  "build:courses": "vite build --config vite.courses.config.js",
  "deploy": "npm run build:workshops && npm run build:courses && gh-pages -d dist"
}
```

---

## **3. แนวทางที่ 3: ใช้หลายโปรเจ็กต์ Vue แยกกัน**

หากแต่ละระบบเป็นโครงการที่แยกจากกันอย่างสิ้นเชิง ให้แยกเป็นโฟลเดอร์อิสระ เช่น:

`vue/
│-- workshops/
│   ├── src/
│   ├── vite.config.js
│-- courses/
│   ├── src/
│   ├── vite.config.js`

### **ขั้นตอน Deploy**

1. เข้าแต่ละโฟลเดอร์และ build:

   ```sh
   cd workshops && npm run build && cd ..
   cd courses && npm run build && cd ..
   ```

2. Deploy:

   ```sh
   gh-pages -d dist/workshops
   gh-pages -d dist/courses
   ```

---

## 4: ใช้ GitHub Actions สำหรับการ build อัตโนมัติ\*\*

```yaml
name: Deploy Vue Multi-Projects

on:
  push:
    branches:
      - main

jobs:
  build-workshops:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"

      - name: Install dependencies
        run: npm install

      - name: Build workshops
        run: npm run build:workshops

      - name: Deploy workshops to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist/workshops

  build-courses:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v3

      - name: Install dependencies
        run: npm install

      - name: Build courses
        run: npm run build:courses

      - name: Deploy courses to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist/courses
```

---

### **สรุปวิธีที่แนะนำ**

1. **ใช้ Vue Router ในโปรเจ็กต์เดียว** – เหมาะกับระบบที่แชร์โค้ดกัน
2. **แยก build อิสระโดยใช้ config ต่างกัน** – เหมาะกับระบบที่แยกอิสระ
3. **ใช้หลายโปรเจ็กต์ Vue แยกกัน** – เหมาะกับระบบที่ไม่มีความเกี่ยวข้องกัน
4. **ใช้ GitHub Actions เพื่อ deploy อัตโนมัติ**

สามารถเลือกตามความเหมาะสมและนำไปปรับใช้ในโปรเจ็กต์ของคุณได้ครับ! 🚀
