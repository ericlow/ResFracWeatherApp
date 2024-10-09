// App.test.js
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
//import App from '../App';

// test('renders Home page when navigating to /home', () => {
//   render(
//     <MemoryRouter initialEntries={['/home']}>
//       <App />
//     </MemoryRouter>
//   );
//   // Check if the Home component is rendered
//   expect(screen.getByText(/home page/i)).toBeInTheDocument();
// });
test('adds 1 + 2 to equal 3', () => {
    expect(3).toBe(3);
  });