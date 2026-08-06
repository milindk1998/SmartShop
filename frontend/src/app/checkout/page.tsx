"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchCart, createOrder, type Cart } from "@/lib/api";

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", address: "" });

  useEffect(() => {
    fetchCart().then(setCart).catch(() => setError("Failed to load cart")).finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.address) {
      setError("Please fill in all fields");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const order = await createOrder(form.name, form.email, form.address);
      router.push(`/orders?success=${order.id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create order");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div style={{ textAlign: "center", padding: "3rem" }}>Loading...</div>;
  if (!cart?.items.length) return (
    <div style={{ textAlign: "center", padding: "3rem" }}>
      <p>Your cart is empty. Add some items before checking out.</p>
    </div>
  );

  return (
    <div style={{ maxWidth: "620px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1.5rem", letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--text)" }}>Checkout</h1>

      {error && (
        <div style={{ padding: "0.75rem 1rem", background: "#fdecea", color: "#d32f2f", borderRadius: "4px", marginBottom: "1rem", border: "1px solid #f5c6c6", fontSize: "0.85rem" }}>
          {error}
        </div>
      )}

      {/* Order Summary */}
      <div style={{ background: "white", padding: "1.1rem 1.25rem", borderRadius: "4px", marginBottom: "1.5rem", border: "1px solid var(--border)" }}>
        <h2 style={{ fontWeight: 700, marginBottom: "0.75rem", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--text-3)" }}>Order Summary</h2>
        {cart.items.map((item) => (
          <div key={item.id} style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0", borderBottom: "1px solid #f4f4f4", fontSize: "0.85rem" }}>
            <span style={{ color: "var(--text-2)" }}>{item.product.name} × {item.quantity}</span>
            <span style={{ fontWeight: 600 }}>${(item.product.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div style={{ display: "flex", justifyContent: "space-between", padding: "0.75rem 0 0", fontWeight: 800, fontSize: "1rem" }}>
          <span>Total</span>
          <span style={{ color: "#ff3f6c" }}>${cart.total.toFixed(2)}</span>
        </div>
      </div>

      {/* Checkout Form */}
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div>
          <label style={{ display: "block", marginBottom: "0.3rem", fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--text-2)" }}>Full Name</label>
          <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="John Doe"
            style={{ width: "100%", boxSizing: "border-box" }} />
        </div>
        <div>
          <label style={{ display: "block", marginBottom: "0.3rem", fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--text-2)" }}>Email</label>
          <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="john@example.com"
            style={{ width: "100%", boxSizing: "border-box" }} />
        </div>
        <div>
          <label style={{ display: "block", marginBottom: "0.3rem", fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--text-2)" }}>Shipping Address</label>
          <textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}
            placeholder="123 Main St, City, State, ZIP"
            rows={3}
            style={{ width: "100%", resize: "vertical", boxSizing: "border-box" }} />
        </div>
        <button type="submit" disabled={submitting}
          style={{
            padding: "0.85rem",
            background: submitting ? "#ffb3c6" : "#ff3f6c",
            color: "white", border: "none", borderRadius: "4px",
            cursor: submitting ? "not-allowed" : "pointer",
            fontWeight: 700, fontSize: "0.8rem",
            letterSpacing: "0.08em", textTransform: "uppercase",
            transition: "background 200ms",
          }}>
          {submitting ? "Placing Order…" : `Place Order — $${cart.total.toFixed(2)}`}
        </button>
      </form>
    </div>
  );
}
