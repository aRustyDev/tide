# Mermaid Rewrite

## Features

- Build time configured interactivity (live-editor)
- Ideally support UML && Mermaid && Mermaid.extended
- Pluggable icons for diagrams
    - Make Icon libraries swappable
    - Use Icon Map for user-friendly icon declaration
- Make WYSIWYG visual editor with compiled diagram output; support easy local definition with deployment friendly artifacts/diagram code generation.

## Diagrams

- flowchart
- Sequence Diagram
- class (vs Object Diagram)
- State Machine Diagram
- entity-relationship (DB Diagram)
- data-flow-diagram
- Sitemap diagram
- Spider diagrams
- BPMN diagrams: model business processes
- git-graph
- user-journey
- user-story
- use-case
- c4-diagram
- mind-map
- org-chart
- network-diagram (Network graph, Network mapping, Network visualization)
- Ishikawa diagram
- SWOT Analysis Diagram
- Deployment Diagram (this is probably a sub-case of a relationship diagram)
- Package Diagram
- Composite Structure Diagram
- Matrix diagram
- Chord diagram
- Arc diagram
- Sankey

## Charts

### Foundational: Circular Charts

- pie (Pie graph, Pizza chart, Circle chart)
    - Radial bar chart (Circular bar chart)
    - Donut chart
    - Semicircle donut chart (Half moon chart, Half donut chart, Semi-circle doughnut chart)
    - Circular gauge (Angular gauge, Radial gauge chart) # Not sure about this one
    - Nightingale chart (Nightingale's graph, Nightingale rose chart, Rose diagram, Coxcomb chart,  Polar area chart)
        - identical Component radius arcs
        - value: represented by area
        - calculation: `A=sr/2` (`r` = Radius, `A` = Area, `s` = arc length)
        - radius is the part that changes. calculate by `r = 2A/s`, since `A` and `s` are known
    - Sunburst chart (Multi-level pie chart, Multilayer pie chart, Sunburst graph, Ring chart, Radial treemap)

### Foundational: Point Charts

- line-graph
    - Parallel coordinates (Parallel plot, Parallel coordinates plot)
    - Slope chart
    - Area chart
    - Stacked area chart (Stacked area graph)
    - Stream graph (Streamgraph, ThemeRiver)
    - Bump chart
    - Bump area chart
    - Spline chart (Spline graph, Curve chart)
    - Step line chart (Step chart, Stepped line graph)
- scatter-plot (Scatterplot, Scatter chart, Scattergram, Scatter diagram, Scatter graph)
    - Quadrant chart
    - Bubble chart
    - Connected scatter plot
    - Contour plot
    - Strip plot (Individual value plot, Single-axis scatter plot)
    - Jitter plot (Jittered strip plot, Jittered individual value plot)

### Foundational: Bar Charts

- column chart
- Lollipop chart
- Grouped bar/column chart
- Stacked bar chart & stacked column chart
- Bullet chart
- funnel chart
    - Pyramid chart & Funnel chart (Triangle chart)
- histogram (Frequency distribution graph, Frequency distribution chart)
    - Radial histogram (Angular histogram, Circular histogram, Polar histogram)
- Range plot
    - Dumbbell (Dumbbell plot, Dumbbell chart, Connected dot plot, Dumbbell dot plot, DNA chart, Barbell chart)
    - Diverging (stacked) bar/column chart
    - Population pyramid (Age-sex pyramid, Age structure diagram)
    - gantt
    - Barcode chart
    - Dot plot (Dot chart)
    - Waterfall chart (Flying bricks chart, Mario chart, Bridge chart, Cascade chart)
- Radar chart (Spider chart, Spider graph, Web chart, Spider web chart, Star chart, Star plot, Cobweb chart, Irregular polygon, Kiviat diagram)

### Foundational: Table Charts

- Table chart
    - Matrix chart
    - small-multiples
    - Categorical scatter plot
    - Icon array (pictograph)
    - Waffle chart (Square pie chart, Square area chart, Gridplot)
    - Tile map

### Foundational: Tree Charts

- Treemaps
    - Circular treemap (Circular packing, Circle packing)
    - Convex treemap (Voronoi treemap, Polygonal partition)
- Marimekko chart (Mekko chart, Mosaic chart, Mosaic plot)
- tree-diagram
    - Dendrogram (Phylogenetic tree)
- venn-diagram (Set diagram, Logic diagram)
    - Euler diagram

### Compound charts

- Box chart (Box plot, Boxplot, Box-and-whisker plot/chart, Whisker plot)
    - Candlestick chart (Japanese candlestick chart)
    - OHLC chart
    - Violin plot

### Meta Charts

- Heatmap (Heat map, Heat table, Density table)
    - Hexagonal binning (hexagonal plot, hexagonal bin plot)
    - One dimensional heatmap
    - Geographic heatmap (hot spot map, geo heat map, density heatmap)
    - Choropleth map
- Icon chart (Proportional area chart)
- Pictogram (Pictorial chart, Proportional unit chart, Picture graph)

### Computed Charts

- Density plot (Kernel density plot, Density trace graph)
    - Ridgeline plot (Joy plot, Joyplot)
    - Horizon chart
    - Beeswarm chart (Swarm plot)
    - Violin plot
