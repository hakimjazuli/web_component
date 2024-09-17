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

### Notes

-   <sup id="note-1"><a href="#ref-1">1)</a></sup> it still at least recommended to bundled for your
client side minification;
-   <sup id="note-2"><a href="#ref-2">2)</a></sup> uses cached `[attributeName]` and `documentScope`
to precisely target elements;
-   <sup id="note-3"><a href="#ref-3">3)</a></sup> the `arg0/first` argument of the async callback
of `$` can be used to minimize first hydration time by returning early


<h2 id="exported-api-and-type-list">exported-api-and-type-list</h2>

- [$](#$)

- [Animation](#animation)

- [App](#app)

- [DefineQRouter](#defineqrouter)

- [DefineShortCuts](#defineshortcuts)

- [DefineStorage](#definestorage)

- [Derived](#derived)

- [Event_](#event_)

- [For](#for)

- [htmlLiteral](#htmlliteral)

- [If](#if)

- [Let](#let)

- [OnViewPort](#onviewport)

- [Ping](#ping)

- [Select](#select)

- [SimpleElement](#simpleelement)

- [WebComponent](#webcomponent)

- [WorkerMainThread](#workermainthread)

- [WorkerThread](#workerthread)

<h2 id="$">$</h2>

*) <sub>[go to exported list](#exported-api-and-type-list)</sub>

generate side effect for `signal` based reactivity such as for:- [Let](#let)```jsconst letExample = new Let('')new $(async(first)=>{ const value = test.value; if(first){     return;     // return early if you want to opt out from handling the effect immediately,     // also by doing this you can make the `$` slightly more performance 1) when dealing with `async await` on hydration,     // such as data fetching; }     // handle value})// 1) and when all of the effects is registered, you can call `letExample.call$` to call for effect in parallel;```- [Derived](#derived)```js// bassically the same with `Let` but use `new Derived````

*) <sub>[go to exported list](#exported-api-and-type-list)</sub>


<h2 id="animation">Animation</h2>

*) <sub>[go to exported list](#exported-api-and-type-list)</sub>

collections of static methods helper for animation;static method prefixed with `animation` can be used to generate recuring frame,which in turn can be used in the callback to animate stuffs

*) <sub>[go to exported list](#exported-api-and-type-list)</sub>


<h2 id="app">App</h2>

*) <sub>[go to exported list](#exported-api-and-type-list)</sub>

class helper to render `ReturnType<WebComponent["tag"]>` `document.body`:- why `ReturnType<WebComponent["tag"]>` instead of instance of `WebComponent`, `static tag` have functionality to modify options(like props value);- so you can edit the `tag` option without changing the default behaviour of the `Root Component`;

*) <sub>[go to exported list](#exported-api-and-type-list)</sub>


<h2 id="defineqrouter">DefineQRouter</h2>

*) <sub>[go to exported list](#exported-api-and-type-list)</sub>

allow the usage of search query based router through class instantiation;- register by putting it in the instantiation of [App](#app)

*) <sub>[go to exported list](#exported-api-and-type-list)</sub>


<h2 id="defineshortcuts">DefineShortCuts</h2>

*) <sub>[go to exported list](#exported-api-and-type-list)</sub>

create shortcut through class instantiation;- register by putting it in the instantiation of [App](#app)

*) <sub>[go to exported list](#exported-api-and-type-list)</sub>


<h2 id="definestorage">DefineStorage</h2>

*) <sub>[go to exported list](#exported-api-and-type-list)</sub>

create named storage (`localStorage` or `sessionStorage`) through class instantiation;- register by putting it in the instantiation of [App](#app)

*) <sub>[go to exported list](#exported-api-and-type-list)</sub>


<h2 id="derived">Derived</h2>

*) <sub>[go to exported list](#exported-api-and-type-list)</sub>

- `signal` based reactivity, wich value are derived from reacting to [`Let<T>.value`](#let) effects that are called in the `asyncCallback` this class instantiation;```js// @ts-check// in WebComponent scopeconst letSingle = new Let(1);const doubleExample = new Derived(async()=>{	const value = letSingle.value; // autoscubscribed to `letSingle` value changes;return value * 2; // returned value are to be derivedValue});```- property `attr`, string helper to identify the `HTML attributeName````js// in WebComponent scope// you can use `attr` to bind it to a HTML tag as attributehtmlTemplate: htmlLiteral`<div ${doubleExample.attr}="innerText"></div>````- static method `dataOnly`, a behaviour modifier for this class instantiation, to optout from this library built in `setDOMReflector`;```js// in WebComponent scopeconst letSingle = new Let(1);const dataOnlyExample = Derived.dataOnly(async()=>{ return value * 2;}) // this instance have undefined `attr` value;```

*) <sub>[go to exported list](#exported-api-and-type-list)</sub>


<h2 id="event_">Event_</h2>

*) <sub>[go to exported list](#exported-api-and-type-list)</sub>

`eventListener` helper to create `autoqueued`-`autocsoped` callback;```js// @ts-checksomeObject.addEventListener('click', Event_.listener( (event) => {// code}))```- why?> - well, our `signal` based reactivity is all `autoscoped` on `WebComponent ShadowRoot`, but with event handler, it will be out of scoped;> - with this static method, you can safely instantiated our `signal`

*) <sub>[go to exported list](#exported-api-and-type-list)</sub>


<h2 id="for">For</h2>

*) <sub>[go to exported list](#exported-api-and-type-list)</sub>

`data and looped component` helper;- create new instance of this class globally to define data list that are to be rendered or might be refenced;```js// @ts-checkimport { For } from "@html_first/web_component"const forExample = new For({options})```- assigning rendered html to `WebComponent````js// in WebComponent scopehtmlTemplate: htmlLiteral`forExample.tag(options).string`;```- modify data```js// in WebComponent scopeconst index = 0; // modify index0 of the for.data;const dataKey = "value";// const dataKey = "innerHTML"; the key is defined on class instantiation `options.listTemplate`forExample.data[index][dataKey].value='test';```

*) <sub>[go to exported list](#exported-api-and-type-list)</sub>


<h2 id="htmlliteral">htmlLiteral</h2>

*) <sub>[go to exported list](#exported-api-and-type-list)</sub>

html-literal syntax helper- `lit` has amazing .vs-code plugin to highlight and format template literal, install `lit-plugin`;- problem is, it needs to be wiriten like with templateStingArray function```jshtmlLiteral`${htmlStringLiterals}`;```- so this is just function helper to achieve that, without installing lit on your project;- technically we can use html, but it somehow messes with `autoImport`;- you need to configure `lit-plugin` settings to assign `htmlLiteral`, and if any `lit-plugin` errors shows up;- why `lit-plugin`;> - it's the best plugin for handling html literals in js that is true to keep tracks `<style></style>` css syntax (not showing weird css in js syntax like `camellCase`/`pascalCase` just because it's on `js` file);

*) <sub>[go to exported list](#exported-api-and-type-list)</sub>


<h2 id="if">If</h2>

*) <sub>[go to exported list](#exported-api-and-type-list)</sub>

- handling conditional string as `innerHTML`;```jshtmlTemplate: htmlLiteral`${new If.tag(options).string}````> - the functionality is the same with using:```jshtmlTemplate: htmlLiteral`<div ${derivedIntance.attr}="innerHTML"></div>````> -   `WARNING!!!`: you better make sure the data is safe;

*) <sub>[go to exported list](#exported-api-and-type-list)</sub>


<h2 id="let">Let</h2>

*) <sub>[go to exported list](#exported-api-and-type-list)</sub>

- `signal` based reactivity;```js// @ts-check// in WebComponent scopeconst letSingle = new Let(1);```- property `attr`, string helper to identify the `HTML attributeName````js// in WebComponent scope// you can use `attr` to bind it to a HTML tag as attributehtmlTemplate: htmlLiteral`<div ${letSingle.attr}="innerText"></div>````- static method `dataOnly`, a behaviour modifier for this class instantiation, to optout from this library built in `setDOMReflector`;```js// in WebComponent scopeconst dataOnlyExample = Let.dataOnly(1) // this instance have undefined `attr` value;```- assigning newValue to Let insance:```jsconst letSingle = new Let(1);letSingle.value++; // 2;letSingle.value = 3 // 3;```

*) <sub>[go to exported list](#exported-api-and-type-list)</sub>


<h2 id="onviewport">OnViewPort</h2>

*) <sub>[go to exported list](#exported-api-and-type-list)</sub>

monitor element attached with Intstance `attr` property```js// in WebComponent scopeconst componentExample = new WebComponent({	lifecycle:()=>{		const onViewPortExample = new OnViewPort(options);		return {			htmlTemplate: htmlLiteral`<div ${onViewPortExample.attr}></div>`			}		}	})```

*) <sub>[go to exported list](#exported-api-and-type-list)</sub>


<h2 id="ping">Ping</h2>

*) <sub>[go to exported list](#exported-api-and-type-list)</sub>

trigger based callback integrated to the internal library  queue handler;can be created using:- class instantiation;- static method calls (documented internally, just hit ctrl+space and you are good);standard behaviour:- asyncCallback will be called upon declaration (except static method `unScopedOnCall`);- you can opt out by returning early```jsconst pingExample = new Ping(async(first)=>{ // or static method	if (first) {		return;	}})// pingExample.ping(); // to call it later```

*) <sub>[go to exported list](#exported-api-and-type-list)</sub>


<h2 id="select">Select</h2>

*) <sub>[go to exported list](#exported-api-and-type-list)</sub>

select element based on their `attributeName````js// in WebComponent scopeconst componentExample = new WebComponent({	lifecycle: ({ shadowRoot }) => {		const letExample = new Let('test');		return {			htmlTemplate: htmlLiteral`<div ${letExample.attr}></div>`,			connectedCallback: () => {				new Select(letExample, shadowRoot).handle(...handleArgs);			},		};	},});```

*) <sub>[go to exported list](#exported-api-and-type-list)</sub>


<h2 id="simpleelement">SimpleElement</h2>

*) <sub>[go to exported list](#exported-api-and-type-list)</sub>

- document.createElement` helper- as well as property and attribute setter```jsconst simpleElementExample = new SimpleElement(options);```

*) <sub>[go to exported list](#exported-api-and-type-list)</sub>


<h2 id="webcomponent">WebComponent</h2>

*) <sub>[go to exported list](#exported-api-and-type-list)</sub>

it uses `native web component semantics`;```js// declaringexport const Button = new WebComponent(options);// making html element string// in WebComponent scopehtmlTemplate: htmlLiteral`${Button.tag(options).string}````

*) <sub>[go to exported list](#exported-api-and-type-list)</sub>


<h2 id="workermainthread">WorkerMainThread</h2>

*) <sub>[go to exported list](#exported-api-and-type-list)</sub>

helper class for registering and postMessage to webWorker```jsconst worker = new WorkerMainThread(options);worker.postMessage(message);```

*) <sub>[go to exported list](#exported-api-and-type-list)</sub>


<h2 id="workerthread">WorkerThread</h2>

*) <sub>[go to exported list](#exported-api-and-type-list)</sub>

helper class to define web worker thread;```jsnew WorkerThread({	onMessage: ({ event, postMessage }) => {		const message = undefined;		// code to handle the message		postMessage(message);	},});```

*) <sub>[go to exported list](#exported-api-and-type-list)</sub>
