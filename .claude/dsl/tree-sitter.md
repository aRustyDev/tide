# Tide Tree-Sitter Parser Setup and Usage Guide

## Project Structure

Create the following directory structure for your tree-sitter-tide parser:

```
tree-sitter-tide/
├── grammar.js           # Main grammar definition
├── package.json         # NPM package configuration
├── Cargo.toml          # Rust configuration (for bindings)
├── binding.gyp         # Node.js native addon build config
├── bindings/
│   ├── node/
│   │   ├── binding.cc
│   │   └── index.js
│   └── rust/
│       ├── lib.rs
│       └── build.rs
├── queries/
│   ├── highlights.scm   # Syntax highlighting queries
│   ├── injections.scm   # Language injection queries (optional)
│   ├── locals.scm       # Local variable queries (optional)
│   └── tags.scm         # Code navigation tags (optional)
├── src/
│   ├── parser.c         # Generated parser (do not edit)
│   ├── tree_sitter/     # Generated headers
│   └── scanner.c        # Custom scanner (if needed)
├── test/
│   └── corpus/          # Test files
│       ├── charts.txt
│       ├── diagrams.txt
│       └── classes.txt
└── examples/
    └── *.tide           # Example Tide files
```

## 1. Initial Setup

### package.json

```json
{
  "name": "tree-sitter-tide",
  "version": "1.0.0",
  "description": "Tree-sitter parser for the Tide DSL",
  "main": "bindings/node",
  "keywords": [
    "parser",
    "tree-sitter",
    "tide",
    "neptune"
  ],
  "files": [
    "grammar.js",
    "binding.gyp",
    "prebuilds/**",
    "bindings/node/*",
    "queries/*",
    "src/**"
  ],
  "dependencies": {
    "node-addon-api": "^7.1.0",
    "node-gyp-build": "^4.8.0"
  },
  "devDependencies": {
    "tree-sitter-cli": "^0.22.2",
    "prebuildify": "^6.0.0"
  },
  "scripts": {
    "generate": "tree-sitter generate",
    "test": "tree-sitter test",
    "parse": "tree-sitter parse",
    "build": "tree-sitter generate && node-gyp rebuild",
    "prebuildify": "prebuildify --napi --strip",
    "playground": "tree-sitter playground"
  },
  "tree-sitter": [
    {
      "scope": "source.tide",
      "injection-regex": "^tide$",
      "file-types": [
        "tide",
        "tid"
      ],
      "highlights": "queries/highlights.scm"
    }
  ]
}
```

### binding.gyp

```python
{
  "targets": [
    {
      "target_name": "tree_sitter_tide_binding",
      "dependencies": [
        "<!(node -p \"require('node-addon-api').targets\"):node_addon_api_except"
      ],
      "include_dirs": [
        "src"
      ],
      "sources": [
        "bindings/node/binding.cc",
        "src/parser.c",
        # Add scanner.c if you implement an external scanner
        # "src/scanner.c"
      ],
      "cflags_c": [
        "-std=c11"
      ]
    }
  ]
}
```

### bindings/node/index.js

```javascript
const root = require('path').join(__dirname, '..', '..');

module.exports = require('node-gyp-build')(root);

try {
  module.exports.nodeTypeInfo = require('./node-types.json');
} catch (_) {}
```

### bindings/node/binding.cc

```cpp
#include <napi.h>

typedef struct TSLanguage TSLanguage;

extern "C" TSLanguage *tree_sitter_tide();

// "tree-sitter", "language" hashed with BLAKE2
const napi_type_tag LANGUAGE_TYPE_TAG = {
  0x8AF2E5212AD58ABF, 0xD5006CAD83ABBA16
};

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports["name"] = Napi::String::New(env, "tide");
  auto language = Napi::External<TSLanguage>::New(env, tree_sitter_tide());
  language.TypeTag(&LANGUAGE_TYPE_TAG);
  exports["language"] = language;
  return exports;
}

NODE_API_MODULE(tree_sitter_tide_binding, Init)
```

## 2. Building the Parser

