import { RecordTimetableFragment } from './TimeTable.fragments'

export const GET_RECORDS = gql`
  query records_timetable($date: DateTime, $taskId: Int) {
    records(date: $date, taskId: $taskId) {
      ...RecordTimetableFragment
    }
  }
  ${RecordTimetableFragment}
`
