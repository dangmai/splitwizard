export function calculate(bills, people) {
  return {
    type: "CALCULATE",
    bills,
    people
  }
}