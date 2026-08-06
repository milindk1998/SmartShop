"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchProducts, addToCart, type Product } from "@/lib/api";

const CATEGORY_ICONS: Record<string, string> = {
  Clothing: "👕", Sports: "🏃", Bags: "🎒",
  Electronics: "⚡", "Home & Kitchen": "🏡", Wellness: "🌿",
  "Computer Components": "🖥️",
};

function isImageUrl(s: string) {
  return s.startsWith("http");
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});
  const [adding, setAdding] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const [searchMode, setSearchMode] = useState<"keyword" | "semantic">("keyword");

  // Load all products once to build category counts
  useEffect(() => {
    fetchProducts().then((all) => {
      const sorted = [...new Set(all.map((p) => p.category))].sort();
      setCategories(sorted);
      const counts: Record<string, number> = {};
      all.forEach((p) => { counts[p.category] = (counts[p.category] || 0) + 1; });
      setCategoryCounts(counts);
    }).catch(() => {});
  }, []);

  useEffect(() => { loadProducts(); }, [category, searchMode]);

  const loadProducts = async () => {
    try {
      let data: Product[];
      if (searchMode === "semantic" && search.trim()) {
        const res = await fetch(`/api/products/search/semantic?q=${encodeURIComponent(search.trim())}`);
        if (!res.ok) throw new Error("Semantic search failed");
        data = await res.json();
      } else {
        data = await fetchProducts(category || undefined, search || undefined);
      }
      setProducts(data);
    } catch { showToast("Failed to load products", false); }
  };

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };



  return (
    <div style={{ display: "flex", gap: "1.5rem", alignItems: "flex-start" }}>

      {/* ── Sidebar ─────────────────────────────────────────────────── */}
      <aside className="sidebar" style={{
        width: "210px", flexShrink: 0,
        position: "sticky", top: "4.5rem",
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "4px",
        overflow: "hidden",
        boxShadow: "var(--shadow-sm)",
      }}>
        <div style={{
          padding: "0.85rem 1rem",
          borderBottom: "1px solid var(--border)",
          background: "#fff0f3",
        }}>
          <p style={{ fontWeight: 700, fontSize: "0.75rem", color: "#ff3f6c", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Categories
          </p>
        </div>

        {/* All Products */}
        <button onClick={() => setCategory("")} style={{
          width: "100%", display: "flex", alignItems: "center", gap: "0.6rem",
          padding: "0.7rem 1rem", border: "none", cursor: "pointer", textAlign: "left",
          background: !category ? "#fff0f3" : "transparent",
          borderLeft: !category ? "3px solid #ff3f6c" : "3px solid transparent",
          transition: "all 120ms",
          textTransform: "none",
          letterSpacing: "normal",
        }}>
          <span style={{ fontSize: "1rem" }}>🏪</span>
          <span style={{
            flex: 1, fontSize: "0.82rem", fontWeight: !category ? 700 : 500,
            color: !category ? "#ff3f6c" : "var(--text)",
            textTransform: "none", letterSpacing: "normal",
          }}>All Products</span>
          <span style={{
            fontSize: "0.68rem", fontWeight: 700,
            background: !category ? "#ff3f6c" : "#f4f4f4",
            color: !category ? "white" : "var(--text-3)",
            padding: "1px 6px", borderRadius: "2px",
          }}>
            {Object.values(categoryCounts).reduce((a, b) => a + b, 0)}
          </span>
        </button>

        {/* Divider */}
        <div style={{ height: "1px", background: "var(--border)" }} />

        {/* Category buttons */}
        {categories.map((c) => (
          <button key={c} onClick={() => setCategory(c)} style={{
            width: "100%", display: "flex", alignItems: "center", gap: "0.6rem",
            padding: "0.65rem 1rem", border: "none", cursor: "pointer", textAlign: "left",
            background: category === c ? "#fff0f3" : "transparent",
            borderLeft: category === c ? "3px solid #ff3f6c" : "3px solid transparent",
            transition: "all 120ms",
            textTransform: "none",
            letterSpacing: "normal",
          }}
            onMouseEnter={(e) => {
              if (category !== c) (e.currentTarget as HTMLButtonElement).style.background = "#f9f0f3";
            }}
            onMouseLeave={(e) => {
              if (category !== c) (e.currentTarget as HTMLButtonElement).style.background = "transparent";
            }}
          >
            <span style={{ fontSize: "1rem" }}>{CATEGORY_ICONS[c] || "📦"}</span>
            <span style={{
              flex: 1, fontSize: "0.8rem", fontWeight: category === c ? 700 : 400,
              color: category === c ? "#ff3f6c" : "var(--text)",
              lineHeight: "1.3",
              textTransform: "none", letterSpacing: "normal",
            }}>{c}</span>
            <span style={{
              fontSize: "0.68rem", fontWeight: 700,
              background: category === c ? "#ff3f6c" : "#f4f4f4",
              color: category === c ? "white" : "var(--text-3)",
              padding: "1px 6px", borderRadius: "2px",
            }}>
              {categoryCounts[c] || 0}
            </span>
          </button>
        ))}
      </aside>

      {/* ── Main content ────────────────────────────────────────────── */}
      <div style={{ flex: 1, minWidth: 0 }}>

        {/* Toast */}
        {toast && (
          <div style={{
            position: "fixed", top: "5rem", right: "1.5rem", zIndex: 999,
            background: toast.ok ? "#10b981" : "#ef4444",
            color: "white", padding: "0.75rem 1.25rem",
            borderRadius: "12px", boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
            fontWeight: 500, fontSize: "0.9rem",
            animation: "slideIn 200ms ease",
          }}>
            {toast.ok ? "✅" : "⚠️"} {toast.msg}
          </div>
        )}

        {/* Hero Banner */}
        {!category && !search && (
          <div className="hero-banner" style={{ marginBottom: "1.5rem" }}>
            <div style={{ position: "relative", zIndex: 1 }}>
              <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", opacity: 0.85, marginBottom: "0.4rem" }}>Welcome to</p>
              <h1 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "2.4rem", fontWeight: 800, lineHeight: 1.1, marginBottom: "0.6rem",
                letterSpacing: "-0.01em",
              }}>Shop<span style={{ fontStyle: "italic" }}>4</span>U</h1>
              <p style={{ fontSize: "0.9rem", opacity: 0.9, marginBottom: "1.25rem", maxWidth: "340px" }}>
                Fashion, Electronics, Home & More — All in one place
              </p>
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <span style={{
                  background: "white", color: "#ff3f6c",
                  padding: "0.45rem 1.2rem", borderRadius: "4px",
                  fontWeight: 800, fontSize: "0.75rem", letterSpacing: "0.08em",
                  textTransform: "uppercase", cursor: "default",
                }}>Shop Now</span>
                <span style={{
                  background: "rgba(255,255,255,0.15)", color: "white",
                  border: "1.5px solid rgba(255,255,255,0.5)",
                  padding: "0.45rem 1.2rem", borderRadius: "4px",
                  fontWeight: 700, fontSize: "0.75rem", letterSpacing: "0.08em",
                  textTransform: "uppercase", cursor: "default",
                }}>New Arrivals</span>
              </div>
            </div>
          </div>
        )}

        {/* Section header */}
        <div style={{ marginBottom: "1rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text)", letterSpacing: "-0.01em" }}>
              {category ? `${CATEGORY_ICONS[category] || "📦"} ${category}` : "All Products"}
            </h2>
            <p style={{ color: "var(--text-2)", marginTop: "0.1rem", fontSize: "0.8rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
              {products.length} item{products.length !== 1 ? "s" : ""}
              {searchMode === "semantic" && search && (
                <span style={{
                  fontSize: "0.65rem", fontWeight: 700,
                  background: "#ff3f6c",
                  color: "white", padding: "1px 7px", borderRadius: "2px",
                  letterSpacing: "0.05em", textTransform: "uppercase",
                }}>AI Search</span>
              )}
            </p>
          </div>
        </div>

        {/* Search bar */}
        <form onSubmit={(e) => { e.preventDefault(); loadProducts(); }} style={{
          display: "flex", gap: "0.5rem", marginBottom: "1.5rem",
        }}>
          <input
            type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search${category ? ` in ${category}` : " all products"}…`}
            style={{ flex: 1, fontSize: "0.9rem" }}
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearchMode(m => m === "keyword" ? "semantic" : "keyword")}
              style={{
                padding: "0.5rem 0.9rem",
                background: searchMode === "semantic" ? "linear-gradient(135deg, #e8315a, #ff3f6c)" : "var(--surface-2)",
                color: searchMode === "semantic" ? "white" : "var(--text-2)",
                borderRadius: "20px", fontWeight: 600, fontSize: "0.78rem",
                border: `1.5px solid ${searchMode === "semantic" ? "#ff3f6c" : "var(--border)"}`,
                cursor: "pointer", whiteSpace: "nowrap",
                transition: "all 150ms",
              }}
            >
              {searchMode === "keyword" ? "🔍 Keyword" : "🧠 AI Search"}
            </button>
          )}
          <button type="submit" style={{
            padding: "0.6rem 1.4rem", background: "#ff3f6c", color: "white",
            borderRadius: "4px", fontWeight: 700, fontSize: "0.75rem",
            letterSpacing: "0.08em", textTransform: "uppercase",
            transition: "background 200ms",
          }}>Search</button>
          {search && (
            <button type="button" onClick={() => { setSearch(""); loadProducts(); }} style={{
              padding: "0.6rem 0.9rem", background: "white", color: "var(--text-2)",
              borderRadius: "4px", fontWeight: 700, fontSize: "0.75rem",
              border: "1px solid var(--border)", letterSpacing: "0.08em", textTransform: "uppercase",
            }}>Clear</button>
          )}
        </form>

        {/* Product grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "1rem",
        }}>
          {products.map((product) => {
            const isAdding = adding === `${product.id}`;
            const mrp = (product.price * 1.25).toFixed(2);
            const discount = 20;

            return (
              <div key={product.id} style={{
                background: "var(--surface)",
                border: "1px solid transparent",
                borderRadius: "4px",
                overflow: "hidden",
                boxShadow: "var(--shadow-sm)",
                transition: "box-shadow 200ms, transform 200ms, border-color 200ms",
                display: "flex", flexDirection: "column",
                cursor: "pointer",
              }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--shadow)";
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)";
                  (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--shadow-sm)";
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLDivElement).style.borderColor = "transparent";
                }}
              >
                {/* Image area */}
                <Link href={`/products/${product.id}`} style={{ display: "block", textDecoration: "none" }}>
                  <div style={{
                    background: "#f5f5f5",
                    height: "220px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "3.5rem",
                    position: "relative",
                    overflow: "hidden",
                  }}>
                    {product.image_url.startsWith("http") ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                        onError={(e) => {
                          const parent = (e.currentTarget as HTMLImageElement).parentElement!;
                          (e.currentTarget as HTMLImageElement).style.display = "none";
                          const fb = document.createElement("span");
                          fb.textContent = CATEGORY_ICONS[product.category] || "📦";
                          fb.style.fontSize = "3.5rem";
                          parent.appendChild(fb);
                        }}
                      />
                    ) : (
                      product.image_url
                    )}
                    {/* Sale badge */}
                    <span style={{
                      position: "absolute", top: "8px", left: "8px",
                      background: "#ff3f6c", color: "white",
                      padding: "2px 6px", borderRadius: "2px",
                      fontSize: "0.62rem", fontWeight: 800,
                      letterSpacing: "0.05em", textTransform: "uppercase",
                    }}>{discount}% OFF</span>
                    {product.stock > 0 && product.stock <= 5 && (
                      <span style={{
                        position: "absolute", top: "8px", right: "8px",
                        background: "#ff905a", color: "white",
                        padding: "2px 6px", borderRadius: "2px",
                        fontSize: "0.62rem", fontWeight: 800,
                        letterSpacing: "0.05em", textTransform: "uppercase",
                      }}>Only {product.stock} left</span>
                    )}
                  </div>
                </Link>

                {/* Content */}
                <div style={{ padding: "0.85rem", flex: 1, display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                  {/* Brand/Category */}
                  <p style={{ fontSize: "0.68rem", fontWeight: 700, color: "var(--text-3)", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                    {product.manufacturer || product.category}
                  </p>

                  <Link href={`/products/${product.id}`} style={{ textDecoration: "none" }}>
                    <h3 style={{ fontWeight: 500, fontSize: "0.85rem", lineHeight: "1.4", color: "var(--text)", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const }}>
                      {product.name}
                    </h3>
                  </Link>

                  {/* Rating */}
                  {product.rating > 0 && (
                    <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", marginTop: "0.2rem" }}>
                      <span style={{
                        background: "#26a541", color: "white",
                        borderRadius: "2px", padding: "1px 5px",
                        fontSize: "0.68rem", fontWeight: 700,
                        display: "flex", alignItems: "center", gap: "2px",
                      }}>{product.rating.toFixed(1)} ★</span>
                      <span style={{ fontSize: "0.68rem", color: "var(--text-3)", fontWeight: 400 }}>
                        ({product.review_count.toLocaleString()})
                      </span>
                    </div>
                  )}

                  {/* Price */}
                  <div style={{ marginTop: "0.4rem", display: "flex", alignItems: "baseline", gap: "0.4rem", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text)" }}>
                      ${product.price.toFixed(2)}
                    </span>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-3)", textDecoration: "line-through" }}>
                      ${mrp}
                    </span>
                    <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#ff905a" }}>
                      ({discount}% off)
                    </span>
                  </div>

                  {/* Action buttons */}
                  <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem" }}>
                    {product.options.length === 0 ? (
                      <button
                        onClick={() => {
                          setAdding(`${product.id}`);
                          addToCart(product.id, 1, {})
                            .then(() => { setToast({ msg: `"${product.name}" added to bag!`, ok: true }); setTimeout(() => setToast(null), 3000); })
                            .catch(() => { setToast({ msg: "Failed to add to bag", ok: false }); setTimeout(() => setToast(null), 3000); })
                            .finally(() => setAdding(null));
                        }}
                        disabled={isAdding || product.stock === 0}
                        style={{
                          flex: 1, padding: "0.55rem",
                          background: product.stock === 0 ? "#f4f4f4" : "#ff3f6c",
                          color: product.stock === 0 ? "var(--text-3)" : "white",
                          borderRadius: "4px", fontWeight: 700, fontSize: "0.72rem",
                          letterSpacing: "0.07em", textTransform: "uppercase",
                          border: "none", cursor: product.stock === 0 ? "not-allowed" : "pointer",
                          transition: "background 200ms",
                        }}
                      >
                        {isAdding ? "Adding…" : product.stock === 0 ? "Sold Out" : "Add to Bag"}
                      </button>
                    ) : (
                      <Link href={`/products/${product.id}`} style={{
                        flex: 1, textAlign: "center", padding: "0.55rem",
                        background: "#ff3f6c", color: "white",
                        borderRadius: "4px", fontWeight: 700, fontSize: "0.72rem",
                        letterSpacing: "0.07em", textTransform: "uppercase",
                      }}>Select Options</Link>
                    )}
                    <Link href={`/products/${product.id}`} style={{
                      padding: "0.55rem 0.7rem",
                      background: "white", color: "#282c3f",
                      borderRadius: "4px", fontWeight: 600, fontSize: "0.72rem",
                      border: "1px solid #d4d5d9",
                      letterSpacing: "0.05em", textTransform: "uppercase",
                      transition: "border-color 200ms",
                    }}>Details</Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {products.length === 0 && (
          <div style={{ textAlign: "center", padding: "4rem 2rem", color: "var(--text-3)" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔍</div>
            <p style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-2)", textTransform: "uppercase", letterSpacing: "0.06em" }}>No products found</p>
            <p style={{ marginTop: "0.4rem", fontSize: "0.85rem" }}>Try adjusting your search or selecting a different category</p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
