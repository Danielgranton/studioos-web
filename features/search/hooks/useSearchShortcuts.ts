import { RefObject, useEffect } from "react";

interface Props {
    inputRef: RefObject<HTMLInputElement | null>;
    open: () => void;
    close: () => void;
}

export function useSearchShortcuts({
    inputRef,
    open,
    close,
}: Props) {

    useEffect(() => {

        function handler(event: KeyboardEvent) {

            // Ctrl + K / Cmd + K

            if (
                (event.ctrlKey || event.metaKey) &&
                event.key.toLowerCase() === "k"
            ) {

                event.preventDefault();

                inputRef.current?.focus();

                open();

                return;

            }

            // ESC

            if (event.key === "Escape") {

                close();

                inputRef.current?.blur();

            }

        }

        window.addEventListener("keydown", handler);

        return () =>
            window.removeEventListener("keydown", handler);

    }, [inputRef, open, close]);

}