import Component from '@ember/component';
import ENV from 'irene/config/environment';
import lookupValidator from 'ember-changeset-validations';
import Changeset from 'ember-changeset';
import InviteRegisterValidation from '../../validations/invite-register';
import SSOInviteRegisterValidation from '../../validations/sso-invite-register';

export default Component.extend({
  inviteRegisterPOJO: {},
  init() {
    this._super(...arguments);
    const inviteRegisterPOJO = this.get('inviteRegisterPOJO');
    var changeset = null
    if (this.get('isSSOEnforced')){
      changeset = new Changeset(
        inviteRegisterPOJO, lookupValidator(SSOInviteRegisterValidation), SSOInviteRegisterValidation
      );
    }else{
      changeset = new Changeset(
        inviteRegisterPOJO, lookupValidator(InviteRegisterValidation), InviteRegisterValidation
      );
    }
    this.set('changeset', changeset);
  },

  registerWithServer (data) {
    const token = this.get('token');
    const url = [ENV.endpoints.invite, token].join('/')
    return this.get('ajax').request(url, {
      method: 'POST',
      data: data
    }).then(() => {
      this.set('success', true);
    }, (errors) => {
      const changeset = this.get('changeset');
      Object.keys(errors.payload).forEach(key => {
        changeset.addError(key, errors.payload[key]);
      });
    });
  },
  actions: {
    register(changeset) {
      changeset.validate().then(() => {
        if (changeset.get('isValid')) {
          const username = changeset.get('username');
          const termsAccepted = changeset.get('termsAccepted');
          if (this.get('isSSOEnforced')){
            this.registerWithServer({
              'username': username,
              'terms_accepted': termsAccepted
            });
          return;
          }
          const firstname = changeset.get('firstname');
          const lastname = changeset.get('lastname');
          const password = changeset.get('password');
          const passwordConfirmation = changeset.get('passwordConfirmation');
          const phoneNumber = changeset.get('phone');
          const selectedCountryData = this.get("selectedCountryData");
          const fullNumber = selectedCountryData.dialCode + '-' +  phoneNumber;
          this.registerWithServer({
            'first_name': firstname,
            'last_name': lastname,
            'username': username,
            'password': password,
            'confirm_password': passwordConfirmation,
            'phone': fullNumber,
            'terms_accepted': termsAccepted
          });
        }
      });
    },
    geoIpLookupFunc: function(callback) {
      this.get('ajax').request('https://ipinfo.io')
       .then(function(resp) {
         if (!resp || !resp.country) {
           callback('US');
           return
         }
         callback(resp.country);
       }, () => {
        callback('US');
       });
    },
  },

});
