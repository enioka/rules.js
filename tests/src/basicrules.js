rules = [
            { type : "RULE", 
              priority : "1",
              a : "a1",
              b : "b1",
              conditions : 
                  [
                      {
                          type : "EQUALS",
                          value1 : "$a",
                          value2 : "a1"
                      }
                  ],
              actions : 
                  [
                      {
                          type : "LOG",
                          message : "RULE 1 fired"
                      },
                      {
                          type : "DSET",
                          path : "$a",
                          value : "(print 'hello world' ' this is a test ')"
                      }
                  ],
               rules : 
                   [
                       {
                           type : "RULE",
                           priority : "3",
                           actions : [
                               {
                                   type : "LOG",
                                   message : "Embedded RULE of priority 3 in RULE 1 fired"
                               }
                           ]
                       },
                       {
                           type : "RULE",
                           priority : "0",
                           actions : [
                               {
                                   type : "LOG",
                                   message : "Embedded RULE of priority 0 in RULE 1 fired"
                               },
                               {
                                   type : "CONTROL",
                                   action : "end"
                               }
                           ]
                       },
                       {
                           type : "RULE",
                           priority : "0",
                           actions : [
                               {
                                   type : "LOG",
                                   message : "Embedded RULE of priority 0 in RULE 1 should not fire"
                               },
                               {
                                   type : "SET",
                                   attr : "Value set by low priority rule"
                               },
                               {
                                   type : "CONTROL",
                                   action : "end"
                               }
                           ]
                       }
                   ]
             },
             { type : "RULE", 
                 priority : "0",
                 priorityCondition : "true",
                 actions : 
                     [
                         {
                             type : "SET",
                             priorityTestAttr : "Value set by low priority rule should not fire because hidden by priority 1 with explicit end"
                         }
                     ]
             },
             { type : "RULE", 
                 priority : "1",
                 priorityCondition : "true",
                 actions : 
                     [
                         {
                             type : "LOG",
                             message : "Syntax without explicit THEN"
                         },
                         {
                             type : "SET",
                             priorityTestAttr : "Value set by high priority rule"
                         },
                         {
                             type : "CONTROL",
                             action : "end"
                         }
                     ]
             },
             { type : "RULE", 
                 priority : "1",
                 a : "a1",
                 b : "b2",
                 conditions : 
                     [
                         {
                             type : "EQUALS",
                             value1 : "$a",
                             value2 : "a1"
                         }
                     ],
                 actions : 
                     [
                         {
                             type : "LOG",
                             message : "RULE 2 fired"
                         },
                         {
                             type : "SET",
                             "result.a" :  "(* 3 2 5)"
                         }
                     ]
             },
             { type : "RULE", 
                 priority : "2",
                 a : "a1",
                 conditions : 
                     [
                         {
                             type : "EQUALS",
                             value1 : "$a",
                             value2 : "a1"
                         }
                     ],
                 actions : 
                     [
                         {
                             type : "LOG",
                             message : "RULE 3 fired"
                         },
                         {
                             type : "SET",
                             prefix :"",
                             "result.a" :  "3",
                             "result.b" :  "4"
                         },
                         {
                             type : "SET",
                             c :  "5",
                             "result.d" :  "(- 2 6)",
                             "e.a" :  "(- 7)",
                             f : "(* 3 2 5)"
                         }
                     ]
             },
             { type : "RULE", 
                 priority : "2",
                 a : "a2",
                 conditions : 
                     [
                         {
                             type : "NOT",
                             conditions : [
                                 {
                                     type : "EQUALS",
                                     value1 : "$a",
                                     value2 : "a1"
                                 }
                             ]
                         }
                     ],
                 actions : 
                     [
                         {
                             type : "LOG",
                             message : "RULE 4 fired"
                         },
                         {
                             type : "SET",
                             c :  "r4"
                         }
                     ]
             },
             { type : "RULE", 
                 priority : "2",
                 a : "a2",
                 conditions : 
                     [
                         {
                             type : "NOT",
                             conditions : [
                                 {
                                     type : "EQUALS",
                                     value1 : "$a",
                                     value2 : "a1"
                                 },
                                 {
                                     type : "EQUALS",
                                     value1 : "$a",
                                     value2 : "a3"
                                 }
                             ]
                         }
                     ],
                 actions : 
                     [
                         {
                             type : "LOG",
                             message : "RULE 5 fired"
                         },
                         {
                             type : "SET",
                             d :  "r5"
                         }
                     ]
             },
             { type : "RULE", 
                 priority : "2",
                 a : "a2",
                 conditions : 
                     [
                         {
                             type : "NOT",
                             conditions : [
                                 {
                                     type : "EQUALS",
                                     value1 : "$a",
                                     value2 : "a1"
                                 },
                                 {
                                     type : "EQUALS",
                                     value1 : "$a",
                                     value2 : "a2"
                                 }
                             ]
                         }
                     ],
                 actions : 
                     [
                         {
                             type : "LOG",
                             message : "RULE 6 fired"
                         },
                         {
                             type : "SET",
                             e :  "r6"
                         }
                     ]
             },
             { type : "RULE", 
                 priority : "2",
                 a : "a2",
                 conditions : 
                     [
                         {
                             type : "AND",
                             conditions : [
                                 {
                                     type : "EQUALS",
                                     value1 : "$b",
                                     value2 : "b1"
                                 },
                                 {
                                     type : "EQUALS",
                                     value1 : "$a",
                                     value2 : "a2"
                                 },
                                 {
                                     type : "NOT",
                                     conditions : [
                                         {
                                             type : "EQUALS",
                                             value1 : "$a",
                                             value2 : "a1"
                                         }
                                      ]
                                 }
                             ]
                         }
                     ],
                 actions : 
                     [
                         {
                             type : "LOG",
                             message : "RULE 7 fired"
                         },
                         {
                             type : "SET",
                             f :  "r7"
                         }
                     ]
             },
             { type : "RULE", 
                 priority : "1",
                 test : "10",
                 prefix : ".level1.level2",
                 actions : 
                     [
                         {
                             type : "SET",
                             a : "resultat10"
                         }
                     ]
             },
             { type : "RULE", 
                 priority : "1",
                 test : "11",
                 prefix : ".level1.level2",
                 actions : 
                     [
                         {
                             type : "SET",
                             a : "resultat11"
                         }
                     ]
             }
        ];