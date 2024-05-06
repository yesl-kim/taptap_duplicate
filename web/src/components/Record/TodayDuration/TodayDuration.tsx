import React, { memo } from 'react'

import { VStack } from '@chakra-ui/react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'

import { useSuspenseQuery } from '@redwoodjs/web/dist/components/GraphQLHooksProvider'

import useToday from 'src/hooks/useToday'
import { formatDuration, intervalListToDuration } from 'src/lib/formatters'

export const GET_RECORDS = gql`
  query records_todauDuration($date: DateTime) {
    records(date: $date) {
      id
      start
      end
    }
  }
`

const TodayDuration = () => {
  const { today } = useToday()
  const {
    data: { records },
  } = useSuspenseQuery(GET_RECORDS, {
    variables: { date: today.toISOString() },
  })

  const { hours, minutes, seconds } = formatDuration(
    intervalListToDuration(records)
  )

  return (
    <VStack spacing="1">
      <p className="font-medium text-slate-500">
        {format(today, 'yyyy. MM. dd. eee', { locale: ko })}
      </p>
      <p className="text-6xl text-slate-900">{`${hours}:${minutes}:${seconds}`}</p>
    </VStack>
  )
}

TodayDuration.query = {
  records: GET_RECORDS,
}

export default TodayDuration
