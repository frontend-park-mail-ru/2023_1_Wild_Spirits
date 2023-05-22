import { VDOM, Component } from "modules/vdom";

import { svgLoader } from "modules/svgLoader";

type SVGInlineProps = {
    src: string;
    alt: string;
    className?: string;
};

type SVGInlineState = {
    img: string;
    src: string;
};

export class SVGInline extends Component<SVGInlineProps, SVGInlineState> {
    constructor(props: SVGInlineProps) {
        super(props);

        this.state = { src: this.props.src, img: this.props.alt };
    }

    didCreate() {
        svgLoader.getImage(this.props.src).then(img => {
            this.setState({src: this.props.src, img: img})
        });
    }

    didUpdate(): void {
        if (this.props.src !== this.state.src) {
            svgLoader.getImage(this.props.src).then(img => {
                this.setState({src: this.props.src, img: img})
            });
        }
    }

    render(): JSX.Element {
        return (
            <div
                className={this.props.className ? this.props.className + " flex" : "flex"}
                dangerouslySetInnerHTML={{ __html: this.state.img }}>
            </div>
        );
    }
}
