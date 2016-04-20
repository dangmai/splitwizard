export function addPerson() {
  return {
    type: "ADD_PERSON",
  }
}

export function removePerson() {
  return {
    type: "REMOVE_PERSON",
    index,
  }
}