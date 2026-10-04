'use strict';
document.documentElement.classList.add('js');
/* Computer Lab. Layout: DATA -> 3D VIEWER -> UI SECTIONS. Add content in the DATA block. */
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const CALM=matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ================= DATA (extend here) ================= */
// D = depth, H = height, T = width (3D units, 1 unit = 10 cm); ff = largest board (1 ITX, 2 mATX, 3 ATX, 4 E-ATX); gpu = max card mm
const CASES={
 atx:{n:'ATX minora',D:4.6,H:5,T:2.2,ff:3,gpu:400,c:0x26282b},
 mid:{n:'Oʻrta minora',D:4.2,H:4.5,T:2,ff:3,gpu:360,c:0x2f3134},
 compact:{n:'Ixcham minora',D:3.6,H:3.7,T:1.8,ff:2,gpu:300,c:0x3b3d41},
 itx:{n:'Mini-ITX korpus',D:3,H:3.1,T:1.6,ff:1,gpu:320,c:0xb9bbbe},
 glass:{n:'Shisha oʻyin korpusi',D:4.3,H:4.7,T:2.1,ff:3,gpu:420,c:0x141517},
 work:{n:'Professional ish stansiyasi korpusi',D:5,H:5.3,T:2.4,ff:4,gpu:450,c:0x85888c}};
const MOBOS={
 itx5:{n:'Mini-ITX, DDR5',ff:1,ram:'DDR5'},matx4:{n:'Micro-ATX, DDR4',ff:2,ram:'DDR4'},
 atx4:{n:'ATX, DDR4',ff:3,ram:'DDR4'},atx5:{n:'ATX, DDR5',ff:3,ram:'DDR5'},atx3:{n:'ATX, DDR3 (eski)',ff:3,ram:'DDR3',old:1}};
