export const calculateDiscountedPrice = (price, discount) => {
  if (discount?.type === "percent") {
    return price - (price * discount.value) / 100;
  } else if (discount?.type === "fixed") {
    return price - discount.value;
  }
  return price; // กรณีไม่มีส่วนลด
};
