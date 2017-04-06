import expect from 'expect';
import reducer, { initialState } from 'ducks';

describe('Drafts reducer', () => {
  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).toEqual(initialState);
  });
});
