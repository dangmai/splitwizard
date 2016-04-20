import expect from "expect";
import { people, Person } from "reducers/people";
import { addPerson, removePerson } from "actions/people"
import deepFreeze from "deep-freeze";


describe('People reducer:', () => {
  it('should return the initial state', () => {
    const initialState = people(undefined, {});
    expect(initialState.length).toEqual(2);
  });

  it('should handle ADD to initial state', () => {
    const newState = people(undefined, addPerson());
    expect(newState.length).toEqual(3);
    expect(newState[2].name).toEqual("");
    expect(newState[2].moveInDate).toEqual("");
    expect(newState[2].moveOutDate).toEqual("");
  });

  it('should handle ADD to custom state', () => {
    const initialState = [
      new Person("Test 1", "02/21/2000"),
      new Person("Test 2", "02/21/2000"),
      new Person("Test 3", "02/21/2000")
    ];
    deepFreeze(initialState);
    const newState = people(initialState, addPerson());
    expect(newState.length).toEqual(4);
    expect(newState[3].name).toEqual("");
    expect(newState[3].moveInDate).toEqual("");
    expect(newState[3].moveOutDate).toEqual("");
  });
});