import Script from 'next/script';

const css = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,200;0,9..144,300;1,9..144,200;1,9..144,300&family=Geist:wght@200;300;400;500;600&family=Geist+Mono:wght@300;400&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{
  --ink:#080809;--ink-2:#16161a;--ink-soft:#5c5c6b;--ink-muted:#9898a8;
  --surface:#f7f6f3;--surface-2:#f0ede6;--surface-3:#e5e1d8;--white:#ffffff;
  --sage:#3d6b4f;--sage-mid:#5a8c6a;--sage-light:#b8d4c0;--sage-muted:#eaf2ec;
  --gold:#9c7a3c;--gold-light:#e8d4aa;--gold-muted:#faf3e4;
  --slate:#2d4f72;--slate-light:#b4c8de;--slate-muted:#eaf0f8;
  --line:rgba(8,8,9,0.07);--line-med:rgba(8,8,9,0.11);
  --shadow-xs:0 1px 4px rgba(8,8,9,0.05),0 1px 2px rgba(8,8,9,0.03);
  --shadow-sm:0 4px 20px rgba(8,8,9,0.06),0 2px 6px rgba(8,8,9,0.04);
  --shadow-md:0 16px 48px rgba(8,8,9,0.09),0 4px 14px rgba(8,8,9,0.05);
  --shadow-lg:0 32px 80px rgba(8,8,9,0.12),0 8px 24px rgba(8,8,9,0.06);
  --r:14px;--r-sm:10px;--r-xs:6px;
  --ff:'Geist',system-ui,sans-serif;--ff-d:'Fraunces',Georgia,serif;--ff-m:'Geist Mono',monospace;
  --ease:cubic-bezier(0.16,1,0.3,1);
}
html{scroll-behavior:smooth;}
body{font-family:var(--ff);background:var(--white);color:var(--ink);-webkit-font-smoothing:antialiased;overflow-x:hidden;}
::-webkit-scrollbar{width:5px;}::-webkit-scrollbar-track{background:transparent;}::-webkit-scrollbar-thumb{background:var(--surface-3);border-radius:99px;}
nav{position:fixed;top:0;left:0;right:0;z-index:300;height:62px;display:flex;align-items:center;justify-content:space-between;padding:0 52px;background:rgba(255,255,255,0.88);backdrop-filter:blur(28px) saturate(200%);-webkit-backdrop-filter:blur(28px) saturate(200%);border-bottom:1px solid rgba(8,8,9,0.06);transition:box-shadow .3s;}
nav.scrolled{box-shadow:0 2px 20px rgba(8,8,9,0.06);}
.logo{display:flex;align-items:center;gap:9px;text-decoration:none;}
.logo-mark{width:30px;height:30px;border-radius:8px;background:var(--ink);display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.logo-text{font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:16px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:var(--ink);}
.nav-links{display:flex;gap:4px;}
.nav-a{font-size:13.5px;font-weight:300;color:var(--ink-soft);text-decoration:none;padding:7px 15px;border-radius:var(--r-xs);transition:background .18s,color .18s;letter-spacing:.01em;}
.nav-a:hover{background:var(--surface);color:var(--ink);}
.nav-r{display:flex;align-items:center;gap:8px;}
.btn-ghost{font-family:var(--ff);font-size:13.5px;font-weight:400;color:var(--ink-soft);text-decoration:none;padding:8px 18px;border-radius:var(--r-xs);border:1px solid var(--line-med);transition:all .18s;letter-spacing:.01em;}
.btn-ghost:hover{background:var(--surface);color:var(--ink);border-color:var(--surface-3);}
.btn-dark{font-family:var(--ff);font-size:13.5px;font-weight:500;color:var(--white);background:var(--ink);text-decoration:none;padding:9px 22px;border-radius:var(--r-xs);letter-spacing:.01em;box-shadow:0 2px 10px rgba(8,8,9,0.2);transition:transform .2s var(--ease),box-shadow .2s,opacity .2s;}
.btn-dark:hover{transform:translateY(-1px);box-shadow:0 4px 18px rgba(8,8,9,0.26);}
.hero{position:relative;min-height:100vh;display:flex;flex-direction:column;justify-content:center;overflow:hidden;background:var(--white);}
.hero-img-wrap{position:absolute;inset:0;z-index:0;}
.hero-img-wrap img{width:100%;height:100%;object-fit:cover;transform:scale(1.04);animation:zoomOut 12s var(--ease) forwards;}
@keyframes zoomOut{from{transform:scale(1.04);}to{transform:scale(1.0);}}
.hero-scrim{position:absolute;inset:0;z-index:1;background:linear-gradient(105deg,rgba(8,8,9,0.72) 0%,rgba(8,8,9,0.45) 48%,rgba(8,8,9,0.12) 100%);}
.hero-scrim-bottom{position:absolute;bottom:0;left:0;right:0;height:200px;z-index:2;background:linear-gradient(to top,var(--white) 0%,transparent 100%);}
.hero-inner{position:relative;z-index:3;padding:0 52px;max-width:780px;padding-top:100px;padding-bottom:100px;}
.hero-badge{display:inline-flex;align-items:center;gap:9px;background:rgba(255,255,255,0.12);border:1px solid rgba(255,255,255,0.2);backdrop-filter:blur(12px);padding:6px 16px 6px 10px;border-radius:99px;margin-bottom:36px;opacity:0;animation:fadeUp .9s var(--ease) .1s forwards;}
.badge-live{width:7px;height:7px;border-radius:50%;background:#4ade80;box-shadow:0 0 0 3px rgba(74,222,128,.22);animation:blink 2.4s ease infinite;}
@keyframes blink{0%,100%{box-shadow:0 0 0 3px rgba(74,222,128,.22);}50%{box-shadow:0 0 0 6px rgba(74,222,128,.09);}}
.badge-txt{font-size:12px;font-weight:400;color:rgba(255,255,255,.8);letter-spacing:.04em;}
.hero-h1{font-family:var(--ff-d);font-size:clamp(54px,7vw,96px);font-weight:200;line-height:1.03;letter-spacing:-0.03em;color:var(--white);opacity:0;animation:fadeUp .95s var(--ease) .22s forwards;}
.hero-h1 em{font-style:italic;font-weight:200;color:rgba(255,255,255,.65);}
.hero-sub{margin-top:28px;font-size:18px;font-weight:300;line-height:1.72;color:rgba(255,255,255,.58);max-width:480px;opacity:0;animation:fadeUp .95s var(--ease) .38s forwards;}
.hero-actions{margin-top:48px;display:flex;gap:14px;align-items:center;flex-wrap:wrap;opacity:0;animation:fadeUp .95s var(--ease) .52s forwards;}
.btn-hero-white{font-family:var(--ff);font-size:15px;font-weight:500;color:var(--ink);background:var(--white);padding:15px 34px;border-radius:var(--r-sm);border:none;text-decoration:none;letter-spacing:.01em;box-shadow:0 4px 24px rgba(8,8,9,0.2);transition:transform .22s var(--ease),box-shadow .22s;display:inline-flex;align-items:center;gap:8px;}
.btn-hero-white:hover{transform:translateY(-2px);box-shadow:0 8px 36px rgba(8,8,9,0.28);}
.btn-hero-outline{font-family:var(--ff);font-size:15px;font-weight:400;color:rgba(255,255,255,.82);background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.22);backdrop-filter:blur(12px);padding:15px 28px;border-radius:var(--r-sm);text-decoration:none;letter-spacing:.01em;transition:all .22s;display:inline-flex;align-items:center;gap:8px;}
.btn-hero-outline:hover{background:rgba(255,255,255,.18);border-color:rgba(255,255,255,.38);color:var(--white);}
.hero-stats{position:absolute;bottom:52px;right:52px;z-index:3;display:flex;gap:48px;opacity:0;animation:fadeUp .95s var(--ease) .65s forwards;}
.hs-item{text-align:right;}
.hs-num{font-family:var(--ff-d);font-size:40px;font-weight:200;letter-spacing:-0.04em;color:var(--white);line-height:1;}
.hs-label{font-family:var(--ff-m);font-size:10.5px;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,.35);margin-top:5px;}
.cards-row{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--line);border-top:1px solid var(--line);border-bottom:1px solid var(--line);}
.vcard{background:var(--white);padding:52px 44px;position:relative;overflow:hidden;transition:background .3s var(--ease);cursor:default;}
.vcard::after{content:'';position:absolute;inset:0;background:linear-gradient(135deg,transparent 60%,rgba(8,8,9,0.025));opacity:0;transition:opacity .3s;}
.vcard:hover{background:var(--surface);}
.vcard:hover::after{opacity:1;}
.vc-num{font-family:var(--ff-m);font-size:10.5px;letter-spacing:.15em;text-transform:uppercase;color:var(--ink-muted);margin-bottom:32px;}
.vc-icon{width:52px;height:52px;border-radius:12px;margin-bottom:28px;display:flex;align-items:center;justify-content:center;border:1px solid;transition:transform .3s var(--ease),box-shadow .3s;}
.vcard:hover .vc-icon{transform:scale(1.07) rotate(-3deg);box-shadow:var(--shadow-sm);}
.ic-sage{background:var(--sage-muted);border-color:rgba(61,107,79,.14);}
.ic-gold{background:var(--gold-muted);border-color:rgba(156,122,60,.14);}
.ic-slate{background:var(--slate-muted);border-color:rgba(45,79,114,.14);}
.vc-title{font-family:var(--ff-d);font-size:22px;font-weight:300;letter-spacing:-0.02em;color:var(--ink);margin-bottom:12px;line-height:1.15;}
.vc-desc{font-size:14px;font-weight:300;line-height:1.72;color:var(--ink-soft);}
.vc-arrow{position:absolute;bottom:36px;right:36px;width:32px;height:32px;border-radius:50%;border:1px solid var(--line-med);display:flex;align-items:center;justify-content:center;color:var(--ink-muted);transition:all .25s var(--ease);}
.vcard:hover .vc-arrow{background:var(--ink);border-color:var(--ink);color:var(--white);transform:rotate(-45deg);}
.sec{padding:130px 52px;}
.sec-label{display:flex;align-items:center;gap:14px;margin-bottom:72px;}
.sec-chip{font-family:var(--ff-m);font-size:10.5px;letter-spacing:.15em;text-transform:uppercase;color:var(--ink-muted);border:1px solid var(--line-med);padding:6px 14px;border-radius:99px;white-space:nowrap;}
.sec-rule{flex:1;height:1px;background:var(--line);}
.sec-h2{font-family:var(--ff-d);font-size:clamp(40px,4.5vw,64px);font-weight:200;letter-spacing:-0.03em;line-height:1.07;color:var(--ink);}
.sec-h2 em{font-style:italic;}
.problem-sec{background:var(--white);border-bottom:1px solid var(--line);}
.problem-grid{display:grid;grid-template-columns:5fr 6fr;gap:80px;align-items:start;}
.prob-left .sec-h2{margin-bottom:24px;}
.prob-left p{font-size:16.5px;font-weight:300;line-height:1.75;color:var(--ink-soft);}
.prob-cards{display:flex;flex-direction:column;gap:12px;}
.pcard{display:flex;gap:20px;align-items:flex-start;padding:24px 26px;border-radius:var(--r);border:1px solid var(--line);background:var(--surface);transition:all .28s var(--ease);box-shadow:var(--shadow-xs);}
.pcard:hover{background:var(--white);box-shadow:var(--shadow-sm);transform:translateX(5px);}
.pcard-icon{width:40px;height:40px;border-radius:10px;flex-shrink:0;display:flex;align-items:center;justify-content:center;border:1px solid;}
.pci-red{background:rgba(192,80,60,.06);border-color:rgba(192,80,60,.14);}
.pci-gold{background:var(--gold-muted);border-color:rgba(156,122,60,.14);}
.pci-slate{background:var(--slate-muted);border-color:rgba(45,79,114,.14);}
.pcard-title{font-size:15px;font-weight:500;color:var(--ink);margin-bottom:5px;letter-spacing:-0.01em;}
.pcard-desc{font-size:13.5px;font-weight:300;color:var(--ink-soft);line-height:1.6;}
.photo-break{height:620px;position:relative;overflow:hidden;background:var(--ink-2);}
.photo-break img{width:100%;height:100%;object-fit:cover;opacity:.62;transition:transform 8s linear,opacity .6s;}
.photo-break:hover img{opacity:.72;}
.photo-break-scrim{position:absolute;inset:0;background:linear-gradient(to right,rgba(8,8,9,.68) 0%,transparent 55%);}
.photo-break-content{position:absolute;inset:0;z-index:2;display:flex;flex-direction:column;justify-content:center;padding:80px;}
.pbc-tag{font-family:var(--ff-m);font-size:10.5px;letter-spacing:.15em;text-transform:uppercase;color:rgba(255,255,255,.35);margin-bottom:20px;}
.pbc-h2{font-family:var(--ff-d);font-size:clamp(40px,5vw,68px);font-weight:200;letter-spacing:-0.03em;line-height:1.07;color:var(--white);max-width:600px;}
.pbc-h2 em{font-style:italic;color:var(--sage-light);}
.pbc-sub{margin-top:22px;font-size:17px;font-weight:300;color:rgba(255,255,255,.45);max-width:420px;line-height:1.7;}
.how-sec{background:var(--surface);border-bottom:1px solid var(--line);}
.how-h2-wrap{text-align:center;margin-bottom:72px;}
.steps-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:var(--line-med);border:1px solid var(--line-med);border-radius:var(--r);overflow:hidden;box-shadow:var(--shadow-sm);}
.scard{background:var(--white);padding:48px 36px 52px;position:relative;overflow:hidden;transition:background .28s var(--ease);cursor:default;}
.scard:hover{background:var(--surface);}
.scard-num{font-family:var(--ff-m);font-size:10.5px;letter-spacing:.15em;text-transform:uppercase;color:var(--ink-muted);margin-bottom:28px;}
.scard-icon{width:48px;height:48px;border-radius:12px;margin-bottom:24px;display:flex;align-items:center;justify-content:center;border:1px solid;transition:transform .3s var(--ease),box-shadow .3s;}
.scard:hover .scard-icon{transform:scale(1.06);box-shadow:var(--shadow-sm);}
.scard-title{font-family:var(--ff-d);font-size:21px;font-weight:300;letter-spacing:-0.02em;color:var(--ink);margin-bottom:11px;line-height:1.18;}
.scard-desc{font-size:13.5px;font-weight:300;line-height:1.7;color:var(--ink-soft);}
.scard-arr{position:absolute;bottom:32px;right:32px;width:30px;height:30px;border-radius:50%;border:1px solid var(--line-med);display:flex;align-items:center;justify-content:center;color:var(--ink-muted);transition:all .25s var(--ease);}
.scard:hover .scard-arr{background:var(--ink);border-color:var(--ink);color:var(--white);transform:rotate(-45deg);}
.split-sec{background:var(--white);border-bottom:1px solid var(--line);}
.split-grid{display:grid;grid-template-columns:1fr 1fr;min-height:660px;}
.split-img{position:relative;overflow:hidden;background:var(--ink-2);}
.split-img img{width:100%;height:100%;object-fit:cover;opacity:.68;transition:transform 8s linear;transform:scale(1.02);}
.split-img:hover img{opacity:.75;}
.split-img-scrim{position:absolute;inset:0;background:linear-gradient(180deg,transparent 30%,rgba(8,8,9,.6) 100%);}
.split-img-caption{position:absolute;bottom:0;left:0;right:0;z-index:2;padding:44px;}
.sic-tag{font-family:var(--ff-m);font-size:10.5px;letter-spacing:.15em;text-transform:uppercase;color:rgba(255,255,255,.35);margin-bottom:12px;}
.sic-h3{font-family:var(--ff-d);font-size:30px;font-weight:200;letter-spacing:-0.025em;color:var(--white);line-height:1.15;}
.sic-h3 em{font-style:italic;color:var(--sage-light);}
.split-content{padding:80px 64px;display:flex;flex-direction:column;justify-content:center;}
.split-content .sec-chip{margin-bottom:36px;}
.split-content h2{font-family:var(--ff-d);font-size:clamp(30px,2.8vw,44px);font-weight:200;letter-spacing:-0.03em;line-height:1.1;color:var(--ink);margin-bottom:20px;}
.split-content h2 em{font-style:italic;}
.split-content p{font-size:15.5px;font-weight:300;line-height:1.75;color:var(--ink-soft);margin-bottom:36px;}
.feat-list{display:flex;flex-direction:column;gap:10px;}
.feat-item{display:flex;align-items:flex-start;gap:14px;padding:14px 18px;border-radius:var(--r-sm);border:1px solid var(--line);background:var(--surface);transition:all .25s var(--ease);}
.feat-item:hover{background:var(--white);box-shadow:var(--shadow-sm);transform:translateX(4px);}
.fi-icon{width:34px;height:34px;border-radius:8px;flex-shrink:0;display:flex;align-items:center;justify-content:center;border:1px solid;}
.fi-t{flex:1;}
.fi-title{font-size:13.5px;font-weight:500;color:var(--ink);margin-bottom:3px;}
.fi-desc{font-size:12.5px;font-weight:300;color:var(--ink-soft);line-height:1.5;}
.split-grid.rev .split-img{order:2;}
.split-grid.rev .split-content{order:1;border-right:1px solid var(--line);}
.visual-row{background:var(--surface);border-bottom:1px solid var(--line);padding:130px 52px;}
.vr-grid{display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center;}
.vr-left .sec-h2{margin-bottom:20px;}
.vr-left p{font-size:16px;font-weight:300;line-height:1.75;color:var(--ink-soft);margin-bottom:36px;}
.vr-pill-row{display:flex;flex-wrap:wrap;gap:9px;margin-top:24px;}
.vr-pill{font-size:13px;font-weight:300;padding:7px 16px;border-radius:99px;border:1px solid;display:flex;align-items:center;gap:7px;transition:transform .2s var(--ease);}
.vr-pill:hover{transform:translateY(-2px);}
.vp-sage{background:var(--sage-muted);border-color:rgba(61,107,79,.18);color:var(--sage);}
.vp-gold{background:var(--gold-muted);border-color:rgba(156,122,60,.18);color:var(--gold);}
.vp-slate{background:var(--slate-muted);border-color:rgba(45,79,114,.18);color:var(--slate);}
.vp-red{background:rgba(192,80,60,.06);border-color:rgba(192,80,60,.18);color:#c0503c;}
.pill-dot{width:6px;height:6px;border-radius:50%;flex-shrink:0;}
.sa-card{background:var(--white);border:1px solid var(--line-med);border-radius:20px;box-shadow:var(--shadow-lg);overflow:hidden;position:relative;}
.sa-head{background:var(--surface-2);border-bottom:1px solid var(--line);padding:16px 20px;display:flex;align-items:center;gap:10px;}
.sa-dots{display:flex;gap:6px;}
.sa-dot{width:11px;height:11px;border-radius:50%;}
.d1{background:#ff6058;}.d2{background:#febc2e;}.d3{background:#28c840;}
.sa-title{font-family:var(--ff-m);font-size:11.5px;color:var(--ink-muted);margin:0 auto;}
.sa-body{padding:26px 24px;}
.sa-section-label{font-family:var(--ff-m);font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--ink-muted);margin-bottom:16px;}
.sk-row{margin-bottom:13px;}
.sk-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;}
.sk-name{font-size:13px;font-weight:400;color:var(--ink);}
.sk-pct{font-family:var(--ff-m);font-size:11.5px;color:var(--ink-soft);}
.sk-bg{height:5px;background:var(--surface-2);border-radius:99px;overflow:hidden;}
.sk-fill{height:100%;border-radius:99px;transition:width 1.4s var(--ease);}
.f-sage{background:linear-gradient(90deg,var(--sage-mid),var(--sage-light));}
.f-gold{background:linear-gradient(90deg,var(--gold),var(--gold-light));}
.f-slate{background:linear-gradient(90deg,var(--slate),var(--slate-light));}
.f-coral{background:linear-gradient(90deg,#c0503c,#d4806a);}
.sa-div{height:1px;background:var(--line);margin:18px 0;}
.gap-row{display:flex;justify-content:space-between;align-items:center;margin-bottom:13px;}
.gap-lbl{font-family:var(--ff-m);font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--ink-muted);}
.gap-cnt{font-size:11.5px;font-weight:500;color:var(--sage);background:var(--sage-muted);padding:3px 11px;border-radius:99px;border:1px solid var(--sage-light);}
.gap-pills{display:flex;flex-wrap:wrap;gap:7px;}
.gp{font-size:11.5px;font-weight:300;padding:5px 13px;border-radius:99px;border:1px solid;display:flex;align-items:center;gap:5px;}
.gp-r{background:rgba(192,80,60,.05);border-color:rgba(192,80,60,.18);color:#c0503c;}
.gp-a{background:var(--gold-muted);border-color:rgba(156,122,60,.18);color:var(--gold);}
.gp-g{background:var(--sage-muted);border-color:rgba(61,107,79,.18);color:var(--sage);}
.gp-dot{width:5px;height:5px;border-radius:50%;flex-shrink:0;}
.gd-r{background:#c0503c;}.gd-a{background:var(--gold);}.gd-g{background:var(--sage);}
.sa-foot{padding:14px 22px;background:var(--surface);border-top:1px solid var(--line);display:flex;align-items:center;justify-content:space-between;}
.sa-gen-btn{font-size:12px;font-weight:500;color:var(--white);background:var(--sage);padding:8px 18px;border-radius:var(--r-xs);border:none;cursor:pointer;box-shadow:0 2px 10px rgba(61,107,79,.3);display:flex;align-items:center;gap:7px;letter-spacing:.01em;transition:transform .2s var(--ease),box-shadow .2s;animation:sagePulse 3.2s ease infinite;}
.sa-gen-btn:hover{transform:translateY(-1px);box-shadow:0 4px 16px rgba(61,107,79,.38);}
@keyframes sagePulse{0%,100%{box-shadow:0 2px 10px rgba(61,107,79,.3);}50%{box-shadow:0 2px 16px rgba(61,107,79,.48);}}
.sa-gen-meta{font-family:var(--ff-m);font-size:11px;color:var(--ink-muted);}
.sa-wrap{position:relative;}
.float-chip{position:absolute;background:var(--white);border:1px solid var(--line-med);border-radius:12px;box-shadow:var(--shadow-md);padding:11px 16px;display:flex;align-items:center;gap:10px;pointer-events:none;}
.fc1{top:-22px;right:-28px;animation:fc1 4s ease-in-out infinite;}
.fc2{bottom:-18px;left:-32px;animation:fc2 4.8s ease-in-out .4s infinite;}
@keyframes fc1{0%,100%{transform:translateY(0);}50%{transform:translateY(-7px);}}
@keyframes fc2{0%,100%{transform:translateY(0);}50%{transform:translateY(6px);}}
.fci{width:28px;height:28px;border-radius:7px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.fci-s{background:var(--sage-muted);}.fci-g{background:var(--gold-muted);}
.fc-main{font-size:12.5px;font-weight:500;color:var(--ink);}
.fc-sub{font-size:11px;font-weight:300;color:var(--ink-muted);}
.engine-sec{background:var(--ink);color:var(--white);padding:140px 52px;position:relative;overflow:hidden;border-bottom:1px solid rgba(255,255,255,.05);}
.eng-bg{position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse 900px 600px at 25% 50%,rgba(61,107,79,.1) 0%,transparent 65%),radial-gradient(ellipse 700px 500px at 82% 20%,rgba(45,79,114,.08) 0%,transparent 60%),radial-gradient(ellipse 500px 400px at 60% 90%,rgba(156,122,60,.06) 0%,transparent 60%);}
.eng-grid-pat{position:absolute;inset:0;opacity:.025;background-image:linear-gradient(rgba(255,255,255,.6) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.6) 1px,transparent 1px);background-size:64px 64px;}
.engine-inner{position:relative;z-index:2;max-width:1000px;margin:0 auto;text-align:center;}
.eng-chip{display:inline-block;font-family:var(--ff-m);font-size:10.5px;letter-spacing:.15em;text-transform:uppercase;color:rgba(255,255,255,.3);background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);padding:6px 14px;border-radius:99px;margin-bottom:52px;}
.engine-h2{font-family:var(--ff-d);font-size:clamp(44px,5.5vw,76px);font-weight:200;letter-spacing:-0.035em;line-height:1.06;color:var(--white);margin-bottom:22px;}
.engine-h2 em{font-style:italic;color:rgba(255,255,255,.45);}
.engine-sub{font-size:17px;font-weight:300;line-height:1.7;color:rgba(255,255,255,.38);max-width:500px;margin:0 auto 72px;}
.formula-wrap{background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.07);border-radius:var(--r);padding:44px 64px;margin-bottom:64px;display:inline-block;box-shadow:0 0 100px rgba(61,107,79,.09);}
.formula-eq{font-family:var(--ff-m);font-size:20px;font-weight:300;color:rgba(255,255,255,.65);letter-spacing:.04em;}
.eq-var{color:var(--sage-light);}.eq-op{color:rgba(255,255,255,.22);}
.formula-note{font-family:var(--ff-m);font-size:11px;color:rgba(255,255,255,.2);margin-top:12px;letter-spacing:.08em;}
.eng-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.06);border-radius:var(--r);overflow:hidden;}
.est{padding:48px 40px;background:rgba(255,255,255,.02);transition:background .3s;}
.est:hover{background:rgba(255,255,255,.05);}
.est-val{font-family:var(--ff-d);font-size:56px;font-weight:200;letter-spacing:-0.04em;line-height:1;color:var(--white);margin-bottom:10px;}
.est-val span{font-size:32px;color:rgba(255,255,255,.22);}
.est-lbl{font-family:var(--ff-m);font-size:10.5px;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.28);}
.photo-grid{display:grid;grid-template-columns:2.2fr 1fr 1fr;grid-template-rows:360px 360px;gap:2px;background:var(--surface-3);}
.pg-cell{position:relative;overflow:hidden;background:var(--surface-2);}
.pg-cell img{width:100%;height:100%;object-fit:cover;transition:transform 7s linear,filter .45s,opacity .45s;filter:saturate(.75);opacity:.88;}
.pg-cell:hover img{transform:scale(1.04);filter:saturate(1.1);opacity:1;}
.pg-tall{grid-row:1/3;}
.pg-overlay{position:absolute;inset:0;background:linear-gradient(180deg,transparent 45%,rgba(8,8,9,.52) 100%);display:flex;align-items:flex-end;padding:24px;opacity:0;transition:opacity .4s;}
.pg-cell:hover .pg-overlay{opacity:1;}
.pg-tag{font-size:12.5px;font-weight:300;color:rgba(255,255,255,.88);letter-spacing:.02em;}
.cta-sec{background:var(--white);padding:160px 52px;text-align:center;position:relative;overflow:hidden;border-top:1px solid var(--line);}
.cta-bg{position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse 1100px 600px at 50% 0%,rgba(184,212,192,.16) 0%,transparent 65%),radial-gradient(ellipse 600px 400px at 15% 100%,rgba(232,212,170,.13) 0%,transparent 60%),radial-gradient(ellipse 600px 400px at 88% 80%,rgba(180,200,222,.12) 0%,transparent 60%);}
.cta-inner{position:relative;z-index:2;}
.cta-eyebrow{display:inline-flex;align-items:center;gap:8px;background:var(--gold-muted);border:1px solid rgba(156,122,60,.22);padding:7px 18px;border-radius:99px;margin-bottom:44px;}
.cta-eyebrow-dot{width:6px;height:6px;border-radius:50%;background:var(--gold);}
.cta-eyebrow-text{font-size:12px;font-weight:400;color:var(--gold);letter-spacing:.04em;}
.cta-h2{font-family:var(--ff-d);font-size:clamp(46px,6.5vw,90px);font-weight:200;letter-spacing:-0.038em;line-height:1.05;color:var(--ink);margin-bottom:26px;}
.cta-h2 em{font-style:italic;color:var(--sage);}
.cta-sub{font-size:18px;font-weight:300;line-height:1.72;color:var(--ink-soft);max-width:480px;margin:0 auto 58px;}
.cta-form{display:flex;max-width:448px;margin:0 auto 18px;border:1px solid var(--line-med);border-radius:var(--r-sm);overflow:hidden;box-shadow:var(--shadow-md);}
.cta-inp{flex:1;font-family:var(--ff);font-size:15px;font-weight:300;padding:15px 20px;border:none;outline:none;background:var(--white);color:var(--ink);}
.cta-inp::placeholder{color:var(--ink-muted);}
.cta-sub-btn{font-family:var(--ff);font-size:14px;font-weight:500;padding:15px 26px;background:var(--sage);color:var(--white);border:none;letter-spacing:.02em;white-space:nowrap;transition:background .2s,transform .2s;cursor:pointer;}
.cta-sub-btn:hover{background:#2f5440;transform:scale(1.02);}
.cta-note{font-size:12.5px;font-weight:300;color:var(--ink-muted);margin-bottom:52px;}
.cta-btns{display:flex;justify-content:center;gap:14px;flex-wrap:wrap;}
.cta-btn-a{font-family:var(--ff);font-size:14.5px;font-weight:400;padding:14px 30px;border-radius:var(--r-sm);text-decoration:none;letter-spacing:.01em;display:inline-flex;align-items:center;gap:9px;transition:all .22s var(--ease);}
.cba-emp{background:var(--ink);color:var(--white);box-shadow:var(--shadow-sm);}
.cba-emp:hover{background:var(--ink-2);transform:translateY(-2px);box-shadow:var(--shadow-md);}
.cba-ee{background:var(--surface-2);color:var(--ink);border:1px solid var(--line-med);}
.cba-ee:hover{background:var(--surface-3);transform:translateY(-2px);}
footer{background:var(--ink-2);padding:68px 52px 36px;}
.foot-top{display:grid;grid-template-columns:2.2fr 1fr 1fr 1fr;gap:56px;padding-bottom:52px;border-bottom:1px solid rgba(255,255,255,.06);margin-bottom:32px;}
.foot-logo{display:flex;align-items:center;gap:9px;margin-bottom:14px;}
.foot-logo-mark{width:28px;height:28px;border-radius:7px;background:rgba(255,255,255,.1);display:flex;align-items:center;justify-content:center;}
.foot-logo-text{font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:15px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--white);}
.foot-tag{font-size:14px;font-weight:300;line-height:1.65;color:rgba(255,255,255,.28);max-width:256px;}
.foot-col-h{font-family:var(--ff-m);font-size:10.5px;letter-spacing:.15em;text-transform:uppercase;color:rgba(255,255,255,.22);margin-bottom:20px;}
.foot-links{list-style:none;display:flex;flex-direction:column;gap:11px;}
.foot-links a{font-size:13.5px;font-weight:300;color:rgba(255,255,255,.36);text-decoration:none;transition:color .2s;}
.foot-links a:hover{color:var(--white);}
.foot-bottom{display:flex;justify-content:space-between;align-items:center;}
.foot-copy{font-family:var(--ff-m);font-size:11px;color:rgba(255,255,255,.18);letter-spacing:.05em;}
.foot-legal{display:flex;gap:22px;}
.foot-legal a{font-size:12px;color:rgba(255,255,255,.18);text-decoration:none;transition:color .2s;}
.foot-legal a:hover{color:rgba(255,255,255,.5);}
@keyframes fadeUp{from{opacity:0;transform:translateY(26px);}to{opacity:1;transform:translateY(0);}}
.reveal{opacity:0;transform:translateY(30px);transition:opacity .85s var(--ease),transform .85s var(--ease);}
.reveal.in{opacity:1;transform:translateY(0);}
.rl{opacity:0;transform:translateX(-26px);transition:opacity .85s var(--ease),transform .85s var(--ease);}
.rl.in{opacity:1;transform:translateX(0);}
.rr{opacity:0;transform:translateX(26px);transition:opacity .85s var(--ease),transform .85s var(--ease);}
.rr.in{opacity:1;transform:translateX(0);}
.d1s{transition-delay:.08s;}.d2s{transition-delay:.17s;}.d3s{transition-delay:.26s;}.d4s{transition-delay:.35s;}
#modalOverlay{position:fixed;inset:0;z-index:999;background:rgba(8,8,9,0.55);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;padding:24px;opacity:0;pointer-events:none;transition:opacity .28s var(--ease);}
#modalOverlay.open{opacity:1;pointer-events:all;}
#modalPanel{background:var(--white);border-radius:20px;width:100%;max-width:640px;max-height:82vh;display:flex;flex-direction:column;box-shadow:0 32px 80px rgba(8,8,9,0.22),0 8px 24px rgba(8,8,9,0.1);transform:translateY(16px) scale(0.98);transition:transform .32s var(--ease);overflow:hidden;}
#modalOverlay.open #modalPanel{transform:translateY(0) scale(1);}
#modalHead{display:flex;align-items:center;justify-content:space-between;padding:18px 24px;border-bottom:1px solid var(--line);flex-shrink:0;}
#modalTag{font-family:var(--ff-m);font-size:10.5px;letter-spacing:.15em;text-transform:uppercase;color:var(--ink-muted);background:var(--surface);border:1px solid var(--line-med);padding:4px 12px;border-radius:99px;}
#modalClose{width:32px;height:32px;border-radius:50%;background:var(--surface);border:1px solid var(--line);display:flex;align-items:center;justify-content:center;color:var(--ink-soft);cursor:pointer;transition:all .18s;flex-shrink:0;}
#modalClose:hover{background:var(--surface-2);color:var(--ink);border-color:var(--surface-3);}
#modalScroll{overflow-y:auto;padding:32px 32px 36px;flex:1;scrollbar-width:thin;scrollbar-color:var(--surface-3) transparent;}
#modalScroll::-webkit-scrollbar{width:4px;}
#modalScroll::-webkit-scrollbar-thumb{background:var(--surface-3);border-radius:99px;}
#modalTitle{font-family:var(--ff-d);font-size:28px;font-weight:200;letter-spacing:-0.025em;color:var(--ink);margin-bottom:6px;line-height:1.15;}
#modalDate{font-family:var(--ff-m);font-size:11px;color:var(--ink-muted);letter-spacing:.05em;margin-bottom:28px;}
#modalBody{font-size:14.5px;font-weight:300;line-height:1.78;color:var(--ink-soft);}
#modalBody h3{font-family:var(--ff-m);font-size:10.5px;font-weight:400;letter-spacing:.14em;text-transform:uppercase;color:var(--sage);margin:28px 0 10px;}
#modalBody h3:first-child{margin-top:0;}
#modalBody p{margin-bottom:16px;}
#modalBody p:last-child{margin-bottom:0;}
#modalBody ul{padding-left:18px;margin-bottom:16px;}
#modalBody ul li{margin-bottom:7px;}
#modalBody a{color:var(--sage);text-decoration:none;border-bottom:1px solid rgba(61,107,79,.25);}
#modalBody a:hover{border-color:var(--sage);}
.modal-divider{height:1px;background:var(--line);margin:24px 0;}
.modal-field{margin-bottom:14px;}
.modal-field label{display:block;font-family:var(--ff-m);font-size:10.5px;letter-spacing:.12em;text-transform:uppercase;color:var(--ink-muted);margin-bottom:7px;}
.modal-field input,.modal-field textarea{width:100%;font-family:var(--ff);font-size:14px;font-weight:300;padding:11px 14px;border:1px solid var(--line-med);border-radius:var(--r-sm);background:var(--surface);color:var(--ink);outline:none;transition:border-color .18s,box-shadow .18s;resize:vertical;}
.modal-field input:focus,.modal-field textarea:focus{border-color:var(--sage);box-shadow:0 0 0 3px rgba(61,107,79,.08);}
.modal-field textarea{min-height:90px;}
.modal-submit{font-family:var(--ff);font-size:13.5px;font-weight:500;color:var(--white);background:var(--sage);padding:12px 26px;border-radius:var(--r-sm);border:none;cursor:pointer;letter-spacing:.01em;margin-top:6px;transition:background .2s,transform .2s;}
.modal-submit:hover{background:#2f5440;transform:translateY(-1px);}
.blog-post{padding:18px 0;border-bottom:1px solid var(--line);display:flex;flex-direction:column;gap:5px;}
.blog-post:last-child{border-bottom:none;}
.bp-tag{font-family:var(--ff-m);font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:var(--sage);}
.bp-title{font-size:15px;font-weight:400;color:var(--ink);letter-spacing:-0.01em;}
.bp-date{font-size:12px;color:var(--ink-muted);}
.int-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:4px;}
.int-card{padding:16px 18px;border:1px solid var(--line);border-radius:var(--r-sm);background:var(--surface);}
.int-name{font-size:13.5px;font-weight:500;color:var(--ink);margin-bottom:4px;}
.int-desc{font-size:12px;font-weight:300;color:var(--ink-muted);line-height:1.5;}
.int-status{display:inline-block;font-size:10px;font-weight:400;padding:2px 8px;border-radius:99px;margin-top:8px;font-family:var(--ff-m);letter-spacing:.06em;}
.st-live{background:var(--sage-muted);color:var(--sage);border:1px solid rgba(61,107,79,.18);}
.st-soon{background:var(--gold-muted);color:var(--gold);border:1px solid rgba(156,122,60,.18);}
.career-card{padding:18px 20px;border:1px solid var(--line);border-radius:var(--r-sm);background:var(--surface);margin-bottom:10px;}
.career-card:last-child{margin-bottom:0;}
.cc-title{font-size:14.5px;font-weight:500;color:var(--ink);margin-bottom:4px;}
.cc-meta{display:flex;gap:10px;flex-wrap:wrap;}
.cc-tag{font-size:11px;font-weight:300;color:var(--ink-muted);background:var(--white);border:1px solid var(--line);padding:2px 10px;border-radius:99px;}
@media(max-width:1100px){
  nav{padding:0 28px;}.nav-links{display:none;}
  .sec{padding:90px 28px;}
  .hero-inner{padding:0 28px;padding-top:100px;padding-bottom:100px;}
  .hero-stats{right:28px;bottom:40px;gap:32px;}
  .cards-row{grid-template-columns:1fr 1fr;}
  .problem-grid{grid-template-columns:1fr;gap:48px;}
  .vr-grid{grid-template-columns:1fr;gap:56px;}
  .visual-row{padding:90px 28px;}
  .split-grid,.split-grid.rev{grid-template-columns:1fr;direction:ltr;}
  .split-grid .split-img,.split-grid.rev .split-img{min-height:360px;order:0;}
  .split-grid.rev .split-content{order:1;border-right:none;border-top:1px solid var(--line);}
  .split-content{padding:52px 32px;}
  .engine-sec{padding:100px 28px;}
  .eng-stats{grid-template-columns:1fr;}
  .photo-grid{grid-template-columns:1fr 1fr;grid-template-rows:260px 260px 260px;}
  .pg-tall{grid-row:auto;}
  .cta-sec{padding:110px 28px;}
  footer{padding:52px 28px 30px;}
  .foot-top{grid-template-columns:1fr 1fr;gap:36px;}
  .photo-break-content{padding:52px;}
}
@media(max-width:720px){
  .cards-row{grid-template-columns:1fr;}
  .steps-grid{grid-template-columns:1fr 1fr;}
  .eng-stats{grid-template-columns:1fr;}
  .hero-stats{display:none;}
  .cta-form{flex-direction:column;border:none;box-shadow:none;gap:10px;}
  .cta-inp{border:1px solid var(--line-med);border-radius:var(--r-sm);}
  .cta-sub-btn{border-radius:var(--r-sm);}
  .cta-btns{flex-direction:column;align-items:center;}
  .foot-top{grid-template-columns:1fr;gap:30px;}
  .foot-bottom{flex-direction:column;gap:14px;}
  .photo-grid{grid-template-columns:1fr;grid-template-rows:repeat(5,240px);}
}
`;

const bodyHTML = `
<nav id="mainNav">
  <a href="#" class="logo">
    <div class="logo-mark"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2L14 12H2L8 2Z" fill="white" fill-opacity="0.9"/></svg></div>
    <span class="logo-text">Rellax</span>
  </a>
  <div class="nav-links">
    <a href="#how" class="nav-a">How it works</a>
    <a href="#features" class="nav-a">Features</a>
    <a href="#engine" class="nav-a">AI Engine</a>
  </div>
  <div class="nav-r">
    <a href="#cta" class="btn-ghost">Log in</a>
    <a href="#cta" class="btn-dark">Sign up free</a>
  </div>
