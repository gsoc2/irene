import DS from 'ember-data';

export default DS.JSONAPISerializer.extend({
  normalizeResponse: function (store, primaryModelClass, payload) {
    return {
      data: payload.data.map((item)=> {
        return {
          id: item.id,
          type: 'security/owasp',
          attributes: {
            code: item.attributes.code,
            title: item.attributes.title,
            description: item.attributes.description,
            year: item.attributes.year
          }
        };
      })
    };
  }
});
