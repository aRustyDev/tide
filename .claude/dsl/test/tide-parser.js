#!/usr/bin/env node

/**
 * Tide Parser CLI Tool
 *
 * Usage:
 *   tide-parser parse <file>      - Parse a file and show the tree
 *   tide-parser validate <file>   - Validate a file's syntax
 *   tide-parser highlight <file>  - Show syntax highlighted output
 *   tide-parser format <file>     - Format a Tide file
 *   tide-parser stats <file>      - Show statistics about the file
 */

const fs = require('fs');
const path = require('path');
const Parser = require('tree-sitter');
const Tide = require('./bindings/node');
const chalk = require('chalk');
const { program } = require('commander');

// Initialize parser
const parser = new Parser();
parser.setLanguage(Tide);

// Color scheme for syntax highlighting
const COLORS = {
  keyword: chalk.blue.bold,
  type: chalk.cyan,
  string: chalk.green,
  number: chalk.yellow,
  comment: chalk.gray,
  operator: chalk.magenta,
  identifier: chalk.white,
  error: chalk.red.bold,
  punctuation: chalk.dim.white,
  visibility: chalk.keyword('orange'),
};

// Node type to color mapping
const NODE_COLORS = {
  chart: COLORS.keyword,
  diagram: COLORS.keyword,
  meta: COLORS.keyword,
  class: COLORS.keyword,
  enum: COLORS.keyword,
  config: COLORS.keyword,
  data: COLORS.keyword,
  chart_type: COLORS.type,
  diagram_type: COLORS.type,
  meta_type: COLORS.type,
  string_literal: COLORS.string,
  number_literal: COLORS.number,
  integer: COLORS.number,
  float: COLORS.number,
  percentage: COLORS.number,
  comment: COLORS.comment,
  block_comment: COLORS.comment,
  identifier: COLORS.identifier,
  '->': COLORS.operator,
  '-->': COLORS.operator,
  '<--': COLORS.operator,
  '<-->': COLORS.operator,
  '..>': COLORS.operator,
  '==>': COLORS.operator,
  visibility_modifier: COLORS.visibility,
  ERROR: COLORS.error,
};

/**
 * Parse a Tide file and return the tree
 */
function parseFile(filePath) {
  const sourceCode = fs.readFileSync(filePath, 'utf8');
  return parser.parse(sourceCode);
}

/**
 * Format the parse tree for display
 */
function formatTree(node, indent = '') {
  let output = '';
  const nodeType = node.type;
  const nodeText = node.text?.substring(0, 50);

  output += indent + nodeType;
  if (nodeText && !node.children?.length) {
    output += `: "${nodeText.replace(/\n/g, '\\n')}"`;
  }
  output += '\n';

  if (node.children) {
    for (const child of node.children) {
      output += formatTree(child, indent + '  ');
    }
  }

  return output;
}

/**
 * Validate a Tide file and report errors
 */
function validateFile(filePath) {
  const tree = parseFile(filePath);
  const errors = [];

  function findErrors(node) {
    if (node.type === 'ERROR' || node.isMissing()) {
      errors.push({
        type: node.type,
        startPosition: node.startPosition,
        endPosition: node.endPosition,
        text: node.text,
      });
    }

    for (const child of node.children || []) {
      findErrors(child);
    }
  }

  findErrors(tree.rootNode);
  return errors;
}

/**
 * Syntax highlight a Tide file
 */
function highlightFile(filePath) {
  const sourceCode = fs.readFileSync(filePath, 'utf8');
  const tree = parseFile(filePath);

  const highlights = [];

  function collectHighlights(node) {
    const color = NODE_COLORS[node.type];
    if (color && !node.children?.length) {
      highlights.push({
        start: node.startIndex,
        end: node.endIndex,
        color: color,
      });
    }

    for (const child of node.children || []) {
      collectHighlights(child);
    }
  }

  collectHighlights(tree.rootNode);

  // Sort highlights by start position
  highlights.sort((a, b) => a.start - b.start);

  // Apply highlights to source code
  let result = '';
  let lastEnd = 0;

  for (const highlight of highlights) {
    result += sourceCode.substring(lastEnd, highlight.start);
    result += highlight.color(sourceCode.substring(highlight.start, highlight.end));
    lastEnd = highlight.end;
  }
  result += sourceCode.substring(lastEnd);

  return result;
}

/**
 * Format a Tide file (basic formatter)
 */
function formatTideFile(filePath) {
  const tree = parseFile(filePath);
  let formatted = '';
  let indentLevel = 0;
  const indentSize = 2;

  function format(node) {
    const indent = ' '.repeat(indentLevel * indentSize);

    switch (node.type) {
      case 'source_file':
        for (const child of node.children) {
          format(child);
          if (child.type !== 'comment' && child.type !== 'block_comment') {
            formatted += '\n';
          }
        }
        break;

      case 'chart_declaration':
      case 'diagram_declaration':
      case 'meta_declaration':
        formatted += indent + node.children[0].text + ' ';
        formatted += node.children[1].text;
        if (node.children[2] && node.children[2].type === 'string_literal') {
          formatted += ' ' + node.children[2].text;
        }
        formatted += ' {\n';
        indentLevel++;
        for (let i = 3; i < node.children.length - 1; i++) {
          format(node.children[i]);
        }
        indentLevel--;
        formatted += indent + '}\n';
        break;

      case 'config_block':
      case 'data_block':
      case 'style_block':
        formatted += indent + node.children[0].text + ' {\n';
        indentLevel++;
        for (let i = 1; i < node.children.length - 1; i++) {
          format(node.children[i]);
        }
        indentLevel--;
        formatted += indent + '}\n';
        break;

      case 'config_item':
      case 'simple_data_point':
      case 'field_declaration':
      case 'method_declaration':
        formatted += indent + node.text + '\n';
        break;

      case 'class_declaration':
      case 'enum_declaration':
        formatted += indent + 'class ' + node.children[1].text + ' {\n';
        indentLevel++;
        for (let i = 2; i < node.children.length - 1; i++) {
          format(node.children[i]);
        }
        indentLevel--;
        formatted += indent + '}\n';
        break;

      case 'comment':
        formatted += indent + node.text + '\n';
        break;

      case 'block_comment':
        formatted += indent + node.text + '\n';
        break;

      default:
        // For other nodes, just process children
        for (const child of node.children || []) {
          format(child);
        }
    }
  }

  format(tree.rootNode);
  return formatted;
}

