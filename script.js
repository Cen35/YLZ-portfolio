const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const views={intro:$('#introView'),directory:$('#directoryView'),about:$('#aboutView'),project:$('#projectView')};
const scenes=$$('.scene'),welcome=$('#welcome'),commitActions=$('#commitActions'),step1=$('#step1Video'),step2=$('#step2Video');
let stage=0,transitioning=false,wheelCooldown=false,selectedIndex=0,editingId=null;
const defaults=structuredClone(window.YLZ_DEFAULT_PROJECTS||[{id:'wuzhou',name:'TASTE OF WUZHOU',description:'一个无需商家入驻、专注真实美食探索的网站。',introduction:'这是一个无需商家入驻、专注真实美食探索的网站，以轻松直观的方式记录梧州街头值得被发现的味道。',url:'https://illustrious-seahorse-315f27.netlify.app/',tags:['WEB','FOOD','2026'],cover:'assets/wuzhou-cover.png',images:['assets/wuzhou-cover.png','assets/wuzhou-cover.png','assets/wuzhou-cover.png']}]);
const retiredProjectIds=new Set();
let projects=loadProjects();

function normalizeProject(project){const bundled=defaults.find(item=>item.id===project.id);return {...project,introduction:project.introduction??(project.id==='wuzhou'?defaults[0].introduction:project.description||''),completionDate:project.completionDate??bundled?.completionDate??'',tags:Array.isArray(project.tags)?project.tags:[],images:Array.isArray(project.images)?project.images:[],imageNames:Array.isArray(project.imageNames)?project.imageNames:[],caseStudy:Array.isArray(project.caseStudy)?project.caseStudy:(Array.isArray(bundled?.caseStudy)?structuredClone(bundled.caseStudy):[])}}
function mergeProjectSets(saved=[]){const merged=structuredClone(defaults);saved.forEach(project=>{if(retiredProjectIds.has(project.id))return;const index=merged.findIndex(item=>item.id===project.id);if(index>=0)merged[index]=project;else merged.push(project)});return merged.map(normalizeProject)}
function loadProjects(){try{return mergeProjectSets(JSON.parse(localStorage.getItem('ylz-projects'))||[])}catch{return mergeProjectSets()}}
function persistProjectsLocal(){localStorage.setItem('ylz-projects',JSON.stringify(projects))}
function saveProjects(){try{persistProjectsLocal();if(window.YLZCloudStore?.enabled)window.YLZCloudStore.saveProjects(projects).catch(error=>{console.error('Supabase sync failed',error);alert('项目已保存在当前浏览器，但 Supabase 云端同步失败。请检查网络或管理员登录状态。')});return true}catch{alert('图片容量太大，浏览器没有保存成功。请减少图片数量，或上传尺寸更小的图片。');return false}}
async function initializeCloudProjects(){if(!window.YLZCloudStore?.enabled)return;try{const remote=await window.YLZCloudStore.loadProjects();if(remote.length){projects=mergeProjectSets(remote);persistProjectsLocal();renderDirectory()}}catch(error){console.warn('Supabase load failed; using bundled project data.',error)}}
function showView(name){Object.values(views).forEach(v=>v.classList.remove('is-active'));views[name].classList.add('is-active');}
function showScene(name){scenes.forEach(s=>s.classList.toggle('is-active',s.dataset.scene===name))}
function updateStage(n){stage=Math.max(0,Math.min(3,n));welcome.classList.toggle('show',stage===1);welcome.setAttribute('aria-hidden',stage!==1);commitActions.classList.toggle('show',stage===3);commitActions.setAttribute('aria-hidden',stage!==3);views.intro.classList.toggle('final',stage===3);$('#stageProgress').style.width=`${(stage+1)*25}%`;$('#stageNumber').textContent=`0${stage+1} / 04`;if(stage===0)showScene('one');if(stage===1)showScene('two');if(stage===3)showScene('three')}
const ORIGINAL_VIDEO_PLAYBACK_RATE=1;
async function playTransition(video,scene,endStage){transitioning=true;showScene(scene);video.defaultPlaybackRate=ORIGINAL_VIDEO_PLAYBACK_RATE;video.playbackRate=ORIGINAL_VIDEO_PLAYBACK_RATE;video.currentTime=0;try{await video.play()}catch{updateStage(endStage);transitioning=false}video.onended=()=>{updateStage(endStage);transitioning=false}}
function advance(){if(transitioning||stage===3)return;if(stage===0){stage=1;$('#stageNumber').textContent='02 / 04';$('#stageProgress').style.width='50%';playTransition(step1,'step1',1);return}if(stage===1){welcome.classList.remove('show');stage=2;$('#stageNumber').textContent='03 / 04';$('#stageProgress').style.width='75%';playTransition(step2,'step2',3)}}
window.addEventListener('wheel',e=>{if(!views.intro.classList.contains('is-active'))return;e.preventDefault();if(wheelCooldown||Math.abs(e.deltaY)<12)return;if(e.deltaY>0)advance();else if(!transitioning)updateStage(Math.max(0,stage-1));wheelCooldown=true;setTimeout(()=>wheelCooldown=false,650)},{passive:false});
window.addEventListener('keydown',e=>{if(views.intro.classList.contains('is-active')&&(e.key==='ArrowDown'||e.key===' '))advance();if(e.key==='Escape')closeModals()});

// Interactive depth title and scene-three relighting. Pointer events can arrive
// faster than the display refresh rate, so merge them into one paint per frame.
let introPointerFrame=0,introPointer=null;
window.addEventListener('pointermove',e=>{
  if(!views.intro.classList.contains('is-active'))return;
  introPointer={x:e.clientX/innerWidth,y:e.clientY/innerHeight};
  if(introPointerFrame)return;
  introPointerFrame=requestAnimationFrame(()=>{
    introPointerFrame=0;
    const {x,y}=introPointer;
    $('#depthText').style.setProperty('--ry',`${(x-.5)*15}deg`);
    $('#depthText').style.setProperty('--rx',`${(.5-y)*10}deg`);
    $('#pointerLight').style.setProperty('--x',`${x*100}%`);
    $('#pointerLight').style.setProperty('--y',`${y*100}%`);
  });
},{passive:true});
$('#homeButton').addEventListener('pointermove',e=>{const r=e.currentTarget.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;e.currentTarget.querySelector('span').style.transform=`rotateX(${-y*24}deg) rotateY(${x*30}deg) skewX(${x*-8}deg) scale(1.1)`});
$('#homeButton').addEventListener('pointerleave',e=>e.currentTarget.querySelector('span').style.transform='');
$$('button,a,[role=button]').forEach(el=>{el.addEventListener('pointerenter',()=>$('#cursor').classList.add('hover'));el.addEventListener('pointerleave',()=>$('#cursor').classList.remove('hover'))});

