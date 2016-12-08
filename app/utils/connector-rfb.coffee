`import ENV from 'irene/config/environment';`


xvpInit = ->
  return true

class ConnectorRFB

  rfb: null

  constructor: (@canvasEl, @deviceToken) ->

  connect: ->
    @rfb = new RFB
      'target': @canvasEl
      'encrypt': ENV.deviceFarmSsl
      'repeaterID': ''
      'true_color': true
      'local_cursor': false
      'shared': true
      'view_only': false
      'onUpdateState': ->
        display = @get_display()
        debugger
        scaleRatio = display.autoscale 512, 384 # TODO: This needs to be set Dynamically
        @get_mouse().set_scale scaleRatio
        return true

      'onXvpInit': xvpInit
    @rfb.connect ENV.deviceFarmHost, ENV.deviceFarmPort, '1234', "#{ENV.deviceFarmPath}?token=#{@deviceToken}"

  disconnect: ->
    @rfb.disconnect()


`export default ConnectorRFB`
