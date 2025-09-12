; ============= Keywords =============
[
  "chart"
  "diagram"
  "meta"
  "compound"
  "computed"
  "import"
  "from"
  "as"
] @keyword

[
  "config"
  "data"
  "node"
  "leaf"
  "style"
  "dimensions"
  "values"
  "scale"
  "filter"
  "group"
  "series"
] @keyword.directive

; ============= Control Flow Keywords =============
[
  "alt"
  "else"
  "loop"
  "par"
  "and"
  "opt"
  "start"
  "end"
] @keyword.control

; ============= Types =============
[
  "class"
  "enum"
  "actor"
  "participant"
  "database"
] @keyword.type

(chart_type) @type.builtin
(diagram_type) @type.builtin
(meta_type) @type.builtin

; ============= Functions and Methods =============
(method_declaration
  name: (identifier) @function.method)

(parameter
  name: (identifier) @variable.parameter)

; ============= Fields and Properties =============
(field_declaration
  name: (identifier) @variable.field)

(config_property
  (identifier) @property)

(object_property
  key: (identifier) @property)

(attribute
  name: (identifier) @attribute)

; ============= Identifiers =============
(class_declaration
  name: (string_literal) @type.class)

(enum_declaration
  name: (string_literal) @type.enum)

(enum_variant
  name: (identifier) @constant)

(node_identifier
  (identifier) @variable)

(node_identifier
  "@" @punctuation.special
  (identifier) @variable.builtin)

; Special node markers
(node_identifier
  "@" @punctuation.special
  (identifier) @variable.builtin
  (#match? @variable.builtin "^(start|end|begin|finish)$"))

; ============= Strings =============
(string_literal) @string

(template_string) @string.special

(template_substitution
  "${" @punctuation.special
  (identifier) @variable
  "}" @punctuation.special)

; ============= Numbers =============
(integer) @number
(float) @number.float
(percentage) @number

; ============= Colors =============
(color_literal) @constant.color

; ============= Booleans =============
(boolean_literal) @constant.builtin.boolean

; ============= Comments =============
(comment) @comment.line
(block_comment) @comment.block

; ============= Operators =============
[
  "->"
  "-->"
  "<--"
  "<-->"
  "..>"
  "==>"
  "--"
  "*--"
  "o--"
  "<|--"
  "<|.."
] @operator

; ============= Visibility Modifiers =============
(visibility_modifier) @storage.modifier

; Specific visibility semantics
(visibility_modifier
  "+" @storage.modifier.public)

(visibility_modifier
  "-" @storage.modifier.private)

(visibility_modifier
  "#" @storage.modifier.protected)

(visibility_modifier
  "~" @storage.modifier.package)

; ============= Punctuation =============
[
  ";"
  ":"
  ","
  "."
] @punctuation.delimiter

[
  "{"
  "}"
  "["
  "]"
  "("
  ")"
] @punctuation.bracket

[
  "<"
  ">"
] @punctuation.bracket ; For generics

; ============= Layout Values =============
((identifier) @constant.builtin
  (#match? @constant.builtin "^(vertical|horizontal|radial|stacked|grouped|funnel|radar|diverging)$"))

; ============= Special Constants =============
((identifier) @constant.builtin
  (#match? @constant.builtin "^(true|false|null|none|auto|origin|first|center|before|after|median|bullet)$"))

; ============= Error Handling =============
(ERROR) @error

; ============= Type Expressions =============
(type_expression
  (identifier) @type)

(type_expression
  base: (identifier) @type
  "<" @punctuation.bracket
  ">" @punctuation.bracket)

; ============= Labels and Titles =============
(chart_declaration
  title: (string_literal) @label)

(diagram_declaration
  title: (string_literal) @label)

(meta_declaration
  title: (string_literal) @label)

(series_declaration
  name: (string_literal) @label)

(node_declaration
  name: (string_literal) @label)

(leaf_declaration
  name: (string_literal) @label)

; ============= Data Points =============
(simple_data_point
  label: (string_literal) @string
  "->" @operator
  value: (number_literal) @number)

(coordinate_data_point
  "(" @punctuation.bracket
  x: (number_literal) @number
  "," @punctuation.delimiter
  y: (number_literal) @number
  ")" @punctuation.bracket
  "->" @operator
  value: (number_literal) @number)

; ============= Edge Labels =============
(edge_label
  (string_literal) @string.special)

; ============= Node Definitions =============
; Circle nodes
(node_definition
  "(" @punctuation.bracket
  (string_literal) @string
  ")" @punctuation.bracket)

; Rectangle nodes
(node_definition
  "[" @punctuation.bracket
  (string_literal) @string
  "]" @punctuation.bracket)

; Diamond/Decision nodes
(node_definition
  "{" @punctuation.bracket
  (string_literal) @string
  "}" @punctuation.bracket)

; Double circle nodes
(node_definition
  "((" @punctuation.bracket
  (string_literal) @string
  "))" @punctuation.bracket)

; Subroutine nodes
(node_definition
  "[[" @punctuation.bracket
  (string_literal) @string
  "]]" @punctuation.bracket)

; ============= Style Selectors =============
(style_selector
  "." @punctuation.special
  (identifier) @variable.class)

(style_selector
  "#" @punctuation.special
  (identifier) @variable.id)

; ============= Condition Expressions =============
(condition_expression) @string.special

; ============= Import Statements =============
(import_spec
  "*" @operator
  "as" @keyword)

(import_spec
  from: (identifier) @namespace
  "as" @keyword
  alias: (identifier) @namespace)

; ============= Semantic Highlights for Common Patterns =============
; Highlight configuration keys specially
((config_property
  (identifier) @keyword.config)
  (#match? @keyword.config "^(layout|colors|stacked|grouped|bounds|step|size|count|opacity|width|height|margin|padding)$"))

; Highlight common attribute names
((attribute
  name: (identifier) @attribute.builtin)
  (#match? @attribute.builtin "^(color|style|label|value|type|multiplicity|opacity|group|category|layer|order)$"))
