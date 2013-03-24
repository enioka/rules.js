Introduction
============

This small documentation is an early documentation for Rules.js, for first kick start. Will need more for actual use by 
developpers...

The Rules.js is a small footprint engine that makes possible to infer new "facts", based on "rules" and existing "facts".
The purpose of this engine is to have the capability to manipulate native application objects with no needs to generate
separate objects as facts for the engine. In the same way, the engine may create application objects as well if needed,
even if there are few conveniences to do so so far...

General syntax of rules
=======================

The general syntax of rules is :

    <RULE priority="<priority>"  prefix="<prefix>" 
          <access_path1>="<value1>" <access_path2>="<value2>" <access_path3>="<value3>" ... />
        <IF>
           <CONDITION /> 
           <CONDITION /> 
           <CONDITION /> ...
        </IF>
        
        <THEN>
           <ACTION /> 
           <ACTION /> 
           <ACTION /> ...
        </THEN>
        
        <RULE />
        <RULE />
        <RULE /> ...
    </RULE>

Access to application information and Wrappers
==============================================

General access syntax
---------------------

    <access> :: <variable> | <variable>.<access_path>
    <access_path> :: <attribute_or_relation> | <attribute_or_relation>.<access_path>

General values syntax
---------------------

    <value> :: <constante> | $<access_path> | (<fonction> <value>*)


Predefined functions
---------------------

The following functions are predefined :
* +,-,/ or div,* or mul,
* catenate
* print
 


Extending functions
-------------------
The functions syntax can be extended by declaring additional function handlers to the engine upon initialization in
the properties provided to the engine. If one provides a key/value properties in the *properties.functions*, each
specified key will be assigned to the specified function handler as a new tag in the rule syntax.

Here is a sample action handler used by the predefined function + :

    function_plus : function(context, args) {
   	  var result = 0;
   	  for (var i = 1; i < args.length; i++) {
   		result = result + parseFloat(args[i]);
   	  }
   	  return result;
    }

Indexed optimized conditions
============================

As mentioned in general syntax, conditions in the RULE tag of the general form `<access_path>="<value>"` are indexed.
The associated `<access_path>` are evaluated once, and a direct index points to the associated relevant rules that specify
the proper values. Only values and strict equality conditions are possible so far. Extension to support explicit list
of values is under development, but more "dynamic" conditions as matching or comparisons would be much harder.


Conditions detailed syntax
==========================

<CONDITION> :: <(LESS|MORE|EQUAL|LIKE) value1="<value1>" value2="<value2>"/> |
               <MATCHES <acces_path1>="criteria1" <acces_path2>="criteria2" <acces_path3>="criteria3" ... /> |
               <AND> <CONDITION>* </AND> |
               <OR> <CONDITION>* </OR> |  
               <NOT> <CONDITION>* </NOT>
               

Predefined conditions
---------------------

The following logical operators can be used :
* AND
* OR
* NOT

The following predicates are built in in the engine :
* LESS, MORE, EQUAL, LIKE
* MATCHES


Extending conditions with new functions
-----------------------------------------
            
           
Extending conditions with new predicates
-----------------------------------------
The conditions syntax can be extended by declaring additional condition handlers to the engine upon initialization in
the properties provided to the engine. If one provides a key/value properties in the *properties.conditions*, each
specified key will be assigned to the specified condition handler as a new tag in the rule syntax.

Here is a sample action handler used by the predefined action NOT :

          function(context,condition) {
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

Actions detailed syntax
=======================

    <SET prefix="<prefix>" <access-path1>="<value1>" <access-path2>="<value2>" <access-path3>="<value3>" ... />
    <DSET prefix="<prefix>" value1="<access-path1>" value2="<value>" />
    <SET_TEXT prefix="<prefix>">
    	Some text or pcdata... (not xml)
    </SET_TEXT>
    <ADD prefix="<prefix>" <access-path1>="<value1>" <access-path2>="<value2>" <access-path3>="<value3>" ... />
    <ADD_TEXT prefix="<prefix>">
    	Some text or pcdata... (not xml)
    </ADD_TEXT>
    <DADD prefix="<prefix>" value1="<access-path1>" value2="<value>" />
    <CHOOSE <access-path>="<pattern>" > <ACTION/>* </CHOOSE>
    <CONTROL action="<action>" priority="<priority>" />
    <LOG message="<value>" level="<level>" />

Predefined actions
------------------

The following actions are predefined :
* SET
* DSET
* ADD
* DADD
* LOG


Control actions
---------------

The following actions control the engine, they are more detailed in the next section :
* CONTROL
* CHOOSE
* RECURSE

Extending actions through functions and their side effects 
----------------------------------------------------------

This is bad practice but is possible. There is a lack in current implementation to gain access
in a "clean" way to application context data. However the general context can be used for this
purpose as long as the application has taken care to insert this contextual application data
before lauching the engine.

One should rather use explicit syntax extension that will let the rules look cleaner in their
syntax.

Extending actions syntax 
------------------------
The actions syntax can be extended by declaring additional action handlers to the engine upon initialization in
the properties provided to the engine. If one provides a key/value properties in the *properties.actions*, each
specified key will be assigned to the specified action handler as a new tag in the rule syntax.

Here is a sample action handler used by the predefined action SET :

          function (context, action) {
               if ((action.tagName == "SET") || (action.tagName == "ADD")) {
                   var attributes = action.attributes;
                   var prefix = "result.";
                   if (action.hasAttribute("prefix")) {
                       prefix = action.getAttribute("prefix");
                   }
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


Engine control and operation
=============================

Engine general algorithm
------------------------

Priorities
----------


Implicit control
----------------


Explicit control
----------------


Rule based engine control
-------------------------

The <CHOOSE> action makes possible to repeatedly assign variables to a number of alternative objects, and execute
the embedded actions :

    <CHOOSE <path>="<value>">
        <ACTION 1/>
        <ACTION 2/>
        <ACTION 3/>
        .....
        <ACTION N/>
    </CHOOSE>
    
The <RECURSE> action makes possible to reinvoke recursively the engine without affecting     
    
    <RECURSE/>


Algorithmic engine control
--------------------------

The engine itself can be invoked by the application through a very simple API. This API is an alternative
to rule based control, that in many circumstances will be much more efficient. Rules should be used to
manage fundamentally open rule sets and largely dynamic, whereas procedural control should be preferred
when a "simple" algorithm is more suited to the needs.


Engine call API
===============

Sample Engine invocation
------------------------

                   var rules = getRulesFromXML(data);
                   var engine = new RuleEngine({rulesXML : rules});
                   var context = new RuleContext(new RuleFact ({a:"a1",
                                                                b:"b1",
                                                                c: new RuleFact({x:"3", y:1})
                                                               }));

                   var result = engine.run(context);


