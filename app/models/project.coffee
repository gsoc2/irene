`import DS from 'ember-data'`

Project = DS.Model.extend
  owner: DS.belongsTo 'user', inverse: 'ownedProjects', async: false
  name: DS.attr 'string'
  packageName: DS.attr 'string'
  platform: DS.attr 'string'
  source: DS.attr 'string'
  version : DS.sttr 'string'
  files: DS.hasMany 'file', inverse :'project', async:false
  collaborations: DS.hasMany 'collaboration', inverse: 'project', async: false
  fileCount: DS.attr 'string'
  githubRepo: DS.attr 'string'
  jiraProject: DS.attr 'string'
  testUser:DS.attr 'string'
  testPassword: DS.attr 'string'

  sortProperties: ["createdOn:desc"]
  sortedFiles: Ember.computed.sort 'files','sortProperties'

  platformIconClass:( ->
    switch @get "platform"
      when ENUMS.PLATFORM.ANDROID then "android"
      when ENUMS.PLATFORM.IOS then "apple"
      when ENUMS.PLATFORM.WINDOWS then "windows"
      else "mobile"
  ).property "platform"

  lastFile:( ->
    sortedFiles = @get "sortedFiles"
    sortedFiles[0]
  ).property "sortedFiles"

  hasMultipleFiles:( ->
    fileCount = @get "fileCount"
    fileCount > 1
  ).property "fileCount"

`export default Project`
