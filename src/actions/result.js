export function calculate(bills, people) {
  return {
    type: "CALCULATE",
    bills,
    people
  }
}

export function clearResults() {
  return {
    type: "CLEAR_RESULTS"
  };
}

export function toggleDetailedResult(index) {
  return {
    type: "TOGGLE_DETAILED_RESULT",
    index
  }
}