```bash
# Install dependencies
npm install

# Generate the parser from grammar.js
npm run generate

# Build the node binding
npm run build

# Run tests
npm run test
```

## 3. Testing the Parser

### Create test files in test/corpus/

Example: `test/corpus/charts.txt`

```
==================
Simple Bar Chart
==================

chart bar "Sales" {
  data {
    "Q1" -> 100;
    "Q2" -> 150;
  }
}

---

(source_file
  (chart_declaration
    (chart_type)
    (string_literal)
    (block
      (data_block
        (simple_data_point
          (string_literal)
          (number_literal))
        (simple_data_point
          (string_literal)
          (number_literal))))))

==================
Chart with Config
==================

chart line {
  config {
    layout: horizontal;
    colors: ["#FF0000", "#00FF00"];
  }
}

---

(source_file
  (chart_declaration
    (chart_type)
    (block
      (config_block
        (config_item
          (config_property
            (identifier))
          (config_value
            (identifier)))
        (config_item
          (config_property
            (identifier))
          (config_value
            (array_literal
              (config_value
                (string_literal))
              (config_value
                (string_literal)))))))))
```

## 4. Editor Integration

### VS Code

Create a VS Code extension with the following structure:

```json
// package.json for VS Code extension
{
  "name": "tide-language",
  "displayName": "Tide Language Support",
  "version": "1.0.0",
  "engines": {
    "vscode": "^1.75.0"
  },
  "categories": ["Programming Languages"],
  "contributes": {
    "languages": [
      {
        "id": "tide",
        "aliases": ["Tide", "tide"],
        "extensions": [".tide", ".tid"],
        "configuration": "./language-configuration.json"
      }
    ],
    "grammars": [
      {
        "language": "tide",
        "scopeName": "source.tide",
        "path": "./syntaxes/tide.tmLanguage.json"
      }
    ]
  }
}
```

### Neovim (with nvim-treesitter)

1. Add parser configuration to your Neovim config:

```lua
-- In your init.lua or similar
local parser_config = require "nvim-treesitter.parsers".get_parser_configs()

parser_config.tide = {
  install_info = {
    url = "~/path/to/tree-sitter-tide", -- or git URL
    files = {"src/parser.c"},
    branch = "main",
    generate_requires_npm = false,
    requires_generate_from_grammar = false,
  },
  filetype = "tide",
}

-- Set up highlighting
require'nvim-treesitter.configs'.setup {
  ensure_installed = { "tide" },
  highlight = {
    enable = true,
  },
}
```

2. Install the parser:

```vim
:TSInstall tide
```

### Emacs (with tree-sitter-mode)

```elisp
;; Add to your Emacs configuration
(add-to-list 'tree-sitter-major-mode-language-alist '(tide-mode . tide))

(define-derived-mode tide-mode prog-mode "Tide"
  "Major mode for editing Tide files."
  (setq-local tree-sitter-hl-default-patterns
              (tree-sitter-langs--hl-default-patterns 'tide))
  (tree-sitter-hl-mode))

(add-to-list 'auto-mode-alist '("\\.tide\\'" . tide-mode))
(add-to-list 'auto-mode-alist '("\\.tid\\'" . tide-mode))
```

## 5. Web Assembly Build (for browser use)

```bash
# Install emscripten
# See: https://emscripten.org/docs/getting_started/downloads.html

# Build WASM version
tree-sitter build-wasm

# This creates tree-sitter-tide.wasm
```

Use in browser:

```javascript
const Parser = require('web-tree-sitter');

(async () => {
  await Parser.init();
  const Tide = await Parser.Language.load('path/to/tree-sitter-tide.wasm');
  const parser = new Parser();
  parser.setLanguage(Tide);

  const sourceCode = `
    chart bar "Example" {
      data {
        "A" -> 10;
        "B" -> 20;
      }
    }
  `;

  const tree = parser.parse(sourceCode);
  console.log(tree.rootNode.toString());
})();
```

## 6. MDBook Integration (Trident Plugin)

