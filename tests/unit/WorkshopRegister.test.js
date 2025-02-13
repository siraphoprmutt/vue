import { render, fireEvent, screen } from "@testing-library/vue";
import WorkshopRegisterView from "@/views/workshops/WorkshopRegisterView.vue";

describe("WorkshopRegisterView", () => {
  it("renders the registration form", () => {
    render(WorkshopRegisterView);

    // ตรวจสอบว่าแบบฟอร์มแสดงผล
    expect(screen.getByLabelText("ชื่อ")).toBeInTheDocument();
    expect(screen.getByLabelText("นามสกุล")).toBeInTheDocument();
    expect(screen.getByLabelText("อีเมล")).toBeInTheDocument();
    expect(screen.getByText("ลงทะเบียน")).toBeInTheDocument();
  });

  it("validates the form before submission", async () => {
    render(WorkshopRegisterView);

    // คลิกปุ่มโดยไม่กรอกข้อมูล
    const submitButton = screen.getByText("ลงทะเบียน");
    await fireEvent.click(submitButton);

    // ตรวจสอบว่ามีข้อความแจ้งเตือน
    expect(screen.getByText("กรุณากรอกชื่อ")).toBeInTheDocument();
    expect(screen.getByText("กรุณากรอกนามสกุล")).toBeInTheDocument();
    expect(screen.getByText("กรุณากรอกอีเมล")).toBeInTheDocument();
  });

  it("submits the form with valid data", async () => {
    render(WorkshopRegisterView);

    // กรอกข้อมูลลงในฟอร์ม
    await fireEvent.update(screen.getByLabelText("ชื่อ"), "John");
    await fireEvent.update(screen.getByLabelText("นามสกุล"), "Doe");
    await fireEvent.update(
      screen.getByLabelText("อีเมล"),
      "john.doe@example.com"
    );

    // คลิกปุ่มลงทะเบียน
    const submitButton = screen.getByText("ลงทะเบียน");
    await fireEvent.click(submitButton);

    // ตรวจสอบข้อความสำเร็จ
    expect(screen.getByText("ลงทะเบียนสำเร็จ!")).toBeInTheDocument();
  });
});
