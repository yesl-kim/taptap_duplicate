const { getPaths } = require('@redwoodjs/internal')

module.exports = {
  schema: [getPaths().generated.schema, 'client-schema.graphql'],
}