Create a Rust mdbook preprocessor:

```rust
// In your Trident preprocessor
use tree_sitter::{Parser, Language};

extern "C" { fn tree_sitter_tide() -> Language; }

pub fn process_tide_blocks(content: &str) -> String {
    let mut parser = Parser::new();
    let language = unsafe { tree_sitter_tide() };
    parser.set_language(language).unwrap();

    // Parse Tide code blocks and generate visualizations
    // ...
}
```

## 7. Language Server Protocol (LSP) Support

Create `tide-language-server` using the parser:

```javascript
// Basic LSP server setup
const {
  createConnection,
  TextDocuments,
  ProposedFeatures,
} = require('vscode-languageserver/node');

const Parser = require('tree-sitter');
const Tide = require('tree-sitter-tide');

const connection = createConnection(ProposedFeatures.all);
const documents = new TextDocuments(TextDocument);

const parser = new Parser();
parser.setLanguage(Tide);

documents.onDidChangeContent(change => {
  const tree = parser.parse(change.document.getText());
  // Provide diagnostics, completions, etc.
});

connection.listen();
```

## 8. Advanced Features

### Custom Scanner (if needed)

For complex lexical rules (like indentation-sensitive parsing), create `src/scanner.c`:

```c
#include <tree_sitter/parser.h>
#include <string.h>

enum TokenType {
  INDENT,
  DEDENT,
  NEWLINE
};

// Implement scanner functions
// ...

void *tree_sitter_tide_external_scanner_create() { /* ... */ }
void tree_sitter_tide_external_scanner_destroy(void *payload) { /* ... */ }
unsigned tree_sitter_tide_external_scanner_serialize(void *payload, char *buffer) { /* ... */ }
void tree_sitter_tide_external_scanner_deserialize(void *payload, const char *buffer, unsigned length) { /* ... */ }
bool tree_sitter_tide_external_scanner_scan(void *payload, TSLexer *lexer, const bool *valid_symbols) { /* ... */ }
```

### Query Files

Add additional query files for enhanced functionality:

**queries/locals.scm** (for scope tracking):
```scheme
(class_declaration
  name: (string_literal) @definition.class)

(method_declaration
  name: (identifier) @definition.method)

(parameter
  name: (identifier) @definition.parameter)

(field_declaration
  name: (identifier) @definition.field)
```

**queries/tags.scm** (for code navigation):
```scheme
(class_declaration
  name: (string_literal) @name) @definition.class

(enum_declaration
  name: (string_literal) @name) @definition.enum

(method_declaration
  name: (identifier) @name) @definition.method
```

## 9. Debugging

### Use the playground for interactive testing:

```bash
npm run playground
# Opens browser with interactive parser testing
```

### Debug specific files:

```bash
tree-sitter parse examples/test.tide --debug
```

### Generate and inspect the parse tree:

```bash
tree-sitter parse examples/test.tide --xml
```

## 10. Performance Optimization

1. **Minimize conflicts**: Review and resolve grammar conflicts
2. **Use tokens for keywords**: Define keywords as tokens when possible
3. **Optimize precedence**: Use precedence declarations to reduce ambiguity
4. **Limit lookahead**: Avoid patterns requiring excessive lookahead

## Common Issues and Solutions

### Issue: Parser conflicts
**Solution**: Add explicit precedence rules or restructure grammar rules

### Issue: Slow parsing on large files
**Solution**: Profile with `--time` flag and optimize expensive rules

### Issue: Incorrect highlighting
**Solution**: Debug with `tree-sitter highlight` command and adjust queries

### Issue: Missing nodes in parse tree
**Solution**: Check for hidden rules (prefixed with `_`) and adjust as needed

## Resources

- [Tree-sitter Documentation](https://tree-sitter.github.io)
- [Grammar Development Guide](https://tree-sitter.github.io/tree-sitter/creating-parsers)
- [Query Syntax Guide](https://tree-sitter.github.io/tree-sitter/using-parsers#query-syntax)
- [Neptune Project Documentation](https://github.com/your-org/neptune)
