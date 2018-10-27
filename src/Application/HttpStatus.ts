import {
  STATUS_CODES,
} from 'http';

export default (code: number) => {
  return {
    description: STATUS_CODES[code],
    example: '',
    nullable: true,
    type: 'string',
  }
};
