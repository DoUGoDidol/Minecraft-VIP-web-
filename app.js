/* BLOCKVERSE interaction layer */
(() => {
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const toast=$('#toast');let toastTimer;
  function notify(message){toast.textContent=message;toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),2300)}
  // Responsive navigation
  const nav=$('#main-nav'),menu=$('#menu-toggle');
  menu.addEventListener('click',()=>{nav.classList.toggle('open');menu.classList.toggle('open')});
  $$('.nav-link').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.classList.remove('open')}));
  // Active section indicator
  const sections=$$('main section[id]');
  const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){$$('.nav-link').forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+e.target.id))}}),{rootMargin:'-35% 0px -55% 0px'});
  sections.forEach(s=>observer.observe(s));
  // Animated count-up stats
  const counterObserver=new IntersectionObserver(entries=>entries.forEach(e=>{
    if(!e.isIntersecting)return;const el=e.target;counterObserver.unobserve(el);
    if(el.dataset.count==='∞'){el.textContent='∞';return}
    const target=Number(el.dataset.count),start=performance.now(),duration=1200;
    function tick(now){const p=Math.min(1,(now-start)/duration);el.textContent=Math.round((1-Math.pow(1-p,3))*target).toLocaleString('en-US')+(el.dataset.suffix||'');if(p<1)requestAnimationFrame(tick)}
    requestAnimationFrame(tick);
  }),{threshold:.7});
  $$('[data-count]').forEach(e=>counterObserver.observe(e));
  // Block explorer
  const blockItems=$$('.block-item'),filterButtons=$$('.filter-tab'),search=$('#block-search'),detail=$('#block-detail');
  let activeFilter='all',selectedBlock=null;
  function filterBlocks(){
    const q=search.value.trim().toLowerCase();let visible=0;
    blockItems.forEach(b=>{const show=(activeFilter==='all'||b.dataset.type===activeFilter)&&(!q||(b.dataset.name+b.querySelector('small').textContent).toLowerCase().includes(q));b.hidden=!show;if(show)visible++});
    const allButton=filterButtons[0];allButton.querySelector('span').textContent=String(visible).padStart(2,'0');
  }
  filterButtons.forEach(b=>b.addEventListener('click',()=>{activeFilter=b.dataset.filter;filterButtons.forEach(x=>x.classList.toggle('active',x===b));filterBlocks()}));
  search.addEventListener('input',filterBlocks);
  blockItems.forEach(b=>b.addEventListener('click',()=>{
    selectedBlock=b;blockItems.forEach(x=>x.classList.toggle('selected',x===b));
    detail.querySelector('.detail-symbol').textContent='▦';
    detail.querySelector('.detail-symbol').style.color=b.dataset.color;
    detail.querySelector('.detail-symbol').style.borderColor=b.dataset.color+'66';
    detail.querySelector('.detail-main .micro-label').textContent='BLOCK INSPECTOR / '+b.querySelector('small').textContent;
    detail.querySelector('.detail-main h3').textContent=b.dataset.name;
    detail.querySelector('.detail-main p').textContent=b.dataset.desc+` 硬度：${b.dataset.hardness} ｜ 推荐工具：${b.dataset.tool} ｜ 掉落：${b.dataset.drop}。`;
    detail.querySelector('.detail-hint').innerHTML='DATA LOADED <span>✓</span>';
    detail.style.borderColor=b.dataset.color+'55';
  }));
  document.addEventListener('keydown',e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();search.focus();search.select()}if(e.key==='Escape'){search.blur();nav.classList.remove('open');menu.classList.remove('open')}});
  // Creature database
  const mobs={
    creeper:{title:'苦力怕',id:'MOB_002',desc:'悄无声息地接近，然后用一声熟悉的嘶嘶声改变地形。保持距离，留意周围环境。',location:'主世界 · 夜晚',behavior:'接近后爆炸',threat:3,kind:'HOSTILE',color:'#71d45a',className:'creeper-pixel'},
    enderman:{title:'末影人',id:'MOB_008',desc:'高大的神秘生物，能够瞬间移动并搬运部分方块。不要直视它的眼睛，除非你已经准备好战斗。',location:'主世界 / 末地',behavior:'瞬移 · 近战',threat:4,kind:'HOSTILE',color:'#bd92ff',className:'enderman-pixel'},
    fox:{title:'狐狸',id:'MOB_031',desc:'敏捷又谨慎的森林居民。它们会捕猎小型动物，也可能叼走地上的物品。',location:'针叶林 · 夜晚',behavior:'逃跑 · 捕猎',threat:1,kind:'PASSIVE',color:'#f2a05a',className:'fox-pixel'},
    bee:{title:'蜜蜂',id:'MOB_044',desc:'围绕花朵飞舞的忙碌伙伴。靠近蜂巢时保持礼貌，善用蜂蜜与授粉机制。',location:'草甸 · 花森林',behavior:'采蜜 · 授粉',threat:2,kind:'NEUTRAL',color:'#f4d45a',className:'bee-pixel'}
  };
  $$('.mob-chip').forEach(btn=>btn.addEventListener('click',()=>{
    const m=mobs[btn.dataset.mob];if(!m)return;
    $$('.mob-chip').forEach(x=>x.classList.toggle('active',x===btn));
    $('#mob-title').innerHTML=m.title+'<span>.</span>';$('#mob-desc').textContent=m.desc;$('#mob-location').textContent=m.location;$('#mob-behavior').textContent=m.behavior;$('.mob-number').textContent=m.id;
    $('.mob-info .eyebrow').innerHTML=`<span class="status-dot ${m.kind==='HOSTILE'?'danger-dot':''}"></span> ENTITY DATABASE <span class="eyebrow-sep">/</span> ${m.kind}`;
    const bars=$$('.threat-bars i');bars.forEach((bar,i)=>bar.classList.toggle('on',i<m.threat));bars.forEach((bar,i)=>bar.style.background=i<m.threat?m.color:'');
    const old=$('.pixel-mob');old.className='pixel-mob '+m.className;old.style.filter=`drop-shadow(0 0 20px ${m.color}33) drop-shadow(0 15px 20px #0008)`;
    $('.mob-halo').style.borderColor=m.color+'55';$('.mob-scan').style.background=m.color;$('.mob-scan').style.boxShadow=`0 0 18px ${m.color}`;
    $('.mob-coordinate').textContent=`ENTITY ID: ${m.id.split('_')[1]} / ${m.location.toUpperCase()}`;
  }));
  // Crafting recipes (visual demonstrations, not a game inventory)
  const recipes={
    pickaxe:{name:'DIAMOND PICKAXE',result:'⛏',cells:[['💎',0],['💎',1],['💎',2],['',3],['🪵',4],['',5],['',6],['🪵',7],['',8]],status:'钻石镐配方已载入'},
    torch:{name:'TORCH',result:'♨',cells:[['',0],['🪵',1],['',2],['',3],['🪨',4],['',5],['',6],['',7],['',8]],status:'火把配方已载入'},
    chest:{name:'CHEST',result:'▣',cells:[['🪵',0],['🪵',1],['🪵',2],['🪵',3],['',4],['🪵',5],['🪵',6],['🪵',7],['🪵',8]],status:'箱子配方已载入'}
  };
  let currentRecipe='pickaxe';
  function renderRecipe(key){
    currentRecipe=key;const r=recipes[key],grid=$('#craft-grid');grid.innerHTML='';
    const cells=Array(9).fill('');r.cells.forEach(([v,i])=>cells[i]=v);
    cells.forEach(v=>{const s=document.createElement('div');s.className='craft-slot'+(v?' filled':'');s.textContent=v;grid.appendChild(s)});
    $('#craft-result').textContent=r.result;$('#craft-status-text').textContent=r.status+' / '+r.name;
    $$('.recipe-button').forEach(b=>b.classList.toggle('active',b.dataset.recipe===key));
  }
  $$('.recipe-button').forEach(b=>b.addEventListener('click',()=>renderRecipe(b.dataset.recipe)));
  $('#craft-button').addEventListener('click',()=>{const r=$('#craft-result');r.classList.remove('crafted');void r.offsetWidth;r.classList.add('crafted');notify('合成成功！ '+recipes[currentRecipe].name+' 已制作（演示）');$('#craft-status-text').textContent='合成成功 / '+recipes[currentRecipe].name;});
  renderRecipe('pickaxe');
  // Command console — intentionally local and safe
  const output=$('#terminal-output'),form=$('#terminal-form'),input=$('#terminal-input');
  function addLine(text,cls=''){const p=document.createElement('p');if(cls)p.className=cls;p.textContent=text;output.appendChild(p);output.scrollTop=output.scrollHeight}
  const commands={
    help:()=>['可用指令：','help — 显示帮助','world — 查看当前维度','inventory — 查看随身物品','time set day — 切换为白天（演示）','summon creeper — 生成苦力怕（演示）','clear — 清空终端'],
    world:()=>['维度：主世界 / OVERWORLD','坐标：X 124.8  Y 72.0  Z -38.2','天气：晴朗 · 群系：平原','区块状态：已加载'],
    inventory:()=>['背包槽位：36','钻石 × 12　铁锭 × 24　火把 × 64','工作台 × 1　面包 × 8','状态：准备好继续冒险'],
    'time set day':()=>['正在调整世界时间……','☀ 已切换为白天（模拟命令）'],
    'summon creeper':()=>['正在请求实体生成……','⚠ 苦力怕已生成！（纯演示，没有连接真实游戏）'],
    clear:()=>{output.innerHTML='';return ['终端已清空。输入 help 查看指令。']}
  };
  function runCommand(raw){
    const cmd=raw.trim().toLowerCase();if(!cmd)return;
    addLine('player@blockverse ~ $ '+raw,'term-command');
    let result=commands[cmd];
    if(!result&&cmd.startsWith('time set '))result=()=>['时间命令已识别：'+cmd,'当前世界时间仅为本地演示。'];
    if(!result&&cmd.startsWith('summon '))result=()=>['实体请求：'+cmd.slice(7),'这是一个演示终端，不会连接真实游戏服务器。'];
    if(result){const lines=result();lines.forEach((line,i)=>addLine(line,i===0&&cmd==='help'?'term-green':'term-result'))}
    else addLine('未知指令：'+raw+'。输入 help 查看可用指令。','term-red');
    output.scrollTop=output.scrollHeight;
  }
  form.addEventListener('submit',e=>{e.preventDefault();runCommand(input.value);input.value=''});
  $$('.terminal-suggestions button').forEach(b=>b.addEventListener('click',()=>{input.value=b.dataset.command;input.focus();if(b.dataset.command==='help'||b.dataset.command==='world'||b.dataset.command==='inventory') {runCommand(input.value);input.value=''}else form.requestSubmit()}));
  $('#clear-terminal').addEventListener('click',()=>{output.innerHTML='';addLine('终端已清空。输入 help 查看指令。','term-dim')});
  // Reveal on scroll
  const revealObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.animate([{opacity:0,transform:'translateY(18px)'},{opacity:1,transform:'translateY(0)'}],{duration:650,easing:'cubic-bezier(.2,.8,.2,1)',fill:'both'});revealObserver.unobserve(e.target)}}),{threshold:.12});
  $$('.section-heading,.dimension-card,.block-item,.mob-feature,.craft-lab,.terminal-window').forEach(el=>revealObserver.observe(el));
})();
