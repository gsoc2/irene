`import DS from 'ember-data'`

Invitation = DS.Model.extend

  role : DS.attr 'number'
  email: DS.attr 'string'
  user : DS.belongsTo 'user', inverse: 'collaboration'
  project : DS.belongsTo 'project', inverse: 'collaborations'


`export default Invitation`