</nav>

<section class="hero">
  <div class="hero-img-wrap"><img src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1800&auto=format&fit=crop&q=80" alt="Modern workspace" fetchpriority="high"/></div>
  <div class="hero-scrim"></div>
  <div class="hero-scrim-bottom"></div>
  <div class="hero-inner">
    <div class="hero-badge"><span class="badge-live"></span><span class="badge-txt">AI Onboarding Engine — Now live</span></div>
    <h1 class="hero-h1">Every hire,<br/><em>perfectly prepared.</em></h1>
    <p class="hero-sub">RELLAX reads your employees' skills, maps them to role requirements, and builds a personalized learning journey — automatically. No templates. No guesswork.</p>
    <div class="hero-actions">
      <a href="#cta" class="btn-hero-white">Get started free <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M7 3l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></a>
      <a href="#how" class="btn-hero-outline">See how it works</a>
    </div>
  </div>
  <div class="hero-stats">
    <div class="hs-item"><div class="hs-num">3×</div><div class="hs-label">Faster to role</div></div>
    <div class="hs-item"><div class="hs-num">94%</div><div class="hs-label">Gap reduction</div></div>
    <div class="hs-item"><div class="hs-num">0</div><div class="hs-label">Manual config</div></div>
  </div>
</section>

<div class="cards-row">
  <div class="vcard reveal d1s">
    <div class="vc-num">01 — Extract</div>
    <div class="vc-icon ic-sage"><svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M5 18V5.5A1.5 1.5 0 016.5 4h7L17 7.5V18a1.5 1.5 0 01-1.5 1.5h-9A1.5 1.5 0 015 18z" stroke="#3d6b4f" stroke-width="1.3"/><path d="M13 4v3.5H17" stroke="#3d6b4f" stroke-width="1.3"/><path d="M8 11.5h6M8 14.5h4" stroke="#3d6b4f" stroke-width="1.3" stroke-linecap="round"/></svg></div>
    <h3 class="vc-title">Resume parsing</h3>
    <p class="vc-desc">The AI engine reads and parses resumes in seconds — pulling verified skills, experience levels, and competency signals automatically.</p>
    <div class="vc-arrow"><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
  </div>
  <div class="vcard reveal d2s">
    <div class="vc-num">02 — Map</div>
    <div class="vc-icon ic-gold"><svg width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="7" cy="11" r="4" stroke="#9c7a3c" stroke-width="1.3"/><circle cx="15" cy="11" r="4" stroke="#9c7a3c" stroke-width="1.3"/><path d="M10 11h2" stroke="#9c7a3c" stroke-width="1.3" stroke-linecap="round"/></svg></div>
    <h3 class="vc-title">Role mapping</h3>
    <p class="vc-desc">Each role's JD is parsed and normalized against a shared skill taxonomy — creating a precise competency target for every position.</p>
    <div class="vc-arrow"><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
  </div>
  <div class="vcard reveal d3s">
    <div class="vc-num">03 — Generate</div>
    <div class="vc-icon ic-slate"><svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M4 16l4-5 3.5 3.5 4.5-6 3 2.5" stroke="#2d4f72" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 6h14" stroke="#2d4f72" stroke-width="1.3" stroke-linecap="round" opacity=".4"/></svg></div>
    <h3 class="vc-title">Learning paths</h3>
    <p class="vc-desc">A personalized roadmap is built — modules ordered by dependency, weighted by importance. No generic courses. Just what each person needs.</p>
    <div class="vc-arrow"><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
  </div>
