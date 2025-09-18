import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Button } from '@/components/ui/Button';

test('renders button text', () => {
  render(<Button>Save</Button>);
  expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
});
