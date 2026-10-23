/** Only the public production site contributes to John's GA4 property. */
export const MEASUREMENT_ID='G-QBW5J5TN4J';
const productionHost='portfolio-johnparker.vercel.app';
type AnalyticsWindow=Window & {dataLayer?:unknown[];gtag?:(...args:unknown[])=>void};

export function initializeAnalytics(){
 if(!import.meta.env.PROD||window.location.hostname!==productionHost)return;
 const analytics=window as AnalyticsWindow;
 if(document.getElementById('portfolio-google-tag'))return;
 analytics.dataLayer=analytics.dataLayer||[];
 analytics.gtag=function(){analytics.dataLayer!.push(arguments)};
 analytics.gtag('js',new Date());
 analytics.gtag('config',MEASUREMENT_ID,{
  allow_google_signals:false,
  allow_ad_personalization_signals:false,
  page_location:window.location.origin+window.location.pathname,
 });
 const script=document.createElement('script');
 script.id='portfolio-google-tag';script.async=true;
 script.src=`https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
 document.head.appendChild(script);
 // Capture before React changes or removes a clicked control (for example, modal close).
 document.addEventListener('click',event=>{
  if(!(event.target instanceof Element))return;
  const control=event.target.closest('a,button');
  if(!control||control.matches(':disabled,[aria-disabled="true"]'))return;
  const area=control.closest('dialog')?.id==='mobile-navigation'?'mobile_menu'
   :control.closest('.detail')?'project_details'
   :control.closest('header')?'header'
   :control.closest('footer')?'footer'
   :control.closest('.new-hero')?'hero'
   :control.closest('section[id]')?.id||'page';
  const label=(control.getAttribute('aria-label')||control.textContent||'').replace(/\s+/g,' ').trim().slice(0,100);
  const context={control_label:label,ui_area:area};
  const link=control instanceof HTMLAnchorElement?control:null;
  const card=control.closest('.card,.compact-card,.detail');
  const title=card?.querySelector('.detail-body h2,h3,h4')?.textContent?.trim();
  if(link?.getAttribute('href')?.startsWith('#')){
   const section=link.getAttribute('href')!.slice(1)||'top';
   if(['top','work','about','experience','skills','design','contact'].includes(section)){
    analytics.gtag?.('event','section_navigation',{...context,section});return;
   }
  }
  if(title&&link){
   const destination=new URL(link.href);
   analytics.gtag?.('event','project_link_click',{
    ...context,project_title:title,
    link_type:destination.hostname==='github.com'?'source':link.textContent?.includes('Alternate')?'alternate_live':'live_app',
    link_domain:destination.hostname,
   });return;
  }
  if(title&&!link&&control.matches('.project-image,h3 button,h4 button,.compact-details')){
   analytics.gtag?.('event','project_details_open',{...context,project_title:title});return;
  }
  const group=control.closest('[role="group"]')?.getAttribute('aria-label');
  if(!link&&(group==='Project categories'||group==='Archive categories')){
   analytics.gtag?.('event','filter_change',{
    ...context,filter_name:group==='Project categories'?'project_category':'archive_category',
    filter_value:(control.childNodes[0]?.textContent||label).trim(),
   });return;
  }
  // Only destination domains are included: no email addresses, query strings or file IDs.
  if(link){
   const destination=new URL(link.href);
   analytics.gtag?.('event','link_click',{...context,link_domain:destination.hostname||destination.protocol.replace(':','')});
  }else analytics.gtag?.('event','button_click',context);
 },{capture:true,passive:true});
 document.addEventListener('change',event=>{
  if(!(event.target instanceof HTMLSelectElement))return;
  const select=event.target;
  const label=select.closest('label')?.querySelector('.sr-only')?.textContent?.trim();
  const name=label==='Filter by language'?'language':label==='Sort projects'?'sort':null;
  if(name)analytics.gtag?.('event','filter_change',{filter_name:name,filter_value:select.value,ui_area:'work'});
 },{passive:true});
 const measure=createScrollDepthTracker(percent=>analytics.gtag?.('event','scroll_depth',{percent_scrolled:percent}));
 let frame=0;
 window.addEventListener('scroll',()=>{
  if(frame)return;
  frame=window.requestAnimationFrame(()=>{
   frame=0;measure(window.scrollY,document.documentElement.scrollHeight,window.innerHeight);
  });
 },{passive:true});
}

/** Each milestone fires once per page load, even after scrolling back or resizing. */
export function createScrollDepthTracker(report:(percent:number)=>void){
 const reached=new Set<number>();
 return (scrollTop:number,pageHeight:number,viewportHeight:number)=>{
  const distance=pageHeight-viewportHeight;
  if(distance<=0||scrollTop<=0)return;
  const percent=scrollTop>=distance-2?100:Math.min(100,scrollTop/distance*100);
  for(const milestone of [25,50,75,100]){
   if(percent>=milestone&&!reached.has(milestone)){
    reached.add(milestone);report(milestone);
   }
  }
 };
}
