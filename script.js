const $ = id => document.getElementById(id);
const state = {mode:"auto",power:true,brightness:65,ldr:38,pir1:false,pir2:false,current:.42};
const labels=[], powerData=[];
const chart = new Chart($("powerChart"),{type:"line",data:{labels,datasets:[{data:powerData,borderColor:"#35b8e8",backgroundColor:"rgba(53,184,232,.10)",fill:true,tension:.38,pointRadius:0,borderWidth:2}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{grid:{display:false},ticks:{color:"#91aebe",maxTicksLimit:6,font:{size:8}}},y:{min:0,max:1.5,grid:{color:"rgba(145,174,190,.12)"},ticks:{color:"#91aebe",font:{size:8}}}}}});
function autoBrightness(){if(state.ldr>55)return 0;return state.pir1||state.pir2?100:25}
function current(){state.current=state.power?Math.max(.03,state.brightness/100*.65):.01}
function render(){
 $("ldrValue").innerHTML=`${Math.round(state.ldr)}<small>%</small>`;$("ldrMeter").style.width=state.ldr+"%";$("ldrRaw").textContent=Math.round(state.ldr*40.95);
 $("pirValue").innerHTML=`${Number(state.pir1)+Number(state.pir2)}<small>/2</small>`;$("pir1Badge").textContent=`PIR 1 · ${state.pir1?"MOTION":"CLEAR"}`;$("pir2Badge").textContent=`PIR 2 · ${state.pir2?"MOTION":"CLEAR"}`;
 $("pir1Text").textContent=state.pir1?"Gerakan terdeteksi":"Tidak ada gerakan";$("pir2Text").textContent=state.pir2?"Gerakan terdeteksi":"Tidak ada gerakan";
 $("brightnessValue").innerHTML=`${state.brightness}<small>%</small>`;$("brightnessMeter").style.width=state.brightness+"%";$("sliderValue").textContent=state.brightness+"%";$("brightnessSlider").value=state.brightness;
 $("currentValue").innerHTML=`${state.current.toFixed(2)}<small>A</small>`;$("currentRaw").textContent=state.current.toFixed(2)+" A";$("currentMeter").style.width=Math.min(100,state.current/1.5*100)+"%";
 $("modeTag").textContent=state.mode.toUpperCase();document.querySelectorAll(".mode-btn").forEach(b=>b.classList.toggle("selected",b.dataset.mode===state.mode));
 $("powerBtn").classList.toggle("off",!state.power);$("powerText").textContent=state.power?"Lampu menyala":"Lampu mati";$("lampGlow").style.opacity=state.power?Math.max(0, state.brightness/100):0;
 $("systemStatus").textContent=state.power?"AKTIF":"LAMPU MATI";$("controlHint").textContent=state.mode==="auto"?"Mode otomatis menyesuaikan lampu berdasarkan kondisi sekitar.":"Mode manual: brightness dan status lampu diatur langsung.";
}
function applyAuto(){if(state.mode==="auto"){state.brightness=autoBrightness();state.power=state.brightness>0}current();render()}
document.querySelectorAll(".mode-btn").forEach(b=>b.addEventListener("click",()=>{state.mode=b.dataset.mode;applyAuto()}));
$("brightnessSlider").addEventListener("input",e=>{state.mode="manual";state.brightness=+e.target.value;state.power=state.brightness>0;current();render()});
$("powerBtn").addEventListener("click",()=>{state.power=!state.power;if(!state.power)state.brightness=0;else if(!state.brightness)state.brightness=65;if(state.mode==="auto")state.mode="manual";current();render()});
$("themeBtn").addEventListener("click",()=>document.body.classList.toggle("light"));
function simulate(){state.ldr=Math.max(5,Math.min(95,state.ldr+(Math.random()-.5)*4));state.mode==="auto"?applyAuto():(current(),render());labels.push(new Date().toLocaleTimeString("id-ID",{minute:"2-digit",second:"2-digit"}));powerData.push(+state.current.toFixed(2));if(labels.length>18){labels.shift();powerData.shift()}chart.update("none");$("lastUpdated").textContent="Diperbarui sekarang"}
render();for(let i=0;i<10;i++){labels.push(`${i}:00`);powerData.push(.42)}chart.update();setInterval(simulate,2500);


// GSAP interface motion
if (window.gsap) {
  gsap.set(".identity,.topbar,.intro,.metric,.panel,footer", {opacity:0, y:16});
  const intro = gsap.timeline({defaults:{ease:"power3.out"}});
  intro.to(".identity", {opacity:1,y:0,duration:.55})
    .to(".topbar", {opacity:1,y:0,duration:.55}, "-=.28")
    .to(".intro", {opacity:1,y:0,duration:.65}, "-=.30")
    .to(".metric", {opacity:1,y:0,duration:.48,stagger:.09}, "-=.32")
    .to(".main-grid .panel", {opacity:1,y:0,duration:.55,stagger:.12}, "-=.25")
    .to(".sensor-detail,footer", {opacity:1,y:0,duration:.45,stagger:.08}, "-=.22");

  gsap.to(".status>i", {scale:1.35,opacity:.65,duration:1.1,repeat:-1,yoyo:true,ease:"sine.inOut"});
  document.querySelectorAll(".metric,.panel").forEach((card) => {
    card.addEventListener("mouseenter", () => gsap.to(card,{y:-3,duration:.22,ease:"power2.out"}));
    card.addEventListener("mouseleave", () => gsap.to(card,{y:0,duration:.3,ease:"power2.out"}));
  });
}
