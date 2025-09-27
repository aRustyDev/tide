# Parts

- DiagramKind
- DiagramVersion

```terraform
# Functions can be imported arbitrarily; but they must be globally unique
# - params must be schema'd; invalid values cause panic
fnName(p1, p2)
```

```terraform
# Imports / Version pinning / Module Sourcing
tide {
  # renderer level configs; used to control renderer engines (ie neptune)
  config {
    param = value
    param2 = {}
  }
  # global values; used for things like color, typography, etc.
  default {
    param = value
    param2 = {}
  }
  # Module bare configs; versions, module sourcing
  modules {
    protocol = "ssh" # Defaults to httpsf
    circle = {
      source  = "hashicorp/aws" # Defaults to github.com
      version = "~> 1.0.4"
    }
    bar = {
      source  = "https://example.com/path/to/module"
      version = "~> 1.0.4"
    }
    bar = {
      source  = "git@git.example.com:username/repo/tree/branch/path/to/module.git"
      version = "~> 1.0.4"
    }
  }
}

type "kind" "title" {
  param = "value"
}

chart "PieChart" "title" {
  config = CircleConfig
  data = Object{}
}

chart "bar" "title" {
  config = CircleConfig
  data = Object{}
}

```
