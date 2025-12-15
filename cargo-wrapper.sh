#!/bin/bash
# Wrapper pour forcer Tauri à utiliser cargo-xwin pour la cross-compilation Windows

if [[ "$*" == *"x86_64-pc-windows-msvc"* ]]; then
    # Si on compile pour Windows, utiliser cargo-xwin
    exec cargo-xwin "$@"
else
    # Sinon, utiliser cargo normal
    exec cargo "$@"
fi
