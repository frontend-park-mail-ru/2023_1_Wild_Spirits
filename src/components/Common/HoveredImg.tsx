import { VDOM, Component } from "modules/vdom";
import { SVGInline } from "components/Common/SVGInline";

export interface HoveredImgProps {
    src: string;
    alt: string;
    iconClassName: string;
    onClick?: () => void;
}

export class HoveredImg extends Component<HoveredImgProps, { isHovered: boolean }> {
    constructor(props: HoveredImgProps) {
        super(props);
        this.state = { isHovered: false };
    }

    render() {
        return (
            <div className="flex pointy" onClick={() => this.props.onClick && this.props.onClick()}>
                <SVGInline className={this.props.iconClassName} src={this.props.src} alt={this.props.alt} />
            </div>
        );
    }
}
