import DS from 'ember-data';

export default DS.Model.extend({
  role: DS.attr('number'),
  username: DS.attr('string'),
  email: DS.attr('string')
});
