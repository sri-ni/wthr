# wthr

### Weather Widget

Embeddable reusable plain javascript widget.

### Usage


#### Embed script
Place this script at the end of your base render template, above the `</body>` tag.
```
<script id="wthr-widget-embed" type="text/javascript" class="wthr widget">
  (function() {
    function load_wthr(){
      var s = document.createElement('script');
      s.type = 'text/javascript';
      s.async = true;
      var theUrl = 'https://s3.amazonaws.com/wdgts/wthr/wthr.js';
      s.src = theUrl
        + ( theUrl.indexOf("?") >= 0 ? "&" : "?")
        + 'ref='
        + encodeURIComponent(window.location.href);
      var embedder = document.getElementById('wthr-widget-embed');
      embedder.parentNode.insertBefore(s, embedder);
    }
  if (window.attachEvent)
    window.attachEvent('onload', load_wthr);
  else
    window.addEventListener('load', load_wthr, false);
  })();
</script>
```

#### Payload script
**Info:** No action here.
It's hosted in an AWS S3 bucket `https://s3.amazonaws.com/wdgts/wthr/wthr.js`

#### Payload stylesheet
**Info:** No action here.
It's hosted in an AWS S3 bucket `https://s3.amazonaws.com/wdgts/wthr/wthr.css`

#### Initialization
Provide the container *id* ```<div id='this-one'></div>``` to render the widget, along with the location in the format of *city* or *city,state_initials*.

```
var wthr = window.wthr || null;

if (wthr && wthr.init) {
  wthr.init({
    el: 'wthr-widget-box',
    location: 'milan'
  });
}
```
