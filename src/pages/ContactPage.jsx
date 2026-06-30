import React, { useState } from "react";

export default function ContactPage({ addToast }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [activeFaq, setActiveFaq] = useState(null);

  const faqs = [
    { q: "Where do I pick up my rescue meal?", a: "Directly at the restaurant or kitchen address listed in your order details inside the pickup window." },
    { q: "Are these meals safe and fresh?", a: "Absolutely. Partners list only freshly prepared surplus meals that meet all standard food safety inspections." },
    { q: "What is the pickup window?", a: "Typically within 15 to 45 minutes of purchase. Please check your order details carefully." }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setName("");
    setEmail("");
    setMessage("");
    if (addToast) {
      addToast({
        type: "success",
        title: "Message Sent",
        message: "We've received your query and will reply within 24 hours."
      });
    }
  };

  return (
    <div className="pt-24 pb-16 px-6 max-w-5xl mx-auto font-body text-left animate-page-in">
      <h1 className="text-4xl font-headline font-extrabold text-on-surface mb-2">Contact Customer Support</h1>
      <p className="text-on-surface-variant text-sm mb-10">We're here to help you rescue meals and resolve any issues.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* FAQ & Support Info */}
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-headline font-bold text-on-surface mb-4">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div key={idx} className="bg-surface-container-low border border-outline-variant/10 rounded-2xl p-4">
                  <button
                    onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                    className="w-full flex justify-between items-center text-sm font-bold text-on-surface"
                  >
                    <span>{faq.q}</span>
                    <span className="material-symbols-outlined text-sm">
                      {activeFaq === idx ? "expand_less" : "expand_more"}
                    </span>
                  </button>
                  {activeFaq === idx && (
                    <p className="text-xs text-on-surface-variant leading-relaxed mt-2.5 accordion-open">{faq.a}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <h2 className="text-xl font-headline font-bold text-on-surface">Other Ways to Reach Us</h2>
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-xl">mail</span>
              <span className="font-semibold text-on-surface-variant">support@loma.com</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-xl">call</span>
              <span className="font-semibold text-on-surface-variant">+20 100 123 4567</span>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="bg-surface-container-low p-8 rounded-[2rem] border border-outline-variant/10 shadow-sm space-y-4 h-fit">
          <h2 className="text-xl font-headline font-bold text-on-surface mb-2">Send a Message</h2>
          
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block ml-1">Your Name</label>
            <input
              type="text"
              className="w-full bg-surface-bright border-none rounded-xl px-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-primary focus:bg-surface-container-highest transition-all"
              placeholder="Jane Doe"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block ml-1">Email Address</label>
            <input
              type="email"
              className="w-full bg-surface-bright border-none rounded-xl px-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-primary focus:bg-surface-container-highest transition-all"
              placeholder="jane@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block ml-1">Message</label>
            <textarea
              className="w-full bg-surface-bright border-none rounded-xl px-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-primary focus:bg-surface-container-highest transition-all h-28 resize-none"
              placeholder="How can we assist you?"
              value={message}
              onChange={e => setMessage(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-primary to-primary-container text-white py-3.5 rounded-xl font-headline font-bold text-sm shadow-warm hover:opacity-95 transition-all"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}
