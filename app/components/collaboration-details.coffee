`import Ember from 'ember'`
`import ENV from 'irene/config/environment'`
`import ENUMS from 'irene/enums'`
`import { translationMacro as t } from 'ember-i18n'`

roles = ENUMS.COLLABORATION_ROLE.CHOICES.reverse()[1..]

CollaborationDetailsComponent = Ember.Component.extend

  i18n: Ember.inject.service()

  collaboration: null
  roles: roles
  currentRole: roles[0].value
  tagName: ["tr"]

  tTeam: t("team")
  isChangingRole: false
  isRemovingCollaboration: false
  tPermissionChanged: t("permissionChanged")
  tEnterRightTeamName: t("enterRightTeamName")
  tCollaborationRemoved: t("collaborationRemoved")

  otherRoles: (->
    roles = @get "roles"
    selectedRole = @get "collaboration.role"
    roles.filter (role) ->
      selectedRole isnt role.value
  ).property "roles", "collaboration.role"

  isDisabledSelectBox: (->
    isDefaultTeam = @get "collaboration.team.isDefaultTeam"
    isChangingRole = @get "isChangingRole"
    isDefaultTeam || isChangingRole
  ).property "collaboration.team.isDefaultTeam", "isChangingRole"

  promptCallback: (promptedItem) ->
    tTeam = @get "tTeam"
    collaboration = @get "collaboration"
    tEnterRightTeamName = @get "tEnterRightTeamName"
    tCollaborationRemoved = @get "tCollaborationRemoved"
    team = @get "collaboration.team.name"
    teamName = team.toLowerCase()
    promptedTeam = promptedItem.toLowerCase()
    if promptedTeam isnt teamName
      return @get("notify").error tEnterRightTeamName
    @set "isRemovingCollaboration", true
    that = @
    collaboration.destroyRecord()
    .then (data)->
      that.set "isRemovingCollaboration", false
      that.get("notify").success "#{tTeam} #{team} #{tCollaborationRemoved}"
    .catch (error) ->
      that.set "isRemovingCollaboration", false
      for error in error.errors
        that.get("notify").error error.detail?.message

  actions:

    changeRole: (value) ->
      tPermissionChanged = @get "tPermissionChanged"
      currentRole = @set "currentRole", parseInt @$('#role-preference').val()
      collaborationId = @get "collaboration.id"
      url = [ENV.endpoints.collaborations, collaborationId ].join '/'
      data =
        role: currentRole
      that = @
      @set "isChangingRole", true
      @get("ajax").post url , data:data
      .then (data)->
        that.set "isChangingRole", false
        that.get("notify").success tPermissionChanged
      .catch (error) ->
        that.set "isChangingRole", false
        that.get("notify").error error.payload.message, ENV.notifications
        for error in error.errors
          that.get("notify").error error.detail?.message

    openAddCollaborationPrompt: ->
      @set "showAddCollaborationPrompt", true

    closeAddCollaborationPrompt: ->
      @set "showAddCollaborationPrompt", false


`export default CollaborationDetailsComponent`
