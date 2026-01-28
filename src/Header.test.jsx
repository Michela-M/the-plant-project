import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import Header from './Header';

function TestPage({ label }) {
  return <div>{label}</div>;
}

describe('Header navigation', () => {
  it('navigates to each page when clicking menu items', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/']}>
        <Header />
        <Routes>
          <Route path="/" element={<TestPage label="Dashboard Page" />} />
          <Route
            path="/Encyclopedia"
            element={<TestPage label="Encyclopedia Page" />}
          />
          <Route
            path="/Collection"
            element={<TestPage label="Collection Page" />}
          />
        </Routes>
      </MemoryRouter>
    );

    // Dashboard
    await user.click(screen.getByText('Dashboard'));
    expect(screen.getByText('Dashboard Page')).toBeInTheDocument();

    // Encyclopedia
    await user.click(screen.getByText('Encyclopedia'));
    expect(screen.getByText('Encyclopedia Page')).toBeInTheDocument();

    // My Collection
    await user.click(screen.getByText('My Collection'));
    expect(screen.getByText('Collection Page')).toBeInTheDocument();
  });
});
