import {test,expect,vi} from 'vitest';
import {initializeAnalytics,MEASUREMENT_ID,createScrollDepthTracker} from '../src/analytics';

test('production analytics initializes once and covers buttons, links, modal actions and fixed filters without search text',()=>{
 const production=Object.assign(new EventTarget(),{
  location:{hostname:'portfolio-johnparker.vercel.app',origin:'https://portfolio-johnparker.vercel.app',pathname:'/',search:'?private=value'},
  dataLayer:[] as IArguments[],requestAnimationFrame:vi.fn(),scrollY:0,innerHeight:800,
 });
 const listener=vi.spyOn(document,'addEventListener').mockImplementation(()=>{});
 const fixture=document.createElement('div');
 fixture.innerHTML=`<header><button class="theme-toggle" aria-label="Switch to light theme">☀</button><a href="#design">Design</a></header>
 <section id="work"><div role="group" aria-label="Project categories"><button>Creative web<span>9</span></button></div>
 <label><span class="sr-only">Filter by language</span><select><option>TypeScript</option></select></label>
 <label><span class="sr-only">Sort projects</span><select><option>A–Z</option></select></label>
 <input value="private search text"><button aria-label="Clear search">×</button><button>Reset filters</button>
 <article class="card"><h3><button>Example project</button></h3><a href="https://github.com/jp0624/example">Source</a></article></section>
 <section id="design"><div role="group" aria-label="Archive categories"><button>Brand identities<span>10</span></button></div>
 <a href="https://example.com/file.pdf?secret=hidden#page=38" aria-label="View archive page 38">View original</a></section>
 <dialog><div class="detail"><button aria-label="Close project details">×</button><div class="detail-body"><h2>Example project</h2><a href="https://app.example.com/?secret=hidden">View live app</a><a href="https://github.com/jp0624/example">Explore source</a></div></div></dialog>
 <dialog id="mobile-navigation"><button aria-label="Open navigation menu">Menu</button><button aria-label="Close navigation menu">Close</button><a href="#skills">Skills</a></dialog>
 <footer><a href="mailto:private@example.com">Get in touch</a><button disabled>Disabled</button></footer>`;
 try{
  vi.stubGlobal('window',production);vi.stubEnv('PROD',false);initializeAnalytics();
  expect(document.getElementById('portfolio-google-tag')).toBeNull();
  vi.stubEnv('PROD',true);production.location.hostname='preview.vercel.app';initializeAnalytics();
  expect(document.getElementById('portfolio-google-tag')).toBeNull();
  production.location.hostname='portfolio-johnparker.vercel.app';initializeAnalytics();initializeAnalytics();
  expect(document.querySelectorAll('#portfolio-google-tag')).toHaveLength(1);
  expect((document.getElementById('portfolio-google-tag') as HTMLScriptElement).src).toBe(`https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`);
  expect(Array.from(production.dataLayer[1])).toEqual(['config',MEASUREMENT_ID,{allow_google_signals:false,allow_ad_personalization_signals:false,page_location:'https://portfolio-johnparker.vercel.app/'}]);
  const click=listener.mock.calls.find(([name])=>name==='click')![1] as EventListener;
  const change=listener.mock.calls.find(([name])=>name==='change')![1] as EventListener;
  const controls=[...fixture.querySelectorAll('a,button:not(:disabled),select')];
  for(const control of controls)(control.matches('select')?change:click)({target:control} as unknown as Event);
  const events=production.dataLayer.slice(2).map(args=>Array.from(args));
  expect(events).toHaveLength(controls.length);
  expect(events).toContainEqual(['event','project_details_open',expect.objectContaining({project_title:'Example project'})]);
  expect(events).toContainEqual(['event','project_link_click',expect.objectContaining({ui_area:'project_details',link_type:'live_app',link_domain:'app.example.com'})]);
  expect(events).toContainEqual(['event','project_link_click',expect.objectContaining({ui_area:'project_details',link_type:'source'})]);
  expect(events).toContainEqual(['event','button_click',{control_label:'Close project details',ui_area:'project_details'}]);
  expect(events).toContainEqual(['event','button_click',{control_label:'Switch to light theme',ui_area:'header'}]);
  expect(events).toContainEqual(['event','button_click',{control_label:'Close navigation menu',ui_area:'mobile_menu'}]);
  expect(events).toContainEqual(['event','section_navigation',expect.objectContaining({section:'skills',ui_area:'mobile_menu'})]);
  expect(events).toContainEqual(['event','filter_change',expect.objectContaining({filter_name:'project_category',filter_value:'Creative web'})]);
  expect(events).toContainEqual(['event','filter_change',expect.objectContaining({filter_name:'archive_category',filter_value:'Brand identities'})]);
  expect(events).toContainEqual(['event','filter_change',{filter_name:'language',filter_value:'TypeScript',ui_area:'work'}]);
  expect(events).toContainEqual(['event','filter_change',{filter_name:'sort',filter_value:'A–Z',ui_area:'work'}]);
  click({target:fixture.querySelector('button:disabled')} as unknown as Event);
  change({target:fixture.querySelector('input')} as unknown as Event);
  expect(production.dataLayer).toHaveLength(controls.length+2);
  expect(JSON.stringify(events)).not.toMatch(/private|secret|hidden|file\.pdf/);
  expect(listener.mock.calls.filter(([name])=>name==='click')).toHaveLength(1);
  expect(listener.mock.calls.find(([name])=>name==='click')![2]).toEqual({capture:true,passive:true});
 }finally{
  document.getElementById('portfolio-google-tag')?.remove();listener.mockRestore();vi.unstubAllGlobals();vi.unstubAllEnvs();
 }
});

test('scroll milestones fire once, catch crossed thresholds and tolerate fractional bottom positions',()=>{
 const report=vi.fn();const measure=createScrollDepthTracker(report);
 measure(0,2000,1000);measure(249,2000,1000);expect(report).not.toHaveBeenCalled();
 measure(250,2000,1000);expect(report.mock.calls).toEqual([[25]]);
 measure(800,2000,1000);expect(report.mock.calls).toEqual([[25],[50],[75]]);
 measure(200,2000,1000);measure(800,2000,1000);expect(report).toHaveBeenCalledTimes(3);
 measure(998.5,2000,1000);measure(1000,2000,1000);measure(1200,2200,1000);
 expect(report.mock.calls).toEqual([[25],[50],[75],[100]]);
});

test('non-scrollable pages emit nothing; a new visit has independent milestones',()=>{
 const report=vi.fn();const measure=createScrollDepthTracker(report);
 measure(0,500,800);measure(20,500,800);expect(report).not.toHaveBeenCalled();
 measure(1000,2000,1000);expect(report.mock.calls).toEqual([[25],[50],[75],[100]]);
 const nextVisit=createScrollDepthTracker(report);nextVisit(250,2000,1000);
 expect(report.mock.calls.at(-1)).toEqual([25]);expect(report).toHaveBeenCalledTimes(5);
});
