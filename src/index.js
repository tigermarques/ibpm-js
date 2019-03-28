import { version } from '../package.json'
import * as organization from './lib/organization'

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const library = {
  version,
  organization
}

export default library
