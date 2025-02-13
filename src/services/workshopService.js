const apiUrl = import.meta.env.VITE_API_URL;
const apiKey = import.meta.env.VITE_API_KEY;

// ดึงข้อมูล Workshop
export const fetchWorkshop = async (id) => {
  try {
    const response = await fetch(`${apiUrl}/api/workshops/${id}`, {
      headers: {
        Authorization: apiKey,
      },
    });
    if (!response.ok) {
      throw new Error("ไม่พบข้อมูล Workshop");
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

// ส่งข้อมูลการลงทะเบียน
export const submitWorkshopForm = async (id, formData) => {
  try {
    const response = await fetch(`${apiUrl}/api/workshops/${id}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: apiKey,
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "เกิดข้อผิดพลาด");
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};
