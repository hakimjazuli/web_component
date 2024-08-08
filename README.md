## @html_first/web_component

-   this library are made so you can made `native web component` easier with `jsdoc` and
    `type hinting`, which both are our main concern, therefore we don't have plan to produce any
    form of prebundled for client side minification;
-   we uses `native web component` naming semantics, so if you already familiar with
    `handmade native web component`, you can use that knowledge to develop this library or vice
    versa;

## how to install

```shell
npm i @html_first/web_component
```

## classes API

-   `CustomTag`: register tagname;
-   `Let`: signal based reactivity;
-   `Derived`: signal based reactivity, wich value are derived from `Let.value`;
-   `OnViewPort`: viewport observer;
-   `$`: import `$` from dependency `@html_first/simple_signal`;
-   for global states consider using `@html_first/simple_signal` classes counterparts;
