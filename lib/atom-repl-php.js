'use babel';
const fs = require('fs');
const tempy = require('tempy');
const spawn = require('child_process').spawn;
export default class AtomReplPHP {
    constructor(origin, cmdType) {
        this.prompt = "<?php: ";
        this.editor = null;
        this.pane = null;
        this.view = null;
        this.origin = origin;
        this.cmd = null;
        this.cmdType = cmdType;
        this.defaultString = 'echo "atom-repl: nothing sent.";' + "\n";
    }

    // Returns an object that can be retrieved when package is activated
    serialize() {}

    // Tear down any state and detach
    destroy() {
        destroyREPLS();
    }

    getElement() {

    }
    maybeREPLExists() {
        // Here we try to see if a repl for this type
        // already exists, if so, we don't want to create a
        // new one, as that will fill up the workspace and
        // irritate the living shit out of the user.
        var self = this;
        var eds = atom.workspace.getTextEditors();
        for ( i = 0; i < eds.length; i++ ) {
            var ed = eds[i];
            if ( ed.getTitle() == 'atom-repl-php' ) {
                var panes = atom.workspace.getPanes();
                for ( j = 0; j < panes.length; j++ ) {
                    var activeItem = panes[j].activeItem;
                    if ( activeItem && activeItem.id == ed.id ) {
                        self.editor = ed;
                        self.editor.isModified = function() {return false;};
                        self.pane = panes[j];
                        self.view = atom.views.getView(ed);
                        return;
                    }
                }
            }
        }
    }
    createREPL() {
        // if they haven't setup the path yet
        // then don't create the fucking pane!
        var path = atom.config.get('atom-repl.phpPath');
        if ( path == "none" ) {
            console.log("You need to edit the phpPath setting");
            return;
        }
        var self = this;
        self.maybeREPLExists();
        if ( !self.editor || !self.pane ) {
            var pane = atom.workspace.getActivePane();
            self.pane = pane.splitDown();
            self.pane.activate();
            atom.workspace.open('/tmp/atom-repl-php')
                .then(function (ed) {
                    self.editor = ed;
                    self.editor.isModified = function() {return false;};
                    self.view = atom.views.getView(ed);
                    self.setupREPL();
                });
        } else {
            self.setupREPL();
        }


    }
    setupREPL() {
        var self = this;
        var origin_pane = atom.workspace.paneForItem(self.origin);
        origin_pane.activate();
        var path = atom.config.get('atom-repl.phpPath');
        if ( path == "none" ) {
            console.log("You need to edit the phpPath setting");
            return;
        }
        // so we have a path, but does it exist!
        if (!fs.existsSync(path)) {
            // gotcha bitch.
            console.log(path, " does not exist!");
        }
        var tmpFile = tempy.file({extension: 'php'});
        console.log("tmpFile is",tmpFile);

        var txt = self.defaultString;
        if ( self.cmdType == "full" ) {
            txt = self.origin.getText();
        } else if ( self.cmdType == "selection" ) {
            txt = self.origin.getSelectedText();
            if ( ! txt.includes("<?php")) {
                txt = "<?php\n" + txt;
            }
        } else if ( self.cmdType == "lines" ) {
            txt = '';
            var cursors = self.origin.getCursors();
            for ( var i = 0; i < cursors.length; i++ ) {
                var position = cursors[i].getScreenPosition();
                var selection = cursors[i].selection;
                console.log(selection, typeof selection);
                selection.selectLine();
                txt = txt + selection.getText() + "\n";
                selection.clear();
                cursors[i].setScreenPosition(position);
            }
            if ( txt == '' ) {
                txt = self.defaultString;
            }
            if ( ! txt.includes("<?php")) {
                txt = "<?php\n" + txt;
            }
        }
        console.log("txt is: ",txt);
        fs.writeFile(tmpFile, txt, function(err) {
            if(err) {
                return console.log("failed to write tmpFile",tmpFile,err);
            }
            console.log("Success! File was written, now to call php.. wavey lines, wavey lines.");
            self.cmd = spawn(path, [tmpFile]);
            self.cmd.stdout.on('data',function (data) {
                self.editor.insertText(data.toString());
            });
            self.cmd.stderr.on('data',function (data) {
                self.editor.insertText(data.toString());
            });
            self.cmd.on('exit',function (code) {
                console.log("Exited " + code + "\n");
            });
        });

    }
    destroyREPLS() {
        var eds = atom.workspace.getTextEditors();
        for ( i = 0; i < eds.length; i++ ) {
            if ( eds[i].getPath() == '/tmp/atom-repl-php' ) {
                eds[i].destroy();
            }
        }
    }

}
