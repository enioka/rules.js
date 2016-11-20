// Copyright 2012,2013,2014,2015,2016 enioka. All rights reserved
// Distributed under the GNU LESSER GENERAL PUBLIC LICENSE V3
// Except the Class implementation distributed under the new BSD licence
// Authors: Jean-Christophe Ferry (jean-christophe.ferry@enioka.com)

/**
 * @namespace enioka
 * @description Enioka published open source code. Enioka is committed to contribute general purpose tools
 * that may help others in other contexts.<br/>
 * Copyright 2012,2013,2014,2015,2016 enioka. All rights reserved <br/>
 * @see <a href="http://www.enioka.com"/> enioka </a>
 */
var enioka = (enioka || {});

/**
 * @memberof enioka
 * @namespace rules
 * @description This is the enioka javascript rule engine. <br/>
 * Copyright 2012,2013,2014,2015,2016 enioka. All rights reserved <br/>
 * Distributed under the GNU LESSER GENERAL PUBLIC LICENSE V3 <br/>
 * Except the Class implementation distributed under the new BSD licence <br/>
 * @author Jean-Christophe Ferry (jean-christophe.ferry@enioka.com)
 */
enioka.rules = (
    function (eniokarules) {
        // Following code borrowed to Alex Arnell
        // Some class mechanism was needed to make possible
        // to subclass the RuleFact class by client applications
        // somewhat of an overkill here...

        /*
         Class, version 2.7
         Copyright (c) 2006, 2007, 2008, Alex Arnell <alex@twologic.com>
         Licensed under the new BSD License. See end of file for full license terms.
         */        
        var Class = (function() {
                         var __extending = {};

                         return {
                             extend: function(parent, def) {
                                 if (arguments.length == 1) { def = parent; parent = null; }
                                 var func = function() {
                                     if (arguments[0] ==  __extending) { return; }
                                     this.initialize.apply(this, arguments);
                                 };
                                 if (typeof(parent) == 'function') {
                                     func.prototype = new parent( __extending);
                                 }
                                 var mixins = [];
                                 if (def && def.include) {
                                     if (def.include.reverse) {
                                         // methods defined in later mixins should override prior
                                         mixins = mixins.concat(def.include.reverse());
                                     } else {
                                         mixins.push(def.include);
                                     }
                                     delete def.include; // clean syntax sugar
                                 }
                                 if (def) Class.inherit(func.prototype, def);
                                 for (var i = 0; (mixin = mixins[i]); i++) {
                                     Class.mixin(func.prototype, mixin);
                                 }
                                 return func;
                             },
                             mixin: function (dest, src, clobber) {
                                 clobber = clobber || false;
                                 if (typeof(src) != 'undefined' && src !== null) {
                                     for (var prop in src) {
                                         if (clobber || (!dest[prop] && typeof(src[prop]) == 'function')) {
                                             dest[prop] = src[prop];
                                         }
                                     }
                                 }
                                 return dest;
                             },
                             inherit: function(dest, src, fname) {
                                 if (arguments.length == 3) {
                                     var ancestor = dest[fname], descendent = src[fname], method = descendent;
                                     descendent = function() {
                                         var ref = this.parent; this.parent = ancestor;
                                         var result = method.apply(this, arguments);
                                         ref ? this.parent = ref : delete this.parent;
                                         return result;
                                     };
                                     // mask the underlying method
                                     descendent.valueOf = function() { return method; };
                                     descendent.toString = function() { return method.toString(); };
                                     dest[fname] = descendent;
                                 } else {
                                     for (var prop in src) {
                                         if (dest[prop] && typeof(src[prop]) == 'function') {
                                             Class.inherit(dest, src, prop);
                                         } else {
                                             dest[prop] = src[prop];
                                         }
                                     }
                                 }
                                 return dest;
                             },
                             singleton: function() {
                                 var args = arguments;
                                 if (args.length == 2 && args[0].getInstance) {
                                     var klass = args[0].getInstance(__extending);
                                     // we're extending a singleton swap it out for it's class
                                     if (klass) { args[0] = klass; }
                                 }

                                 return (function(args){
                                             // store instance and class in private variables
                                             var instance = false;
                                             var klass = Class.extend.apply(args.callee, args);
                                             return {
                                                 getInstance: function () {
                                                     if (arguments[0] == __extending) return klass;
                                                     if (instance) return instance;
                                                     return (instance = new klass());
                                                 }
                                             };
                                         })(args);
                             }
                         };
                     })();

        // finally remap Class.create for backward compatibility with prototype
        Class.create = function() {
            return Class.extend.apply(this, arguments);
        };

        /*
         Redistribution and use in source and binary forms, with or without modification, are
         permitted provided that the following conditions are met:

         * Redistributions of source code must retain the above copyright notice, this list
         of conditions and the following disclaimer.
         * Redistributions in binary form must reproduce the above copyright notice, this
         list of conditions and the following disclaimer in the documentation and/or other
         materials provided with the distribution.
         * Neither the name of typicalnoise.com nor the names of its contributors may be
         used to endorse or promote products derived from this software without specific prior
         written permission.

         THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
         EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
         MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL
         THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
         SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT
         OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
         HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR
         TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
         SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
         */

        // Following functions are basic functions used for standardized logging interface
        function info_debug(text,object) {
            if (eniokarules.info_debug) {
                eniokarules.info_debug(text,object);
            } else {
                console.log(text,object);
            }
        }
        function info_warn(text,object) {
            if (eniokarules.info_warn) {
                eniokarules.info_warn(text,object);
            } else {
                console.log(text,object);
            }
        }
        function info_error(text,object) {
            if (eniokarules.info_error) {
                eniokarules.info_error(text,object);
            } else {
                console.log(text,object);
            }
        }
        function user_debug(text,object) {
            if (eniokarules.user_debug) {
                eniokarules.user_debug(text,object);
            } else {
                console.log(text,object);
            }
        }
        function user_warn(text,object) {
            if (eniokarules.user_warn) {
                eniokarules.user_warn(text,object);
            } else {
                console.log(text,object);
            }
        }
        function user_error(text,object) {
            if (eniokarules.user_error) {
                eniokarules.user_error(text,object);
            } else {
                console.log(text,object);
            }
        }



        // Small utility functions here

        // Computes the size of an object in number of own properties
        // Used to estimate key "spread" for ordering keys in rule index
        function objectSize(object) {
            var size = 0;

            for (key in object) {
                if (object.hasOwnProperty(key))
                    size++;
            }
            return size;
        }

        // Very dirty utility to look for specified children in path
        // Should be replaced by more efficient cross browser/javascript runtine XML XPATH like utility
        function getMatchingTags(data, path, array) {
            if (path === "") {
                return;
            }

            var index = path.indexOf("/");
            var children = data.childNodes;
            var i;
            var son;
            if (path.charAt(0) === '*') {
                for (i = 0; i < children.length; i++) {
                    son = children.item(i);
                    if (son.nodeType !== 1) {
                        continue;
                    }
                    if (index === -1) {
                        array.push(son);
                    }
                    if (index > 0) {
                        getMatchingTags(son, path.substr(index + 1), array);
                    }
                    if (index > 1) {
                        getMatchingTags(son, path, array);
                    }
                }
            } else {
                var tag;
                if (index !== -1) {
                    tag = path.substr(0, index);
                } else {
                    tag = path;
                }
                children = data.childNodes;
                for (i = 0; i < children.length; i++) {
                    son = children.item(i);
                    if (son.nodeType !== 1) {
                        continue;
                    }
                    if (son.tagName !== tag){
                        continue;
                    }
                    if (index === -1) {
                        array.push(son);
                    }
                    if (index > 0) {
                        getMatchingTags(son, path.substr(index + 1), array);
                    }
                }
            }
        }
        
        // A few portability functions to support different rules formats
        // For the moment rules are not fully compiled into another internal format
        // For the moment two basic rule types are handled : xml and raw json. Native 
        // rules object still to be implemented.
        function getRuleSubElements(element,type,array) {
            if (element.hasAttribute) {
                if (array) {
                    getMatchingTags(element,type,array);
                    // In XML encoding, any sub element of a rule that is not IF,THEN or RULE is considered an action
                    if (type == "THEN/*") {
                        var sons = element.childNodes;
                        if (sons && sons.length) {
                            for (var i=0; i<sons.length; i++) {
                                var son = sons.item(i);
                                if (son.nodeType !== 1) {
                                    continue;
                                }
                                if ((son.tagName != "IF") && (son.tagName != "THEN") && (son.tagName != "RULE")) {
                                    array.push(son);
                                }
                            }
                        }
                    }
                } else {
                    if (type == "*") {
                        return element.childNodes;
                    }
                }
            } else {
                if ((type == "IF/*") || (type == "*")) {
                    if (element.conditions) {
                        if (array) {
                            for (var i=0; i<element.conditions.length; i++) {
                                array.push(element.conditions[i]);
                            }
                        } else {
                            return element.conditions;
                        }
                    }
                }
                if ((type == "THEN/*") || (type == "*")) {
                    if (element.actions) {
                        if (array) {
                            for (var i=0; i<element.actions.length; i++) {
                                array.push(element.actions[i]);
                            }
                        } else {
                            return element.actions;
                        }
                    }
                }
                if ((type == "RULE") || (type == "*")) {
                    if (element.rules) {
                        if (array) {
                            for (var i=0; i<element.rules.length; i++) {
                                array.push(element.rules[i]);
                            }
                        } else {
                            return element.rules;
                        }
                    }
                }
            }
        }
        
        function getRuleSubElementsNumber(elements) {
            return elements.length;
        }
        
        function getRuleSubElement(element,i) {
            if (element.item) {
                if (element.item(i).nodeType == 1) {
                    return element.item(i);
                } else {
                    return null;
                }
            } else {
                return element[i];
            }
        }
        
        function getRuleElementType(element) {
            if (element.tagName) {
                return element.tagName;
            } else {
                return element.type;
            }
        }
        
        function getRuleElementAttributes(element) {
            if (element) {
                if (element.hasAttribute) {
                    var attributes = [];
                    for (var i=0; i< element.attributes.length; i++) {
                        attributes.push(element.attributes.item(i).nodeName);
                    }
                    return attributes;
                } else {
                    var attributes = [];
                    for (var key in element) {
                        if (element.hasOwnProperty(key)) {
                            if (typeof element[key] != 'object') {
                                if (key != "type") {
                                    attributes.push(key);                                    
                                }
                            }
                        }
                    }
                    return attributes;
                }
            } else {
                return [];
            }
        }
        
        function hasRuleElementAttribute(element, attribute) {
            if (element) {
                if (element[attribute]) {
                    return true; 
                 } else {
                     if (element.hasAttribute) {
                         return element.hasAttribute(attribute);
                     } else {
                         return false;
                     }
                 }
            } else {
                return false;
            }
        }
        
        function getRuleElementAttribute(element,attribute) {
            if (element) {
                if (element[attribute]) {
                   return element[attribute]; 
                } else {
                    if (element.getAttribute) {
                        return element.getAttribute(attribute);
                    } else {
                        return null;
                    }
                }
            } else {
                return null;
            }
        }

        // Implements the "intersection" between two arrays
        // Used to implement the built in "INTERSECTS" condition type
        // that fires whenever two lists (or elements) have a non
        // empty element in common
        function intersection (array1, array2) {
            var ret = [];
            if (("undefined" === typeof array1) || ("undefined" === typeof array2) ||
                (null === array1) || (null === array2)) {
                return false;
            }

            if ((array1.constructor !== Array) &&
                (array2.constructor !== Array)) {
                return array1 === array2;
            }

            if (array1.constructor !== Array) {
                return 0 <= array2.indexOf(array1);
            }
            if (array2.constructor !== Array) {
                return 0 <= array1.indexOf(array2);
                if (0 <= array2.indexOf(e1)) {
                    return true;
                }
            }
            return false;
        }
        
        /**
         * @memberof enioka.rules
         * @interface
         * @classdesc
         * <br/> <br/>
         * Objects must , to be "accessible" by the rule engine, obey an API, which is rather
         * simple: get, set and add attribute value. If they do not support this access process, then
         * they must be "wrapped" by a wrapper object that will take care to make "as if" the
         * objects did indeed follow this API.
         * <br/> <br/>
         * 3 built in wrappers are provided : <br/>
         * - {@link enioka.rules.RuleFact} : simple "internal" class to represent facts if not specified by client application <br/>
         * - {@link enioka.rules.RuleExternalObject} : simple "external" class to represent facts provided by client applications, without
         * knowing exactly what they are <br/>
         * - {@link enioka.rules.RuleResult} : simple "result" class to represent info produced by default by the engine and to be
         * used by client applications as a default to retrieve "results" returned by the engine
         * <br/> <br/>
         */
        var IRuleFact = {
            initialize : function() {
            },

            /**
             * @instance
             * @description
             * Gets the value of the specified attribute
             * @param attribute The name of the attribute
             * @returns the value of the specified attribute in the object. 
             */
            getAttributeValue : function (attribute) {
                return this[attribute];
            },

            /**
             * @instance
             * @description
             * Sets the value of the specified attribute with
             * specified value.
             * @param attribute The name of the attribute
             * @param value The value to set to the attribute
             * @returns the value of the specified attribute in the object. 
             */
            setAttributeValue : function (attribute,value) {
                return this[attribute] = value;
            },

            /**
             * @instance
             * @description
             * Sets the value of the specified attribute with
             * specified value.
             * @param attribute the name of the attribute
             * @param value the value to set to the attribute
             * @returns the array of values of the specified attribute in the object. 
             */
            addAttributeValue : function (attribute,value) {
                if (this[attribute]) {
                    if (this[attribute] instanceof Array) {
                        this[attribute].push(value);
                    }
                    else {
                        info_debug('Error : attribute is not a array : should not access it with add', this);
                        info_debug('Warning : attribute converted to array');
                        var tab = new Array();
                        tab.push(this[attribute]);
                        tab.push(value);
                        this[attribute] = tab;
                    }
                }
                else {
                    var tab = new Array();
                    tab.push(value);
                    return this[attribute] = tab;
                }
            },

            /**
             * @instance
             * @description
             * Wraps object accessible through this path. If provided,
             * this method will either create a wrapper object or return the object itself
             * if this object has no need to be wrapped at all
             * @param object The object to wrap
             * @param path The current access path to this object
             * @param context The context in which access is performed, useful to retrieve
             * initial context information useful to actually access to the object data
             * @param father The object from which one tries to access this very object
             * @returns the facade object that will wrap the actual data. As a default returns self.
             */
            wrapObject: function (object, path, context, father) {
                return this;
            }
        };
        IRuleFact = Class.create(IRuleFact);

        /**
         * @class
         * @memberof enioka.rules
         * @implements {enioka.rules.IRuleFact}
         * @classdesc
         * <br/>
         * <br/>
         * The Rule Context is the way through which the engine holds grip on objects
         * on which it performs its reasoning. It holds also the required cache for efficient
         * data access.
         * <br/>
         * <br/>
         * This class is not directly exposed in the API. It is used internally by the engine.
         * A rule context is allocated for each call of the engine and holds the
         * grip on all variables on which the engine will apply rules.
         * <br/>
         * <br/>
         * For more advanced uses, one may need to access and manipulate this
         * context from the outside. Still, this is a bad idea for the moment
         * since this object holds whatever "cache" is needed to  assess
         * rule conditions efficiently. Hence direct access to this context should
         * not be granted for the moment explicitly.
         * @param properties The properties is the 'flat' Object to be passed over to the engine.\n
         * Its attributes will be the names that will be used to access objects of the world.\n
         *
         * This may not be a flat object and be a custom class. This is possible as long
         * as this object has a "defaultWrapper" attribute holding a default wrapper to use to access its
         * contents.
         * <br/>
         * <br/>
         * If the object is actually flat, it will be wrapped by a built in wrapper, {@link enioka.rules-RuleFact}.
         *
         */
        var RuleContext = {
            initialize : function(properties) {
                this.wrapCache = new Object();
                this.rulesEvalCache = new Object();
                var defaultWrapper = null;
                if (properties && properties.defaultWrapper)
                    defaultWrapper = properties.defaultWrapper;

                if (defaultWrapper) {
                    this.defaultWrapper = defaultWrapper;
                }
                else {
                    this.defaultWrapper = this._defaultWrapper;
                }
                if (typeof properties.getAttributeValue  == 'undefined') {
                    if (properties.constructor == Object) {
                        this.values = new RuleFact(properties);
                    } else {
                        this.values = this.wrapObject("", this.values, null);
                    }
                } else {
                    this.values = properties;
                }
            },
            
            /**
             * @function
             * @instance
             * @description
             * This method is used to access to sub elements of a rule (condition or action) in a portable way
             * across possible rules format implementation. To be used in custom actions or conditions.
             *
             * @param {enioka.rules.RuleElement} element - Rule element to process
             * @param {string} type - path to sub element looked for
             * @param {Array} array - array to fill with elements
             * @returns an opaque set of elements
             */
            getRuleSubElements : function (element,type,array) {
                return getRuleSubElements(element,type,array);
            },
            
            /**
             * @function
             * @instance
             * @description
             * This method is used to access to sub elements of a rule (condition or action) in a portable way
             * across possible rules format implementation. To be used in custom actions or conditions.
             * This method provides the number of elements retrieved.
             *
             * @param elements - opaque set of elements
             * @returns the number of elements
             */
            getRuleSubElementsNumber : function (elements) {
                return getRuleSubElementsNumber(elements);
            },
            
            /**
             * @function
             * @instance
             * @description
             * This method is used to access to sub elements of a rule (condition or action) in a portable way
             * across possible rules format implementation. To be used in custom actions or conditions.
             * This method accesses the nth of elements retrieved.
             *
             * @param elements - opaque set of elements
             * @param {int} - nth element
             * @returns the nth element
             */
            getRuleSubElement : function (elements,i) {
                return getRuleSubElement(elements,i);
            },
            
            /**
             * @function
             * @instance
             * @description
             * This method is used to access to elements of a rule (condition or action) in a portable way
             * across possible rules format implementation. To be used in custom actions or conditions.
             * This method accesses the list of attribute names defined for the element.
             *
             * @param element - opaque element of rule (rule header, action or condition)
             * @returns an array of attribute names
             */
            getRuleElementAttributes : function(rule) {
                return getRuleElementAttributes(rule);
            },
            
            /**
             * @function
             * @instance
             * @description
             * This method is used to access to elements of a rule (condition or action) in a portable way
             * across possible rules format implementation. To be used in custom actions or conditions.
             * This method accesses the specified attribute value.
             *
             * @param element - opaque element of rule (rule header, action or condition)
             * @param attribute - name of the attribute
             * @returns the attribute value
             */
            getRuleElementAttribute : function(rule, attribute) {
                return getRuleElementAttribute(rule,attribute);
            },

            /**
             * @function
             * @instance
             * @description
             * This method is used to access to elements of a rule (condition or action) in a portable way
             * across possible rules format implementation. To be used in custom actions or conditions.
             * This method checks if the specified attribute exists for the object.
             *
             * @param element - opaque element of rule (rule header, action or condition)
             * @param attribute - name of the attribute
             * @returns {boolean} true or false depending if attribute does exist.
             */
            hasRuleElementAttribute : function(rule, attribute) {
                return hasRuleElementAttribute(rule,attribute);
            },

            /**
             * @function
             * @instance
             * @description
             * This method checks that a given {@link enioka.rules.RuleCondition} is true or false in the current context
             * As explained in the general documentation, a number of predefined conditions exist
             * but it may be extended at will with specific condition handlers supplied at the
             * creation of the engine.
             *
             * @param {enioka.rules.RuleCondition} condition - Condition to be scanned
             * @returns {boolean} true or false depending if condition is satisfied.
             */
            checkCondition : function(condition) {
                var engine = this.getEngine();
                var conditionHandler = engine.getConditionHandler(condition);
                if (conditionHandler) {
                    return conditionHandler(this,condition);
                } else {
                    info_debug('Unhandled condition :', condition);
                    return false;
                }
            },

            /**
             * @function
             * @instance
             * @description
             * This method executes a given {@link enioka.rules.RuleAction}  in the current context
             * As explained in the general documentation, a number of predefined actions exist
             * but it may be extended at will with specific action handlers supplied at the
             * creation of the engine.
             * @param {enioka.rules.RuleAction} action - Action that will be fired
             * @param {enioka.rules.Rule} rule - Rule that is fired
             */
            fireAction : function(action, rule) {
                var engine = this.getEngine();
                var actionHandler = engine.getActionHandler(action);
                if (actionHandler) {
                    return actionHandler(this,action, rule);
                } else {
                    info_debug('Unhandled action :', action);
                    return null;
                }
            },

            /**
             * @function
             * @instance
             * @description
             * Gets the engine associated to this context.
             * @returns {enioka.rules.RuleEngine} the engine associated with this context.
             */
            getEngine : function() {
                return this.engine;
            },

            /**
             * @function
             * @instance
             * @description
             * Sets the engine associated to this context.
             */
            setEngine : function(engine) {
                return this.engine = engine;
            },

            /**
             * @function
             * @instance
             * @description
             * Default wrapper to objects of the world
             * @private
             */
            _defaultWrapper : function(object, path, context, father) {
                return new RuleExternalObject(object, path, context, father);
            },

            /**
             * @function
             * @instance
             * @description
             * During evaluation, rules may be nested. Their conditions are
             * evaluated once only and then cached (unless a recurse or choose
             * control invalidates it)
             */
            clearRulesEvalCache : function() {
                this.rulesEvalCache = new Object();
            },

            /**
             * @function
             * @instance
             * @description
             * Checks if a rule has been evaluated already
             */
            hasRuleEval : function (rule) {
                return (typeof(this.rulesEvalCache[rule]) !== 'undefined');
            },

            /**
             * @function
             * @instance
             * @description
             * Retrieves cached rule's evaluation.
             */
            getRuleEval : function (rule) {
                return this.rulesEvalCache[rule.id];
            },

            /**
             * @function
             * @instance
             * @description
             * Sets cached rule's evaluation. This prevents multiple evaluations of the same rule in the current context.
             * Used for instance with nested rules. Embedded rules check status of parents.
             */
            setRuleEval : function (rule, match) {
                return this.rulesEvalCache[rule.id]=match;
            },

            /**
             * @function
             * @instance
             * @description
             * Internal function that manually parses the access path to an object
             * @private
             */
            _getPathObject : function(path, create) {
                var object = this.values;
                var i = 0;
                var j = path.indexOf(".");
                var father = this.values;
                while (j != -1) {
                    var attribute = path.substring(i,j);
                    object = father.getAttributeValue(attribute);
                    if (!object) {
                        if (create) {
                            object = new RuleResult();
                            father.setAttributeValue(attribute,object);
                        }
                        else {
                            return null;
                        }
                    }
                    object = this.wrapObject(path.substring(0,j), object, father);
                    i = j+1;
                    j = path.indexOf(".",i);
                    father = object;
                }
                return object;
            },

            /**
             * @function
             * @instance
             * @description
             * Internal function that extracts last element of the path considered as (generalized) attribute.
             * @private
             */
            _getPathAttribute : function(path) {
                var i = path.lastIndexOf(".");
                return path.substring(i+1);
            },

            /**
             * @function
             * @instance
             * @description
             *  Internal function to extract an expression with an offset in a value string.
             * @private
             */
            _getExpressionIndex : function(expression, start) {
                var i=start+1;
                var level = 0;
                var inString = false;
                while ((i < expression.length) && ((expression.charAt(i) != ')') || inString || (level > 0))) {
                    if ((expression.charAt(i) =='"') || (expression.charAt(i) =='\'')) {
                        inString  = !inString;
                        i++;
                        continue;
                    }
                    if (inString) {
                        i++;
                        continue;
                    }
                    if (expression.charAt(i) =='(') {
                        level++;
                    }
                    if (expression.charAt(i) ==')') {
                        level--;
                    }
                    i++;
                }
                if ((i > expression.length) || (expression.charAt(i) != ')') || inString || (level > 0)) {
                    info_debug("Syntax error in expression ", expression);
                    return -1;
                }
                else {
                    return i;
                }
            },

            /**
             * @function
             * @instance
             * @description
             * Internal function to compute a value from an expression, potentially recursive
             * @private
             */
            _getExpressionValue : function(expression) {
                var i=0;
                var args = new Array();
                var from = 0;
                var inString = false;
                while (i < expression.length) {
                    if ((expression.charAt(i) =='"') || (expression.charAt(i) =='\'')) {
                        inString  = !inString;
                        if (inString) {
                            from=i; i++;
                            continue;
                        }
                        else {
                            args.push(expression.substring(from,i+1));
                            i++; from=i;
                            continue;
                        }
                    }
                    if (inString) {
                        i++;
                        continue;
                    }
                    if (expression.charAt(i) == '(') {
                        var index = this._getExpressionIndex(expression, i);
                        if (index == -1) {
                            info_debug("Syntax error in expression ", expression);
                            return null;
                        }
                        else {
                            args.push(this._getExpressionValue(expression.substring(i+1,index)));
                            i=index+1;
                            from=i;
                            continue;
                        }
                    }
                    if ((expression.charAt(i) == ' ') || (expression.charAt(i) == '\t') || (expression.charAt(i) == '\n')) {
                        if (from == i) {
                            i++; from++;
                        }
                        else {
                            args.push(expression.substring(from,i));
                            i++; from=i;
                        }
                        continue;
                    }
                    i++;
                }

                if (inString) {
                    info_debug("Error: syntax error in expression in string : ", expression);
                    return null;
                }

                if (from != i) {
                    args.push(expression.substring(from,i));
                }
                var values = new Array();
                for (i=0; i<args.length; i++) {
                    values[i] = this.getValue(args[i]);
                }

                if (values.length == 0) {
                    info_debug("Error: syntax error in expression : ", expression);
                    return null;
                }
                var funcall = values[0];

                if (funcall == '+') funcall="plus";
                if (funcall == '-') funcall="minus";
                if (funcall == '/') funcall="div";
                if (funcall == '*') funcall="mul";

                var engine = this.getEngine();
                var functionHandler = engine.getFunctionHandler(funcall);

                if (functionHandler) {
                    return functionHandler(this,values);
                }
                else {
                    info_debug("Error: unknown function in expression : ", args[0], values[0], expression);
                    return null;
                }
            },

            /**
             * @function
             * @instance
             * @description
             * General entry point in charge of retrieving a value from a path or an expression <br/>
             * <br/>
             * @param {string} path - Path or expression specifying a value
             * The general form of such expression is either <br/>
             * - a quoted litteral (with simple or double quotes) <br/>
             * - a string prefixed with a $ sign meaning that what follows (without spaces)
             * is an access path in context
             * - a string starting with a ( , then it is considered an expression in lisp
             * like syntax with first item being a function, and following values are parameters.
             * Expressions can be nested at will <br/>
             * - a litteral in any other case
             */
            getValue : function(path) {
                if (!path) return null;
                if (typeof path == "number") return path;
                if (typeof path == "boolean") return path;
                if (typeof path == "object") return path;
                if (path.length == 0) return null;
                if ((path.charAt(0) == '"') || (path.charAt(0) == '\'')) {
                    if (path.length < 2) return null;
                    return path.substring(1,path.length-1);
                }
                if ((path.charAt(0) == '$') && (path.length > 1) && (path.charAt(1) !='{')) {
                    path = path.substring(1);
                    var object = this._getPathObject(path,false);
                    if (object) {
                        var attribute = this._getPathAttribute(path);
                        return object.getAttributeValue(attribute);
                    }
                    else {
                        return null;
                    }
                }
                if (path.charAt(0) == '(') {
                    var index = this._getExpressionIndex(path, 0);
                    if (index == -1) {
                        info_debug("Syntax error in expression ", path);
                        return null;
                    }
                    else {
                        return this._getExpressionValue(path.substring(1,index));
                    }
                }
                return path;
            },

            /**
             * @function
             * @instance
             * @description
             * General entry point to set a value to a path
             * @param {string} path - Path where to store the value
             * @param {string} value - Value to store
             */
            setValue : function(path,value) {
                if (!path) return null;
                var object = this._getPathObject(path,true);
                var attribute = this._getPathAttribute(path);
                return object.setAttributeValue(attribute,value);
            },

            /**
             * @function
             * @instance
             * @description
             * General entry point to add a value to a path
             * It is not the same as previous  {@link enioka.rules.RuleContext.setValue} it will force specified path to be an array of values
             * @param {string} path - Path where to store the value
             * @param {string} value - Value to store
             */
            addValue : function(path,value) {
                if (!path) return null;
                var object = this._getPathObject(path,true);
                var attribute = this._getPathAttribute(path);
                return object.addAttributeValue(attribute,value);
            },

            // As a matter of fact, the context itself is a wrapped object as well
            // as such it provides uniform access to all objects, by providing
            // their "virtual" access root path
            // This is hidden from public interface documentation because an internal's
            getAttributeValue : function (attribute) {
                return this.values[attribute];
            },

            setAttributeValue : function (attribute,value) {
                return this.values[attribute] = value;
            },

            addAttributeValue : function (attribute,value) {
                if (this.values[attribute] && Array.isArray(this.values[attribute])) {
                    return this.values[attribute].push(value);
                } else {
                    if (this.values[attribute]) {
                        this.values[attribute] = [this.values[attribute], value];
                        return this.values[attribute];
                    } else {
                        this.values[attribute] = [value];
                        return this.values[attribute];
                    }
                }
            },
            
            wrapObject : function(path, object, father) {
                var wrapper = this.wrapCache[path];
                if (wrapper) {
                    return wrapper;
                }
                else {
                    if (object.wrapObject) {
                        this.wrapCache[path] = object.wrapObject(object, path, this, father);
                        return this.wrapCache[path];
                    }
                    if (father && (father.wrapSon)) {
                        this.wrapCache[path] = father.wrapSon(object, path, this, father);
                        return this.wrapCache[path];
                    }
                    this.wrapCache[path] = this.defaultWrapper(object, path, this, father);
                    return this.wrapCache[path];
                }
            }
        };
        RuleContext = Class.create(RuleContext);
        
        /**
         * @interface
         * @memberof enioka.rules
         * @classdesc
         * <br/>
         * <br/>
         * A Rule Element is a part used in a rule definition.
         */
        var RuleElement = {
                initialize : function(properties) {
                }
        };
        RuleElement = Class.create(RuleElement);

        /**
         * @interface
         * @memberof enioka.rules
         * @extends enioka.rules.RuleElement
         * @classdesc
         * <br/>
         * <br/>
         * A Rule Condition is a Rule Element that hold conditions of a rule. A number of predefined conditions
         * are built in in the core rules implementation: <br/>
         * - {@link enioka.rules.conditions.NOT} <br/>
         * - {@link enioka.rules.conditions.OR} <br/>
         * - {@link enioka.rules.conditions.AND} <br/>
         * - {@link enioka.rules.conditions.ISNULL} <br/>
         * - {@link enioka.rules.conditions.LESS} <br/>
         * - {@link enioka.rules.conditions.MORE} <br/>
         * - {@link enioka.rules.conditions.MATCHES} <br/>
         * - {@link enioka.rules.conditions.EQUALS} <br/>
         * - {@link enioka.rules.conditions.LIKE} <br/>
         * One may extend these predefined conditions by providing additional condition handlers at engine initialization.
         * It is as simple as providing either a named set of classs with the specified RuleCondition interface, with the handler
         * interface or simply of functions with the proper interface.
         */
        var RuleCondition = {
                initialize : function(properties) {
                }
        };
        RuleCondition = Class.create(RuleCondition, RuleElement);

        /**
         * @interface
         * @memberof enioka.rules
         * @extends enioka.rules.RuleElement
         * @classdesc
         * <br/>
         * <br/>
         * A Rule Action is a Rule Element that hold actions of a rule. A number of predefined actions
         * are built in in the core rules implementation: <br/>
         * - {@link enioka.rules.actions.LOG}, {@link enioka.rules.actions.LOG_USER}  <br/>
         * - {@link enioka.rules.actions.SET}, {@link enioka.rules.actions.DSET}  <br/>
         * - {@link enioka.rules.actions.ADD}, {@link enioka.rules.actions.DADD} <br/>
         * - {@link enioka.rules.actions.CLEAR}, {@link enioka.rules.actions.DCLEAR} <br/>
         * - {@link enioka.rules.actions.SET_TEXT}<br/>
         * - {@link enioka.rules.actions.ADD_TEXT}<br/>
         * - {@link enioka.rules.actions.SET_OBJECT}<br/>
         * - {@link enioka.rules.actions.ADD_OBJECT}<br/>
         * - {@link enioka.rules.actions.RECURSE}<br/>
         * - {@link enioka.rules.actions.CHOOSE}<br/>
         * - {@link enioka.rules.actions.CONTROL}<br/>
         * One may extend these predefined actions by providing additional action handlers at engine initialization.
         * It is as simple as providing either a named set of classs with the specified RuleAction interface, with the handler
         * interface or simply of functions with the proper interface.
         */
        var RuleAction = {
                initialize : function(properties) {
                }
        };
        RuleAction = Class.create(RuleAction, RuleElement);

        /**
         * @interface
         * @memberof enioka.rules
         * @extends enioka.rules.RuleElement
         * @classdesc
         * <br/>
         * <br/>
         * A Rule Function is a Rule Element that hold functions of a rule. A number of predefined functions
         * are built in in the core rules implementation: <br/>
         * - {@link enioka.rules.functions.catenate}  <br/>
         * - {@link enioka.rules.functions.print}  <br/>
         * - {@link enioka.rules.functions.add}  <br/>
         * - {@link enioka.rules.functions.div}  <br/>
         * - {@link enioka.rules.functions.minus}  <br/>
         * 
         * One may extend these predefined actions by providing additional function handlers at engine initialization.
         * It is as simple as providing either a named set of classs with the specified RuleFunction interface, with the handler
         * interface or simply of functions with the proper interface.
         */
        var RuleFunction = {
                initialize : function(properties) {
                }
        };
        RuleFunction = Class.create(RuleFunction, RuleElement);

        /**
         * @memberof enioka.rules
         * @class
         * @classdesc
         * This class represents the rules objects of the engine. These objects are directly mapped
         * against their XML source, without (for the moment) compilation to an alternative form
         * more efficient or convenient for execution. <br/>
         * <br/>
         * This class is not exposed either to the client API. It is only "seen" from the client
         * application as an XML object that customizes the behaviour of the engine in a
         * "declarative" form. <br/>
         *
         * @description This this takes an XML source code rule and registers "fast" access to the conditions
         * actions and subrules. It does propagate the rule creation to embedded rules as well.
         * See Rule syntax in documentation for further information on rule syntax.
         * @param rule {Object} The source code for the rule as an XML or JSON object 
         * @param father {enioka.rules.Rule} The embedding father rule if any (as an object)
         * @param id {number} The unique id allocated to identify this rule (integer counter).
         */
        var Rule = {
            initialize : function(ruleXML, father, id) {
//                info_debug('Creating rule ', id , ruleXML);
                this.id = id;
                this.ruleXML = ruleXML;
                this.conditionsXML = new Array();
                getRuleSubElements(ruleXML,"IF/*", this.conditionsXML);

                this.actionsXML = new Array();
                getRuleSubElements(ruleXML,"THEN/*", this.actionsXML);

                this.rulesXML = new Array();
                getRuleSubElements(ruleXML,"RULE", this.rulesXML);

                this.father = father;
            },

            /**
             * @function
             * @instance
             * @description This function checks if a rule does use the specified key as a compiled condition
             * @return {boolean} A boolean indicating whether the specified rule has
             * an "optimized" condition with this access key condition
             * @param key The key (access path) that will be used
             */
            hasKey : function(key) {
                var hasKey = hasRuleElementAttribute(this.ruleXML,key);
                if (hasKey)
                    return hasKey;
                if (!this.father)
                    return false;
                return this.father.hasKey(key);
            },

            /**
             * @function
             * @instance
             * @description This function returns the key expected values for this rule 
             * @return {string} The key value for the optimized key condition to be met
             * for this rule to fire. For a compiled condition, it MUST be a constant.
             * @param key The key (access path) that will be used
             */
            getKey : function(key) {
                var hasKey = hasRuleElementAttribute(this.ruleXML,key);
                if (hasKey)
                    return getRuleElementAttribute(this.ruleXML,key);
                if (!this.father)
                    return null;
                return this.father.getKey(key);
            },

            /**
             * @function
             * @instance
             * @description This function checks if the rule does match in current context
             * @return {boolean} true if a given rule has its preconditions verified in the
             * provided context, false otherwise.
             * @param context The context in which to evaluate the conditions of the rule
             */
            matches : function(context) {
                // Use cached rule result if possible
                if (context.hasRuleEval(this))
                    return context.getRuleEval(this);

                // Check father conditions if any
                if (this.father)
                    if (!this.father.matches(context))
                {
                    context.setRuleEval(this,false);
                    return false;
                }

                // Evaluate all conditions as a defaut AND ...
                for (var i=0; i<this.conditionsXML.length; i++) {
                    var conditionXML = this.conditionsXML[i];
                    if (!context.checkCondition(conditionXML)) {
                        context.setRuleEval(this,false);
                        return false;
                    }
                }

                // If made it to there, then conditions are met
                context.setRuleEval(this,true);
                return true;
            },

            /**
             * @function
             * @instance
             * @description Executes the actions of the specified rule on the provided context
             * @param context The context in which to evaluate the conditions of the rule
             */
            fires : function(context) {
                for (var i=0; i<this.actionsXML.length; i++) {
                    var actionXML = this.actionsXML[i];
                    context.fireAction(actionXML, this);
                }
            },

            /**
             * @function
             * @instance
             * @description Scans and if applicable executes the specified rule on the provided context
             * @param context The context on which to apply the rule
             */
            process : function(context) {
                if (this.matches(context)) {
                    this.fires(context);
                }
            },

            /**
             * @function
             * @instance
             * @description Gets the priority of the rule
             * @return {number} The priority of the rule, as its own
             * or the priority of its embedding rule if any
             */
            getPriority : function() {
                if (hasRuleElementAttribute(this.ruleXML,"priority"))
                    return parseInt(getRuleElementAttribute(this.ruleXML,"priority"));
                else
                    if (this.father)
                        return this.father.getPriority();
                else
                    return 0;
            },

            /**
             * @function
             * @instance
             * @description Gets the prefix associated with the rule
             * @return {string} The prefix of the rule, as its own
             * or the prefix of its embedding rule if any, possibly combined with its own
             * if the rule own prefix starts with ".". The prefix is used in rules to
             * "prefix" access path of deduced facts.
             */
            getPrefix : function() {
                if (hasRuleElementAttribute(this.ruleXML,"prefix")) {
                    var prefix = getRuleElementAttribute(this.ruleXML,"prefix");
                    if (prefix.charAt(0) == '.') {
                        if (this.father)
                            return this.father.getPrefix()+prefix;
                        else
                            return "result"+prefix;
                    } else {
                        return prefix;
                    }

                } else
                    if (this.father)
                        return this.father.getPrefix();
                else
                    return "result";
            }
        };
        Rule = Class.create(Rule);

        /**
         * @memberof enioka.rules
         * @class
         * @classdesc
         * This class provides the core mechanism for efficiently indexing rules by their
         * use of optimized conditions. When an optimized condition is used of the form key=value
         * all rules that reference the value found in context for this key can be retrieved
         * efficiently without scanning all rules one by one.
         * <br/>
         * <br/>
         * This class is internal only.
         * <br/>
         * <br/>
         * This class could be further enhanced to provide fast access to candidate rules beyond
         * optimized conditions only... (ultimately a "xrete" like network would be the solution).
         * Still this indexing technique as is is independent of world values, which is a significant
         * benefit and drastically indexing work for each fact scanned, when they are submitted
         * one by one (or internally scanned through the CHOOSE operator).
         *
         * @description Does not do a thing...
         */
        var RuleIndex = {
            initialize : function() {
            },

            /**
             * @instance
             * @description
             * This is the major algorithm to build the index of all rules. <br/>
             * The index is a recursive data structure that "points" to the matching rules.
             * @param {Array} keys - array of keys
             * @param {int} index - index in the keys
             * @param {enioka.rules.Rule} rule - rule to add to the index
             */
            addRule : function(keys, index, rule) {
                // Check if index tree is at a leaf
                if (index >= keys.length) {
                    if (rule.actionsXML && (rule.actionsXML.length > 0)) {
                        // If so and there is no rule in this index, create an empty array
                        if (!this.rules) {
                            this.rules = new Array();
                        }
                        // Add the rule to the leaf index
                        this.rules.push(rule);
                    }
                    return;
                }
                else {
                    // Process next tree level
                    var key = keys[index];
                    this.key = key;
                    // Check if this rule actually has this key as an optimized condition
                    if (rule.hasKey(key)) {
                        // The rule does use this key
                        var values = rule.getKey(key);
                        // If no subindex, then allocate it
                        if (!this.indexes)
                            this.indexes = new Object();
                        if (values && (values.indexOf("|") > -1)) {
                            values = values.split("|");
                        } else {
                            values = [values];
                        }
                        for (var i=0; i < values.length; i++) {
                            var value = values[i];
                            
                            // If no subindex of this key, then allocate it as well
                            if (!this.indexes[value]) {
                                this.indexes[value] = new RuleIndex();
                                // Then one must reinject all rules that happened to be
                                // under the nokey entry
                                if (this.noKey) {
                                    var noKeyRules = new Array();
                                    this.noKey.getRules(null, noKeyRules);
                                    for (var i=0; i< noKeyRules.length; i++) {
                                        this.indexes[value].addRule(keys, index, noKeyRules[i]);
                                    }
                                }
                            }

                            this.indexes[value].addRule(keys, index+1, rule);
                        }
                    }
                    else {
                        // This rule does not use this key, hence all key values apply
                        if (!this.noKey) {
                            this.noKey = new RuleIndex();
                        }
                        this.noKey.addRule(keys, index+1, rule);
                        // And add this nokey rule to any existing key rule
                        if (this.indexes) {
                            for (var other in this.indexes) {
                                this.indexes[other].addRule(keys, index+1, rule);
                            }
                        }
                    }
                }
            },

            /**
             * @function
             * @instance
             * @description
             * Collect all rules that are a fit to the provided context
             * @param context {enioka.rules.RuleContext} The context to use for checking rules
             * @param keys {Array} The array of keys that structure the tree
             * @param index {number} Current index in the keys array to process
             * @param rules {Array} The array of collected rules where each rule should be added
             * @return {Array} rules to scan for given context
             */
            getRules : function(context, keys, index, rules) {
                // Pruning of index without any rules with actions
                if (!this.hasActions) {
                    return;
                }
                if (index >= keys.length) {
                    if (this.rules) {
                        for (var i=0; i< this.rules.length; i++) {
                            var rule = this.rules[i];
                            var found = false;
                            for (var j=0; j<rules.length; j++) {
                                if (rules[j]==rule) {
                                    found = true;
                                }
                            }
                            if (!found) {
                                rules.push(rule);
                            }
                        }
                    }
                    return;
                } else {
                    if (context) {
                        var key = "$"+keys[index];
                        if (this.indexes) {
                            var keyValue = context.getValue(key);
                            if (this.indexes[keyValue]) {
                                this.indexes[keyValue].getRules(context,keys,index+1,rules);
                            }
                        }
                        if (this.noKey) {
                            this.noKey.getRules(context,keys,index+1,rules);
                        }
                    } else {
                        if (this.noKey) {
                            this.noKey.getRules(context,keys,index+1,rules);
                        }
                        if (this.indexes) {
                            for (var key in this.indexes) {
                                if (this.indexes.hasOwnProperty(key)) {
                                    this.indexes[key].getRules(context,keys,index+1,rules);
                                }
                            }
                        }
                    }
                }
                return;
            },
            
            /** 
             * @instance
             * @description
             * Perform rules index optimization to reduce overhead of the runtime scan of the index
             * For the moment detects only the leaf with no actions.
             * Should make possible direct jumps to proper rules without lengthy intermediate scan of index
             */
            optimize : function() {
                this.hasActions = false;
                if (this.rules && this.rules.length) {
                    for (var i=0; i < this.rules.length; i++) {
                        var rule = this.rules[i];
                        if (rule.actionsXML && rule.actionsXML.length) {
                            this.hasActions = true;
                        }
                    }
                }
                if (this.indexes) {
                    for (var key in this.indexes) {
                        if (this.indexes.hasOwnProperty(key)) {
                            if (this.indexes[key].optimize()) {
                                this.hasActions = true;
                            }
                        }
                    }
                }
                if (this.noKey) {
                    if (this.noKey.optimize()) {
                        this.hasActions = true;
                    }
                }
                return this.hasActions;
            }
        };
        RuleIndex = Class.create(RuleIndex);

        /**
         * @memberof enioka.rules
         * @class
         * @classdesc
         * This class provides all access to the rule engine and its
         * associated functionality. Which is, by the way trivial: apply rules and return the
         * result created by the rules.
         * <br/>
         * <br/>
         * It has for the moment two main entry points:<br/>
         * - the constructor to initialize the rule engine with the rules<br/>
         * - the applyRules to apply the rules to a given context<br/>
         * @param properties The elements to customize the engine. For the moment the
         * following attributes are supported : <br/>
         * - rules : the rules as an XML fragment <RULES> <RULE />* </RULES>  <br/>
         * - conditionHandlers : the condition handlers to extend core conditions defined <br/>
         * - actionHandlers : the action handlers to extend core actions defined <br/>
         * - functionHandlers : the function handlers to extend core functions defined <br/>
         * @description The constructor is in charge of building all data structures
         * from the specified rules and then make possible the use of the rules.
         */
        var RuleEngine = {
            initialize : function(properties) {
                if (properties) {
                    if (properties.info_debug || properties.warn_debug || properties.error_debug ||
                            properties.info_user || properties.warn_user || properties.error_user ) {
                        eniokarules.info_debug = properties.info_debug;
                        eniokarules.warn_debug = properties.warn_debug;
                        eniokarules.error_debug = properties.error_debug;

                        eniokarules.info_user = properties.info_user;
                        eniokarules.warn_user = properties.warn_user;
                        eniokarules.error_user = properties.error_user;
                    }
                }
                
                this.maxRuleID = 0;

                if (properties.rulesXML) {
                    this.rulesXML = properties.rulesXML;
                    this.rules = [];
                    for (var i=0;i<this.rulesXML.length;i++) {
                        this.rules.push(this._parseRule(this.rulesXML[i], null));
                    }
                } else {
                    info_debug('Error : no rules specified');
                    return;
                }

                // Initialize all handles for conditions, functions and actions
                // Defined as "hard coded" functions, possibly overrided or extended by
                // user defined handlers. The key of the handler is the tag that
                // will be used to extend the XML syntax
                this.initActionHandlers(properties);
                this.initFunctionHandlers(properties);
                this.initConditionHandlers(properties);

                // One may provide the keys to use to index rules
                if (properties.keys) {
                    this.keys = properties.keys;
                } else {
                    // If not provided, then a basic algo will compute the array
                    // of the keys and their "optimal" ordering
                    this.keys = new Array();
                    this.keysStats = new Object();
                    this.index = new RuleIndex();
                    for (var i=0;i<this.rulesXML.length;i++) {
                        this._keyStatsOfRule(this.rules[i], this.keys, this.keysStats);
                    }

                    for (key in this.keysStats) {
                        if (this.keysStats.hasOwnProperty(key))
                            this.keys.push(key);
                    }

                    // Sort keys so that index is as efficient as possible
                    // to select quickly relevant rules
                    var stats = this.keysStats;
                    this.keys.sort(function(keyA,keyB) {
                                       var a = stats[keyA]._count;
                                       var b = stats[keyB]._count;
                                       if (a != b) {
                                           return b-a;
                                       }
                                       else {
                                           a = objectSize(stats[keyA]);
                                           b = objectSize(stats[keyB]);
                                           return b-a;
                                       }
                                   });

                    info_debug("Here are the keys found and their selected order : ", this.keys);
                }

                // Once the keys array defined, one can build the index of the rules
                for (var i=0;i<this.rulesXML.length;i++) {
                    this._indexRule(this.rules[i]);
                }
                
                this.index.optimize();

                info_debug("The engine has compiled all rules and indexed them against used keys : ", this);
            },


            getConditionHandler : function (condition) {
                return this.conditionHandlers[getRuleElementType(condition)];
            },

            initConditionHandlers : function (properties) {
                this.conditionHandlers = new Object();
                /**
                 * @namespace enioka.rules.conditions
                 * @description This namespace holds predefined conditions to use in rules.
                 */
                /**
                 * @function
                 * @static
                 * @name AND
                 * @description This condition ands the embedded conditions in this condition object
                 * @memberof enioka.rules.conditions
                 * @param {enioka.rules.RuleContext} context - the context to be used in the rule implementation
                 * @param {enioka.rules.RuleCondition} condition - the condition object passed to the rule
                 * @return {boolean} true of false if condition is met or not
                 */
                this.conditionHandlers.AND = function(context,condition) {
                    if (getRuleElementType(condition) == "AND") {
                        var conditions = context.getRuleSubElements(condition,"*",null);
                        for (var i=0; i<context.getRuleSubElementsNumber(conditions); i++) {
                            var son = context.getRuleSubElement(conditions,i);
                            if (son == null) {
                                continue;
                            }
                            if (!context.checkCondition(son)) return false;
                        }
                        return true;
                    }
                };
                /**
                 * @function
                 * @static
                 * @name NOT
                 * @description This condition negates the embedded conditions in this condition object
                 * @memberof enioka.rules.conditions
                 * @param {enioka.rules.RuleContext} context - the context to be used in the rule implementation
                 * @param {enioka.rules.RuleCondition} condition - the condition object passed to the rule
                 * @return {boolean} true of false if condition is met or not
                 */
                this.conditionHandlers.NOT = function(context,condition) {
                    if (getRuleElementType(condition) == "NOT") {
                        var conditions = context.getRuleSubElements(condition,"*",null);
                        for (var i=0; i<context.getRuleSubElementsNumber(conditions); i++) {
                            var son = context.getRuleSubElement(conditions,i);
                            if (son == null) {
                                continue;
                            }
                            if (context.checkCondition(son)) return false;
                        }
                        return true;
                    }
                };
                /**
                 * @function
                 * @static
                 * @name OR
                 * @description This condition ors the embedded conditions in this condition object
                 * @memberof enioka.rules.conditions
                 * @param {enioka.rules.RuleContext} context - the context to be used in the rule implementation
                 * @param {enioka.rules.RuleCondition} condition - the condition object passed to the rule
                 * @return {boolean} true of false if condition is met or not
                 */
                this.conditionHandlers.OR = function(context,condition) {
                    if (getRuleElementType(condition) == "OR") {
                        var conditions = context.getRuleSubElements(condition,"*",null);
                        for (var i=0; i<context.getRuleSubElementsNumber(conditions); i++) {
                            var son = context.getRuleSubElement(conditions,i);
                            if (son == null) {
                                continue;
                            }
                            if (context.checkCondition(son)) return true;
                        }
                        return false;
                    }
                };
                /**
                 * @function
                 * @static
                 * @name MATCHES
                 * @description This condition is true if the specified path matches the specified pattern
                 * @memberof enioka.rules.conditions
                 * @param {enioka.rules.RuleContext} context - the context to be used in the rule implementation
                 * @param {enioka.rules.RuleCondition} condition - the condition object passed to the rule
                 * @return {boolean} true of false if condition is met or not
                 */
                this.conditionHandlers.MATCHES = function(context,condition) {
                    if (getRuleElementType(condition) == "MATCHES") {
                        var attributes = getRuleElementAttributes(condition);
                        for (var i=0; i<attributes.length;i++)  {
                            var attributePath = attributes[i];
                            var value = context.getValue("$"+attributePath);
                            if (value) {
                                var attributeValue = getRuleElementAttribute(condition,attributePath);
                                var patternvalue = context.getValue(attributeValue);
                                if (patternvalue) {
                                    var pattern = new RegExp(patternvalue,"gi");
                                    return pattern.test(value);
                                }
                                else {
                                    return false;
                                }
                            }
                            else {
                                return false;
                            }
                        }
                    }
                };
                /**
                 * @function
                 * @static
                 * @name EQUALS
                 * @description This condition is true if the specified paths of values are equal
                 * @memberof enioka.rules.conditions
                 * @param {enioka.rules.RuleContext} context - the context to be used in the rule implementation
                 * @param {enioka.rules.RuleCondition} condition - the condition object passed to the rule
                 * @return {boolean} true of false if condition is met or not
                 */
                this.conditionHandlers.EQUALS = function(context,condition) {
                    if (getRuleElementType(condition) == "EQUALS") {
                        var value1 = context.getValue(getRuleElementAttribute(condition,"value1"));
                        var value2 = context.getValue(getRuleElementAttribute(condition,"value2"));
                        return value1 == value2;
                    }
                };
                /**
                 * @function
                 * @static
                 * @name ISNULL
                 * @description This condition is true if the specified path is null
                 * @memberof enioka.rules.conditions
                 * @param {enioka.rules.RuleContext} context - the context to be used in the rule implementation
                 * @param {enioka.rules.RuleCondition} condition - the condition object passed to the rule
                 * @return {boolean} true of false if condition is met or not
                 */
                this.conditionHandlers.ISNULL = function(context,condition) {
                    if (getRuleElementType(condition) == "ISNULL") {
                        var value = context.getValue(getRuleElementAttribute(condition,"value"));
                        return ((typeof(value) == "undefined") || (value == null));
                    }
                };
                /**
                 * @function
                 * @static
                 * @name INTERSECTS
                 * @description This condition is true if the specified paths of values are two arrays with values in common
                 * @memberof enioka.rules.conditions
                 * @param {enioka.rules.RuleContext} context - the context to be used in the rule implementation
                 * @param {enioka.rules.RuleCondition} condition - the condition object passed to the rule
                 * @return {boolean} true of false if condition is met or not
                 */
                this.conditionHandlers.INTERSECTS = function(context,condition) {
                    if (getRuleElementType(condition) == "INTERSECTS") {
                        var value1 = context.getValue(getRuleElementAttribute(condition,"value1"));
                        var value2 = context.getValue(getRuleElementAttribute(condition,"value2"));
                        return intersection(value1, value2);
                    }
                };
                /**
                 * @function
                 * @static
                 * @name LESS
                 * @description This condition is true if the first specified path of values is strictly less to second
                 * @memberof enioka.rules.conditions
                 * @param {enioka.rules.RuleContext} context - the context to be used in the rule implementation
                 * @param {enioka.rules.RuleCondition} condition - the condition object passed to the rule
                 * @return {boolean} true of false if condition is met or not
                 */
                this.conditionHandlers.LESS = function(context,condition) {
                    if (getRuleElementType(condition) == "LESS") {
                        var value1 = context.getValue(getRuleElementAttribute(condition,"value1"));
                        var value2 = context.getValue(getRuleElementAttribute(condition,"value2"));
                        return value1 < value2;
                    }
                };
                /**
                 * @function
                 * @static
                 * @name MORE
                 * @description This condition is true if the first specified path of values is strictly more to second
                 * @memberof enioka.rules.conditions
                 * @param {enioka.rules.RuleContext} context - the context to be used in the rule implementation
                 * @param {enioka.rules.RuleCondition} condition - the condition object passed to the rule
                 * @return {boolean} true of false if condition is met or not
                 */
                this.conditionHandlers.MORE = function(context,condition) {
                    if (getRuleElementType(condition) == "MORE") {
                        var value1 = context.getValue(getRuleElementAttribute(condition,"value1"));
                        var value2 = context.getValue(getRuleElementAttribute(condition,"value2"));
                        return value1 > value2;
                    }
                };
                /**
                 * @function
                 * @static
                 * @name LIKE
                 * @description This condition is true if the first specified path of values is like to second
                 * @memberof enioka.rules.conditions
                 * @param {enioka.rules.RuleContext} context - the context to be used in the rule implementation
                 * @param {enioka.rules.RuleCondition} condition - the condition object passed to the rule
                 * @return {boolean} true of false if condition is met or not
                 */
                this.conditionHandlers.LIKE = function(context,condition) {
                    if (getRuleElementType(condition) == "LIKE") {
                        var value1 = context.getValue(getRuleElementAttribute(condition,"value1"));
                        var value2 = context.getValue(getRuleElementAttribute(condition,"value2"));
                        var pattern = new RegExp(value2,"gi");
                        return pattern.test(value1);
                    }
                };

                if (properties.conditions) {
                    for (var key in properties.conditions) {
                        if (properties.conditions.hasOwnProperty(key)) {
                            this.conditionHandlers[key] = properties.conditions[key];
                        }
                    }
                }
            },

            getFunctionHandler : function (functionName) {
                return this.functionHandlers[functionName];
            },

            initFunctionHandlers : function (properties) {
                this.functionHandlers = new Object();
                /**
                 * @namespace enioka.rules.functions
                 * @description This namespace holds predefined functions to use in rules.
                 */
                /**
                 * @function
                 * @static
                 * @name print
                 * @description This function prints the values passed in the info_debug interface.
                 * @memberof enioka.rules.functions
                 * @param {enioka.rules.RuleContext} context - the context to be used in the rule implementation
                 * @param {Array} arguments - the arguments passed to the function
                 */
                this.functionHandlers.print = function(context, args) {
                    var result = "";
                    for (var i = 1; i < args.length; i++) {
                        result = result + args[i];
                    }
                    info_debug("PRINT [" + result + "]");
                    return result;
                };
                
                /**
                 * @function
                 * @static
                 * @name catenate
                 * @description This function catenates the values passed in a global string.
                 * @memberof enioka.rules.functions
                 * @param {enioka.rules.RuleContext} context - the context to be used in the rule implementation
                 * @param {Array} arguments - the arguments passed to the function
                 * @return {string} concatenated string
                 */
                this.functionHandlers.catenate = function(context, args) {
                    var result = "";
                    for (var i = 1; i < args.length; i++) {
                        result = result + args[i];
                    }
                    return result;
                };
                
                /**
                 * @function
                 * @static
                 * @name add
                 * @description This function adds the values passed.
                 * @memberof enioka.rules.functions
                 * @param {enioka.rules.RuleContext} context - the context to be used in the rule implementation
                 * @param {Array} arguments - the arguments passed to the function
                 * @return {number} sum of values
                 */
                this.functionHandlers.plus = function(context, args) {
                    var result = 0;
                    for (var i = 1; i < args.length; i++) {
                        result = result + parseFloat(args[i]);
                    }
                    return result;
                };
                
                /**
                 * @function
                 * @static
                 * @name mul
                 * @description This function multiplies the values passed.
                 * @memberof enioka.rules.functions
                 * @param {enioka.rules.RuleContext} context - the context to be used in the rule implementation
                 * @param {Array} arguments - the arguments passed to the function
                 * @return {number} product of values
                 */
                this.functionHandlers.mul = function(context, args) {
                    var result = 1;
                    for (var i = 1; i < args.length; i++) {
                        result = result * parseFloat(args[i]);
                    }
                    return result;
                };

                /**
                 * @function
                 * @static
                 * @name div
                 * @description This function divides the first value by the other values passed.
                 * @memberof enioka.rules.functions
                 * @param {enioka.rules.RuleContext} context - the context to be used in the rule implementation
                 * @param {Array} arguments - the arguments passed to the function
                 * @return {number} division of first value by following values
                 */
                this.functionHandlers.div = function(context, args) {
                    var result = parseFloat(args[1]);
                    if (args.length > 2) {
                        for (var i = 2; i < args.length; i++) {
                            result = result / parseFloat(args[i]);
                        }
                    }
                    else {
                        result = 1/result;
                    }
                    return result;
                };

                /**
                 * @function
                 * @static
                 * @name minus
                 * @description This function substracts the values to the first passed.
                 * @memberof enioka.rules.functions
                 * @param {enioka.rules.RuleContext} context - the context to be used in the rule implementation
                 * @param {Array} arguments - the arguments passed to the function
                 * @return {number} substraction of values
                 */
                this.functionHandlers.minus = function(context, args) {
                    var result = parseFloat(args[1]);
                    if (args.length > 2) {
                        for (var i = 2; i < args.length; i++) {
                            result = result - parseFloat(args[i]);
                        }
                    }
                    else {
                        result = - result;
                    }
                    return result;
                };

                if (properties.functions) {
                    for (var key in properties.functions) {
                        if (properties.functions.hasOwnProperty(key)) {
                            this.functionHandlers[key] = properties.functions[key];
                        }
                    }
                }

            },

            getActionHandler : function (action) {
                return this.actionHandlers[getRuleElementType(action)];
            },

            // TODO here : make possible to use full XML capability
            // for nice (HTML) message and possible susbtitution in ${} syntax
            // of context variables....
            _getMessage : function (context, action) {
                return context.getValue(getRuleElementAttribute(action,"message"));
            },

            initActionHandlers : function (properties) {
                this.actionHandlers = new Object();
                /**
                 * @namespace enioka.rules.actions
                 * @description This namespace holds predefined conditions to use in rules.
                 */
                /**
                 * @function
                 * @static
                 * @name LOG
                 * @description This action LOGS the specified message in the info_XXX interface specified.
                 * @memberof enioka.rules.actions
                 * @param {enioka.rules.RuleContext} context - the context to be used in the rule implementation
                 * @param {enioka.rules.RuleAction} action - the action object passed to the rule
                 * @param {enioka.rules.Rule} rule - the current scanned rule passed
                 */
                this.actionHandlers.LOG = function(context, action, rule) {
                    if (getRuleElementType(action) == "LOG") {
                        var message = context.getEngine()._getMessage(context, action) ;
                        var level = context.getValue(getRuleElementAttribute(action,"level"));
                        if ((level == null) || (level = "")) level="debug";
                        if (message) {
                            if (level == "debug") info_debug(message);
                            if (level == "warn") info_warn(message);
                            if (level == "error") info_error(message);
                        }
                    }
                };
                /**
                 * @function
                 * @static
                 * @name LOG_USER
                 * @description This action LOGS the specified message in the user_XXX interface specified.
                 * @memberof enioka.rules.actions
                 * @param {enioka.rules.RuleContext} context - the context to be used in the rule implementation
                 * @param {enioka.rules.RuleAction} action - the action object passed to the rule
                 * @param {enioka.rules.Rule} rule - the current scanned rule passed
                 */
                this.actionHandlers.LOG_USER = function(context, action, rule) {
                    if (getRuleElementType(action) == "LOG_USER") {
                        var message = context.getEngine()._getMessage(context, action) ;
                        var level = context.getValue(getRuleElementAttribute(action,"level"));
                        if ((level == null) || (level = "")) level="debug";
                        if (message) {
                            if (level == "debug") user_debug(message);
                            if (level == "warn") user_warn(message);
                            if (level == "error") user_error(message);
                        }
                    }
                };
                /**
                 * @function
                 * @static
                 * @name SET
                 * @description This action SETS the specified path to the specified value.
                 * @memberof enioka.rules.actions
                 * @param {enioka.rules.RuleContext} context - the context to be used in the rule implementation
                 * @param {enioka.rules.RuleAction} action - the action object passed to the rule
                 * @param {enioka.rules.Rule} rule - the current scanned rule passed
                 */
                /**
                 * @function
                 * @static
                 * @name ADD
                 * @description This action ADDS the specified path to the specified value.
                 * @memberof enioka.rules.actions
                 * @param {enioka.rules.RuleContext} context - the context to be used in the rule implementation
                 * @param {enioka.rules.RuleAction} action - the action object passed to the rule
                 * @param {enioka.rules.Rule} rule - the current scanned rule passed
                 */
                /**
                 * @function
                 * @static
                 * @name CLEAR
                 * @description This action CLEARS the specified path.
                 * @memberof enioka.rules.actions
                 * @param {enioka.rules.RuleContext} context - the context to be used in the rule implementation
                 * @param {enioka.rules.RuleAction} action - the action object passed to the rule
                 * @param {enioka.rules.Rule} rule - the current scanned rule passed
                 */
                var assignHandler = function (context, action, rule) {
                    if ((getRuleElementType(action) == "SET") || (getRuleElementType(action) == "ADD") || (getRuleElementType(action) == "CLEAR")) {
                        var attributes = getRuleElementAttributes(action);
                        var prefix = null;
                        if (hasRuleElementAttribute(action,"prefix")) {
                            prefix = getRuleElementAttribute(action,"prefix");
                            if (prefix.charAt(0)=='.') {
                                prefix = rule.getPrefix() + prefix;
                            }
                        } else {
                            prefix = rule.getPrefix();
                        }
                        if (prefix !="") {
                            prefix=prefix+".";
                        }
                        for (var i=0; i<attributes.length;i++)  {
                            var attributePath = attributes[i];
                            if (attributePath=="prefix") {
                                continue;
                            }
                            var attributeValue = getRuleElementAttribute(action,attributePath);
                            var value = context.getValue(attributeValue);
                            if (getRuleElementType(action) == "CLEAR") {
                                attributePath = prefix + attributePath;
                                context.setValue(attributePath,null);
                            }
                            if (value) {
                                if (getRuleElementType(action) == "SET") {
                                    attributePath = prefix + attributePath;
                                    context.setValue(attributePath,value);
                                }
                                if (getRuleElementType(action) == "ADD") {
                                    attributePath = prefix + attributePath;
                                    context.addValue(attributePath,value);
                                }
                            }
                        }
                    }
                };
                this.actionHandlers.SET = assignHandler;
                this.actionHandlers.ADD = assignHandler;
                this.actionHandlers.CLEAR = assignHandler;

                /**
                 * @function
                 * @static
                 * @name SET_TEXT
                 * @description This action SETS the specified path to the specified text.
                 * @memberof enioka.rules.actions
                 * @param {enioka.rules.RuleContext} context - the context to be used in the rule implementation
                 * @param {enioka.rules.RuleAction} action - the action object passed to the rule
                 * @param {enioka.rules.Rule} rule - the current scanned rule passed
                 */
                /**
                 * @function
                 * @static
                 * @name ADD_TEXT
                 * @description This action ADDS to the specified path the specified text.
                 * @memberof enioka.rules.actions
                 * @param {enioka.rules.RuleContext} context - the context to be used in the rule implementation
                 * @param {enioka.rules.RuleAction} action - the action object passed to the rule
                 * @param {enioka.rules.Rule} rule - the current scanned rule passed
                 */
                var textAssignHandler = function (context, action, rule) {
                    if ((getRuleElementType(action) == "SET_TEXT") || (getRuleElementType(action) == "ADD_TEXT")) {
                        var path = context.getValue(getRuleElementAttribute(action,"path"));
                        if (path){
                            var prefix = null;
                            if (hasRuleElementAttribute(action,"prefix")) {
                                prefix = getRuleElementAttribute(action,"prefix");
                                if (prefix.charAt(0)=='.') {
                                    prefix = rule.getPrefix() + prefix;
                                }
                            } else {
                                prefix = rule.getPrefix();
                            }
                            if (prefix !="") {
                                prefix=prefix+".";
                            }
                            path = prefix + path;
                            var value = null;
                            if (action.childNodes) {
                                for (var i =0 ; i< action.childNodes.length; i++) {
                                    var child = action.childNodes[i];
                                    if (child.nodeType == child.CDATA_SECTION_NODE) {
                                        if (value == null) value = child.data;
                                        else value = value + child.data;
                                    }
                                }
                                if (value == null)
                                for (var i =0 ; i< action.childNodes.length; i++) {
                                    var child = action.childNodes[i];
                                    if (child.nodeType == child.TEXT_NODE) {
                                        if (value == null) value = child.data;
                                        else value = value + child.data;
                                    }
                                }
                            }
                            if (action.text) {
                                value = action.text;
                            }
                            if (value) {
                                if (getRuleElementType(action) == "SET_TEXT") {
                                    context.setValue(path,value);
                                }
                                if (getRuleElementType(action) == "ADD_TEXT") {
                                    context.addValue(path,value);
                                }
                            }
                        }
                    }
                };
                this.actionHandlers.SET_TEXT = textAssignHandler;
                this.actionHandlers.ADD_TEXT = textAssignHandler;

                /**
                 * @function
                 * @static
                 * @name DSET
                 * @description This action SETS the dynamic specified path to the specified value.
                 * @memberof enioka.rules.actions
                 * @param {enioka.rules.RuleContext} context - the context to be used in the rule implementation
                 * @param {enioka.rules.RuleAction} action - the action object passed to the rule
                 * @param {enioka.rules.Rule} rule - the current scanned rule passed
                 */
                /**
                 * @function
                 * @static
                 * @name DADD
                 * @description This action ADDS the dynamic specified path to the specified value.
                 * @memberof enioka.rules.actions
                 * @param {enioka.rules.RuleContext} context - the context to be used in the rule implementation
                 * @param {enioka.rules.RuleAction} action - the action object passed to the rule
                 * @param {enioka.rules.Rule} rule - the current scanned rule passed
                 */
                /**
                 * @function
                 * @static
                 * @name DCLEAR
                 * @description This action CLEARS the dynamic specified path.
                 * @memberof enioka.rules.actions
                 * @param {enioka.rules.RuleContext} context - the context to be used in the rule implementation
                 * @param {enioka.rules.RuleAction} action - the action object passed to the rule
                 * @param {enioka.rules.Rule} rule - the current scanned rule passed
                 */
                 var dassignHandler = function (context, action, rule) {
                    if ((getRuleElementType(action) == "DSET") || (getRuleElementType(action) == "DADD") || (getRuleElementType(action) == "DCLEAR")) {
                        var path = context.getValue(getRuleElementAttribute(action,"path"));
                        if (path){
                            var prefix = null;
                            if (hasRuleElementAttribute(action,"prefix")) {
                                prefix = getRuleElementAttribute(action,"prefix");
                                if (prefix.charAt(0)=='.') {
                                    prefix = rule.getPrefix() + prefix;
                                }
                            } else {
                                prefix = rule.getPrefix();
                            }
                            if (prefix !="") {
                                prefix=prefix+".";
                            }
                            path = prefix + path;
                            if (getRuleElementType(action) == "DCLEAR") {
                                context.setValue(path,null);
                                return;
                            }
                            var value = context.getValue(getRuleElementAttribute(action,"value"));
                            if (value) {
                                if (getRuleElementType(action) == "DSET") {
                                    context.setValue(path,value);
                                }
                                if (getRuleElementType(action) == "DADD") {
                                    context.addValue(path,value);
                                }
                            }
                        }
                    }
                };
                this.actionHandlers.DSET = dassignHandler;
                this.actionHandlers.DADD = dassignHandler;
                this.actionHandlers.DCLEAR = dassignHandler;
                
                /**
                 * @function
                 * @static
                 * @name SET_OBJECT
                 * @description This action SETS the specified path to the specified object with the specified object attributes.
                 * @memberof enioka.rules.actions
                 * @param {enioka.rules.RuleContext} context - the context to be used in the rule implementation
                 * @param {enioka.rules.RuleAction} action - the action object passed to the rule
                 * @param {enioka.rules.Rule} rule - the current scanned rule passed
                 */
                /**
                 * @function
                 * @static
                 * @name ADD_OBJECT
                 * @description This action ADDS to the specified path the specified object with the specified object attributes.
                 * @memberof enioka.rules.actions
                 * @param {enioka.rules.RuleContext} context - the context to be used in the rule implementation
                 * @param {enioka.rules.RuleAction} action - the action object passed to the rule
                 * @param {enioka.rules.Rule} rule - the current scanned rule passed
                 */
                var objectHandler = function (context, action, rule) {
                    if ((getRuleElementType(action) == "SET_OBJECT") || (getRuleElementType(action) == "ADD_OBJECT")) {
                        var attributes = getRuleElementAttributes(action);
                        var path = context.getValue(getRuleElementAttribute(action,"path"));
                        if (path){
                            var prefix = null;
                            if (hasRuleElementAttribute(action,"prefix")) {
                                prefix = getRuleElementAttribute(action,"prefix");
                                if (prefix.charAt(0)=='.') {
                                    prefix = rule.getPrefix() + prefix;
                                }
                            } else {
                                prefix = rule.getPrefix();
                            }
                            if (prefix !="") {
                                prefix=prefix+".";
                            }
                            path = prefix + path;
                            var object={};
                            for (var i=0; i<attributes.length;i++)  {
                                var attributePath = attributes[i];
                                if (attributePath=="prefix") {
                                    continue;
                                }
                                if (attributePath=="path") {
                                    continue;
                                }
                                var attributeValue = getRuleElementAttribute(action,attributePath);
                                var value = context.getValue(attributeValue);
                                if (value) {
                                    object[attributePath] = value;
                                }
                            }
                            if (getRuleElementType(action) == "SET_OBJECT") {
                                var objects = context.getValue("$"+path);
                                if (objects && (objects.constructor == Array)) {
                                    if (object.id) {
                                        var found=false;
                                        for (var i=0; i< objects.length; i++) {
                                            if (objects[i] && objects[i].id && (objects[i].id == object.id)) {
                                                found = true;
                                                for (var name in object) {
                                                    if (object.hasOwnProperty(name)) {
                                                        objects[i][name] = object[name];
                                                    }
                                                }
                                            }
                                        }
                                        if (!found) {
                                            objects.push(object);
                                        }
                                    } else {
                                        info_error("Cannot set an object in an array without an id", object);
                                    }
                                } else {
                                    // If ids are involved, use id as a mean to merge information or replace it
                                    if (objects && objects.id && object.id) {
                                        // If there is an object there of same id, then just update it
                                        if (objects.id == object.id) {
                                            found = true;
                                            for (var name in object) {
                                                if (object.hasOwnProperty(name)) {
                                                    objects[name] = object[name];
                                                }
                                            }
                                        } else { // Else just replace "stupidly"
                                            context.setValue(path,object);                                    
                                        }
                                    } else { // Else just replace "stupidly"
                                        context.setValue(path,object);                                    
                                    }
                                }
                            }
                            if (getRuleElementType(action) == "ADD_OBJECT") {
                                var objects = context.getValue("$"+path);
                                if (objects) {
                                    if (object.id) {
                                        var found=false;
                                        for (var i=0; i< objects.length; i++) {
                                            // if an object of same id exists, add/replace information of this object
                                            if (objects[i] && objects[i].id && (objects[i].id == object.id)) {
                                                found = true;
                                                for (var name in object) {
                                                    if (object.hasOwnProperty(name)) {
                                                        objects[i][name] = object[name];
                                                    }
                                                }
                                            }
                                        }
                                        if (!found) {
                                            objects.push(object);
                                        }                                        
                                    } else {
                                        objects.push(object);
                                    }
                                } else {
                                    context.setValue(path,[object]);
                                }
                            }
                        }
                    }
                };
                this.actionHandlers.SET_OBJECT = objectHandler;
                this.actionHandlers.ADD_OBJECT = objectHandler;

                /**
                 * @function
                 * @static
                 * @name CONTROL
                 * @description This action CONTROLS the engine, by executing the specified action and priority.
                 * @memberof enioka.rules.actions
                 * @param {enioka.rules.RuleContext} context - the context to be used in the rule implementation
                 * @param {enioka.rules.RuleAction} action - the action object passed to the rule
                 * @param {enioka.rules.Rule} rule - the current scanned rule passed
                 */
                this.actionHandlers.CONTROL = function (context, action, rule) {
                    if (getRuleElementType(action) == "CONTROL") {
                        var control = context.getValue(getRuleElementAttribute(action,"action"));
                        if (control) {
                            context.control = control;
                            var priority = context.getValue(getRuleElementAttribute(action,"priority"));
                            if (priority) context.priority = priority;
                        }
                    }
                };

                /**
                 * @function
                 * @static
                 * @name RECURSE
                 * @description This action launches a new loop for the engine with all the data of the current context.
                 * @memberof enioka.rules.actions
                 * @param {enioka.rules.RuleContext} context - the context to be used in the rule implementation
                 * @param {enioka.rules.RuleAction} action - the action object passed to the rule
                 * @param {enioka.rules.Rule} rule - the current scanned rule passed
                 */
                this.actionHandlers.RECURSE = function(context, action, rule) {
                    if (getRuleElementType(action) == "RECURSE") {
                        var engine = context.getEngine();
                        engine.run(context);
                    }
                };

                /**
                 * @function
                 * @static
                 * @name CHOOSE
                 * @description This action launches a new context for the engine on the current context populated
                 * with the values of the different actions embedded in this CHOOSE action.
                 * @memberof enioka.rules.actions
                 * @param {enioka.rules.RuleContext} context - the context to be used in the rule implementation
                 * @param {enioka.rules.RuleAction} action - the action object passed to the rule
                 * @param {enioka.rules.Rule} rule - the current scanned rule passed
                 */
                this.actionHandlers.CHOOSE = function(context,action, rule) {
                    if (getRuleElementType(action) == "CHOOSE") {
                        var attributes = getRuleElementAttributes(action);
                        for (var i=0; i<attributes.length;i++)  {
                            var attributePath = attributes[i];
                            if (attributePath=="prefix") {
                                continue;
                            }
                            var attributeValue = getRuleElementAttribute(action,attributePath);
                            var value = context.getValue(attributeValue);
                            if (value) {
                                if (value.length) {
                                    for (var j=0; j< value.length;j++) {
                                        var binding = value[j];
                                        context.setValue(attributePath, binding);
                                        var actions = action.childNodes;
                                        for (var k=0; k < actions.length; k++) {
                                            var son = actions[k];
                                            if (son == null) {
                                                continue;
                                            }
                                            context.fireAction(son, rule);
                                        }
                                        var engine = context.getEngine();
                                        engine.run(context);
                                    }
                                } else {
                                    info_debug("Warning : choice is singleton , not a list..." + value);
                                    var binding = value;
                                    context.setValue(attributePath, binding);
                                    var actions = action.childNodes;
                                    for (var k=0; k < actions.length; k++) {
                                        var son = actions[k];
                                        if (son == null) {
                                            continue;
                                        }
                                        context.fireAction(son, rule);
                                    }
                                }
                            } else {
                                info_debug("Warning : no choice available for : " + attributePath);
                            }
                        }
                    }
                };

                if (properties.actions) {
                    for (var key in properties.actions) {
                        if (properties.actions.hasOwnProperty(key)) {
                            this.actionHandlers[key] = properties.actions[key];
                        }
                    }
                }
            },

            // Internal method to score keys for the different rules
            // in order to sort the keys given the rules set
            _keyStatsOfRule : function(rule, keys, keysStats) {
                var keyCount = 0;
                var keyOffset = keys.length;
                var count = 1;
                var attributes = getRuleElementAttributes(rule.ruleXML);
                for (var i=0; i<attributes.length;i++)  {
                    var attributeName = attributes[i];
                    if (attributeName == "priority") continue;
                    if (attributeName == "prefix") continue;
                    if (keys.indexOf(attributeName) != -1) {
                        info_debug("Using a key condition twice in a rule hierarchy is not supported :" + attributeName, keys, keyOffset);
                        continue;
                    }
                    keyCount++;
                    keys.push(attributeName);
                }

                for (i=0;i<rule.rules.length;i++) {
                    count += this._keyStatsOfRule(rule.rules[i], keys, keysStats);
                }

                for (i=0; i< keyCount; i++) {
                    var key = keys[keyOffset+i];
                    var value = getRuleElementAttribute(rule.ruleXML, key);
                    if (!keysStats[key]) {
                        keysStats[key] = new Object();
                        keysStats[key]._count = count;
                    } else {
                        keysStats[key]._count = keysStats[key]._count + count;
                    }

                    if (keysStats[key][value]) {
                        keysStats[key][value] = keysStats[key][value] + count;
                    }
                    else {
                        keysStats[key][value] = count;
                    }
                }

                for (var i=0; i< keyCount; i++) {
                    keys.pop();
                }

                return count;
            },
            
            _parseRule : function(ruleXML, father) {
                var rule = new Rule(ruleXML, father, this.maxRuleID++);
                rule.rules = [];
                for (var i=0;i<rule.rulesXML.length;i++) {
                    rule.rules.push(this._parseRule(rule.rulesXML[i], rule));
                }
                return rule;
            },

            // Internal method to launch the indexing of all rules, by walking down
            // the tree of rules (may be flat)
            _indexRule : function(rule) {
                this.index.addRule(this.keys, 0, rule);
                for (var i=0;i<rule.rules.length;i++) {
                    this._indexRule(rule.rules[i]);
                }
            },
            
            nSpaces : function(i) {
                var nSpaces="";
                for (var j=0;j<i;j++) {
                    nSpaces=nSpaces + "   ";
                }
                return nSpaces;
            },
            
            rulesListString : function (rules) {
                var list = "["
                if (rules) {
                    for (var i=0;i<rules.length;i++) {
                        if (i>0) list=list+","; 
                        list=list+rules[i].id;
                    }
                }
                list = list+"]";
                return list;
            },
            
            printRulesOverview : function (rules) {
                console.log('Rules : ' + this.rulesListString(rules));
            },
            
            printRulesDetail : function (rules) {
                if (rules) {
                    for (var i=0;i<rules.length;i++) {
                        console.log(' - rule : ', rules[i] );
                    }
                }
            },
            
            printRulesIndex : function(index,i) {
                if (index) {
                    var nSpaces = this.nSpaces(i);
                    if (index.indexes) {
                        console.log(nSpaces + "key="+index.key+ ", rules="+this.rulesListString(index.rules));
                        for (var name in index.indexes) {
                            if (index.indexes.hasOwnProperty(name)) {
                                console.log(nSpaces + "..value="+name);
                                this.printRulesIndex(index.indexes[name],i+1);
                            }
                        }   
                        if (index.noKey) {
                            console.log(nSpaces + "..value=nokey");
                            this.printRulesIndex(index.noKey,i+1);
                        }
                    } else {
                        this.printRulesIndex(index.noKey,i+1);
                        if (index.rules && (index.rules.length > 0)) {
                            console.log(nSpaces + " rules=" + this.rulesListString(index.rules));
                        }
                    }
                }
            },
            
            showRule : function (rule) {
                console.log(rule);
            },
            
            showRules : function (rules) {
                for (var i=0; i< rules.length; i++) {
                    this.showRule(rules[i]);
                }
            },

            // For the moment, only the internal run function of the engine
            // but may be an entry point for more advanced uses eventually
            run : function (context) {
                context.setEngine(this);
                var rules = new Array();
                
                // First use index to get the set of rules candidate for execution
                this.index.getRules(context, this.keys, 0, rules);
                
                // Then find the highest priority rule
                var maxPriority = Number.NEGATIVE_INFINITY;
                for (var i = 0 ; i < rules.length; i++) {
                    var priority = rules[i].getPriority();
                    if (maxPriority < priority)
                        maxPriority = priority;
                }
                var firstMaxPriority = maxPriority;

                // All priorities will be scanned in descending order (unless restart)
                while (maxPriority > Number.NEGATIVE_INFINITY) {
                    var nextPriority = Number.NEGATIVE_INFINITY;
//                    info_debug("Processing rules of priority " + maxPriority);

                    // All rules will be scanned, but only those with current priority
                    // will be scanned at each step.
                    for (var i = 0 ; i < rules.length; i++) {
                        var rule = rules[i];
                        var priority = rule.getPriority();
                        if ((priority < maxPriority) && (priority > nextPriority))
                            nextPriority = priority;

                        if (context.control == "nextPriority") {
                            continue;
                        }
                        if (priority == maxPriority) {
                            rule.process(context);
                            if (context.control == "end") {
                                return context.values.result;
                            }
                            if (context.control == "abort") {
                                return null;
                            }
                        }
                    }
                    if (context.control == "nextPriority") {
                        maxPriority = nextPriority;
                        context.control = "continue";
                        continue;
                    }
                    if (context.control == "endPriority") {
                        return context.result;
                    }
                    if (context.control == "restart") {
                        context.control = "continue";
                        maxPriority = firstMaxPriority;
                        rules = new Array();
                        this.index.getRules(context, rules);
                        continue;
                    }
                    if (context.control == "setPriority") {
                        context.control = "continue";
                        if (context.priority) {
                            maxPriority = context.priority;
                        } else {
                            maxPriority = nextPriority;
                        }
                    }
                    else {
                        context.control = "continue";
                        maxPriority = nextPriority;
                    }
                }
                return context.getValue("$result");
            },

            /**
             * @instance
             * The actual (only) entry point to the engine.
             * @param context The context to use to apply the rules
             * @return The context "result", ie whatever has been created by the rules
             * under the "result" access path, whatever it is.
             */
            applyRules : function (context) {
                context = new RuleContext(context);

                return this.run(context);
            }
        };
        RuleEngine = Class.create(RuleEngine);

        /**
         * @memberof enioka.rules
         * @class
         * @implements {enioka.rules.IRuleFact}
         * @classdesc
         * Core wrapper class for input facts when "internal representation is to be used".
         * <br/> <br/>
         * This class is for internal facts.
         * @description The constructor takes a raw object as an input and copies over all of its
         * own properties.
         * @param {object} properties - the raw object to use to set attributes of fact
         */
        var RuleFact = {
            initialize : function(properties) {
                for (var name in properties) {
                    if (properties.hasOwnProperty(name)) {
                        this[name] = properties[name];
                    }
                }
            },
        };
        RuleFact = Class.create(IRuleFact, RuleFact);

        /**
         * @memberof enioka.rules
         * @class
         * @extends enioka.rules.RuleFact
         * @implements enioka.rules.IRuleFact
         * @classdesc
         * Core wrapper class for input facts when "internal representation is to be used".
         * This class is for default external facts.
         * @param object
         * @param path
         * @param context
         * @param father
         */
        var RuleExternalObject = {

            initialize : function(object, path, context, father) {
                this.object = object;
            },

            /**
             * @instance
             * @override
             */
            getAttributeValue : function (attribute) {
                if (this.object) {
                    if (this.object.getAttributeValue) {
                        return this.object.getAttributeValue(attribute);
                    }
                    else {
                        info_debug('This object is not accessible by the rule engine ' , this.object);
                        return null;
                    }
                }
                else {
                    return this.object;
                }
            },

            /**
             * @instance
             * @override
             */
            setAttributeValue : function (attribute,value) {
                if (this.object) {
                    if (this.object.setAttributeValue) {
                        return this.object.setAttributeValue(attribute,value);
                    }
                    else {
                        info_debug('This object cannot be modified by the rule engine ' , this.object);
                        return null;
                    }
                }
                else {
                    return this.object;
                }
            },

            /**
             * @instance
             * @override
             */
            addAttributeValue : function (attribute,value) {
                if (this.object) {
                    if (this.object.addAttributeValue) {
                        return this.object.addAttributeValue(attribute,value);
                    } else {
                        info_debug('This object cannot be modified by the rule engine ' , this.object);
                        return null;
                    }
                } else {
                    return this.object;
                }
            }
        };
        RuleExternalObject = Class.extend(RuleFact, RuleExternalObject);

        /**
         * @memberof enioka.rules
         * @class
         * @extends enioka.rules.RuleFact
         * @implements enioka.rules.IRuleFact
         * @classdesc
         * This class is for facts created by the engine.
         */
        var RuleResult = {

            // For backward compatibility temporary
            // to remove when backport is over to new rule engine
            getAttribute : function (attribute) {
                return this[attribute];
            },

            getElementsByTagName : function (tag) {
                return [this];
            }

        };
        RuleResult = Class.extend(RuleFact, RuleResult);

        // Eventually expose a (very) limited interface
        // Rule Engine for starting it all and executing engine
        eniokarules.RuleEngine = RuleEngine;

        // Exposed only for tests purposes
        eniokarules.RuleContext = RuleContext;

        // Three predefined classes as portential wrappers to derive from
        /**
         * @member
         * @memberof enioka.rules
         * @description provides access to this class {@link enioka.rules.RuleFact} to derive from.
         */
        eniokarules.RuleFact = RuleFact;
        /**
         * @member
         * @memberof enioka.rules
         * @description provides access to this class {@link enioka.rules.RuleExternalObject} to derive from.
         */
        eniokarules.RuleExternalObject = RuleExternalObject;
        /**
         * @member
         * @memberof enioka.rules
         * @description provides access to this class {@link enioka.rules.RuleResult} to derive from.
         */
        eniokarules.RuleResult = RuleResult;

        // And the capability to extend these predefined classes
        /**
         * @function
         * @memberof enioka.rules
         * @description use this method to subclass a builtin class to subclass from
         * @param fatherClass : class to derive from
         * @param functions : set of functions in an object to use as methods for the son class
         * @returns the resulting class object to use to build objects.
         */
        eniokarules.extend = Class.extend;

        // That's all
        return eniokarules;
    }
    (enioka.rules || {})
);
