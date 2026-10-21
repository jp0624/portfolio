export function filterProjects<T>(projects:T[],filters:{query?:string;category?:string;language?:string;sort?:string}):T[];


export function hasLiveSnapshot(project:{live?:string;image?:string;imageNote?:string}):boolean;
