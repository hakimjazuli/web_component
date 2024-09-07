## @html_first/web_component

-   this library are made so you can made `native web component` easier with `jsdoc` and
    `type hinting`, which both are our main concern, therefore we don't have plan to produce any
    form of `prebundled` for client side minification;
-   we uses `native web component` naming semantics, so if you already familiar with
    `handmade native web component`, you can use that knowledge to develop in this library or vice
    versa:
    > -   note: as we provide lightweight `signal based reactivity` (queue handlers included), which
    >     is not provided in `native web component` API, when you are at someday wanted to go make
    >     `handmade native web component`, you need to keep that in mind;
-   our `signal based reactivity` are tailored for this specific library, and likely not play well
    with other library/framework's "DOM" manipulation, it can still however make an effects callback
    using our `$`, `Derived`

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
-   `QuerySignal`: signal based query parameter;
    > -   can be used as pseudo router;
-   `Ping`: trigger based callback integrated to the internal queue handler;
