import { Navbar } from "nextra-theme-docs";
import { ComponentProps } from "react";

function Navigation(props: ComponentProps<typeof Navbar>) {
  return (
    <>
      <Navbar {...props} />
    </>
  );
}

export default Navigation;
