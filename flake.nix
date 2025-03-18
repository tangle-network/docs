{
  description = "Tangle Docs development environment";
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs =
    {
      self,
      nixpkgs,
      flake-utils,
    }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        overlays = [ ];
        pkgs = import nixpkgs {
          inherit system overlays;
        };
      in
      {
        devShells.default = pkgs.mkShell {
          name = "tangle-docs";
          nativeBuildInputs = [ ];
          buildInputs = [
            # Nodejs
            pkgs.nodePackages.typescript-language-server
            pkgs.nodejs_22
            pkgs.yarn-berry
          ];
          packages = [ ];
        };
      }
    );
}
