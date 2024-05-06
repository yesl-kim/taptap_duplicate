// TODO: 공통적인 duration 필드는 global로

const TodayDurationFragment = gql`
  fragment TodayDurationFragment on Record {
    id
    start
    end
  }
`

export default TodayDurationFragment
