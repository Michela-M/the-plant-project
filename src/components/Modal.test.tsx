import Modal from './Modal';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

describe('Modal component', () => {
  it('renders title and children', () => {
    render(
      <Modal title="Test Modal" onClose={() => {}} type="passive">
        <p>Modal content</p>
      </Modal>
    );

    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const onCloseMock = vi.fn();

    render(
      <Modal title="Test Modal" onClose={onCloseMock} type="passive">
        <p>Modal content</p>
      </Modal>
    );

    const closeButton = screen.getByRole('button', { name: /close/i });
    closeButton.click();

    expect(onCloseMock).toHaveBeenCalled();
  });

  it('renders action buttons for transactional type', () => {
    render(
      <Modal
        title="Test Modal"
        onClose={() => {}}
        type="transactional"
        label="Confirm"
      >
        <p>Modal content</p>
      </Modal>
    );

    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /confirm/i })
    ).toBeInTheDocument();
  });

  it('renders action button for acknowledgement type', () => {
    render(
      <Modal
        title="Test Modal"
        onClose={() => {}}
        type="acknowledgement"
        label="OK"
      >
        <p>Modal content</p>
      </Modal>
    );

    expect(screen.getByRole('button', { name: /ok/i })).toBeInTheDocument();
  });

  it('calls onConfirm when confirm button is clicked for transactional type', () => {
    const onConfirmMock = vi.fn();

    render(
      <Modal
        title="Test Modal"
        onClose={() => {}}
        type="transactional"
        label="Confirm"
        onConfirm={onConfirmMock}
      >
        <p>Modal content</p>
      </Modal>
    );

    const confirmButton = screen.getByRole('button', { name: /confirm/i });
    confirmButton.click();

    expect(onConfirmMock).toHaveBeenCalled();
  });

  it('calls onConfirm when OK button is clicked for acknowledgement type', () => {
    const onConfirmMock = vi.fn();

    render(
      <Modal
        title="Test Modal"
        onClose={() => {}}
        type="acknowledgement"
        label="OK"
        onConfirm={onConfirmMock}
      >
        <p>Modal content</p>
      </Modal>
    );

    const okButton = screen.getByRole('button', { name: /ok/i });
    okButton.click();

    expect(onConfirmMock).toHaveBeenCalled();
  });
});
