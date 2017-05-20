# atom-repl

This is a very general and basic implementation of REPLS, or just script execution in the case of PHP, for the Atom Editor.

You can send the entire buffer, a selection, or multiple lines to the program in question. `alt-8` sends lines, `alt-9` sends selections and `alt-0` sends the entire buffer.

For code like PHP, when sending lines or selections, `<?php` is automatically prepended for you. Since PHP has no concept of a REPL, the code is written to a temporary file, and then executed. Sending lines and selections WILL NOT WORK LIKE A TRUE REPL for PHP!

### Currently supported

* PHP
* Lua (like ULua)

### Soon to be supported

* Lisp (such as CLISP)
* Python

And so on.

![A screenshot of your package](https://f.cloud.github.com/assets/69169/2290250/c35d867a-a017-11e3-86be-cd7c5bf3ff9b.gif)
