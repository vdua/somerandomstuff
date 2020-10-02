import Layout from "../../components/layout";
import myhttp from "../../utils/fetchUrl";
import { render } from "react-dom";
import React from "react";

class Sample extends React.Component {
  constructor(props) {
    super(props);
    this.state = { formAvailable: false };
  }

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

  handleClick = () => {
    window.guideBridge.resolveNode(
      "guide[0].guide1[0].guideRootPanel[0].panel1[0].textbox1[0]"
    ).value = "done";
  };

  render() {
    return (
      <div>
        <h1>This page embeds an Adaptive Form below</h1>
        <button disabled={!this.state.formAvailable} onClick={this.handleClick}>
          Click Me {this.state.formAvailable.toString()}
        </button>
        <main dangerouslySetInnerHTML={{ __html: this.props.data }}></main>
      </div>
    );
  }
}

export default Sample;

var loadAdaptiveForm = (formname) => {
  return myhttp.get(
    `http://localhost/content/forms/af/${formname}/jcr:content/guideContainer.html`,
    { wcmmode: "disabled" },
    { auth: "admin:admin" }
  );
};

export async function getStaticProps() {
  // Get external data from the file system, API, DB, etc.
  const data = await loadAdaptiveForm("test");

  // The value of the `props` key will be
  //  passed to the `Home` component
  return {
    props: {
      data,
    },
  };
}
