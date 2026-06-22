import React from 'react';

/**
 * SuccessPage Component
 * ---------------------
 * النسخة المعدلة: تم تحسين المسافات حول النصوص وتخفيف سماكة المجموع الكلي.
 */
const SuccessPage = () => {
  const rescuedItems = [
    { 
      id: 1, 
      name: 'Rustic Sourdough Loaf', 
      store: 'The Daily Crumb', 
      price: '$3.50', 
      img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcZzITokQ0az2_vzGLxgB-rDwnyrEdzDe0TyYwDwyRhWv-PTt2qG7azctP&s=10' 
    },
    { 
      id: 2, 
      name: 'Surplus Pastry Box', 
      store: 'Cafe Miel', 
      price: '$5.00', 
      img: 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?q=80&w=150&h=150&auto=format&fit=crop' 
    }
  ];

  return (
    <div className="min-h-screen bg-[#f6fbed] flex items-center justify-center p-4 font-body">
      <main className="w-full max-w-2xl flex flex-col items-center gap-8">
        
        {/* القسم العلوي: أيقونة وعنوان */}
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-[#a0f399] rounded-full mx-auto flex items-center justify-center shadow-md">
            <span className="material-symbols-outlined text-[#217128] text-4xl" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
          </div>
          <h1 className="font-headline text-4xl sm:text-5xl font-bold text-[#181d15] tracking-tight">Order Confirmed</h1>
          <p className="text-[#5b4039] text-lg max-w-md mx-auto italic">Thank you for rescuing food today. Your epicurean journey is making a difference.</p>
        </div>

        {/* كارت الفاتورة الرئيسي */}
        <div className="w-full bg-white rounded-3xl p-8 shadow-[0_10px_40px_rgba(0,0,0,0.03)] relative overflow-hidden border border-white">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#ac2d00] to-[#d63c05]"></div>
          
          {/* بيانات الأوردر الأساسية */}
          <div className="flex justify-between items-center pb-6 border-b-2 border-[#f0f6e8] border-dashed">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-[#5b4039] mb-1 font-bold">Order ID</p>
              <p className="font-headline font-bold text-[#181d15]">#LMA-8492-X</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-widest text-[#5b4039] mb-1 font-bold">Est. Pickup</p>
              <p className="font-headline font-bold text-[#ac2d00]">Today, 5:30 PM</p>
            </div>
          </div>

          {/* قائمة المنتجات المسترجعة */}
          <div className="py-6 space-y-4">
            <h2 className="font-headline text-xl font-bold text-[#181d15]">Items Rescued</h2>
            {rescuedItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center p-3 rounded-2xl bg-[#f0f6e8]/50 border border-transparent hover:border-[#ac2d00]/10 transition-colors">
                <div className="flex items-center gap-4">
                  <img src={item.img} className="w-12 h-12 rounded-xl object-cover shadow-sm" alt={item.name} />
                  {/* التعديل: ضفنا space-y-1 لمنع تداخل النصوص وإعطائها مساحة مريحة */}
                  <div className="space-y-1">
                    <p className="font-bold text-[#181d15] text-sm leading-tight">{item.name}</p>
                    <p className="text-[11px] text-[#5b4039] font-medium">{item.store}</p>
                  </div>
                </div>
                <p className="font-headline font-bold text-[#181d15]">{item.price}</p>
              </div>
            ))}
          </div>

          {/* الحساب النهائي */}
          <div className="pt-6 border-t-2 border-[#f0f6e8] border-dashed space-y-2">
            <div className="flex justify-between text-[#5b4039] text-sm">
              <span>Subtotal</span>
              <span className="font-medium">$8.50</span>
            </div>
            {/* التعديل: خففنا الـ Bold هنا لـ font-bold بدلاً من font-black الطاغية */}
            <div className="flex justify-between font-headline text-xl font-bold text-[#181d15] pt-2">
              <span>Total Paid</span>
              <span>$9.00</span>
            </div>
          </div>
        </div>

        {/* زرار التنقل البرتقالي */}
        <button className="group w-full sm:w-auto bg-[#ac2d00] hover:bg-[#d63c05] text-white font-headline font-extrabold text-lg py-4 px-14 rounded-2xl transition-all duration-300 shadow-[0_10px_25px_rgba(172,45,0,0.2)] hover:-translate-y-1 flex items-center justify-center gap-3">
          Back to Browse
          <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
        </button>

      </main>
    </div>
  );
};

export default SuccessPage;