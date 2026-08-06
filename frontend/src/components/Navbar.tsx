"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchCart } from "@/lib/api";

export default function Navbar() {
  const [cartCount, setCartCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const load = async () => {
      try {
        const cart = await fetchCart();
        setCartCount(cart.items.reduce((s, i) => s + i.quantity, 0));
      } catch {}
    };
    load();
    const id = setInterval(load, 4000);
    window.addEventListener("cart-updated", load);
    return () => {
      clearInterval(id);
      window.removeEventListener("cart-updated", load);
    };
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLink = (href: string, label: string) => {
    const active = pathname === href;
    return (
      <Link href={href} style={{
        color: active ? "#ff3f6c" : "#282c3f",
        fontWeight: 700,
        fontSize: "0.78rem",
        letterSpacing: "0.07em",
        textTransform: "uppercase",
        padding: "0.35rem 0",
        borderBottom: active ? "2px solid #ff3f6c" : "2px solid transparent",
        transition: "color 200ms, border-color 200ms",
      }}
        onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLAnchorElement).style.color = "#ff3f6c"; }}
        onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLAnchorElement).style.color = "#282c3f"; }}
      >
        {label}
      </Link>
    );
  };

  return (
    <nav style={{
      background: "#ffffff",
      borderBottom: scrolled ? "1px solid #d4d5d9" : "1px solid #f0f0f0",
      padding: "0 2.5rem",
      height: "60px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      position: "sticky",
      top: 0,
      zIndex: 100,
      boxShadow: scrolled ? "0 2px 8px rgba(0,0,0,0.1)" : "none",
      transition: "box-shadow 200ms, border-color 200ms",
    }}>
      {/* Logo */}
      <Link href="/" style={{
        display: "flex", alignItems: "center", gap: "0.4rem",
        fontFamily: "'Playfair Display', serif",
        color: "#ff3f6c",
        fontWeight: 800,
        fontSize: "1.6rem",
        letterSpacing: "-0.02em",
        userSelect: "none",
      }}>
        Shop<span style={{ color: "#282c3f" }}>4</span><span style={{ color: "#ff3f6c" }}>U</span>
      </Link>

      {/* Nav links */}
      <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
        {navLink("/", "Shop")}
        {navLink("/orders", "Orders")}
      </div>

      {/* Cart */}
      <Link href="/cart" style={{
        display: "flex", alignItems: "center", gap: "0.5rem",
        background: cartCount > 0 ? "#ff3f6c" : "transparent",
        border: `1.5px solid ${cartCount > 0 ? "#ff3f6c" : "#d4d5d9"}`,
        color: cartCount > 0 ? "white" : "#282c3f",
        padding: "0.45rem 1.1rem",
        borderRadius: "4px",
        fontWeight: 700,
        fontSize: "0.75rem",
        letterSpacing: "0.07em",
        textTransform: "uppercase",
        transition: "all 200ms",
      }}
        onMouseEnter={(e) => {
          if (cartCount === 0) {
            (e.currentTarget as HTMLAnchorElement).style.borderColor = "#ff3f6c";
            (e.currentTarget as HTMLAnchorElement).style.color = "#ff3f6c";
          }
        }}
        onMouseLeave={(e) => {
          if (cartCount === 0) {
            (e.currentTarget as HTMLAnchorElement).style.borderColor = "#d4d5d9";
            (e.currentTarget as HTMLAnchorElement).style.color = "#282c3f";
          }
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <path d="M16 10a4 4 0 01-8 0"/>
        </svg>
        Bag
        {cartCount > 0 && (
          <span style={{
            background: "white",
            color: "#ff3f6c",
            borderRadius: "50%",
            minWidth: "18px", height: "18px",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "0.7rem", fontWeight: 800, padding: "0 3px",
          }}>{cartCount}</span>
        )}
      </Link>
    </nav>
  );
}