// [nomi, odatiy uzunligi mm (modelga qarab farq qiladi), odatiy quvvati W]
const GPUS=[['RTX 3060',242,170],['RTX 3070',242,220],['RTX 3080',285,320],['RTX 4060',240,115],['RTX 4070',244,200],['RTX 4080',304,320],['RTX 4090',336,450],['RTX 5060',240,145],['RTX 5070',270,250],['RTX 5080',304,360],['RTX 5090',304,575]];
const CPUS={i5:['Intel Core i5',.8],i7:['Intel Core i7',.9],i9:['Intel Core i9',1.05],r5:['AMD Ryzen 5',.8],r7:['AMD Ryzen 7',.9],r9:['AMD Ryzen 9',1.05]};
const STO={hdd:'HDD',sata:'SATA SSD',m2sata:'M.2 SATA SSD',nvme:'M.2 NVMe SSD',pcie:'PCIe NVMe karta'};
// n=nomi f=toʻliq nomi d=vazifasi w=joylashuvi y=nega muhim t=turlari s=namunaviy xususiyatlar b=yangi boshlovchiga tushuntirish
const INFO={
 case:{n:'Korpus',f:'Shassi',d:'Barcha qismlarni ushlab turadi, himoya qiladi va sovitadi.',w:'Tashqi qobiq.',y:'Qaysi plata va GPU sigʻishini hamda havo oqimini belgilaydi.',t:'Full tower, oʻrta minora, mini-ITX, ixcham (SFF)',s:'ATX oʻrta minora: ~45 sm balandlik, 36 sm gacha GPU sigʻadi',b:'Kompyuterning skeleti va terisi.'},
 glass:{n:'Yon panel',f:'Chiniqtirilgan shisha oyna',d:'Ichini koʻrsatadi va changdan himoya qiladi.',w:'Korpusning chap tomonida.',y:'Qismlarga yetish uchun shuni ochasiz.',t:'Chiniqtirilgan shisha, poʻlat, toʻr',s:'3–4 mm chiniqtirilgan shisha',b:'Oyna. Hamma narsaga yetish uchun oching.'},
 mobo:{n:'Ona plata',f:'Asosiy elektron plata',d:'Barcha komponentlarni bogʻlaydi va ularning oʻzaro aloqasini taʼminlaydi.',w:'Korpusning orqa devoriga yotqizib oʻrnatiladi.',y:'Qaysi CPU, RAM turi va disklar ishlatilishini belgilaydi.',t:'ATX, Micro-ATX, Mini-ITX',s:'ATX 305×244 mm, 4 ta RAM uyasi, PCIe x16, M.2 uyalari',b:'Barcha binolarni bogʻlovchi shahar yoʻllari.'},
 cpu:{n:'CPU',f:'Markaziy protsessor',d:'Dasturlarni bajaradi va umumiy hisob-kitoblarning koʻpini qiladi.',w:'Soket ichida, sovitgich ostida.',y:'Tezligi va yadrolari soni hamma narsa qanchalik tez ishlashini belgilaydi.',t:'Intel Core, AMD Ryzen',s:'8 yadro, 16 oqim, 3.5–5.5 GHz',b:'Koʻrsatmalarga amal qiladigan miya.'},
 cooler:{n:'CPU sovitgichi',f:'Radiator va ventilyator',d:'CPU issiqligini olib ketadi. Termopasta ular orasidagi mayda boʻshliqlarni toʻldiradi.',w:'CPU ustida.',y:'Qizib ketgan CPU oʻzini himoya qilish uchun sekinlashadi.',t:'Havoli minora, AIO suyuqlik',s:'120–140 mm ventilyator, 4–6 mis issiqlik trubkasi',b:'Miyani sovuq saqlaydigan radiator.'},
 ram:{n:'RAM',f:'Operativ xotira',d:'Hozir ishlayotgan ishlaringiz uchun tez va vaqtinchalik xotira.',w:'CPU yonidagi DIMM uyalarida.',y:'RAM koʻp boʻlsa, koʻproq ilova ochiq tura oladi. Oʻchirilganda mazmuni yoʻqoladi.',t:'DDR3, DDR4, DDR5 (bir-biriga mos kelmaydi)',s:'DDR5-6000, 2×16 GB',b:'Ish stolingiz: stol katta boʻlsa, koʻproq narsa ochiq turadi.'},
 m2:{n:'Xotira diski (M.2 / PCIe)',f:'Qattiq holatli disk',d:'Fayllaringizni doimiy saqlaydi, harakatlanuvchi qismlarsiz.',w:'Ona plataning M.2 uyasida yoki PCIe uyasida.',y:'Disk tezligi yoqilish va yuklanish vaqtini belgilaydi.',t:'M.2 SATA, M.2 NVMe, PCIe NVMe',s:'NVMe Gen4: ~7 000 MB/s gacha',b:'Fayl shkafingiz, lekin juda tez.'},
 sata:{n:'SATA SSD',f:'2.5" qattiq holatli disk',d:'SATA interfeysi orqali doimiy xotira.',w:'Disk oʻrnida, plata va PSUga kabel bilan ulanadi.',y:'Qattiq diskka nisbatan arzon va katta yangilanish.',t:'2.5" SATA SSD',s:'~550 MB/s, 500 GB dan 4 TB gacha',b:'Tez shkaf, lekin eski va sekinroq yoʻldan foydalanadi.'},
 hdd:{n:'HDD',f:'Qattiq disk',d:'Maʼlumotni aylanuvchi magnit disklarda saqlaydi.',w:'3.5" disk oʻrni.',y:'Koʻp terabaytni saqlashning eng arzon yoʻli.',t:'3.5" stol kompyuteri, 2.5" noutbuk',s:'7200 RPM, ~160 MB/s, 1–20 TB',b:'Maʼlumot uchun gramofon: arzon va sigʻimli, lekin sekin.'},
 gpu:{n:'GPU',f:'Grafik protsessor',d:'Tasvir, video va 3D grafikani hamda sunʼiy intellekt yuklarini qayta ishlaydi.',w:'PCIe x16 uyasida, ventilyatorlari pastga qaragan.',y:'Oʻyinlar, renderlash va AI shunga bogʻliq.',t:'Integratsiyalangan yoki alohida (GeForce, Radeon)',s:'12 GB GDDR6, PCIe 4.0 x16, 200 W',b:'Minglab mayda ishni bir vaqtda qiladigan katta jamoa.'},
 psu:{n:'PSU',f:'Quvvat bloki',d:'Rozetkadagi oʻzgaruvchan tokni qismlarga kerakli past kuchlanishli oʻzgarmas tokka aylantiradi.',w:'Korpusning pastki orqa qismida.',y:'Kuchsiz PSU nosozlik keltiradi. Sifatli PSU qismlarni himoya qiladi.',t:'ATX, SFX; 80 Plus sertifikatli',s:'750 W, 80 Plus Gold',b:'Har bir qismga quvvat yuboradigan yurak.'},
 fans:{n:'Korpus ventilyatorlari',f:'Havo oqimi ventilyatorlari',d:'Sovuq havoni tortadi, issiq havoni chiqaradi.',w:'Old (havo kirishi) va orqa (havo chiqishi) qismda.',y:'Yaxshi havo oqimi qismlar sekinlashib qolmasligini taʼminlaydi.',t:'120 mm, 140 mm; PWM yoki DC',s:'120 mm, ~1 500 RPM',b:'Oʻpka: sovuq havo kiradi, issiq chiqadi.'},
 cables:{n:'Kabellar',f:'Quvvat kabellari',d:'PSUdan ona plata va GPUga quvvat olib boradi.',w:'PSUdan ona plata va GPUgacha.',y:'Boʻshashgan yoki yetishmagan kabel degani quvvat yoʻq.',t:'24-pin ATX, 8-pin CPU, PCIe 8-pin, 12VHPWR',s:'24-pin asosiy quvvat',b:'Quvvat tashuvchi tomirlar.'}};
const CAT={case:'korpus case',glass:'korpus case panel',mobo:'ona plata motherboard',cpu:'protsessor cpu',cooler:'sovitish cooling',ram:'xotira ram',m2:'xotira disk ssd nvme m2 pcie storage',sata:'xotira disk ssd sata storage',hdd:'xotira disk hdd storage',gpu:'videokarta gpu grafika',psu:'quvvat psu power',fans:'sovitish ventilyator fans',cables:'quvvat kabel power'};
const TECH=[
 ['HDD','SATA 6 Gb/s','3.5" quti, 100×147 mm',160,'Katta hajm va zaxira nusxalar','TB boshiga eng arzon, juda katta sigʻim','Sekin, shovqinli, harakatlanuvchi qismlari bor'],
 ['SATA SSD','SATA 6 Gb/s','2.5" korpus, 7 mm qalinlik',550,'Eski PClarda asosiy disk','Harakatlanuvchi qism yoʻq, arzon, oddiy','SATA tezligi bilan cheklangan'],
 ['M.2 SATA SSD','SATA protokoli ishlatuvchi M.2 uyasi','Tayoqcha, 22×80 mm',550,'Kabelsiz ixcham yigʻmalar','Kabelsiz, juda kichik','SATA SSD bilan bir xil tezlik'],
 ['M.2 NVMe SSD','M.2 uyasi, PCIe x4 liniya, NVMe protokoli','Tayoqcha, 22×80 mm',7000,'Asosiy disk, oʻyinlar, video montaj','Juda tez, kabelsiz','Yuk ostida sovitish radiatori kerak'],
 ['PCIe NVMe karta','Toʻliq oʻlchamli PCIe uyasi (x4 yoki x8), NVMe','Kengaytirish kartasi',12000,'Ish stansiyalari va serverlar','Eng tez, katta sovitish yuzasi','Qimmatli PCIe uyasini band qiladi']];
