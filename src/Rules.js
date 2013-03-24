// Copyright 2012 enioka. All rights reserved
// Distributed under the GNU LESSER GENERAL PUBLIC LICENSE V3
// Except the Class implementation distributed under the new BSD licence
// Authors: Jean-Christophe Ferry (jean-christophe.ferry@enioka.com)

/**
 * @namespace enioka
 * @see <a href="http://www.enioka.com"/> enioka </a>
 */
var enioka = (enioka || {});

/**
 * @namespace enioka.rules
 * @description enioka javascript rule engine <br/>
 * Distributed under the GNU LESSER GENERAL PUBLIC LICENSE V3 <br/>
 * Except the Class implementation distributed under the new BSD licence
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

        // finally remap Class.create for backward compatability with prototype
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

        var RuleContext = {
            /**
             * @class
             * The Rule Context class
             * <br/>
             * <br/>
             * The Rule Context is the way through which the engine holds grip on objects
             * on which it performs its reasoning. It holds also the required cache for efficient
             * data access.
             * <br/>
             * <br/>
             * This class is not directly exposed in the API. It is used internally by the engine.
             * A rule context is allocated for each call of the engine and holds the
             * grip on all variables on which the engine will apply rules
             * <br/>
             * <br/>
             * For more advanced uses, one may need to access and manipulate this
             * context from the outside. Still, this is a bad idea for the moment
             * since this object holds whatever "cache" is needed to  assess
             * rule conditions efficiently. Hence direct access to this context should
             * not be granted for the moment explicitely.
             * @constructs
             * @param properties The properties is the 'flat' Object to be passed over to the engine.\n
             * Its attributes will be the names that will be used to access objects of the world.\n
             *
             * This may not be a flat object and be a custom class. This is possible as long
             * as this object has a "defaultWrapper" attribute holding a default wrapper to use to access its
             * contents.\n
             *
             * If the object is actually flat, it will be wrapped by a built in wrapper, {@link enioka.rules-RuleFact}.

             *
             */
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
             * This method checks that a given condition is true or false in the current context
             * As explained in the general documentation, a number of predefined conditions exist
             * but it may be extended at will with specific condition handlers supplied at the
             * creation of the engine.
             *
             * Predefined conditions are :
             * * LESS or <
             * * MORE or >
             * * LIKE
             * * EQUAL
             * * INTERSECTS
             *
             * Elementary conditions can then be used in combinations
             * * NOT
             * * OR
             * * AND
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
             * This method executes a given action in the current context
             * As explained in the general documentation, a number of predefined actions exist
             * but it may be extended at will with specific action handlers supplied at the
             * creation of the engine.
             *
             * Predefined actions are available to produce results or act on the objects :
             * * SET
             * * DSET
             * * ADD
             * * DADD
             *
             * Other actions make possible some control over the execution of the engine
             * * CONTROL
             * * RECURSE
             * * CHOOSE
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
             * Gets the engine associated to this context.
             */
            getEngine : function() {
                return this.engine;
            },

            /**
             * Sets the engine associated to this context.
             */
            setEngine : function(engine) {
                return this.engine = engine;
            },

            /**
             * Default wrapper to objects of the world
             * @private
             */
            _defaultWrapper : function(object, path, context, father) {
                return new RuleExternalObject(object, path, context, father);
            },

            /**
             * During evaluation, rules may be nested. Their conditions are
             * evaluated once only and then cached (unless a recurse or choose
             * control invalidates it)
             */
            clearRulesEvalCache : function() {
                this.rulesEvalCache = new Object();
            },

            /**
             * Checks if a rule has been evaluated already
             */
            hasRuleEval : function (rule) {
                return (typeof(this.rulesEvalCache[rule]) !== 'undefined');
            },

            /**
             * Retrieves cached rule's evaluation
             */
            getRuleEval : function (rule) {
                return this.rulesEvalCache[rule.id];
            },

            /**
             * Sets cached rule's evaluation
             */
            setRuleEval : function (rule, match) {
                return this.rulesEvalCache[rule.id]=match;
            },

            /**
             * Wraps an object along its access path, so that this object
             * can be used in object traversal as well. This wrapping mechanism
             * is quite extensible for a smooth integration with native objects
             * of the application, whatever they are and without modification
             */
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
            },

            /**
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
             * Internal function that extracts last element of the path considered as (generalized) attribute
             * @private
             */
            _getPathAttribute : function(path) {
                var i = path.lastIndexOf(".");
                return path.substring(i+1);
            },

            /**
             *  Internal function to extract an expression with an offset in a value string
             * @private
             */
            _getExpressionIndex : function(expression, start) {
                var i=start+1;
                var level = 0;
                var inString = false;
                while ((i < expression.length) && ((expression.charAt(i) != ')') || (level > 0))) {
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
                if ((i > expression.length) || (expression.charAt(i) != ')') || inString) {
                    info_debug("Syntax error in expression ", expression);
                    return -1;
                }
                else {
                    return i;
                }
            },

            /**
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
             * General entry point in charge of retrieving a value from a path or an expression <br/>
             * <br/>
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
             * General entry point to set a value to a path
             */
            setValue : function(path,value) {
                if (!path) return null;
                var object = this._getPathObject(path,true);
                var attribute = this._getPathAttribute(path);
                return object.setAttributeValue(attribute,value);
            },

            /**
             * General entry point to add a value to a path
             * It is not the same as previous  it will force specified path to be an array of values
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
            getAttributeValue : function (attribute) {
                return this.values[attribute];
            },

            setAttributeValue : function (attribute,value) {
                return this.values[attribute] = value;
            },

            addAttributeValue : function (attribute,value) {
                return this.values[attribute] = value;
            }
        };
        RuleContext = Class.create(RuleContext);

        var Rule = {
            /**
             * @class
             * This class represents the rules objects of the engine. These objects are directly mapped
             * against their XML source, without (for the moment) compilation to an alternative form
             * more efficient or convenient for execution. <br/>
             * <br/>
             * This class is not exposed either to the client API. It is only "seen" from the client
             * application as an XML object that customizes the behaviour of the engine in a
             * "declarative" form. <br/>
             *
             * @constructs
             * @description This this takes an XML source code rule and registers "fast" access to the conditions
             * actions and subrules. It does propagate the rule creation to embedded rules as well.
             * See Rule syntax in documentation for further information on rule syntax.
             * @param ruleXML The source code for the rule as an XML object
             * @param father The embedding father rule if any (as an object)
             * @param id The unique id allocated to identify this rule (integer counter).
             */
            initialize : function(ruleXML, father, id) {
                info_debug('Creating rule ', id , ruleXML);
                this.id = id;
                this.ruleXML = ruleXML;
                this.conditionsXML = new Array();
                getMatchingTags(ruleXML,"IF/*", this.conditionsXML);

                this.actionsXML = new Array();
                getMatchingTags(ruleXML,"THEN/*", this.actionsXML);

                this.rulesXML = new Array();
                getMatchingTags(ruleXML,"RULE", this.rulesXML);

                // Small shortcut for those who don't like verbose syntax
                // Any element that is not a condition nor a rule nor an explicit THEN is an action
                var sons = ruleXML.childNodes;
                for (var i=0; i<sons.length; i++) {
                    var son = sons.item(i);
                    if (son.nodeType !== 1) {
                        continue;
                    }
                    if ((son.tagName != "IF") && (son.tagName != "THEN") && (son.tagName != "RULE")) {
                        this.actionsXML.push(son);
                    }
                }
                this.father = father;
            },

            /**
             * @return A boolean indicating whether the specified rule has
             * an "optimized" condition with this access key condition
             * @param key The key (access path) that will be used
             */
            hasKey : function(key) {
                var hasKey = this.ruleXML.hasAttribute(key);
                if (hasKey)
                    return hasKey;
                if (!this.father)
                    return false;
                return this.father.hasKey(key);
            },

            /**
             * @return The key value for the optimized key condition to be met
             * for this rule to fire. For a compiled condition, it MUST be a constant.
             * @param key The key (access path) that will be used
             */
            getKey : function(key) {
                var hasKey = this.ruleXML.hasAttribute(key);
                if (hasKey)
                    return this.ruleXML.getAttribute(key);
                if (!this.father)
                    return null;
                return this.father.getKey(key);
            },

            /**
             * @return true if a given rule has its preconditions verified in the
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
             * Executes the actions of the specified rule on the provided context
             * @param context The context in which to evaluate the conditions of the rule
             */
            fires : function(context) {
                for (var i=0; i<this.actionsXML.length; i++) {
                    var actionXML = this.actionsXML[i];
                    context.fireAction(actionXML, this);
                }
            },

            /**
             * Scans and if applicable executes the specified rule on the provided context
             * @param context The context on which to apply the rule
             */
            process : function(context) {
                if (this.matches(context)) {
                    this.fires(context);
                }
            },

            /**
             * @return The priority of the rule, as its own
             * or the priority of its embedding rule if any
             */
            getPriority : function() {
                if (this.ruleXML.hasAttribute("priority"))
                    return this.ruleXML.getAttribute("priority");
                else
                    if (this.father)
                        return this.father.getPriority();
                else
                    return 0;
            },

            /**
             * @return The prefeix of the rule, as its own
             * or the prefix of its embedding rule if any, possibly combined with its own
             * if the rule own prefix starts with ".". The prefix is used in rules to
             * "prefix" access path of deduced facts.
             */
            getPrefix : function() {
                if (this.ruleXML.hasAttribute("prefix")) {
                    var prefix = this.ruleXML.getAttribute("prefix");
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

        var RuleIndex = {
            /**
             * @class
             * This class provides the core mechanism for efficiently indexing rules by their
             * use of optimized conditions. When an optimized condition is used of the form key=value
             * all rules that reference the value found in context for this key can be retrieved
             * efficiently without scanning all rules one by one.
             * <br/>
             * <br/>
             * This class is internal only.
             * <br/>
             * <br/>
             * This class coule be further enhanced to provide fast access to candidate rules beyond
             * optimized conditions only... (ultimately a "xrete" like network would be the solution).
             * Still this indexing technique as is is independent of worl values, which is a significant
             * benefit and drastically indexing work for each fact scanned, when they are submitted
             * one by one (or internally scanned through the CHOOSE operator).
             *
             * @constructs
             * @description Does not do a thing...
             */
            initialize : function() {
            },

            /**
             * This is the major algorithm to build the index of all rules. <br/>
             * The index is a recursive data structure that "points" to the matching rules.
             */
            addRule : function(keys, index, rule) {
                // Check if index tree is at a leaf
                if (index >= keys.length) {
                    // If so and there is no rule in this index, create an empty array
                    if (!this.rules) {
                        this.rules = new Array();
                    }
                    // Add the rule to the leaf index
                    this.rules.push(rule);
                    return;
                }
                else {
                    // Process next tree level
                    var key = keys[index];
                    this.key = key;
                    // Check if this rule actually has this key as an optimized condition
                    if (rule.hasKey(key)) {
                        // The rule does use this key
                        var value = rule.getKey(key);
                        // If no subindex, then allocate it
                        if (!this.indexes)
                            this.indexes = new Object();
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
             * Collect all rules that are a fit to the provided context
             * @param context The context to use for checking rules
             * @param keys The array of keys that structure the tree
             * @param index Current index in the keys array to process
             * @param rules The array of collected rules where each rule should be added
             */
            getRules : function(context, keys, index, rules) {
                if (index >= keys.length) {
                    if (this.rules) {
                        for (var i=0; i< this.rules.length; i++) {
                            rules.push(this.rules[i]);
                        }
                    }
                    return;
                } else {
                    if (context) {
                        var key = "$"+keys[index];
                        if (context.getValue(key)) {
                            var keyValue = context.getValue(key);
                            if (this.indexes && (this.indexes[keyValue])) {
                                this.indexes[keyValue].getRules(context,keys,index+1,rules);
                            }
                            if (this.noKey) {
                                this.noKey.getRules(context,keys,index+1,rules);
                            }
                        } else {
                            if (this.noKey) {
                                this.noKey.getRules(context,keys,index+1,rules);
                            }
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
            }

        };

        RuleIndex = Class.create(RuleIndex);

        var RuleEngine = {
            /**
             * @class
             * This class provides all access to the rule engine and its
             * associated functionality. Which is, by the way trivial: apply rules and return the
             * result created by the rules.
             * <br/>
             * <br/>
             * It has for the moment two main entry points:<br/>
             * - the constructor to initialize the rule engine with the rules<br/>
             * - the applyRules to apply the rules to a given context<br/>
             * @constructs
             * @description The constructor is in charge of building all data structures
             * from the specified rules and then make possible the use of the rules.
             * @param properties The elements to customize the engine. For the moment the
             * following attributes are supported : <br/>
             * - rules : the rules as an XML fragment <RULES> <RULE />* </RULES>  <br/>
             * - conditionHandlers : the conition handlers to extend core conditions defined <br/>
             * - actionHandlers : the action handlers to extend core actions defined <br/>
             * - functionHandlers : the function handlers to extend core functions defined <br/>
             */
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
            	
                if (properties.rulesXML) {
                    this.rulesXML = properties.rulesXML;
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

                this.maxRuleID = 0;

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
                        this._keyStatsOfRule(this.rulesXML[i], this.keys, this.keysStats);
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
                    this._indexRule(this.rulesXML[i], null);
                }

                info_debug("The engine has compiled all rules and indexed them against used keys : ", this);
            },


            getConditionHandler : function (condition) {
                return this.conditionHandlers[condition.tagName];
            },

            initConditionHandlers : function (properties) {
                this.conditionHandlers = new Object();
                this.conditionHandlers.AND = function(context,condition) {
                    if (condition.tagName == "AND") {
                        var conditions = condition.childNodes;
                        for (var i=0; i<conditions.length; i++) {
                            var son = conditions.item(i);
                            if (son.nodeType !== 1) {
                                continue;
                            }
                            if (!context.checkCondition(son)) return false;
                        }
                        return true;
                    }
                };
                this.conditionHandlers.NOT = function(context,condition) {
                    if (condition.tagName == "NOT") {
                        var conditions = condition.childNodes;
                        for (var i=0; i<conditions.length; i++) {
                            var son = conditions.item(i);
                            if (son.nodeType !== 1) {
                                continue;
                            }
                            if (context.checkCondition(son)) return false;
                        }
                        return true;
                    }
                };
                this.conditionHandlers.OR = function(context,condition) {
                    if (condition.tagName == "OR") {
                        var conditions = condition.childNodes;
                        for (var i=0; i<conditions.length; i++) {
                            var son = conditions.item(i);
                            if (son.nodeType !== 1) {
                                continue;
                            }
                            if (context.checkCondition(son)) return true;
                        }
                        return false;
                    }
                };
                this.conditionHandlers.MATCHES = function(context,condition) {
                    if (condition.tagName == "MATCHES") {
                        var attributes = condition.attributes;
                        for (var i=0; i<attributes.length;i++)  {
                            var attribute = attributes.item(i);
                            var attributePath = attribute.nodeName;
                            var value = context.getValue("$"+attributePath);
                            if (value) {
                                var attributeValue = action.getAttribute(attributePath);
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
                this.conditionHandlers.EQUALS = function(context,condition) {
                    if (condition.tagName == "EQUALS") {
                        var value1 = context.getValue(condition.getAttribute("value1"));
                        var value2 = context.getValue(condition.getAttribute("value2"));
                        return value1 == value2;
                    }
                };
                this.conditionHandlers.INTERSECTS = function(context,condition) {
                    if (condition.tagName == "INTERSECTS") {
                        var value1 = context.getValue(condition.getAttribute("value1"));
                        var value2 = context.getValue(condition.getAttribute("value2"));
                        return intersection(value1, value2);
                    }
                };
                this.conditionHandlers.LESS = function(context,condition) {
                    if (condition.tagName == "LESS") {
                        var value1 = context.getValue(condition.getAttribute("value1"));
                        var value2 = context.getValue(condition.getAttribute("value2"));
                        return value1 < value2;
                    }
                };
                this.conditionHandlers.MORE = function(context,condition) {
                    if (condition.tagName == "MORE") {
                        var value1 = context.getValue(condition.getAttribute("value1"));
                        var value2 = context.getValue(condition.getAttribute("value2"));
                        return value1 > value2;
                    }
                };
                this.conditionHandlers.LIKE = function(context,condition) {
                    if (condition.tagName == "LIKE") {
                        var value1 = context.getValue(condition.getAttribute("value1"));
                        var value2 = context.getValue(condition.getAttribute("value2"));
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
                this.functionHandlers.print = function(context, args) {
                    var result = "";
                    for (var i = 1; i < args.length; i++) {
                        result = result + args[i];
                    }
                    info_debug("PRINT [" + result + "]");
                    return result;
                };

                this.functionHandlers.catenate = function(context, args) {
                    var result = "";
                    for (var i = 1; i < args.length; i++) {
                        result = result + args[i];
                    }
                    return result;
                };

                this.functionHandlers.plus = function(context, args) {
                    var result = 0;
                    for (var i = 1; i < args.length; i++) {
                        result = result + parseFloat(args[i]);
                    }
                    return result;
                };

                this.functionHandlers.mul = function(context, args) {
                    var result = 1;
                    for (var i = 1; i < args.length; i++) {
                        result = result * parseFloat(args[i]);
                    }
                    return result;
                };

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
                return this.actionHandlers[action.tagName];
            },

            initActionHandlers : function (properties) {
                this.actionHandlers = new Object();
                this.actionHandlers.LOG = function(context, action, rule) {
                    if (action.tagName == "LOG") {
                        var message = context.getValue(action.getAttribute("message"));
                        if (message) {
                            info_debug(message);
                        }
                    }
                };

                var assignHandler = function (context, action, rule) {
                    if ((action.tagName == "SET") || (action.tagName == "ADD")) {
                        var attributes = action.attributes;
                        var prefix = null;
                        if (action.hasAttribute("prefix")) {
                            prefix = action.getAttribute("prefix");
                            if (prefix.charAt(0)=='.') {
                                prefix = rule.getPrefix() + prefix;
                            }
                        } else {
                            prefix = rule.getPrefix();
                        }
                        prefix=prefix+".";
                        for (var i=0; i<attributes.length;i++)  {
                            var attribute = attributes.item(i);
                            var attributePath = attribute.nodeName;
                            if (attributePath=="prefix") {
                                continue;
                            }
                            var attributeValue = action.getAttribute(attributePath);
                            var value = context.getValue(attributeValue);
                            if (value) {
                                if (action.tagName == "SET") {
                                    attributePath = prefix + attributePath;
                                    context.setValue(attributePath,value);
                                }
                                else {
                                    attributePath = prefix + attributePath;
                                    context.addValue(attributePath,value);
                                }
                            }
                        }
                    }
                };
                this.actionHandlers.SET = assignHandler;
                this.actionHandlers.ADD = assignHandler;
                
                var textAssignHandler = function (context, action, rule) {
                    if ((action.tagName == "SET_TEXT") || (action.tagName == "ADD_TEXT")) {
                        var path = context.getValue(action.getAttribute("path"));
                        if (path){
                            var prefix = null;
                            if (action.hasAttribute("prefix")) {
                                prefix = action.getAttribute("prefix");
                                if (prefix.charAt(0)=='.') {
                                    prefix = rule.getPrefix() + prefix;
                                }
                            } else {
                                prefix = rule.getPrefix();
                            }
                            prefix=prefix+".";
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
                            if (value) {
                                if (action.tagName == "SET_TEXT") {
                                    context.setValue(path,value);
                                }
                                else {
                                    context.addValue(path,value);
                                }
                            }
                        }
                    }
                };
                this.actionHandlers.SET_TEXT = textAssignHandler;
                this.actionHandlers.ADD_TEXT = textAssignHandler;

                var dassignHandler = function (context, action, rule) {
                    if ((action.tagName == "DSET") || (action.tagName == "DADD")) {
                        var path = context.getValue(action.getAttribute("path"));
                        if (path){
                            var prefix = null;
                            if (action.hasAttribute("prefix")) {
                                prefix = action.getAttribute("prefix");
                                if (prefix.charAt(0)=='.') {
                                    prefix = rule.getPrefix() + prefix;
                                }
                            } else {
                                prefix = rule.getPrefix();
                            }
                            prefix=prefix+".";
                            path = prefix + path;
                            var value = context.getValue(action.getAttribute("value"));
                            if (value) {
                                if (action.tagName == "DSET") {
                                    context.setValue(path,value);
                                }
                                else {
                                    context.addValue(path,value);
                                }
                            }
                        }
                    }
                };
                this.actionHandlers.DSET = dassignHandler;
                this.actionHandlers.DADD = dassignHandler;

                this.actionHandlers.CONTROL = function (context, action, rule) {
                    if (action.tagName == "CONTROL") {
                        var control = context.getValue(action.getAttribute("action"));
                        if (control) {
                            context.control = control;
                            var priority = context.getValue(action.getAttribute("priority"));
                            if (priority) context.priority = priority;
                        }
                    }
                };

                this.actionHandlers.RECURSE = function(context,action, rule) {
                    if (action.tagName == "RECURSE") {
                        var engine = context.getEngine();
                        engine.run(context);
                    }
                };

                this.actionHandlers.CHOOSE = function(context,action, rule) {
                    if (action.tagName == "CHOOSE") {
                        var attributes = action.attributes;
                        for (var i=0; i<attributes.length;i++)  {
                            var attribute = attributes.item(i);
                            var attributePath = attribute.nodeName;
                            if (attributePath=="prefix") {
                                continue;
                            }
                            var attributeValue = action.getAttribute(attributePath);
                            var value = context.getValue(attributeValue);
                            if (value) {
                                if (value.length) {
                                    for (var j=0; j< value.length;j++) {
                                        var binding = value[j];
                                        context.setValue(attributePath, binding);
                                        var actions = action.childNodes;
                                        for (var k=0; k < actions.length; k++) {
                                            var son = actions.item(k);
                                            if (son.nodeType !== 1) {
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
                                        var son = actions.item(k);
                                        if (son.nodeType !== 1) {
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
            _keyStatsOfRule : function(ruleXML, keys, keysStats) {
                var rulesXML = new Array();
                getMatchingTags(ruleXML,"RULE", rulesXML);
                var keyCount = 0;
                var keyOffset = keys.length;
                var count = 1;
                var attributes = ruleXML.attributes;
                for (var i=0; i<attributes.length;i++)  {
                    var attribute = attributes.item(i);
                    var attributeName = attribute.nodeName;
                    if (attributeName == "priority") continue;
                    if (attributeName == "prefix") continue;
                    if (keys.indexOf(attributeName) != -1) {
                        info_debug("Using a key condition twice in a rule hierarchy is not supported :" + attributeName, keys, keyOffset);
                        continue;
                    }
                    keyCount++;
                    keys.push(attributeName);
                }

                for (i=0;i<rulesXML.length;i++) {
                    count += this._keyStatsOfRule(rulesXML[i], keys, keysStats);
                }

                for (i=0; i< keyCount; i++) {
                    var key = keys[keyOffset+i];
                    var value = ruleXML.getAttribute(key);
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

            // Internal method to launch the indexing of all rules, by walking down
            // the tree of rules (may be flat)
            _indexRule : function(ruleXML, father) {
                var rule = new Rule(ruleXML, father, this.maxRuleID++);
                this.index.addRule(this.keys, 0, rule);
                for (var i=0;i<rule.rulesXML.length;i++) {
                    this._indexRule(rule.rulesXML[i], rule);
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
                    info_debug("Processing rules of priority " + maxPriority);

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

        var RuleFact = {
            /**
             * @class
             * Core wrapper class for input facts when "internal representation is to be used".
             * <br/> <br/>
             * Objects must , to be "accessible" by the rule engine, obey an API, which is rather
             * simple: get, set and add attribute value. If they do not support this access process, then
             * they must be "wrapped" by a wrapper object that will take care to make "as if" the
             * objects did indeed follow this API.
             * <br/> <br/>
             * 3 built in wrappers are provided : <br/>
             * - simple "internal" class to represent facts if not specified by client application <br/>
             * - simple "external" class to represent facts provided by client applications, without
             * knowing exactlty what they are <br/>
             * - simple "result" class to represent info produced by default by the engine and to be
             * used by client applications as a default to retrieve "results" returned by the engine
             * <br/> <br/>
             * This class is for internal facts.
             * @constructs
             */
            initialize : function(properties) {
                for (var name in properties) {
                    if (properties.hasOwnProperty(name)) {
                        this[name] = properties[name];
                    }
                }
            },

            /**
             * Gets the value of the specified attribute
             * @param attribute The name of the attribute
             */
            getAttributeValue : function (attribute) {
                return this[attribute];
            },

            /**
             * Sets the value of the specified attribute with
             * specified value.
             * @param attribute The name of the attribute
             * @param value The value to set to the attribute
             */
            setAttributeValue : function (attribute,value) {
                return this[attribute] = value;
            },

            /**
             * Sets the value of the specified attribute with
             * specified value.
             * @param attribute the name of the attribute
             * @param value the value to set to the attribute
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
             * Wraps object accessible through this path. If provided,
             * this method will either create a wrapper object or return the object itself
             * if this object has no need to be wrapped at all
             * @param object The object to wrap
             * @param path The current access path to this object
             * @param context The context in which access is performed, useful to retrieve
             * initial context information useful to actually access to the object data
             * @param father The object from which one tries to access this very object
             */
            wrapObject: function (object, path, context, father) {
                return this;
            }
        };

        RuleFact = Class.create(RuleFact);


        var RuleExternalObject = {
            /**
             * @class
             * Core wrapper class for input facts when "internal representation is to be used".
             * <br/>
             * <br/>
             * Objects must, to be "accessible" by the rule engine, obey an API, which is rather
             * simple: get, set and add attribute value. If they do not support this access process, then
             * they must be "wrapped" by a wrapper object that will take care to make "as if" the
             * objects did indeed follow this API.
             * <br/>
             * <br/>
             * 3 built-in wrappers are provided: <br/>
             * - simple "internal" class to represent facts if not specified by client application <br/>
             * - simple "external" class to represent facts provided by client applications, without
             * knowing exactlty what they are <br/>
             * - simple "result" class to represent info produced by default by the engine and to be
             * used by client applications as a default to retrieve "results" returned by the engine
             * <br/>
             * <br/>
             * This class is for default external facts.
             * @constructs
             * @param object
             * @param path
             * @param context
             * @param father
             */
            initialize : function(object, path, context, father) {
                this.object = object;
            },

            /**
             *
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
             *
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
             *
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
         * @class
         * Objects must , to be "accessible" by the rule engine, obey an API, which is rather
         * simple : get, set and add attribute value. If they do not support this access process, then
         * they must be "wrapped" by a wrapper object that will take care to make "as if" the
         * objects did indeed follow this API.
         * <br/>
         * <br/>
         * 3 built in wrappers are provided :
         * - simple "internal" class to represent facts if not specified by client application <br/>
         * - simple "external" class to represent facts provided by client applications, without
         * knowing exactlty what they are  <br/>
         * - simple "result" class to represent info produced by default by the engine and to be
         * used by client applications as a default to retrieve "results" returned by the engine
         * <br/>
         * <br/>
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

        RuleResult = Class.extend(RuleFact,
                                  RuleResult);

        // Eventually expose a (very) limited interface
        // Rule Engine for starting it all and executing engine
        eniokarules.RuleEngine = RuleEngine;
        
        // Exposed only for tests purposes
        eniokarules.RuleContext = RuleContext;

        // Three predefined classes as portential wrappers to derive from
        eniokarules.RuleFact = RuleFact;
        eniokarules.RuleExternalObject = RuleExternalObject;
        eniokarules.RuleResult = RuleResult;

        // And the capability to extend these predefined classes
        eniokarules.extend = Class.extend;

        // That's all
        return eniokarules;
    }
    (enioka.rules || {})
);
