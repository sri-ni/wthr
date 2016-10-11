var wthr = window.wthr || null;
if (wthr && wthr.init) {
  wthr.init({
    el: 'wthr-widget-box',
    location: 'milan'
  });
}
