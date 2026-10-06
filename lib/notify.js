// Optional: emails the store owner on every new order via Resend. Does nothing if env vars are missing.
export async function notifyOrder(o) {
  const { RESEND_API_KEY: key, NOTIFY_EMAIL: to } = process.env;
  if (!key || !to) return;
  const from = process.env.FROM_EMAIL || "Nam Sora Store <onboarding@resend.dev>";
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const html = `<h2>New order ${esc(o.order_no)}</h2><p>${esc(o.name)} · ${esc(o.phone)}<br>${esc(o.address)} (${esc(o.area)})</p><ul>` +
    o.items.map((l) => `<li>${l.qty} x ${esc(l.name)} (${esc(l.size)}) = ৳${l.qty * l.price}</li>`).join("") +
    `</ul><p>Delivery ৳${o.delivery} · <b>Total ৳${o.total}</b> ${o.payment === "cod" ? "(Cash on delivery)" : `(Paid by ${esc(o.payment)}, TrxID ${esc(o.trx_id)}, please verify)`}</p>`;
  try {
    await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [to], subject: `New order ${o.order_no} – ৳${o.total}`, html }) });
  } catch (e) { /* never block the order */ }
}
