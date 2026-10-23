import React from 'react';
import {test,expect} from 'vitest';
import {render,screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {ArchiveGallery} from '../src/ArchiveGallery';
test('archive expands, filters, and links to original source pages',async()=>{
 const user=userEvent.setup();render(<ArchiveGallery/>);
 expect(screen.getAllByRole('img')).toHaveLength(41);
 await user.click(screen.getByRole('button',{name:/Print & collateral/}));
 expect(screen.getAllByRole('img')).toHaveLength(4);
 await user.click(screen.getByRole('button',{name:/All archive work/}));
 expect(screen.getAllByRole('img')).toHaveLength(41);
 expect(screen.getByRole('link',{name:/archive page 38/}).getAttribute('href')).toMatch(/\.pdf#page=38$/);
});
