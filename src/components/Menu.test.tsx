import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Menu, { MenuItem } from './Menu';

describe('Menu', () => {
  it('renders menu items correctly', () => {
    const menuItems = [
      { label: 'Home', href: '/' },
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ];

    render(
      <Menu label="Test Menu">
        {menuItems.map((item) => (
          <MenuItem key={item.label} label={item.label} onClick={() => {}} />
        ))}
      </Menu>
    );

    expect(screen.getByRole('menu', { name: 'Test Menu' })).toBeInTheDocument();

    menuItems.forEach((item) => {
      const menuItem = screen.getByRole('menuitem', { name: item.label });
      expect(menuItem).toBeInTheDocument();
    });
  });

  it('calls onClick handler when menu item is clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <Menu label="Test Menu">
        <MenuItem label="Test Item" onClick={handleClick} />
      </Menu>
    );

    const menuItem = screen.getByRole('menuitem', { name: 'Test Item' });
    await user.click(menuItem);

    expect(handleClick).toHaveBeenCalled();
  });

  it('renders description when provided', () => {
    render(
      <Menu label="Test Menu">
        <MenuItem
          label="Test Item"
          description="This is a test description"
          onClick={() => {}}
        />
      </Menu>
    );

    const descriptionElement = screen.getByText('This is a test description');
    expect(descriptionElement).toBeInTheDocument();
  });

  it('applies disabled styles and exposes aria-disabled when disabled prop is true', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <Menu label="Test Menu">
        <MenuItem
          label="Disabled Item"
          description="Disabled item description"
          disabled
          onClick={handleClick}
        />
      </Menu>
    );

    const menuItem = screen.getByRole('menuitem', {
      name: /disabled item/i,
    });
    const descriptionElement = screen.getByText('Disabled item description');
    expect(menuItem).toHaveAttribute('aria-disabled', 'true');
    expect(menuItem).toHaveClass('cursor-not-allowed', 'text-stone-400');
    expect(descriptionElement).toHaveClass('text-stone-400');

    await user.click(menuItem);
    expect(handleClick).toHaveBeenCalled();
  });

  it('applies danger class when danger prop is true', () => {
    render(
      <Menu label="Test Menu">
        <MenuItem label="Danger Item" danger onClick={() => {}} />
      </Menu>
    );

    const menuItem = screen.getByRole('menuitem', { name: /danger item/i });
    expect(menuItem).toHaveClass('text-red-700');
    expect(screen.getByText('(destructive action)')).toHaveClass('sr-only');
  });
});
