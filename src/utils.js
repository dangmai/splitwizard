"use strict";

import moment from "moment";

export function validateDate(date) {
  return moment(date).isValid();
}