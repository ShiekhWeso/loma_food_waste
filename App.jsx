import React from 'react';
// استدعاء الثلاث صفحات
import BrowsePage from './pages/BrowsePage';
import CheckoutPage from './pages/CheckoutPage';
import SuccessPage from './pages/SuccessPage';
import ScrollToTop from "./ScrollToTop";

/**
 * نصيحة للتصوير: 
 * الصفحة اللي عايز تعرضها، شيل من قدامها علامات الـ //
 * والصفحات التانية حط قدامها // عشان تختفي.
 */
function App() {
  return (
    <div className="App">
      
      {/* الـ Component ده هيفضل هنا عشان أول ما تظهر أي صفحة يطلع الشاشة فوق تلقائي */}
      <ScrollToTop />

      {/* 1. صفحة تصفح المنتجات والسلة */}
      {/*<BrowsePage />*/}

      {/* 2. صفحة الدفع (Checkout) */}
      {/* <CheckoutPage />*/}

      {/* 3. صفحة تأكيد الطلب (Success) */}
       <SuccessPage /> 

    </div>
  );
}

export default App;