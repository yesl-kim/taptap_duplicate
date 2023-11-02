import { Suspense } from 'react'

import { Center } from '@chakra-ui/react'

import { DateField, FormProvider, useForm } from '@redwoodjs/forms'
import { MetaTags } from '@redwoodjs/web'

// import TimeTableHeader from 'src/components/TimeTable/components/TimeTableHeader'
import TimeTable from 'src/components/TimeTable/TimeTable'

/**
 *
 * @ 페이지 구조
 * - main
 *   - header: 날짜 선택
 *   - section: 타임테이블 (계획, 기록)
 *   - section: <선택 날짜>에 대한 할 일 목록
 */

interface TimeTablePageContext {
  date: Date
}

const TimeTablePage = () => {
  const context = useForm<TimeTablePageContext>({
    defaultValues: {
      date: new Date(), // FIXME: useToday
    },
  })
  const { register } = context

  return (
    <>
      <MetaTags title="TimeTable" description="TimeTable page" />
      <FormProvider {...context}>
        <main>
          <header>
            <DateField {...register('date')} />
          </header>
          <Suspense fallback={<div>loading...</div>}>
            <Center as="section" bg="white" h="full">
              <TimeTable />
            </Center>
          </Suspense>
        </main>
      </FormProvider>
    </>
  )
}

export default TimeTablePage
