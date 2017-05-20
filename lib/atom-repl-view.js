'use babel';

export default class AtomReplView {

  constructor(serializedState, kind) {
    this.prompt = kind + "> ";
  }

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  // Tear down any state and detach
  destroy() {

  }

  getElement() {

  }
  destroyREPLS() {
    var eds = atom.workspace.getTextEditors();
    for ( i = 0; i < eds.length; i++ ) {
      if ( eds[i].getPath() == '/tmp/atom-repl' ) {
        eds[i].destroy();
      }
    }
  }

}
