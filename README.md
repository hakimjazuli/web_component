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
-   `Render`: startup spa;
-   `SimpleElement`: `document.createElement` helper (as well as property and attribute setter) to
    quickly generate `element` and `outerHTML`;
-   `Let`: signal based reactivity;
-   `Derived`: signal based reactivity, wich value are derived from `Let<T>.value`;
-   `$`: side effect of `Let` / `Derived`;
-   `If`: handling conditional innerHTML value;
-   `For`: handling looped tag;
-   `LetList`: one dimensional json array helper, recomended to be used as signal for `For`;
    > -   technically using it for `FOR` will uses diffing on each childs on every single run;
    > -   however it only takes account the only reactive part of the childElement;
    > -   so it's still kind of `fine grained reactivity`-`ish(?)`;
    > -   extended from `Let`, therefore you can still modify individual list to not to trigger
    >     whole diffing childElements;
-   `OnViewPort`: viewport observer;
-   `Lifecycle`: lifecycle observer;
-   `LetURL`: signal based reactivity that reflect to url search param;
-   `Ping`: trigger based callback integrated to the internal queue handler;
