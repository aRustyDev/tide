module.exports = grammar({
  name: 'tide',

  extras: ($) => [/\s/, $.comment, $.block_comment],

  conflicts: ($) => [
    [$.node_identifier, $.string_literal],
    [$.type_expression, $._identifier_or_string],
    [$.config_property, $.identifier],
  ],

  precedences: ($) => [
    ['member', 'primary'],
    ['unary', 'binary'],
    ['multiplicative', 'additive'],
    ['relational', 'equality'],
    ['logical_and', 'logical_or'],
    ['assignment', 'expression'],
  ],

  word: ($) => $.identifier,

  rules: {
    source_file: ($) => repeat($._statement),

    _statement: ($) =>
      choice(
        $.chart_declaration,
        $.diagram_declaration,
        $.meta_declaration,
        $.import_statement,
        $.comment,
        $.block_comment
      ),

    // ============= Comments =============
    comment: ($) => token(seq('//', /.*/)),

    block_comment: ($) => token(seq('/*', /[^*]*\*+([^/*][^*]*\*+)*/, '/')),

    // ============= Imports =============
    import_statement: ($) =>
      seq('import', $.import_spec, optional(seq('from', $.string_literal)), ';'),

    import_spec: ($) =>
      choice(
        seq($.identifier, optional(seq('as', $.identifier))),
        seq('{', $.import_list, '}'),
        seq('*', 'as', $.identifier)
      ),

    import_list: ($) => seq($.identifier, repeat(seq(',', $.identifier))),

    // ============= Charts =============
    chart_declaration: ($) => seq('chart', $.chart_type, optional($.string_literal), $.block),

    chart_type: ($) =>
      choice(
        'bar',
        'line',
        'circle',
        'tree',
        'point',
        'matrix',
        'scatter',
        'bubble',
        'pie',
        'donut',
        'area',
        'radar'
      ),

    block: ($) => seq('{', repeat($._block_content), '}'),

    _block_content: ($) =>
      choice(
        $.config_block,
        $.data_block,
        $.node_declaration,
        $.style_block,
        $.relationship_statement
      ),

    // ============= Configuration =============
    config_block: ($) => seq('config', '{', repeat($.config_item), '}'),

    config_item: ($) => seq($.config_property, ':', $.config_value, ';'),

    config_property: ($) => seq($.identifier, repeat(seq('.', $.identifier))),

    config_value: ($) =>
      choice(
        $.identifier,
        $.string_literal,
        $.number_literal,
        $.boolean_literal,
        $.array_literal,
        $.object_literal
      ),

    array_literal: ($) =>
      seq('[', optional(seq($.config_value, repeat(seq(',', $.config_value)))), ']'),

    object_literal: ($) =>
      seq('{', optional(seq($.object_property, repeat(seq(',', $.object_property)))), '}'),

    object_property: ($) => seq(choice($.identifier, $.string_literal), ':', $.config_value),

    // ============= Data =============
    data_block: ($) => seq('data', '{', repeat($.data_item), '}'),

    data_item: ($) => choice($.simple_data_point, $.coordinate_data_point, $.series_declaration),

    simple_data_point: ($) =>
      seq($.string_literal, '->', $.number_literal, optional($.attributes), ';'),

    coordinate_data_point: ($) =>
      seq(
        '(',
        $.number_literal,
        ',',
        $.number_literal,
        ')',
        '->',
        $.number_literal,
        optional($.attributes),
        ';'
      ),

    series_declaration: ($) => seq('series', $.string_literal, '{', repeat($.data_item), '}'),

    attributes: ($) => seq('[', $.attribute_list, ']'),

    attribute_list: ($) => seq($.attribute, repeat(seq(',', $.attribute))),

    attribute: ($) => seq($.identifier, ':', $.attribute_value),

    attribute_value: ($) => choice($.string_literal, $.number_literal, $.identifier),

    // ============= Diagrams =============
    diagram_declaration: ($) =>
      seq('diagram', $.diagram_type, optional($.string_literal), $.diagram_block),

    diagram_type: ($) =>
      choice('flow', 'sequence', 'class', 'state', 'entity', 'network', 'mindmap'),

    diagram_block: ($) => seq('{', repeat($._diagram_content), '}'),

    _diagram_content: ($) =>
      choice(
        $.node_statement,
        $.edge_statement,
        $.class_declaration,
        $.enum_declaration,
        $.actor_declaration,
        $.participant_declaration,
        $.database_declaration,
        $.flow_statement,
        $.group_block
      ),

    // ============= Nodes and Edges =============
    node_statement: ($) => seq($.node_identifier, optional($.node_definition), ';'),

    node_identifier: ($) =>
      choice($.identifier, seq('@', $.identifier), seq('[', $.string_literal, ']')),

    node_definition: ($) =>
      choice(
        seq('(', $.string_literal, ')'), // Circle
        seq('[', $.string_literal, ']'), // Rectangle
        seq('{', $.string_literal, '}'), // Diamond
        seq('((', $.string_literal, '))'), // Double circle
        seq('[[', $.string_literal, ']]') // Subroutine
      ),

    edge_statement: ($) =>
      seq(
        $.node_identifier,
        $.edge_operator,
        optional($.edge_label),
        $.node_identifier,
        optional($.attributes),
        ';'
      ),

    edge_operator: ($) =>
      choice(
        '-->', // Solid arrow
        '<--', // Reverse arrow
        '<-->', // Bidirectional
        '..>', // Dotted arrow
        '==>', // Thick arrow
        '--', // Simple line
        '*--', // Composition
        'o--', // Aggregation
        '<|--', // Inheritance
        '<|..' // Realization
      ),

    edge_label: ($) => choice($.string_literal, seq('[', $.string_literal, ']')),

    // ============= Classes and Enums =============
    class_declaration: ($) => seq('class', $.string_literal, '{', repeat($.class_member), '}'),

    class_member: ($) => choice($.field_declaration, $.method_declaration, $.visibility_section),

    visibility_section: ($) =>
      seq($.visibility_modifier, repeat1(choice($.field_declaration, $.method_declaration))),

    visibility_modifier: ($) => choice('+', '-', '#', '~'),

    field_declaration: ($) =>
      seq(optional($.visibility_modifier), $.identifier, ':', $.type_expression, ';'),

    method_declaration: ($) =>
      seq(
        optional($.visibility_modifier),
        $.identifier,
        '(',
        optional($.parameter_list),
        ')',
        optional(seq(':', $.type_expression)),
        ';'
      ),

    parameter_list: ($) => seq($.parameter, repeat(seq(',', $.parameter))),

    parameter: ($) => seq($.identifier, ':', $.type_expression),

    type_expression: ($) =>
      choice(
        $.identifier,
        seq($.identifier, '<', $.type_list, '>'), // Generics
        seq($.identifier, '[', ']') // Arrays
      ),

    type_list: ($) => seq($.type_expression, repeat(seq(',', $.type_expression))),

    enum_declaration: ($) => seq('enum', $.string_literal, '{', repeat($.enum_variant), '}'),

    enum_variant: ($) =>
      choice(
        seq($.identifier, ';'),
        seq($.identifier, '{', $.field_list, '}', ';'),
        seq($.identifier, '(', $.type_list, ')', ';')
      ),

    field_list: ($) => seq($.field_declaration, repeat(seq(',', $.field_declaration))),

    // ============= Sequence Diagram Specifics =============
    actor_declaration: ($) => seq('actor', $.identifier, ';'),

    participant_declaration: ($) => seq('participant', $.identifier, ';'),

    database_declaration: ($) => seq('database', $.identifier, ';'),

    // ============= Flow Control =============
    flow_statement: ($) =>
      choice($.conditional_block, $.loop_block, $.parallel_block, $.optional_block),

    conditional_block: ($) =>
      seq('alt', '[', $.condition_expression, ']', $.block, optional($.else_clause)),

    else_clause: ($) => seq('else', $.block),

    loop_block: ($) => seq('loop', '[', $.string_literal, ']', $.block),

    parallel_block: ($) => seq('par', $.block, repeat(seq('and', $.block))),

    optional_block: ($) => seq('opt', '[', $.condition_expression, ']', $.block),

    condition_expression: ($) => $.string_literal,

    // ============= Meta Declarations =============
    meta_declaration: ($) => seq('meta', $.meta_type, optional($.string_literal), $.meta_block),

    meta_type: ($) => choice('heatmap', 'icon', 'pictogram', 'cluster'),

    meta_block: ($) => seq('{', repeat($._meta_content), '}'),

    _meta_content: ($) => choice($.dimensions_block, $.values_block, $.scale_block, $.filter_block),

    dimensions_block: ($) => seq('dimensions', '{', repeat($.dimension_spec), '}'),

    dimension_spec: ($) => seq($.identifier, ':', $.array_literal, ';'),

    values_block: ($) => seq('values', '{', repeat($.value_mapping), '}'),

    value_mapping: ($) =>
      choice(
        seq($.coordinate, '->', $.number_literal, ';'),
        seq($.string_literal, '->', $.number_literal, ';')
      ),

    coordinate: ($) =>
      seq('(', $.number_literal, ',', $.number_literal, optional(seq(',', $.number_literal)), ')'),

    scale_block: ($) => seq('scale', '{', repeat($.scale_property), '}'),

    scale_property: ($) =>
      seq($.identifier, ':', choice($.array_literal, $.number_literal, $.string_literal), ';'),

    filter_block: ($) => seq('filter', '{', repeat($.filter_property), '}'),

    filter_property: ($) => seq($.identifier, ':', $.string_literal, ';'),

    // ============= Hierarchical Structures =============
    node_declaration: ($) =>
      seq('node', $.string_literal, optional($.node_attributes), optional($.node_children)),

    node_children: ($) => seq('{', repeat(choice($.node_declaration, $.leaf_declaration)), '}'),

    leaf_declaration: ($) => seq('leaf', $.string_literal, optional($.attributes), ';'),

    node_attributes: ($) => seq('[', $.attribute_list, ']'),

    // ============= Style Block =============
    style_block: ($) => seq('style', '{', repeat($.style_rule), '}'),

    style_rule: ($) => seq($.style_selector, '{', repeat($.style_property), '}'),

    style_selector: ($) =>
      choice(
        $.identifier,
        $.string_literal,
        seq('.', $.identifier), // Class selector
        seq('#', $.identifier) // ID selector
      ),

    style_property: ($) => seq($.identifier, ':', $.style_value, ';'),

    style_value: ($) => choice($.identifier, $.string_literal, $.number_literal, $.color_literal),

    // ============= Relationship Statement =============
    relationship_statement: ($) =>
      seq(
        $._identifier_or_string,
        $.relationship_operator,
        $._identifier_or_string,
        optional($.attributes),
        ';'
      ),

    relationship_operator: ($) => choice('-->', '<--', '<-->', '..>', '==>'),

    // ============= Group Block =============
    group_block: ($) =>
      seq('group', optional($.string_literal), '{', repeat($._diagram_content), '}'),

    // ============= Literals =============
    identifier: ($) => /[a-zA-Z_][a-zA-Z0-9_]*/,

    _identifier_or_string: ($) => choice($.identifier, $.string_literal),

    string_literal: ($) =>
      choice(
        seq('"', repeat(choice(/[^"\\]/, /\\./)), '"'),
        seq("'", repeat(choice(/[^'\\]/, /\\./)), "'"),
        $.template_string
      ),

    template_string: ($) =>
      seq('`', repeat(choice(/[^`\\$]/, /\\./, $.template_substitution)), '`'),

    template_substitution: ($) => seq('${', $.identifier, '}'),

    number_literal: ($) => choice($.integer, $.float, $.percentage),

    integer: ($) => /-?[0-9]+/,

    float: ($) => /-?[0-9]+\.[0-9]+/,

    percentage: ($) => /[0-9]+(\.[0-9]+)?%/,

    boolean_literal: ($) => choice('true', 'false'),

    color_literal: ($) => /#[0-9a-fA-F]{3,8}/,
  },
});
