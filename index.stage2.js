const create_persistent = () => {
    // populate savegames
    try {
        FS.mkdir('/home/web_user/.renpy');
        FS.mount(IDBFS, {}, '/home/web_user/.renpy');
    } catch (e) {
        console.log(e);
        Module.print("Could not create ~/.renpy/ : " + e.message + "\n");
    }
    FS.syncfs(true, function (err) {
        if (err) {
            console.trace(); console.log(err, err.message);
            // Note: not visible enough, quickly replaced by loading status
            Module.print("Warning: cannot save games\n");
        }
    });
}
if (Module['calledRun']) {
    create_persistent();
} else {
    if (!Module['preRun']) Module['preRun'] = [];
    Module["preRun"].push(create_persistent); // FS is not initialized yet, wait for it
}