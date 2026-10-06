"use client";
import { useCallback, useEffect, useState } from "react";
const blank = { name: "", category: "Men", price: 0, description: "", image_url: "", color: "#2f4a7a", stock: 0, active: true };
const ST = ["new", "confirmed", "shipped", "delivered", "cancelled"];
export default function Admin() {
  const [auth, setAuth] = useState(null), [pw, setPw] = useState(""), [msg, setMsg] = useState(""), [tab, setTab] = useState("orders");
  const [prods, setProds] = useState([]), [orders, setOrders] = useState([]), [ed, setEd] = useState(null);
  const load = useCallback(async () => {
    try {
      const [a, b] = await Promise.all([fetch("/api/admin/products"), fetch("/api/admin/orders")]);
      if (a.status === 401 || b.status === 401) { setAuth(false); return; }
      if (!a.ok || !b.ok) throw new Error("Could not load admin data. Check the server and Supabase connection, then try again.");
      const [productData, orderData] = await Promise.all([a.json(), b.json()]);
      setProds(Array.isArray(productData) ? productData : []);
      setOrders(Array.isArray(orderData) ? orderData : []);
      setMsg("");
      setAuth(true);
    } catch (error) {
      setMsg(error.message || "Could not connect to the admin service.");
      setAuth(false);
    }
  }, []);
  useEffect(() => { load(); }, [load]);
  async function login() {
    setMsg("");
    try {
      const r = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: pw }) });
      if (!r.ok) { setMsg(r.status === 401 ? "Wrong password" : "Could not sign in. Check the server and try again."); return; }
      await load();
    } catch { setMsg("Could not connect to the admin service."); }
  }
  async function save() {
    try {
      const r = await fetch("/api/admin/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(ed) });
      const d = await r.json();
      if (!r.ok) { setMsg(d.error || "Could not save this product."); return; }
      setEd(null); setMsg(""); await load();
    } catch { setMsg("Could not save this product. Check your connection and try again."); }
  }
  async function del(id) { if (confirm("Delete this product?")) { await fetch("/api/admin/products?id=" + id, { method: "DELETE" }); load(); } }
  async function status(id, s) { await fetch("/api/admin/orders", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status: s }) }); load(); }
  async function upload(e) {
    const file = e.target.files[0]; if (!file) return;
    setMsg("Uploading…"); const fd = new FormData(); fd.append("file", file);
    const r = await fetch("/api/admin/upload", { method: "POST", body: fd }), d = await r.json();
    if (!r.ok) return setMsg(d.error); setMsg(""); setEd((x) => ({ ...x, image_url: d.url }));
  }
  async function out() { await fetch("/api/admin/login", { method: "DELETE" }); setAuth(false); }
  if (auth === null) return <main className="adm"><p>Loading…</p></main>;
  if (!auth) return <main className="adm" style={{ maxWidth: 380 }}><h2>Admin login</h2><input type="password" placeholder="Password" value={pw} onChange={(e) => setPw(e.target.value)} onKeyDown={(e) => e.key === "Enter" && login()} /><p className="err" role="alert">{msg}</p><button className="cta" onClick={login}>Log in</button>{msg.startsWith("Could not") && <button className="add" onClick={load}>Retry connection</button>}</main>;
  const set = (k) => (e) => setEd({ ...ed, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value });
  return <main className="adm">
    <div className="bar"><h2>Sora Store admin</h2><div className="tabs">{["orders", "products"].map((t) => <button key={t} aria-pressed={tab === t} onClick={() => setTab(t)}>{t === "orders" ? `Orders (${orders.filter((o) => o.status === "new").length} new)` : "Products"}</button>)}<button onClick={out}>Log out</button></div></div>
    {tab === "orders" && (orders.length ? orders.map((o) => <div className="card pad" key={o.id}><div className="row"><b>{o.order_no}</b><select value={o.status} onChange={(e) => status(o.id, e.target.value)} style={{ width: "auto" }}>{ST.map((s) => <option key={s}>{s}</option>)}</select></div>
      <p>{o.name} · <a href={"tel:" + o.phone}>{o.phone}</a><br />{o.address} ({o.area})</p><ul>{o.items.map((l, i) => <li key={i}>{l.qty} x {l.name} ({l.size}) – ৳{l.qty * l.price}</li>)}</ul>
      <p><b>Total ৳{o.total}</b> (delivery ৳{o.delivery}) · {o.payment === "cod" ? "Cash on delivery" : `${o.payment} TrxID ${o.trx_id}`} · {new Date(o.created_at).toLocaleString()}</p></div>) : <p className="empty">No orders yet.</p>)}
    {tab === "products" && <>
      <button className="cta" onClick={() => setEd({ ...blank })}>Add product</button>
      {ed && <div className="card pad" style={{ margin: "16px 0" }}><input placeholder="Name" value={ed.name} onChange={set("name")} />
        <select value={ed.category} onChange={set("category")}><option>Men</option><option>Women</option><option>Kids</option></select>
        <input type="number" placeholder="Price (৳)" value={ed.price} onChange={set("price")} /><input type="number" placeholder="Stock" value={ed.stock} onChange={set("stock")} />
        <label>Photo (JPG, PNG, WebP, max 3 MB) <input type="file" accept="image/jpeg,image/png,image/webp" onChange={upload} /></label>{ed.image_url && <img src={ed.image_url} alt="Preview" width="120" height="120" style={{ objectFit: "cover", borderRadius: 10 }} />}
        <input placeholder="Image URL (optional)" value={ed.image_url} onChange={set("image_url")} /><label>Placeholder color <input type="color" value={ed.color} onChange={set("color")} /></label>
        <textarea rows="2" placeholder="Description" value={ed.description} onChange={set("description")} /><label><input type="checkbox" checked={ed.active} onChange={set("active")} style={{ width: "auto" }} /> Show in store</label>
        <p className="err">{msg}</p><button className="cta" onClick={save}>Save product</button> <button className="add" onClick={() => setEd(null)}>Cancel</button></div>}
      <div className="grid" style={{ marginTop: 16 }}>{prods.map((p) => <div className="card pad" key={p.id}><b>{p.name}</b><small>{p.category} · ৳{p.price} · stock {p.stock}{p.active ? "" : " · hidden"}</small>
        <div className="row"><button className="add" onClick={() => setEd(p)}>Edit</button><button className="add" onClick={() => del(p.id)}>Delete</button></div></div>)}</div></>}
  </main>;
}
