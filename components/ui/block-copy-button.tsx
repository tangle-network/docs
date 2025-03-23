"use client";

import * as React from "react";
import { CheckIcon, ClipboardIcon } from "lucide-react";

import { Button, ButtonProps } from "./button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "./tooltip";

export function BlockCopyButton({
  code,
  ...props
}: {
  name: string;
  code: string;
} & ButtonProps) {
  const [hasCopied, setHasCopied] = React.useState(false);

  React.useEffect(() => {
    setTimeout(() => {
      setHasCopied(false);
    }, 2000);
  }, [hasCopied]);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            variant="outline"
            className="h-7 w-7 rounded-[6px] [&_svg]:size-3.5"
            onClick={() => {
              navigator.clipboard.writeText(code);

              setHasCopied(true);
            }}
            {...props}
          >
            <span className="sr-only">Copy</span>
            {hasCopied ? <CheckIcon /> : <ClipboardIcon />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>Copy code</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
