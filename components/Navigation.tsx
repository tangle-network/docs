import { Navbar } from "nextra-theme-docs";
import { ComponentProps } from "react";

const NAV_ITEMS = new Set(["vision", "vibe", "infrastructure", "protocol"]);

function Navigation(props: ComponentProps<typeof Navbar>) {
  const filteredItems = props.items.filter((item) => NAV_ITEMS.has(item.name));

  return (
    <>
      <Navbar {...props} items={filteredItems} />
    </>
  );
}

export default Navigation;
