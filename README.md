## @html_first/web_component

-   this library are made so you can make `native web component` easier with `jsdoc` and
    `type hinting`, which both are our `main concern`, therefore we don't have plan to produce any
    form of `prebundled` for client side minification;
-   it functions as `lightweigth`-`reactive`-`native web component`-`wrapper`
-   we uses `native web component` naming semantics, so if you already familiar with
    `handmade native web component`, you can use that knowledge to develop in this library or vice
    versa:
    > -   note: as we provide lightweight `signal based reactivity` (queue handlers included), which
    >     is not provided in `native web component` API, when you are at someday wanted to go make
    >     `handmade native web component`, you need to keep that in mind;
-   our `signal based reactivity` are tailored for this specific library, and likely to not play
    well with other library/framework's "DOM" manipulation, it can still however to make an
    `effects` using `$`;

## how to install

```shell
npm i @html_first/web_component
```

## exported classes API

-   `WebComponent`: register tagname;
-   `Render`: startup spa;
-   `SimpleElement`: `document.createElement` helper (as well as property and attribute setter) to
    quickly generate `element` and `outerHTML`;
-   `Let`: `signal` based reactivity;
-   `Derived`: `signal` based reactivity, which value are derived from `Let<T>.value`;
    > -   all `signal` based reactivity are scoped to where it's declared;
    > -   if it's declared outside `WebComponent` it will not reflect to DOM(suited for global
    >     `signal` efficiency, since it will not trigger `simple_signal` `setDomReflector`);
    > -   use `static method` `Ping.scoped(options)` to manually scope when handling `eventListener`
    >     and the likes;
    > -   any `signal.value` before returned at `subscribe proccess/instantiation` will be
    >     `subscribed` for `effects`;
-   `If`: handling conditional string as `HTML string`;
    > -   `options`: you can also achieve the same functionality by `${signal.attr}="innerHTML"`,
    >     this method doesn't create `WebComponent`;
    > -   `WARNING!!!`: you better make sure the string data is safe;
-   `For`: handling looped tag;
    > -   allowed to insert parent element, usefull for `select` tag and the likes;
    > -   `thisInstance.tag` can only be called once to assign initial data and to render to
    >     `WebComponent` scope;
-   `select`: helper to select element of monitored `signal` element;
-   `OnViewPort`: viewport observer;
-   `LetURL`: `signal` based reactivity that reflect to url search param;
-   `Ping`: trigger based callback integrated to the internal queue handler;
    > -   immediately fired upon instantiation, use `arg0` to return early as needed;

## Features

-   uses` native web component` API runtime:
    > -   `scoped` styles:
    >     > -   tagScoped;
    >     > -   globalScoped;
    > -   `lifecycle` callbacks:
    >     > -   `connected`;
    >     > -   `disconnected`;
    >     > -   `attributeChanges`;
    >     > -   `adopted`;
    > -   easier debugging;
    >     > -   the browser can<sup id="ref-1"><a href="#note-1">1)</a></sup> runs the code you
    >     >     write in our wrapper, `as is`, so no extra tools needed for debugging;
-   `minimum abstraction overhead`, as significant amount of the functionalities is already being
    handled by browser `natives` API;
-   native web component naming `semantics`;
    > -   if you know `native web component`s callbacks, then you know `@html_first/web_component`s
    >     callbacks;
-   `signal` based reactivity:
    > -   based on popular `SolidJS` `signals` paradigm:
    >     > -   `computed` value using `Derived`;
    >     > -   auto subscribes using `$`;
-   true<sup id="ref-2"><a href="#note-2">2)</a></sup> fine grained reactivity;
    > -   lightweight yet high performing:
    >     > -   even when taking into account for<sup id="ref-2"><a href="#note-2">2)</a></sup>,
    >     >     `signal` reactivity are automatically scoped to each ` document` or `shadowRoot `
    >     >     it's being instantiated to;
    > -   data reflects to `shadowRoot` with minimal checks;
    >     > -   no diffing;
    >     > -   no VDOM;
-   built-in `async` queues handler;
    > -   reactivity functionality works in `async` scopes;
    > -   effect `$` auto subscribed under `Promise.all` handler to minimize waterfall after the
    >     first hydration (during auto
    >     `subscribe proccess`)<sup id="ref-3"><a href="#note-3">3)</a></sup>;

---

### Notes

-   <sup id="note-1"><a href="#ref-1">1)</a></sup> it still at least recommended to bundled for your
    client side minification;
-   <sup id="note-2"><a href="#ref-2">2)</a></sup> uses cached `[attributeName]` and `documentScope`
    to precisely target elements;
-   <sup id="note-3"><a href="#ref-3">3)</a></sup> the `arg0/first` argument of the async callback
    of `$` can be used to minimize first hydration time by returning early
