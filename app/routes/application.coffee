`import ApplicationRouteMixin from 'simple-auth/mixins/application-route-mixin';`
`import Ember from 'ember';`
`import EmberCLIICAjax from 'ic-ajax';`

ApplicationRoute = Ember.Route.extend ApplicationRouteMixin,

  fetchData: ->
    store = @store
    applicationAdapter = store.adapterFor 'application'
    host = applicationAdapter.get 'host'
    namespace = applicationAdapter.get 'namespace'
    initUrl = [host, namespace, 'init'].join '/'
    controller = @controller
    new Ember.RSVP.Promise (resolve, reject) ->
      init = EmberCLIICAjax url:initUrl, type: "get"
      init.then (result) ->
        for vulnerability in result.vulnerabilities
          store.pushPayload 'vulnerability', vulnerability: vulnerability
        for project in result.projects
          store.pushPayload 'project', project: project
        for file in result.files
          store.pushPayload 'file', file: file
        for analysis in result.analyses
          store.pushPayload 'analysis', analysis: analysis
        for pricing in result.pricings
          store.pushPayload 'pricing', pricing: pricing
        store.pushPayload 'ratio', ratio: result.ratio
        user = store.pushPayload 'user', user: result.user
        store.find('user', result.user.id).then (user)->
          controller.set 'currentUser', user
          controller.subscribe user.get "uuid"
        resolve result

  setupController: (controller)->
    if !Ember.isEmpty @session.get "token"
      @fetchData()

  actions:

    sessionAuthenticationSucceeded: ->
      @_super()
      @fetchData()

`export default ApplicationRoute;`
