---
title: Embed Adaptive Form in External Page
description: The page details down how to embed adaptive forms in an external web page. The assumption here is that customer has a react application deployed using nextjs and they want to embed an adaptive form in that application. This tutorial will work with nextjs/react but the fundamentals of embedding the page will be same with any react application.
tags:
  - Adobe
  - AEM
  - Adaptive Forms
  - Tutorial
updatedAt: 2020-10-01
---

# Introduction

The page details down how to embed adaptive forms in an external web page. The assumption here is that customer has a react application deployed using nextjs and they want to embed an adaptive form in that application. This tutorial will work with nextjs/react but the fundamentals of embedding the page will be same with any react application. Further there are other assumptions as well

1. The app server and AEM publish server are not exposed and are served via Apache (being used as reverse proxy). nginx can be used as well but the steps would differ as per the nginx documentation
2. All the servers/proxies are running on default ports on a single machine and http is being used to communicate between them. If not then the hostname/port has to be modified as per the requirements.

# Steps

## Setup apache as reverse proxy for the app server

1. In the httpd.conf file of your apache server, ensure the mod_proxy and mod_proxy_modules are enabled

```
LoadModule proxy_module modules/mod_proxy.so
LoadModule proxy_http_module modules/mod_proxy_http.so
```

2. Ensure that the reverse proxy paths are set properly. The paths mentioned below must be added in your server's configuration file and as mentioned above, the aem server is running on localhost:4503 and nextjs server is running on localhost:3000. You need to update them as per your deployment topology

```
# proxy for aem-forms
ProxyPass /content http://localhost:4503/content
ProxyPass /etc http://localhost:4503/etc
ProxyPass /etc.clientlibs http://localhost:4503/etc.clientlibs

ProxyPassReverse /content http://localhost:4503/content
ProxyPassReverse /etc http://localhost:4503/etc
ProxyPassReverse /etc.clientlibs http://localhost:4503/etc.clientlibs

# proxy for nextjs
ProxyPass /_next http://localhost:3000/_next
ProxyPass /samples http://localhost:3000/samples
ProxyPass /posts http://localhost:3000/posts

ProxyPassReverse /_next http://localhost:3000/_next
ProxyPassReverse /samples http://localhost:3000/samples
ProxyPassReverse /posts http://localhost:3000/posts
```

## Configure nextjs application to connect with AEM Forms

### Create some utility functions to fetch data from a rest end point

Create a utility to fetch data from a url. Though this is not needed, but creating that is generally useful and if you have a proper nextjs app you would already be having that. In absence of this utility you would need to directly call http.get and manipulate the output. For the purpose of this tutorial, this file is created at `<root>/utils/fetchUrl.js` where `<root>` is the root directory of your nextjs app

```jsx
const http = require("http");

var obj = {
  get: function (url, params, options) {
    var _paramString = params || "";
    if (typeof params == "object" && params != null) {
      _paramString = Object.keys(params)
        .reduce((accum, curr) => {
          return accum.concat([`${curr}=${params[curr]}`]);
        }, [])
        .join("&");
    }

    if (_paramString.length > 0 && url.indexOf("?") == -1) {
      _paramString = `?${_paramString}`;
    }

    return new Promise((resolve, reject) => {
      http.get(`${url}${_paramString}`, options, (res) => {
        const { statusCode } = res;
        const contentType = res.headers["content-type"];

        let error;
        // Any 2xx status code signals a successful response but
        // here we're only checking for 200.
        if (statusCode !== 200) {
          error = new Error("Request Failed.\n" + `Status Code: ${statusCode}`);
        }
        if (error) {
          console.error(error.message);
          // Consume response data to free up memory
          res.resume();
          reject(error);
          return;
        }

        res.setEncoding("utf8");
        let rawData = "";
        res.on("data", (chunk) => {
          rawData += chunk;
        });
        res.on("end", () => {
          try {
            resolve(rawData);
          } catch (e) {
            console.error(e.message);
          }
        });
      });
    });
  },
};

export default obj;
```

### Create a page in nextjs app where form needs to be embedded

1. Create a Page in your nextjs app where a form needs to be loaded. A page in nextjs app is a react component with some additional hooks that allows it to load data dynamically. For the purpose of this tutorial we will create a page at url /samples/embed_adaptive_form (which translates to create a js file `<root>/pages/samples/embed_adaptive_form.js` where `<root>` is the root directory of your nextjs app)

```jsx
class Sample extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <h1>This page embeds an Adaptive Form below</h1>
      </div>
    );
  }
}

export default Sample;
```

2. We will now create a function in the file that will fetch the Adaptive Form

```jsx
var loadAdaptiveForm = (path) => {
  return myhttp.get(`${path}/jcr:content/guideContainer.html`);
};
```

3. We will invoke this function and pass the data to the React Component via props. This part is nextjs specific but it can be done via any other framework like redux as well. The idea is to provide the content via props to react component

```jsx
export async function getStaticProps() {
  const data = await loadAdaptiveForm("http://localhost/content/forms/af/test");
  return {
    props: {
      data,
    },
  };
}
```

4. Now we will use the html passed to the react component

```jsx
  render() {
    return (
      <div>
        <h1>This page embeds an Adaptive Form below</h1>
        <main dangerouslySetInnerHTML={{ __html: this.props.data }}></main>
      </div>
    );
  }
}
```

### Connect with Form

To keep things simple in this tutorial we are showcasing a mechanism where we can pass the data to the form field via click of a button.

1. We will add a button and keep it disabled until the form is not loaded on the page. We are keeping a state in our component which we will toggle when the form gets loaded (mentioned later on)

```jsx
class Sample extends React.Component {
  constructor(props) {
    super(props);
    this.state = { formAvailable: false };
  }

  render() {
    return (
      <div>
        <h1>This page embeds an Adaptive Form below</h1>
        <button disabled={!this.state.formAvailable}>Click Me</button>
        <main dangerouslySetInnerHTML={{ __html: this.props.data }}></main>
      </div>
    );
  }
}
```

2. Now we will use the guideBridge API to let us know when the form gets loaded. As per the documentation when the component gets mounted on the page, we need to check for guideBridge or listen to an event which passes the guideBridge object in the payload. Once we get access to the object, we need to use the `connect` API which indicates that the form is available.

```jsx
class Sample extends React.Component {
  constructor(props) {...}
  componentDidMount() {
    if (window.guideBridge) {
      this.connect(window.guideBridge);
    } else {
      window.addEventListener("bridgeInitializeStart", function (evnt) {
        // get hold of the guideBridge object
        var gb = evnt.detail.guideBridge;
        this.connect(gb);
      });
    }
  }

  connect = (gb) => {
    gb.connect(() => {
      this.setState((state) => ({
        formAvailable: true,
      }));
    });
  };

  render() {
    ....
```

3. Now we will add a click handler on the button that will set the data to a field in the form

```jsx
class Sample extends React.Component {
  ...
  handleClick = () => {
    window.guideBridge.resolveNode(
      "guide[0].guide1[0].guideRootPanel[0].panel1[0].textbox1[0]" // som expression to be changed as per the form being used
    ).value = "done";
  };

  render() {
       ...
        <button disabled={!this.state.formAvailable} onClick={this.handleClick}>
          Click Me
        </button>
      ...
  }
}
```
