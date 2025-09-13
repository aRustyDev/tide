# Syntax

| sytax tag  | description |
| ---------- | ----------- |
| `tide:erd` | description |
| `tide:erd` | description |
| `tide:erd` | description |
| `tide:erd` | description |

## Connections

- line
  - path
  - label
  - tags
  - end[](many|one)
  -

## Shapes

```tide:erd
---
config:
  look: handDrawn
  theme: neutral
data:
  - name: "CEO"
    type: "person"
    attributes:
      - name: "age"
        type: "number"
      - name: "salary"
        type: "number"
  - name: "CTO"
    type: "person"
    attributes:
      - name: "age"
        type: "number"
      - name: "salary"
        type: "number"
  - name: "Dev Team"
    type: "team"
    attributes:
      - name: "size"
        type: "number"
  - name: "QA Team"
    type: "team"
    attributes:
      - name: "size"
        type: "number"
  - name: "CFO"
    type: "person"
    attributes:
      - name: "age"
        type: "number"
      - name: "salary"
        type: "number"
  - name: "Accounting"
    type: "team"
    attributes:
      - name: "size"
        type: "number"
---
chart tree "Organization" {
    node "CEO" {
        node "CTO" {
            leaf "Dev Team" [value: 15];
            leaf "QA Team" [value: 8];
        }
        node "CFO" {
            leaf "Accounting" [value: 5];
        }
    }
}
```