const FOUR=[['M.2','Shakl','Jismoniy shakl: kichik tayoqcha va uning uyasi. SATA yoki PCIe signallarini olib oʻta oladi.'],['NVMe','Til','Flesh xotira uchun yaratilgan protokol. Koʻp soʻrov parallel, kechikish kam. PCIe ustida ishlaydi.'],['PCIe','Yoʻl','Liniyalardan (x1, x4, x16) iborat yuqori tezlikli shina. GPU va NVMe disklar ishlatadi.'],['SATA','Eski yoʻl va til','HDD va SATA SSD uchun standart. Taxminan 600 MB/s da toʻxtaydi.']];
const STEPS=[
 ['Korpusni tanlang','Plata va GPUga mos korpus tanlang. U hamma narsaning ramasi.',['case','glass'],'case'],
 ['Ona platani oʻrnating','Platani tayanch vintlarga mahkamlang, orqa I/O panelini toʻgʻrilab.',['mobo'],'mobo'],
 ['CPUni oʻrnating','Oltin uchburchakni soket burchagiga moslang. Qoʻyib yuboring, hech qachon zoʻrlamang.',['cpu'],'cpu'],
 ['RAMni oʻrnating','Kesikni moslang, ikki chetini qisqichlar “klik” qilguncha bosing.',['ram'],'ram'],
 ['M.2 SSDni oʻrnating','Uni M.2 uyasiga qiya qilib kiriting, bosing va bitta vint bilan mahkamlang.',['m2'],'m2'],
 ['GPUni oʻrnating','Uya qulfini oching, kartani yuqori PCIe x16 uyasiga bosing va qavsni vintlang.',['gpu'],'gpu'],
 ['PSUni oʻrnating','PSUni pastga, ventilyatori havo teshigiga qaragan holda mahkamlang. Disklarni qoʻshing.',['psu','sata','hdd'],'psu'],
 ['Kabellarni ulang','24-pin plata quvvati, CPU quvvati va GPU quvvatini ulang.',['cables'],'cables'],
 ['Sovitishni oʻrnating','Termopasta suring, CPU sovitgichini mahkamlang va ventilyatorlarni ulang.',['cooler','fans'],'cooler'],
 ['Kompyuterni yoqing','Panelni yoping va yoqish tugmasini bosing. Ventilyatorlar aylanadi, BIOS tekshiruvni boshlaydi.',[],'case']];
const QUIZ=[
 ['Fayllaringizni doimiy saqlaydigan komponent qaysi?',['RAM','SSD yoki HDD','CPU','PSU'],1,'RAM oʻchganda hamma narsani unutadi. Disklar fayllarni saqlaydi.'],
 ['GPU nimaning qisqartmasi?',['Umumiy protsessor bloki','Grafik protsessor bloki','Katta quvvat bloki','Grafik port vositasi'],1,'U grafika, video, 3D va AI ni qayta ishlaydi.'],
 ['Odatda M.2 + NVMe ishlatadigan xotira qaysi?',['Qattiq disk','Disketa','Tez SSD','Optik disk yurituvchi'],2,'M.2 shakl, NVMe esa PCIe ustidagi protokol.'],
 ['DDR4 RAMni DDR5 ona plataga oʻrnatish mumkinmi?',['Ha','Yoʻq, kesik va signallar boshqacha','Faqat adapter bilan','Faqat 8 GB lik'],1,'Har bir DDR avlodining kesigi turli joyda.'],
 ['PSU nima qiladi?',['Maʼlumot saqlaydi','CPUni sovitadi','Rozetka quvvatini qismlarga moslaydi','Grafika chizadi'],2,'U rozetkadagi AC ni komponentlar uchun DC ga aylantiradi.'],
 ['Umumiy hisob-kitoblarning koʻpini qaysi komponent bajaradi?',['CPU','GPU','PSU','SSD'],0,'CPU umumiy maqsadli protsessor.']];

