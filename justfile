install:
    pnpm run langium:generate
    pnpm run build
    vsce package
    just -f langium/justfile schema
    just -f langium/justfile grammar
    just -f langium/justfile validations
    just -f langium/justfile ast
    just -f langium/justfile tests
    just -f langium/justfile install
    just -f grammars/tree-sitter/justfile install
    just -f extensions/zed/justfile install

prereqs:
    volta setup
    volta install node
    volta install pnpm
    volta install yo generator-langium
    volta install @vscode/vsce
    volta pin pnpm
