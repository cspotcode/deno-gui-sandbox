# Simple GUI apps w/Deno

Use this project:  
https://github.com/deno-windowing/dwm/  

They include DearImGUI port.

Check their examples: https://github.com/deno-windowing/dwm/tree/main/examples

## Get Deno on Windows

```shell
winget install DenoLand.Deno
# close and re-open terminal to get new env vars
```

## Run

Gotta pass `--unstable-ffi` cuz it uses FFI to call OS's native DLLs.

```shell
deno run -A --unstable-ffi ./my-gui.ts
deno run -A --unstable-ffi https://deno.land/x/dwm/examples/imgui2.ts
```

## Compile to standalone exe

```shell
deno compile --unstable-ffi -A -o my-gui.exe ./my-gui.ts
deno compile --unstable-ffi -A https://deno.land/x/dwm/examples/imgui2.ts # spits out imgui2.exe demo
```

### Hide terminal window on windows

Deno has a `--no-terminal` flag for `deno compile` which emits an exe that doesn't open terminal on Windows, but at time
of writing it's broken.

https://github.com/denoland/deno/issues/21091#issuecomment-2401082661

```shell
deno compile --no-terminal --unstable-ffi -A -o my-gui.exe .\my-gui.ts
```
