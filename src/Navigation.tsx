import {useEffect, useRef, useState} from 'react';
import {Menu, X, ArrowUpRight} from 'lucide-react';

const sections=[['work','Work'],['about','About'],['experience','Experience'],['skills','Skills'],['design','Design'],['contact','Contact']];

export function Navigation({theme,onThemeChange,projectCount}:{theme:string,onThemeChange:()=>void,projectCount:number}){
 const [open,setOpen]=useState(false);
 const drawer=useRef<HTMLDialogElement>(null);
 const toggle=useRef<HTMLButtonElement>(null);
 useEffect(()=>{
  if(!open)return;
  const panel=drawer.current;
  const overflow=document.body.style.overflow;
  panel?.showModal();document.body.style.overflow='hidden';
  const desktop=window.matchMedia('(min-width: 901px)');
  const resize=()=>{if(desktop.matches)setOpen(false)};
  desktop.addEventListener('change',resize);
  return()=>{panel?.close();document.body.style.overflow=overflow;desktop.removeEventListener('change',resize);toggle.current?.focus()};
 },[open]);
 return <header className="header site-header"><div className="header-inner">
  <a className="wordmark" href="#">john parker<span>®</span></a>
  <nav className="desktop-nav" aria-label="Main navigation">{sections.map(([id,label])=><a key={id} href={`#${id}`}>{label}{id==='work'&&<span>{projectCount}</span>}</a>)}</nav>
  <div className="header-actions"><button className="theme-toggle" aria-label={`Switch to ${theme==='light'?'dark':'light'} theme`} onClick={onThemeChange}>{theme==='light'?'◐':'☀'}</button><button ref={toggle} className="menu-toggle" aria-label="Open navigation menu" aria-expanded={open} aria-controls="mobile-navigation" onClick={()=>setOpen(true)}><Menu size={22}/></button></div>
 </div>
 <dialog ref={drawer} id="mobile-navigation" className="navigation-drawer" aria-label="Navigation menu" onCancel={e=>{e.preventDefault();setOpen(false)}} onClick={e=>{if(e.target===e.currentTarget){const box=e.currentTarget.getBoundingClientRect();if(e.clientX<box.left)setOpen(false)}}}>
  <div className="drawer-heading"><p className="eyebrow">EXPLORE THE PORTFOLIO</p><button className="menu-close" aria-label="Close navigation menu" onClick={()=>setOpen(false)} autoFocus><X size={24}/></button></div>
  <nav aria-label="Mobile navigation">{sections.map(([id,label],i)=><a key={id} href={`#${id}`} onClick={()=>setOpen(false)}><span className="drawer-index">0{i+1}</span>{label}<ArrowUpRight size={23}/></a>)}</nav>
  <p className="drawer-note">Engineering. Design. A lot of making.</p>
 </dialog></header>
}
