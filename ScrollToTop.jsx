import { useEffect } from "react";

const ScrollToTop = () => {
  useEffect(() => {
    // هيطلع فوق خالص فوراً أول ما ملف App يعيد رندرة الصفحات
    window.scrollTo(0, 0);
  }); // شيلنا الـ [pathname] عشان يشتغل مع التبديل اليدوي بتاعك

  return null;
};

export default ScrollToTop;