/* ================= 3D HELPERS ================= */
const mat=(c,m=.4,r=.5,o={})=>new THREE.MeshStandardMaterial(Object.assign({color:c,metalness:m,roughness:r},o));
function box(w,h,d,m,x=0,y=0,z=0){const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);o.position.set(x,y,z);o.castShadow=o.receiveShadow=true;return o}
function group(...k){const g=new THREE.Group();k.forEach(o=>g.add(o));return g}
const BRASS=()=>mat(0xc99a2e,.6,.3,{emissive:0x3a2a05});
/** Fan facing +z. Blades are pushed to `spin` so the loop can rotate them. */
function makeFan(r,spin){
 const g=group(box(r*2.2,r*2.2,.08,mat(0x0e0f10,.3,.6),0,0,-.04),new THREE.Mesh(new THREE.TorusGeometry(r,.035,6,32),mat(0x1a1b1d,.6,.3)));
 const s=new THREE.Group(),blade=mat(0x4a4d52,.3,.4);
 for(let i=0;i<7;i++){const a=new THREE.Group(),b=box(r*.8,r*.34,.015,blade,r*.52,0,0);b.rotation.x=.5;a.rotation.z=i*Math.PI*2/7;a.add(b);s.add(a)}
 const hub=new THREE.Mesh(new THREE.CylinderGeometry(r*.2,r*.2,.07,16),BRASS());hub.rotation.x=Math.PI/2;s.add(hub);
 g.add(s);spin.push(s);return g}
const tube=(pts,r=.05)=>{const m=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map(p=>new THREE.Vector3(...p))),28,r,6),mat(0x090a0b,0,.7));m.castShadow=true;return m};

