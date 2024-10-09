import {
    createWindow,
    getPrimaryMonitor,
    getProcAddress,
    mainloop,
    pollEvents,
} from "dwm";
import * as gl from "gluten";
import * as imgui from "dimgui";
import {
    Bool,
    ImGuiConfigFlagBits,
} from "dimgui";

function queryWindowSizeAndFontSize() {
    const aspectRatio = 16 / 9;
    const lines = 40;
    const monitor = getPrimaryMonitor();
    const height = Math.ceil(monitor.workArea.height * 0.7);
    const width = Math.ceil(height * aspectRatio);
    const fontSize = Math.min(32, Math.ceil(height / lines));
    return { width, height, fontSize };
}
const windowInfo = queryWindowSizeAndFontSize();
console.info(windowInfo);

const window = createWindow({
    title: "IMGUI DWM",
    width: windowInfo.width,
    height: windowInfo.height,
    resizable: true,
    glVersion: "v3.2",
    gles: false,
});

// load opengl functions
gl.load(getProcAddress);

// create imgui context and init imgui backends
const imguiContext = imgui.createContext();
imgui.implGlfwInitForOpenGL(window.nativeHandle);
imgui.implOpenGL3Init("#version 130");

// set io
const io = imgui.getIO();
io.ConfigFlags |= ImGuiConfigFlagBits.DockingEnable;

// set font
const fonts = io.Fonts;
if (Deno.build.os == "windows") {
    const fontFile = "C:/Windows/Fonts/consola.ttf";
    try {
        const fontData = Deno.readFileSync(fontFile);
        fonts.addFontFromMemoryTTF(fontData, windowInfo.fontSize);
    } catch (error) {
        console.error(error);
    }
}

// states, primitive wrappers
const checkboxState = Bool.of(true);

let a = 0;
await mainloop(() => {
    // new frame
    imgui.implOpenGL3NewFrame();
    imgui.implGlfwNewFrame();
    imgui.newFrame();

    a = a + 1;
    // draw widgets
    imgui.begin(`controls`);
    imgui.text(`a: ${a}`);
    if(imgui.button("click me")) {
        console.log("button clicked!");
    }
    // Returns true when it's clicked, but checked/unchecked state is written to the buffer.
    const wasCheckedBefore = checkboxState.value;
    const clicked = imgui.checkbox(`checkbox`, checkboxState.buffer);
    const isCheckedAfter = checkboxState.value;
    console.log(`checkedBefore: ${wasCheckedBefore}, checkedAfter: ${isCheckedAfter}, clicked: ${clicked}`);

    imgui.showStyleSelector("style selector");
    imgui.showFontSelector("font selector");

    imgui.end();

    imgui.render();

    gl.Clear(gl.COLOR_BUFFER_BIT);
    const drawData = imgui.getDrawData();
    imgui.implOpenGL3RenderDrawData(drawData);
    window.swapBuffers();
    pollEvents(true); // true to wait for input; otherwise keeps rendering at high framerate
});

// clean up
imgui.implOpenGL3Shutdown();
imgui.implGlfwShutdown();
imgui.destroyContext(imguiContext);
