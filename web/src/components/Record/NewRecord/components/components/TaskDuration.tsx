import React, { useMemo } from 'react'

import { useFragment } from '@apollo/client'
import { Text } from '@chakra-ui/react'

import { RECORDS_FIELDS_FOR_DURATION } from 'src/graphql/duration'
import { formatDuration, intervalListToDuration } from 'src/lib/formatters'

const TaskDurationFragment = gql`
  fragment TaskDurationFragment on Task {
    records {
      ...RecordsFields
    }
  }

  ${RECORDS_FIELDS_FOR_DURATION}
`

const defaultValue = { hours: 0, minutes: 0, seconds: 0 }

const TaskDuration = ({ taskId }: { taskId: number }) => {
  const { complete, data, missing } = useFragment({
    fragment: TaskDurationFragment,
    fragmentName: 'TaskDurationFragment',
    from: {
      __typename: 'Task',
      id: taskId,
    },
  })

  console.log(complete, taskId, data, missing)

  const { hours, minutes, seconds } = useMemo(
    () =>
      formatDuration(
        data ? intervalListToDuration(data.records) : defaultValue
      ),
    [data]
  )

  return (
    <Text fontSize="sm" color="gray.500">
      {`${hours}:${minutes}:${seconds}`}
    </Text>
  )
}

TaskDuration.fragment = {
  task: TaskDurationFragment,
}

export default TaskDuration
