/* BLOCKVERSE: visual effects, particle engine, boot sequence and subtle parallax */
(() => {
  const $ = (s, r=document) => r.querySelector(s);
  const boot = $('#boot-screen'), progress = $('#boot-progress'), percent = $('#boot-percent'), bootText = $('#boot-text');
  const stages = ['正在生成世界区块','正在加载方块材质','正在点亮红石线路','正在打开传送门','世界生成完成'];
  let value = 0;
  const timer = setInterval(() => {
    value = Math.min(100, value + Math.ceil(Math.random()*13));
    progress.style.width = value + '%'; percent.textContent = value + '%';
    bootText.textContent = stages[Math.min(stages.length-1, Math.floor(value/25))];
    if(value >= 100){clearInterval(timer);setTimeout(()=>boot.classList.add('done'),380)}
  }, 105);

  const glow = $('#cursor-glow');
  window.addEventListener('pointermove', e => {
    glow.style.left = e.clientX + 'px'; glow.style.top = e.clientY + 'px';
  }, {passive:true});

  const particleRoot = $('#particles');
  let lastBurst = 0;
  function burst(x,y,count=9){
    for(let i=0;i<count;i++){
      const p=document.createElement('i'); p.className='particle';
      const angle=Math.PI*2*i/count+(Math.random()-.5)*.5, distance=25+Math.random()*75;
      p.style.left=x+'px';p.style.top=y+'px';
      p.style.setProperty('--dx',Math.cos(angle)*distance+'px');
      p.style.setProperty('--dy',Math.sin(angle)*distance+'px');
      p.style.setProperty('--duration',(0.45+Math.random()*.6)+'s');
      p.style.width=(2+Math.random()*4)+'px';p.style.height=p.style.width;
      if(Math.random()>.6)p.style.background='#9edfff';
      particleRoot.appendChild(p);p.addEventListener('animationend',()=>p.remove(),{once:true});
    }
  }
  document.addEventListener('click',e=>{
    const t=e.target.closest('button,a,.block-item,.dimension-card');
    if(!t)return;
    burst(e.clientX,e.clientY,t.classList.contains('block-item')?14:8);
  });
  window.addEventListener('pointermove',e=>{
    if(e.pointerType==='touch')return;
    const now=performance.now();if(now-lastBurst<110)return;lastBurst=now;
    if(Math.random()>.55)return;
    const p=document.createElement('i');p.className='particle';
    p.style.left=e.clientX+'px';p.style.top=e.clientY+'px';p.style.opacity='.65';
    p.style.setProperty('--dx',(Math.random()*18-9)+'px');p.style.setProperty('--dy',(-10-Math.random()*18)+'px');
    p.style.setProperty('--duration','.6s');p.style.width='2px';p.style.height='2px';particleRoot.appendChild(p);
    p.addEventListener('animationend',()=>p.remove(),{once:true});
  },{passive:true});

  // Tiny optional synthesized UI ambience; only starts after the visitor opts in.
  let audioCtx=null, ambience=null, audioOn=false;
  const soundBtn=$('#sound-toggle');
  function toggleSound(){
    audioOn=!audioOn;soundBtn.classList.toggle('muted',!audioOn);
    if(audioOn){
      try{
        audioCtx=audioCtx||new (window.AudioContext||window.webkitAudioContext)();
        const master=audioCtx.createGain();master.gain.value=.018;master.connect(audioCtx.destination);
        const osc=audioCtx.createOscillator(), lfo=audioCtx.createOscillator(), lfoGain=audioCtx.createGain();
        osc.type='sine';osc.frequency.value=110;lfo.frequency.value=.12;lfoGain.gain.value=8;
        lfo.connect(lfoGain);lfoGain.connect(osc.frequency);osc.connect(master);osc.start();lfo.start();ambience={osc,lfo,master};
      }catch(e){audioOn=false;soundBtn.classList.add('muted')}
    }else if(ambience){ambience.osc.stop();ambience.lfo.stop();ambience.master.disconnect();ambience=null}
  }
  soundBtn.addEventListener('click',toggleSound);
  document.addEventListener('click',e=>{
    const b=e.target.closest('button,a');if(!b||b===soundBtn)return;
    if(!audioOn||!audioCtx)return;
    try{const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type='square';o.frequency.value=520+Math.random()*360;g.gain.setValueAtTime(.025,audioCtx.currentTime);g.gain.exponentialRampToValueAtTime(.001,audioCtx.currentTime+.055);o.connect(g);g.connect(audioCtx.destination);o.start();o.stop(audioCtx.currentTime+.06)}catch(_){}
  });
  // Gentle card tilt, disabled for touch/reduced-motion.
  if(matchMedia('(hover:hover) and (prefers-reduced-motion:no-preference)').matches){
    document.querySelectorAll('.tilt-card').forEach(card=>{
      card.addEventListener('pointermove',e=>{
        const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
        card.style.transform=`perspective(900px) rotateY(${x*4}deg) rotateX(${-y*3}deg) translateY(-4px)`;
      });
      card.addEventListener('pointerleave',()=>card.style.transform='');
    });
  }
})();
