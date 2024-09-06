## @html_first/web_component

-   this library are made so you can made `native web component` easier with `jsdoc` and
    `type hinting`, which both are our main concern, therefore we don't have plan to produce any
    form of `prebundled` for client side minification;
-   we uses `native web component` naming semantics, so if you already familiar with
    `handmade native web component`, you can use that knowledge to develop in this library or vice
    versa:
    > -   note: as we provide lightweight `signal based reactivity`, which is not provided in
    >     `native web component` internal API, if you are at someday wanted to go make truly
    >     `handmade native web component`, you need to keep that in mind;

## how to install

```shell
npm i @html_first/web_component
```

## classes API

-   `CustomTag`: register tagname;
-   `For`: handling looped tag;
-   `Let`: signal based reactivity;
-   `Derived`: signal based reactivity, wich value are derived from `Let<T>.value`;
-   `$`: side effect of `Let` / `Derived`;
-   `OnViewPort`: viewport observer;
-   `Lifecycle`: lifecycle observer;
-   `Ping`: trigger based callback integrated to the internal queue handler;
-   for global states consider using:
    > -   [`@html_first/simple_signal`](https://www.npmjs.com/package/@html_first/simple_signal)
    >     classes counterparts, OR
    > -   external state management of your own preference;
