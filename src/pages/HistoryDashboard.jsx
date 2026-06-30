import React, { useEffect, useState } from "react";

export default function HistoryDashboard({ user }) {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchFilter, setSearchFilter] = useState("");

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    let result = [...orders];

    if (statusFilter !== "all") {
      result = result.filter(o => o.status.toLowerCase() === statusFilter.toLowerCase());
    }

    if (searchFilter.trim() !== "") {
      const q = searchFilter.toLowerCase();
      result = result.filter(o => 
        o.id.toLowerCase().includes(q) || 
        (o.customerName && o.customerName.toLowerCase().includes(q)) ||
        o.items.some(item => item.name.toLowerCase().includes(q))
      );
    }

    setFilteredOrders(result);
  }, [orders, statusFilter, searchFilter]);

  const fetchOrders = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const queryParam = user.role === "restaurant" 
        ? `restaurant=${encodeURIComponent(user.name)}`
        : `customerId=${user.id}`;
        
      const res = await fetch(`http://localhost:5000/api/orders?${queryParam}`);
      const data = await res.json();
      setOrders(data);
      setFilteredOrders(data);
    } catch (err) {
      console.error("Error fetching order history:", err);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (filteredOrders.length === 0) return;
    
    const headers = ["Order ID", "Date", "Customer", "Items", "Total Amount ($)", "Status"];
    const rows = filteredOrders.map(o => [
      o.id,
      new Date(o.timestamp).toLocaleString(),
      o.customerName || "Guest",
      o.items.map(i => `${i.quantity}x ${i.name}`).join(" | "),
      o.totalAmount.toFixed(2),
      o.status
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.map(val => `"${val}"`).join(","))].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Loma_Rescue_History_${user.name.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDate = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="text-left font-body animate-page-in">
      <header className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-headline font-extrabold text-on-surface tracking-tight">Rescue History</h1>
          <p className="text-on-surface-variant text-sm mt-1">Review all completed rescues and environmental impact.</p>
        </div>
        {filteredOrders.length > 0 && (
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 bg-secondary text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-warm hover:opacity-90 transition-opacity shrink-0"
          >
            <span className="material-symbols-outlined text-base">download</span>
            <span>Export to CSV</span>
          </button>
        )}
      </header>

      {/* Filter Bar */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 text-lg">search</span>
          <input
            type="text"
            placeholder="Search by Order ID, Customer, or Item Name..."
            value={searchFilter}
            onChange={e => setSearchFilter(e.target.value)}
            className="w-full bg-surface-container-lowest border border-outline-variant/15 rounded-xl pl-11 pr-4 py-3 text-xs font-semibold placeholder:text-stone-400 focus:ring-2 focus:ring-primary focus:outline-none transition-all"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="bg-surface-container-lowest border border-outline-variant/15 rounded-xl px-4 py-3 text-xs font-semibold text-on-surface cursor-pointer focus:ring-2 focus:ring-primary focus:outline-none"
        >
          <option value="all">All Statuses</option>
          <option value="Completed">Completed</option>
          <option value="Order Prepared">Prepared</option>
          <option value="Order Ready">Ready</option>
          <option value="Delivery Started">In Delivery</option>
          <option value="Payment Failed">Failed</option>
        </select>
      </div>

      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center gap-3">
          <span className="material-symbols-outlined text-3xl animate-spin">sync</span>
          <p className="text-sm text-stone-400">Loading order log...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="h-64 flex flex-col items-center justify-center text-center p-6 border border-dashed border-outline-variant rounded-[2rem] bg-surface-container-low/30">
          <span className="material-symbols-outlined text-4xl text-outline-variant mb-3">history</span>
          <h4 className="font-bold text-base mb-1">No Orders Found</h4>
          <p className="text-xs text-stone-400 max-w-xs leading-relaxed">
            There are no rescue records matching your selected filter.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => {
            const co2Saved = (order.items.reduce((acc, item) => acc + item.quantity, 0) * 2.5).toFixed(1);
            return (
              <div 
                key={order.id} 
                className="bg-surface-container-lowest p-6 rounded-[2rem] border border-outline-variant/10 shadow-[0_4px_24px_rgba(176,46,0,0.01)] flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
              >
                {/* Left: Order Info & Items */}
                <div className="space-y-4 flex-1">
                  <div className="flex flex-wrap gap-x-4 gap-y-2 items-center">
                    <span className="text-sm font-bold text-primary">{order.id}</span>
                    <span className="text-stone-300">|</span>
                    <span className="text-xs font-semibold text-stone-400">{formatDate(order.timestamp)}</span>
                    <span className="text-stone-300">|</span>
                    <span className="bg-secondary-container/20 text-on-secondary-container px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px] fill">eco</span>
                      <span>{co2Saved} kg CO2 Saved</span>
                    </span>
                  </div>

                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-2 text-xs font-semibold text-on-surface">
                        <span className="bg-surface-container-high px-2 py-0.5 rounded text-primary">
                          {item.quantity}x
                        </span>
                        <span>{item.name}</span>
                        <span className="text-stone-400">({item.restaurant})</span>
                      </div>
                    ))}
                  </div>

                  {user.role === "restaurant" && (
                    <p className="text-[11px] font-semibold text-on-surface-variant flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">person</span>
                      <span>Rescued by: {order.customerName}</span>
                    </p>
                  )}
                </div>

                {/* Right: Payment & Status */}
                <div className="flex flex-row md:flex-col justify-between md:items-end w-full md:w-auto shrink-0 border-t md:border-t-0 border-outline-variant/10 pt-4 md:pt-0">
                  <div className="text-left md:text-right">
                    <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider mb-0.5">Total Rescued</p>
                    <p className="text-xl font-headline font-extrabold text-primary">${order.totalAmount.toFixed(2)}</p>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse" />
                    <span className="text-xs font-bold text-secondary uppercase tracking-wider">
                      {order.status}
                    </span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
