import React from 'react';
import {test,expect} from 'vitest';
import {render,screen,fireEvent,within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {App} from '../src/App';

test('shows every live snapshot and groups the remaining projects without images', async()=>{
 const user=userEvent.setup();render(<App/>);
 expect(screen.getByRole('heading',{name:'John Parker.'})).toBeTruthy();
 expect(screen.getByRole('heading',{name:'Corel'})).toBeTruthy();
 expect(document.querySelectorAll('.project-image')).toHaveLength(20);
 expect(document.querySelectorAll('.compact-card')).toHaveLength(13);
 expect(document.querySelectorAll('.compact-card img')).toHaveLength(0);
 expect(screen.getByRole('link',{name:'Explore all projects'}).getAttribute('href')).toBe('#work');
 const archive=screen.getByRole('region',{name:'Behind the interfaces.'});
 expect(within(archive).getByRole('region',{name:'Backend & infrastructure additional projects'})).toBeTruthy();
 await user.click(within(archive).getByRole('button',{name:'Explore Le-Chat · CRM'}));
 expect(screen.getByRole('dialog').querySelector('img')).toBeNull();
 expect(within(screen.getByRole('dialog')).getByRole('link',{name:/View live app/})).toBeTruthy();
});
test('search finds hidden projects; modal exposes supplied link and current deployment details',async()=>{
 const user=userEvent.setup();render(<App/>);
 await user.type(screen.getByRole('textbox',{name:'Search projects'}),'jp chess');
 const trigger=screen.getByRole('button',{name:'Explore JP Chess'});await user.click(trigger);
 const dialog=screen.getByRole('dialog');expect(dialog.hasAttribute('open')).toBe(true);
 expect(within(dialog).getByText(/four computer levels, including Stockfish/)).toBeTruthy();
 expect(within(dialog).getByRole('link',{name:/View live app/}).getAttribute('href')).toBe('https://jpchess.vercel.app/');
 fireEvent(dialog,new Event('cancel',{cancelable:true}));expect(dialog.hasAttribute('open')).toBe(false);expect(document.activeElement).toBe(trigger);
});
test('category and language controls combine and reset an empty result',async()=>{
 const user=userEvent.setup();render(<App/>);
 await user.click(screen.getByRole('button',{name:'Simulation & 3D'}));
 await user.selectOptions(screen.getByRole('combobox',{name:'Filter by language'}),'SQL');
 expect(screen.getByText('No projects found.')).toBeTruthy();await user.click(screen.getByRole('button',{name:'Reset filters'}));
 expect(screen.getByRole('button',{name:'Explore Sinking Ship Entertainment'})).toBeTruthy();
});
test('theme persists and reduced motion makes reveal blocks visible',async()=>{
 const user=userEvent.setup();render(<App/>);expect(document.documentElement.dataset.theme).toBe('dark');await user.click(screen.getByRole('button',{name:'Switch to light theme'}));await user.click(screen.getByRole('button',{name:'Switch to dark theme'}));
 expect(document.documentElement.dataset.theme).toBe('dark');expect(localStorage.getItem('jp-theme')).toBe('dark');
 expect([...document.querySelectorAll('.reveal')].every(el=>el.classList.contains('is-visible'))).toBe(true);
});


