//Copyright 2012 enioka. All rights reserved
//Authors: Thomas Cordival (thomas.cordival@enioka.com), Jean-Christophe Ferry (jean-christophe.ferry@enioka.com)

var rulesfile = "src/basicrules.xml";
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

    if ( ! deepCompare( x[ p ],  y[ p ] ) ) return false;
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
        "Basic tests",
        function() {
            beforeEach(function() {
                jasmine.addMatchers(
                        {toHaveAttribute: function(util, customEqualityTesters) {
                            return { compare : function(actual, expected) {
                                var result = {};
                                result.message =  "Expected ["+ expected.key +"] = " + expected.value +
                                    " and got " + actual[expected.key];
                                var attrExists = (("undefined" !== typeof actual) &&
                                        (expected.key in actual));
                                if (!attrExists) {
                                    result.pass=false;
                                    return result;
                                }
                                result.pass=deepCompare(expected.value, actual[expected.key]);
                                return result;
                            }
                            };
                        }
                        });
            });

            it('Gets a simple value', function () {
                   var rules = getRulesFromXML(data);
                   var engine = new RuleEngine({rulesXML : rules});
                   var context = new RuleContext(new RuleFact ({a:"a1",
                                                                b:"b1",
                                                                c: new RuleFact({x:"3", y:1})
                                                               }));

                   var result = engine.run(context);

                   expect(result).not.toBeNull(null);
                   expect(result).toHaveAttribute({key:"e",
                                                   value:new RuleFact({a:-7})});

               });
            it('Gets a RuleFact value', function () {
                   var rules = getRulesFromXML(data);
                   var engine = new RuleEngine({rulesXML : rules});
                   var context = new RuleContext(new RuleFact ({a:"a1",
                                                                b:"b1",
                                                                c: new RuleFact({x:"3", y:1})
                                                               }));

                   console.log("##############################");
                   var result = engine.run(context);

                   expect(result).not.toBeNull(null);
                   expect(result).toHaveAttribute({key:"e",
                                                   value:new RuleFact({a:-7})});

               });
             it('Gets a value set by multiple rules (respects priorities)', function () {
                    var rules = getRulesFromXML(data);
                    var engine = new RuleEngine({rulesXML : rules});
                    var context = new RuleContext(new RuleFact ({a:"a1",
                                                                 b:"b1",
                                                                 c: new RuleFact({x:"3", y:1}),
                                                                 priorityCondition:"true"}));

                    console.log("##############################");
                    var result = engine.run(context);

                    expect(result).not.toBeNull(null);
                    expect(result).toHaveAttribute({key:"priorityTestAttr",
                                                    value:"Value set by high priority rule"});

                    console.log(result);
                });
             it('Check multiple conditions syntaxes', function () {
                var rules = getRulesFromXML(data);
                var engine = new RuleEngine({rulesXML : rules});
                var context = new RuleContext(new RuleFact ({a:"a2",
                                                             b:"b1",
                                                             c: new RuleFact({x:"3", y:1}),
                                                             priorityCondition:"true"}));

                console.log("##############################");
                var result = engine.run(context);

                expect(result).not.toBeNull(null);
                expect(result).toHaveAttribute({key:"c",
                    value:"r4"});
                expect(result).toHaveAttribute({key:"d",
                    value:"r5"});
                expect(result).not.toHaveAttribute({key:"e",
                    value:"r6"});
                expect(result).toHaveAttribute({key:"f",
                    value:"r7"});

                console.log(result);
            });

            it('Uses relative prefix', function () {
                   var rules = getRulesFromXML(data);
                   var engine = new RuleEngine({rulesXML : rules});

                   var context = new RuleContext(new RuleFact ({test:"10"}));

                   var result = engine.run(context);

                   expect(result.level1.level2.a).toEqual("resultat10");
               });
        });
}
