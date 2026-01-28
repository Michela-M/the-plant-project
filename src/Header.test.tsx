import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import Header from './Header';
import { describe, it, expect } from 'vitest';

function TestPage({ label }: { label: string }) {
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

    await user.click(screen.getByText('Dashboard'));
    expect(screen.getByText('Dashboard Page')).toBeInTheDocument();

    await user.click(screen.getByText('Encyclopedia'));
    expect(screen.getByText('Encyclopedia Page')).toBeInTheDocument();

    await user.click(screen.getByText('My Collection'));
    expect(screen.getByText('Collection Page')).toBeInTheDocument();
  });
});
