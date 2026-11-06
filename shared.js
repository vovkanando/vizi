var CFG={SB:"https://wvvtspvxlxtoetclogve.supabase.co",KEY:"sb_publishable_pQgpsfjZHdbpQWJwkwgZxA_CST_9goF"};
var T={ru:{c:"Контакты",wc:"Рабочие контакты",p:"Телефон",co:"Компания",ti:"Должность",wp:"Рабочий телефон",we:"Рабочая почта",ex:"Дополнительно",sv:"Сохранить в контакты",sh:"Поделиться",ok:"Скопировано",cl:"Закрыть",lk:"Ссылка на визитку:",cp:"Скопировать"},
en:{c:"Contacts",wc:"Work contacts",p:"Phone",co:"Company",ti:"Position",wp:"Work phone",we:"Work email",ex:"More",sv:"Save to contacts",sh:"Share",ok:"Copied",cl:"Close",lk:"Card link:",cp:"Copy"}};
var lang="ru";
function $(i){return document.getElementById(i)}
function esc(s){var d=document.createElement("div");d.textContent=s==null?"":s;return d.innerHTML.replace(/"/g,"&quot;")}
function bl(h){return h?' target="_blank" rel="noopener"':""}
function okPh(p){return typeof p==="string"&&p.length<400000&&/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+\/=]+$/.test(p)}
function url(v,pre){v=(v||"").trim();if(!v)return"";return/^https?:\/\//i.test(v)?v:pre+v.replace(/^@/,"")}
function b64u(str){return btoa(unescape(encodeURIComponent(str))).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}
function modal(h){var m=$("m");if(!m){m=document.createElement("div");m.id="m";m.className="modal";m.innerHTML='<div class="mbox" id="mb"></div>';document.body.appendChild(m);m.onclick=function(e){if(e.target===m)m.classList.remove("on")}}
  $("mb").innerHTML=h+'<button class="btn" id="mx">'+T[lang].cl+'</button>';m.classList.add("on");$("mx").onclick=function(){m.classList.remove("on")}}
function showQR(u){try{var q=qrcode(0,"M");q.addData(u);q.make();modal(q.createSvgTag({cellSize:4,margin:2,scalable:true}))}catch(e){modal("<p>Не удалось построить QR-код.</p>")}}
function copy(txt,btn){function ok(){if(btn){var o=btn.textContent;btn.textContent=T[lang].ok;setTimeout(function(){btn.textContent=o},1400)}}
  function fb(){var a=document.createElement("textarea");a.value=txt;document.body.appendChild(a);a.select();try{document.execCommand("copy");ok()}catch(e){}a.remove()}
  if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(txt).then(ok,fb)}else fb()}
function share(u){var f=function(){modal('<p class="hint">'+T[lang].lk+'</p><pre>'+esc(u)+'</pre><button class="btn blue" id="vc">'+T[lang].cp+'</button>');$("vc").onclick=function(){copy(u,this)}};
  if(navigator.share){navigator.share({url:u}).catch(function(e){if(!e||e.name!=="AbortError")f()})}else f()}
function vcf(d){var L=["BEGIN:VCARD","VERSION:3.0","FN:"+d.n,"N:;"+d.n+";;;"];
  if(d.p)L.push("TEL;TYPE=CELL:"+d.p);if(d.wp)L.push("TEL;TYPE=WORK:"+d.wp);if(d.we)L.push("EMAIL;TYPE=WORK:"+d.we);
  if(d.c)L.push("ORG:"+d.c);if(d.t)L.push("TITLE:"+d.t);if(d.w)L.push("URL:"+url(d.w,"https://"));var g=url(d.tg,"https://t.me/");if(g)L.push("URL:"+g);var ii=url(d.ig,"https://instagram.com/");if(ii)L.push("URL:"+ii);
  (d.x||[]).forEach(function(r){var l=(r[2]||"").trim();if(/^https?:\/\//i.test(l)||/^[\w-]+(\.[\w-]+)+\//.test(l))L.push("URL:"+url(l,"https://"))});L.push("END:VCARD");return L.join("\r\n")}
function vinfo(d,slug){var ua=navigator.userAgent,e=encodeURIComponent,ios=/iP(hone|ad|od)/.test(ua)||(navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1);
  if(/Android/i.test(ua)){var ph=[d.p,d.wp].map(function(v){return(v||"").replace(/[^+\d]/g,"")}).filter(Boolean);
    return{h:"intent:#Intent;action=android.intent.action.INSERT;type=vnd.android.cursor.dir/contact;S.name="+e(d.n||"")+";S.phone="+e(ph[0]||"")+(ph[1]?";S.secondary_phone="+e(ph[1]):"")+";S.email="+e((d.we||"").trim())+";S.company="+e(d.c||"")+";S.job_title="+e(d.t||"")+";end",a:""}}
  if(ios){var q={n:d.n,p:d.p,c:d.c,t:d.t,wp:d.wp,we:d.we,w:d.w,tg:d.tg,ig:d.ig,x:d.x};return{h:slug?"/vcard.vcf?s="+e(slug):"/vcard.vcf?d="+b64u(JSON.stringify(q)),a:""}}
  return{h:"data:text/vcard;charset=utf-8,"+e(vcf(d)),a:' download="'+esc((d.n||"contact").replace(/[^\w\u0400-\u04FF-]+/g,"_"))+'.vcf"'}}
function renderCard(d,slug,el){
  var t=T[lang],h="",vi=vinfo(d,slug),pl=slug?location.origin+"/c/"+slug:location.href;
  var tg=url(d.tg,"https://t.me/"),ig=url(d.ig,"https://instagram.com/"),web=url(d.w,"https://"),ol=url(d.ol,"https://");
  function fld(l,v,href){return v?'<div class="f"><small>'+esc(l)+'</small>'+(href?'<a href="'+esc(href)+'"'+bl(href)+'>'+esc(v)+'</a>':'<span>'+esc(v)+'</span>')+'</div>':""}
  var ini=(d.n||"?").trim().charAt(0).toUpperCase();
  h+='<div class="top"><div class="bar"><select id="lg" aria-label="Language"><option value="ru">RU</option><option value="en">EN</option></select></div>';
  h+='<div class="who"><div class="ava">'+(okPh(d.ph)?'<img alt="" src="'+esc(d.ph)+'">':esc(ini))+'</div><b>'+esc(d.n)+'</b></div>';
  h+='<div class="cb"><a class="btn" id="sv" style="display:grid;place-items:center;text-decoration:none" href="'+esc(vi.h)+'"'+vi.a+'>'+t.sv+'</a><button class="btn qrb" id="qb" aria-label="QR"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M14 14h3v3h-3zM20 14v7M14 20h3"/></svg></button></div>';
  if(ol)h+='<div class="cb"><a class="btn blue" style="display:grid;place-items:center;text-decoration:none;height:56px" href="'+esc(ol)+'"'+bl(ol)+'>'+esc(d.ob||"Подробнее")+'</a></div>';
  if(tg||ig){h+='<div class="soc">';if(tg)h+='<a href="'+esc(tg)+'"'+bl(tg)+'><i class="dot"></i>Telegram</a>';if(ig)h+='<a href="'+esc(ig)+'"'+bl(ig)+'><i class="dot ig"></i>Instagram</a>';h+='</div>'}
  h+='</div><div class="body">';
  if(d.p)h+='<h3>'+t.c+'</h3>'+fld(t.p,d.p,"tel:"+d.p.replace(/[^+\d]/g,""));
  if(d.c||d.t||d.wp||d.we)h+='<h3>'+t.wc+'</h3>'+fld(t.co,d.c)+fld(t.ti,d.t)+fld(t.wp,d.wp,d.wp?"tel:"+d.wp.replace(/[^+\d]/g,""):"")+fld(t.we,d.we,d.we?"mailto:"+d.we:"");
  if(d.x&&d.x.length){h+='<h3>'+t.ex+'</h3>';d.x.forEach(function(r){var l=r[2]||"",hr=l?(/^(https?:|tel:|mailto:)/i.test(l)?l:(/^[\w.+-]+@[\w-]+\.[\w.]+$/.test(l)?"mailto:"+l:"https://"+l)):"";h+=fld(r[0],r[1]||l,hr)})}
  if(web)h+='<a class="web" href="'+esc(web)+'"'+bl(web)+'><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.6"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2c3 3 3 17 0 20M12 2c-3 3-3 17 0 20"/></svg>'+esc(web.replace(/^https?:\/\//,"").replace(/\/$/,""))+'</a><br>';
  h+='<button class="btn share" id="sh">'+t.sh+'</button></div>';
  el.innerHTML=h;var lg=el.querySelector("#lg");lg.value=lang;
  lg.onchange=function(){lang=this.value;renderCard(d,slug,el)};
  el.querySelector("#sh").onclick=function(){share(pl)};
  el.querySelector("#qb").onclick=function(){showQR(pl)};
}
