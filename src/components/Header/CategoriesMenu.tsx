import { VDOM } from "modules/vdom";
import { store } from "flux";
import { clearCategory, selectCategory } from "flux/slices/headerSlice";
import { requestManager } from "requests";
import { loadEvents } from "requests/events";
import { TCategory } from "models/Category";

export const CategoriesMenu = () => {
    const categoryLinkClick = (categoryId: number) => {
        if (store.state.header.selectedCategoryId === categoryId) {
            store.dispatch(clearCategory());
        } else {
            store.dispatch(selectCategory(categoryId));
        }
        requestManager.request(loadEvents);
    };

    const isSelected = (category: TCategory) => category.id === store.state.header.selectedCategoryId;

    if (store.state.header.categories.length === 0) {
        return (
            <div className="header__bottom-line">
                {Array.from(Array(5)).map(() => (
                    <div className="header__category-fake-item"> </div>
                ))}
            </div>
        );
    }

    return (
        <div className="header__bottom-line">
            {store.state.header.categories.map((category) => (
                <a
                    onClick={() => categoryLinkClick(category.id)}
                    className={`header__category ${isSelected(category) ? "category-selected" : ""}`}
                >
                    {category.name}
                </a>
            ))}
        </div>
    );
};