/**
 * Get statistics about a Tide file
 */
function getFileStats(filePath) {
  const tree = parseFile(filePath);
  const stats = {
    totalNodes: 0,
    nodeTypes: {},
    charts: 0,
    diagrams: 0,
    classes: 0,
    enums: 0,
    dataPoints: 0,
    errors: 0,
    lines: 0,
    size: 0,
  };

  const sourceCode = fs.readFileSync(filePath, 'utf8');
  stats.lines = sourceCode.split('\n').length;
  stats.size = fs.statSync(filePath).size;

  function countNodes(node) {
    stats.totalNodes++;
    stats.nodeTypes[node.type] = (stats.nodeTypes[node.type] || 0) + 1;

    switch (node.type) {
      case 'chart_declaration':
        stats.charts++;
        break;
      case 'diagram_declaration':
        stats.diagrams++;
        break;
      case 'class_declaration':
        stats.classes++;
        break;
      case 'enum_declaration':
        stats.enums++;
        break;
      case 'simple_data_point':
      case 'coordinate_data_point':
        stats.dataPoints++;
        break;
      case 'ERROR':
        stats.errors++;
        break;
    }

    for (const child of node.children || []) {
      countNodes(child);
    }
  }

  countNodes(tree.rootNode);
  return stats;
}

// CLI Commands
program.name('tide-parser').description('CLI tool for working with Tide files').version('1.0.0');

program
  .command('parse <file>')
  .description('Parse a Tide file and display the syntax tree')
  .action((file) => {
    try {
      const tree = parseFile(file);
      console.log(formatTree(tree.rootNode));
    } catch (error) {
      console.error(chalk.red(`Error parsing file: ${error.message}`));
      process.exit(1);
    }
  });

program
  .command('validate <file>')
  .description('Validate a Tide file and report syntax errors')
  .action((file) => {
    try {
      const errors = validateFile(file);

      if (errors.length === 0) {
        console.log(chalk.green('✓ File is valid'));
      } else {
        console.log(chalk.red(`✗ Found ${errors.length} error(s):`));
        for (const error of errors) {
          console.log(
            chalk.red(
              `  Line ${error.startPosition.row + 1}:${error.startPosition.column}: ${error.type}`
            )
          );
          if (error.text) {
            console.log(chalk.dim(`    ${error.text}`));
          }
        }
        process.exit(1);
      }
    } catch (error) {
      console.error(chalk.red(`Error validating file: ${error.message}`));
      process.exit(1);
    }
  });

program
  .command('highlight <file>')
  .description('Display syntax-highlighted Tide file')
  .action((file) => {
    try {
      const highlighted = highlightFile(file);
      console.log(highlighted);
    } catch (error) {
      console.error(chalk.red(`Error highlighting file: ${error.message}`));
      process.exit(1);
    }
  });

program
  .command('format <file>')
  .description('Format a Tide file')
  .option('-w, --write', 'Write formatted output back to file')
  .action((file, options) => {
    try {
      const formatted = formatTideFile(file);

      if (options.write) {
        fs.writeFileSync(file, formatted);
        console.log(chalk.green(`✓ Formatted ${file}`));
      } else {
        console.log(formatted);
      }
    } catch (error) {
      console.error(chalk.red(`Error formatting file: ${error.message}`));
      process.exit(1);
    }
  });

program
  .command('stats <file>')
  .description('Display statistics about a Tide file')
  .action((file) => {
    try {
      const stats = getFileStats(file);

      console.log(chalk.bold('\nFile Statistics:'));
      console.log(chalk.cyan(`  File: ${path.basename(file)}`));
      console.log(chalk.cyan(`  Size: ${stats.size} bytes`));
      console.log(chalk.cyan(`  Lines: ${stats.lines}`));
      console.log(chalk.cyan(`  Total Nodes: ${stats.totalNodes}`));

      console.log(chalk.bold('\nContent Summary:'));
      console.log(chalk.green(`  Charts: ${stats.charts}`));
      console.log(chalk.green(`  Diagrams: ${stats.diagrams}`));
      console.log(chalk.green(`  Classes: ${stats.classes}`));
      console.log(chalk.green(`  Enums: ${stats.enums}`));
      console.log(chalk.green(`  Data Points: ${stats.dataPoints}`));

      if (stats.errors > 0) {
        console.log(chalk.red(`  Errors: ${stats.errors}`));
      }

      console.log(chalk.bold('\nTop Node Types:'));
      const sortedTypes = Object.entries(stats.nodeTypes)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);

      for (const [type, count] of sortedTypes) {
        console.log(chalk.dim(`  ${type}: ${count}`));
      }
    } catch (error) {
      console.error(chalk.red(`Error analyzing file: ${error.message}`));
      process.exit(1);
    }
  });

program.parse();
