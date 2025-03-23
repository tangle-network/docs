import Image from "next/image";
import type { ComponentProps, FC } from "react";

const ThemedImage: FC<{
  lightImageProps: ComponentProps<typeof Image>;
  darkImageProps: ComponentProps<typeof Image>;
}> = ({ darkImageProps, lightImageProps }) => {
  return (
    <>
      <div className="block dark:hidden">
        <Image {...lightImageProps} alt="light img" />
      </div>
      <div className="hidden dark:block">
        <Image {...darkImageProps} alt="dark img" />
      </div>
    </>
  );
};

export default ThemedImage;