/* ================= VIEWER ================= */
class Viewer{
 constructor(canvas){
  this.canvas=canvas;this.parts={};this.spin=[];this.sel=null;this.powered=true;
  this.t={explode:0,open:0,inside:0};this.cur={explode:0,open:0,inside:0};this.fly=0;
  const r=this.r=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true});
  r.setPixelRatio(Math.min(devicePixelRatio,2));r.shadowMap.enabled=true;r.shadowMap.type=THREE.PCFSoftShadowMap;
  r.toneMapping=THREE.ACESFilmicToneMapping;r.outputEncoding=THREE.sRGBEncoding;
  this.scene=new THREE.Scene();
  this.cam=new THREE.PerspectiveCamera(36,1,.1,100);this.camGoal=new THREE.Vector3(7.5,2.6,9);this.cam.position.copy(this.camGoal);
  this.controls=new THREE.OrbitControls(this.cam,canvas);
  Object.assign(this.controls,{enableDamping:true,dampingFactor:.08,minDistance:4,maxDistance:22,maxPolarAngle:Math.PI*.55});
  this.goal=new THREE.Vector3();this.initEnv();this.initLights();
  this.floor=new THREE.Mesh(new THREE.PlaneGeometry(40,40),new THREE.ShadowMaterial({opacity:.4}));this.floor.rotation.x=-Math.PI/2;this.floor.receiveShadow=true;this.scene.add(this.floor);
  this.ray=new THREE.Raycaster();this.down=null;
  canvas.addEventListener('pointerdown',e=>this.down=[e.clientX,e.clientY]);
  canvas.addEventListener('pointerup',e=>{if(this.down&&Math.hypot(e.clientX-this.down[0],e.clientY-this.down[1])<5)this.pick(e)});
  new ResizeObserver(()=>this.resize()).observe(canvas.parentNode);
  this.clock=new THREE.Clock();this.loop=this.loop.bind(this);this.loop();
 }
 initEnv(){ // tiny studio room baked into reflections
  const e=new THREE.Scene();e.add(new THREE.Mesh(new THREE.BoxGeometry(30,30,30),new THREE.MeshBasicMaterial({color:0x2a2b2e,side:THREE.BackSide})));
  [[0,12,0,10,10],[12,3,4,2,8],[-12,3,-4,2,8]].forEach(([x,y,z,w,h],i)=>{const p=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({color:new THREE.Color(5,5,5),side:2}));p.position.set(x,y,z);if(i==0)p.rotation.x=Math.PI/2;else p.rotation.y=Math.PI/2;e.add(p)});
  const pm=new THREE.PMREMGenerator(this.r);this.scene.environment=pm.fromScene(e).texture;pm.dispose()}
 initLights(){
  const k=new THREE.DirectionalLight(0xffffff,1.6);k.position.set(5,9,7);k.castShadow=true;k.shadow.mapSize.set(2048,2048);
  Object.assign(k.shadow.camera,{left:-8,right:8,top:8,bottom:-8,near:1,far:30});k.shadow.bias=-.0004;
  this.scene.add(k,new THREE.HemisphereLight(0xffffff,0x222222,.4))}
 resize(){const p=this.canvas.parentNode,w=p.clientWidth,h=p.clientHeight;if(!w||!h)return;this.r.setSize(w,h,false);this.cam.aspect=w/h;this.cam.updateProjectionMatrix()}

 /** (Re)build the whole PC from a config. ~100 meshes, cheap to rebuild. */
 build(S){
  if(this.pc){this.scene.remove(this.pc);this.pc.traverse(o=>{o.geometry&&o.geometry.dispose();o.material&&o.material.dispose()})}
  const c=CASES[S.case],mb=MOBOS[S.mobo],gp=GPUS[S.gpu],{D,H,T}=c,ff=mb.ff;
  const cs=CPUS[S.cpu][1]*[.75,.9,1,1][ff-1],mw=[1.95,2.8,3.5,3.5][ff-1],mh=[1.95,2.8,2.8,2.8][ff-1];
  const mx=-D/2+.35+mw/2,my=H/2-.5-mh/2,zs=-T/2+.23,cx=mx-mw*.1,cy=my+mh*.14;
  this.pc=new THREE.Group();this.parts={};this.spin=[];
  const add=(id,g,ex=[0,0,0],base=[0,0,0])=>{g.userData.id=id;this.parts[id]={g,ex:new THREE.Vector3(...ex),base:new THREE.Vector3(...base)};this.pc.add(g)};
  // case shell (panels fade in Inside Mode)
  this.shell=mat(c.c,.7,.35,{transparent:true});const sh=this.shell,bar=(w,h,d,x,y,z)=>box(w,h,d,sh,x,y,z);
  add('case',group(bar(D,H,.06,0,0,-T/2),bar(D,.06,T,0,-H/2,0),bar(D,.06,T,0,H/2,0),bar(.06,H,T,-D/2,0,0),
   bar(.1,H,.14,D/2,0,T/2-.07),bar(.1,H,.14,D/2,0,-T/2+.07),bar(.1,.14,T,D/2,H/2-.07,0),bar(.1,.14,T,D/2,-H/2+.07,0),
   ...[[-1,-1],[1,-1],[-1,1],[1,1]].map(([a,b])=>bar(.3,.12,.3,a*(D/2-.3),-H/2-.09,b*(T/2-.3)))),[0,-1.2,-1.5]);
  this.glassMat=new THREE.MeshPhysicalMaterial({color:0xcfd5d9,metalness:0,roughness:.04,transparent:true,opacity:.16,depthWrite:false});
  const gl=new THREE.Mesh(new THREE.BoxGeometry(D,H,.03),this.glassMat);gl.position.x=-D/2;
  const glassG=group(gl);add('glass',glassG,[0,0,3],[D/2,0,T/2]);
  // motherboard + heatsinks
  const metal=mat(0x9a9da1,.9,.3);
  add('mobo',group(box(mw,mh,.06,mat(0x202224,.2,.6),mx,my,zs),box(.45,mh*.45,.26,metal,cx-.75*cs-.15,cy,zs+.14),box(mw*.5,.2,.26,metal,cx,my+mh/2-.2,zs+.14),
   box(.6,.6,.12,metal,mx+mw*.28,my-mh*.3,zs+.08),box(.5,.14,.1,mat(0x111213),mx-mw*.3,my-mh*.15,zs+.06)),[0,.5,-1.2]);
  add('cpu',group(box(.42,.42,.05,mat(0xc9ccd0,.9,.25),cx,cy,zs+.06)),[0,1.6,.8]);
  const cz=zs+.06+.3*cs,fan1=makeFan(.5*cs,this.spin);fan1.rotation.y=Math.PI/2;fan1.position.set(cx+.25*cs+.04,cy,cz);
  add('cooler',group(box(.5*cs,1.25*cs,.6*cs,mat(0x8c8f94,.9,.35),cx,cy,cz),fan1),[1.2,1.2,1.4]);
  // RAM: colour hints the generation
  const n=Math.min(4,{8:1,16:2,32:2,64:4}[S.gb]),ramC={DDR3:0x2f6b49,DDR4:0x6e7278,DDR5:0xd5d7da}[S.ram],ram=new THREE.Group();
  for(let i=0;i<n;i++){const x=cx+1.05*cs+.55+i*.17;ram.add(box(.07,mh*.4,.5,mat(ramC,.5,.4),x,cy,zs+.28),box(.095,.05,.54,BRASS(),x,cy+mh*.17,zs+.28))}
  add('ram',ram,[1.2,1.4,.8]);
  // storage: one primary drive + (in lab view) the others
  const st=S.sto;
  if(st==='nvme'||st==='m2sata')add('m2',group(box(.9,.22,.025,mat(st==='nvme'?0x1c1d1f:0x2f6b49,.3,.5),cx-.1,my-.3,zs+.05),...(st==='nvme'?[box(.95,.26,.05,metal,cx-.1,my-.3,zs+.1)]:[])),[-1.2,1,1.5]);
  if(st==='pcie')add('m2',group(box(1.2,.04,.5,mat(0x1c1d1f,.3,.5),cx,my-mh*.45,zs+.35),box(.5,.14,.4,metal,cx+.1,my-mh*.45+.1,zs+.35)),[-1.2,1,1.5]);
  const dz=T/2-.75;
  if(S.lab||st==='sata')add('sata',group(box(1,.1,.7,mat(0x1d1e20,.5,.4),D/2-1.1,-H/2+.8,dz),box(.6,.11,.4,BRASS(),D/2-1.1,-H/2+.8,dz)),[0,1,2]);
  if(S.lab||st==='hdd')add('hdd',group(box(1.4,.34,.95,mat(0x9a9da1,.85,.35),D/2-1.1,-H/2+.3,dz),box(1.2,.35,.6,mat(0x111213,.4,.6),D/2-1.1,-H/2+.3,dz)),[0,.2,2]);
  // GPU: horizontal card, fans face down (as in a real case)
  const L=Math.min(gp[1]/100,D-.9),gx=-D/2+.5+L/2,gy=my-mh*.32,gz=zs+.72;
  add('gpu',group(box(L,.52,1.2,mat(0x2a2c2f,.6,.35),gx,gy,gz),box(L*.75,.03,.02,BRASS(),gx,gy+.1,gz+.61),box(.04,.7,1.2,metal,-D/2+.4,gy,gz),
   ...[0,1,2].map(i=>box(.3,.02,.5,mat(0x111213),gx-L/3+i*L/3,gy+.27,gz))),[0,-1.4,1.8]);
  // PSU with its own fan
  const pd=Math.min(T*.8,1.6),px=-D/2+1,py=-H/2+.55,pf=makeFan(.32,this.spin);pf.position.set(px,py,pd/2+.02);
  add('psu',group(box(1.7,.9,pd,mat(0x1d1e20,.5,.5),px,py,0),pf),[-1,-.6,1.5]);
  // case fans: two front intake, one rear exhaust
  const ff1=[[D/2-.15,H*.2,0,1],[D/2-.15,-H*.05,0,1],[-D/2+.2,my+mh/2-.5,0,-1]].map(([x,y,z,s])=>{const f=makeFan(.5,this.spin);f.rotation.y=s*Math.PI/2;f.position.set(x,y,z);return f});
  add('fans',group(...ff1),[1.8,0,0]);
  add('cables',group(tube([[px+.3,py+.4,.3],[px+.9,py+.9,T/2-.3],[mx+mw/2-.1,my-.6,zs+.5],[mx+mw/2-.1,my+.4,zs+.12]]),tube([[px+.6,py+.45,.1],[px+1.6,py+.8,.5],[gx+L/2-.35,gy-.1,zs+.5]])),[0,-.4,1.2]);
  this.scene.add(this.pc);this.floor.position.y=-H/2-.2;this.goal.set(0,0,0);
  this.hidden=this.hidden||new Set();this.apply();this.highlight(this.sel)}
 apply(){for(const id in this.parts)this.parts[id].g.visible=!this.hidden.has(id)&&(!this.only||this.only.has(id))}
 setOnly(ids){this.only=ids?new Set(ids):null;this.apply()}
 toggleHide(id){this.hidden.has(id)?this.hidden.delete(id):this.hidden.add(id);this.apply()}
 highlight(id){this.sel=id;for(const k in this.parts)this.parts[k].g.traverse(o=>{if(o.isMesh&&o.material.emissive&&k!=='glass'&&o.material.color.getHex()!==0xc99a2e)o.material.emissive.setHex(k===id?0x5a4210:0)})}
 focus(id){const p=this.parts[id];if(!p)return;const b=new THREE.Box3().setFromObject(p.g),c=b.getCenter(new THREE.Vector3());
  this.goal.copy(c);const dir=this.cam.position.clone().sub(this.controls.target).normalize();this.camGoal.copy(c).addScaledVector(dir,Math.max(5,b.getSize(new THREE.Vector3()).length()*1.6));this.fly=1.4}
 reset(){this.goal.set(0,0,0);this.camGoal.set(7.5,2.6,9);this.fly=1.4}
 pick(e){const r=this.canvas.getBoundingClientRect();this.ray.setFromCamera(new THREE.Vector2((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1),this.cam);
  const hits=this.ray.intersectObjects(this.pc.children.filter(g=>g.visible),true).map(h=>{let o=h.object;while(o&&!o.userData.id)o=o.parent;return o&&o.userData.id}).filter(Boolean);
  const id=hits.find(i=>i!=='glass')||hits[0];this.onSelect&&this.onSelect(id||null)}
 loop(){requestAnimationFrame(this.loop);const dt=Math.min(this.clock.getDelta(),.05),k=1-Math.pow(.0005,dt);
  for(const a in this.t)this.cur[a]+=(this.t[a]-this.cur[a])*k;
  for(const id in this.parts){const p=this.parts[id];p.g.position.copy(p.base).addScaledVector(p.ex,this.cur.explode)}
  const gp=this.parts.glass;if(gp)gp.g.rotation.y=1.9*this.cur.open;
  if(this.glassMat)this.glassMat.opacity=.16-.13*this.cur.inside;if(this.shell)this.shell.opacity=1-.75*this.cur.inside;
  if(this.powered&&!CALM)this.spin.forEach(s=>s.rotation.z-=dt*9);
  this.controls.target.lerp(this.goal,k);if(this.fly>0){this.fly-=dt;this.cam.position.lerp(this.camGoal,k)}
  this.controls.update();this.r.render(this.scene,this.cam)}
}

