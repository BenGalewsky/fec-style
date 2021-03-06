'use strict';

var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var expect = chai.expect;
chai.use(sinonChai);

var $ = require('jquery');

require('./setup')();

var Filter = require('../js/filters').Filter;

function getChecked($input) {
  return $input.filter(function(idx, elm) {
    return $(elm).is(':checked');
  }).map(function(idx, elm) {
    return $(elm).val();
  }).get();
}

describe('filter set', function() {
  before(function() {
    this.$fixture = $('<div id="fixtures"></div>');
    $('body').append(this.$fixture);
  });

  describe('text filters', function() {
    beforeEach(function() {
      this.$fixture.empty().append(
        '<div class="js-filter">' +
          '<div class="input--removable">' +
            '<input name="name" />' +
            '<button class="button button--remove"></button>' +
          '</div>' +
        '</div>'
      );
      this.filter = Filter.build(this.$fixture.find('.js-filter'));
    });

    it('locates dom elements', function() {
      expect(this.filter.$body.is('#fixtures .js-filter')).to.be.true;
      expect(this.filter.$input.is('#fixtures input')).to.be.true;
      expect(this.filter.$remove.is('#fixtures .js-filter .button--remove')).to.be.true;
    });

    it('pulls name from $body if present', function() {
      this.$fixture.empty().append(
        '<div class="js-filter" data-name="name-override">' +
          '<div class="input--removable">' +
            '<input name="name" />' +
            '<button class="button button--remove"></button>' +
          '</div>' +
        '</div>'
      );
      var filter = Filter.build(this.$fixture.find('.js-filter'));
      expect(filter.name).to.equal('name-override');
    });

    it('sets its initial state', function() {
      expect(this.filter.name).to.equal('name');
      expect(this.filter.fields).to.deep.equal(['name']);
    });

    it('sets values', function() {
      this.filter.setValue('jed');
      expect(this.filter.$input.val()).to.equal('jed');
    });

    it('sets empty values', function() {
      this.filter.setValue();
      expect(this.filter.$input.val()).to.equal('');
    });

    it('shows remove button with value', function() {
      this.filter.$input.val('jed').change();
      expect(this.filter.$remove.is(':visible')).to.be.true;
    });

    it('hides remove button without value', function() {
      this.filter.$input.val('').change();
      expect(this.filter.$remove.is(':visible')).to.be.false;
    });

    it('clears input on remove click', function() {
      this.filter.$input.val('jed').change();
      this.filter.$remove.trigger('click');
      expect(this.filter.$input.val()).to.equal('');
      expect(this.filter.$remove.is(':visible')).to.be.false;
    });
  });

  describe('checkbox filters', function() {
    beforeEach(function() {
      this.$fixture.empty().append(
        '<div class="js-filter">' +
          '<div class="input--removable">' +
            '<input name="cycle" type="checkbox" value="2012" />' +
            '<input name="cycle" type="checkbox" value="2014" />' +
            '<input name="cycle" type="checkbox" value="2016" />' +
          '</div>' +
        '</div>'
      );
      this.filter = Filter.build(this.$fixture.find('.js-filter'));
    });

    it('sets scalar values', function() {
      this.filter.setValue('2012');
      expect(getChecked(this.filter.$input)).to.deep.equal(['2012']);
    });

    it('sets list values', function() {
      this.filter.setValue(['2012', '2016']);
      expect(getChecked(this.filter.$input)).to.deep.equal(['2012', '2016']);
    });

    it('sets empty values', function() {
      this.filter.setValue();
      expect(getChecked(this.filter.$input)).to.deep.equal([]);
    });
  });

  describe('date range filters', function() {
    beforeEach(function() {
      this.$fixture.empty().append(
        '<div class="js-filter js-date-choice-field">' +
          '<div class="input--removable">' +
            '<input name="date" type="radio" data-min-date="2015-01-01" data-max-date="2015-12-31">' +
            '<input name="date" type="radio" data-min-date="2016-01-01" data-max-date="2016-12-31">' +
            '<input name="min_date" class="js-min-date" />' +
            '<input name="max_date" class="js-max-date" />' +
          '</div>' +
        '</div>'
      );
      this.filter = Filter.build(this.$fixture.find('.js-filter'));
    });

    it('sets its initial state', function() {
      expect(this.filter.name).to.equal('date');
      expect(this.filter.fields).to.deep.equal(['min_date', 'max_date']);
    });

    it('pulls values from query', function() {
      this.filter.fromQuery({
        min_date: '2015-01-01',
        max_date: '2015-12-31'
      });
      expect(this.filter.$body.find('[name="min_date"]').val()).to.equal('2015-01-01');
      expect(this.filter.$body.find('[name="max_date"]').val()).to.equal('2015-12-31');
    });
  });

  describe('Election filters', function() {
    beforeEach(function() {
      this.$fixture.empty().append(
        '<div class="js-filter js-election-filter"' +
          'data-name="election_year"' +
          'data-cycle-name="cycle"' +
          'data-full-name="election_full"' +
          'data-duration="4">' +
          '<label class="label" for="election_year">Election cycle</label>' +
          '<select name="election_year" class="js-election">' +
              '<option value="2016">2016</option>' +
              '<option value="2012">2012</option>' +
          '</select>' +
          '<fieldset>' +
            '<legend class="label">Time period</legend>' +
            '<div class="js-cycles"></div>' +
          '</fieldset>' +
          '<input type="hidden" name="cycle">' +
          '<input type="hidden" name="election_full"">' +
        '</div>'
      );
      this.filter = Filter.build(this.$fixture.find('.js-filter'));
      this.filter.fromQuery({
        election_year: '2016',
        cycle: '2014',
        election_full: false
      });
      this.trigger = sinon.spy($.prototype, 'trigger');
    });

    it('sets its initial state', function() {
      expect(this.filter.name).to.equal('election_year');
      expect(this.filter.duration).to.equal(4);
      expect(this.filter.fields).to.deep.equal(['election_year', 'cycle', 'election_full']);
    });

    it('pulls values from query', function() {
      this.filter.fromQuery({
        election_year: '2016',
        cycle: '2014',
        election_full: false
      });
      expect(this.filter.$election.val()).to.equal('2016');
      expect(this.filter.$cycles.find(':checked').val()).to.equal('2014:false');
    });

    it('builds cycle toggles on election change', function() {
      this.filter.handleElectionChange({target: this.filter.$election});
      expect(this.filter.$cycles.find('label').length).to.equal(3);
      expect(this.filter.$cycles.find('label:first-of-type input').is(':checked')).to.be.true;
    });

    it('handles cycle change', function() {
      var target = '<input type="radio" value="2014:false">';
      this.filter.handleCycleChange({target: target});
      expect(this.filter.$cycle.val()).to.equal('2014');
      expect(this.filter.$full.val()).to.equal('false');
    });

    it('sets a tag', function() {
      this.filter.$election.val('2016');
      this.filter.setTag();
      expect(this.trigger).to.have.been.calledWith('filter:added', [
        {
          key: 'election',
          value: '2016 election: 2013-2014',
          nonremovable: true
        }
      ]);
    });

    afterEach(function() {
      $.prototype.trigger.restore();
    });
  });
});