</div>

<section class="sec problem-sec" id="about">
  <div class="sec-label reveal"><span class="sec-chip">The problem</span><span class="sec-rule"></span></div>
  <div class="problem-grid">
    <div class="prob-left rl">
      <h2 class="sec-h2">Static onboarding<br/><em style="color:#c0503c">fails everyone.</em></h2>
      <p>One-size-fits-all onboarding programs ignore the fact that every employee brings a different background. Experienced hires sit through basics they already know. Beginners get overwhelmed. Nobody wins — and organisations bleed time and money.</p>
    </div>
    <div class="prob-cards">
      <div class="pcard rr d1s">
        <div class="pcard-icon pci-red"><svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="#c0503c" stroke-width="1.3"/><path d="M9 5.5v4M9 12h.01" stroke="#c0503c" stroke-width="1.3" stroke-linecap="round"/></svg></div>
        <div class="pcard-body"><div class="pcard-title">Zero personalization</div><div class="pcard-desc">Every employee follows the same rigid path regardless of their actual skill level or background.</div></div>
      </div>
      <div class="pcard rr d2s">
        <div class="pcard-icon pci-gold"><svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="#9c7a3c" stroke-width="1.3"/><path d="M9 5v4.5l3 1.5" stroke="#9c7a3c" stroke-width="1.3" stroke-linecap="round"/></svg></div>
        <div class="pcard-body"><div class="pcard-title">Time wasted on known concepts</div><div class="pcard-desc">Experienced hires lose days reviewing topics they mastered years ago. That's real cost with zero return.</div></div>
      </div>
      <div class="pcard rr d3s">
        <div class="pcard-icon pci-slate"><svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="2.5" y="4" width="13" height="10" rx="1.5" stroke="#2d4f72" stroke-width="1.3"/><path d="M5 8h8M5 11h5" stroke="#2d4f72" stroke-width="1.3" stroke-linecap="round"/></svg></div>
        <div class="pcard-body"><div class="pcard-title">No visibility into real gaps</div><div class="pcard-desc">HR has no data on which skills are actually missing. Progress is tracked by completion, not competency.</div></div>
      </div>
    </div>
  </div>
