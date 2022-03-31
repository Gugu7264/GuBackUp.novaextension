exports.activate = function() {
    nova.workspace.onDidAddTextEditor((editor) => {
        editor.onDidSave(() => {
            // console.log("Saved " + editor.document.path);
            return makeBackup();


        });
    });
}

exports.deactivate = function() {
    // Clean up state before the extension is deactivated
}



nova.commands.register("backup.saveAndBackup", (workspace) => {
    workspace.activeTextEditor.save();
    return makeBackup();
});


function makeBackup(editor) {
    workspace = nova.workspace;
    if (editor === null || editor === undefined) {
        editor = workspace.activeTextEditor;
    }


    docrange = new Range(0, workspace.activeTextEditor.document.length);
    doctext = workspace.activeTextEditor.getTextInRange(docrange);

    bbdir = nova.config.get("backup.backupDir");
    pbdir = workspace.config.get("backup.projectBackupDir");

    bdir = null;
    thedoc = workspace.activeTextEditor.document;

    dpath = thedoc.path.normalize("NFD").replace(/\p{Diacritic}/gu, "")

    // console.log(thedoc.path);
    if (thedoc.isRemote === false && workspace.contains(thedoc.path) === true) { // The file is in the project's folder
        if (pbdir !== null) {
            bdir = pbdir; // Set the backup dir to project's setting if set
        }

        actualpath = workspace.relativizePath(thedoc.path);
        pathitems = actualpath.split("/").slice(0, -1);
    } else if (thedoc.isRemote === true) {
        if (pbdir !== null) {
            bdir = pbdir; // Set the backup dir to project's setting if set
        }
        pathitems = thedoc.path.replace(/^\//, "").split("/").slice(0, -1);
        pathitems.unshift("Remote");
    } else {
        if (pbdir !== null) {
            bdir = pbdir; // Set the backup dir to project's setting if set
        }
        pathitems = thedoc.path.replace(/^\//, "").split("/").slice(0, -1);
        pathitems.unshift("misc")
    }

    if (bdir === null) { // Hasn't been set above
        bdir = bbdir;
        if (bdir.startsWith("~")) {
            bdir = nova.environment.HOME + bdir.substr(1);
        }
        bdir = bdir.replace(/\/$/, "") + "/";

        try {
            bspace = workspace.config.get("workspace.name") ? workspace.config.get("workspace.name") : workspace.path.split("/").slice(-1);
            pathitems.unshift(bspace);
        } catch {
            console.log(thedoc.path);
        }
    }
    bdir = bdir.replace(/\/$/, "") + "/";
    // console.log(bdir);
    try {
        nova.fs.listdir(bdir + pathitems.join("/"));
    } catch (Error) {
        currentdir = bdir;
        for (pathitem of pathitems) {
            listcurrent = nova.fs.listdir(currentdir);
            if (listcurrent.includes(pathitem) === false) {
                nova.fs.mkdir(currentdir + pathitem);
            }
            currentdir += pathitem + "/";
        }
    } finally {
        bdir = bdir + pathitems.join("/");
        bdir = bdir.replace(/\/$/, "") + "/";
    }



    bfilename = (new Date()).toJSON().replace("T", "_").replace("Z", "").replace(/:/g, "-").replace(".", "-") + "__"; // Start with current datetime
    bfilename += dpath.split("/").slice(-1); // Append the filename
    // console.log(bdir + bfilename);

    bfile = nova.fs.open(bdir + bfilename, "w");
    bfile.write(doctext);
    bfile.close();
    console.log("Backup done! " + bdir + bfilename);
}
