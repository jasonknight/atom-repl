'use babel'
export default {
    maybeREPLExists(self,tag) {
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
                    self.pane = panes;
                    self.view = atom.views.getView(ed);
                    return;
                }
            }
        }
        if ( !self.editor || !self.pane ) {
            var pane = atom.workspace.getActivePane();
            self.pane = pane.splitDown();
            self.pane.activate();
            atom.workspace.open('/tmp/' + tag)
                .then(function (ed) {
                    self.editor = ed;
                    self.editor.isModified = function() {return false;};
                    self.view = atom.views.getView(ed);
                    self.setupREPL();
                });
        } else {
            self.setupREPL();
        }
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
    }
}
