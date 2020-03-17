import { concat, sum } from './index';

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});

test('adds 12 + 12 to equal 1212', () => {
  expect(concat('12', '12')).toBe('1212**');
});
