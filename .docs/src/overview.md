# Tide Overview

## What is Tide

Tide is a DSL implemented in [Rust/Kotlin] that provides a set of tools and
utilities for defining diagrams as code. It is designed to be fast, efficient,
and extensible. Its main goal is to support continuous documentation generation.

Tide is heavily inspired by Terraform as language, but is the spiritual successor
to Mermaid. It aims to provide a more robust, powerful, and feature-rich way to
create diagrams and visualizations.

It allows you to define complex relationships and layouts with ease, while
maintaining a clean and readable syntax.

## Tide vs Mermaid

Unlike Mermaid, Tide cannot be natively rendered in Markdown files. This is
because Tide is effectively a definition language that is compiled into a HTML/CSS
and JavaScript, and can then be rendered as SVG/PNG. While it 'does' have the
potential to be rendered in Markdown files, it is not currently supported.
Also any potential support for this would implicitly require feature regressions
on Tides end or significant feature expansion on any Markdown implementations end.

## How to Use Tide

1. Define something in Tide language
2. Compile it to HTML/CSS and JavaScript
3. Render it as SVG/PNG

## Continuous Documentation Generation

Triton aims to provide per language macro/preprocessor based documentation generation.

```rust
#[tide(cfg, foo)]
struct User {
    id: u32,
    name: String,
    email: String,
}
```

```go
//tide:bar param1 param2
struct User {
    id: u32,
    name: String,
    email: String,
}
```

```c
#pragma tide_node(of, uuid)
struct T {
    int i;
    short j;
double k;
};
```

```python
@tide(cfg, foo)
class foo:
    def __init__(self):
        self.user = User()
```

## Examples