// Real draggable slide-commit controls. A click also works for accessibility.
$$('.commit-control').forEach(control=>{const knob=control.querySelector('.commit-knob'),isContinue=control.dataset.action==='continue';let start=0,base=0,dragging=false,max=0;const reset=()=>{knob.style.transform='translateX(0)'};const finish=()=>{if(isContinue){if(window.YLZAbout?.enter)window.YLZAbout.enter();else{renderDirectory();showView('directory')}}else updateStage(0);reset()};knob.addEventListener('pointerdown',e=>{dragging=true;start=e.clientX;max=control.clientWidth-knob.offsetWidth-12;knob.setPointerCapture(e.pointerId)});knob.addEventListener('pointermove',e=>{if(!dragging)return;let dx=e.clientX-start;if(isContinue)dx=Math.min(0,Math.max(-max,dx));else dx=Math.max(0,Math.min(max,dx));base=dx;knob.style.transform=`translateX(${dx}px)`});knob.addEventListener('pointerup',()=>{if(!dragging)return;dragging=false;if(Math.abs(base)>max*.72)finish();else reset();base=0});knob.addEventListener('click',e=>{if(e.detail===0)finish()});control.addEventListener('dblclick',finish)});

// Character greeting: keep the still visible until the first video frame is actually painted.
// Return to the matching still just before the encoded tail freezes on its last frame.
const greetArea=$('#greetArea'),greetVideo=$('#greetVideo');
const GREET_START=.04,GREET_END_TRIM=.07;
let greeting=false,greetFrameId=0,greetFallbackTimer=0;

function resetGreeting(showEndingFrame=true){
  if(!greeting)return;
  greeting=false;
  greetArea.classList.toggle('ended',showEndingFrame);
  greetArea.classList.remove('playing');
  clearTimeout(greetFallbackTimer);
  if(greetVideo.cancelVideoFrameCallback&&greetFrameId)greetVideo.cancelVideoFrameCallback(greetFrameId);
  requestAnimationFrame(()=>{
    greetVideo.pause();
    if(Number.isFinite(greetVideo.duration))greetVideo.currentTime=Math.min(GREET_START,greetVideo.duration/2);
  });
}

function watchGreetingTail(_now,metadata){
  if(!greeting)return;
  const mediaTime=metadata?.mediaTime??greetVideo.currentTime;
  if(Number.isFinite(greetVideo.duration)&&mediaTime>=greetVideo.duration-GREET_END_TRIM){
    resetGreeting();
    return;
  }
  greetFrameId=greetVideo.requestVideoFrameCallback(watchGreetingTail);
}

function revealGreetingOnPaint(){
  if(!greeting)return;
  greetArea.classList.add('playing');
  greetArea.classList.remove('ended');
  if(greetVideo.requestVideoFrameCallback){
    greetFrameId=greetVideo.requestVideoFrameCallback(watchGreetingTail);
  }else{
    const remaining=Math.max(0,(greetVideo.duration-greetVideo.currentTime-GREET_END_TRIM)*1000);
    greetFallbackTimer=setTimeout(resetGreeting,remaining);
  }
}

function startGreetingPlayback(){
  if(!greeting)return;
  greetVideo.defaultPlaybackRate=ORIGINAL_VIDEO_PLAYBACK_RATE;
  greetVideo.playbackRate=ORIGINAL_VIDEO_PLAYBACK_RATE;
  const firstPaint=greetVideo.requestVideoFrameCallback
    ?()=>{greetFrameId=greetVideo.requestVideoFrameCallback(revealGreetingOnPaint)}
    :()=>requestAnimationFrame(()=>requestAnimationFrame(revealGreetingOnPaint));
  firstPaint();
  greetVideo.play().catch(()=>resetGreeting(false));
}

function playGreeting(){
  if(greeting)return;
  greeting=true;
  greetArea.classList.remove('playing');
  const begin=()=>{
    greetVideo.currentTime=Math.min(GREET_START,Number.isFinite(greetVideo.duration)?greetVideo.duration/2:GREET_START);
    if(greetVideo.seeking)greetVideo.addEventListener('seeked',startGreetingPlayback,{once:true});
    else startGreetingPlayback();
  };
  if(greetVideo.readyState>=2)begin();
  else{
    greetVideo.addEventListener('loadeddata',begin,{once:true});
    greetVideo.load();
  }
}

// Prime the first decoded frame during page idle time so the click feels instant.
function primeGreetingVideo(){
  if(greetVideo.readyState>=2){
    greetVideo.currentTime=Math.min(GREET_START,Number.isFinite(greetVideo.duration)?greetVideo.duration/2:GREET_START);
    greetVideo.pause();
  }else greetVideo.load();
}
if('requestIdleCallback'in window)requestIdleCallback(primeGreetingVideo,{timeout:1200});
else setTimeout(primeGreetingVideo,300);

greetArea.addEventListener('click',playGreeting);
greetArea.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();playGreeting()}});
greetVideo.addEventListener('ended',resetGreeting);
greetVideo.addEventListener('error',()=>resetGreeting(false));

const optionWheel=$('#optionWheel');
const wheelConfig={fontSize:3,spacing:1.4,curve:1,tilt:6,blur:2,fade:.25,minOpacity:.05,smoothing:200,inset:80,loop:false};
let wheelPos=0,wheelTarget=0,wheelRaf=0,wheelLast=0,wheelTimer=0,wheelDrag=null,wheelDragMoved=false;

function updateWheelSelection(index){
  selectedIndex=index;
  updateDirectoryCount();
  $$('.option-wheel__item').forEach((item,i)=>{
    item.classList.toggle('option-wheel__item--selected',i===index);
    item.setAttribute('aria-selected',i===index?'true':'false');
  });
}

