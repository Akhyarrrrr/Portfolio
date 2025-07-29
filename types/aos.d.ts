declare module "aos" {
  interface AosOptions {
    offset?: number;
    delay?: number;
    duration?: number;
    easing?: string;
    once?: boolean;
    mirror?: boolean;
    anchorPlacement?: string;
    disable?: boolean | "phone" | "tablet" | "mobile";
    startEvent?: string;
    animatedClassName?: string;
    initClassName?: string;
    useClassNames?: boolean;
    disableMutationObserver?: boolean;
    debounceDelay?: number;
    throttleDelay?: number;
  }

  function init(options?: AosOptions): void;
  function refresh(): void;
  function refreshHard(): void;
  function disable(): void;

  const AOS: {
    init: typeof init;
    refresh: typeof refresh;
    refreshHard: typeof refreshHard;
    disable: typeof disable;
  };

  export default AOS;
}
