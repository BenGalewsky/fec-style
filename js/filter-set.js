'use strict';

var $ = require('jquery');
var _ = require('underscore');
var URI = require('urijs');

var Filter = require('./filters').Filter;

var KEYCODE_ENTER = 13;

function FilterSet(elm) {
  this.$body = $(elm);
  $(document.body).on('tag:removed', this.handleTagRemove.bind(this));

  this.filters = {};
  this.fields = [];
}

FilterSet.prototype.activate = function() {
  var query = URI.parseQuery(window.location.search);
  if (_.isEmpty(this.filters)) {
    this.filters = _.chain(this.$body.find('.js-filter'))
      .map(function(elm) {
        var filter = Filter.build($(elm)); // .fromQuery(query);
        return [filter.name, filter];
      })
      .object()
      .value();
    this.fields = _.chain(this.filters)
      .pluck('fields')
      .flatten()
      .value();
  }
  _.each(this.filters, function(filter) {
    filter.fromQuery(query);
  });
  return this;
};

FilterSet.prototype.serialize = function() {
  return _.reduce(this.$body.serializeArray(), function(memo, val) {
    if (val.value && val.name.slice(0, 1) !== '_') {
      if (memo[val.name]) {
        memo[val.name].push(val.value);
      } else{
        memo[val.name] = [val.value];
      }
    }
    return memo;
  }, {});
};

FilterSet.prototype.clear = function() {
  _.each(this.filters, function(filter) {
    filter.setValue();
  });
};

FilterSet.prototype.handleTagRemove = function(e, opts) {
  var $input = this.$body.find('#' + opts.key);
  var type = $input.get(0).type;

  if (type === 'checkbox' || type === 'radio') {
    $input.attr('checked', false).trigger('change');
  } else if (type === 'text') {
    $input.val('').trigger('change');
  }
};

module.exports = {FilterSet: FilterSet};