/* ================= UI ================= */
const S={case:'mid',mobo:'atx4',gpu:5,cpu:'i7',ram:'DDR4',gb:16,sto:'nvme',lab:true};
const viewer=new Viewer($('#gl'));viewer.build(S);
const stage=$('#stage'),info=$('#info');let mode='lab';

function infoHTML(id){const i=INFO[id];return `<h3>${i.n}</h3><p class="full">${i.f}</p><p>${i.d}</p><dl><dt>Qayerda</dt><dd>${i.w}</dd><dt>Nega muhim</dt><dd>${i.y}</dd><dt>Turlari</dt><dd>${i.t}</dd><dt>Namunaviy xususiyatlar</dt><dd>${specFor(id)}</dd></dl><p class="beg">${i.b}</p>`}
function specFor(id){if(id==='gpu')return `${GPUS[S.gpu][0]}: ~${GPUS[S.gpu][1]} mm uzunlik, ~${GPUS[S.gpu][2]} W (odatiy, modelga qarab farq qiladi)`;
 if(id==='cpu')return `${CPUS[S.cpu][0]}, ${MOBOS[S.mobo].ram} platformasi`;if(id==='ram')return `${S.ram}, jami ${S.gb} GB`;
 if(id==='m2')return `${STO[S.sto]}. ${INFO.m2.s}`;if(id==='case')return `${CASES[S.case].n}. ${INFO.case.s}`;return INFO[id].s}
function select(id,fly=true){
 if(!id){info.classList.remove('show');viewer.highlight(null);return}
 info.innerHTML=infoHTML(id)+`<div class="row"><button class="ghost" data-hide="${id}">${viewer.hidden.has(id)?'Koʻrsatish':'Yashirish'} (qism)</button><button class="ghost" data-x>Yopish</button></div>`;
 info.classList.add('show');viewer.highlight(id);if(fly)viewer.focus(id)}
