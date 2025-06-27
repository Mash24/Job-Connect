import React from 'react';
import { render, screen } from '@testing-library/react';
import StatusBadge from './StatusBadge';

describe('StatusBadge', () => {
  const cases = [
    { status: 'active', label: 'Active' },
    { status: 'inactive', label: 'Inactive' },
    { status: 'pending', label: 'Pending' },
    { status: 'suspended', label: 'Suspended' },
    { status: 'unknown', label: 'Unknown' },
    { status: undefined, label: 'Unknown' },
  ];

  it.each(cases)(
    'renders correct label for status: %s',
    ({ status, label }) => {
      render(<StatusBadge status={status} />);
      expect(screen.getByText(label)).toBeInTheDocument();
    }
  );
}); 