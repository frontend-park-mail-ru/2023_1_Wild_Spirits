import { VDOM, Component } from "modules/vdom";

import { svgLoader } from "modules/svgLoader";

type SVGInlineProps = {
    src: string;
    alt: string;
    className: string;
};

export class SVGInline extends Component<SVGInlineProps, { img: string }> {
    constructor(props: SVGInlineProps) {
        super(props);

        this.state = { img: this.props.alt };
    }

    didCreate() {
        console.error("this.didCreate");
        svgLoader.getImage(this.props.src).then((img) => {
            console.warn(this.props.src);
            this.setState({ img: img });
        });
    }

    render(): JSX.Element {
        return (
            <div className={this.props.className + " flex"}>
                <span dangerouslySetInnerHTML={{ __html: this.state.img }}> img </span>
            </div>
        );
    }
}
