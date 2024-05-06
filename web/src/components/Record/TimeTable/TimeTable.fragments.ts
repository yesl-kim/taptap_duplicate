export const RecordTimetableFragment = gql`
  fragment RecordTimetableFragment on Record {
    id
    start
    end
    task {
      id
      title
      color
    }
  }
`
