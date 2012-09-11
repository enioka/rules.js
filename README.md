**rules.js** is a lightweight tool that provides rule based style customizing to javascript based applications 
that need to process "events" incrementally. The tool is born from the need for own enioka modelling tool to 
specify in models their visual presentation or their semantic properties or the generation of derived elements 
in models. Javascript being the general client and server side customization context, the tool is implemented in 
javascript and therefore is supposed to run on both server or client environments.

It is intended to stay **small** and to address **medium size** sets of data. It still aims to avoid a brute force
approach of a scan of all rules for each event to process. A first simple algorithm is implemented that builds 
an index from the text of the rules. The rules are implemented as a mix of XML and javascript objects. The source 
of the rules is in XML, and it is somewhat "transformed" and "indexed" upon initialization of the engine.  

The engine connects to the internal environment through the notion of **wrappers** that provide access to the engine
to external information (either in read or in write access) of the client application. In the most naive 
integration, simple flat objects can be used, but no copy is actually needed to let the engine "reason" 
about **native applications' objects**. One can for instance "reason" about json objects, html parts 
or whatever javascript object in a uniform syntax, even if objects are heterogeneous. The idea of the engine 
is to rely heavily on the external objects "native" indexes and interralation capabilities rather than imposing 
an own indexing technique (as a rete network)).

The engine is **called by the application** by providing a **context** that the engine will process, reason upon, 
and produce derivative "conclusions" whatever they are. It can be actual **results** as html fragments, it can 
be **side effects** as updates to the context to derive property values of supplied objects, it can be 
**new objects** created as a consequence of the provided context.

The idea of the engine is that it will fire **whatever rule that meets its conditions** and possibly all of them. 
Depending on the use case and the complexity of the problem, the engine may **simply fire once** the (few) rules 
that are relevant in the provided context and stop. But the overall processing can be **more complex** and 
use priorities in rules, let rules control if the result has been met, or even iterate the engine on data 
made accessible by the context by other rules. One can build rather elaborate rules and tasks with the 
provided mechanisms. Still, the engine is **not designed to perform algorithmic** tasks, and it is a 
more "clever" use to integrate the engine to an algorithm when this one can be more easily expressed in standard code. 
The purpose is to express what is **declarative in rules**, and whatever is **procedural in (javascript) code**.

The first release of the tool is very simple and basic, and will evolve with needs, to enhance control capabilities,
expressiveness of rules, ease of use ... and more elaborate non regression test suite (based on jasmine) and 
samples.