viewer.onSelect=id=>mode==='sim'?0:select(id,false);
info.addEventListener('click',e=>{const h=e.target.dataset;if('x' in h)select(null);if(h.hide){viewer.toggleHide(h.hide);select(h.hide,false)}});

$('#tools').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const t=b.dataset.t;
 if(t==='reset'){viewer.reset();select(null);return}
 const on=b.getAttribute('aria-pressed')!=='true';b.setAttribute('aria-pressed',on);viewer.t[t]=on?1:0});
$('#go-explore').onclick=()=>{select('gpu')};
$$('[data-go]').forEach(b=>b.onclick=()=>document.getElementById(b.dataset.go).scrollIntoView());

/* nav rail + stage moves into whichever slot is on screen (one WebGL context) */
const secs=$$('main > section');
$('#rail').innerHTML=secs.map(s=>`<a href="#${s.id}">${s.dataset.nav}</a>`).join('');
secs.forEach(s=>new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)$$('#rail a').forEach(a=>a.classList.toggle('on',a.getAttribute('href')==='#'+e.target.id))}),{threshold:.4}).observe(s));
$$('.slot').forEach(sl=>new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting&&e.target.dataset.mode!==mode)enter(e.target)}),{threshold:.4}).observe(sl));
function enter(slot){
 mode=slot.dataset.mode;slot.appendChild(stage);viewer.resize();select(null);
 if(mode==='lab'){S.lab=true;viewer.setOnly(null);viewer.powered=true;viewer.build(S)}
 if(mode==='build'){S.lab=false;viewer.setOnly(null);viewer.powered=true;viewer.build(S)}
 if(mode==='sim'){S.lab=true;viewer.build(S);viewer.t.open=0;sim(0)}}

/* hardware explorer */
const cards=$('#cards');
function drawCards(q=''){cards.innerHTML=Object.keys(INFO).filter(id=>(INFO[id].n+INFO[id].f+CAT[id]+INFO[id].d).toLowerCase().includes(q)).map((id,i)=>`<button class="card rv" style="--i:${i%6}" data-id="${id}"><b>${INFO[id].n}</b><span>${INFO[id].f}<br><small>${CAT[id]}</small></span></button>`).join('')||'<p>Topilmadi. “xotira” yoki “quvvat” deb yozing.</p>'}
drawCards();$('#search').oninput=e=>{drawCards(e.target.value.trim().toLowerCase());reveal()};
cards.onclick=e=>{const c=e.target.closest('.card');if(c){$('#dlg-body').innerHTML=infoHTML(c.dataset.id);$('#dlg').showModal()}};

/* storage lab */
function showTech(i){const t=TECH[i],pct=Math.max(2,Math.log(t[3])/Math.log(12000)*100),d=Math.max(.8,26/Math.sqrt(t[3]));
 $$('#tech-tabs button').forEach((b,j)=>b.setAttribute('aria-pressed',i===j));
 $('#tech').innerHTML=`<div><h3>${t[0]}</h3><div class="bar"><i style="width:${pct}%"></i></div><p>Taxminan ${t[3].toLocaleString()} MB/s (odatiy ketma-ket oʻqish)</p><div class="lane">${Array.from({length:Math.min(14,2+Math.round(t[3]/900))},(_,k)=>`<span style="--d:${d}s;animation-delay:-${k*d/14}s"></span>`).join('')}</div><p>Maʼlumot oqimi: ${t[1]}</p></div>
 <dl><dt>Ulanish</dt><dd>${t[1]}</dd><dt>Oʻlcham</dt><dd>${t[2]}</dd><dt>Qoʻllanilishi</dt><dd>${t[4]}</dd><dt>Afzalliklari</dt><dd>${t[5]}</dd><dt>Kamchiliklari</dt><dd>${t[6]}</dd></dl>`}
$('#tech-tabs').innerHTML=TECH.map((t,i)=>`<button aria-pressed="false">${t[0]}</button>`).join('');
$('#tech-tabs').onclick=e=>{const i=$$('#tech-tabs button').indexOf(e.target);if(i>-1)showTech(i)};showTech(3);
$('#four').innerHTML=FOUR.map((f,i)=>`<div class="rv" style="--i:${i}"><em>${f[1]}</em><b>${f[0]}</b><p>${f[2]}</p></div>`).join('');

