import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ImagePreview from './ImagePreview';

describe('ImagePreview', () => {
  it('does not render description when not provided', () => {
    render(
      <ImagePreview url="https://example.com/snake.jpg" alt="Sample Image" />
    );

    expect(
      screen.queryByText('This is a sample image thumbnail.')
    ).not.toBeInTheDocument();
  });

  it('renders the image thumbnail and description', () => {
    render(
      <ImagePreview
        url="https://example.com/snake.jpg"
        alt="Sample Image"
        description="This is a sample image thumbnail."
      />
    );

    expect(screen.getByAltText('Sample Image')).toBeInTheDocument();
    expect(
      screen.getByText('This is a sample image thumbnail.')
    ).toBeInTheDocument();
  });

  it('opens the modal when the thumbnail is clicked', async () => {
    render(
      <ImagePreview
        url="https://example.com/snake.jpg"
        alt="Sample Image"
        description="This is a sample image thumbnail."
      />
    );

    const button = screen.getByRole('button', { name: /sample image/i });
    await userEvent.click(button);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /close image preview backdrop/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /^close image preview$/i })
    ).toBeInTheDocument();
    expect(screen.getByAltText('Sample Image (enlarged)')).toHaveAttribute(
      'src',
      'https://example.com/snake.jpg'
    );
  });

  it('closes the modal when the backdrop is clicked', async () => {
    render(
      <ImagePreview
        url="https://example.com/snake.jpg"
        alt="Sample Image"
        description="This is a sample image thumbnail."
      />
    );

    const button = screen.getByRole('button', { name: /sample image/i });
    await userEvent.click(button);

    const backdrop = screen.getByRole('button', {
      name: /close image preview backdrop/i,
    });
    await userEvent.click(backdrop);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes the modal when the enlarged image is clicked', async () => {
    render(
      <ImagePreview
        url="https://example.com/snake.jpg"
        alt="Sample Image"
        description="This is a sample image thumbnail."
      />
    );

    const thumbnailButton = screen.getByRole('button', {
      name: /sample image/i,
    });
    await userEvent.click(thumbnailButton);

    const imageCloseButton = screen.getByRole('button', {
      name: /^close image preview$/i,
    });

    await userEvent.click(imageCloseButton);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes the modal when the Escape key is pressed', async () => {
    render(
      <ImagePreview
        url="https://example.com/snake.jpg"
        alt="Sample Image"
        description="This is a sample image thumbnail."
      />
    );

    const button = screen.getByRole('button', { name: /sample image/i });
    await userEvent.click(button);
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