</section>

<div class="photo-break">
  <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1800&auto=format&fit=crop&q=80" alt="Team at work" loading="lazy"/>
  <div class="photo-break-scrim"></div>
  <div class="photo-break-content reveal">
    <div class="pbc-tag">RELLAX — adaptive intelligence</div>
    <h2 class="pbc-h2">Onboarding that<br/><em>thinks for itself.</em></h2>
    <p class="pbc-sub">Every employee is different. RELLAX treats them that way — reading skills, computing gaps, and building a unique path in seconds.</p>
  </div>
</div>

<section class="sec how-sec" id="how">
  <div class="sec-label reveal"><span class="sec-chip">How it works</span><span class="sec-rule"></span></div>
  <div class="how-h2-wrap reveal"><h2 class="sec-h2">From resume<br/><em style="color:var(--sage)">to readiness.</em></h2></div>
  <div class="steps-grid reveal">
    <div class="scard">
      <div class="scard-num">01</div>
      <div class="scard-icon ic-sage"><svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M5 18V5.5A1.5 1.5 0 016.5 4h7L17 7.5V18a1.5 1.5 0 01-1.5 1.5h-9A1.5 1.5 0 015 18z" stroke="#3d6b4f" stroke-width="1.3"/><path d="M13 4v3.5H17" stroke="#3d6b4f" stroke-width="1.3"/><path d="M8 11.5h6M8 14.5h4" stroke="#3d6b4f" stroke-width="1.3" stroke-linecap="round"/></svg></div>
      <h3 class="scard-title">Upload resume</h3>
      <p class="scard-desc">The AI parses any resume format instantly — extracting skills, experience levels, and competency signals without human input.</p>
      <div class="scard-arr"><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
    </div>
    <div class="scard">
      <div class="scard-num">02</div>
      <div class="scard-icon ic-gold"><svg width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="7" cy="11" r="4" stroke="#9c7a3c" stroke-width="1.3"/><circle cx="15" cy="11" r="4" stroke="#9c7a3c" stroke-width="1.3"/><path d="M10.5 11h1" stroke="#9c7a3c" stroke-width="1.3" stroke-linecap="round"/></svg></div>
      <h3 class="scard-title">Map to role</h3>
      <p class="scard-desc">JDs are parsed and normalized against a skill taxonomy, creating a precise map of exactly what competencies each role demands.</p>
      <div class="scard-arr"><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
    </div>
    <div class="scard">
      <div class="scard-num">03</div>
      <div class="scard-icon ic-slate"><svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M3 15l5-5.5 3.5 3.5 4.5-6 3 2.5" stroke="#2d4f72" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
      <h3 class="scard-title">Identify gaps</h3>
      <p class="scard-desc">Gap = Required − Existing. RELLAX surfaces exactly what needs attention with precision — nothing more, nothing less.</p>
      <div class="scard-arr"><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
    </div>
    <div class="scard">
      <div class="scard-num">04</div>
      <div class="scard-icon" style="background:rgba(192,80,60,.06);border-color:rgba(192,80,60,.14);"><svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M4 11h14M13 5l6 6-6 6" stroke="#c0503c" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
      <h3 class="scard-title">Generate path</h3>
      <p class="scard-desc">A personalized roadmap is created — modules ordered by skill dependency, weighted by role importance. Unique to every employee.</p>
      <div class="scard-arr"><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
    </div>
  </div>
