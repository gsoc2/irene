/* eslint-disable prettier/prettier */
import DRFSerializer from './drf';
import { EmbeddedRecordsMixin } from '@ember-data/serializer/rest';

export default DRFSerializer.extend(EmbeddedRecordsMixin, {
  attrs: {
    // vulnerability: { embedded: 'always' },
    attachments: { embedded: 'always' },
  },
});
