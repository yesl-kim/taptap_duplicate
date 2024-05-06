import React, { memo, startTransition } from 'react'

import { Select, Text } from '@chakra-ui/react'

import { Controller, useFormContext } from '@redwoodjs/forms'
import { useSuspenseQuery } from '@redwoodjs/web/dist/components/GraphQLHooksProvider'

import useToday from 'src/hooks/useToday'

import TaskDuration from './components/TaskDuration'

const TaskSelectFieldFragment_task = gql`
  fragment TaskSelectFieldFragment on Task {
    id
    title
    ...TaskDurationFragment
  }
  ${TaskDuration.fragment.task}
`

const GET_TASKS = gql`
  query tasks_taskSelectField($date: DateTime) {
    tasks(date: $date) {
      ...TaskSelectFieldFragment
    }
  }

  ${TaskSelectFieldFragment_task}
`

const TaskSelectField = () => {
  const { today } = useToday()
  const {
    data: { tasks },
  } = useSuspenseQuery(GET_TASKS, {
    variables: { date: today.toISOString() },
  })
  const { control, watch } = useFormContext()
  const taskId = watch('taskId')
  // const [isPending, startTransition] = useTransition()

  return (
    <div className="flex flex-col items-center gap-2">
      <Controller
        name="taskId"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <Select
            {...field}
            // isDisabled={isPending}
            placeholder="할 일 선택하기"
            onChange={(e) =>
              startTransition(() =>
                field.onChange(e.target.value && parseInt(e.target.value))
              )
            }
          >
            {tasks.map(({ id, title }) => (
              <option key={id} value={id}>
                {title}
              </option>
            ))}
          </Select>
        )}
      />
      {taskId ? (
        <TaskDuration taskId={taskId} />
      ) : (
        <Text fontSize="sm" color="gray.500">
          00:00:00
        </Text>
      )}
    </div>
  )
}

TaskSelectField.fragment = {
  task: TaskSelectFieldFragment_task,
}

export default TaskSelectField
