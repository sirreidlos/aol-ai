# shell.nix
let
  # We pin to a specific nixpkgs commit for reproducibility.
  # Last updated: 2024-04-29. Check for new commits at https://status.nixos.org.
  pkgs = import (fetchTarball
    "https://github.com/NixOS/nixpkgs/archive/0d4fa9db415fb883d07b9352df2a4686f82ef8b5.tar.gz")
    { };
in pkgs.mkShell {
  packages = [
    (pkgs.python3.withPackages (python-pkgs:
      with python-pkgs; [
        # select Python packages here
        pandas
        requests
        google-generativeai
        flask
        "google.ai.generativelanguage"
        tensorflow
        pip
        scikit-learn
        numpy
        keras
      ]))
  ];

  shellHook = "fish";
}
