import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { OrderStatus } from './OrderStatus';

describe('OrderStatus', () => {
  it('renders pending status correctly', () => {
    render(<OrderStatus status="pending" />);
    expect(screen.getByText('Pending')).toBeInTheDocument();
  });

  it('renders processing status correctly', () => {
    render(<OrderStatus status="processing" />);
    expect(screen.getByText('Processing')).toBeInTheDocument();
  });

  it('renders shipped status correctly', () => {
    render(<OrderStatus status="shipped" />);
    expect(screen.getByText('Shipped')).toBeInTheDocument();
  });

  it('renders delivered status correctly', () => {
    render(<OrderStatus status="delivered" />);
    expect(screen.getByText('Delivered')).toBeInTheDocument();
  });

  it('renders cancelled status correctly', () => {
    render(<OrderStatus status="cancelled" />);
    expect(screen.getByText('Cancelled')).toBeInTheDocument();
  });

  it('renders refunded status correctly', () => {
    render(<OrderStatus status="refunded" />);
    expect(screen.getByText('Refunded')).toBeInTheDocument();
  });
});
