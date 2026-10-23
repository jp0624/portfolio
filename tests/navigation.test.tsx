import React from 'react';
import {test,expect} from 'vitest';
import {render,screen,within,fireEvent} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {Navigation} from '../src/Navigation';

test('both navigation surfaces link every section; drawer restores focus and scrolling',async()=>{
 const user=userEvent.setup();render(<Navigation theme="dark" projectCount={39} onThemeChange={()=>{}}/>);
 expect(within(screen.getByRole('navigation',{name:'Main navigation'})).getAllByRole('link')).toHaveLength(6);
 const trigger=screen.getByRole('button',{name:'Open navigation menu'});
 await user.click(trigger);
 const drawer=screen.getByRole('dialog',{name:'Navigation menu'});
 expect(trigger.getAttribute('aria-expanded')).toBe('true');
 expect(document.body.style.overflow).toBe('hidden');
 expect(within(drawer).getAllByRole('link')).toHaveLength(6);
 await user.click(within(drawer).getByRole('link',{name:/Skills/}));
 expect(drawer.hasAttribute('open')).toBe(false);
 expect(document.body.style.overflow).toBe('');
 expect(document.activeElement).toBe(trigger);
 await user.click(trigger);
 fireEvent(drawer,new Event('cancel',{cancelable:true}));
 expect(trigger.getAttribute('aria-expanded')).toBe('false');
 expect(drawer.hasAttribute('open')).toBe(false);
});
