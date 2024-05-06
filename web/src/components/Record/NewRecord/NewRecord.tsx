import React, { createContext, useCallback, useContext } from 'react'

import { differenceInMilliseconds, getTime } from 'date-fns'
import { tasks } from 'types/graphql'

import { FormProvider, SubmitHandler, useForm } from '@redwoodjs/forms'
import {
  useMutation,
  useSuspenseQuery,
} from '@redwoodjs/web/dist/components/GraphQLHooksProvider'
import { toast } from '@redwoodjs/web/dist/toast'

import useToday from 'src/hooks/useToday'

import { CREATE_RECORD } from '../mutations'
import { GET_RECORDS } from '../TodayDuration/TodayDuration'

import TaskSelectField from './components/TaskSelectField'
import Timer from './components/Timer'
import TimerButton from './components/TimerButton'

interface NewRecordForm {
  taskId
  start
  end
}

interface Props {
  children:
    | ((props: { isRecording: boolean }) => React.ReactNode)
    | React.ReactNode
}

// TODO: 10시간 초과 기록 제한
// TODO: 할 일 조회시 로딩, 실패 ui
// TODO: 새 기록 생성시, 실패시

interface Context {
  tasks: tasks['tasks']
}

const NewRecordContext = createContext<null | Context>(null)

const GET_FIRST_TASK = gql`
  query tasks_newRecord($date: DateTime) {
    tasks(date: $date) {
      id
    }
  }
`

const NewRecord = ({ children }: Props) => {
  const { today } = useToday()
  const {
    data: { tasks },
  } = useSuspenseQuery(GET_FIRST_TASK, {
    variables: { date: today.toISOString(), limit: 1 },
  })

  const [createRecord] = useMutation(CREATE_RECORD, {
    onCompleted: () => toast.success('기록이 저장되었습니다'),
    onError: () => toast.error('잠시 후 다시 시도해주세요.'),
    update: (cache, { data: { createRecord: newRecord } }) => {
      // console.log('new record: ', newRecord)
      // const res = cache.modify({
      //   fields: {
      //     records(existingRecords = []) {
      //       console.log('prev records: ', existingRecords)
      //       const newRecordRef = cache.writeFragment({
      //         data: newRecord,
      //         fragment: gql`
      //           fragment NewRecord on Record {
      //             id
      //             start
      //             end
      //             taskId
      //           }
      //         `,
      //       })
      //       console.log('new record ref: ', newRecordRef)
      //       return [...existingRecords, newRecordRef]
      //     },
      //   },
      // })
      cache.updateQuery(
        {
          query: GET_RECORDS,
          variables: { date: today.toISOString() },
        },
        (data) => {
          // console.log('records cache: ', data)
          return {
            records: data ? data.records.concat(newRecord) : [newRecord],
          }
        }
      )
      cache.updateFragment(
        {
          fragment: TaskSelectField.fragment.task,
          fragmentName: 'TaskSelectFieldFragment',
          id: cache.identify({ __typename: 'Task', id: newRecord.taskId }),
        },
        (task) => {
          // console.log('data: ', task)
          return {
            ...task,
            records: task.records.concat(newRecord),
          }
        }
      )
    },
  })

  const method = useForm<NewRecordForm>({
    defaultValues: { taskId: tasks[0]?.id },
  })
  const {
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting },
  } = method
  const { start } = watch()

  const isUnderMinTime = useCallback(({ start, end }: NewRecordForm) => {
    const MIN_TIME = 1000 * 60 // 1 minute
    const durationTime = differenceInMilliseconds(end, start)
    return durationTime < MIN_TIME
  }, [])

  const onSubmit: SubmitHandler<NewRecordForm> = useCallback(
    async (input) => {
      reset({ taskId: input.taskId })
      // if (isUnderMinTime(input)) {
      //   toast('1분 미만의 기록은 저장되지 않습니다.')
      //   return
      // }
      // console.log('input: ', input)

      await createRecord({
        variables: { input },
        optimisticResponse: {
          createRecord: {
            __typename: 'Record',
            id: getTime(new Date()),
            ...input,
            task: {
              id: input.taskId,
              title: '',
              color: '',
            },
          },
        },
      })
    },
    [createRecord, reset, isUnderMinTime]
  )

  return (
    <FormProvider {...method}>
      <form onSubmit={handleSubmit(onSubmit)}>
        {typeof children === 'function'
          ? children({ isRecording: start })
          : children}
      </form>
    </FormProvider>
  )
}

export const useNewRecordContext = () => {
  const context = useContext(NewRecordContext)
  if (!context) {
    throw new Error('cannot be rendered outside of the NewRecordContext')
  }

  return context
}

NewRecord.TaskSelectField = TaskSelectField
NewRecord.TimerButton = TimerButton
NewRecord.Timer = Timer

export default NewRecord
