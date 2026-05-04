import { describe, it, expect } from 'vitest';
import { SheepLoader } from './SheepLoader';

describe('SheepLoader Component', () => {
  it('component should be defined', () => {
    expect(SheepLoader).toBeDefined();
  });

  it('component should be a function', () => {
    expect(typeof SheepLoader).toBe('function');
  });

  it('component should return JSX element', () => {
    const result = SheepLoader();
    expect(result).toBeDefined();
    expect(result.type).toBe('div');
  });

  it('should render with correct structure', () => {
    const element = SheepLoader();
    expect(element.props.className).toContain('fixed');
    expect(element.props.className).toContain('inset-0');
    expect(element.props.className).toContain('z-50');
  });

  it('should have gradient background classes', () => {
    const element = SheepLoader();
    expect(element.props.className).toContain('bg-gradient-to-b');
  });

  it('should have flex layout', () => {
    const element = SheepLoader();
    expect(element.props.className).toContain('flex');
  });
});
