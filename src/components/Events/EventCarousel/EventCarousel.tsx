import { VDOM, Component } from "modules/vdom";
import { store } from "flux";
import { setEventsCardsLoadStart } from "flux/slices/eventSlice";
import { TEventLight } from "models/Events";
import { requestManager } from "requests";
import { LoadStatus } from "requests/LoadStatus";
import { TRequest } from "requests/requestTypes";
import { EventCarouselContent } from "./EventCarouselContent";
import { Link } from "components/Common/Link";

export interface EventCarouselProps {
    title: string;
    href?: string;
    events: LoadStatus.DataDoneOrNotDone<{ data: TEventLight[] }>;
    request?: TRequest;
}

interface EventCarouselState {
    pageNumber: number;
}

export class EventCarousel extends Component<EventCarouselProps, EventCarouselState> {
    start = 0;
    pageSize = this.getPageSize();
    cardsCount = 0;

    constructor(props: EventCarouselProps) {
        super(props);
        this.state = { pageNumber: 1 };

        this.handleClickPrev = this.handleClickPrev.bind(this);
        this.handleClickNext = this.handleClickNext.bind(this);
    }

    didCreate() {
        store.dispatch(setEventsCardsLoadStart());
        this.props.request && requestManager.request(this.props.request);
    }

    handleClickPrev() {
        console.log(this.state.pageNumber);
        if (!this.hasPrev()) return;
        this.setState({ pageNumber: this.state.pageNumber - 1 });
    }

    handleClickNext() {
        console.log(this.state.pageNumber);
        if (!this.hasNext()) return;
        this.setState({ pageNumber: this.state.pageNumber + 1 });
    }

    getPageSize() {
        const { collapsed } = store.state.meta;

        if (collapsed.searchCollapsed) return 1;
        if (collapsed.headerCollapsed) return 2;
        if (collapsed.lCollapsed) return 1;
        if (collapsed.profileCollapsed) return 1;
        if (collapsed.xxlCollapsed) return 2;
        return 3;
    }

    getStart(pageSize: number) {
        return (this.state.pageNumber - 1) * pageSize;
    }

    getEnd(pageSize: number) {
        return this.state.pageNumber * pageSize;
    }

    hasPrev(): boolean {
        return this.state.pageNumber !== 1;
    }

    hasNext(): boolean {
        if (this.props.events.loadStatus !== LoadStatus.DONE) {
            return false;
        }
        const { data } = this.props.events;

        if (data.length <= this.getEnd(this.getPageSize())) {
            return false;
        }

        return true;
    }

    render() {
        const { events } = this.props;
        const pageSize = this.getPageSize();
        const newStart = this.getStart(pageSize);
        if (events.loadStatus === LoadStatus.DONE && events.data.length !== this.cardsCount) {
            this.cardsCount = events.data.length;
            this.setState({ pageNumber: 1 });
        }
        if (pageSize !== this.pageSize) {
            console.log("============================");
            console.log(Math.floor(this.start / pageSize) + 1);
            console.log(this.pageSize, pageSize, this.start, newStart);
            this.pageSize = pageSize;
            this.setState({ pageNumber: Math.floor(this.start / pageSize) + 1 });
        }
        this.start = newStart;

        if (events.loadStatus === LoadStatus.DONE && events.data.length === 0) {
            return <div></div>;
        }

        const cardClassName = "col-12 col-s-6 col-m-12 col-xl-6 col-xxl-4 event-card-container";
        return (
            <div className="event-carousel">
                <div className="event-carousel__title">
                    {this.props.href ? (
                        <Link className="link" href={this.props.href}>
                            {this.props.title}
                        </Link>
                    ) : (
                        <>{this.props.title}</>
                    )}
                </div>
                <div className="row-no-wrap event-carousel__content-block">
                    <img
                        src="/assets/img/arrow-icon.svg"
                        alt="prev"
                        className={`event-carousel__prev-next ${this.hasPrev() ? "pointy" : "disable"}`}
                        onClick={this.handleClickPrev}
                    />
                    <EventCarouselContent
                        events={events}
                        pageSize={pageSize}
                        start={this.start}
                        cardClassName={cardClassName}
                    />
                    <img
                        src="/assets/img/arrow-icon.svg"
                        alt="next"
                        className={`event-carousel__prev-next reversed ${this.hasNext() ? "pointy" : "disable"}`}
                        onClick={this.handleClickNext}
                    />
                </div>
            </div>
        );
    }
}
