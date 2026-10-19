export function filterProjects(projects,{query='',category='All work',language='All languages',sort='Featured'}={}) {
 const terms=query.trim().toLowerCase().split(/\s+/).filter(Boolean);
 const result=projects.filter(p=>(category==='All work'||p.category===category)&&(language==='All languages'||p.languages.includes(language))&&terms.every(term=>[p.title,p.description,p.category,p.status,...p.skills,...p.languages].join(' ').toLowerCase().includes(term)));
 if(sort==='A–Z')result.sort((a,b)=>a.title.localeCompare(b.title));
 if(sort==='Category')result.sort((a,b)=>a.category.localeCompare(b.category)||a.title.localeCompare(b.title));
 return result;
}
