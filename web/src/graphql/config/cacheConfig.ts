import {
  InMemoryCacheConfig,
  createFragmentRegistry,
} from '@apollo/client/cache'

import { RECORDS_FIELDS_FOR_DURATION } from '../duration'

const fragments: InMemoryCacheConfig['fragments'] = createFragmentRegistry(
  RECORDS_FIELDS_FOR_DURATION
)

export default { fragments } as InMemoryCacheConfig
