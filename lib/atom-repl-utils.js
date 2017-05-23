'use babel'
const spawn = require('child_process').spawn;
const unlink = require('fs').unlink;
export default {
    getCleanPath(path) {
        return path;
    },
    getLinesUnderCursors(origin) {
        var txt = '';
        var cursors = origin.getCursors();
        var lines = [];
        for ( var i = 0; i < cursors.length; i++ ) {
            var position = cursors[i].getScreenPosition();
            var selection = cursors[i].selection;
            selection.selectLine();
            lines.push(selection.getText());
            selection.clear();
            cursors[i].setScreenPosition(position);
        }
        // don't ask me why this works when just lines.join() doesn't,
        // I'm tired, and it's pissing me the fuck off.
        // I finally had to create an array, as they were always
        // concatting backwards, then the array was backwards, even
        // after one lines.reverse(), go figure.
        txt = lines.reverse().reverse().join("\n");
        return txt;
    },
    getRelevantText(self) {
        var txt = self.defaultString;
        if ( self.cmdType == "full" ) {
            txt = self.origin.getText();
        } else if ( self.cmdType == "selection" ) {
            txt = self.origin.getSelectedText();

        } else if ( self.cmdType == "lines" ) {
            txt = this.getLinesUnderCursors(self.origin);
            if ( txt == '' ) {
                txt = self.defaultString;
            }
        }
        //console.log("getRelevantText returning ",txt);
        return txt;
    },
    genericSetupREPL(self) {
        self.editor.moveToBottom();
        var origin_pane = atom.workspace.paneForItem(self.origin);
        origin_pane.activate();
    },
    simpleSpawn(self,path,args) {
        self.cmd = spawn(path, args);
        self.cmd.stdout.on('data',function (data) {
            self.editor.insertText(data.toString());
        });
        self.cmd.stderr.on('data',function (data) {
            self.editor.insertText(data.toString());
        });
        self.cmd.on('exit',function (code) {
            console.log("Exited " + code + "\n");
            unlink(path,function() {
                console.log("temp file " + path + " was unlinked.");
            });
        });
    },
    maybeREPLExists(self,tag) {
        //console.log("begin maybeREPLExists");
        // Here we try to see if a repl for this type
        // already exists, if so, we don't want to create a
        // new one, as that will fill up the workspace and
        // irritate the living shit out of the user.
        var eds = atom.workspace.getTextEditors();
        for ( i = 0; i < eds.length; i++ ) {
            var ed = eds[i];
            if ( ed.getTitle() == tag ) {
                var pane = atom.workspace.paneForItem(ed);
                if ( pane ) {
                    self.editor = ed;
                    self.editor.isModified = function() {return false;};
                    self.pane = pane;
                    self.view = atom.views.getView(ed);
                    self.setupREPL();
                    return;
                }
            }
        }
        //console.log("after looping")
        if ( !self.editor || !self.pane ) {
            var pane = atom.workspace.getActivePane();
            self.pane = pane.splitDown();
            self.pane.activate();
            //console.log("going to create a repl with tag ", tag)
            atom.workspace.open('/tmp/' + tag)
                .then(function (ed) {
                    self.editor = ed;
                    self.editor.isModified = function() {return false;};
                    self.view = atom.views.getView(ed);
                    self.setupREPL();

                });
        } else {
            //console.log("repl exists, so direct to setupREPL");
            self.setupREPL();
        }
        //console.log("end of maybeREPLExists");
    },
    destroyREPLS(tag) {
        var eds = atom.workspace.getTextEditors();
        for ( i = 0; i < eds.length; i++ ) {
            if ( eds[i].getPath() == '/tmp/' + tag ) {
                eds[i].destroy();
            }
        }
    },
}
