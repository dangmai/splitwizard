export class Person {
  constructor(name="", moveInDate="", moveOutDate="") {
    this.name = name;
    this.moveInDate = moveOutDate;
    this.moveOutDate = moveOutDate;
  }
}

const initialPeopleState = [
  new Person(),
  new Person()
];

export const people = (state=initialPeopleState, action) => {
  switch (action.type) {
    case "ADD_PERSON":
      return [
        ...state,
        new Person()
      ];
    default:
      return state;
  }
};
