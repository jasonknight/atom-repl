'use babel';
const fs = require('fs');
const tempy = require('tempy');
const spawn = require('child_process').spawn;
export default class AtomReplLua {
    constructor(origin, cmdType) {
        this.editor = null;
        this.pane = null;
        this.view = null;
        this.origin = origin;
        this.cmd = null;
        this.cmdType = cmdType;
        this.defaultString = 'print("atom-repl: nothing sent\n")' + "\n";
    }
    serialize() {}

    // Tear down any state and detach
    destroy() {
        destroyREPLS();
    }

    getElement() {

    }
}
