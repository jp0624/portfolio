import {useState} from 'react';
import {ArrowUpRight, ArrowDown} from 'lucide-react';
import archive from './archive.json';
const source='https://jp-clients.s3.amazonaws.com/_docs/portfolio_12-02-14-opt.pdf';
const categories=['All archive work',...new Set(archive.map(item=>item.category))];
export function ArchiveGallery(){
 const [category,setCategory]=useState('All archive work');
 const [expanded,setExpanded]=useState(true);
 const filtered=archive.filter(item=>category==='All archive work'||item.category===category);
 const shown=expanded?filtered:filtered.slice(0,6);
 return <section className="archive-gallery" aria-labelledby="design-archive-title">
  <div className="archive-heading"><div><p className="eyebrow">FROM THE 2014 ARCHIVE</p><h3 id="design-archive-title">Earlier work. Original perspective.</h3></div><p>Websites, campaigns, identities and print.<br/>Original portfolio pages, preserved as presented.</p></div>
  <div className="tabs" role="group" aria-label="Archive categories">{categories.map(c=><button key={c} aria-pressed={category===c} className={category===c?'active':''} onClick={()=>{setCategory(c);setExpanded(true)}}>{c}<span>{c==='All archive work'?archive.length:archive.filter(item=>item.category===c).length}</span></button>)}</div>
  <p className="archive-count" aria-live="polite">Showing {shown.length} of {filtered.length} archive pages · Opens the original PDF</p>
  <div className="archive-gallery-grid">{shown.map(item=><article key={item.page} className="archive-gallery-card"><a href={`${source}#page=${item.page}`} target="_blank" rel="noreferrer" aria-label={`View ${item.title}, archive page ${item.page}`}><div className="archive-preview"><img src={`${import.meta.env.BASE_URL}${item.image}`} alt={`Original 2014 portfolio page ${item.page}: ${item.title}`} loading="lazy" width="918" height="1188"/><span>View original <ArrowUpRight size={14}/></span></div><div className="archive-caption"><span>{item.category}</span><span>{String(item.page).padStart(2,'0')} / 41</span></div><h4>{item.title}<ArrowUpRight size={16}/></h4></a></article>)}</div>
  {filtered.length>shown.length&&<div className="archive-more"><button className="primary explore-all" onClick={()=>setExpanded(true)}>Explore all {filtered.length} archive pages <ArrowDown size={16}/></button></div>}
 </section>
}
