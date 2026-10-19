import {useEffect, useRef, type ReactNode} from 'react';
/** Scroll and pointer effects update CSS properties, without React renders. */
export function useScrollScene(){
 useEffect(()=>{
  const media=window.matchMedia('(prefers-reduced-motion: reduce)');
  const fine=window.matchMedia('(hover: hover) and (pointer: fine)');
  let frame=0;let pointerFrame=0;let pointer:PointerEvent|null=null;
  const update=()=>{
   frame=0;if(media.matches||document.documentElement.dataset.motion==='paused')return;const viewport=window.innerHeight;
   document.documentElement.style.setProperty('--scroll-progress',`${window.scrollY/Math.max(1,document.documentElement.scrollHeight-viewport)}`);
   document.querySelectorAll<HTMLElement>('[data-parallax]').forEach(el=>{
    const rect=el.getBoundingClientRect();const previous=parseFloat(el.style.getPropertyValue('--parallax-y'))||0;
    const top=rect.top-previous;if(top+rect.height < -200||top>viewport+200)return;
    const speed=Number(el.dataset.parallax)||.08;
    el.style.setProperty('--parallax-y',`${Math.max(-95,Math.min(95,(viewport/2-top-rect.height/2)*speed))}px`);
   });
   document.querySelectorAll<HTMLElement>('.technical-scene').forEach(el=>{
    const r=el.getBoundingClientRect();const progress=Math.max(0,Math.min(1,(viewport-r.top)/(viewport+r.height)));
    el.style.setProperty('--scene-progress',String(progress));
   });
  };
  const request=()=>{if(!frame)frame=requestAnimationFrame(update)};
  const reset=(el:HTMLElement)=>{el.style.setProperty('--tilt-x','0deg');el.style.setProperty('--tilt-y','0deg');el.style.setProperty('--light-opacity','0')};
  let active:HTMLElement|null=null;
  const move=(event:PointerEvent)=>{
   if(media.matches||document.documentElement.dataset.motion==='paused'||!fine.matches||document.querySelector('dialog[open]'))return;
   pointer=event;if(pointerFrame)return;
   pointerFrame=requestAnimationFrame(()=>{
    pointerFrame=0;if(!pointer)return;
    const target=pointer.target instanceof Element?pointer.target.closest<HTMLElement>('.project-image,.portrait-scene'):null;
    if(active&&active!==target)reset(active);active=target;if(!target)return;
    const r=target.getBoundingClientRect(),x=(pointer.clientX-r.left)/r.width,y=(pointer.clientY-r.top)/r.height;
    target.style.setProperty('--tilt-x',`${(0.5-y)*5}deg`);target.style.setProperty('--tilt-y',`${(x-0.5)*6}deg`);
    target.style.setProperty('--light-x',`${x*100}%`);target.style.setProperty('--light-y',`${y*100}%`);target.style.setProperty('--light-opacity','1');
   });
  };
  const leave=()=>{if(active)reset(active);active=null};
  const configure=()=>{
   if(media.matches){cancelAnimationFrame(frame);frame=0;cancelAnimationFrame(pointerFrame);pointerFrame=0;leave();document.querySelectorAll<HTMLElement>('[data-parallax]').forEach(el=>el.style.setProperty('--parallax-y','0px'))}
   else request();
  };
  window.addEventListener('scroll',request,{passive:true});window.addEventListener('resize',request);
  document.addEventListener('pointermove',move,{passive:true});document.addEventListener('pointerleave',leave);
  media.addEventListener('change',configure);configure();
  return()=>{window.removeEventListener('scroll',request);window.removeEventListener('resize',request);document.removeEventListener('pointermove',move);document.removeEventListener('pointerleave',leave);media.removeEventListener('change',configure);cancelAnimationFrame(frame);cancelAnimationFrame(pointerFrame);leave()};
 },[]);
}
export function MotionRibbon(){return <div className="motion-ribbon" aria-label="Engineering, design, leadership"><div aria-hidden="true" className="ribbon-track">{[0,1,2,3].map(i=><span key={i}>ENGINEERING <i>↗</i> DESIGN <i>✳</i> LEADERSHIP <i>↗</i></span>)}</div></div>}
export function Reveal({children,className=''}:{children:ReactNode,className?:string}){
 const el=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const media=window.matchMedia('(prefers-reduced-motion: reduce)');
  if(media.matches){el.current?.classList.add('is-visible');return}
  const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');observer.unobserve(e.target)}}),{threshold:.06});
  const reveal=()=>{if(media.matches)el.current?.classList.add('is-visible')};media.addEventListener('change',reveal);
  if(el.current)observer.observe(el.current);
  return()=>{observer.disconnect();media.removeEventListener('change',reveal)};
 },[]);
 return <div ref={el} className={`reveal ${className}`}>{children}</div>
}
