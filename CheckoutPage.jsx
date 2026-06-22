import React, { useState } from 'react';

/**
 * CheckoutPage Component
 * ----------------------
 * النسخة النهائية: حقول الكارد ثابتة لا تختفي، وتم تخفيف سمك عنوان اللوجو.
 */
const CheckoutPage = () => {
  // state لمعرفة طريقة الدفع النشطة (لتغيير لون الزرار فقط عند الضغط)
  const [activePayment, setActivePayment] = useState(1);

  const cartItems = [
    { 
      id: 1, 
      name: "Artisan Salad Bowl", 
      info: "Greens Market • 2 Portions", 
      price: 8.50, 
      oldPrice: 17.00, 
      img: "https://knifeandfaulk.com/cdn/shop/files/artisan-protein-bowls-8695589.webp?v=1772374582&width=990" 
    },
    { 
      id: 2, 
      name: "Rustic Sourdough", 
      info: "Daily Bread Co • 1 Loaf", 
      price: 3.00, 
      oldPrice: 6.00, 
      img: "" 
    },
  ];

  return (
    <div className="min-h-screen bg-[#f6fbed] font-body pb-20">
      
      {/* 1. Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100/50">
        <div className="p-4 flex justify-between items-center max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-4">
            <button className="text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-all active:scale-95 flex items-center justify-center">
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            {/* التعديل: خففنا الـ Bold هنا من font-black إلى font-bold */}
            <div className="text-2xl font-bold text-[#ac2d00] italic font-headline tracking-tight">Lo’ma</div>
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

      <main className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 mt-8">
        
        {/* العمود الأيسر */}
        <div className="lg:col-span-7 space-y-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-headline font-extrabold mb-2 tracking-tight">Secure Checkout</h1>
            <p className="text-gray-500 text-lg">Complete your order to rescue these delicious meals.</p>
          </div>

          {/* فورم بيانات التوصيل */}
          <section className="bg-[#f0f6e8] rounded-[2rem] p-8 shadow-[0_4px_24px_rgba(176,46,0,0.01)] space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-[#ac2d00]/10 flex items-center justify-center text-[#ac2d00]">
                <span className="material-symbols-outlined font-fill">local_shipping</span>
              </div>
              <h2 className="text-2xl font-bold text-[#181d15]">Delivery Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-600 ml-2 block">Full Name</label>
                <input type="text" placeholder="Jane Doe" className="w-full p-4 rounded-xl border-none bg-white shadow-sm focus:ring-2 focus:ring-[#ac2d00] transition-all" />
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-600 ml-2 block">Phone Number</label>
                <input type="tel" placeholder="+1 (555) 000-0000" className="w-full p-4 rounded-xl border-none bg-white shadow-sm focus:ring-2 focus:ring-[#ac2d00] transition-all" />
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-600 ml-2 block">Email Address</label>
                <input type="email" placeholder="jane@example.com" className="w-full p-4 rounded-xl border-none bg-white shadow-sm focus:ring-2 focus:ring-[#ac2d00] transition-all" />
              </div>
              
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-600 ml-2 block">Delivery Address</label>
                <input type="text" placeholder="123 Eco Street, Apt 4B, City, Zip" className="w-full p-4 rounded-xl border-none bg-white shadow-sm focus:ring-2 focus:ring-[#ac2d00] transition-all" />
              </div>
              
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-600 ml-2 block">Delivery Notes (Optional)</label>
                <textarea rows="2" placeholder="Leave at the front door, please ring bell." className="w-full p-4 rounded-xl border-none bg-white shadow-sm focus:ring-2 focus:ring-[#ac2d00] transition-all resize-none"></textarea>
              </div>
            </div>
          </section>

          {/* اختيار طريقة الدفع */}
          <section className="bg-[#f0f6e8] rounded-[2rem] p-8 shadow-[0_4px_24px_rgba(176,46,0,0.01)]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-[#8c4c00]/10 flex items-center justify-center text-[#8c4c00]">
                <span className="material-symbols-outlined font-fill">payments</span>
              </div>
              <h2 className="text-2xl font-bold text-[#181d15]">Payment Method</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <button 
                type="button"
                onClick={() => setActivePayment(1)}
                className={`p-5 rounded-2xl border-2 flex flex-col items-center gap-3 text-center transition-all duration-300 ${activePayment === 1 ? 'border-[#ac2d00] bg-[#ac2d00]/5 text-[#ac2d00]' : 'border-transparent bg-white hover:bg-gray-50 text-gray-600'}`}
              >
                <span className="material-symbols-outlined text-3xl">credit_card</span>
                <span className="font-bold text-sm">Credit Card</span>
              </button>

              <button 
                type="button"
                onClick={() => setActivePayment(2)}
                className={`p-5 rounded-2xl border-2 flex flex-col items-center gap-3 text-center transition-all duration-300 ${activePayment === 2 ? 'border-[#ac2d00] bg-[#ac2d00]/5 text-[#ac2d00]' : 'border-transparent bg-white hover:bg-gray-50 text-gray-600'}`}
              >
                <span className="material-symbols-outlined text-3xl">account_balance_wallet</span>
                <span className="font-bold text-sm">E-Wallet</span>
              </button>

              <button 
                type="button"
                onClick={() => setActivePayment(3)}
                className={`p-5 rounded-2xl border-2 flex flex-col items-center gap-3 text-center transition-all duration-300 ${activePayment === 3 ? 'border-[#ac2d00] bg-[#ac2d00]/5 text-[#ac2d00]' : 'border-transparent bg-white hover:bg-gray-50 text-gray-600'}`}
              >
                <span className="material-symbols-outlined text-3xl">attach_money</span>
                <span className="font-bold text-sm">Cash on Delivery</span>
              </button>
            </div>

            {/* التعديل: شيلنا شرط الـ React وخلينا الحقول دي ثااابتة ومبتختفيش أبداً */}
            <div className="bg-white p-6 rounded-2xl shadow-sm space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-gray-500 ml-1">Card Number</label>
                <div className="relative">
                  <input type="text" placeholder="0000 0000 0000 0000" className="w-full bg-gray-50 border-none rounded-xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-[#ac2d00]" />
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">credit_card</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-gray-500 ml-1">Expiry</label>
                  <input type="text" placeholder="MM/YY" className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#ac2d00]" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-gray-500 ml-1">CVC</label>
                  <input type="text" placeholder="123" className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#ac2d00]" />
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* العمود الأيمن */}
        <div className="lg:col-span-5">
          <div className="sticky top-28 bg-white rounded-[2.5rem] p-8 shadow-[0_12px_48px_rgba(176,46,0,0.04)] relative border border-gray-50">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-gradient-to-r from-[#ac2d00] to-[#d63c05] rounded-b-full"></div>
             <h2 className="text-2xl font-bold mb-8 font-headline text-[#181d15]">Order Summary</h2>
             
             <div className="space-y-6 mb-8">
               {cartItems.map(item => (
                 <div key={item.id} className="flex gap-4 items-start group">
                   <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 bg-gray-100 relative">
                     <img src={item.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={item.name} />
                   </div>
                   <div className="flex-grow">
                     <h3 className="font-bold text-[#181d15] text-lg leading-tight mb-1">{item.name}</h3>
                     <p className="text-gray-400 text-sm mb-2">{item.info}</p>
                     <div className="flex justify-between items-center">
                        <span className="text-[#ac2d00] font-bold text-lg">${item.price.toFixed(2)}</span>
                        <span className="text-gray-300 line-through text-sm">${item.oldPrice.toFixed(2)}</span>
                     </div>
                   </div>
                 </div>
               ))}
             </div>

             {/* Eco Impact Badge */}
             <div className="bg-[#a0f399]/20 p-4 rounded-2xl flex items-center gap-3 mb-8 border-l-4 border-[#217128]">
                <span className="material-symbols-outlined text-[#217128]">eco</span>
                <p className="text-sm font-medium text-[#217128]">This order rescues <span className="font-bold">1.5kg</span> of food and saves <span className="font-bold">3.8kg</span> of CO2e.</p>
             </div>

             {/* Price Breakdown */}
             <div className="space-y-4 mb-8 text-[#181d15]">
                <div className="flex justify-between items-center text-gray-500"><span>Subtotal</span><span className="font-medium">$11.50</span></div>
                <div className="flex justify-between items-center text-gray-500"><span>Delivery Fee</span><span className="font-medium">$2.50</span></div>
                <div className="flex justify-between items-center text-[#217128]">
                  <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[1rem]">loyalty</span> Rescue Discount</span>
                  <span className="font-bold">-$11.50</span>
                </div>
                <div className="h-px w-full bg-gray-100 my-2"></div>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-1">Total</p>
                    <p className="text-xs text-gray-400">Incl. taxes</p>
                  </div>
                  <span className="text-4xl font-black text-[#ac2d00] tracking-tighter">$14.00</span>
                </div>
             </div>

             {/* CTA Button */}
             <button className="w-full bg-gradient-to-r from-[#ac2d00] to-[#d63c05] text-white font-bold text-lg py-5 px-8 rounded-[1.5rem] shadow-[0_8px_24px_rgba(176,46,0,0.2)] hover:shadow-[0_12px_32px_rgba(176,46,0,0.3)] hover:-translate-y-1 transition-all duration-300 flex justify-center items-center gap-2 group">
                Confirm Order
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
             </button>
             <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1">
               <span className="material-symbols-outlined text-[1rem]">lock</span> Secure 256-bit SSL encryption
             </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;