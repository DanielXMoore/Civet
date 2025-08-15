{
  nixConfig.bash-prompt-prefix = ''(civet) '';

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixpkgs-unstable";

    flake-utils.url = "github:numtide/flake-utils";
    gitignore = {
      url = "github:hercules-ci/gitignore.nix";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };
  outputs = inputs:
    inputs.flake-utils.lib.eachDefaultSystem (
      system: let
        pkgs = inputs.nixpkgs.legacyPackages.${system};

        cli = mkCivetPackage {
          pname = "civet";
          src = ./.;
          description = "the Civet programming language";
          yarnDepsHash = "sha256-pEpST+ZWDJYzIaxeb4ou8rLtNwgnKv0SdahHJ15bgn8=";
          extraIgnoreRules = ''
            lsp/
            civet.dev/
          '';
          patchPhase = ''
            # since we don't copy `civet.dev/` over
            sed -i 's!.*dist/browser\.js.*!!' build/build.sh
          '';
        };

        ls = mkCivetPackage {
          pname = "civet-ls";
          src = ./lsp;
          entrypoint = "server.js";
          description = "the Civet language server";
          yarnDepsHash = "sha256-JyAXj7L1ORT4486U/QYH48cEmfp/3tqVxfnyHoeGhk0=";
        };

        vscode-extension = pkgs.vscode-utils.buildVscodeMarketplaceExtension {
          mktplcRef = builtins.fromJSON (builtins.readFile ./lsp/package.json);
          vsix = vscode-vsix;
        };
        vscode-vsix = ls.overrideAttrs (oldAttrs: {
          # `.zip` extension is required for `buildVscodeMarketplaceExtension`'s unpackPhase
          name = "${oldAttrs.pname}-${oldAttrs.version}-vsix.zip";
          nativeBuildInputs = [pkgs.vsce] ++ oldAttrs.nativeBuildInputs;
          installPhase = ''
            runHook preInstall
            vsce package
            install -Dm644 *.vsix $out
            runHook postInstall
          '';
          fixupPhase = null;
        });

        mkCivetPackage = {
          pname,
          src,
          entrypoint ? pname,
          extraIgnoreRules ? "",
          yarnDepsHash ? pkgs.lib.fakeHash,
          patchPhase ? null,
          description ? null,
        } @ args: let
          nodejs = pkgs.nodePackages_latest.nodejs;
          pkgJson =
            builtins.fromJSON (builtins.readFile "${src}/package.json");
          version = args.version or pkgJson.version;
          cleanSrc = pkgs.lib.cleanSourceWith {
            name = "${pname}-${version}-clean-src";
            inherit src;
            filter = inputs.gitignore.lib.gitignoreFilterWith {
              basePath = src;
              extraRules =
                extraIgnoreRules
                + ''
                  flake.*
                  README.md
                  CONTRIBUTING.md
                  CHANGELOG.md
                  LICENSE.md
                  NOTES.md
                  TODO.md
                  .gitattributes
                  .gitignore
                  .vscode
                '';
            };
          };
        in
          pkgs.stdenv.mkDerivation {
            inherit pname version patchPhase;
            src = cleanSrc;

            yarnOfflineCache = pkgs.fetchYarnDeps {
              yarnLock = "${cleanSrc}/yarn.lock";
              hash = yarnDepsHash;
            };

            nativeBuildInputs =
              [nodejs]
              ++ (with pkgs; [yarnConfigHook yarnInstallHook yarnBuildHook]);

            fixupPhase = ''
              echo "the phase"
              mkdir -p $out/bin
              makeWrapper \
                ${pkgs.lib.getExe nodejs} \
                $out/bin/${pname} \
                --inherit-argv0 \
                --add-flag $out/lib/node_modules/${pkgJson.name}/dist/${entrypoint}
            '';

            meta = {
              inherit description;
              homepage = "https://civet.dev/";
              license = pkgs.lib.licenses.mit;
              platforms = pkgs.lib.platforms.all;
              mainProgram = pname;
            };
          };
      in {
        packages = {
          inherit cli ls vscode-vsix vscode-extension;
          default = cli;
        };
        devShells.default = pkgs.mkShell {
          # include all exported packages' build dependencies
          inputsFrom = pkgs.lib.attrValues inputs.self.packages.${system};
          # include civet and civet-ls themselves since parts of civet are written in civet
          packages = [cli ls];
        };
      }
    );
}
