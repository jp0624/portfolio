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
 // Delegation survives React renders. Send public labels, never search input values.
 document.addEventListener('click',event=>{
  if(!(event.target instanceof Element))return;
  const control=event.target.closest('a,button');
  if(!control)return;
  const link=control instanceof HTMLAnchorElement?control:null;
  if(link?.getAttribute('href')?.startsWith('#')){
   const section=link.getAttribute('href')!.slice(1)||'top';
   if(['top','work','about','experience','skills','design','contact'].includes(section))
    analytics.gtag?.('event','section_navigation',{section});
  }
  const card=control.closest('.card,.compact-card');
  const title=card?.querySelector('h3,h4')?.textContent?.trim();
  if(!title)return;
  if(link){
   const destination=new URL(link.href);
   analytics.gtag?.('event','project_link_click',{
    project_title:title,
    link_type:destination.hostname==='github.com'?'source':'live_app',
    link_domain:destination.hostname,
   });
  }else if(control.matches('.project-image,h3 button,h4 button,.compact-details')){
   analytics.gtag?.('event','project_details_open',{project_title:title});
  }
 });
}
