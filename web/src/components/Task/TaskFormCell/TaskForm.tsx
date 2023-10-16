import { useCallback } from 'react'

import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Input,
  VStack,
} from '@chakra-ui/react'

import {
  useForm,
  SubmitHandler,
  FormProvider,
  Controller,
} from '@redwoodjs/forms'

import CategoryRadio from './components/CategoryRadio'
import ColorRadio from './components/ColorRadio'
import DateField from './components/DateField'
import RepeatField from './components/RepeatField'
import TimeField from './components/TimeField/TimeField'
import { TaskFormProps, TaskFormData } from './TaskForm.types'
import { OPTIONS, defaultValues } from './TaskForm.utils'

const TaskForm = ({ task, onSave, onCancel, categories }: TaskFormProps) => {
  const formMethod = useForm<TaskFormData>({
    defaultValues: {
      ...defaultValues,
      ...(task
        ? { title: task.title, category: task.categoryId, color: task.color }
        : { category: categories[0].id }),
    },
  })

  const {
    register,
    watch,
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = formMethod

  const { color, category } = watch()

  const onSubmit: SubmitHandler<TaskFormData> = useCallback(
    async (data) => {
      await onSave(data, task?.id)
    },
    [onSave, task]
  )

  return (
    <FormProvider {...formMethod}>
      <form
        className="flex w-full flex-col gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <VStack as="main" gap="5" mb="5">
          <FormControl>
            <FormLabel>제목</FormLabel>
            <Input type="text" {...register('title', { required: true })} />
          </FormControl>

          <FormControl as="fieldset">
            <FormLabel as="legend">카테고리</FormLabel>
            <HStack>
              {categories.map(({ id, title }) => (
                <Controller
                  key={id}
                  name="category"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <CategoryRadio
                      {...field}
                      value={id}
                      label={title}
                      active={category === id}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  )}
                />
              ))}
            </HStack>
          </FormControl>

          <FormControl as="fieldset">
            <FormLabel as="legend">색상</FormLabel>
            <Flex
              flexWrap="wrap"
              justify="space-between"
              rowGap="2"
              columnGap="2%"
            >
              {OPTIONS.color.map((value) => (
                <ColorRadio
                  {...register('color')}
                  key={value}
                  value={value}
                  active={value === color}
                />
              ))}
            </Flex>
          </FormControl>

          <DateField />
          <TimeField />
          <RepeatField />
        </VStack>

        <footer className="flex flex-row justify-end gap-4">
          <Button onClick={onCancel}>취소</Button>
          <Button type="submit" isLoading={isSubmitting} colorScheme="blue">
            저장
          </Button>
        </footer>
      </form>
    </FormProvider>
  )
}

export default React.memo(TaskForm)
