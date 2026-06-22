import React from 'react';

/**
 * BrowsePage Component
 * --------------------
 * النسخة المتطابقة هيكلياً مع الـ CheckoutPage:
 * تعتمد على Grid مدمج بالكامل جوة الـ Container الرئيسي لضمان ثبات الأبعاد عند الزوم.
 */
const BrowsePage = () => {
  const products = [
    { id: 1, name: "Artisan Pepperoni Large", store: "Luigi's Oven", price: 12.50, oldPrice: 25.00, left: 2, img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=400&auto=format&fit=crop" },
    { id: 2, name: "Double Truffle Smash", store: "Burger Bros", price: 8.00, oldPrice: 16.00, left: 4, img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=400&auto=format&fit=crop" },
  ];

  return (
    // نفس الخلفية والأبعاد الأساسية لصفحة الـ Checkout
    <div className="min-h-screen bg-[#f6fbed] font-body pb-20">
      
      {/* 1. Header: متطابق ومسنتر تماماً مع الهيدر التاني */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100/50">
        <div className="p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-4">
            <div className="text-2xl font-bold text-[#ac2d00] italic font-headline tracking-tight">lo'ma</div>
          </div>
          <div className="flex items-center gap-2">
            <button className="text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-all active:scale-95 flex items-center justify-center">
              <span className="material-symbols-outlined">shopping_cart</span>
            </button>
            <button className="text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-all active:scale-95 flex items-center justify-center">
              <span className="material-symbols-outlined">person</span>
            </button>
          </div>
        </div>
      </header>

      {/* الحاوية الرئيسية والـ Grid: محاكاة كاملة لصفحة الـ Checkout لنسف مشكلة الـ Zoom */}
      <main className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 mt-8">
        
        {/* 2. Main Content (العمود الأيسر - واخد 7 أعمدة مثل الـ Checkout) */}
        <div className="lg:col-span-7 opacity-40 pointer-events-none">
          <h1 className="text-4xl md:text-5xl font-headline font-extrabold mb-10 text-[#181d15] tracking-tight">Rescue Nearby</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {products.map((p) => (
              <div key={p.id} className="bg-white rounded-[2rem] p-4 shadow-sm border border-white">
                <div className="relative h-60 rounded-2xl overflow-hidden mb-4">
                  <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
                  <span className="absolute top-4 left-4 bg-[#b06000] text-white px-3 py-1 rounded-full text-xs font-bold uppercase">{p.left} Left</span>
                </div>
                <h3 className="text-2xl font-headline font-bold mb-1">{p.name}</h3>
                <p className="text-gray-500 mb-4">{p.store}</p>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-[#ac2d00]">${p.price.toFixed(2)}</span>
                  <span className="text-gray-400 line-through">${p.oldPrice.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Cart SideBar (العمود الأيمن - واخد 5 أعمدة ومدمج جوة السنتر بدلاً من الـ fixed العايم) */}
        <div className="lg:col-span-5">
          <div className="sticky top-28 bg-white rounded-[2rem] p-8 shadow-2xl border border-gray-100 flex flex-col">
            
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-headline font-black text-[#ac2d00]">Your Kitchen</h2>
                <p className="text-gray-400 text-sm">2 items ready for rescue</p>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors flex items-center justify-center">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* قائمة المشتريات */}
            <div className="space-y-6 max-h-[40vh] overflow-y-auto pr-1">
              {products.map((p) => (
                <div key={p.id} className="flex gap-4 items-center bg-[#f0f6e8]/50 p-4 rounded-2xl border border-white">
                  <img src={p.img} className="w-16 h-16 rounded-xl object-cover shrink-0" alt={p.name} />
                  <div className="flex-grow">
                    <h4 className="font-bold text-sm text-[#181d15]">{p.name}</h4>
                    <div className="flex justify-between items-center mt-2">
                      <span className="font-black text-[#ac2d00]">${p.price.toFixed(2)}</span>
                      <div className="flex items-center gap-3 bg-white px-2 py-1 rounded-full border border-gray-100 shadow-sm">
                        <button className="text-xs font-bold text-gray-400">-</button>
                        <span className="text-sm font-bold text-gray-700">1</span>
                        <button className="text-xs font-bold text-gray-400">+</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ملخص الحساب والزرار البرتقالي */}
            <div className="mt-8 pt-6 border-t border-dashed border-gray-200 space-y-4">
              <div className="flex justify-between text-gray-500 font-medium"><span>Subtotal</span><span>$20.50</span></div>
              <div className="flex justify-between text-[#217128] font-bold"><span>Total Savings</span><span>-$20.50</span></div>
              <div className="flex justify-between text-2xl font-black text-[#181d15] pt-2"><span>Total</span><span>$20.50</span></div>
              <button className="w-full bg-[#ac2d00] text-white py-5 rounded-2xl font-black text-lg shadow-lg hover:shadow-[#ac2d00]/20 hover:-translate-y-1 transition-all mt-4">
                Checkout Now →
              </button>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
};

export default BrowsePage;