function runOptionWheelFrame(now){
  const dt=Math.min((now-wheelLast)/1000,.05);
  wheelLast=now;
  const tau=Math.max(wheelConfig.smoothing,1)/1000;
  const k=1-Math.exp(-dt/tau);
  let next=wheelPos+(wheelTarget-wheelPos)*k;
  const settled=Math.abs(wheelTarget-next)<.001;
  if(settled)next=wheelTarget;
  wheelPos=next;
  const rem=parseFloat(getComputedStyle(document.documentElement).fontSize)||16;
  const rowH=Math.max(wheelConfig.fontSize*wheelConfig.spacing*rem,1);
  const tiltRad=wheelConfig.tilt*Math.PI/180;
  const radius=tiltRad>.0005?rowH/tiltRad:0;
  $$('.option-wheel__item').forEach((item,i)=>{
    const d=i-next,dist=Math.abs(d);
    let x=0,y=d*rowH,rotation=0;
    if(radius>0){
      const angle=Math.max(-Math.PI/2,Math.min(Math.PI/2,d*tiltRad));
      y=radius*Math.sin(angle);
      x=-radius*(1-Math.cos(angle))*wheelConfig.curve;
      rotation=angle*180/Math.PI;
    }
    item.style.transform=`translate(${x.toFixed(2)}px,calc(${y.toFixed(2)}px - 50%)) rotate(${rotation.toFixed(3)}deg)`;
    item.style.opacity=String(Math.max(wheelConfig.minOpacity,1-dist*wheelConfig.fade));
    item.style.filter=wheelConfig.blur>0?`blur(${(dist*wheelConfig.blur).toFixed(2)}px)`:'none';
    item.style.setProperty('--ow-p',Math.max(0,1-Math.min(dist,1)).toFixed(4));
  });
  wheelRaf=settled?0:requestAnimationFrame(runOptionWheelFrame);
}

function startOptionWheel(){
  if(wheelRaf)cancelAnimationFrame(wheelRaf);
  wheelLast=performance.now();
  wheelRaf=requestAnimationFrame(runOptionWheelFrame);
}

function applyWheelTarget(value,snap=false){
  const max=Math.max(projects.length-1,0);
  let next=Math.min(Math.max(value,0),max);
  if(snap)next=Math.round(next);
  wheelTarget=next;
  const index=Math.round(next);
  if(index!==selectedIndex)updateWheelSelection(index);
  startOptionWheel();
}

function renderDirectory(){
  if(!projects.length)projects=structuredClone(defaults);
  selectedIndex=Math.min(selectedIndex,projects.length-1);
  updateDirectoryCount();
  wheelPos=selectedIndex;
  wheelTarget=selectedIndex;
  optionWheel.innerHTML='';
  projects.forEach((project,index)=>{
    const item=document.createElement('div');
    item.className=`option-wheel__item${index===selectedIndex?' option-wheel__item--selected':''}`;
    item.setAttribute('role','option');
    item.setAttribute('aria-selected',index===selectedIndex?'true':'false');
    item.textContent=project.name;
    item.addEventListener('click',()=>{
      if(wheelDragMoved)return;
      if(index===selectedIndex)openProject(index);
      else applyWheelTarget(index,true);
    });
    optionWheel.appendChild(item);
  });
  wheelLast=performance.now();
  requestAnimationFrame(runOptionWheelFrame);
}

optionWheel.addEventListener('wheel',event=>{
  event.preventDefault();
  const rem=parseFloat(getComputedStyle(document.documentElement).fontSize)||16;
  const rowH=wheelConfig.fontSize*wheelConfig.spacing*rem;
  const delta=event.deltaMode===1?event.deltaY*24:event.deltaY;
  const step=Math.max(-1,Math.min(1,delta/rowH));
  applyWheelTarget(wheelTarget+step,false);
  clearTimeout(wheelTimer);
  wheelTimer=setTimeout(()=>applyWheelTarget(wheelTarget,true),140);
},{passive:false});

optionWheel.addEventListener('pointerdown',event=>{
  wheelDrag={y:event.clientY,start:wheelTarget,id:event.pointerId};
  wheelDragMoved=false;
  optionWheel.classList.add('option-wheel--dragging');
});
optionWheel.addEventListener('pointermove',event=>{
  if(!wheelDrag)return;
  const dy=event.clientY-wheelDrag.y;
  if(!wheelDragMoved&&Math.abs(dy)>4){wheelDragMoved=true;optionWheel.setPointerCapture(wheelDrag.id)}
  if(wheelDragMoved){
    const rem=parseFloat(getComputedStyle(document.documentElement).fontSize)||16;
    applyWheelTarget(wheelDrag.start-dy/(wheelConfig.fontSize*wheelConfig.spacing*rem),false);
  }
});
function endOptionWheelDrag(){
  if(!wheelDrag)return;
  wheelDrag=null;
  optionWheel.classList.remove('option-wheel--dragging');
  if(wheelDragMoved)applyWheelTarget(wheelTarget,true);
}
optionWheel.addEventListener('pointerup',endOptionWheelDrag);
optionWheel.addEventListener('pointercancel',endOptionWheelDrag);
optionWheel.addEventListener('keydown',event=>{
  let delta=0;
  if(event.key==='ArrowUp'||event.key==='ArrowLeft')delta=-1;
  if(event.key==='ArrowDown'||event.key==='ArrowRight')delta=1;
  if(!delta)return;
  event.preventDefault();
  applyWheelTarget(Math.round(wheelTarget)+delta,true);
});
// Native JS port of React Bits Stack: random card rotation, spring return,
// drag past 180px to send the top card back, or click it to cycle the stack.
const STACK_SENSITIVITY=180;
let stackCards=[];
let stackDrag=null;

function stackTransform(card,index,total){
  const depth=total-index-1;
  const scale=1+index*.06-total*.06;
  return `rotateZ(${depth*4+card.rotation}deg) scale(${scale})`;
}

function layoutStack(animate=true){
  const total=stackCards.length;
  const indicator=$('#stackPagination');
  if(indicator){indicator.replaceChildren();const count=document.createElement('span');count.textContent=`${total?stackCards[total-1].pageNumber:0} / ${total}`;indicator.append(count);if(total>1){const hint=document.createElement('small');hint.textContent='拖动或点击切换';indicator.append(hint)}}
  stackCards.forEach((card,index)=>{
    const isTop=index===total-1;
    card.wrap.style.zIndex=String(index+1);
    card.wrap.classList.toggle('is-top',isTop);
    card.wrap.style.pointerEvents=isTop?'auto':'none';
    card.wrap.tabIndex=isTop?0:-1;
    card.wrap.setAttribute('aria-hidden',isTop?'false':'true');
    card.inner.style.transition=animate?'transform 520ms cubic-bezier(.2,.85,.25,1)':'none';
    card.inner.style.transform=stackTransform(card,index,total);
    if(!isTop){
      card.wrap.style.transition=animate?'transform 520ms cubic-bezier(.2,.85,.25,1)':'none';
      card.wrap.style.transform='translate3d(0,0,0) rotateX(0deg) rotateY(0deg)';
    }
  });
}

function sendStackCardToBack(card){
  const index=stackCards.indexOf(card);
  if(index<0||stackCards.length<2)return;
  stackCards.splice(index,1);
  stackCards.unshift(card);
  card.wrap.style.transition='none';
  card.wrap.style.transform='translate3d(0,0,0) rotateX(0deg) rotateY(0deg)';
  layoutStack(true);
}

