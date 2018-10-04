import Ember from 'ember';

const RealtimeService = Ember.Service.extend({

  FileCounter: 0,
  ProjectCounter: 0,
  ProjectTeamCounter: 0,
  ProjectNonTeamCounter: 0,
  SubmissionCounter: 0,
  InvitationCounter: 0,
  OrganizationMemberCounter: 0,
  OrganizationTeamCounter: 0,
  TeamProjectCounter: 0,
  TeamMemberCounter: 0,
  OrganizationNonTeamProjectCounter: 0,
  OrganizationNonTeamMemberCounter: 0,
  namespace: ''
});

export default RealtimeService;
