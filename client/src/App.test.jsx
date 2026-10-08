import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import App from './App.jsx';

describe('ThreadForge app', () => {
  it('renders the storefront brand', () => {
    render(<MemoryRouter><App /></MemoryRouter>);
    expect(screen.getAllByText(/THREADFORGE/i)[0]).toBeInTheDocument();
  });
});
