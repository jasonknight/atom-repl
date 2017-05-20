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


    // this.subscriptions.add(atom.workspace.observeTextEditors(function (editor) {
    //   var name = editor.getGrammar().name;
    //   var self = this;
    //
    // }));

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
  setEditor() {
      var self = this;
          self.editor = atom.workspace.getActiveTextEditor();
      var name = self.editor.getGrammar().name;
      if ( name.match(/Lisp/i) ) {
        console.log("Lisp Grammar Selected");
        self.currentREPLType = 'lisp';
      } else if ( name.match(/PHP/i) ) {
        console.log("PHP Grammar Selected");
        self.currentREPLType = 'php';
      } else if ( name.match(/Python/i) ) {
        console.log("Python Grammar Selected");
        self.currentREPLType = 'python';
      } else if ( name.match(/Lua/i) ) {
        console.log("Lua Grammar Selected");
        self.currentREPLType = 'lua';
      } else {
        console.log("Name matches nothing we support" + name );
        self.currentREPLType = false;
      }
  },
  runFile() {
    var self = this;
    console.log("runFile called");
    self.setEditor();
    if (!self.currentREPLType) {
        console.log("no editor set");
        return;
    }
    self.atomReplView = new AtomReplPHP(self.editor, "full");
    self.atomReplView.createREPL();
  },
  runSelection() {
      var self = this;
      console.log("runSelection called");
      self.setEditor();
      if (!self.currentREPLType) {
          return;
      }
    var selection = self.editor.getSelectedText();
    if ( !selection ) {
        console.log("You gotta select something...!");
        return;
    }
    self.atomReplView = new AtomReplPHP(self.editor, "selection");
    self.atomReplView.createREPL();
  },
  runLine() {
    var self = this;
    console.log("runLine called");
    self.setEditor();
    if (!self.currentREPLType) {
        return;
    }
    self.atomReplView = new AtomReplPHP(self.editor, "lines");
    self.atomReplView.createREPL();
  },

};
