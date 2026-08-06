"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { fetchOrders, type Order } from "@/lib/api";
import { Suspense } from "react";

function OrdersContent() {
  const searchParams = useSearchParams();
  const successId = searchParams.get("success");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders().then(setOrders).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ textAlign: "center", padding: "3rem" }}>Loading orders...</div>;

  return (
    <div style={{ maxWidth: "820px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1.5rem", letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--text)" }}>My Orders</h1>

      {successId && (
        <div style={{
          padding: "0.9rem 1.1rem", background: "#e6f7ea", color: "#1a7a32",
          borderRadius: "4px", marginBottom: "1.5rem", border: "1px solid #b2dfbc",
          fontWeight: 600, fontSize: "0.85rem",
        }}>
          ✓ Order #{successId} placed successfully! Thank you for shopping with Shop4U.
        </div>
      )}

      {orders.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem", background: "white", borderRadius: "4px", border: "1px solid var(--border)" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>📦</div>
          <p style={{ fontWeight: 700, color: "var(--text-2)", fontSize: "0.9rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>No orders yet</p>
          <p style={{ color: "var(--text-3)", fontSize: "0.8rem", marginTop: "0.3rem", marginBottom: "1.25rem" }}>Start shopping to see your orders here</p>
          <a href="/" style={{
            display: "inline-block", padding: "0.65rem 1.8rem",
            background: "#ff3f6c", color: "white",
            borderRadius: "4px", fontWeight: 700, fontSize: "0.75rem",
            letterSpacing: "0.08em", textTransform: "uppercase",
          }}>Shop Now</a>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {orders.map((order) => (
            <div key={order.id} style={{
              border: "1px solid var(--border)", borderRadius: "4px",
              padding: "1.1rem 1.25rem", background: "white",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <span style={{ fontWeight: 700, fontSize: "0.9rem" }}>Order #{order.id}</span>
                  <span style={{
                    padding: "2px 8px",
                    background: order.status === "pending" ? "#fff8e1" : "#e6f7ea",
                    color: order.status === "pending" ? "#7d6500" : "#1a7a32",
                    borderRadius: "2px", fontSize: "0.68rem",
                    fontWeight: 800, letterSpacing: "0.05em", textTransform: "uppercase",
                  }}>{order.status}</span>
                </div>
                <span style={{ color: "var(--text-3)", fontSize: "0.78rem" }}>
                  {new Date(order.created_at).toLocaleDateString()}
                </span>
              </div>
              <div style={{ marginBottom: "0.5rem" }}>
                {order.items.map((item, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "0.3rem 0", fontSize: "0.82rem", borderBottom: "1px solid #f4f4f4" }}>
                    <span style={{ color: "var(--text-2)" }}>{item.product_name} × {item.quantity}</span>
                    <span style={{ fontWeight: 500 }}>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "0.6rem", fontWeight: 800, fontSize: "0.9rem" }}>
                <span>Total</span>
                <span style={{ color: "#ff3f6c" }}>${order.total.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: "center", padding: "3rem" }}>Loading...</div>}>
      <OrdersContent />
    </Suspense>
  );
}
