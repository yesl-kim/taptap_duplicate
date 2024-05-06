import { RecordTimetableFragment } from './TimeTable/TimeTable.fragments'
import TodayDurationFragment from './TodayDuration/TodayDuration.fragments'

export const CREATE_RECORD = gql`
  mutation createRecord($input: CreateRecordInput!) {
    createRecord(input: $input) {
      id
      taskId
      ...TodayDurationFragment
      ...RecordTimetableFragment
    }
  }

  ${TodayDurationFragment}
  ${RecordTimetableFragment}
`
