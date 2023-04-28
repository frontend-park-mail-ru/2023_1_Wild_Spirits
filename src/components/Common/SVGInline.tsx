import { VDOM, Component } from "modules/vdom";

import { svgLoader } from "modules/svgLoader";

type SVGInlineProps = {
    src: string, 
    alt: string, 
    className: string
}

export class SVGInline extends Component<SVGInlineProps, {img: string}> {
    constructor(props: SVGInlineProps) {
        super(props);

        this.state = {img: this.props.alt};
    }

    didCreate() {
        svgLoader.getImage(this.props.src).then(img => {
            console.groupCollapsed(this.props.src)
            console.groupEnd()
            this.setState({img: img})
        });
    }

    render(): JSX.Element {
        return <div className={this.props.className + " flex"} dangerouslySetInnerHTML={{__html: this.state.img}}>img</div>
    }
}