</section>

<section class="split-sec" id="features">
  <div class="split-grid">
    <div class="split-img rl">
      <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1000&auto=format&fit=crop&q=80" alt="Employer dashboard" loading="lazy"/>
      <div class="split-img-scrim"></div>
      <div class="split-img-caption"><div class="sic-tag">For employers</div><h3 class="sic-h3">Full team<br/><em>visibility.</em></h3></div>
    </div>
    <div class="split-content rr">
      <span class="sec-chip">Employer dashboard</span>
      <h2>Zero guesswork.<br/><em style="color:var(--sage)">Total control.</em></h2>
      <p>Define roles, add employees, and let RELLAX handle every layer of onboarding intelligence — from a single, clean dashboard.</p>
      <div class="feat-list">
        <div class="feat-item"><div class="fi-icon" style="background:var(--sage-muted);border-color:rgba(61,107,79,.14);"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 13V6l6-4 6 4v7H2z" stroke="#3d6b4f" stroke-width="1.2"/><path d="M6 13v-4h4v4" stroke="#3d6b4f" stroke-width="1.2"/></svg></div><div class="fi-t"><div class="fi-title">Role &amp; JD management</div><div class="fi-desc">Upload job descriptions and define required skill sets for every role in your org.</div></div></div>
        <div class="feat-item"><div class="fi-icon" style="background:var(--gold-muted);border-color:rgba(156,122,60,.14);"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 4h12M2 8h8M2 12h10" stroke="#9c7a3c" stroke-width="1.2" stroke-linecap="round"/></svg></div><div class="fi-t"><div class="fi-title">Bulk employee import</div><div class="fi-desc">Add employees one by one or upload an Excel sheet to onboard entire teams in seconds.</div></div></div>
        <div class="feat-item"><div class="fi-icon" style="background:var(--slate-muted);border-color:rgba(45,79,114,.14);"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 12l3-4 2.5 2.5 4-5 2.5 2" stroke="#2d4f72" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg></div><div class="fi-t"><div class="fi-title">Progress monitoring</div><div class="fi-desc">Track every employee's onboarding completion and skill coverage in real time.</div></div></div>
      </div>
    </div>
  </div>
