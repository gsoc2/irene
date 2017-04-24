`import Ember from 'ember'`
`import ENUMS from 'irene/enums';`
`import ENV from 'irene/config/environment';`

vncHeight = 512
vncWidth = 385

isValidApiFilter = (url)->
  return !Ember.isEmpty url

isRegexFailed = (url) ->
  reg = /http/
  res = reg.test(url)

hasSpecialChars = (url) ->
  reg = /[/:]/
  res = reg.test(url)

VncViewerComponent = Ember.Component.extend
  onboard: Ember.inject.service()
  rfb: null
  file: null
  isPoppedOut: false
  classNameBindings: ["isPoppedOut:modal", "isPoppedOut:is-active"]

  showURLFilter: false
  showAPIScan: true

  vncPopText: (->
    if @get "isPoppedOut"
      "Close Modal"
    else
      "Pop Out Modal"
  ).property "isPoppedOut"

  didInsertElement: ->
    canvasEl = @element.getElementsByClassName("canvas")[0]
    that = @
    @set "rfb", new RFB
      'target': canvasEl
      'encrypt': ENV.deviceFarmSsl
      'repeaterID': ''
      'true_color': true
      'local_cursor': false
      'shared': true
      'view_only': false

      'onUpdateState': ->
        if ENUMS.PLATFORM.IOS isnt that.get "file.project.platform"
          # Only resize iOS Devices
          return true
        display = @get_display()
        scaleRatio = display.autoscale vncHeight, vncWidth  # TODO: This needs to be set Dynamically
        @get_mouse().set_scale scaleRatio
        true

      'onXvpInit': ->
        true

    if @get 'file.isReady'
      @send("connect")

  statusChange: ( ->
    if @get 'file.isReady'
      @send("connect")
    else
      @send "disconnect"
  ).observes 'file.dynamicStatus'

  actions:
    togglePop: ->
      @set "isPoppedOut", !@get "isPoppedOut"

    connect: ->
      rfb = @get "rfb"
      deviceToken = @get "file.deviceToken"
      rfb.connect ENV.deviceFarmHost, ENV.deviceFarmPort, '1234', "#{ENV.deviceFarmPath}?token=#{deviceToken}"

    disconnect: ->
      rfb = @get "rfb"
      if rfb._rfb_connection_state is 'connected'
        rfb.disconnect()

    dynamicScan: ->
      file = @get "file"
      file.setBootingStatus()
      file_id = @get "file.id"
      dynamicUrl = [ENV.endpoints.dynamic, file_id].join '/'
      @get("ajax").request dynamicUrl
      .catch (error) ->
        file.setNone()
        for error in error.errors
          that.get("notify").error error.detail?.message

    runAPIScan: ->
      @set "isApiScanEnabled", true
      @send "apiScan"

    doNotRunAPIScan: ->
      @set "isApiScanEnabled", false
      @send "apiScan"

    showURLFilter: ->
      @set "showURLFilter", true
      @set "showAPIScan", false


    apiScan: ->
      isApiScanEnabled = @get "isApiScanEnabled"
      project_id = @get "file.project.id"
      apiScanOptions = [ENV.host,ENV.namespace, ENV.endpoints.apiScanOptions, project_id].join '/'
      that = @
      data =
        isApiScanEnabled: isApiScanEnabled
      @get("ajax").post apiScanOptions, data: data
      .then (data)->
        that.send "closeModal"
        that.send "dynamicScan"
      .catch (error) ->
        for error in error.errors
          that.get("notify").error error.detail?.message

    dynamicShutdown: ->
      file = @get "file"
      file.setShuttingDown()
      @set "isPoppedOut", false
      file_id = @get "file.id"
      shutdownUrl = [ENV.endpoints.dynamicShutdown, file_id].join '/'
      @get("ajax").request shutdownUrl
      .catch (error) ->
        file.setNone()
        for error in error.errors
          that.get("notify").error error.detail?.message

    openAPIScanModal: ->
      @set "showAPIScanModal", true

    closeModal: ->
      @set "showAPIScanModal", false

    addApiUrlFilter: ->
      apiUrlFilters = @get "file.project.apiUrlFilters"

      for url in [apiUrlFilters]
        return @get("notify").error "Please enter any url filter" if !isValidApiFilter url
        return @get("notify").error "Please enter a valid url filter" if isRegexFailed url
        return @get("notify").error "Special Characters not allowed" if hasSpecialChars url

      project_id = @get "file.project.id"
      apiScanOptions = [ENV.host,ENV.namespace, ENV.endpoints.apiScanOptions, project_id].join '/'
      that = @
      data =
        apiUrlFilters: apiUrlFilters
      @get("ajax").post apiScanOptions, data: data
      .then (data)->
        that.get("notify").success "Successfully added the url filter"
      .catch (error) ->
        for error in error.errors
          that.get("notify").error error.detail?.message


`export default VncViewerComponent`
