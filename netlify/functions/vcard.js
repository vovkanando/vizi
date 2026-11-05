// Отдаёт карточку контакта (vCard) для iPhone/Android по адресу визитки (?s=имя)
// или по данным в ссылке (?d=...) для предпросмотра в кабинете.
const SB = "https://wvvtspvxlxtoetclogve.supabase.co";
const KEY = "sb_publishable_pQgpsfjZHdbpQWJwkwgZxA_CST_9goF";
const clean = (v) => String(v == null ? "" : v).replace(/[\r\n]+/g, " ").trim().slice(0, 300);
const esc = (v) => clean(v).replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,");
const link = (v, pre) => {
  v = clean(v);
  if (!v) return "";
  return /^https?:\/\//i.test(v) ? v : pre + v.replace(/^@/, "");
};

async function load(q) {
  if (q.s) {
    if (!/^[a-z0-9-]{3,32}$/.test(q.s)) throw new Error("bad slug");
    const r = await fetch(SB + "/rest/v1/rpc/get_card", {
      method: "POST",
      headers: { apikey: KEY, "Content-Type": "application/json" },
      body: JSON.stringify({ p_slug: q.s }),
    });
    const o = await r.json();
    if (!o || typeof o !== "object" || o.code || o.message) throw new Error("not found");
    return o;
  }
  const t = q.d || "";
  if (!t || t.length > 6000) throw new Error("bad");
  return JSON.parse(Buffer.from(t.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8"));
}

exports.handler = async (event) => {
  try {
    const o = await load(event.queryStringParameters || {});
    const name = clean(o.n) || "Contact";
    const L = ["BEGIN:VCARD", "VERSION:3.0", "FN:" + esc(name), "N:;" + esc(name) + ";;;"];
    if (clean(o.p)) L.push("TEL;TYPE=CELL:" + clean(o.p));
    if (clean(o.wp)) L.push("TEL;TYPE=WORK:" + clean(o.wp));
    if (clean(o.we)) L.push("EMAIL;TYPE=WORK:" + clean(o.we));
    if (clean(o.c)) L.push("ORG:" + esc(o.c));
    if (clean(o.t)) L.push("TITLE:" + esc(o.t));
    const urls = [link(o.w, "https://"), link(o.tg, "https://t.me/")];
    (Array.isArray(o.x) ? o.x.slice(0, 20) : []).forEach((r) => {
      const l = clean(r && r[2]);
      if (/^https?:\/\//i.test(l) || /^[\w-]+(\.[\w-]+)+\//.test(l)) urls.push(link(l, "https://"));
    });
    urls.filter(Boolean).forEach((u) => L.push("URL:" + u));
    L.push("END:VCARD");
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "text/vcard; charset=utf-8",
        "Content-Disposition": 'inline; filename="contact.vcf"',
        "Cache-Control": "no-store",
      },
      body: L.join("\r\n") + "\r\n",
    };
  } catch (e) {
    return { statusCode: 404, headers: { "Content-Type": "text/plain; charset=utf-8" }, body: "Визитка не найдена" };
  }
};
