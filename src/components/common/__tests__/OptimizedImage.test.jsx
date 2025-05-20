import { render, screen } from '@testing-library/react';
import OptimizedImage from '../OptimizedImage';

describe('OptimizedImage', () => {
  const defaultProps = {
    src: 'test-image.jpg',
    alt: 'Test image',
    width: 100,
    height: 100,
  };

  it('renders with correct props', () => {
    render(<OptimizedImage {...defaultProps} />);
    const image = screen.getByAltText('Test image');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'test-image.jpg');
    expect(image).toHaveAttribute('width', '100');
    expect(image).toHaveAttribute('height', '100');
  });

  it('applies custom className', () => {
    render(<OptimizedImage {...defaultProps} className="custom-class" />);
    const container = screen.getByAltText('Test image').parentElement;
    expect(container).toHaveClass('custom-class');
  });

  it('handles lazy loading', () => {
    render(<OptimizedImage {...defaultProps} />);
    const image = screen.getByAltText('Test image');
    expect(image).toHaveAttribute('loading', 'lazy');
  });

  it('shows loading state initially', () => {
    render(<OptimizedImage {...defaultProps} />);
    const image = screen.getByAltText('Test image');
    expect(image).toHaveStyle({ opacity: 0 });
  });
}); 