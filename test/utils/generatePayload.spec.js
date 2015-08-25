import { Map, List, OrderedSet } from 'immutable';
import expect from 'expect';
import generatePayload from '../../src/utils/generatePayload';
import { PAYLOAD_CONTEXT, PAYLOAD_LIST, SCREEN } from '../../src/constants';

const context = new Map({ [SCREEN]: 'phone'});

describe('Utils', () => {
  describe('generatePayload', () => {
    it(`should Map.context has <context>`, () => {
      const v = generatePayload(context);
      expect(v.get(PAYLOAD_CONTEXT)).toBe(context);
    });

    it(`should Map.${PAYLOAD_LIST} be empty if <list> is empty`, () => {
      const l = List.of();
      const expected = OrderedSet.of();
      const v = generatePayload(context, l);
      expect(v.get(PAYLOAD_LIST).toArray()).toEqual(expected.toArray());
    });

    it(`should Map.${PAYLOAD_LIST} handle global value(s)`, () => {
      const l = List.of('a', 'b', 'c');
      const expected =
        new OrderedSet()
          .add(['phone', 'a'])
          .add(['phone', 'b'])
          .add(['phone', 'c']);
      const v = generatePayload(context, l);
      expect(v.get(PAYLOAD_LIST).toArray()).toEqual(expected.toArray());
    });

    it(`should keep only matching value(s)`, () => {
      const l = List.of('a', 'phone-b', 'fail-c');
      const expected =
        new OrderedSet()
          .add(['phone', 'a'])
          .add(['phone', 'b']);
      const v = generatePayload(context, l);
      expect(v.get(PAYLOAD_LIST).toArray()).toEqual(expected.toArray());
    });

    it(`should ignore invalid value(s)`, () => {
      const l = List.of('a', 'b', 'phone-c-fail');
      const expected =
        new OrderedSet()
          .add(['phone', 'a'])
          .add(['phone', 'b']);
      const v = generatePayload(context, l);
      expect(v.get(PAYLOAD_LIST).toArray()).toEqual(expected.toArray());
    });
  });
});