// App.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HomePage from '../../components/HomePage';
import { useAuth } from '../../components/AuthContext';


// Mock the useAuth hook
jest.mock('../../components/AuthContext', () => ({
  useAuth: jest.fn(),
}));


describe('HomePage', () => {
  beforeEach(() => {
    // Ensure useAuth mock is reset before each test
    useAuth.mockReset();
  });

  it('renders correctly when user is authenticated', () => {
    // ARRANGE
    useAuth.mockReturnValue({
      authToken: 'valid_token',
      email: 'user@example.com',
    });

    // ACT
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    // ASSERT
    expect(screen.getByText(/Enter City Name/)).toBeInTheDocument();
  });

});