function finishStackDrag(event,cancelled=false){
  if(!stackDrag)return;
  const {card,dx,dy,moved,pointerId}=stackDrag;
  stackDrag=null;
  card.wrap.classList.remove('is-dragging');
  try{card.wrap.releasePointerCapture(pointerId)}catch{}
  if(!cancelled&&(Math.abs(dx)>STACK_SENSITIVITY||Math.abs(dy)>STACK_SENSITIVITY)){
    sendStackCardToBack(card);
    return;
  }
  card.wrap.style.transition='transform 520ms cubic-bezier(.2,.85,.25,1)';
  card.wrap.style.transform='translate3d(0,0,0) rotateX(0deg) rotateY(0deg)';
  if(!cancelled&&!moved)sendStackCardToBack(card);
}

function bindStackCard(card){
  card.wrap.addEventListener('pointerdown',event=>{
    if(!card.wrap.classList.contains('is-top'))return;
    stackDrag={card,startX:event.clientX,startY:event.clientY,dx:0,dy:0,moved:false,pointerId:event.pointerId};
    card.wrap.classList.add('is-dragging');
    card.wrap.style.transition='none';
    card.wrap.setPointerCapture(event.pointerId);
  });
  card.wrap.addEventListener('pointermove',event=>{
    if(!stackDrag||stackDrag.card!==card)return;
    stackDrag.dx=event.clientX-stackDrag.startX;
    stackDrag.dy=event.clientY-stackDrag.startY;
    if(Math.hypot(stackDrag.dx,stackDrag.dy)>6)stackDrag.moved=true;
    const rotateX=Math.max(-60,Math.min(60,-stackDrag.dy*.6));
    const rotateY=Math.max(-60,Math.min(60,stackDrag.dx*.6));
    card.wrap.style.transform=`translate3d(${stackDrag.dx}px,${stackDrag.dy}px,0) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });
  card.wrap.addEventListener('pointerup',event=>finishStackDrag(event));
  card.wrap.addEventListener('pointercancel',event=>finishStackDrag(event,true));
  card.wrap.addEventListener('keydown',event=>{
    if(event.key==='Enter'||event.key===' '){event.preventDefault();sendStackCardToBack(card)}
  });
}

function renderImageStack(images,projectName){
  const stack=$('#imageStack');
  stack.innerHTML='';
  stackCards=images.slice(0,4).map((src,index)=>{
    const wrap=document.createElement('div');
    wrap.className='stack-card-rotate';
    wrap.setAttribute('role','button');
    wrap.setAttribute('aria-label',`${projectName} 图片 ${index+1}，拖动或点击切换`);
    const inner=document.createElement('div');
    inner.className='stack-card';
    const img=document.createElement('img');
    img.src=src;
    img.alt=`${projectName} 项目内页 ${index+1}`;
    img.draggable=false;
    inner.appendChild(img);
    wrap.appendChild(inner);
    stack.appendChild(wrap);
    const card={wrap,inner,rotation:Math.random()*10-5,pageNumber:Math.min(images.length,4)-index};
    bindStackCard(card);
    return card;
  });
  const indicator=document.createElement('div');indicator.id='stackPagination';indicator.className='stack-pagination';indicator.setAttribute('aria-live','polite');indicator.setAttribute('aria-label','当前项目图片');stack.append(indicator);
  layoutStack(false);
  requestAnimationFrame(()=>layoutStack(true));
}

function renderFolderTags(tags=[]){
  const holder=$('#folderItems');
  const cleanTags=tags.map(tag=>String(tag).trim()).filter(Boolean).slice(0,6);
  holder.innerHTML='';
  $('#folderFloat').style.setProperty('--ff-n',String(cleanTags.length));
  cleanTags.forEach((label,index)=>{
    const columns=Math.min(3,cleanTags.length);
    const column=index%columns;
    const row=Math.floor(index/columns);
    const x=(column-(columns-1)/2)*94+(row%2?18:0);
    const y=-70-row*48-(column%2)*38;
    const rotation=(index%2?-1:1)*(3+index*1.15);
    const item=document.createElement('button');
    item.type='button';
    item.className='folder-float__item';
    item.innerHTML=`<span class="folder-float__drift">${escapeHtml(label)}</span>`;
    item.style.setProperty('--i',String(index));
    item.style.setProperty('--x',`${x}px`);
    item.style.setProperty('--y',`${y}px`);
    item.style.setProperty('--r',`${rotation}deg`);
    item.tabIndex=-1;
    item.setAttribute('aria-hidden','true');
    item.addEventListener('pointerenter',()=>$('#cursor').classList.add('hover'));
    item.addEventListener('pointerleave',()=>$('#cursor').classList.remove('hover'));
    holder.appendChild(item);
  });
}

function formatCompletionDate(value=''){const match=/^(\d{4})-(\d{2})-(\d{2})$/.exec(value);return match?`${Number(match[1])}.${Number(match[2])}.${Number(match[3])}`:value}
function renderCompletionDate(project){const date=$('#projectCompletionDate'),value=project.completionDate||'';date.hidden=!value;date.dateTime=value;date.textContent=value?`完成日期 · ${formatCompletionDate(value)}`:''}
const caseStudyLabels=['项目成果','问题与方案','过程证据','迭代记录','学习复盘'];
function createCaseStudyButton(entry,index,onSelect){
  const button=document.createElement('button');
  button.type='button';
  button.className='case-study-index__item';
  button.innerHTML=`<span>${String(index+1).padStart(2,'0')}</span><strong></strong><small></small><i aria-hidden="true">↗</i>`;
  button.querySelector('strong').textContent=entry?.label||caseStudyLabels[index];
  button.querySelector('small').textContent=entry?.title||'该项目资料待补充';
  button.onclick=()=>onSelect(index);
  return button;
}
function renderProjectCaseStudy(project,activeIndex=null){
  const root=$('#projectCaseStudy');
  const entries=Array.isArray(project.caseStudy)?project.caseStudy:[];
  root.innerHTML='';
  if(activeIndex===null){
    const header=document.createElement('header');
    header.className='case-study-index__header';
    header.innerHTML='<p>PROJECT RECORD</p><h2>项目创作记录</h2><span>选择一项查看完整记录</span>';
    const list=document.createElement('div');
    list.className='case-study-index__list';
    caseStudyLabels.forEach((label,index)=>list.appendChild(createCaseStudyButton(entries[index]||{label},index,next=>renderProjectCaseStudy(project,next))));
    root.append(header,list);
    return;
  }
  const entry=entries[activeIndex];
  const detail=document.createElement('article');
  detail.className='case-study-detail';
  const back=document.createElement('button');
  back.type='button';
  back.className='case-study-detail__back';
  back.textContent='← 全部记录';
  back.onclick=()=>renderProjectCaseStudy(project);
  const code=document.createElement('p');
  code.className='case-study-detail__code';
  code.textContent=entry?.code||`RECORD ${String(activeIndex+1).padStart(2,'0')}`;
  const title=document.createElement('h2');
  title.textContent=entry?.title||caseStudyLabels[activeIndex];
  const summary=document.createElement('p');
  summary.className='case-study-detail__summary';
  summary.textContent=entry?.summary||'该项目的这部分资料正在整理，后续会根据项目文档补充。';
  const points=document.createElement('ul');
  (entry?.points||['等待补充项目成果、过程证据与复盘内容。']).forEach(text=>{const item=document.createElement('li');item.textContent=text;points.appendChild(item)});
  const note=document.createElement('footer');
  note.textContent=entry?.note||'PROJECT FILE · CONTENT PENDING';
  detail.append(back,code,title,summary,points,note);
  root.appendChild(detail);
}
let projectEntranceTimer=0;
function updateDirectoryCount(){const node=$('#directoryCount');const value=`${String(selectedIndex+1).padStart(2,'0')} / ${String(projects.length).padStart(2,'0')}`;if(node.textContent===value)return;node.textContent=value;if(!matchMedia('(prefers-reduced-motion: reduce)').matches){node.getAnimations().forEach(a=>a.cancel());node.animate([{opacity:.4,transform:'translateY(5px)'},{opacity:1,transform:'translateY(0)'}],{duration:180,easing:'ease-out'})}}
function updateProjectPagination(){[['#previousProject',-1],['#nextProject',1]].forEach(([selector,step])=>{const button=$(selector);const index=(selectedIndex+step+projects.length)%projects.length;button.disabled=projects.length<2;button.querySelector('small').textContent=projects[index]?.name||'';button.setAttribute('aria-label',`${step<0?'上一件':'下一件'}：${projects[index]?.name||''}`);button.onclick=()=>{if(projects.length>1){stackDrag=null;openProject((selectedIndex+step+projects.length)%projects.length);updateProjectPagination()}}})}
new MutationObserver(updateProjectPagination).observe($('#projectName'),{childList:true});
function runProjectEntrance(){const title=$('#projectName');title.classList.toggle('project-title-cn',/[\u3400-\u9fff]/.test(title.textContent));title.style.setProperty('--title-length',String(Math.max(1,Array.from(title.textContent).length)));const view=views.project;view.classList.remove('is-entering');void view.offsetWidth;view.classList.add('is-entering');clearTimeout(projectEntranceTimer);projectEntranceTimer=setTimeout(()=>view.classList.remove('is-entering'),650)}
function openProject(index){selectedIndex=index;const p=projects[index],projectName=$('#projectName');$('#projectMeta').textContent=`${String(index+1).padStart(2,'0')} / FEATURED PROJECT`;projectName.textContent=p.name;projectName.classList.toggle('project-name-single-line',p.name==='民族乐器科普');$('#projectDescription').textContent=p.description;renderCompletionDate(p);$('#folderName').textContent=p.name.split(' ').slice(-1)[0];renderFolderTags(p.tags||[]);const images=p.images?.length?p.images:[p.cover];renderImageStack(images,p.name);renderProjectCaseStudy(p);$('#cardIntroduction').textContent=p.introduction||p.description;$('#cardUrl').dataset.url=p.url;$('#folderDirectLink').href=p.url;showView('project');runProjectEntrance()}
$('#backDirectory').onclick=()=>{renderDirectory();showView('directory')};$('#homeButton').onclick=()=>{showView('intro');updateStage(0)};

// Particles and folder card.
for(let i=0;i<65;i++){const dot=document.createElement('i');dot.style.cssText=`--x:${Math.random()*100}%;--y:${Math.random()*100}%;--s:${1+Math.random()*3}px;--d:${-Math.random()*8}s`;$('#particles').appendChild(dot)}
const folderFloat=$('#folderFloat');
let folderTagDrag=null;

function setFolderOpen(open){
  folderFloat.toggleAttribute('data-open',open);
  $('#floatingFolder').setAttribute('aria-expanded',open?'true':'false');
  $$('.folder-float__item').forEach(item=>{
    item.tabIndex=open?0:-1;
    item.setAttribute('aria-hidden',open?'false':'true');
  });
}

folderFloat.addEventListener('pointerenter',()=>setFolderOpen(true));
folderFloat.addEventListener('pointerleave',()=>{if(!folderTagDrag)setFolderOpen(false)});
folderFloat.addEventListener('focusin',()=>setFolderOpen(true));
folderFloat.addEventListener('focusout',event=>{if(!folderFloat.contains(event.relatedTarget))setFolderOpen(false)});
folderFloat.addEventListener('keydown',event=>{if(event.key==='Escape'){setFolderOpen(false);$('#floatingFolder').focus()}});

folderFloat.addEventListener('pointerdown',event=>{
  const item=event.target.closest('.folder-float__item');
  if(!item||event.button!==0)return;
  event.stopPropagation();
  folderTagDrag={item,id:event.pointerId,startX:event.clientX,startY:event.clientY,x:parseFloat(item.style.getPropertyValue('--x'))||0,y:parseFloat(item.style.getPropertyValue('--y'))||0,moved:false};
  item.setPointerCapture(event.pointerId);
});
folderFloat.addEventListener('pointermove',event=>{
  if(!folderTagDrag||folderTagDrag.id!==event.pointerId)return;
  const dx=event.clientX-folderTagDrag.startX,dy=event.clientY-folderTagDrag.startY;
  if(Math.hypot(dx,dy)>4)folderTagDrag.moved=true;
  if(!folderTagDrag.moved)return;
  folderTagDrag.item.toggleAttribute('data-drag',true);
  folderTagDrag.item.style.setProperty('--x',`${folderTagDrag.x+dx}px`);
  folderTagDrag.item.style.setProperty('--y',`${folderTagDrag.y+dy}px`);
});
folderFloat.addEventListener('pointerup',event=>{
  if(!folderTagDrag||folderTagDrag.id!==event.pointerId)return;
  const {item,moved}=folderTagDrag;
  folderTagDrag=null;
  item.removeAttribute('data-drag');
  try{item.releasePointerCapture(event.pointerId)}catch{}
  if(!moved){
    item.toggleAttribute('data-pop',true);
    setTimeout(()=>item.removeAttribute('data-pop'),320);
    setTimeout(()=>setFolderOpen(false),180);
  }
});
folderFloat.addEventListener('pointercancel',()=>{if(folderTagDrag){folderTagDrag.item.removeAttribute('data-drag');folderTagDrag=null}});
folderFloat.addEventListener('click',event=>{
  const item=event.target.closest('.folder-float__item');
  if(item){
    if(event.detail===0){
      item.toggleAttribute('data-pop',true);
      setTimeout(()=>item.removeAttribute('data-pop'),320);
      setFolderOpen(false);
    }
    return;
  }
  if(event.target.closest('#folderDirectLink'))return;
  openModal($('#projectModal'));
});

// React Bits BorderGlow geometry, applied only to the project introduction card.
const projectGlow=$('#projectGlow');
let glowFrame=0,glowPointer=null;
projectGlow.addEventListener('pointermove',event=>{
  glowPointer={x:event.clientX,y:event.clientY};
  if(glowFrame)return;
  glowFrame=requestAnimationFrame(()=>{
  glowFrame=0;
  const rect=projectGlow.getBoundingClientRect();
  const x=glowPointer.x-rect.left,y=glowPointer.y-rect.top;
  const cx=rect.width/2,cy=rect.height/2;
  const dx=x-cx,dy=y-cy;
  const kx=dx===0?Infinity:cx/Math.abs(dx);
  const ky=dy===0?Infinity:cy/Math.abs(dy);
  const edge=Math.min(Math.max(1/Math.min(kx,ky),0),1);
  let angle=Math.atan2(dy,dx)*180/Math.PI+90;
  if(angle<0)angle+=360;
  projectGlow.style.setProperty('--edge-proximity',(edge*100).toFixed(3));
  projectGlow.style.setProperty('--cursor-angle',`${angle.toFixed(3)}deg`);
  });
});

// React Bits SlingButton, adapted to plain JavaScript for the project link.
const slingRoot=$('#projectSling'),slingPad=$('#cardUrl'),slingMove=$('#slingMove'),slingTension=$('#slingTension');
const slingBand=$('#slingBand'),slingBandHot=$('#slingBandHot'),slingArc=$('#slingArc'),slingIcon=$('#slingIcon');
const slingConfig={size:56,strokeWidth:3,armAt:48,maxPull:160,launchSpeed:2600,recoil:.2,flight:120,particles:14,spread:60};
const slingWellRadius=slingConfig.size/2+4+slingConfig.strokeWidth;
const slingPadRadius=slingConfig.size/2-slingConfig.strokeWidth/2;
const clamp=(value,min,max)=>Math.min(max,Math.max(min,value));
let slingGrip=null,slingX=0,slingY=0,slingDirection={x:0,y:-1},slingArmed=false,slingSkipClick=false,slingSending=false;
let slingPaintFrame=0,slingReturn=null;
function flushSlingPaint(){slingPaintFrame=0;aimSlingIcon(Math.hypot(slingX,slingY));paintSling()}
function paintSlingNow(){if(slingPaintFrame)cancelAnimationFrame(slingPaintFrame);flushSlingPaint()}

const slingDots=Array.from({length:slingConfig.particles},()=>{
  const dot=document.createElement('span');
  dot.className='sling-button__dot';
  dot.setAttribute('aria-hidden','true');
  slingRoot.appendChild(dot);
  return dot;
});

function paintSling(){
  const distance=Math.hypot(slingX,slingY);
  const projected=slingX*slingDirection.x+slingY*slingDirection.y;
  const power=clamp(projected/slingConfig.armAt,0,1);
  let path='';
  if(distance>.5){
    const angle=Math.atan2(slingY,slingX);
    const tangent=Math.acos(clamp((slingWellRadius-slingPadRadius)/distance,-1,1));
    path=[angle+tangent,angle-tangent].map(value=>{
      const x=Math.cos(value),y=Math.sin(value);
      return `M${(slingWellRadius*x).toFixed(2)},${(slingWellRadius*y).toFixed(2)}L${(slingX+slingPadRadius*x).toFixed(2)},${(slingY+slingPadRadius*y).toFixed(2)}`;
    }).join('');
  }
  slingBand.setAttribute('d',path);
  slingBandHot.setAttribute('d',path);
  slingBandHot.style.opacity=String(power);
  slingTension.style.opacity=String(clamp(projected/6,0,1));
  slingArc.setAttribute('stroke-dasharray',`${power} ${1-power}`);
  slingArc.setAttribute('stroke-dashoffset',String(power/2));
  slingArc.style.opacity=power>.01?'1':'0';
  slingArc.setAttribute('transform',`rotate(${Math.atan2(-slingDirection.y,-slingDirection.x)*180/Math.PI})`);
  slingMove.style.transform=`translate3d(${slingX}px, ${slingY}px, 0)`;
}

function setSlingArmed(armed){
  if(slingArmed===armed)return;
  slingArmed=armed;
  slingRoot.toggleAttribute('data-armed',armed);
  slingPad.toggleAttribute('data-armed',armed);
}

function aimSlingIcon(distance){
  const angle=Math.atan2(-slingDirection.y,-slingDirection.x)*180/Math.PI+90;
  slingIcon.style.transition='none';
  slingIcon.style.transform=`rotate(${angle*clamp(distance/12,0,1)}deg)`;
}

function relaxSlingIcon(){
  slingIcon.style.transition='transform 360ms cubic-bezier(.23,1,.32,1)';
  slingIcon.style.transform='rotate(0deg)';
}

function launchSlingParticles(){
  const base=Math.atan2(-slingDirection.y,-slingDirection.x);
  const cone=slingConfig.spread*Math.PI/180;
  slingDots.forEach((dot,index)=>{
    const lead=index===0;
    const angle=base+(lead?0:(Math.random()+Math.random()-1)*(cone/2));
    const x=Math.cos(angle),y=Math.sin(angle);
    const reach=lead?slingConfig.flight:slingConfig.flight*(.3+Math.random());
    const drift=lead?0:(Math.random()-.5)*slingConfig.flight*.4;
    const scale=lead?1:.3+Math.random()*.6;
    const shrink=lead?.6:scale*(.2+Math.random()*.4);
    const duration=lead?300:300*(.7+Math.random());
    const delay=lead?0:Math.random()*70;
    const end=slingWellRadius+reach;
    dot.animate([
      {transform:`translate(${x*slingWellRadius}px,${y*slingWellRadius}px) scale(${scale})`,opacity:1},
      {transform:`translate(${x*end-y*drift}px,${y*end+x*drift}px) scale(${shrink})`,opacity:0}
    ],{duration,delay,easing:'cubic-bezier(.23,1,.32,1)'});
  });
}

function sendSlingProject(){
  if(slingSending)return;
  const url=slingPad.dataset.url;
  if(!url)return;
  slingSending=true;
  slingRoot.setAttribute('data-sent','');
  launchSlingParticles();
  window.open(url,'_blank','noopener,noreferrer');
  setTimeout(()=>{slingSending=false;slingRoot.removeAttribute('data-sent')},700);
}

function settleSling(fired=false){
  cancelAnimationFrame(slingPaintFrame);slingPaintFrame=0;
  if(slingReturn){slingReturn.onfinish=null;slingReturn.cancel()}
  const startX=slingX,startY=slingY;
  const kick=fired?Math.min(28,Math.hypot(startX,startY)*slingConfig.recoil):0;
  const animation=slingMove.animate([
    {transform:`translate(${startX}px,${startY}px)`},
    {transform:`translate(${-slingDirection.x*kick}px,${-slingDirection.y*kick}px)`,offset:.32},
    {transform:`translate(${slingDirection.x*5}px,${slingDirection.y*5}px)`,offset:.7},
    {transform:'translate(0,0)'}
  ],{duration:400,easing:'cubic-bezier(.23,1,.32,1)'});
  slingReturn=animation;
  animation.onfinish=()=>{
    slingReturn=null;
    slingX=0;slingY=0;
    slingMove.style.transform='translate(0,0)';
    slingTension.style.opacity='0';
    slingArc.style.opacity='0';
    slingBand.setAttribute('d','');
    slingBandHot.setAttribute('d','');
  };
}

slingPad.addEventListener('pointerdown',event=>{
  if(event.button!==0||slingGrip)return;
  if(slingReturn){const current=new DOMMatrixReadOnly(getComputedStyle(slingMove).transform);slingReturn.onfinish=null;slingReturn.cancel();slingReturn=null;slingX=current.m41;slingY=current.m42;paintSling()}
  slingGrip={id:event.pointerId,startX:event.clientX,startY:event.clientY,baseX:slingX,baseY:slingY,moved:false};
  slingPad.setPointerCapture(event.pointerId);
  slingPad.setAttribute('data-held','');
});

slingPad.addEventListener('pointermove',event=>{
  if(!slingGrip||slingGrip.id!==event.pointerId)return;
  event.preventDefault();
  const baseDistance=Math.hypot(slingGrip.baseX,slingGrip.baseY);
  const inverse=slingConfig.maxPull/Math.max(1,slingConfig.maxPull-baseDistance);
  const rawX=event.clientX-slingGrip.startX+slingGrip.baseX*inverse,rawY=event.clientY-slingGrip.startY+slingGrip.baseY*inverse;
  const rawDistance=Math.hypot(rawX,rawY);
  if(Math.hypot(event.clientX-slingGrip.startX,event.clientY-slingGrip.startY)>4)slingGrip.moved=true;
  if(rawDistance<.01){slingX=0;slingY=0;setSlingArmed(false);if(!slingPaintFrame)slingPaintFrame=requestAnimationFrame(flushSlingPaint);return}
  const distance=slingConfig.maxPull*rawDistance/(slingConfig.maxPull+rawDistance);
  slingDirection={x:rawX/rawDistance,y:rawY/rawDistance};
  slingX=distance*slingDirection.x;
  slingY=distance*slingDirection.y;
  setSlingArmed(distance>=slingConfig.armAt);
  if(!slingPaintFrame)slingPaintFrame=requestAnimationFrame(flushSlingPaint);
});

function releaseSling(event,cancelled=false){
  if(!slingGrip||slingGrip.id!==event.pointerId)return;
  paintSlingNow();
  const moved=slingGrip.moved;
  slingGrip=null;
  slingSkipClick=true;
  try{slingPad.releasePointerCapture(event.pointerId)}catch{}
  slingPad.removeAttribute('data-held');
  const fired=!cancelled&&(!moved||slingArmed);
  if(fired)sendSlingProject();
  else relaxSlingIcon();
  settleSling(fired);
  setSlingArmed(false);
}

slingPad.addEventListener('pointerup',event=>releaseSling(event));
slingPad.addEventListener('pointercancel',event=>releaseSling(event,true));
slingPad.addEventListener('lostpointercapture',event=>{if(slingGrip)releaseSling(event,true)});
slingPad.addEventListener('click',event=>{
  if(slingSkipClick){slingSkipClick=false;return}
  if(event.detail===0){slingDirection={x:0,y:-1};sendSlingProject();settleSling(true)}
});
slingPad.addEventListener('keydown',event=>{if(event.key==='Escape'&&slingGrip)releaseSling({pointerId:slingGrip.id},true)});

let modalReturnFocus=null;
function openModal(modal){
  modalReturnFocus=document.activeElement instanceof HTMLElement?document.activeElement:null;
  modal.classList.add('show');
  modal.setAttribute('aria-hidden','false');
  requestAnimationFrame(()=>modal.querySelector('[data-close-modal],button,[href],input,textarea,select')?.focus());
}
function closeModals(){
  const hadOpen=$$('.modal.show').length>0;
  $$('.modal').forEach(m=>{m.classList.remove('show');m.setAttribute('aria-hidden','true')});
  if(hadOpen&&modalReturnFocus?.isConnected)modalReturnFocus.focus();
  modalReturnFocus=null;
}
document.addEventListener('keydown',event=>{
  const modal=$('.modal.show');
  if(!modal||event.key!=='Tab')return;
  const focusable=$$('button,[href],input,textarea,select,[tabindex]:not([tabindex="-1"])').filter(node=>modal.contains(node)&&!node.disabled&&node.getClientRects().length);
  if(!focusable.length)return;
  const first=focusable[0],last=focusable[focusable.length-1];
  if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}
  else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}
});
$$('[data-close-modal]').forEach(b=>b.onclick=closeModals);$$('.modal').forEach(m=>m.addEventListener('click',e=>{if(e.target===m)closeModals()}));

// Local project manager with add/edit/delete and image upload.
$$('[data-open-admin]').forEach(b=>b.onclick=async()=>{if(window.YLZCloudStore?.enabled){try{const session=await window.YLZCloudStore.ensureAdminSession();if(!session)return;const remote=await window.YLZCloudStore.loadProjects();if(remote.length){projects=mergeProjectSets(remote);persistProjectsLocal();renderDirectory();const remoteIds=new Set(remote.map(item=>item.id));const cloudNeedsSync=projects.some(item=>!remoteIds.has(item.id))||remote.some(item=>!projects.some(project=>project.id===item.id));if(cloudNeedsSync)await window.YLZCloudStore.saveProjects(projects)}else await window.YLZCloudStore.saveProjects(projects)}catch(error){alert(`Supabase 连接失败：${error.message}`);return}}renderAdmin();openModal($('#adminModal'));if(b.dataset.adminTarget==='about')requestAnimationFrame(()=>$('.about-admin')?.scrollIntoView({behavior:'smooth',block:'start'}))});
function renderAdmin(){const list=$('#adminList');list.innerHTML='';projects.forEach((p,i)=>{const b=document.createElement('button');b.textContent=`${String(i+1).padStart(2,'0')}  ${p.name}`;b.classList.toggle('selected',p.id===editingId);b.onclick=()=>fillForm(p.id);list.appendChild(b)});if(!editingId&&projects[0])fillForm(projects[0].id,false)}
function savedFileName(source,fallback){
  if(!source||source.startsWith('data:')||source.startsWith('blob:'))return fallback;
  try{return decodeURIComponent(source.split('/').pop())||fallback}catch{return fallback}
}

function renderMediaStatus(target,sources=[],names=[],pending=false){
  target.innerHTML='';
  const list=sources.filter(Boolean);
  if(!list.length){
    const empty=document.createElement('span');
    empty.className='saved-media__empty';
    empty.textContent=pending?'尚未选择新图片':'当前没有已保存图片';
    target.appendChild(empty);
    return;
  }
  const head=document.createElement('span');
  head.className=`saved-media__head${pending?' is-pending':''}`;
  head.textContent=pending?`待保存 ${list.length} 张（请点击“保存修改”）`:`已保存 ${list.length} 张，刷新后仍会保留`;
  const grid=document.createElement('span');
  grid.className='saved-media__grid';
  list.forEach((source,index)=>{
    const figure=document.createElement('span');
    figure.className='saved-media__thumb';
    const img=document.createElement('img');
    img.src=source;
    img.alt=names[index]||`图片 ${index+1}`;
    const caption=document.createElement('span');
    caption.textContent=names[index]||savedFileName(source,`已保存图片 ${index+1}`);
    figure.append(img,caption);
    grid.appendChild(figure);
  });
  target.append(head,grid);
}

function renderSavedMedia(project){
  renderMediaStatus($('#coverSaved'),project.cover?[project.cover]:[],project.coverName?[project.coverName]:[]);
  renderMediaStatus($('#imagesSaved'),project.images||[],project.imageNames||[]);
}

function previewSelectedMedia(input,target,max){
  const files=[...input.files].slice(0,max);
  if(!files.length){
    const project=projects.find(item=>item.id===editingId);
    if(project)renderSavedMedia(project);
    return;
  }
  const urls=files.map(file=>URL.createObjectURL(file));
  renderMediaStatus(target,urls,files.map(file=>file.name),true);
  target.querySelectorAll('img').forEach((img,index)=>img.addEventListener('load',()=>URL.revokeObjectURL(urls[index]),{once:true}));
}

function fillForm(id,rerender=true){const p=projects.find(x=>x.id===id);if(!p)return;editingId=id;$('#editProjectId').value=p.id;$('#editName').value=p.name;$('#editDescription').value=p.description;$('#editIntroduction').value=p.introduction||p.description||'';$('#editUrl').value=p.url;$('#editCompletionDate').value=p.completionDate||'';$('#editTags').value=(p.tags||[]).join(', ');$('#editCover').value='';$('#editImages').value='';renderSavedMedia(p);if(rerender)renderAdmin()}
$('#newProject').onclick=()=>{const id=`project-${Date.now()}`;projects.push({id,name:'NEW PROJECT',description:'请填写项目介绍。',introduction:'请在这里填写作品简介。',completionDate:'',url:'https://example.com/',tags:['WEB','2026'],cover:'assets/wuzhou-cover.png',images:['assets/wuzhou-cover.png']});saveProjects();fillForm(id)};
$('#deleteProject').onclick=()=>{if(projects.length===1){alert('至少保留一个项目。');return}if(!confirm('确定删除这个项目吗？'))return;projects=projects.filter(p=>p.id!==editingId);editingId=projects[0].id;saveProjects();renderAdmin();renderDirectory()};
$('#editCover').addEventListener('change',event=>previewSelectedMedia(event.currentTarget,$('#coverSaved'),1));
$('#editImages').addEventListener('change',event=>previewSelectedMedia(event.currentTarget,$('#imagesSaved'),3));
$('#projectForm').addEventListener('submit',async e=>{e.preventDefault();const p=projects.find(x=>x.id===editingId);if(!p)return;const previous={...p,coverName:p.coverName,tags:[...(p.tags||[])],images:[...(p.images||[])],imageNames:[...(p.imageNames||[])]};p.name=$('#editName').value.trim();p.description=$('#editDescription').value.trim();p.introduction=$('#editIntroduction').value.trim();p.url=$('#editUrl').value.trim();p.completionDate=$('#editCompletionDate').value;p.tags=$('#editTags').value.split(',').map(s=>s.trim()).filter(Boolean);const coverFile=$('#editCover').files[0];const imageFiles=[...$('#editImages').files].slice(0,3);try{if(coverFile){p.cover=window.YLZCloudStore?.enabled?await window.YLZCloudStore.uploadImage(coverFile,p.id,'cover'):await resizeImage(coverFile);p.coverName=coverFile.name}if(imageFiles.length){p.images=window.YLZCloudStore?.enabled?await Promise.all(imageFiles.map((file,index)=>window.YLZCloudStore.uploadImage(file,p.id,`detail-${index+1}`))):await Promise.all(imageFiles.map(resizeImage));p.imageNames=imageFiles.map(file=>file.name)}}catch(error){Object.assign(p,previous);alert(`图片上传失败：${error.message}`);renderSavedMedia(p);return}if(!saveProjects()){Object.assign(p,previous);p.coverName=previous.coverName;renderSavedMedia(p);return}if(projects[selectedIndex]?.id===p.id){$('#cardIntroduction').textContent=p.introduction||p.description;renderCompletionDate(p)}renderAdmin();fillForm(p.id,false);renderDirectory();alert(window.YLZCloudStore?.enabled?'已经保存并同步到 Supabase。':'已经保存，刷新页面后也会保留。')});
function resizeImage(file){return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onerror=reject;reader.onload=()=>{const img=new Image();img.onload=()=>{const max=1100,scale=Math.min(1,max/Math.max(img.width,img.height)),canvas=document.createElement('canvas');canvas.width=Math.round(img.width*scale);canvas.height=Math.round(img.height*scale);canvas.getContext('2d').drawImage(img,0,0,canvas.width,canvas.height);resolve(canvas.toDataURL('image/jpeg',.76))};img.onerror=reject;img.src=reader.result};reader.readAsDataURL(file)})}
function escapeHtml(value=''){return value.replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}

renderDirectory();updateStage(0);initializeCloudProjects();

