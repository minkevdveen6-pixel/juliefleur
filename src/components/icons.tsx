import type { SVGProps } from "react";
type Props = SVGProps<SVGSVGElement> & { name: "arrow" | "search" | "bag" | "menu" | "close" | "plus" | "instagram" | "heart" | "check" };
export function Icon({ name, ...props }: Props) {
  const paths = {
    arrow: <><path d="M4 12h15M13 5l7 7-7 7" /></>,
    search: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></>,
    bag: <><path d="M5 7h14l1 14H4L5 7Z" /><path d="M8 8V6a4 4 0 0 1 8 0v2" /></>,
    menu: <><path d="M3 8h18M3 16h18" /></>,
    close: <><path d="m5 5 14 14M19 5 5 19" /></>,
    plus: <><path d="M12 4v16M4 12h16" /></>,
    instagram: <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".5" /></>,
    heart: <><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" /></>,
    check: <><path d="m4 12 5 5L20 6" /></>,
  };
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name]}</svg>;
}
