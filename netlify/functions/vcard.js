// Собирает карточку контакта (vCard) из данных визитки и отдаёт её так,
// чтобы iPhone открыл «Добавить контакт», а Android предложил сохранить.
const clean = (v) => String(v == null ? "" : v).replace(/[\r\n]+/g, " ").trim().slice(0, 300);
const esc = (v) => clean(v).replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,");
const link = (v, pre) => {
  v = clean(v);
  if (!v) return "";
  return /^https?:\/\//i.test(v) ? v : pre + v.replace(/^@/, "");
};

exports.handler = async (event) => {
  try {
    const t = (event.queryStringParameters || {}).d || "";
    if (!t || t.length > 6000) throw new Error("bad");
    const b64 = t.replace(/-/g, "+").replace(/_/g, "/");
    const o = JSON.parse(Buffer.from(b64, "base64").toString("utf8"));
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
    return { statusCode: 400, headers: { "Content-Type": "text/plain; charset=utf-8" }, body: "Некорректные данные визитки" };
  }
};
