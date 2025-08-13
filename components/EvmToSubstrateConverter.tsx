import { hexToU8a, stringToU8a, u8aConcat } from "@polkadot/util";
import { blake2AsU8a, encodeAddress } from "@polkadot/util-crypto";
import Link from "next/link";
import { Callout } from "nextra/components";
import { useState } from "react";
import { BlockCopyButton } from "./ui/block-copy-button";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

const TANGLE_PREFIX = 5845;

const evmToTangle = (evmAddress: string) => {
  const addr = hexToU8a(evmAddress);
  const data = stringToU8a("evm:");
  const res = blake2AsU8a(u8aConcat(data, addr));
  const tangleAddress = encodeAddress(res, TANGLE_PREFIX);
  return tangleAddress;
};

const AddressConverter = () => {
  const [evmAddress, setEvmAddress] = useState("");
  const [tangleAddress, setTangleAddress] = useState("");

  const convertAddress = () => {
    if (!evmAddress) {
      setTangleAddress("Please enter an EVM address.");
      return;
    }

    try {
      const convertedAddress = evmToTangle(evmAddress);
      setTangleAddress(convertedAddress);
    } catch {
      setTangleAddress("Invalid EVM address.");
    }
  };

  return (
    <div className="mt-8">
      <Card>
        <CardHeader>
          <CardTitle>EVM to Tangle Address Converter</CardTitle>
          <CardDescription>
            Enter an EVM address to convert it to the prefixed form unique to
            Tangle Network. To convert an SS58 address to a public key or other
            networks, you can use{" "}
            <Link
              className="font-semibold underline text-linkBlue"
              href="https://ss58.org/"
            >
              SS58.org
            </Link>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <label htmlFor="evmAddress" className="block mb-1 font-semibold">
                EVM Address:
              </label>
              <input
                type="text"
                id="evmAddress"
                className="w-full px-4 py-2 font-mono text-gray-800 bg-gray-200 rounded"
                value={evmAddress}
                onChange={(e) => setEvmAddress(e.target.value)}
                placeholder="Enter EVM address"
              />
            </div>
            <div className="flex-1">
              <label
                htmlFor="tangleAddress"
                className="block mb-1 font-semibold"
              >
                Tangle Address:
              </label>
              <div
                id="tangleAddress"
                className="w-full px-4 py-2 font-mono text-gray-800 bg-gray-200 rounded"
              >
                {tangleAddress || "Waiting..."}
              </div>
            </div>
            <div className="flex self-end ml-0">
              <BlockCopyButton
                name="Tangle Address"
                code={tangleAddress}
                className="h-10 w-10 rounded [&_svg]:size-4"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={convertAddress}>
            Convert
          </Button>
        </CardFooter>
        <Callout type="warning" emoji="⚠️">
          Please note that the conversion from an EVM address to a Tangle
          address using the provided tool is a one-way operation, and you cannot
          derive the original EVM address from a Tangle address.
          <br />
          <Link
            className="underline text-linkBlue"
            href="/developers/addresses"
          >
            Learn more about Addresses on Tangle.
          </Link>
        </Callout>
      </Card>
    </div>
  );
};

export default AddressConverter;
