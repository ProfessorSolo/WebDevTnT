```html
<!-- Before: static block stack -->
<section class="panel-group">
  <article class="panel">Panel A</article>
  <article class="panel">Panel B</article>
  <article class="panel">Panel C</article>
</section>
```

```css
.panel-group {
  /* normal block flow */
}

.panel {
  padding: 1rem 1.5rem;
  background: var(--surface-elevated);
  border-radius: 0.75rem;
  margin-block-end: 1rem; /* manual spacing */
}
```

```html
<!-- After: Architect declares a flex container -->
<section class="panel-group is-flex">
  <article class="panel">Panel A</article>
  <article class="panel">Panel B</article>
  <article class="panel">Panel C</article>
</section>
```

```css
.panel-group.is-flex {
  display: flex;       /* flex container */
  gap: 1rem;           /* automatic gutters */
}

.panel-group.is-flex .panel {
  margin-block-end: 0; /* gap handles spacing now */
}
```