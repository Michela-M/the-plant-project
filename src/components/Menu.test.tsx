import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Menu, { MenuItem } from './Menu';

describe('Menu', () => {
  it('renders menu items correctly', () => {
    const menuItems = [
      { label: 'Home', href: '/' },
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ];

    render(
      <Menu>
        {menuItems.map((item) => (
          <MenuItem key={item.label} label={item.label} onClick={() => {}} />
        ))}
      </Menu>
    );

    menuItems.forEach((item) => {
      const linkElement = screen.getByText(item.label);
      expect(linkElement).toBeInTheDocument();
      expect(linkElement).toHaveAttribute('aria-label', item.label);
    });
  });

  it('calls onClick handler when menu item is clicked', () => {
    const handleClick = vi.fn();

    render(
      <Menu>
        <MenuItem label="Test Item" onClick={handleClick} />
      </Menu>
    );

    const menuItem = screen.getByText('Test Item');
    menuItem.click();

    expect(handleClick).toHaveBeenCalled();
  });

  it('renders description when provided', () => {
    render(
      <Menu>
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

  it('disables menu item when disabled prop is true', () => {
    const handleClick = vi.fn();

    render(
      <Menu>
        <MenuItem
          label="Disabled Item"
          description="Disabled item description"
          disabled
          onClick={handleClick}
        />
      </Menu>
    );

    const menuItem = screen.getByText('Disabled Item');
    const descriptionElement = screen.getByText('Disabled item description');
    expect(menuItem).toBeDisabled();
    expect(descriptionElement).toHaveClass('text-stone-400');
    menuItem.click();
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('applies danger class when danger prop is true', () => {
    render(
      <Menu>
        <MenuItem label="Danger Item" danger onClick={() => {}} />
      </Menu>
    );

    const menuItem = screen.getByText('Danger Item');
    expect(menuItem).toHaveClass('text-red-700');
  });
});
