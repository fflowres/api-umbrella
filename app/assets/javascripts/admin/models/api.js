Admin.Api = Ember.Model.extend({
  name: Ember.attr(),
  sortOrder: Ember.attr(),
  backendProtocol: Ember.attr(),
  frontendHost: Ember.attr(),
  backendHost: Ember.attr(),
  balanceAlgorithm: Ember.attr(),

  servers: Ember.hasMany('Admin.ApiServer', { key: 'servers', embedded: true }),
  urlMatches: Ember.hasMany('Admin.ApiUrlMatch', { key: 'url_matches', embedded: true }),
  settings: Ember.belongsTo('Admin.ApiSettings', { key: 'settings', embedded: true }),
  subSettings: Ember.hasMany('Admin.ApiSubSettings', { key: 'sub_settings', embedded: true }),
  rewrites: Ember.hasMany('Admin.ApiRewrite', { key: 'rewrites', embedded: true }),
  //rateLimits: Ember.hasMany('Admin.ApiRateLimit', { key: 'rate_limits', embedded: true }),

  init: function() {
    this._super();

    // Set defaults for new records.
    this.setDefaults();

    // For existing records, we need to set the defaults after loading.
    this.on('didLoad', this, this.setDefaults);
  },

  setDefaults: function() {
    if(!this.get('settings')) {
      this.set('settings', Admin.ApiSettings.create());
    }
  },

  exampleIncomingUrlRoot: function() {
    return 'http://' + this.get('frontendHost');
  }.property('frontendHost'),

  exampleOutgoingUrlRoot: function() {
    var server = this.get('servers.firstObject');
    if(server) {
      return this.get('backendProtocol') + server.get('urlString');
    } else {
      return 'http://localhost';
    }
  }.property('servers.firstObject'),
})

Admin.Api.url = "/admin/apis";
Admin.Api.rootKey = "api";
Admin.Api.collectionKey = "apis";
Admin.Api.primaryKey = "_id";
Admin.Api.camelizeKeys = true;
Admin.Api.adapter = Ember.RESTAdapter.create();