/* builder + compatibility */
const opt=(o,sel)=>Object.entries(o).map(([k,v])=>`<option value="${k}"${k==sel?' selected':''}>${v}</option>`).join('');
const FIELDS=[['case','Korpus',Object.fromEntries(Object.entries(CASES).map(([k,v])=>[k,v.n]))],['mobo','Ona plata',Object.fromEntries(Object.entries(MOBOS).map(([k,v])=>[k,v.n]))],['cpu','CPU',Object.fromEntries(Object.entries(CPUS).map(([k,v])=>[k,v[0]]))],['gpu','GPU',Object.fromEntries(GPUS.map((g,i)=>[i,'GeForce '+g[0]]))],['ram','RAM turi',{DDR3:'DDR3',DDR4:'DDR4',DDR5:'DDR5'}],['gb','RAM hajmi',{8:'8 GB',16:'16 GB',32:'32 GB',64:'64 GB'}],['sto','Xotira',STO]];
$('#cfg').innerHTML=FIELDS.map(([k,l,o])=>`<label>${l}<select name="${k}">${opt(o,S[k])}</select></label>`).join('');
$('#cfg').onchange=e=>{const k=e.target.name,v=e.target.value;S[k]=['gpu','gb'].includes(k)?+v:v;S.lab=false;viewer.build(S);compat()};
function compat(){const c=CASES[S.case],mb=MOBOS[S.mobo],g=GPUS[S.gpu],L=[];
 if(S.ram!==mb.ram)L.push([2,`${S.ram} RAM ${mb.ram} ona plataga oʻrnatilmaydi: kesik va signal turi boshqacha.`]);
 if(mb.ff>c.ff)L.push([2,`${mb.n} plata “${c.n}” korpusiga sigʻmaydi.`]);
 if(g[1]>c.gpu)L.push([2,`${g[0]} taxminan ${g[1]} mm uzun. Bu korpusga ${c.gpu} mm gacha sigʻadi.`]);else if(g[1]>c.gpu-25)L.push([1,`${g[0]} zoʻrgʻa sigʻadi (${c.gpu} mm dan ${g[1]}). Aniq modelingizni tekshiring.`]);
 if(mb.old&&g[0].includes('RTX'))L.push([1,'Eski DDR3 platalar eski PCIe va CPUlar bilan cheklangan, shuning uchun zamonaviy GPU toʻliq ishlay olmaydi.']);
 if(mb.old&&S.sto==='nvme')L.push([1,'DDR3 davridagi koʻp platalar NVMe diskdan yuklana olmaydi.']);
 if(S.sto==='pcie'&&mb.ff===1)L.push([2,'Mini-ITX platada faqat bitta PCIe uyasi bor va uni GPU egallaydi.']);
 const w=g[2]>=450?'850 W yoki undan koʻp':g[2]>=300?'750 W':g[2]>=200?'650 W':'550 W';
 const lv=Math.max(0,...L.map(x=>x[0])),t=['Mos','Ogohlantirish','Mos emas'][lv];
 const box=$('#compat');box.className='compat '+['','warn','bad'][lv];
 box.innerHTML=`<b>${t}</b>${L.length?'<ul>'+L.map(x=>`<li>${x[1]}</li>`).join('')+'</ul>':'<p>Tanlangan barcha qismlar birga ishlaydi.</p>'}<p class="note">${g[0]} uchun tavsiya etilgan PSU: ${w}.</p>`}
compat();

/* build simulator */
let step=0;
function sim(i){step=Math.max(0,Math.min(STEPS.length-1,i));const s=STEPS[step],shown=[];STEPS.slice(0,step+1).forEach(x=>shown.push(...x[2]));
 viewer.setOnly(shown.length?shown:['case']);viewer.powered=step===STEPS.length-1;viewer.t.open=step>0&&step<9?1:0;
 $('#sim-count').textContent=`Qadam ${step+1} / ${STEPS.length}`;$('#sim-title').textContent=s[0];$('#sim-text').textContent=s[1];
 $('#sim-next').textContent=step===STEPS.length-1?'Boshidan boshlash':'Keyingi qadam';
 if(mode==='sim'){viewer.focus(s[3]);viewer.highlight(step<9?s[3]:null)}}
$('#sim-next').onclick=()=>sim(step===STEPS.length-1?0:step+1);$('#sim-prev').onclick=()=>sim(step-1);

/* quiz */
let qi=0,score=0;
function quiz(){const b=$('#quiz-box');if(qi>=QUIZ.length){b.innerHTML=`<p class="count">Yakunlandi</p><p class="q">Natijangiz: ${QUIZ.length} dan ${score}.</p><button id="again">Qayta urinish</button>`;$('#again').onclick=()=>{qi=score=0;quiz()};return}
 const q=QUIZ[qi];b.innerHTML=`<p class="count">Savol ${qi+1} / ${QUIZ.length}. Hisob: ${score}</p><p class="q">${q[0]}</p>`+q[1].map((o,i)=>`<button class="opt" data-i="${i}">${o}</button>`).join('')+'<div id="fb"></div>';
 $$('.opt',b).forEach(o=>o.onclick=()=>{const i=+o.dataset.i;if(b.dataset.done===String(qi))return;b.dataset.done=qi;
  $$('.opt',b)[q[2]].classList.add('right');if(i!==q[2])o.classList.add('wrong');else score++;
  $('#fb').innerHTML=`<p class="exp">${i===q[2]?'Toʻgʻri. ':'Notoʻgʻri. '}${q[3]}</p><button id="nx">${qi===QUIZ.length-1?'Natijani koʻrish':'Keyingi savol'}</button>`;$('#nx').onclick=()=>{qi++;quiz()}})}
quiz();

/* ================= SCROLL ANIMATION ================= */
// Elements with .rv glide up and fade in once as they enter the viewport.
const rvObs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');rvObs.unobserve(e.target)}}),{threshold:.12,rootMargin:'0px 0px -6% 0px'});
function reveal(){$$('.rv:not(.in)').forEach(el=>rvObs.observe(el))}
reveal();
// hero text drifts and fades while scrolling down
const introEl=$('.intro');
addEventListener('scroll',()=>{if(CALM)return;const y=scrollY;if(y<innerHeight*1.2){introEl.style.transform=`translateY(${y*.3}px)`;introEl.style.opacity=Math.max(0,1-y/(innerHeight*.6))}},{passive:true});
