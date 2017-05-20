'use babel'
const spawn = require('child_process').spawn;
export default {
    getCleanPath(path) {
        path.replace(" ","\\ ");
        return path;
    },
    getLinesUnderCursors(origin) {
        var txt = '';
        var cursors = origin.getCursors();
        for ( var i = 0; i < cursors.length; i++ ) {
            var position = cursors[i].getScreenPosition();
            var selection = cursors[i].selection;
            selection.selectLine();
            txt = txt + selection.getText() + "\n";
            selection.clear();
            cursors[i].setScreenPosition(position);
        }
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
        });
    }
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
