'use babel';
const fs = require('fs');
const tempy = require('tempy');
import AtomReplUtils from './atom-repl-utils';
export default class AtomReplLua {
    constructor(origin, cmdType) {
        this.editor = null;
        this.pane = null;
        this.view = null;
        this.origin = origin;
        this.cmd = null;
        this.cmdType = cmdType;
        this.defaultString = 'print("atom-repl: nothing sent.")' + "\n";
    }

    // Returns an object that can be retrieved when package is activated
    serialize() {}

    // Tear down any state and detach
    destroy() {
        destroyREPLS();
    }

    getElement() {

    }
    createREPL() {
        var path = atom.config.get('atom-repl.luaPath');
        if ( path == "none" ) {
            console.log("You need to edit the luaPath setting");
            return;
        }
        var self = this;
        AtomReplUtils.maybeREPLExists(self,"atom-repl-lua");
        //console.log("Done with maybeREPLExists");
    }
    setupREPL() {
        var self = this;
        AtomReplUtils.genericSetupREPL(self);
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
        var tmpFile = tempy.file({extension: 'lau'});
        //console.log("tmpFile is",tmpFile);

        var txt = AtomReplUtils.getRelevantText(self);

        //console.log("txt is: ",txt);
        fs.writeFile(tmpFile, txt, function(err) {
            if(err) {
                console.log("failed to write tmpFile",tmpFile,err);
                return;
            }
            //console.log("Success! File was written, now to call php.. wavey lines, wavey lines.");
            AtomReplUtils.simpleSpawn(self, path, [tmpFile]);
        });

    }
    destroyREPLS() {
        AtomReplUtils.destroyREPLS("atom-repl-lua");
    }

}
