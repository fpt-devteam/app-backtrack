import * as yup from "yup";

/**
 * Event Time Schema 
 * This schema defines the validation rules for the event time field.
 */
const CONSTANTS = {
  MIN_DATE: new Date(1900, 0, 1),
}

const ERROR = {
  EVENT_TIME_INVALID: "Invalid event time!",
  EVENT_TIME_IN_FUTURE: "Event time cannot be in the future!",
  EVENT_TIME_BEFORE_MIN_DATE: "Event time cannot be before Jan 1, 1900!",
}

export const MIN_DATE_EVENT_TIME = CONSTANTS.MIN_DATE;

export const eventTimeSchema = yup
  .date()
  .nullable()
  .optional() 
  .typeError(ERROR.EVENT_TIME_INVALID)
  .test("not-in-future", ERROR.EVENT_TIME_IN_FUTURE, (value) => {
    if (!value) return true; 
    const FUTURE_TOLERANCE_MS = 1000;
    return value.getTime() <= Date.now() + FUTURE_TOLERANCE_MS;
  })
  .test("not-before-min-date", ERROR.EVENT_TIME_BEFORE_MIN_DATE, (value) => {
    if (!value) return true;
    return value.getTime() >= MIN_DATE_EVENT_TIME.getTime();
  });

export type EventTime = yup.InferType<typeof eventTimeSchema>;