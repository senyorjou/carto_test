### Test #1 for Carto. Render a dataset.

#### GOAL
Render a dataset from Carto SQL API in a browser.

#### Tools used
ES5 Javascript. No external libraries.

_Being an occasional javascript developer I need some time to warm up and feel confortable, so using vanilla js on a test like this helps me focus on the solution using simple methods, although usually require more time and definitively involves more LOC I feel stepping on solid ground_

#### Development process.
Just began with a simple canvas displaying some shapes. Wanted to know if canvas had some buffer properties and how coordinate system works.

Added some movement and zoom using simple buttons. That will be useful when rendering real data to find elements offscreen.

Decided to use few models (Point, Shape and Map) as basic containers for data. But overall architecture not to be very proud of.

Read real data from a small local json file. All thoughts about zoom and pan were wrong. Switched to a projector, data is transformed to local coordinates before render. Transformation involves pan only, no rotation nor skew.

Switched to Carto SQL API. `loadJSON` function stoled from somewhere, I'm unable to create one for myself, honestly.

Splitted API requests on N records chunks and invoked using a queue.

Added some colors. Can't deduce the combination of data related to shape final color, so I created a simple rule using a value from API.


#### GOALS COMPLETED
##### Render data
Yes. But need to adjust line thickness when zooming. And, more important suppression of small elements when are grouped inside same pixel on small zooms.

##### Pan & Zoom
Yes. Using mouse, mousewheel and `+`, `-` buttons. But there's a bug on Y-axis collision detection, and elements disappear when touch Y-axis limits.

##### Loading from API
Yes. But while loading data, map pans around because of auto-centering.


#### Problems
- Viewport not correctly handled. Calculation for elements `(x, y)` coordinates hard to understand and not maintainable.
- Works well with small set of shapes, but unable to use with complete >40K elements from API on a std laptop on a small zoom.
- No fixed center when loading. Map moves while limits grow
- No tests. No grunt/webpack used

#### Why I choose test #1?
Well, I'm not doing HTML/CSS for a quite long time now. Last time I had to do some HTML/CSS serious work was 4 years ago. I like coding and #1 was a fun challenge to complete.