</section>

<section class="split-sec" style="border-bottom:1px solid var(--line);">
  <div class="split-grid rev">
    <div class="split-img rr">
      <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1000&auto=format&fit=crop&q=80" alt="Employee learning" loading="lazy"/>
      <div class="split-img-scrim" style="background:linear-gradient(180deg,transparent 30%,rgba(8,8,9,.65) 100%);"></div>
      <div class="split-img-caption"><div class="sic-tag">For employees</div><h3 class="sic-h3">Your path,<br/><em>built for you.</em></h3></div>
    </div>
    <div class="split-content rl">
      <span class="sec-chip">Employee experience</span>
      <h2>No more generic<br/><em style="color:var(--slate)">onboarding.</em></h2>
      <p>Upload your resume and get a learning roadmap tailored exactly to where you are right now — and precisely where you need to go.</p>
      <div class="feat-list">
        <div class="feat-item"><div class="fi-icon" style="background:var(--sage-muted);border-color:rgba(61,107,79,.14);"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3v7M5 7l3 3 3-3" stroke="#3d6b4f" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M3 13h10" stroke="#3d6b4f" stroke-width="1.2" stroke-linecap="round"/></svg></div><div class="fi-t"><div class="fi-title">Upload resume — AI does the rest</div><div class="fi-desc">Skills are extracted automatically. No forms. No manual input needed.</div></div></div>
        <div class="feat-item"><div class="fi-icon" style="background:var(--gold-muted);border-color:rgba(156,122,60,.14);"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8a5 5 0 1010 0A5 5 0 003 8z" stroke="#9c7a3c" stroke-width="1.2"/><path d="M8 5.5v3l2 1" stroke="#9c7a3c" stroke-width="1.2" stroke-linecap="round"/></svg></div><div class="fi-t"><div class="fi-title">Personalized step-by-step roadmap</div><div class="fi-desc">See a sequenced learning path built specifically around your skill profile.</div></div></div>
        <div class="feat-item"><div class="fi-icon" style="background:var(--slate-muted);border-color:rgba(45,79,114,.14);"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="#2d4f72" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg></div><div class="fi-t"><div class="fi-title">Track progress in real time</div><div class="fi-desc">Watch your skill gaps close module by module as you learn.</div></div></div>
      </div>
    </div>
  </div>
</section>

