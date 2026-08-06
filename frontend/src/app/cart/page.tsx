"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchCart, updateCartItem, removeFromCart, type Cart } from "@/lib/api";

export default function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCart();
    window.addEventListener("cart-updated", loadCart);
    return () => window.removeEventListener("cart-updated", loadCart);
  }, []);

  const loadCart = async () => {
    try { setCart(await fetchCart()); }
    catch { console.error("Failed to load cart"); }
    finally { setLoading(false); }
  };

  const handleUpdateQuantity = async (productId: number, quantity: number) => {
    if (quantity < 0) return;
    try { setCart(await updateCartItem(productId, quantity)); }
    catch { console.error("Failed to update quantity"); }
  };

  const handleRemove = async (productId: number) => {
    try { setCart(await removeFromCart(productId)); }
    catch { console.error("Failed to remove item"); }
  };

  if (loading) return (
    <div style={{ textAlign: "center", padding: "4rem", color: "var(--text-2)" }}>
      <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>�️</div>Loading your bag…
    </div>
  );

  return (
    <div style={{ maxWidth: "920px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.2rem", letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--text)" }}>
        My Bag
      </h1>
      {cart?.items.length ? (
        <p style={{ color: "var(--text-2)", marginBottom: "1.75rem", fontSize: "0.9rem" }}>
          {cart.items.reduce((s, i) => s + i.quantity, 0)} item{cart.items.length !== 1 ? "s" : ""}
        </p>
      ) : null}

      {!cart?.items.length ? (
        <div style={{
          textAlign: "center", padding: "4rem",
          background: "var(--surface)",
          borderRadius: "4px", border: "1px solid var(--border)",
        }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🛍️</div>
          <p style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-2)", marginBottom: "0.3rem", letterSpacing: "0.04em", textTransform: "uppercase" }}>
            Your bag is empty
          </p>
          <p style={{ fontSize: "0.82rem", color: "var(--text-3)", marginBottom: "1.5rem" }}>Looks like you haven&apos;t added anything yet</p>
          <Link href="/" style={{
            padding: "0.65rem 2rem", background: "#ff3f6c", color: "white",
            borderRadius: "4px", fontWeight: 700, fontSize: "0.75rem",
            letterSpacing: "0.08em", textTransform: "uppercase",
            display: "inline-block",
          }}>Continue Shopping</Link>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "1.5rem", alignItems: "start" }}>
          {/* Items */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {cart.items.map((item) => (
              <div key={item.id} style={{
                display: "flex", gap: "1rem", padding: "1.1rem",
                background: "var(--surface)", border: "1px solid var(--border)",
                borderRadius: "4px",
                alignItems: "flex-start",
              }}>
                {/* Product image */}
                <div style={{
                  width: "85px", height: "100px", borderRadius: "4px", flexShrink: 0,
                  background: "#f5f5f5",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem",
                  overflow: "hidden",
                }}>
                  {item.product.image_url?.startsWith("http") ? (
                    <img
                      src={item.product.image_url}
                      alt={item.product.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = "none";
                        (e.currentTarget as HTMLImageElement).parentElement!.textContent = "📦";
                      }}
                    />
                  ) : (
                    item.product.image_url || "📦"
                  )}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: "0.25rem" }}>
                    {item.product.name}
                  </h3>
                  {/* Selected options badges */}
                  {item.selected_options && Object.keys(item.selected_options).length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem", marginBottom: "0.5rem" }}>
                      {Object.entries(item.selected_options).map(([k, v]) => (
                        <span key={k} style={{
                          background: "#fff0f3", color: "#ff3f6c",
                          border: "1px solid rgba(255,63,108,0.2)",
                          borderRadius: "2px", padding: "2px 8px", fontSize: "0.68rem", fontWeight: 600,
                          textTransform: "uppercase", letterSpacing: "0.04em",
                        }}>{k}: {v}</span>
                      ))}
                    </div>
                  )}
                  <p style={{ color: "#ff3f6c", fontWeight: 700, fontSize: "1rem" }}>
                    ${item.product.price.toFixed(2)}
                  </p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.75rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <button onClick={() => handleUpdateQuantity(item.product_id, item.quantity - 1)}
                      style={{
                        width: "28px", height: "28px", borderRadius: "2px",
                        background: "white", border: "1px solid var(--border)",
                        fontWeight: 700, fontSize: "1rem", color: "var(--text-2)",
                        textTransform: "none", letterSpacing: "normal",
                      }}>−</button>
                    <span style={{ minWidth: "1.8rem", textAlign: "center", fontWeight: 700, fontSize: "0.9rem" }}>
                      {item.quantity}
                    </span>
                    <button onClick={() => handleUpdateQuantity(item.product_id, item.quantity + 1)}
                      style={{
                        width: "28px", height: "28px", borderRadius: "2px",
                        background: "white", border: "1px solid var(--border)",
                        fontWeight: 700, fontSize: "1rem", color: "var(--text-2)",
                        textTransform: "none", letterSpacing: "normal",
                      }}>+</button>
                  </div>
                  <span style={{ fontWeight: 800, color: "var(--text)", fontSize: "0.95rem" }}>
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                  <button onClick={() => handleRemove(item.product_id)}
                    style={{
                      background: "none", border: "none", color: "var(--text-3)",
                      fontSize: "0.8rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.2rem",
                    }}>
                    🗑 Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order summary */}
          <div style={{
            background: "var(--surface)", border: "1px solid var(--border)",
            borderRadius: "4px", padding: "1.25rem",
            position: "sticky", top: "76px",
          }}>
            <h2 style={{ fontWeight: 700, marginBottom: "1rem", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--text-3)" }}>Price Details</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", marginBottom: "1rem" }}>
              {cart.items.map((item) => (
                <div key={item.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem" }}>
                  <span style={{ color: "var(--text-2)" }}>{item.product.name} × {item.quantity}</span>
                  <span style={{ fontWeight: 600 }}>${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div style={{ borderTop: "1px solid var(--border)", paddingTop: "0.85rem", marginBottom: "1rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: "1rem" }}>
                <span>Total Amount</span>
                <span style={{ color: "var(--text)" }}>${cart.total.toFixed(2)}</span>
              </div>
            </div>
            <Link href="/checkout" style={{
              display: "block", textAlign: "center", padding: "0.8rem",
              background: "#ff3f6c", color: "white",
              borderRadius: "4px", fontWeight: 700, fontSize: "0.78rem",
              letterSpacing: "0.08em", textTransform: "uppercase",
            }}>
              Place Order
            </Link>
            <Link href="/" style={{
              display: "block", textAlign: "center", padding: "0.6rem",
              color: "var(--text-3)", fontSize: "0.78rem", marginTop: "0.75rem",
              letterSpacing: "0.04em", textTransform: "uppercase", fontWeight: 600,
            }}>
              Continue Shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
