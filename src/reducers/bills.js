export class Bill {
  constructor(name="", amount=0, startDate="", endDate="") {
    this.name = name;
    this.amount = amount;
    this.startDate = startDate;
    this.endDate = endDate;
  }
}

const initialBillsState = [
  new Bill()
];

export const bills = (state=initialBillsState, action) => {
  switch (action.type) {
    case "ADD_BILL":
      return [
        ...state,
        new Bill()
      ];
    default:
      return state;
  }
}