<section class="visual-row">
  <div class="vr-grid">
    <div class="vr-left rl">
      <div class="sec-label" style="margin-bottom:40px;"><span class="sec-chip">AI engine</span><span class="sec-rule"></span></div>
      <h2 class="sec-h2">Skill gap,<br/><em style="color:var(--sage)">computed instantly.</em></h2>
      <p>The RELLAX engine parses resumes, normalizes skills against a taxonomy, and computes the exact delta between where an employee is and where they need to be — in under a second.</p>
      <div class="vr-pill-row">
        <div class="vr-pill vp-sage"><span class="pill-dot" style="background:var(--sage)"></span> TypeScript ✓</div>
        <div class="vr-pill vp-slate"><span class="pill-dot" style="background:var(--slate)"></span> System Design ✓</div>
        <div class="vr-pill vp-red"><span class="pill-dot" style="background:#c0503c"></span> CI/CD Missing</div>
        <div class="vr-pill vp-gold"><span class="pill-dot" style="background:var(--gold)"></span> React — Partial</div>
        <div class="vr-pill vp-red"><span class="pill-dot" style="background:#c0503c"></span> DevOps Missing</div>
      </div>
    </div>
    <div class="vr-right rr">
      <div class="sa-wrap">
        <div class="float-chip fc1"><div class="fci fci-s"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 10l3-3 2.5 2.5 4-5" stroke="#3d6b4f" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg></div><div><div class="fc-main">Path generated</div><div class="fc-sub">7 modules · ~12h</div></div></div>
        <div class="float-chip fc2"><div class="fci fci-g"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1.5l1.5 3 3.3.5-2.4 2.3.6 3.2L7 9l-3 1.5.6-3.2L2.2 5l3.3-.5L7 1.5z" stroke="#9c7a3c" stroke-width="1.2" stroke-linejoin="round"/></svg></div><div><div class="fc-main">3 gaps found</div><div class="fc-sub">Analyzed in 0.4s</div></div></div>
        <div class="sa-card">
          <div class="sa-head"><div class="sa-dots"><div class="sa-dot d1"></div><div class="sa-dot d2"></div><div class="sa-dot d3"></div></div><div class="sa-title">rellax / skill-analysis</div></div>
          <div class="sa-body">
            <div class="sa-section-label">Current skill level</div>
            <div class="sk-row"><div class="sk-top"><span class="sk-name">System Design</span><span class="sk-pct">82%</span></div><div class="sk-bg"><div class="sk-fill f-sage" style="width:82%"></div></div></div>
            <div class="sk-row"><div class="sk-top"><span class="sk-name">React / Next.js</span><span class="sk-pct">61%</span></div><div class="sk-bg"><div class="sk-fill f-gold" style="width:61%"></div></div></div>
            <div class="sk-row"><div class="sk-top"><span class="sk-name">Data Structures</span><span class="sk-pct">90%</span></div><div class="sk-bg"><div class="sk-fill f-slate" style="width:90%"></div></div></div>
            <div class="sk-row"><div class="sk-top"><span class="sk-name">TypeScript</span><span class="sk-pct">48%</span></div><div class="sk-bg"><div class="sk-fill f-coral" style="width:48%"></div></div></div>
            <div class="sa-div"></div>
            <div class="gap-row"><span class="gap-lbl">Gap analysis</span><span class="gap-cnt">3 gaps</span></div>
            <div class="gap-pills">
              <div class="gp gp-r"><span class="gp-dot gd-r"></span>TypeScript Adv.</div>
              <div class="gp gp-a"><span class="gp-dot gd-a"></span>React Hooks</div>
              <div class="gp gp-r"><span class="gp-dot gd-r"></span>CI/CD</div>
              <div class="gp gp-g"><span class="gp-dot gd-g"></span>Algorithms ✓</div>
              <div class="gp gp-g"><span class="gp-dot gd-g"></span>Architecture ✓</div>
            </div>
          </div>
          <div class="sa-foot">
            <button class="sa-gen-btn"><svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M5.5 1v9M1 5.5h9" stroke="white" stroke-width="1.5" stroke-linecap="round"/></svg> Generate roadmap</button>
            <span class="sa-gen-meta">AI · 0.4s</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="engine-sec" id="engine">
  <div class="eng-bg"></div>
  <div class="eng-grid-pat"></div>
  <div class="engine-inner">
    <span class="eng-chip reveal">The AI engine</span>
    <h2 class="engine-h2 reveal">Not a content platform.<br/><em>A decision engine.</em></h2>
    <p class="engine-sub reveal">RELLAX doesn't serve generic courses. It computes exactly what's missing and prescribes the shortest path to competency.</p>
    <div class="formula-wrap reveal">
      <div class="formula-eq"><span class="eq-var">Gap</span><span class="eq-op"> = </span><span class="eq-var">Required Skills</span><span class="eq-op"> − </span><span class="eq-var">Existing Skills</span></div>
      <div class="formula-note">core algorithm · computed per employee · per role</div>
    </div>
    <div class="eng-stats reveal">
      <div class="est"><div class="est-val">3<span>×</span></div><div class="est-lbl">Faster time to productivity</div></div>
      <div class="est"><div class="est-val">94<span>%</span></div><div class="est-lbl">Average gap reduction</div></div>
      <div class="est"><div class="est-val">0<span>s</span></div><div class="est-lbl">Manual configuration</div></div>
    </div>
  </div>
</section>

<div class="photo-grid">
  <div class="pg-cell pg-tall"><img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900&auto=format&fit=crop&q=80" alt="Collaborative team" loading="lazy"/><div class="pg-overlay"><div class="pg-tag">Collaborative learning</div></div></div>
  <div class="pg-cell"><img src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=700&auto=format&fit=crop&q=80" alt="Modern workplace" loading="lazy"/><div class="pg-overlay"><div class="pg-tag">Modern onboarding</div></div></div>
  <div class="pg-cell"><img src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=700&auto=format&fit=crop&q=80" alt="Strategy meeting" loading="lazy"/><div class="pg-overlay"><div class="pg-tag">Role readiness</div></div></div>
  <div class="pg-cell"><img src="https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=700&auto=format&fit=crop&q=80" alt="Office environment" loading="lazy"/><div class="pg-overlay"><div class="pg-tag">Enterprise scale</div></div></div>
  <div class="pg-cell"><img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=700&auto=format&fit=crop&q=80" alt="Developer at work" loading="lazy"/><div class="pg-overlay"><div class="pg-tag">Skill development</div></div></div>
</div>

<section class="cta-sec" id="cta">
  <div class="cta-bg"></div>
  <div class="cta-inner">
    <div class="cta-eyebrow reveal"><span class="cta-eyebrow-dot"></span><span class="cta-eyebrow-text">Early access open now</span></div>
    <h2 class="cta-h2 reveal">Transform how your<br/><em>team onboards.</em></h2>
    <p class="cta-sub reveal">Join organisations using RELLAX to get every new hire to full productivity — faster, smarter, without the guesswork.</p>
    <div class="cta-form reveal"><input type="email" class="cta-inp" placeholder="Work email address"/><button class="cta-sub-btn">Get access →</button></div>
    <div class="cta-note reveal">No credit card required · Set up in minutes</div>
    <div class="cta-btns reveal d2s">
      <a href="#" class="cta-btn-a cba-emp"><svg width="15" height="15" viewBox="0 0 15 15" fill="none"><rect x="2" y="2" width="11" height="11" rx="2" stroke="currentColor" stroke-width="1.2"/><path d="M5 7.5h5M7.5 5v5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg> Sign up as Employer</a>
      <a href="#" class="cta-btn-a cba-ee"><svg width="15" height="15" viewBox="0 0 15 15" fill="none"><circle cx="7.5" cy="5" r="2.5" stroke="currentColor" stroke-width="1.2"/><path d="M2 13.5c0-3.04 2.46-5.5 5.5-5.5s5.5 2.46 5.5 5.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg> Sign up as Employee</a>
    </div>
  </div>
</section>

<footer>
  <div class="foot-top">
    <div class="foot-brand">
      <div class="foot-logo"><div class="foot-logo-mark"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1.5L13 12H1L7 1.5Z" fill="rgba(255,255,255,0.7)"/></svg></div><span class="foot-logo-text">Rellax</span></div>
      <div class="foot-tag">AI-adaptive onboarding that turns new hires into contributors — faster and smarter than any static program.</div>
    </div>
    <div>
      <div class="foot-col-h">Product</div>
      <ul class="foot-links">
        <li><a href="#how">How it works</a></li>
        <li><a href="#features">Features</a></li>
        <li><a href="#engine">AI Engine</a></li>
        <li><a href="#" class="fl-modal" data-modal="integrations">Integrations</a></li>
      </ul>
    </div>
    <div>
      <div class="foot-col-h">Company</div>
      <ul class="foot-links">
        <li><a href="#" class="fl-modal" data-modal="about">About</a></li>
        <li><a href="#" class="fl-modal" data-modal="blog">Blog</a></li>
        <li><a href="#" class="fl-modal" data-modal="careers">Careers</a></li>
        <li><a href="#" class="fl-modal" data-modal="contact">Contact</a></li>
      </ul>
    </div>
    <div>
      <div class="foot-col-h">Legal</div>
      <ul class="foot-links">
        <li><a href="#" class="fl-modal" data-modal="privacy">Privacy Policy</a></li>
        <li><a href="#" class="fl-modal" data-modal="terms">Terms of Service</a></li>
        <li><a href="#" class="fl-modal" data-modal="security">Security</a></li>
        <li><a href="#" class="fl-modal" data-modal="cookies">Cookies</a></li>
      </ul>
    </div>
  </div>
  <div class="foot-bottom">
    <div class="foot-copy">© 2026 RELLAX Inc. All rights reserved.</div>
    <div class="foot-legal">
      <a href="#" class="fl-modal" data-modal="privacy">Privacy</a>
      <a href="#" class="fl-modal" data-modal="terms">Terms</a>
      <a href="#" class="fl-modal" data-modal="sitemap">Sitemap</a>
    </div>
  </div>
</footer>

<div id="modalOverlay" aria-hidden="true">
  <div id="modalPanel" role="dialog" aria-modal="true">
    <div id="modalHead">
      <span id="modalTag"></span>
      <button id="modalClose" aria-label="Close"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1l12 12M13 1L1 13" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg></button>
    </div>
    <div id="modalScroll">
      <h2 id="modalTitle"></h2>
      <div id="modalDate"></div>
      <div id="modalBody"></div>
    </div>
  </div>
