grammar Tide

entry Model:
    (var+=Var | diagrams+=Diagram | tide+=Import | func+=Fn)*;

// Super Types
Param: VarRef | name=ID; // TODO: change VAR to reference
Var: Input | Const | Locals;
VarRef: InputRef | ConstRef | LocalRef;
Fn: Pen | Move | Color | For;
PrimExpr: Lit | Ref | Group | NegExpr;
Expr: Add;

// Types
Input:
    'var' name=ID;

Const:
    'const' name=ID;

Locals:
    'locals' LocalsBlock;

Diagram:
    ('chart'|'diagram') name=ID Block;

Import:
    'tide' TideBlock;

TideBlock:
    ('default' TideDefaults)? ('config' TideConfigs)? 'modules' TideModules*;

Color:
    'color' '(' ((r = Expr ',' g=Expr ',' b=Expr) | color=ID | color=HEX) ')';

Pen:
    'pen' '(' mode=('up' | 'down') ')';

Move:
    'move' '(' ex=Expr ',' ey=Expr ')';

For: 
    'for' var=Param '=' e1=Expr 'to' e2=Expr Block;

Add  infers Expr: 
    Mult ({infer BinExpr.e1=current} op=('+'|'-') e2=Mult)*;

Mult infers Expr: 
    PrimExpr ({infer BinExpr.e1=current} op=('*'|'/') e2=PrimExpr)*;

// References
InputRef: def=[Input:ID];
ConstRef: def=[Const:ID];
LocalRef: def=[Locals:ID];
Ref:      val=[Param:ID];

// literal int
Lit:        val=INT;
// cross-reference to a parameter
// grouped expression with parentheses
Group:      '(' ge=Expr ')';
// negated expression
NegExpr:    '-' ne=Expr;

fragment Block: '{' body+=STRING* '}';
fragment LocalsBlock: '{' local+=STRING* '}';
fragment TideDefaults: '{' body+=STRING* '}'; // TODO make KEY arbirtrary
fragment TideConfigs: '{' body+=STRING* '}'; // TODO make KEY arbirtrary
fragment TideModules: '{' (protocol+='ssh'|'https')? Module* '}'; // TODO: default to https
fragment Module: '{' source+=STRING version+=STRING '}';

hidden terminal WS: /\s+/;
// recognize an identifier
terminal ID returns string: /[_a-zA-Z][\w_]*/;
// recognize an Integer (but represented via a 'number' type)
terminal INT returns number: /[0-9]+/;
terminal STRING returns string: /"(\\.|[^"\\])*"|'(\\.|[^'\\])*'/;
// recognize a hexadecimal sequence, used to recognize colors for the 'Color' command
terminal HEX returns string:    /#(\d|[a-fA-F])+/;

hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;
