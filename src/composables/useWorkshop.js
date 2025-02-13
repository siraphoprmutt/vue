import { ref } from "vue";
import { fetchWorkshop, submitWorkshopForm } from "@/services/workshopService";
import { calculateDiscountedPrice } from "@/utils/priceUtils";

export const useWorkshop = (id) => {
  const workshop = ref({});
  const discountedPrice = ref(0);
  const loading = ref(false);

  const loadWorkshop = async () => {
    loading.value = true;
    try {
      const data = await fetchWorkshop(id);
      console.log("data: ", data);
      workshop.value = data;
      discountedPrice.value = calculateDiscountedPrice(
        data.price,
        data.discount
      );
    } catch (error) {
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const submitForm = async (formData) => {
    try {
      return await submitWorkshopForm(id, formData);
    } catch (error) {
      throw error;
    }
  };

  return { workshop, discountedPrice, loadWorkshop, submitForm, loading };
};
