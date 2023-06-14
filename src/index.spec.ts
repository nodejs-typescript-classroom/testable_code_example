import { countRepeatedWords } from './index';

describe('countRepeatedWords', () => {
  it('should return the correct result', () => {
    expect(countRepeatedWords('')).toBe(0)
    expect(countRepeatedWords('a a')).toBe(1)
    expect(countRepeatedWords('a b')).toBe(0)
    expect(countRepeatedWords('hello bye hello bye')).toBe(2)
    expect(countRepeatedWords('hello bye hello bye test')).toBe(2)
  })
})
