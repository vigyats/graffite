import * as THREE from './vendor/three.module.js';

const mount=document.getElementById('world'),trigger=document.getElementById('core-trigger'),message=document.getElementById('theme-message'),messageTitle=document.getElementById('theme-message-title');
const experience={phase:'idle',time:0};let wake=()=>{},renderer;mount.dataset.phase='idle';mount.closest('.art-viewport').dataset.phase='idle';
function setPhase(phase){experience.phase=phase;experience.time=0;mount.dataset.phase=phase;mount.closest('.art-viewport').dataset.phase=phase;trigger.disabled=phase!=='idle';message.setAttribute('aria-hidden',String(phase!=='hold'));messageTitle.textContent=phase==='hold'?'Theme will be revealed soon.':'';if(phase==='idle')trigger.focus({preventScroll:true});}
function stepExperience(dt){if(experience.phase==='idle')return;experience.time+=dt;const duration=experience.phase==='hold'?3:experience.phase==='enter'?.95:1.2;if(experience.time>=duration)setPhase(experience.phase==='enter'?'hold':experience.phase==='hold'&&!matchMedia('(prefers-reduced-motion: reduce)').matches?'exit':'idle');}
function revealTheme(){if(experience.phase!=='idle')return;setPhase(matchMedia('(prefers-reduced-motion: reduce)').matches||!renderer?'hold':'enter');wake();}
trigger.addEventListener('click',revealTheme);
try{renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'high-performance'});}catch{document.body.classList.add('webgl-unavailable');}
if(renderer)buildSculpture();else{let previous=0,fallbackRAF=null;trigger.querySelector('span').style.opacity='.8';wake=()=>{if(fallbackRAF)return;previous=performance.now();const tick=now=>{fallbackRAF=null;if(document.hidden){previous=now;return;}stepExperience(Math.min((now-previous)/1000,.05));previous=now;if(experience.phase!=='idle')fallbackRAF=requestAnimationFrame(tick);};fallbackRAF=requestAnimationFrame(tick);};document.addEventListener('visibilitychange',()=>{if(!document.hidden&&experience.phase!=='idle')wake();});}