</div>
`;

const initScript = `
(function() {
  // Scroll reveal
  var io = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.09, rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.reveal,.rl,.rr').forEach(function(el) { io.observe(el); });

  // Nav shadow
  var nav = document.getElementById('mainNav');
  window.addEventListener('scroll', function() { if(nav) nav.classList.toggle('scrolled', window.scrollY > 16); }, {passive:true});

  // Skill bar animation
  var barWrap = document.querySelector('.sa-card');
  if (barWrap) {
    var barObs = new IntersectionObserver(function(entries) {
      if (entries[0].isIntersecting) {
        document.querySelectorAll('.sk-fill').forEach(function(b) {
          var w = b.style.width; b.style.width = '0%';
          requestAnimationFrame(function() { requestAnimationFrame(function() { b.style.width = w; }); });
        });
        barObs.disconnect();
      }
    }, { threshold: 0.3 });
    barObs.observe(barWrap);
  }

  // Modal system
  var overlay  = document.getElementById('modalOverlay');
  var tagEl    = document.getElementById('modalTag');
  var titleEl  = document.getElementById('modalTitle');
  var dateEl   = document.getElementById('modalDate');
  var bodyEl   = document.getElementById('modalBody');
  var closeBtn = document.getElementById('modalClose');

  var CONTENT = {
    integrations: { tag:'Product', title:'Integrations', date:'Current as of March 2026', body:'<p>RELLAX connects with the tools your team already uses. Our integration layer is plug-and-play.</p><div class="int-grid"><div class="int-card"><div class="int-name">Workday</div><div class="int-desc">Sync employee records and role assignments automatically.</div><span class="int-status st-live">Live</span></div><div class="int-card"><div class="int-name">BambooHR</div><div class="int-desc">Pull hire data and push onboarding status back in real time.</div><span class="int-status st-live">Live</span></div><div class="int-card"><div class="int-name">Slack</div><div class="int-desc">Send learning reminders and milestone updates directly to employees.</div><span class="int-status st-live">Live</span></div><div class="int-card"><div class="int-name">Google Workspace</div><div class="int-desc">Import org structure and auto-assign roles based on directory data.</div><span class="int-status st-live">Live</span></div><div class="int-card"><div class="int-name">Microsoft Teams</div><div class="int-desc">Deliver in-app learning nudges within the Teams environment.</div><span class="int-status st-soon">Coming soon</span></div><div class="int-card"><div class="int-name">REST API</div><div class="int-desc">Full programmatic access to build any custom integration you need.</div><span class="int-status st-live">Live</span></div></div>' },
    about: { tag:'Company', title:'About RELLAX', date:'Founded 2025 · Bengaluru, India', body:'<p>RELLAX was born from a single observation: corporate onboarding is broken. Static curricula waste the time of experienced hires, overwhelm beginners, and leave HR with no real signal on readiness.</p><h3>Our mission</h3><p>To make every employee first days a precise, personalised journey that respects what they already know and focuses on what they need next.</p><h3>What we built</h3><p>RELLAX is not an LMS. It is a decision engine. It reads resumes, parses job descriptions, maps both against a skill taxonomy, computes the exact gap, and generates a sequenced path — automatically, in under a second.</p><h3>Get in touch</h3><p>Reach us at <a href="mailto:hello@rellax.ai">hello@rellax.ai</a></p>' },
    blog: { tag:'Company', title:'Blog', date:'Latest writing from the RELLAX team', body:'<div class="blog-post"><span class="bp-tag">Product</span><div class="bp-title">How RELLAX computes skill gaps in under a second</div><div class="bp-date">March 14, 2026</div></div><div class="blog-post"><span class="bp-tag">Research</span><div class="bp-title">The real cost of one-size-fits-all onboarding</div><div class="bp-date">February 28, 2026</div></div><div class="blog-post"><span class="bp-tag">Engineering</span><div class="bp-title">Building a skill taxonomy that works at scale</div><div class="bp-date">February 12, 2026</div></div><div class="blog-post"><span class="bp-tag">Company</span><div class="bp-title">Why we started RELLAX</div><div class="bp-date">January 10, 2026</div></div>' },
    careers: { tag:'Company', title:'Careers', date:'We are hiring · Bengaluru & Remote', body:'<p>We are building a small, exceptional team. If you care deeply about the craft, we would love to talk.</p><h3>Open roles</h3><div class="career-card"><div class="cc-title">Senior Full-Stack Engineer</div><div class="cc-meta"><span class="cc-tag">Full-time</span><span class="cc-tag">Bengaluru / Remote</span></div></div><div class="career-card"><div class="cc-title">AI / ML Engineer</div><div class="cc-meta"><span class="cc-tag">Full-time</span><span class="cc-tag">Bengaluru / Remote</span></div></div><div class="career-card"><div class="cc-title">Product Designer</div><div class="cc-meta"><span class="cc-tag">Full-time</span><span class="cc-tag">Bengaluru</span></div></div><h3>How to apply</h3><p>Send your resume to <a href="mailto:careers@rellax.ai">careers@rellax.ai</a></p>' },
    contact: { tag:'Company', title:'Contact us', date:'We usually respond within one business day', body:'<p>Have a question or partnership enquiry? Email us at <a href="mailto:hello@rellax.ai">hello@rellax.ai</a></p><div class="modal-divider"></div><div class="modal-field"><label>Your name</label><input type="text" placeholder="Jane Smith"/></div><div class="modal-field"><label>Work email</label><input type="email" placeholder="jane@company.com"/></div><div class="modal-field"><label>Message</label><textarea placeholder="Tell us what you\'re looking for\u2026"></textarea></div><button class="modal-submit">Send message \u2192</button>' },
    privacy: { tag:'Legal', title:'Privacy Policy', date:'Effective 1 January 2026', body:'<h3>What we collect</h3><p>We collect your name, email, and company name when you sign up. We do not collect browsing data or sell your information to any third party.</p><h3>Resume data</h3><p>Resumes are processed by our AI to extract skill signals. Data is encrypted at rest and in transit, used exclusively to generate learning paths within your organisation.</p><h3>Your rights</h3><p>Request access, correction, or deletion at <a href="mailto:privacy@rellax.ai">privacy@rellax.ai</a>. We action all requests within 7 business days.</p>' },
    terms: { tag:'Legal', title:'Terms of Service', date:'Effective 1 January 2026', body:'<h3>Acceptance</h3><p>By using the RELLAX platform, you agree to these Terms of Service.</p><h3>Use of the platform</h3><p>RELLAX grants a limited, non-exclusive licence to use the platform for internal onboarding purposes. You may not resell or sublicence any part of the platform.</p><h3>Intellectual property</h3><p>All platform software, design, and AI models are the exclusive property of RELLAX Inc. You retain ownership of all data you upload.</p><h3>Contact</h3><p>For legal enquiries, write to <a href="mailto:legal@rellax.ai">legal@rellax.ai</a></p>' },
    security: { tag:'Legal', title:'Security', date:'Last updated March 2026', body:'<h3>Our commitment</h3><p>Security is foundational to RELLAX. We handle sensitive employee data and treat that responsibility seriously.</p><h3>Encryption</h3><p>All data is encrypted in transit using TLS 1.3 and at rest using AES-256.</p><h3>Infrastructure</h3><p>RELLAX is hosted on SOC 2 Type II compliant infrastructure. We conduct regular penetration testing and dependency audits.</p><h3>Responsible disclosure</h3><p>Report vulnerabilities to <a href="mailto:security@rellax.ai">security@rellax.ai</a>. We acknowledge all reports within 24 hours.</p>' },
    cookies: { tag:'Legal', title:'Cookie Policy', date:'Effective 1 January 2026', body:'<h3>Cookies we use</h3><ul><li><strong>Strictly necessary:</strong> Session authentication and CSRF protection. Cannot be disabled.</li><li><strong>Functional:</strong> Remember preferences. Can be disabled.</li><li><strong>Analytics:</strong> Privacy-preserving analytics only. No ad tracking.</li></ul><h3>What we do not use</h3><p>We do not use advertising cookies or share data with ad networks.</p>' },
    sitemap: { tag:'Navigation', title:'Sitemap', date:'RELLAX — all pages', body:'<h3>Main</h3><ul><li><a href="#">Home</a></li><li><a href="#how">How it works</a></li><li><a href="#features">Features</a></li><li><a href="#engine">AI Engine</a></li><li><a href="#cta">Sign up</a></li></ul><h3>Company</h3><ul><li>About</li><li>Blog</li><li>Careers</li><li>Contact</li></ul><h3>Legal</h3><ul><li>Privacy Policy</li><li>Terms of Service</li><li>Security</li><li>Cookie Policy</li></ul>' }
  };

  function openModal(key) {
    var c = CONTENT[key];
    if (!c || !overlay) return;
    if (tagEl) tagEl.textContent = c.tag;
    if (titleEl) titleEl.textContent = c.title;
    if (dateEl) dateEl.textContent = c.date;
    if (bodyEl) bodyEl.innerHTML = c.body;
    overlay.classList.add('open');
    overlay.removeAttribute('aria-hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!overlay) return;
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (overlay) overlay.addEventListener('click', function(e) { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', function(e) { if (e.key === 'Escape') closeModal(); });

  document.querySelectorAll('.fl-modal').forEach(function(el) {
    el.addEventListener('click', function(e) {
      e.preventDefault();
      var key = el.getAttribute('data-modal');
      if (key) openModal(key);
    });
  });
})();
`;

export default function Home() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div dangerouslySetInnerHTML={{ __html: bodyHTML }} />
      <Script id="rellax-init" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: initScript }} />
    </>
  );
}
