import {vi, afterEach} from 'vitest';
import {cleanup} from '@testing-library/react';
Object.defineProperty(window,'matchMedia',{writable:true,value:vi.fn().mockImplementation(()=>({matches:true,addEventListener:vi.fn(),removeEventListener:vi.fn()}))});
class Observer {observe(){} unobserve(){} disconnect(){}}
vi.stubGlobal('IntersectionObserver',Observer);
HTMLDialogElement.prototype.showModal=function(){this.setAttribute('open','')};
HTMLDialogElement.prototype.close=function(){this.removeAttribute('open')};
afterEach(()=>{cleanup();localStorage.clear();delete document.documentElement.dataset.theme;});
