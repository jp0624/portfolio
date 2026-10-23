import {test,expect,vi} from 'vitest';
import {initializeAnalytics,MEASUREMENT_ID} from '../src/analytics';

test('analytics excludes development and previews, initializes once and records public project labels',()=>{
 const production={location:{hostname:'portfolio-johnparker.vercel.app',origin:'https://portfolio-johnparker.vercel.app',pathname:'/',search:'?private=value'},dataLayer:[] as IArguments[]};
 const listener=vi.spyOn(document,'addEventListener');
 try{
  vi.stubGlobal('window',production);
  vi.stubEnv('PROD',false);initializeAnalytics();
  expect(document.getElementById('portfolio-google-tag')).toBeNull();
  vi.stubEnv('PROD',true);production.location.hostname='preview.vercel.app';initializeAnalytics();
  expect(document.getElementById('portfolio-google-tag')).toBeNull();
  production.location.hostname='portfolio-johnparker.vercel.app';initializeAnalytics();initializeAnalytics();
  expect(document.querySelectorAll('#portfolio-google-tag')).toHaveLength(1);
  const script=document.getElementById('portfolio-google-tag') as HTMLScriptElement;
  expect(script.src).toBe(`https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`);
  expect(script.async).toBe(true);
  expect(Array.from(production.dataLayer[1])).toEqual(['config',MEASUREMENT_ID,{allow_google_signals:false,allow_ad_personalization_signals:false,page_location:'https://portfolio-johnparker.vercel.app/'}]);
  const callback=listener.mock.calls.find(([name])=>name==='click')![1] as EventListener;
  const card=document.createElement('article');card.className='card';
  card.innerHTML='<h3><button>Example project</button></h3><a href="https://github.com/jp0624/example">Source</a>';
  callback({target:card.querySelector('button')} as unknown as Event);
  callback({target:card.querySelector('a')} as unknown as Event);
  expect(Array.from(production.dataLayer[2])).toEqual(['event','project_details_open',{project_title:'Example project'}]);
  expect(Array.from(production.dataLayer[3])).toEqual(['event','project_link_click',{project_title:'Example project',link_type:'source',link_domain:'github.com'}]);
  const nav=document.createElement('a');nav.href='#design';callback({target:nav} as unknown as Event);
  expect(Array.from(production.dataLayer[4])).toEqual(['event','section_navigation',{section:'design'}]);
 }finally{
  document.getElementById('portfolio-google-tag')?.remove();
  listener.mockRestore();vi.unstubAllGlobals();vi.unstubAllEnvs();
 }
});
