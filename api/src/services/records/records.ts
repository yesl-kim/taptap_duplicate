import type {
  QueryResolvers,
  MutationResolvers,
  RecordRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const records: QueryResolvers['records'] = () => {
  return db.record.findMany()
}

export const record: QueryResolvers['record'] = ({ id }) => {
  return db.record.findUnique({
    where: { id },
  })
}

export const createRecord: MutationResolvers['createRecord'] = ({ input }) => {
  return db.record.create({
    data: input,
  })
}

export const updateRecord: MutationResolvers['updateRecord'] = ({
  id,
  input,
}) => {
  return db.record.update({
    data: input,
    where: { id },
  })
}

export const deleteRecord: MutationResolvers['deleteRecord'] = ({ id }) => {
  return db.record.delete({
    where: { id },
  })
}

export const Record: RecordRelationResolvers = {
  task: (_obj, { root }) => {
    return db.record.findUnique({ where: { id: root?.id } }).task()
  },
}
