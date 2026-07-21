import { useEffect, useState } from "react";

interface Props<T> {
    items: T[];
    onSelect: (item: T) => void;
}

export function useSearchKeyboard<T>({
    items,
    onSelect,
}: Props<T>) {

    const [selectedIndex, setSelectedIndex] = useState(-1);

    useEffect(() => {

        function handler(event: KeyboardEvent) {

            if (!items.length) return;

            switch (event.key) {

                case "ArrowDown":

                    event.preventDefault();

                    setSelectedIndex((current) =>
                        current < items.length - 1
                            ? current + 1
                            : 0
                    );

                    break;

                case "ArrowUp":

                    event.preventDefault();

                    setSelectedIndex((current) =>
                        current > 0
                            ? current - 1
                            : items.length - 1
                    );

                    break;

                case "Enter":

                    if (selectedIndex >= 0) {

                        event.preventDefault();

                        onSelect(items[selectedIndex]);

                    }

                    break;

            }

        }

        window.addEventListener("keydown", handler);

        return () =>
            window.removeEventListener("keydown", handler);

    }, [items, selectedIndex, onSelect]);

    return {

        selectedIndex,

        setSelectedIndex,

    };

}