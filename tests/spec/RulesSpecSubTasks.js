//Copyright 2012 enioka. All rights reserved
//Authors: Thomas Cordival (thomas.cordival@enioka.com), Jean-Christophe Ferry (jean-christophe.ferry@enioka.com)

var rulesfile = "src/subtasksrules.xml";
var rules;
jQuery.ajax(
    {
        url : rulesfile,
        type: 'GET',
        dataType: "xml",
        async: false,
        contentType : 'application/xml; charset=UTF-8',
        error: this.ajaxError,
        success: describeTests
    });


function getRulesFromXML(DOM) {
    var rulesNode = DOM.getElementsByTagName("RULES")[0];
    var rules = new Array();
    getMatchingTags(rulesNode, "RULE", rules);
    return rules;
}

function deepCompare (x, y) {
  if ( x === y ) return true;
    // if both x and y are null or undefined and exactly the same

  if ( ! ( x instanceof Object ) || ! ( y instanceof Object ) ) return false;
    // if they are not strictly equal, they both need to be Objects

  if ( x.constructor !== y.constructor ) return false;
    // they must have the exact same prototype chain, the closest we can do is
    // test there constructor.

  for ( var p in x ) {
    if ( ! x.hasOwnProperty( p ) ) continue;
      // other properties were tested using x.constructor === y.constructor

    if ( ! y.hasOwnProperty( p ) ) return false;
      // allows to compare x[ p ] and y[ p ] when set to undefined

    if ( x[ p ] === y[ p ] ) continue;
      // if they have the same strict value or identity then they are equal

    if ( typeof( x[ p ] ) !== "object" ) return false;
      // Numbers, Strings, Functions, Booleans must be strictly equal

    if ( ! Object.equals( x[ p ],  y[ p ] ) ) return false;
      // Objects and Arrays must be tested recursively
  }

  for ( p in y ) {
    if ( y.hasOwnProperty( p ) && ! x.hasOwnProperty( p ) ) return false;
      // allows x[ p ] to be set to undefined
  }
  return true;
}

function describeTests (data, textStatus, transport) {
    describe(
        "SubTasks Tests",
        function() {
            beforeEach(function() {
                           this.addMatchers({toHaveAttribute: function(expected) {
                                                 var actual = this.actual;
                                                 this.message = function () {
                                                     return "Expected ["+ expected.key +"] = " + expected.value +
                                                         " and got " + actual[expected.key];
                                                 };
                                                 var attrExists = (("undefined" !== typeof this.actual) &&
                                                                   (expected.key in this.actual));
                                                 if (!attrExists) {
                                                     return false;
                                                 }
                                                 return deepCompare(expected.value, actual[expected.key]);
                                             }
                                            });
                       });

            it('Run a subtask foreach object    ', function () {
                   var rules = getRulesFromXML(data);
                   var engine = new RuleEngine({rulesXML : rules});
                   var context = new RuleContext(new RuleFact ({task:"doTest"
                                                               }));

                   var result = engine.run(context);

                   expect(result).not.toBeNull(null);
               });
        });
}
