import React from 'react';
import {test,expect} from 'vitest';
import {render,screen,fireEvent,within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {App} from '../src/App';

test('profile renders career and education; reveal-all expands the project catalogue', async()=>{
 const user=userEvent.setup();render(<App/>);
 expect(screen.getByRole('heading',{name:'John Parker.'})).toBeTruthy();
 expect(screen.getByRole('heading',{name:'Corel'})).toBeTruthy();
 expect(screen.getByRole('heading',{name:'University of Toronto'})).toBeTruthy();
 expect(screen.getAllByRole('button',{name:/^Explore /}).filter(x=>x.classList.contains('project-image'))).toHaveLength(8);
 await user.click(screen.getByRole('button',{name:'Explore all 33 projects'}));
 expect(screen.getAllByRole('button',{name:/^Explore /}).filter(x=>x.classList.contains('project-image'))).toHaveLength(33);
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
 const user=userEvent.setup();render(<App/>);await user.click(screen.getByRole('button',{name:'Switch to dark theme'}));
 expect(document.documentElement.dataset.theme).toBe('dark');expect(localStorage.getItem('jp-theme')).toBe('dark');
 expect([...document.querySelectorAll('.reveal')].every(el=>el.classList.contains('is-visible'))).toBe(true);
});

