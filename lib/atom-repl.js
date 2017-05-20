'use babel';

import AtomReplView from './atom-repl-view';
import AtomReplPHP from './atom-repl-php';
import { CompositeDisposable } from 'atom';
import packageConfig from './config-schema.json';
export default {

  atomReplView: null,
  subscriptions: null,
  config: packageConfig,
  currentREPLType: null,
  editor: null,


  activate(state) {
    //this.atomReplView = new AtomReplView(state.atomReplViewState);
    // this.modalPanel = atom.workspace.addModalPanel({
    //   item: this.atomReplView.getElement(),
    //   visible: false
    // });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'atom-repl:run-file': () => this.runFile(),
      'atom-repl:run-selection': () => this.runSelection(),
      'atom-repl:run-line': () => this.runLine()
    }));


    this.subscriptions.add(atom.workspace.observeTextEditors(function (editor) {
      var name = editor.getGrammar().name;
      var self = this;
      self.editor = editor;
      if ( name.match(/Lisp/i) ) {
        console.log("Lisp Grammar Selected");
        this.currentREPLType = 'lisp';
      } else if ( name.match(/PHP/i) ) {
        console.log("PHP Grammar Selected");
        this.currentREPLType = 'php';
      } else if ( name.match(/Python/i) ) {
        console.log("Python Grammar Selected");
        this.currentREPLType = 'python';
      } else if ( name.match(/Lua/i) ) {
        console.log("Lua Grammar Selected");
        this.currentREPLType = 'lua';
      } else {
        console.log("Name matches nothing we support" + name );
        this.currentREPLType = false;
      }
    }));

    this.fs = require('fs');
  },

  deactivate() {
    // deactivate all the resources used
    this.subscriptions.dispose();
    if ( this.atomReplView ) {
        this.atomReplView.destroy();
    }

  },

  serialize() {
      if (this.atomReplView) {
          return {
            atomReplViewState: this.atomReplView.serialize()
          };
      }
  },

  runFile() {
    console.log("runFile called");
    var ed = atom.workspace.activeItem;
    console.log("activeItem is: ", ed);
    this.atomReplView = new AtomReplPHP(self.editor);
    this.atomReplView.createREPL();
  },
  runSelection() {
    console.log("runSelection called");
  },
  runLine() {
    console.log("runLine called");
  },

};
