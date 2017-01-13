`import Ember from 'ember'`
`import ENUMS from 'irene/enums';`
`import ENV from 'irene/config/environment';`

ProjectPreferencesComponent = Ember.Component.extend

  project: null
  selectVersion: 0
  store: Ember.inject.service()
  selectedDeviceType: ENUMS.DEVICE_TYPE.NO_PREFERENCE
  deviceTypes: ENUMS.DEVICE_TYPE.CHOICES[1...-1]

  devices: (->
    store = @get "store"
    store.findAll "device"
  ).property()

  availableDevices: Ember.computed.filter 'devices', (device) ->
    device.get("platform") is @get("project.platform")

  filteredDevices: Ember.computed "availableDevices", "selectedDeviceType", ->
    availableDevices = @get "availableDevices"
    selectedDeviceType = @get "selectedDeviceType"
    availableDevices.filter (device) ->
      switch selectedDeviceType
        when ENUMS.DEVICE_TYPE.NO_PREFERENCE
          true
        when ENUMS.DEVICE_TYPE.TABLET_REQUIRED
          device.get "isTablet"
        when ENUMS.DEVICE_TYPE.PHONE_REQUIRED
          !device.get "isTablet"

  uniqueDevices: Ember.computed.uniqBy "filteredDevices", 'version'
  hasUniqueDevices: Ember.computed.gt 'uniqueDevices.length', 0

  devicesCount: Ember.computed.alias 'availableDevices.length'

  hasDevices: Ember.computed.gt 'devicesCount', 0


  currentPlatformVersion: ( ->
    platformVersion = @get("project.platformVersion")
  ).property "project.platformVersion"

  currentDeviceType: ( ->
    deviceType = @get("project.deviceType")
  ).property "project.deviceType"

  otherDevices: Ember.computed "uniqueDevices", "currentPlatformVersion", ->
    currentPlatformVersion = @get "currentPlatformVersion"
    uniqueDevices = @get("uniqueDevices").slice()
    uniqueDevices.removeObject currentPlatformVersion

  actions:

    selectDeviceType: ->
      @set "selectedDeviceType", parseInt @$('#project-device-preference').val()

    selectVersion: ->
      @set "selectVersion", @$('#project-version-preference').val()

    versionSelected: ->
      selectedDeviceType = @get "selectedDeviceType"
      selectVersion = @get "selectVersion"
      projectId = @get "project.id"
      devicePreferences = [ENV.endpoints.devicePreferences, projectId].join '/'
      that = @
      data =
        deviceType: selectedDeviceType
        platformVersion: selectVersion
      @get("ajax").post devicePreferences, data: data
      .then (data) ->
        that.get("notify").success "You have sucessfully selected the device"
      .catch (error) ->
        that.get("notify").error "failed"
        if Ember.isEmpty error?.errors
          return
        for error in error.errors
          that.get("notify").error error.detail?.message

`export default ProjectPreferencesComponent`
