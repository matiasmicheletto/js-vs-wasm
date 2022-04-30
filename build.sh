#!/bin/bash

cd c
emcc optimizer.c -O2 -sSTANDALONE_WASM -o optimizer.wasm --no-entry
cd ..
mv c/optimizer.wasm wasm/optimizer.wasm 
