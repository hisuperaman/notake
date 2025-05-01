import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

export function useDropdownAnimation() {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const buttonRef = useRef<HTMLButtonElement | null>(null);

    useGSAP(() => {
        if (dropdownRef.current) {
            if (isOpen) {
                gsap.to(dropdownRef.current, {
                    scale: 1,
                    opacity: 1,
                    duration: 0.2,
                    onStart: () => {
                        gsap.set(dropdownRef.current, { display: "block" });
                    },
                });
            } else {
                gsap.to(dropdownRef.current, {
                    scale: 0,
                    opacity: 0,
                    duration: 0.2,
                    onComplete: () => {
                        gsap.set(dropdownRef.current, { display: "none" });
                    },
                });
            }
        }
    }, [isOpen, dropdownRef]);

    useEffect(() => {
        function handleClickOutside(e: Event) {
            if (
                dropdownRef.current &&
                buttonRef.current &&
                !dropdownRef.current.contains(e.target as Node) &&
                !buttonRef.current.contains(e.target as Node)
            ) {
                setIsOpen(false);
            }
        }

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    return { isOpen, setIsOpen, dropdownRef, buttonRef };
}