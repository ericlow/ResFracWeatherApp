// App.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HomePage from '../../components/HomePage';

test('render home page content', ()=> {
    render(
        <MemoryRouter>
          <HomePage />
        </MemoryRouter>
      );

    // Check for the presence of heading
    expect(screen.getByText(/Home Page Header/i)).toBeInTheDocument();
});



