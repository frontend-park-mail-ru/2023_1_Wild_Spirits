import { VDOM } from "modules/vdom";

export interface LoadingProps {
    size?: "s" | "m" | "l" | "xl" | "xxl";
}

export const Loading = ({ size }: LoadingProps = { size: "m" }) => {
    return (
        <div className="lds-default-container" data-size={size}>
            <div className="lds-default">
                {Array.from(Array(12)).map(() => (
                    <div></div>
                ))}
            </div>
        </div>
    );
};
