# Neptune API

https://seaborn.pydata.org/examples/index.html
https://www.datylon.com/blog/types-of-charts-graphs-examples-data-visualization

### `charts.neptune/v1`: Are graphical depictions of data, and to some extent the relationships in that data
- **Kind**: `Bar`
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
- **Kind**: `Circle`
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
- **Kind**: `Line`
    - Parallel coordinates (Parallel plot, Parallel coordinates plot)
    - Slope chart
    - Area chart
    - Stacked area chart (Stacked area graph)
    - Stream graph (Streamgraph, ThemeRiver)
    - Bump chart
    - Bump area chart
    - Spline chart (Spline graph, Curve chart)
    - Step line chart (Step chart, Stepped line graph)
- **Kind**: `Matrix`
    - Table chart
    - Matrix chart
    - small-multiples
    - Categorical scatter plot
    - Icon array (pictograph)
    - Waffle chart (Square pie chart, Square area chart, Gridplot)
    - Tile map
- **Kind**: `Point`
    - scatter-plot (Scatterplot, Scatter chart, Scattergram, Scatter diagram, Scatter graph)
    - Quadrant chart
    - Bubble chart
    - Connected scatter plot
    - Strip plot (Individual value plot, Single-axis scatter plot)
    - Jitter plot (Jittered strip plot, Jittered individual value plot)
- **Kind**: `Tree`
    - Treemaps
        - Circular treemap (Circular packing, Circle packing)
        - Convex treemap (Voronoi treemap, Polygonal partition)
    - Marimekko chart (Mekko chart, Mosaic chart, Mosaic plot)
    - tree-diagram
        - Dendrogram (Phylogenetic tree)
    - venn-diagram (Set diagram, Logic diagram)
        - Euler diagram

### `meta.charts.neptune/v1`: When the data presented is a modified version of the data provided
- **Kind**: `Heatmap`
    - Heatmap (Heat map, Heat table, Density table)
        - Hexagonal binning (hexagonal plot, hexagonal bin plot)
        - One dimensional heatmap
        - Geographic heatmap (hot spot map, geo heat map, density heatmap)
        - Choropleth map
- **Kind**: `Icon`
    - Icon chart (Proportional area chart)
- **Kind**: `Pictogram`
    - Pictogram (Pictorial chart, Proportional unit chart, Picture graph)
- **Kind**: `Cluster`
    - Contour plot

### `compound.charts.neptune/v1`: When the data presented requires multiple component data points
- **Kind**: `Box`
    - Box chart (Box plot, Boxplot, Box-and-whisker plot/chart, Whisker plot)
    - Candlestick chart (Japanese candlestick chart)
    - OHLC chart
    - Violin plot

### `computed.charts.neptune/v1`: When the data presented is an abstraction of the data provided
- **Kind**: `Density`
    - Density plot (Kernel density plot, Density trace graph)
    - Ridgeline plot (Joy plot, Joyplot)
    - Horizon chart
    - Beeswarm chart (Swarm plot)
    - Violin plot

## `diagrams.neptune/v1`: Are graphical depictions of relationships, sequences, processes, and ideas
- **Kind**: `Flow`
- **Kind**: `Sequence`
- **Kind**: `Class`
- **Kind**: `Object`
- **Kind**: `State`
- **Kind**: `EntityRelationship`
- **Kind**: `Sitemap`
- **Kind**: `Spider`
- **Kind**: `BPMN` (model business processes)
- **Kind**: `GitGraph`
- **Kind**: `UserJourney`
- **Kind**: `UserStory`
- **Kind**: `UseCase`
- **Kind**: `C4`
- **Kind**: `MindMap`
- **Kind**: `Organization`
- **Kind**: `Network`
- **Kind**: `Ishikawa`
- **Kind**: `SWOTAnalysis`
- **Kind**: `Package`
- **Kind**: `CompositeStructure`
- **Kind**: `Matrix`
- **Kind**: `Chord`
- **Kind**: `Arc`
- **Kind**: `Sankey`
- **Kind**: `Deployment`
- **Kind**: `ThreatModel`
- **Kind**: `MemoryMap`
- **Kind**: `PermissionsMap`