function buildSculpture(){
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.8));renderer.setClearColor(0x0c0d11,0);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.95;mount.append(renderer.domElement);
  const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(37,1,.1,80),model=new THREE.Group();scene.add(model);
  // A locally generated HDR-style studio environment gives real metallic reflections.
  const studio=new THREE.Scene();studio.background=new THREE.Color(0x060709);
  const dome=new THREE.Mesh(new THREE.SphereGeometry(20,32,16),new THREE.MeshBasicMaterial({color:0x171b24,side:THREE.BackSide}));studio.add(dome);
  function softbox(x,y,z,w,h,color,intensity=1){const material=new THREE.MeshBasicMaterial({color:new THREE.Color(color).multiplyScalar(intensity),side:THREE.DoubleSide});const light=new THREE.Mesh(new THREE.PlaneGeometry(w,h),material);light.position.set(x,y,z);light.lookAt(0,0,0);studio.add(light);}
  softbox(-5,5,6,3,10,0xffffff,5);softbox(5,1,4,2,8,0xd9e8ff,3);softbox(0,8,-2,8,2,0xf2f0e8,3);softbox(-4,0,-5,1,7,0xf65335,2);softbox(5,-3,-4,4,2,0x445569,1.5);
  const pmrem=new THREE.PMREMGenerator(renderer);const environment=pmrem.fromScene(studio,.03,.1,50);scene.environment=environment.texture;pmrem.dispose();studio.traverse(o=>{if(o.isMesh){o.geometry.dispose();o.material.dispose();}});
  scene.add(new THREE.HemisphereLight(0xc7d2e8,0x0f1118,1.05));
  const key=new THREE.DirectionalLight(0xf5eee1,3);key.position.set(-5,7,5);key.castShadow=true;key.shadow.mapSize.set(1024,1024);key.shadow.camera.left=-4;key.shadow.camera.right=4;key.shadow.camera.top=5;key.shadow.camera.bottom=-4;key.shadow.normalBias=.025;scene.add(key);
  const rim=new THREE.DirectionalLight(0x768aa9,2.7);rim.position.set(4,3,-4);scene.add(rim);const orangeLight=new THREE.PointLight(0xf65335,10,8);orangeLight.position.set(-2,-1,2);scene.add(orangeLight);
  const titanium=new THREE.MeshPhysicalMaterial({color:0xaeb7c1,metalness:1,roughness:.22,envMapIntensity:1.45,clearcoat:.5,clearcoatRoughness:.2});
  const chrome=new THREE.MeshPhysicalMaterial({color:0xe5e8ed,metalness:1,roughness:.09,envMapIntensity:1.5,clearcoat:1});
  const graphite=new THREE.MeshStandardMaterial({color:0x161a22,metalness:.8,roughness:.25,envMapIntensity:1.4});
  const orange=new THREE.MeshStandardMaterial({color:0xe74628,emissive:0xf65335,emissiveIntensity:.14,metalness:.6,roughness:.25});
  const glow=new THREE.MeshBasicMaterial({color:0xff5937});
  function mesh(geometry,material,parent=model){const object=new THREE.Mesh(geometry,material);object.castShadow=true;object.receiveShadow=true;parent.add(object);return object;}
  function torus(radius,tube,material,parent=model,arc=Math.PI*2){return mesh(new THREE.TorusGeometry(radius,tube,18,180,arc),material,parent);}
  const chassis=new THREE.Group();model.add(chassis);
  // Machined annular body with bevels, concentric grooves and tiny fasteners.
  const annulus=new THREE.Shape();annulus.absarc(0,0,1.62,0,Math.PI*2,false);const hole=new THREE.Path();hole.absarc(0,0,1.24,0,Math.PI*2,true);annulus.holes.push(hole);
  const ring=mesh(new THREE.ExtrudeGeometry(annulus,{depth:.22,bevelEnabled:true,bevelSegments:5,bevelSize:.07,bevelThickness:.07,curveSegments:96,steps:1}),titanium,chassis);ring.position.z=-.11;
  const face=torus(1.435,.012,graphite,chassis);face.position.z=.193;
  const edge=torus(1.66,.035,chrome,chassis);edge.position.z=.02;
  const inner=torus(1.205,.029,orange,chassis);inner.position.z=.13;
  const led=torus(1.238,.006,glow,chassis);led.position.z=.182;
  for(let i=0;i<24;i++){const a=i/24*Math.PI*2;const screw=mesh(new THREE.CylinderGeometry(.019,.019,.009,10),graphite,chassis);screw.rotation.x=Math.PI/2;screw.position.set(Math.cos(a)*1.515,Math.sin(a)*1.515,.192);const tick=mesh(new THREE.BoxGeometry(.004,i%3===0?.07:.035,.004),chrome,chassis);tick.position.set(Math.cos(a)*1.35,Math.sin(a)*1.35,.192);tick.rotation.z=a-Math.PI/2;}
  for(const z of [-.16,-.11,-.06]){const groove=torus(1.615,.006,graphite,chassis);groove.position.z=z;}
  // A suspended obsidian core, enclosed by asymmetric kinetic ribbons.
  const core=mesh(new THREE.SphereGeometry(.62,64,48),new THREE.MeshPhysicalMaterial({color:0x141820,metalness:.95,roughness:.08,clearcoat:1,envMapIntensity:2}));
  // A softly etched silver question mark sits on the camera-facing skin of the obsidian core.
  const glyphCanvas=document.createElement('canvas');glyphCanvas.width=glyphCanvas.height=256;const glyphContext=glyphCanvas.getContext('2d');glyphContext.textAlign='center';glyphContext.textBaseline='middle';glyphContext.font='500 190px Arial';glyphContext.shadowColor='rgba(147,165,185,.45)';glyphContext.shadowBlur=8;glyphContext.fillStyle='rgba(198,209,221,.82)';glyphContext.fillText('?',128,132);
  const questionMark=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(glyphCanvas),transparent:true,opacity:.85,depthWrite:false,depthTest:true}));questionMark.scale.set(.45,.45,1);scene.add(questionMark);
  const halo=new THREE.Group();model.add(halo);const bands=[];
  for(let i=0;i<3;i++){const group=new THREE.Group();halo.add(group);const band=torus(.93+i*.045,.055,i===1?orange:chrome,group,Math.PI*1.7);group.rotation.set(.5+i*.65,.5+i*.75,i*.7);bands.push(group);}
  const outerOrbit=new THREE.Group();model.add(outerOrbit);const arc1=torus(2.0,.042,chrome,outerOrbit,Math.PI*1.65);outerOrbit.rotation.set(.92,-.62,.48);
  const arc2=torus(2.12,.014,graphite,outerOrbit);arc2.rotation.z=.4;
  const satellite=mesh(new THREE.SphereGeometry(.105,24,16),orange,outerOrbit);satellite.position.set(2,0,0);
  // Peripheral counterweights add construction detail and depth to the sculptural model.
  for(const a of [.3,Math.PI+.3]){const component=mesh(new THREE.BoxGeometry(.18,.45,.38),graphite,chassis);component.position.set(Math.cos(a)*1.7,Math.sin(a)*1.7,0);component.rotation.z=a+Math.PI/2;const inset=mesh(new THREE.BoxGeometry(.06,.28,.012),orange,chassis);inset.position.copy(component.position);inset.position.z=.2;inset.rotation.z=component.rotation.z;}
  model.rotation.set(.18,-.4,-.3);model.position.y=.1;
  const pedestal=mesh(new THREE.CylinderGeometry(1.18,1.28,.17,96),new THREE.MeshStandardMaterial({color:0x101216,metalness:.5,roughness:.44}),scene);pedestal.position.y=-2.45;const baseLip=torus(1.18,.013,titanium,scene);baseLip.rotation.x=Math.PI/2;baseLip.position.y=-2.36;
  const floor=new THREE.Mesh(new THREE.PlaneGeometry(25,25),new THREE.ShadowMaterial({opacity:.18}));floor.rotation.x=-Math.PI/2;floor.position.y=-2.55;floor.receiveShadow=true;scene.add(floor);
  const glintCanvas=document.createElement('canvas');glintCanvas.width=128;glintCanvas.height=128;const gc=glintCanvas.getContext('2d');const gradient=gc.createRadialGradient(64,64,0,64,64,64);gradient.addColorStop(0,'rgba(246,83,53,.28)');gradient.addColorStop(.45,'rgba(246,83,53,.06)');gradient.addColorStop(1,'rgba(246,83,53,0)');gc.fillStyle=gradient;gc.fillRect(0,0,128,128);const glint=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(glintCanvas),transparent:true,depthWrite:false,blending:THREE.AdditiveBlending}));glint.position.set(-.8,-.3,-.2);glint.scale.set(4,4,1);scene.add(glint);
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let elapsed=0,ringTime=0,chassisSpin=0,cameraDistance=8.4,last=performance.now(),lastRendered=0,raf=null,dragging=false,prevX=0,prevY=0,userX=0,userY=0,targetX=0,targetY=0,contextLost=false;
  const corePosition=new THREE.Vector3(),surfacePosition=new THREE.Vector3(),towardCamera=new THREE.Vector3(),projected=new THREE.Vector3();
  const framePoints=[];for(const x of [-1.3,1.3])for(const z of [-1.3,1.3])framePoints.push(new THREE.Vector3(x,-2.56,z));for(const point of [[-2.35,.1,0],[2.35,.1,0],[0,2.45,0],[0,-2.2,0]])framePoints.push(new THREE.Vector3(...point));
  function resize(){const w=mount.clientWidth,h=mount.clientHeight;if(!w||!h)return;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();cameraDistance=8.4;
    // Fit the pedestal's front edge as well as the rings, with explicit breathing room.
    for(let i=0;i<45;i++){camera.position.set(0,.4,cameraDistance);camera.lookAt(0,-.3,0);camera.updateMatrixWorld();if(framePoints.every(point=>{const p=point.clone().project(camera);return Math.abs(p.x)<.92&&Math.abs(p.y)<.92;}))break;cameraDistance+=.12;}
    draw();}
  function draw(){
    const t=elapsed;
    // Small layered harmonics create a buoyant, continuous motion without abrupt loops.
    const swayX=.045*Math.sin(t*.31)+.018*Math.sin(t*.53);
    const swayY=.16*Math.sin(t*.21)+.035*Math.sin(t*.37);
    const swayZ=.045*Math.sin(t*.25);
    model.rotation.set(.18+swayX+userY,-.4+swayY+userX,-.3+swayZ);
    model.position.y=.08+.045*Math.sin(t*.49)+.016*Math.sin(t*.79);
    chassis.rotation.z=.022*Math.sin(t*.28)+chassisSpin;
    bands.forEach((band,i)=>{const phase=i*.85;band.rotation.x=.5+i*.65+.06*(Math.sin(t*.24+phase)-Math.sin(phase));band.rotation.y=.5+i*.75+ringTime*(i===1?-.13:.095)+.025*Math.sin(t*.44);band.rotation.z=i*.7+ringTime*.055;});
    outerOrbit.rotation.set(.92+.035*Math.sin(t*.3),-.62+.05*Math.sin(t*.22),.48+ringTime*.065);
    core.rotation.y=t*.12;
    camera.position.set(0,.4,cameraDistance);camera.lookAt(0,-.3,0);camera.updateMatrixWorld();model.updateMatrixWorld(true);core.getWorldPosition(corePosition);towardCamera.copy(camera.position).sub(corePosition).normalize();surfacePosition.copy(corePosition).addScaledVector(towardCamera,.64);questionMark.position.copy(surfacePosition);questionMark.visible=experience.phase==='idle';projected.copy(surfacePosition).project(camera);trigger.style.left=(projected.x*.5+.5)*100+'%';trigger.style.top=(-projected.y*.5+.5)*100+'%';const size=Math.max(36,Math.min(66,mount.clientHeight*.085));trigger.style.width=trigger.style.height=size+'px';renderer.render(scene,camera);
  }
  function tick(time){raf=null;const dt=Math.min((time-last)/1000,.05);last=time;
    if(document.hidden||contextLost)return;
    stepExperience(dt);
    if(!window.worldPaused){elapsed+=dt;let boost=1;if(experience.phase==='enter'||experience.phase==='exit'){const duration=experience.phase==='enter'?.95:1.2;boost=1+42*Math.sin(Math.PI*Math.min(1,experience.time/duration))**2;}ringTime+=dt*boost;chassisSpin+=dt*(boost-1)*.16;}
    const damping=reduced.matches?1:1-Math.exp(-5*dt);
    userX+=(targetX-userX)*damping;userY+=(targetY-userY)*damping;
    if(time-lastRendered>=1000/60){lastRendered=time;draw();}
    if(!window.worldPaused||experience.phase!=='idle'||dragging||Math.abs(userX-targetX)>.0001||Math.abs(userY-targetY)>.0001)raf=requestAnimationFrame(tick);
  }
  function start(){if(raf)cancelAnimationFrame(raf);raf=null;last=performance.now();if(!document.hidden&&!contextLost){draw();if(!window.worldPaused||experience.phase!=='idle'||dragging||Math.abs(userX-targetX)>.0001||Math.abs(userY-targetY)>.0001)raf=requestAnimationFrame(tick);}}
  wake=start;
  mount.addEventListener('pointerdown',e=>{if(e.button!==0||experience.phase!=='idle')return;dragging=true;prevX=e.clientX;prevY=e.clientY;mount.setPointerCapture(e.pointerId);start();});
  mount.addEventListener('pointermove',e=>{if(!dragging)return;targetX=Math.max(-1.2,Math.min(1.2,targetX+(e.clientX-prevX)*.006));targetY=Math.max(-.4,Math.min(.4,targetY+(e.clientY-prevY)*.004));prevX=e.clientX;prevY=e.clientY;});
  const release=()=>{dragging=false;targetX=targetY=0;start();};
  mount.addEventListener('pointerup',release);mount.addEventListener('pointercancel',release);mount.addEventListener('lostpointercapture',()=>{if(dragging)release();});
  window.addEventListener('world-motion',start);document.addEventListener('visibilitychange',()=>{dragging=false;targetX=targetY=0;start();});
  new ResizeObserver(resize).observe(mount);
  renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();contextLost=true;if(raf)cancelAnimationFrame(raf);document.body.classList.add('webgl-unavailable');renderer.domElement.style.visibility='hidden';});
  renderer.domElement.addEventListener('webglcontextrestored',()=>{contextLost=false;document.body.classList.remove('webgl-unavailable');renderer.domElement.style.visibility='';resize();start();});
  document.body.dataset.worldReady='true';resize();start();
}
